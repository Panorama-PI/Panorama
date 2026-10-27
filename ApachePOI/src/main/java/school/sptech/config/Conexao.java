package school.sptech.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexao {

    private static final String URL = "jdbc:mysql://localhost:3306/filmes_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USER = "David";
    private static final String PASS = "David@2020";

    public static Connection Conexao(){
        try{
            return DriverManager.getConnection(URL, USER, PASS);
        } catch (SQLException e) {
            System.out.println("Erro ao se conectar no banco de dados " + e.getMessage());
            return null;
        }
    }
}
