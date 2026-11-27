package com.panorama.cronjob.model;

import com.panorama.mail.model.Roteirista;

import java.time.DayOfWeek;

public class Publicacao {
    private String id;
    private String nome;
    private Roteirista roteirista;
    private DayOfWeek diaSemana;

    public Publicacao(String id, String nome, Roteirista roteirista, DayOfWeek diaSemana) {
        this.id = id;
        this.nome = nome;
        this.roteirista = roteirista;
        this.diaSemana = diaSemana;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Roteirista getRoteirista() {
        return roteirista;
    }

    public void setRoteirista(Roteirista roteirista) {
        this.roteirista = roteirista;
    }

    public DayOfWeek getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(DayOfWeek diaSemana) {
        this.diaSemana = diaSemana;
    }
}
