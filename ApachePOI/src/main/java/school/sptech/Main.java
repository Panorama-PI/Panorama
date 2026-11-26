package school.sptech;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import school.sptech.dao.FilmeDAO;
import school.sptech.model.Filme;
import school.sptech.model.Log;
import school.sptech.util.LeitorExcel;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.ResponseTransformer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        try {
            importarPlanilha();
        } catch (Exception e) {
            System.err.println("Falha na importação da planilha: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
    }

    private static void importarPlanilha() throws IOException, SQLException {
        String bucket = System.getenv("S3_BUCKET");
        String chave = System.getenv("S3_OBJECT_KEY");
        String regiao = System.getenv("AWS_REGION");
        Path arquivoTemporario = null;

        if ((bucket == null || bucket.isBlank()) != (chave == null || chave.isBlank())) {
            throw new IllegalArgumentException("Configure S3_BUCKET e S3_OBJECT_KEY juntos.");
        }

        String nomeArquivo;
        if (bucket != null && !bucket.isBlank()) {
            if (regiao == null || regiao.isBlank()) {
                throw new IllegalArgumentException("Configure AWS_REGION para baixar a planilha do S3.");
            }

            arquivoTemporario = Files.createTempFile("panorama-import-", ".xlsx");
            System.out.println("Baixando planilha s3://" + bucket + "/" + chave);
            try (S3Client s3 = S3Client.builder()
                    .region(Region.of(regiao))
                    .credentialsProvider(DefaultCredentialsProvider.create())
                    .build()) {
                s3.getObject(
                        GetObjectRequest.builder().bucket(bucket).key(chave).build(),
                        ResponseTransformer.toFile(arquivoTemporario)
                );
            } catch (RuntimeException erro) {
                Files.deleteIfExists(arquivoTemporario);
                throw erro;
            }
            nomeArquivo = arquivoTemporario.toString();
        } else {
            nomeArquivo = System.getenv().getOrDefault("INPUT_FILE", "imdb_movies 1.xlsx");
        }

        try (FileInputStream fileInputStream = new FileInputStream(nomeArquivo);
             Workbook workbook = new XSSFWorkbook(fileInputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter dataFormatter = new DataFormatter();
            LeitorExcel leitorExcel = new LeitorExcel();

            long inicioLeitura = System.currentTimeMillis();
            List<Filme> filmesExtraidos = leitorExcel.extrairFilmes(sheet, dataFormatter);
            long tempoLeituraMs = System.currentTimeMillis() - inicioLeitura;
            System.out.println(new Log("DEBUG", "Main",
                    String.format("Leitura concluída em %d ms (%.2f s)%n", tempoLeituraMs, tempoLeituraMs / 1000.0)));

            long inicioBanco = System.currentTimeMillis();
            System.out.println("Foram extraídos e deduplicados " + filmesExtraidos.size() + " filmes.");
            new FilmeDAO().salvarFilmes(filmesExtraidos);
            long tempoBancoMs = System.currentTimeMillis() - inicioBanco;
            System.out.println(new Log("DEBUG", "Main",
                    String.format("Persistência concluída em %d ms (%.2f s)%n", tempoBancoMs, tempoBancoMs / 1000.0)));
        } finally {
            if (arquivoTemporario != null) {
                Files.deleteIfExists(arquivoTemporario);
            }
        }
    }
}
