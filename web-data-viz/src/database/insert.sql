USE FlixView;

INSERT INTO usuario
(nome, nomeUsuario, email, senha, tpUsuario, dtCadastro)
VALUES
('Gustavo Souza', 'gustavo', 'gustavo@email.com', '123456', 0, '2026-09-17 10:00:00'),
('João Silva', 'joaosilva', 'joao@email.com', '123456', 0, '2026-09-17 10:15:00'),
('Maria Oliveira', 'mariaoliveira', 'maria@email.com', '123456', 0, '2026-09-17 10:30:00'),
('Administrador', 'admin', 'admin@flixview.com', 'admin123', 1, '2026-09-17 11:00:00');

INSERT INTO genero
(nome)
VALUES
('Ação'),
('Comédia'),
('Drama'),
('Terror'),
('Ficção Científica'),
('Romance'),
('Animação'),
('Documentário');

INSERT INTO titulo
(idShow, idTMDB, tipo, titulo, diretor, elenco, anoLancamento,
 classificacao, duracao, descricao, poster, notaTMDB,
 qtdVotosTMDB, popularidadeTMDB)
VALUES
(
    's001',
    1399,
    'Série',
    'Stranger Things',
    'The Duffer Brothers',
    'Millie Bobby Brown, Finn Wolfhard, Winona Ryder',
    2016,
    '16 anos',
    '4 temporadas',
    'Um grupo de amigos enfrenta acontecimentos sobrenaturais em uma pequena cidade.',
    'stranger-things.jpg',
    8.6,
    18000,
    145.320
),
(
    's002',
    603,
    'Filme',
    'Matrix',
    'Lana Wachowski, Lilly Wachowski',
    'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
    1999,
    '14 anos',
    '136 minutos',
    'Um programador descobre que a realidade que conhece pode não ser verdadeira.',
    'matrix.jpg',
    8.2,
    25000,
    120.450
),
(
    's003',
    27205,
    'Filme',
    'A Origem',
    'Christopher Nolan',
    'Leonardo DiCaprio, Joseph Gordon-Levitt, Tom Hardy',
    2010,
    '14 anos',
    '148 minutos',
    'Um especialista invade sonhos para roubar informações.',
    'a-origem.jpg',
    8.4,
    30000,
    110.780
),
(
    's004',
    496243,
    'Filme',
    'Parasita',
    'Bong Joon Ho',
    'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong',
    2019,
    '16 anos',
    '132 minutos',
    'Uma família de baixa renda se aproxima de uma família rica.',
    'parasita.jpg',
    8.5,
    22000,
    98.250
);

INSERT INTO titulo_genero
(idTitulo, idGenero)
VALUES
(1, 4),
(1, 5),
(1, 3),
(2, 1),
(2, 5),
(3, 1),
(3, 5),
(3, 3),
(4, 3);

INSERT INTO avaliacao
(idUsuario, idTitulo, nota, comentario, dtAvaliacao)
VALUES
(1, 1, 9.0, 'Muito boa, principalmente pelas cenas de suspense.', '2026-09-17 12:00:00'),
(1, 2, 10.0, 'Um clássico da ficção científica.', '2026-09-17 12:10:00'),
(2, 1, 8.5, 'Gostei bastante da série.', '2026-09-17 12:30:00'),
(2, 3, 9.5, 'História muito criativa e bem desenvolvida.', '2026-09-17 12:45:00'),
(3, 4, 9.0, 'Filme excelente e com uma história diferente.', '2026-09-17 13:00:00'),
(3, 2, 8.0, 'Gostei bastante dos efeitos e da história.', '2026-09-17 13:15:00');

INSERT INTO preferencia_usuario
(idUsuario, idGenero, tituloPreferido, tpConteudo, periodoLancamento, dtAtualizacao)
VALUES
(1, 1, 'Matrix', 'Filme', '1990-2010', '2026-09-17 14:00:00'),
(2, 5, 'Stranger Things', 'Série', '2010-2020', '2026-09-17 14:10:00'),
(3, 3, 'Parasita', 'Filme', '2010-2020', '2026-09-17 14:20:00');
