var database = require("../database/config");

function listar(busca, genero, ano, popularidade, avaliacao) {

    var instrucaoSql = `
        SELECT
            t.idTitulo,
            t.title,
            t.original_title,
            t.overview,
            t.popularity,
            t.poster_path,
            t.release_date,
            t.vote_average,
            t.vote_count,
            GROUP_CONCAT(g.nome SEPARATOR ', ') AS generos

        FROM titulo t

        LEFT JOIN titulo_genero tg
            ON t.idTitulo = tg.fkTitulo

        LEFT JOIN genero g
            ON tg.fkGenero = g.idGenero

        WHERE 1 = 1
    `;

    var parametros = [];

    if (busca) {
        instrucaoSql += `
            AND (
                t.title LIKE ?
                OR t.original_title LIKE ?
            )
        `;

        parametros.push("%" + busca + "%");
        parametros.push("%" + busca + "%");
    }

    if (genero) {
        instrucaoSql += `
            AND EXISTS (
                SELECT 1
                FROM titulo_genero tg2
                INNER JOIN genero g2
                    ON tg2.fkGenero = g2.idGenero
                WHERE tg2.fkTitulo = t.idTitulo
                AND g2.nome = ?
            )
        `;

        parametros.push(genero);
    }

    if (ano) {
        instrucaoSql += `
            AND YEAR(t.release_date) = ?
        `;

        parametros.push(ano);
    }

    if (avaliacao) {
        instrucaoSql += `
            AND t.vote_average >= ?
        `;

        parametros.push(avaliacao);
    }

    instrucaoSql += `
        GROUP BY t.idTitulo
    `;

    // Ordenação definida pelas opções disponíveis
    if (popularidade === "alta") {
        instrucaoSql += ` ORDER BY t.popularity DESC`;
    } 
    else if (popularidade === "votados") {
        instrucaoSql += ` ORDER BY t.vote_count DESC`;
    } 
    else {
        instrucaoSql += ` ORDER BY t.title ASC`;
    }

    return database.execute(instrucaoSql, parametros);
}

function listarGeneros() {

    var instrucaoSql = `
        SELECT DISTINCT g.idGenero, g.nome
        FROM genero g
        INNER JOIN titulo_genero tg
            ON g.idGenero = tg.fkGenero
        ORDER BY g.nome ASC;
    `;

    return database.execute(instrucaoSql);
}

function listarAnos() {

    var instrucaoSql = `
        SELECT DISTINCT YEAR(release_date) AS ano
        FROM titulo
        WHERE release_date IS NOT NULL
        ORDER BY ano DESC;
    `;

    return database.execute(instrucaoSql);
}

module.exports = {
    listar,
    listarGeneros,
    listarAnos
};
