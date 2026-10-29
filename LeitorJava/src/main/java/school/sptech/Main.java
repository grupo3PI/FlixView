package school.sptech;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Main {

    public static void main(String[] args) {

        System.out.println("FLIXVIEW\n\n");

        try {

            log("[INFO] Iniciando conexão com o banco de dados...");
            DBConnectionProvider banco = new DBConnectionProvider();

            InserirTituloJDBC jdbc = new InserirTituloJDBC(banco.getConnection());

            log("[INFO] Iniciando importação do catálogo de Filmes...");
            LerFilmes.ler(jdbc);
            System.out.println();
            log("[INFO] Importação do catálogo de Filmes finalizada.");


            log("[INFO] Iniciando importação do catálogo de Séries...");
            LerSeries.ler(jdbc);
            System.out.println();
            log("[INFO] Importação do catálogo de Séries finalizada.");

            log("[INFO] Processo finalizado com sucesso!");
        } catch (Exception e) {
        logErro("[ERRO] Falha na importação do catálogo. Operação Finalizada!");
        e.printStackTrace();
        System.exit(1);
        }

    }

    public static void log(String mensagem) {

        if (!mensagem.isBlank()) {
            System.out.println(getDataHora() + " " + mensagem);
        }
    }

    public static void logErro(String mensagem) {

        System.err.println(getDataHora() + " " + mensagem);
    }

    public static String getDataHora() {
        LocalDateTime dtAv = LocalDateTime.now();
        DateTimeFormatter formatado = DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy");
        return dtAv.format(formatado);
    }
}
