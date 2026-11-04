var catalogoModel = require("../models/catalogoModel");

function listar(req, res) {

    var busca = req.query.busca;
    var genero = req.query.genero;
    var ano = req.query.ano;
    var popularidade = req.query.popularidade;
    var avaliacao = req.query.avaliacao;

    catalogoModel.listar(
        busca,
        genero,
        ano,
        popularidade,
        avaliacao
    )
    .then(function (resultado) {
        res.status(200).json(resultado[0]);
    })
    .catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro);
    });
}

function listarGeneros(req, res) {

    catalogoModel.listarGeneros()
        .then(function (resultado) {
            res.status(200).json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

function listarAnos(req, res) {

    catalogoModel.listarAnos()
        .then(function (resultado) {
            res.status(200).json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    listar,
    listarGeneros,
    listarAnos
};
