package school.sptech;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.core.ResponseInputStream;
import school.sptech.dao.FilmeDAO;
import school.sptech.model.Filme;
import school.sptech.model.Log;
import school.sptech.util.LeitorExcel;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        try {
            String regiao = config("AWS_REGION", dotenv);
            String bucket = config("S3_BUCKET", dotenv);
            String chaveArquivo = config("S3_OBJECT_KEY", dotenv);

            try (S3Client s3 = S3Client.builder().region(Region.of(regiao)).build();
                 ResponseInputStream<GetObjectResponse> arquivo = s3.getObject(GetObjectRequest.builder()
                         .bucket(bucket)
                         .key(chaveArquivo)
                         .build());
                 Workbook workbook = new XSSFWorkbook(arquivo)) {

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
            }

        } catch (IOException e) {
            System.err.println("Erro ao ler a planilha do S3: " + e.getMessage());
            System.exit(1);
        } catch (SQLException e) {
            System.err.println("Erro ao salvar o arquivo no banco: " + e.getMessage());
            System.exit(1);
        } catch (RuntimeException e) {
            System.err.println("Erro ao acessar a planilha no S3: " + e.getMessage());
            System.exit(1);
        }
    }

    private static String config(String chave, Dotenv dotenv) {
        String valor = System.getenv(chave);
        if (valor == null || valor.isBlank()) {
            valor = dotenv.get(chave);
        }
        if (valor == null || valor.isBlank()) {
            throw new IllegalStateException("Configure a variável " + chave + ".");
        }
        return valor;
    }
}
