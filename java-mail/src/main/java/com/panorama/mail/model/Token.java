package com.panorama.mail.model;

import java.time.LocalDateTime;

public class Token {

    public String token;
    public LocalDateTime expiration;

    public Token(String token, LocalDateTime expiration) {
        this.token = token;
        this.expiration = expiration;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getExpiration() {
        return expiration;
    }

    public void setExpiration(LocalDateTime expiration) {
        this.expiration = expiration;
    }
}
