package com.panorama.mail.model;

public class ResumoProdutorEmail {

    private Integer id;
    private String nome;
    private String email;
    private Integer quantidadePendentes;

    public ResumoProdutorEmail(Integer id, String nome, String email,
                               Integer quantidadePendentes) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.quantidadePendentes = quantidadePendentes;
    }

    public Integer getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public Integer getQuantidadePendentes() {
        return quantidadePendentes;
    }
}