package com.panorama.mail.dao;

import com.panorama.mail.config.ConnectionProvider;
import com.panorama.mail.model.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

public class EmailDao {

    ConnectionProvider connectionProvider = new ConnectionProvider();
    public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

    public List<PendenciaEmailEnvio> verificarEmailPendente(){
        String sql = """
                SELECT *
                FROM vw_emails_pendentes
                WHERE (status_enviado = 0 OR status_enviado > 1) AND (notificacao = 1 OR notificacao IS NULL);
                """;


        return jdbcTemplate.query(sql, (rs, row) ->{
            String tipo = rs.getString("tipo");

            String nomeEmpresa = rs.getString("nome_empresa");
            Empresa empresa = (nomeEmpresa != null) ? new Empresa(nomeEmpresa) : null;

            String nomeProdutor = rs.getString("nome_produtor");
            Usuario produtor = (nomeProdutor != null) ? new Usuario(nomeProdutor) : null;

            String nomeRoteirista = rs.getString("nome_roteirista");
            String emailDestinatario = rs.getString("email_destinatario");
            Usuario roteirista = new Usuario(nomeRoteirista, emailDestinatario);

            Feedback feedback = null;
            Object idFeedbackObj = rs.getObject("id_feedback");
            if (idFeedbackObj != null) {
                feedback = new Feedback(
                        ((Number) idFeedbackObj).intValue(),
                        rs.getString("texto_feedback")
                );
            }

            Token token = null;
            String codigoToken = rs.getString("codigo");
            Timestamp expiracaoTs = rs.getTimestamp("expiracao");

            Integer status = rs.getInt("status_enviado");

            if (codigoToken != null) {
                LocalDateTime expiracao = (expiracaoTs != null) ? expiracaoTs.toLocalDateTime() : null;
                token = new Token(codigoToken, expiracao);
            }
            return new PendenciaEmailEnvio(tipo,status,empresa,produtor,roteirista,feedback,token);

        });
    }
}
