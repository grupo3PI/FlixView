package school.sptech;

import org.apache.poi.openxml4j.opc.OPCPackage;
import org.apache.poi.xssf.eventusermodel.ReadOnlySharedStringsTable;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.eventusermodel.XSSFSheetXMLHandler;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.util.XMLHelper;
import org.xml.sax.InputSource;
import org.xml.sax.XMLReader;
import java.io.InputStream;
import static school.sptech.Titulos.converterDouble;


public class LerSeries {

    public static void main(String[] args) {

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

                    Titulos serie = new Titulos(
                            Integer.valueOf(celulas[0]), celulas[1], celulas[2], celulas[3], celulas[4], celulas[5], converterDouble(celulas[7]),
                            Integer.valueOf(celulas[8]), converterDouble(celulas[9]), celulas[10], celulas[14], celulas[15], celulas[16],
                            celulas[17], celulas[19], celulas[20], celulas[21], celulas[26], celulas[11]);

                    System.out.println("ID: " + serie.getId());
                    System.out.println("Título: "+serie.getTitulo());
                    System.out.println("Generos:" +serie.getGeneros());
                    System.out.println("Duração: " + serie.getDuracao());
                    System.out.println("Nota: " + serie.getNota());
                    System.out.println("Poster: " + serie.getCamPoster());
                    System.out.println();

//                    jdbc.inseir(serie);
                }

            };

            leitorXml.setContentHandler(
                    new XSSFSheetXMLHandler(null, strings, dados, new DataFormatter(), false)
            );

            var planilhas = leitor.getSheetsData();

            planilhas.next();

            try (InputStream planilha = planilhas.next()) {
                leitorXml.parse(new InputSource(planilha));
            }

        } catch (Exception e) {
            System.out.println("Erro ao ler o arquivo: " + e.getMessage());
        }
    }
}