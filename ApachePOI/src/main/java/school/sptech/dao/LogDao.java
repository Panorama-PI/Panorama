package school.sptech.dao;

import school.sptech.config.Conexao;
import school.sptech.model.Log;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Timestamp;

public class LogDao {

    public boolean inserirLog(Log log) throws SQLException {
        String sql = "INSERT INTO log_execucao(nivel,origem,mensagem,data_hora) VALUES (?,?,?,NOW())";

        try(
                Connection conn = Conexao.Conexao();
                PreparedStatement ps = conn.prepareStatement(sql)
        ){
            ps.setString(1,log.getNivel());
            ps.setString(2,log.getOrigem());
            ps.setString(3,log.getMensagem());

            Integer linhasAfetadas = ps.executeUpdate();
            return linhasAfetadas > 0;
        }catch (SQLException e){
            System.out.println("Erro ao inserir log no banco de dados " + e.getMessage());
            return false;
        }
    }


}
