package com.panorama.mail.dao;

import com.panorama.mail.config.ConnectionProvider;
import com.panorama.mail.model.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class EmailDao {

    ConnectionProvider connectionProvider = new ConnectionProvider();
    public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

    public List<PendenciaEmailEnvio> verificarEmailPendente(){
        String sql = """
                SELECT *
                FROM vw_emails_pendentes
                WHERE status_enviado = 0 AND notificacao = 1;
                """;


        return jdbcTemplate.query(sql, (rs, row) ->{
            String tipo = rs.getString("tipo");

            Empresa empresa = new Empresa(
                    rs.getString("nome_empresa")
            );
            Usuario produtor = new Usuario(
                    rs.getString("nome_produtor")
            );
            Usuario roteirista = new Usuario(
                    rs.getString("nome_roteirista"),
                    rs.getString("email_destinatario")
            );
            Feedback feedback = new Feedback(
                    rs.getString("texto_feedback")
            );
            Token token = new Token(
                    rs.getString("codigo"),
                    rs.getTimestamp("expiracao").toLocalDateTime()
            );

            return new PendenciaEmailEnvio(tipo,empresa,produtor,roteirista,feedback,token);

        });
    }

    public void marcarComoEnviado(String codigo){
        String sql = """
                UPDATE token SET status_enviado = true WHERE codigo = ?
        """;

        jdbcTemplate.update(sql, codigo);
    }

}
