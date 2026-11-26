package com.panorama.mail.dao;

import com.panorama.mail.config.ConnectionProvider;
import org.springframework.jdbc.core.JdbcTemplate;

public class FeedbackDao {

    ConnectionProvider connectionProvider = new ConnectionProvider();
    public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

    public void marcarComoEnviado(Integer id){
        String sql = """
                UPDATE feedback SET status = 1 WHERE id = ?;
        """;

        jdbcTemplate.update(sql, id);
    }
}
