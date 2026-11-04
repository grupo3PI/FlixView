var API_URL = "/catalogos";

function carregarGeneros() {

    fetch(API_URL + "/generos")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (generos) {

            var select = document.getElementById("select_genero");

            for (var i = 0; i < generos.length; i++) {

                var opcao = document.createElement("option");

                opcao.value = generos[i].nome;
                opcao.textContent = generos[i].nome;

                select.appendChild(opcao);
            }
        })
        .catch(function (erro) {
            console.log("Erro ao carregar gêneros:", erro);
        });
}

function carregarAnos() {

    fetch(API_URL + "/anos")
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (anos) {

            var select = document.getElementById("select_ano");

            for (var i = 0; i < anos.length; i++) {

                var opcao = document.createElement("option");

                opcao.value = anos[i].ano;
                opcao.textContent = anos[i].ano;

                select.appendChild(opcao);
            }
        })
        .catch(function (erro) {
            console.log("Erro ao carregar anos:", erro);
        });
}

function filtrarCatalogo() {

    var busca = document.getElementById("input_busca").value;
    var genero = document.getElementById("select_genero").value;
    var ano = document.getElementById("select_ano").value;
    var popularidade = document.getElementById("select_popularidade").value;
    var avaliacao = document.getElementById("select_avaliacao").value;

    var parametros = new URLSearchParams();

    parametros.append("busca", busca);
    parametros.append("genero", genero);
    parametros.append("ano", ano);
    parametros.append("popularidade", popularidade);
    parametros.append("avaliacao", avaliacao);

    fetch(API_URL + "?" + parametros.toString())
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Erro ao buscar títulos");
            }

            return resposta.json();
        })
        .then(function (titulos) {
            mostrarResultado(titulos);
        })
        .catch(function (erro) {
            console.log("Erro ao carregar catálogo:", erro);
        });
}

function mostrarResultado(lista) {

    var grid = document.getElementById("grid");
    var vazio = document.getElementById("vazio");
    var contador = document.getElementById("contador");

    if (lista.length === 0) {

        grid.style.display = "none";
        vazio.style.display = "block";
        contador.innerHTML = "";

        return;
    }

    grid.style.display = "grid";
    vazio.style.display = "none";

    contador.textContent = lista.length + " títulos encontrados:";

    var html = "";

    for (var i = 0; i < lista.length; i++) {
        html += cardHtml(lista[i]);
    }

    grid.innerHTML = html;
}

function cardHtml(item) {

    var poster = "";

    if (item.poster_path) {

        if (item.poster_path.indexOf("http") === 0) {
            poster = item.poster_path;
        } 
        else if (item.poster_path.indexOf("/") === 0) {
            poster = "https://image.tmdb.org/t/p/w500" + item.poster_path;
        } 
        else {
            poster = item.poster_path;
        }
    }

    var miolo = "";

    if (poster === "") {

        miolo = `
            <div class="poster-placeholder">
                <span>Imagem indisponível</span>
            </div>
        `;

    } else {

        miolo = `
            <img src="${escapeHtml(poster)}"
                 alt="${escapeHtml(item.title || "Título")}">
        `;
    }

    return `
        <a class="card" href="detalhes.html?id=${encodeURIComponent(item.idTitulo)}">

            <div class="poster">

                ${miolo}

                <div class="card-title">
                    ${escapeHtml(item.title || "Sem título")}
                </div>

            </div>

        </a>
    `;
}

function escapeHtml(valor) {

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


document.getElementById("input_busca")
    .addEventListener("input", filtrarCatalogo);

document.getElementById("select_genero")
    .addEventListener("change", filtrarCatalogo);

document.getElementById("select_ano")
    .addEventListener("change", filtrarCatalogo);

document.getElementById("select_popularidade")
    .addEventListener("change", filtrarCatalogo);

document.getElementById("select_avaliacao")
    .addEventListener("change", filtrarCatalogo);

carregarGeneros();
carregarAnos();
filtrarCatalogo();
