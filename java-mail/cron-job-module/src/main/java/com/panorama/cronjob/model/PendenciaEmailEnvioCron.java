package com.panorama.cronjob.model;

import com.panorama.mail.model.*;

import java.util.ArrayList;
import java.util.List;

public class PendenciaEmailEnvioCron {
  private String tipo;
  private Integer status;
  private Empresa empresa;
  private Produtor produtor;
  private List<Publicacao> publicacoes;

  public PendenciaEmailEnvioCron(String tipo, Integer status, Empresa empresa, Produtor produtor) {
    this.tipo = tipo;
    this.status = status;
    this.empresa = empresa;
    this.produtor = produtor;
    this.publicacoes = new ArrayList<>();
  }

  public void adicionarPublicacao(Publicacao publicacao) {
        if(publicacao == null){
            return;
        }

        publicac
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

  public List<Publicacao> getPublicacoes() {
    return publicacoes;
  }

  public void setPublicacacoes(List<Publicacao> publicacoes) {
    this.publicacoes = publicacoes;
  }
}
