package school.sptech.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {

    private Integer id;
    private String nivel;
    private String origem;
    private String mensagem;
    private LocalDateTime dataHora;

    public Log(Integer id, String nivel, String origem, String mensagem,LocalDateTime dataHora) {
        this.id = id;
        this.nivel = nivel;
        this.origem = origem;
        this.mensagem = mensagem;
        this.dataHora = dataHora;
    }

    public Log(String nivel, String origem, String mensagem) {
        this.nivel = nivel;
        this.origem = origem;
        this.mensagem = mensagem;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    @Override
    public String toString() {
        return "[ " + nivel + " ] [ " + origem + " ] [ " + mensagem + " ] [ " +
                dataHora.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")) + " ]";
    }
}
