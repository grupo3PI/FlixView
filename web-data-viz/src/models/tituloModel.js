var https = require("https");
var database = require("../database/config");

var TMDB_API_BASE_URL = "https://api.themoviedb.org";

function requisitarTMDB(caminho, parametros) {
    var token = process.env.TMDB_API_READ_ACCESS_TOKEN;
    if (!token || /placeholder|<.*>/i.test(token)) {
        return Promise.reject(new Error("Configure TMDB_API_READ_ACCESS_TOKEN no .env com o Bearer token da TMDB."));
    }

    var url = new URL(caminho, TMDB_API_BASE_URL);
    Object.keys(parametros).forEach(function (chave) {
        url.searchParams.set(chave, parametros[chave]);
    });

    return new Promise(function (resolve, reject) {
        var requisicao = https.get(url, {
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json"
            }
        }, function (resposta) {
            var corpo = "";
            resposta.setEncoding("utf8");
            resposta.on("data", function (trecho) {
                corpo += trecho;
            });
            resposta.on("end", function () {
                if (resposta.statusCode < 200 || resposta.statusCode >= 300) {
                    var erroHTTP = new Error("TMDB respondeu com HTTP " + resposta.statusCode + ".");
                    erroHTTP.statusCode = resposta.statusCode;
                    reject(erroHTTP);
                    return;
                }

                try {
                    resolve(JSON.parse(corpo));
                } catch (erro) {
                    reject(new Error("TMDB retornou uma resposta JSON inválida."));
                }
            });
        });

        requisicao.setTimeout(15000, function () {
            requisicao.destroy(new Error("Tempo limite excedido ao consultar a TMDB."));
        });
        requisicao.on("error", reject);
    });
}

function validarData(data) {
    if (typeof data !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return null;
    }

    var dataConvertida = new Date(data + "T00:00:00Z");
    return !isNaN(dataConvertida.getTime()) && dataConvertida.toISOString().slice(0, 10) === data
        ? data
        : null;
}

function validarTitulo(titulo) {
    if (!titulo || !Number.isInteger(titulo.id) || typeof titulo.title !== "string" ||
        typeof titulo.original_title !== "string" || typeof titulo.original_language !== "string" ||
        !Array.isArray(titulo.genre_ids)) {
        throw new Error("A TMDB retornou um título em formato incompatível com o schema existente.");
    }
}

function sincronizarGenero(conexao, genero) {
    return conexao.execute(
        "INSERT INTO genero (idGenero, nome) VALUES (?, ?) " +
        "ON DUPLICATE KEY UPDATE nome = VALUES(nome)",
        [genero.id, genero.name]
    );
}

async function salvarTitulo(conexao, titulo, idsGenerosDisponiveis) {
    validarTitulo(titulo);

    var idGeneros = Array.from(new Set(titulo.genre_ids));
    idGeneros.forEach(function (idGenero) {
        if (!idsGenerosDisponiveis.has(idGenero)) {
            throw new Error("A TMDB retornou um gênero sem correspondência na lista oficial.");
        }
    });

    var valores = [
        titulo.title.slice(0, 200),
        titulo.original_title.slice(0, 200),
        titulo.original_language.slice(0, 200),
        typeof titulo.overview === "string" ? titulo.overview.slice(0, 300) : "",
        Number.isFinite(Number(titulo.popularity)) ? Math.round(Number(titulo.popularity)) : 0,
        typeof titulo.poster_path === "string" ? titulo.poster_path.slice(0, 300) : null,
        validarData(titulo.release_date),
        Number.isFinite(Number(titulo.vote_average)) ? Number(titulo.vote_average).toFixed(1) : 0,
        Number.isInteger(titulo.vote_count) ? titulo.vote_count : 0
    ];

    var encontrados = await conexao.execute(
        "SELECT idTitulo FROM titulo WHERE idTMDB = ? ORDER BY idTitulo LIMIT 1 FOR UPDATE",
        [String(titulo.id)]
    );
    var idTitulo;

    if (encontrados[0].length > 0) {
        idTitulo = encontrados[0][0].idTitulo;
        await conexao.execute(
            "UPDATE titulo SET title = ?, original_title = ?, original_language = ?, overview = ?, " +
            "popularity = ?, poster_path = ?, release_date = ?, vote_average = ?, vote_count = ? " +
            "WHERE idTitulo = ?",
            valores.concat([idTitulo])
        );
    } else {
        var insercao = await conexao.execute(
            "INSERT INTO titulo " +
            "(idTMDB, title, original_title, original_language, overview, popularity, poster_path, " +
            "release_date, vote_average, vote_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [String(titulo.id)].concat(valores)
        );
        idTitulo = insercao[0].insertId;
    }

    await conexao.execute("DELETE FROM titulo_genero WHERE fkTitulo = ?", [idTitulo]);
    for (var i = 0; i < idGeneros.length; i += 1) {
        await conexao.execute(
            "INSERT INTO titulo_genero (fkTitulo, fkGenero) VALUES (?, ?) " +
            "ON DUPLICATE KEY UPDATE fkGenero = VALUES(fkGenero)",
            [idTitulo, idGeneros[i]]
        );
    }
}

async function sincronizarPopulares(pagina) {
    var parametros = { language: "pt-BR" };
    var respostas = await Promise.all([
        requisitarTMDB("/3/genre/movie/list", parametros),
        requisitarTMDB("/3/movie/popular", Object.assign({}, parametros, { page: pagina }))
    ]);
    var generos = respostas[0].genres;
    var titulos = respostas[1].results;

    if (!Array.isArray(generos) || !Array.isArray(titulos)) {
        throw new Error("A TMDB retornou uma resposta sem a lista de gêneros ou títulos esperada.");
    }

    var conexao = await database.obterConexao();
    var bloqueioAdquirido = false;
    var transacaoIniciada = false;

    try {
        var bloqueios = await conexao.execute("SELECT GET_LOCK(?, ?) AS adquirido", ["flixview.tmdb.sync", 10]);
        bloqueioAdquirido = bloqueios[0][0].adquirido === 1;
        if (!bloqueioAdquirido) {
            throw new Error("Não foi possível obter o bloqueio para sincronizar títulos sem duplicações.");
        }

        await conexao.beginTransaction();
        transacaoIniciada = true;
        for (var j = 0; j < generos.length; j += 1) {
            if (!Number.isInteger(generos[j].id) || typeof generos[j].name !== "string") {
                throw new Error("A TMDB retornou um gênero em formato incompatível.");
            }
            await sincronizarGenero(conexao, generos[j]);
        }

        var idsGenerosDisponiveis = new Set(generos.map(function (genero) {
            return genero.id;
        }));

        for (var k = 0; k < titulos.length; k += 1) {
            await salvarTitulo(conexao, titulos[k], idsGenerosDisponiveis);
        }

        await conexao.commit();
        return { pagina: pagina, titulosProcessados: titulos.length, generosSincronizados: generos.length };
    } catch (erro) {
        if (transacaoIniciada) {
            await conexao.rollback();
        }
        throw erro;
    } finally {
        try {
            if (bloqueioAdquirido) {
                await conexao.execute("SELECT RELEASE_LOCK(?)", ["flixview.tmdb.sync"]);
            }
        } finally {
            conexao.release();
        }
    }
}

module.exports = {
    sincronizarPopulares
};
