package com.panorama.mail.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

public class ConnectionProvider {

    private static final Dotenv DOTENV = Dotenv.configure().ignoreIfMissing().load();
    private final DataSource dataSource;

    public ConnectionProvider() {
        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setUrl(config("DB_URL"));
        basicDataSource.setUsername(config("DB_USER"));
        basicDataSource.setPassword(config("DB_PASSWORD"));

        this.dataSource = basicDataSource;
    }

    private static String config(String key) {
        String value = System.getenv(key);
        return value != null && !value.isBlank() ? value : DOTENV.get(key);
    }

    public JdbcTemplate getConnection(){
        return new JdbcTemplate(dataSource);
    }
}
