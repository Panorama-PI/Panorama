package school.sptech;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        String nomeArquivo = "imdb_movies 1.xlsx"; 

        
        try (FileInputStream fileInputStream = new FileInputStream(nomeArquivo);
             Workbook workbook = new XSSFWorkbook(fileInputStream)) {

            
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter dataFormatter = new DataFormatter();

            LeitorExcel leitorExcel = new LeitorExcel(); 

            
            List<Filme> filmesExtraidos = leitorExcel.extrairFilmes(sheet, dataFormatter);

            System.out.println("Foram extraídos e deduplicados " + filmesExtraidos.size() + " filmes.");
            FilmeDAO dao = new FilmeDAO();
            dao.salvarFilmes(filmesExtraidos);

        } catch (IOException e) {
            System.err.println("Erro ao abrir ou ler o arquivo: " + e.getMessage());
        }
    }
}