package school.sptech;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import school.sptech.dao.FilmeDAO;
import school.sptech.model.Filme;
import school.sptech.model.Log;
import school.sptech.util.LeitorExcel;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        String nomeArquivo = "imdb_movies 1.xlsx"; 

        
        try (FileInputStream fileInputStream = new FileInputStream(nomeArquivo);
             Workbook workbook = new XSSFWorkbook(fileInputStream)) {

            
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter dataFormatter = new DataFormatter();

            LeitorExcel leitorExcel = new LeitorExcel();

            long inicio = System.currentTimeMillis();

            List<Filme> filmesExtraidos = leitorExcel.extrairFilmes(sheet, dataFormatter);

            long fimLeitura = System.currentTimeMillis();
            long tempoLeituraMs = fimLeitura - inicio;

            Log logDebug = new Log("DEBUG", "Main",
                    String.format("Leitura da base de dados concluída em %d ms (%.2f s)%n", tempoLeituraMs, tempoLeituraMs / 1000.0));
            System.out.println(logDebug);

            long inicioBanco = System.currentTimeMillis();

            System.out.println("Foram extraídos e deduplicados " + filmesExtraidos.size() + " filmes.");
            FilmeDAO dao = new FilmeDAO();
            dao.salvarFilmes(filmesExtraidos);

            long fimBanco = System.currentTimeMillis();
            long tempoBancoMs = fimBanco - inicioBanco;
            Log logDebugBanco = new Log("DEBUG", "Main",
                    String.format("Persistência no banco concluída em %d ms (%.2f s)%n", tempoBancoMs, tempoBancoMs / 1000.0));
            System.out.println(logDebugBanco);

        } catch (IOException e) {
            System.err.println("Erro ao abrir ou ler o arquivo: " + e.getMessage());
        } catch (SQLException e) {
            System.err.println("Erro ao salvar o arquivo no banco: " + e.getMessage());
        }
    }
}