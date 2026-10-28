var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var dados = req.body || {};
    var email = typeof dados.emailServer === "string" ? dados.emailServer.trim() : "";
    var senha = typeof dados.senhaServer === "string" ? dados.senhaServer : "";

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    usuarioModel.autenticar(email, senha)
        .then(function (usuarios) {
            if (usuarios.length === 0) {
                return res.status(401).json({ erro: "Email ou senha incorretos." });
            }

            res.status(200).json({
                idUsuario: usuarios[0].idUsuario,
                nome: usuarios[0].nome,
                email: usuarios[0].email,
                cargo: usuarios[0].cargo,
                tipoUsuario: usuarios[0].tipoUsuario
            });
        })
        .catch(function (erro) {
            console.error("Houve um erro ao autenticar o usuário:", erro);
            res.status(500).json({ erro: "Não foi possível verificar o login no banco de dados." });
        });

}

function cadastrar(req, res) {
    var dados = req.body || {};
    var nome = typeof dados.nomeServer === "string" ? dados.nomeServer.trim() : "";
    var email = typeof dados.emailServer === "string" ? dados.emailServer.trim() : "";
    var senha = typeof dados.senhaServer === "string" ? dados.senhaServer : "";

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    if (nome.length > 100 || email.length > 150 || senha.length > 50) {
        return res.status(400).json({ erro: "Um ou mais campos excedem o tamanho permitido." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ erro: "Informe um email válido." });
    }

    usuarioModel.cadastrar(nome, email, senha)
        .then(function (resultado) {
            res.status(201).json({
                idUsuario: resultado.insertId,
                mensagem: "Cadastro realizado com sucesso."
            });
        })
        .catch(function (erro) {
            console.error("Houve um erro ao realizar o cadastro:", erro);
            res.status(500).json({ erro: "Não foi possível salvar o cadastro no banco de dados." });
        });
}

module.exports = {
    autenticar,
    cadastrar
}