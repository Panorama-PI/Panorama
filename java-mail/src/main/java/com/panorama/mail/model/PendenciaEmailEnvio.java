package com.panorama.mail.model;

public class PendenciaEmailEnvio {
    private String tipo;
    private Integer status;
    private Empresa empresa;
    private Usuario produtor;
    private Usuario roteirista;
    private Feedback feedback;
    private Token token;

    public PendenciaEmailEnvio(String tipo, Integer status, Empresa empresa, Usuario produtor, Usuario roteirista, Feedback feedback, Token token) {
        this.tipo = tipo;
        this.status = status;
        this.empresa = empresa;
        this.produtor = produtor;
        this.roteirista = roteirista;
        this.feedback = feedback;
        this.token = token;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Token getToken() {
        return token;
    }

    public void setToken(Token token) {
        this.token = token;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Usuario getProdutor() {
        return produtor;
    }

    public void setProdutor(Usuario produtor) {
        this.produtor = produtor;
    }

    public Usuario getRoteirista() {
        return roteirista;
    }

    public void setRoteirista(Usuario roteirista) {
        this.roteirista = roteirista;
    }

    public Feedback getFeedback() {
        return feedback;
    }

    public void setFeedback(Feedback feedback) {
        this.feedback = feedback;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
