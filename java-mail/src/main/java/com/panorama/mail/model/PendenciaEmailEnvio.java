package com.panorama.mail.model;

public class PendenciaEmailEnvio {
    private Empresa empresa;
    private Usuario usuario;
    private Token token;

    public PendenciaEmailEnvio(Empresa empresa, Usuario usuario, Token token) {
        this.empresa = empresa;
        this.usuario = usuario;
        this.token = token;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Token getToken() {
        return token;
    }

}
