package school.sptech.model;

import java.time.LocalDateTime;

public class Log {

    private Integer id;
    private String nivel;
    private String origem;
    private String mensagem;

    public Log(Integer id, String nivel, String origem, String mensagem, LocalDateTime dataHora) {
        this.id = id;
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
}
