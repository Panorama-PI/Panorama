package com.panorama.mail.model;

public class ResumoRoteiristaEmail {

    private Integer id;
    private String nome;
    private String email;
    private Integer quantidadeAvaliacoes;
    private Integer publicacoesAvaliadas;
    private Double mediaAvaliacoes;

    public ResumoRoteiristaEmail(
            Integer id,
            String nome,
            String email,
            Integer quantidadeAvaliacoes,
            Integer publicacoesAvaliadas,
            Double mediaAvaliacoes
    ) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.quantidadeAvaliacoes = quantidadeAvaliacoes;
        this.publicacoesAvaliadas = publicacoesAvaliadas;
        this.mediaAvaliacoes = mediaAvaliacoes;
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

    public Integer getQuantidadeAvaliacoes() {
        return quantidadeAvaliacoes;
    }

    public Integer getPublicacoesAvaliadas() {
        return publicacoesAvaliadas;
    }

    public Double getMediaAvaliacoes() {
        return mediaAvaliacoes;
    }
}