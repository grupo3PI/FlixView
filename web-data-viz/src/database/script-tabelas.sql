CREATE DATABASE flixview;

USE flixview;

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    email VARCHAR(150),
    senha VARCHAR(50),
    tipoUsuario TINYINT,
    logCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE titulo (
    idTitulo INT PRIMARY KEY AUTO_INCREMENT,
    idTMDB VARCHAR(200),
    title VARCHAR(200),
    original_title VARCHAR(200),
    original_language VARCHAR(200),
    overview VARCHAR(300),
    popularity INT,
    poster_path VARCHAR(300),
    release_date DATE,
    vote_average DECIMAL(3,1),
    vote_count INT
);

CREATE TABLE genero (
    idGenero INT PRIMARY KEY,
    nome VARCHAR(100)
);

CREATE TABLE review (
    idReview INT PRIMARY KEY AUTO_INCREMENT,
    descricao VARCHAR(600),
    nota VARCHAR(45),
    logReview TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fkUsuario INT,
    fkTitulo INT,

    CONSTRAINT fk_review_usuario
        FOREIGN KEY (fkUsuario)
        REFERENCES usuario(idUsuario),

    CONSTRAINT fk_review_titulo
        FOREIGN KEY (fkTitulo)
        REFERENCES titulo(idTitulo)
);

CREATE TABLE titulo_genero (
    fkTitulo INT,
    fkGenero INT,

    PRIMARY KEY (fkTitulo, fkGenero),

    CONSTRAINT fk_titulo_genero_titulo
        FOREIGN KEY (fkTitulo)
        REFERENCES titulo(idTitulo),

    CONSTRAINT fk_titulo_genero_genero
        FOREIGN KEY (fkGenero)
        REFERENCES genero(idGenero)
);