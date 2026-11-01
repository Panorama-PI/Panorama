package com.panorama.mail.dao;

import com.panorama.mail.config.ConnectionProvider;
import org.springframework.jdbc.core.JdbcTemplate;

public class TokenDao {

    ConnectionProvider connectionProvider = new ConnectionProvider();
    public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

    public void marcarComoEnviado(String codigo){
        String sql = """
                UPDATE token SET status_enviado = true WHERE codigo = ?
        """;

        jdbcTemplate.update(sql, codigo);
    }
}
