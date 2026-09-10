package school.sptech;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Scanner;

public class ConsoleLogs {
    static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        LocalDateTime dtAv = LocalDateTime.now();
        DateTimeFormatter formatado =
                DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy");

        System.out.println("Olá, Bem vindo! \n Antes de começarmos, insira seu nome:");
        String nome = input.nextLine();

        System.out.printf("%s > [INFO] Novo login! Usuário %s entrou no sistema.%n%n", dtAv.format(formatado), nome);

        System.out.println("""
                Arquivos disponíveis:
                
                1. gtaVI.xlsx
                2. theWhisperMan.xlsx
                3. theLastHouse.xlsx
                """);

        Integer arquivo = input.nextInt();

        String filme;
        Integer linhas;

        if (arquivo == 1) {
            filme = "gtaVI.xlsx";
            linhas = 5240;

        } else if (arquivo == 2) {
            filme = "theWhisperMan.xlsx";
            linhas = 2380;

        } else if (arquivo == 3) {
            filme = "theLastHouse.xlsx";
            linhas = 840;

        } else {

            System.out.printf("[%s] > [ERRO] Arquivo inválido!%n", dtAv.format(formatado));

            System.out.println("[AVISO] Processamento interrompido.");

            return;
        }

        System.out.printf("[%s] > [INFO] Arquivo selecionado: %s%n", dtAv.format(formatado), filme);

        System.out.printf("[%s] > [INFO] Iniciando leitura do arquivo...%n", dtAv.format(formatado));

        System.out.printf("[%s] > [INFO] Arquivo possui %d linhas. %n", dtAv.format(formatado), linhas);

        if (linhas > 5000) {

            System.out.printf("[%s] > [AVISO] O arquivo possui muitos registros. %n", dtAv.format(formatado));

        } else if (linhas < 1000) {

            System.out.printf("[%s] > [AVISO] O arquivo possui poucos registros. %n", dtAv.format(formatado));

        } else {
            System.out.printf("[%s] > [INFO]  Quantidade de registros dentro do esperado.%n", dtAv.format(formatado));
        }

        if (arquivo == 2) {

            System.out.printf("[%s] > [ERRO] Falha ao processar o arquivo %s!%n", dtAv.format(formatado), filme);

        } else {
            System.out.printf("[%s] >[SUCESSO] Leitura do arquivo %s realizada com sucesso!%n", dtAv.format(formatado), filme);

            System.out.printf("[%s] > [INFO] Iniciando processamento dos dados...%n", dtAv.format(formatado));

            System.out.printf("[%s] > [INFO] %d registros sendo processados.%n", dtAv.format(formatado), linhas);

            System.out.printf("[%s] > [SUCESSO] Processamento finalizado.%n", dtAv.format(formatado));
        }

        System.out.printf("[%s] > [INFO] Processamento encerrado.%n", dtAv.format(formatado));

    }
}
