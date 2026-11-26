package com.panorama.mail.model;

import java.time.LocalDateTime;

public class Token {

    private String token;
    private LocalDateTime expiration;

    public Token(String token) {}

    public Token(String token, LocalDateTime expiration) {
        this.token = token;
        this.expiration = expiration;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpiration() {
        return expiration;
    }

}
