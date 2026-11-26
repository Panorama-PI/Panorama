package com.panorama.mail.model;

public class Avaliacao {

    private Integer idAvaliacao;
    private Double nota;

    public Avaliacao(Integer idAvaliacao, Double nota) {
        this.idAvaliacao = idAvaliacao;
        this.nota = nota;
    }

    public Integer getIdAvaliacao() {
        return idAvaliacao;
    }

    public void setIdAvaliacao(Integer idAvaliacao) {
        this.idAvaliacao = idAvaliacao;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }
}
