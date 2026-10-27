package school.sptech;

public class Main {

    public static void main(String[] args) {

        System.out.println("FLIXVIEW\n\n");

        try {

            System.out.println("[INFO] Iniciando conexão com o banco de dados...");
            DBConnectionProvider banco = new DBConnectionProvider();

            InserirTituloJDBC jdbc = new InserirTituloJDBC(banco.getConnection());

            System.out.println("[INFO] Iniciando importação do catálogo de Filmes...");
            LerFilmes.ler(jdbc);
            System.out.println("[INFO] Importação do catálogo de Filmes finalizada.");


            System.out.println("[INFO] Iniciando importação do catálogo de Séries...");
            LerSeries.ler(jdbc);
            System.out.println("[INFO] Importação do catálogo de Séries finalizada.");

            System.out.println();
            System.out.println("[INFO] Processo finalizado com sucesso!");
        } catch (Exception e) {
        System.err.println("[ERRO] Falha na importação do catálogo. Operação Finalizada!");
        e.printStackTrace();
        System.exit(1);
        }

    }
}
