package school.sptech.model;

import java.util.ArrayList;
import java.util.List;

public class Filme {
    
    private String nome;
    private String dataLancamento;
    private Integer score;
    private String sinopse;
    private String tituloOriginal;
    private String status;
    private String idiomaOriginal;
    private Double orcamento;
    private Double receita;
    private String pais;

    
    private List<String> generos = new ArrayList<>();
    private List<AtorPersonagem> elenco = new ArrayList<>();


    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDataLancamento() {
        return dataLancamento;
    }

    public void setDataLancamento(String dataLancamento) {
        this.dataLancamento = dataLancamento;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getSinopse() {
        return sinopse;
    }

    public void setSinopse(String sinopse) {
        this.sinopse = sinopse;
    }

    public String getTituloOriginal() {
        return tituloOriginal;
    }

    public void setTituloOriginal(String tituloOriginal) {
        this.tituloOriginal = tituloOriginal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIdiomaOriginal() {
        return idiomaOriginal;
    }

    public void setIdiomaOriginal(String idiomaOriginal) {
        this.idiomaOriginal = idiomaOriginal;
    }

    public Double getOrcamento() {
        return orcamento;
    }

    public void setOrcamento(Double orcamento) {
        this.orcamento = orcamento;
    }

    public Double getReceita() {
        return receita;
    }

    public void setReceita(Double receita) {
        this.receita = receita;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public List<String> getGeneros() {
        return generos;
    }

    public void setGeneros(List<String> generos) {
        this.generos = generos;
    }

    public List<AtorPersonagem> getElenco() {
        return elenco;
    }

    public void setElenco(List<AtorPersonagem> elenco) {
        this.elenco = elenco;
    }
}