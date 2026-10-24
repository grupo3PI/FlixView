package school.sptech;

public class Main {

    public static void main(String[] args) {

        DBConnectionProvider banco = new DBConnectionProvider();

        InserirTituloJDBC jdbc =
                new InserirTituloJDBC(banco.getConnection());

        LerFilmes.ler(jdbc);
        LerSeries.ler(jdbc);
    }
}
