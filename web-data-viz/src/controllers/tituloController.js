var tituloModel = require("../models/tituloModel");

async function sincronizar(req, res) {
    var pagina = req.body.page === undefined ? 1 : Number(req.body.page);
    if (!Number.isInteger(pagina) || pagina < 1) {
        res.status(400).json({ erro: "O campo page deve ser um inteiro positivo." });
        return;
    }

    try {
        var resultado = await tituloModel.sincronizarPopulares(pagina);
        res.json(resultado);
    } catch (erro) {
        console.error("Falha ao sincronizar títulos da TMDB:", erro);
        var status = erro.statusCode || (erro.message.indexOf("Configure ") === 0 ? 503 : 500);
        res.status(status).json({ erro: erro.message });
    }
}

module.exports = {
    sincronizar
};
