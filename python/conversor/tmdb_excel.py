
import os
import time
from pathlib import Path

import requests
import pandas as pd


# CONFIGURACOES

TOKEN = os.getenv("TMDB_TOKEN")
BASE_URL = "https://api.themoviedb.org/3"
IDIOMA = "pt-BR"
REGIAO = "BR"

# 500 e o limite maximo de paginas do TMDB.
# Cada pagina normalmente retorna ate 20 titulos.
LIMITE_PAGINAS = 500

PASTA = Path(__file__).resolve().parent
ARQUIVO_SAIDA = PASTA / "flixview_catalogo_completo.xlsx"

sessao = requests.Session()
sessao.headers.update({
    "Authorization": f"Bearer {TOKEN}",
    "accept": "application/json"
})


def consultar(endpoint, parametros=None):
    """Faz uma requisicao e retorna o JSON."""
    resposta = sessao.get(
        f"{BASE_URL}{endpoint}",
        params=parametros,
        timeout=40
    )
    resposta.raise_for_status()
    return resposta.json()


def buscar_provedor(tipo):
    """Localiza o ID da Netflix na regiao consultada."""
    dados = consultar(
        f"/watch/providers/{tipo}",
        {
            "watch_region": REGIAO,
            "language": IDIOMA
        }
    )

    for provedor in dados.get("results", []):
        nome = provedor.get("provider_name", "").lower()

        if nome == "netflix":
            print(
                f"Netflix encontrada para {tipo}: "
                f"ID {provedor['provider_id']}"
            )
            return provedor["provider_id"]

    raise ValueError(
        f"Netflix nao encontrada para o tipo {tipo}."
    )


def buscar_generos(tipo):
    """Converte os IDs de genero em nomes."""
    dados = consultar(
        f"/genre/{tipo}/list",
        {"language": IDIOMA}
    )

    return {
        genero["id"]: genero["name"]
        for genero in dados.get("genres", [])
    }


def nomes_generos(ids, mapa):
    return ", ".join(
        mapa.get(genero_id, str(genero_id))
        for genero_id in ids
    )


def url_imagem(caminho, tamanho="w500"):
    if not caminho:
        return None

    return f"https://image.tmdb.org/t/p/{tamanho}{caminho}"


def buscar_catalogo(tipo, id_provedor):
    """Busca todas as paginas de filmes ou series."""
    endpoint = "/discover/movie" if tipo == "movie" else "/discover/tv"

    titulos = []
    pagina = 1
    total_paginas = 1

    while pagina <= total_paginas and pagina <= LIMITE_PAGINAS:
        parametros = {
            "language": IDIOMA,
            "watch_region": REGIAO,
            "with_watch_providers": id_provedor,
            "with_watch_monetization_types": "flatrate",
            "sort_by": "popularity.desc",
            "page": pagina
        }

        dados = consultar(endpoint, parametros)

        total_paginas = min(
            dados.get("total_pages", 0),
            LIMITE_PAGINAS
        )

        titulos.extend(dados.get("results", []))

        print(
            f"{tipo}: pagina {pagina}/{total_paginas} "
            f"- {len(titulos)} titulos encontrados"
        )

        pagina += 1
        time.sleep(0.15)

    return titulos, total_paginas


def buscar_detalhes(tipo, id_titulo):
    """Busca detalhes, creditos, videos e palavras-chave."""
    anexos = (
        "credits,videos,keywords,release_dates"
        if tipo == "movie"
        else "credits,videos,keywords,content_ratings"
    )

    return consultar(
        f"/{tipo}/{id_titulo}",
        {
            "language": IDIOMA,
            "append_to_response": anexos
        }
    )


def extrair_titulo(tipo, item, detalhe, mapa_generos):
    """Monta uma linha de dados para o Excel."""

    if tipo == "movie":
        titulo = detalhe.get("title")
        titulo_original = detalhe.get("original_title")
        data_lancamento = detalhe.get("release_date")
        duracao = detalhe.get("runtime")
        criacao = None
        temporadas = None
        episodios = None
        situacao = detalhe.get("status")
        paises = detalhe.get("production_countries", [])
        idiomas = detalhe.get("spoken_languages", [])
        palavras = detalhe.get("keywords", {}).get("keywords", [])
    else:
        titulo = detalhe.get("name")
        titulo_original = detalhe.get("original_name")
        data_lancamento = detalhe.get("first_air_date")
        duracao = ", ".join(
            str(valor)
            for valor in detalhe.get("episode_run_time", [])
        )
        criacao = ", ".join(
            pessoa.get("name", "")
            for pessoa in detalhe.get("created_by", [])
        )
        temporadas = detalhe.get("number_of_seasons")
        episodios = detalhe.get("number_of_episodes")
        situacao = detalhe.get("status")
        paises = detalhe.get("production_countries", [])
        idiomas = detalhe.get("spoken_languages", [])
        palavras = detalhe.get("keywords", {}).get("results", [])

    creditos = detalhe.get("credits", {})
    elenco = creditos.get("cast", [])
    equipe = creditos.get("crew", [])

    diretores = [
        pessoa.get("name", "")
        for pessoa in equipe
        if pessoa.get("job") == "Director"
    ]

    roteiristas = [
        pessoa.get("name", "")
        for pessoa in equipe
        if pessoa.get("job") in (
            "Writer", "Screenplay", "Teleplay"
        )
    ]

    videos = detalhe.get("videos", {}).get("results", [])

    trailers = [
        f"https://www.youtube.com/watch?v={video['key']}"
        for video in videos
        if video.get("site") == "YouTube"
        and video.get("type") == "Trailer"
    ]

    classificacao = None

    if tipo == "movie":
        for resultado in detalhe.get("release_dates", {}).get("results", []):
            if resultado.get("iso_3166_1") == REGIAO:
                classificacoes = resultado.get("release_dates", [])
                classificacao = next(
                    (
                        item.get("certification")
                        for item in classificacoes
                        if item.get("certification")
                    ),
                    None
                )
                if classificacao:
                    break
    else:
        for resultado in detalhe.get("content_ratings", {}).get("results", []):
            if resultado.get("iso_3166_1") == REGIAO:
                classificacao = resultado.get("rating")
                break

    linha = {
        "ID TMDB": detalhe.get("id"),
        "Tipo": "Filme" if tipo == "movie" else "Serie",
        "Titulo": titulo,
        "Titulo original": titulo_original,
        "Sinopse": detalhe.get("overview"),
        "Data de lancamento": data_lancamento,
        "Situacao": situacao,
        "Nota TMDB": detalhe.get("vote_average"),
        "Quantidade de votos": detalhe.get("vote_count"),
        "Popularidade": detalhe.get("popularity"),
        "Generos": nomes_generos(
            [g["id"] for g in detalhe.get("genres", [])],
            mapa_generos
        ),
        "Idioma original": detalhe.get("original_language"),
        "Idiomas disponiveis": ", ".join(
            idioma.get("english_name", "")
            for idioma in idiomas
        ),
        "Paises de producao": ", ".join(
            pais.get("name", "")
            for pais in paises
        ),
        "Classificacao indicativa": classificacao,
        "Duracao filme ou episodios (min)": duracao,
        "Quantidade de temporadas": temporadas,
        "Quantidade de episodios": episodios,
        "Criadores": criacao,
        "Diretores": ", ".join(dict.fromkeys(diretores)),
        "Roteiristas": ", ".join(dict.fromkeys(roteiristas)),
        "Elenco principal": ", ".join(
            pessoa.get("name", "")
            for pessoa in elenco[:10]
        ),
        "Palavras-chave": ", ".join(
            palavra.get("name", "")
            for palavra in palavras
        ),
        "Orcamento": detalhe.get("budget") if tipo == "movie" else None,
        "Receita": detalhe.get("revenue") if tipo == "movie" else None,
        "Temporada mais recente": (
            detalhe.get("last_episode_to_air", {}).get("air_date")
            if tipo == "tv" and detalhe.get("last_episode_to_air")
            else None
        ),
        "URL do poster": url_imagem(detalhe.get("poster_path")),
        "URL da imagem de fundo": url_imagem(
            detalhe.get("backdrop_path"), "original"
        ),
        "Trailers": ", ".join(dict.fromkeys(trailers)),
        "Provedor consultado": "Netflix",
        "Regiao consultada": REGIAO
    }

    pessoas = []

    for pessoa in elenco:
        pessoas.append({
            "ID TMDB do titulo": detalhe.get("id"),
            "Tipo de titulo": tipo,
            "Nome": pessoa.get("name"),
            "Funcao": "Elenco",
            "Personagem": pessoa.get("character"),
            "Departamento": "Atuacao",
            "Ordem": pessoa.get("order"),
            "ID da pessoa": pessoa.get("id")
        })

    for pessoa in equipe:
        pessoas.append({
            "ID TMDB do titulo": detalhe.get("id"),
            "Tipo de titulo": tipo,
            "Nome": pessoa.get("name"),
            "Funcao": pessoa.get("job"),
            "Personagem": None,
            "Departamento": pessoa.get("department"),
            "Ordem": None,
            "ID da pessoa": pessoa.get("id")
        })

    chaves = []

    for palavra in palavras:
        chaves.append({
            "ID TMDB do titulo": detalhe.get("id"),
            "Tipo de titulo": tipo,
            "ID da palavra-chave": palavra.get("id"),
            "Palavra-chave": palavra.get("name")
        })

    return linha, pessoas, chaves


def processar_titulos(tipo, itens, mapa_generos):
    linhas = []
    pessoas = []
    palavras = []
    erros = []

    total = len(itens)

    for indice, item in enumerate(itens, start=1):
        id_titulo = item.get("id")

        try:
            detalhe = buscar_detalhes(tipo, id_titulo)

            linha, elenco_equipe, chaves = extrair_titulo(
                tipo, item, detalhe, mapa_generos
            )

            linhas.append(linha)
            pessoas.extend(elenco_equipe)
            palavras.extend(chaves)

        except (requests.exceptions.RequestException, ValueError, KeyError) as erro:
            erros.append({
                "Tipo": tipo,
                "ID TMDB": id_titulo,
                "Titulo": item.get("title") or item.get("name"),
                "Erro": str(erro)
            })

        if indice % 25 == 0 or indice == total:
            print(f"Detalhes {tipo}: {indice}/{total}")

        # Evita disparar requisicoes sem pausa.
        time.sleep(0.15)

    return linhas, pessoas, palavras, erros


def salvar_excel(filmes, series, pessoas, palavras, erros, metadados):
    with pd.ExcelWriter(
        ARQUIVO_SAIDA,
        engine="openpyxl"
    ) as escritor:

        abas = {
            "Filmes": filmes,
            "Series": series,
            "Elenco e equipe": pessoas,
            "Palavras-chave": palavras,
            "Erros": erros,
            "Informacoes": metadados
        }

        for nome_aba, dados in abas.items():
            pd.DataFrame(dados).to_excel(
                escritor,
                sheet_name=nome_aba,
                index=False
            )

    print(f"\nExportacao concluida: {ARQUIVO_SAIDA}")
    print(f"Filmes: {len(filmes)}")
    print(f"Series: {len(series)}")
    print(f"Registros de elenco/equipe: {len(pessoas)}")
    print(f"Palavras-chave: {len(palavras)}")
    print(f"Erros registrados: {len(erros)}")


def main():
    if not TOKEN:
        raise ValueError(
            "Configure a variavel de ambiente TMDB_TOKEN."
        )

    # Primeiro, obtem os generos para filmes e series.
    generos_filmes = buscar_generos("movie")
    generos_series = buscar_generos("tv")

    # Identifica a Netflix nos provedores de cada categoria.
    id_netflix_filmes = buscar_provedor("movie")
    id_netflix_series = buscar_provedor("tv")

    # Busca os catalogos.
    itens_filmes, paginas_filmes = buscar_catalogo(
        "movie", id_netflix_filmes
    )
    itens_series, paginas_series = buscar_catalogo(
        "tv", id_netflix_series
    )

    # Busca detalhes e creditos de cada titulo.
    filmes, pessoas_filmes, palavras_filmes, erros_filmes = (
        processar_titulos("movie", itens_filmes, generos_filmes)
    )

    series, pessoas_series, palavras_series, erros_series = (
        processar_titulos("tv", itens_series, generos_series)
    )

    todos_os_erros = erros_filmes + erros_series

    metadados = [
        {"Informacao": "Provedor", "Valor": "Netflix"},
        {"Informacao": "Regiao", "Valor": REGIAO},
        {"Informacao": "Idioma das consultas", "Valor": IDIOMA},
        {"Informacao": "Data da coleta", "Valor": pd.Timestamp.now().isoformat()},
        {"Informacao": "Paginas de filmes", "Valor": paginas_filmes},
        {"Informacao": "Paginas de series", "Valor": paginas_series},
        {"Informacao": "Filmes encontrados", "Valor": len(itens_filmes)},
        {"Informacao": "Series encontradas", "Valor": len(itens_series)},
        {"Informacao": "Fonte", "Valor": "TMDB API"},
        {"Informacao": "Disponibilidade", "Valor": "Assinatura (flatrate)"},
        {"Informacao": "Limite de paginas", "Valor": LIMITE_PAGINAS}
    ]

    salvar_excel(
        filmes,
        series,
        pessoas_filmes + pessoas_series,
        palavras_filmes + palavras_series,
        todos_os_erros,
        metadados
    )


if __name__ == "__main__":
    try:
        main()
    except requests.exceptions.RequestException as erro:
        print(f"Erro de comunicacao com o TMDB: {erro}")
    except (ValueError, OSError) as erro:
        print(f"Erro: {erro}")
