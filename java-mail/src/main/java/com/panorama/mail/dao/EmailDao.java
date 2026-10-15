package com.panorama.mail.dao;

import com.panorama.mail.config.ConnectionProvider;
import com.panorama.mail.model.Empresa;
import com.panorama.mail.model.PendenciaEmailEnvio;
import com.panorama.mail.model.Token;
import com.panorama.mail.model.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class EmailDao {

    ConnectionProvider connectionProvider = new ConnectionProvider();
    public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

    public List<PendenciaEmailEnvio> verificarEmailPendente(){
        String sql = """
                SELECT 
                    e.nome AS empresa_nome,
                    u.nome AS usuario_nome,
                    t.email_destinatario AS usuario_email,
                    t.codigo AS codigo_token,
                    t.status_enviado AS status_enviado,
                    t.expiracao AS expiracao
                FROM token t
                INNER JOIN empresa e ON t.id_empresa = e.id
                INNER JOIN usuario u ON e.id = u.id_empresa
                WHERE t.status_enviado = false AND t.expiracao > CURRENT_TIMESTAMP
                """;


        return jdbcTemplate.query(sql, (rs, row) ->{
            Empresa empresa = new Empresa(
                    rs.getString("empresa_nome")
            );
            Usuario usuario = new Usuario(
                    rs.getString("usuario_nome"),
                    rs.getString("usuario_email")
            );
            Token token = new Token(
                    rs.getString("codigo_token"),
                    rs.getTimestamp("expiracao").toLocalDateTime()
            );

            return new PendenciaEmailEnvio(empresa, usuario, token);

        });
    }

    public void marcarComoEnviado(String codigo){
        String sql = """
                UPDATE token SET status_enviado = true WHERE codigo = ?
        """;

        jdbcTemplate.update(sql, codigo);
    }

}
