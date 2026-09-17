CREATE DATABASE IF NOT EXISTS FlixView;

USE FlixView;

CREATE TABLE usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nomeUsuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tpUsuario BOOLEAN NOT NULL,
    dtCadastro DATETIME NOT NULL
);


CREATE TABLE titulo (
    idTitulo INT AUTO_INCREMENT PRIMARY KEY,
    idShow VARCHAR(10) NOT NULL UNIQUE,
    idTMDB INT NOT NULL UNIQUE,
    tipo VARCHAR(20) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    diretor VARCHAR(255),
    elenco VARCHAR(255),
    anoLancamento INT,
    classificacao VARCHAR(20),
    duracao VARCHAR(30),
    descricao VARCHAR(255),
    poster VARCHAR(255),
    notaTMDB DECIMAL(3,1),
    qtdVotosTMDB INT,
    popularidadeTMDB DECIMAL(10,3)
);

CREATE TABLE genero (
    idGenero INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE titulo_genero (
    idTitulo INT,
    idGenero INT,
    PRIMARY KEY (idTitulo, idGenero),
    FOREIGN KEY (idTitulo) REFERENCES titulo(idTitulo),
    FOREIGN KEY (idGenero) REFERENCES genero(idGenero)
);

CREATE TABLE avaliacao (
    idAvaliacao INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    idTitulo INT NOT NULL,
    nota DECIMAL(3,1) NOT NULL,
    comentario VARCHAR(255),
    dtAvaliacao DATETIME NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
    FOREIGN KEY (idTitulo) REFERENCES titulo(idTitulo)
);


CREATE TABLE preferencia_usuario (
    idPreferencia INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    genero VARCHAR(255),
    tituloPreferido VARCHAR(50),
    tpConteudo VARCHAR(20),
    periodoLancamento VARCHAR(30),
    dtAtualizacao DATETIME NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);