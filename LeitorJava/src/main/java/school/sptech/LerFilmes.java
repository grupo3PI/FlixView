package school.sptech;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.util.XMLHelper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
import java.io.InputStream;
import static school.sptech.Titulos.converterDouble;

public class LerFilmes {

    public static void ler(InserirTituloJDBC jdbc){

        DBConnectionProvider dbConnectionProvider =
                new DBConnectionProvider();

        JdbcTemplate connection =
                dbConnectionProvider.getConnection();

        String caminho = "src/main/resources/flixview_catalogo_completo.xlsx";

        try (OPCPackage pacote = OPCPackage.open(caminho)) {

            XSSFReader leitor = new XSSFReader(pacote);
            ReadOnlySharedStringsTable strings = new ReadOnlySharedStringsTable(pacote);

            XMLReader leitorXml = XMLHelper.newXMLReader();

            XSSFSheetXMLHandler.SheetContentsHandler dados = new XSSFSheetXMLHandler.SheetContentsHandler() {

                String[] celulas = new String[29];

                public void startRow(int numeroLinha) {
                    celulas = new String[29];
                }

                public void cell(String referencia, String valor, org.apache.poi.xssf.usermodel.XSSFComment comentario) {

                    int coluna = new CellReference(referencia).getCol();

                    if (coluna < celulas.length) {
                        celulas[coluna] = valor;
                    }
                }

                public void endRow(int numeroLinha) {

                    if (numeroLinha == 0) {
                        return;
                    }

                    if (numeroLinha > 2) {
                        return;
                    } // tirar dps, apenas pra teste

                    Titulos filme = new Titulos(
                            Integer.valueOf(celulas[0]), celulas[1], celulas[2], celulas[3], celulas[4], celulas[5], converterDouble(celulas[7]),
                            Integer.valueOf(celulas[8]), converterDouble(celulas[9]), celulas[10], celulas[14], celulas[15], celulas[16],
                            celulas[17], celulas[19], celulas[20], celulas[21], celulas[26], celulas[11]);

                    System.out.println("ID: " + filme.getId());
                    System.out.println("Título: "+filme.getTitulo());
                    System.out.println("Generos:" +filme.getGeneros());
                    System.out.println("Duração: " + filme.getDuracao());
                    System.out.println("Nota: " + filme.getNota());
                    System.out.println("Poster: " + filme.getCamPoster());
                    System.out.println();

//                    System.out.println("ID: " + celulas[0]);
//                    System.out.println("Tipo: " + celulas[1]);
//                    System.out.println("Título: " + celulas[2]);
//                    System.out.println("Título original: " + celulas[3]);
//                    System.out.println("Sinopse: " + celulas[4]);
//                    System.out.println("Data de lançamento: " + celulas[5]);
//                    System.out.println("Nota: " + celulas[7]);
//                    System.out.println("Quantidade de votos: " + celulas[8]);
//                    System.out.println("Popularidade: " + celulas[9]);
//                    System.out.println("Gêneros: " + celulas[10]);
//                    System.out.println("Classificação indicativa: " + celulas[14]);
//                    System.out.println("Duração: " + celulas[15]);
//                    System.out.println("Diretores: " + celulas[19]);
//                    System.out.println("Roteiristas: " + celulas[20]);
//                    System.out.println("Elenco: " + celulas[21]);
//                    System.out.println();

                    jdbc.inserir(filme);
;                }

            };

            leitorXml.setContentHandler(
                    new XSSFSheetXMLHandler(null, strings, dados, new DataFormatter(), false)
            );

            try (InputStream planilha = leitor.getSheetsData().next()) {leitorXml.parse(new InputSource(planilha));
            }

        } catch (Exception e) {
            System.out.println("Erro ao ler o arquivo: " + e.getMessage());
        }
    }

}


// Index de cada coluna do excel:
//
//    Index 0 = ID
//    Index 1 = Tipo
//    Index 2 = Titulo
//    Index 3 = Titulo Original
//    Index 4 = Sinopse
//    Index 5 = Data de lançamento
//    Index 6 = Situação
//    Index 7 = Nota
//    Index 8 = Quantidade de Votos
//    Index 9 = Popularidade
//    Index 10 = Generos
//    Index 11 = Idioma Original
//    Index 12 = Idiomas Disponiveis
//    Index 13 = Paises de origem
//    Index 14 = Classificação
//    Index 15 = Duracao (filme ou ep, tanto faz)
//    Index 16 = Quantidade de temporadas
//    Index 17 = Quantidade de episodios (total)
//    Index 18 = Criadores
//    Index 19 = Diretores
//    Index 20 = Roteiristas
//    Index 21 = Elenco principal
//    Index 22 = Palavras-chave
//    Index 23 = Orçamento
//    Index 24 = Receita
//    Index 25 = Temporada mais recente
//    Index 26 = URL do poster
//    Index 27 = URL da imagem de fundo
//    Index 28 = Trailer