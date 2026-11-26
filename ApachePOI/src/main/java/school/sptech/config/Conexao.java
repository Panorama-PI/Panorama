package school.sptech.config;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {

    private static final Dotenv DOTENV = Dotenv.configure().ignoreIfMissing().load();
    private static final String URL = config("DATABASE_URL");
    private static final String USER = config("DATABASE_USER");
    private static final String PASS = config("DATABASE_PASS");

    private static String config(String key) {
        String value = System.getenv(key);
        return value != null && !value.isBlank() ? value : DOTENV.get(key);
    }

    public static Connection Conexao() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
}
