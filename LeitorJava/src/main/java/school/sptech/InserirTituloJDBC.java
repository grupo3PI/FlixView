
package school.sptech;

import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Date;
import java.util.List;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class InserirTituloJDBC {

    private JdbcTemplate connection;
    private int filmesInseridos = 0;
    private int seriesInseridas = 0;

    public InserirTituloJDBC(JdbcTemplate connection) {
        this.connection = connection;
    }

    public void inserir(Titulos titulo) {
        String sqlTitulo = "INSERT INTO titulo (idTitulo, title, original_title, original_language, overview, popularity, poster_path, release_date, vote_average, vote_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; // monta o insert do titulo aqui
        Date data = null;
        String sqlVerificar = "SELECT COUNT(*) FROM titulo WHERE idTitulo = ?";
        Integer quantidade = connection.queryForObject(sqlVerificar, Integer.class, titulo.getId());

        if (titulo.getDtLancamento() != null && !titulo.getDtLancamento().isBlank()) {
            data = Date.valueOf(titulo.getDtLancamento());
        }

        if (quantidade == 0) {
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
                        Main.logErro("Gênero não encontrado no banco: " + nomeGenero);
                    } else {
                        Integer idGenero = ids.get(0);
                        String sqlRelacao = "INSERT INTO titulo_genero (fkTitulo, fkGenero) VALUES (?, ?)";
                        connection.update(sqlRelacao, titulo.getId(), idGenero);
                    }
                }
            }
            if (titulo.getTipo().equalsIgnoreCase("Filme")) {
                filmesInseridos++;
                System.out.print("\r" + Main.getDataHora() + " [INFO] Filmes inseridos: " + filmesInseridos);
            } else {
                seriesInseridas++;
                System.out.print("\r" + Main.getDataHora() + " [INFO] Séries inseridas: " + seriesInseridas);
            }
        } else {
            Main.log("[INFO] Título " + titulo.getTitulo() + " já cadastrado no Banco de Dados...");

        }
    }
}

