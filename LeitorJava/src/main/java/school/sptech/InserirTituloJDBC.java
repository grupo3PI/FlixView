
package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Date;

public class InserirTituloJDBC {

    private int filmesInseridos = 0;
    private int seriesInseridas = 0;

    private JdbcTemplate connection;

    public InserirTituloJDBC(JdbcTemplate connection) {
        this.connection = connection;
    }

    public void inserir(Titulos titulo) {

        String sqlTitulo = ""; // monta o insert do titulo aqui
        Date data = null;
        String sqlVerificar = "SELECT COUNT(*) FROM titulo WHERE idTitulo = ?"; // esse e o select que eu coloquei pra fazer a trava de nao inserir se o titulo ja estiver no banco
        Integer quantidade = connection.queryForObject(sqlVerificar, Integer.class, titulo.getId());

        if (titulo.getDtLancamento() != null && !titulo.getDtLancamento().isBlank()) {
            data = Date.valueOf(titulo.getDtLancamento());
        }

        if (quantidade == 0) {
<<<<<<< Updated upstream
//            connection.update(); // maqui vc passa a variável do select e colocar os gets das variáveis dentro da chave. Ex: ...(sqlTitulo, get.Titulo()...) na ordem certa.
=======
            connection.update(sqlTitulo,
                    titulo.getId(),
                    titulo.getTitulo(),
                    titulo.getTituloOrig(),
                    titulo.getLinguagemOrig(),
                    titulo.getSinopse(),
                    titulo.getPopularidade(),
                    titulo.getCamPoster(),
                    data,
                    titulo.getNota(),
                    titulo.getQtdVotos());

            if (titulo.getGeneros() != null && !titulo.getGeneros().isBlank()) {
                String[] generos = titulo.getGeneros().split(",");

                for (int i = 0; i < generos.length; i++) {
                    String nomeGenero = generos[i].trim();
                    String sqlGenero = "SELECT idGenero FROM genero WHERE nome = ?";
                    List<Integer> ids = connection.queryForList(sqlGenero, Integer.class, nomeGenero);
                    if (ids.isEmpty()) {
                        System.err.println("[AVISO] Gênero não encontrado no banco: " + nomeGenero);
                    } else {
                        Integer idGenero = ids.get(0);
                        String sqlRelacao = "INSERT INTO titulo_genero (fkTitulo, fkGenero) VALUES (?, ?)";
                        connection.update(sqlRelacao, titulo.getId(), idGenero);
                    }
                }
            }

            if (titulo.getTipo().equalsIgnoreCase("Filme")) {
                filmesInseridos++;
                System.out.print("\r[INFO] Filmes inseridos: " + filmesInseridos);
            } else {
                seriesInseridas++;
                System.out.print("\r[INFO] Séries inseridas: " + seriesInseridas);
            }

            System.out.flush();
>>>>>>> Stashed changes
        } else {
            System.out.println("[INFO] Título já existe no banco de dados " + titulo.getTitulo() + " (ID: " + titulo.getId() + ")");
        }

//        falta implementar o split e o insert dos generos
//        recomendação do que fazer:
//
//        1. fazer o split (separar a cada ",") da string de Generos que o leitor trouxe e colocar em um array (para pegar os generos titulos.getGeneros() trazidos pelo leitor)
//        2. se estiver certinho, faz um for lendo o array
//        3. dentro do for, faz um select no banco procurando o genero com aquele nome na tabela Generos ( WHERE nome LIKE...)
//        4. se o select tiver dado certo (é bom fazer uma validação pra garantir) pega o id do genero que o select retornou
//        5. faz o insert na tabela de relacionamento titulo_genero, passando o id do genero e o id do filme (titulo.getId() pra pegar do id titulo que o leitor trouxe)
//        6. daqui pra frente é sucesso
//
//        OBS:
//              se você ver alguma coisa que possa travar a leitura ou na hora que você foz testar der erro, ve se faltou alguma validação pra evitar isso
//              eu ja deixei feita uma validação no insert de cima pra evitar ficar dando erro caso o titulo ja tenha sido inserido antes, qlq coisa faz
//              algo na msm linha de raciocionio, ou so faz uma validação simples msm, tipo sla, se cair no else do titulo ja cadastrado coloca uma variavel
//              de muda o valor de uma variavel pra true (ou usa int sla) e se for diferente de um valor especifico ele nao executa esse bloco dos generos.
//
//              se vc ficar com alguma duvida pode me mandar mensagem, talvez eu demore pra ver, entao prioriza pesquisar no google, ver videos ou pesquisar
//              exemplo aplicação na IA etc, n tem problema, se msm assim n for vai me avisando.
//
//             ATENÇÃO: QUANDO FOR TESTAR RODA A CLASSE "MAIN" JÁ TA NO JEITO!!!

    }
}

