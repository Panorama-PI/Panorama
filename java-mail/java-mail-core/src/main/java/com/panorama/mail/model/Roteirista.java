package com.panorama.mail.model;

import java.sql.Time;

public class Roteirista extends Usuario{

    private Time horarioInicio;
    private Time horarioFim;

    public Roteirista(String nome){
        super(nome);
    }

    public Roteirista(String nome, String email,Time horarioInicio, Time horarioFim) {
        super(nome, email);
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
    }

    public Time getHorarioInicio() {
        return horarioInicio;
    }

    public void setHorarioInicio(Time horarioInicio) {
        this.horarioInicio = horarioInicio;
    }

    public Time getHorarioFim() {
        return horarioFim;
    }

    public void setHorarioFim(Time horarioFim) {
        this.horarioFim = horarioFim;
    }
}
