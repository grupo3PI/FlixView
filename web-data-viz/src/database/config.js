var mysql = require("mysql2/promise");

var mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

var pool = mysql.createPool(mySqlConfig);

function validarConfiguracao() {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        throw new Error("AMBIENTE_PROCESSO deve ser 'desenvolvimento' ou 'producao' no .env.");
    }

    var variaveisObrigatorias = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_PORT", "DB_DATABASE"];
    var ausentes = variaveisObrigatorias.filter(function (nome) {
        var valor = process.env[nome];
        return !valor || /seusDadosAqui|placeholder|<.*>/i.test(valor);
    });

    if (ausentes.length > 0) {
        throw new Error("Configure no .env as variáveis MySQL: " + ausentes.join(", ") + ".");
    }

    if (process.env.DB_DATABASE !== "flixview") {
        throw new Error("DB_DATABASE deve apontar para o banco existente 'flixview'.");
    }
}

async function executar(instrucao, parametros) {
    validarConfiguracao();
    var resultado = await pool.execute(instrucao, parametros || []);
    return resultado[0];
}

function obterConexao() {
    validarConfiguracao();
    return pool.getConnection();
}

module.exports = {
    executar,
    obterConexao
};