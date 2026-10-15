package com.panorama.mail.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

public class ConnectionProvider {

    private final DataSource dataSource;

    public ConnectionProvider() {
        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setUrl(Dotenv.load().get("DB_URL"));
        basicDataSource.setUsername(Dotenv.load().get("DB_USER"));
        basicDataSource.setPassword(Dotenv.load().get("DB_PASSWORD"));

        this.dataSource = basicDataSource;
    }

    public JdbcTemplate getConnection(){
        return new JdbcTemplate(dataSource);
    }
}
