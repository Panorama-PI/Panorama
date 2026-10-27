package school.sptech.config;

import io.github.cdimascio.dotenv.Dotenv;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {

    private static final String URL = Dotenv.load().get("DATABASE_URL");
    private static final String USER = Dotenv.load().get("DATABASE_USER");
    private static final String PASS = Dotenv.load().get("DATABASE_PASS");

    public static Connection Conexao(){
        try{
            return DriverManager.getConnection(URL, USER, PASS);
        } catch (SQLException e) {
            System.out.println("Erro ao se conectar no banco de dados " + e.getMessage());
            return null;
        }
    }
}
