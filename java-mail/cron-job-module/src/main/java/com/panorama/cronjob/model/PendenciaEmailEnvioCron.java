package com.panorama.cronjob.model;

import com.panorama.mail.model.*;

import java.util.List;

public class PendenciaEmailEnvioCron{
    private String tipo;
    private Integer status;
    private Empresa empresa;
    private Produtor produtor;
    private List<Publicacao> publicacacoes;

    public PendenciaEmailEnvioCron(String tipo, Integer status, Empresa empresa, Produtor produtor, List<Publicacao> publicacacoes) {
        this.tipo = tipo;
        this.status = status;
        this.empresa = empresa;
        this.produtor = produtor;
        this.publicacacoes = publicacacoes;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Empresa getEmpresa() {
        return empresa;
    }

    public void setEmpresa(Empresa empresa) {
        this.empresa = empresa;
    }

    public Produtor getProdutor() {
        return produtor;
    }

    public void setProdutor(Produtor produtor) {
        this.produtor = produtor;
    }

    public List<Publicacao> getPublicacacoes() {
        return publicacacoes;
    }

    public void setPublicacacoes(List<Publicacao> publicacacoes) {
        this.publicacacoes = publicacacoes;
    }
}
