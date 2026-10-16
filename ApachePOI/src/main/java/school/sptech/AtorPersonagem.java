package school.sptech;

import java.util.ArrayList;
import java.util.List;

public class AtorPersonagem {
    private String ator;
    private String personagem;

    public AtorPersonagem(String ator, String personagem) {
        this.ator = ator;
        this.personagem = personagem;
    }

    public String getAtor() {
        return ator;
    }

    public void setAtor(String ator) {
        this.ator = ator;
    }

    public String getPersonagem() {
        return personagem;
    }

    public void setPersonagem(String personagem) {
        this.personagem = personagem;
    }

    @Override
    public String toString() {
        return "AtorPersonagem{" +
                "ator='" + ator + '\'' +
                ", personagem='" + personagem + '\'' +
                '}';
    }
}

