package school.sptech.dao;

import school.sptech.config.Conexao;
import school.sptech.model.Filme;
import school.sptech.model.AtorPersonagem;

import java.sql.*;

import java.util.List;

public class FilmeDAO {

    public void salvarFilmes(List<Filme> filmes) {
        String sqlFilme = "INSERT INTO filme (nome, data_lancamento, score, titulo_original, status_filme, idioma_original, orcamento, receita, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlGeneroCadastro = "INSERT IGNORE INTO genero (nome) VALUES (?)";
        String sqlGenero = "INSERT INTO filme_genero (id_filme, id_genero) SELECT ?, id FROM genero WHERE nome = ?";
        String sqlPalavra = "INSERT INTO genero_palavra (nome, id_genero) SELECT ?, id FROM genero WHERE nome = ?";
        String sqlAtor = "INSERT IGNORE INTO ator (nome) VALUES (?)";
        String sqlFilmeAtor = "INSERT INTO filme_ator (id_filme, id_ator, personagem) SELECT ?, id, ? FROM ator WHERE nome = ?";

        try (Connection conn = Conexao.Conexao();
             PreparedStatement stmtFilme = conn.prepareStatement(sqlFilme, Statement.RETURN_GENERATED_KEYS);
             PreparedStatement stmtGeneroCadastro = conn.prepareStatement(sqlGeneroCadastro);
             PreparedStatement stmtGenero = conn.prepareStatement(sqlGenero);
             PreparedStatement stmtPalavra = conn.prepareStatement(sqlPalavra);
             PreparedStatement stmtAtor = conn.prepareStatement(sqlAtor);
             PreparedStatement stmtFilmeAtor = conn.prepareStatement(sqlFilmeAtor)) {

            System.out.println("Iniciando a gravação no banco. Isso pode levar alguns minutos...");
            conn.setAutoCommit(false);
            for (Filme f : filmes) {

                String titulo = f.getTituloOriginal();
                if (titulo != null && titulo.length() > 255) titulo = titulo.substring(0, 255);

                String nome = f.getNome();
                if (nome != null && nome.length() > 255) nome = nome.substring(0, 255);

                stmtFilme.setString(1, nome);
                stmtFilme.setString(2, f.getDataLancamento());

                if (f.getScore() != null) stmtFilme.setDouble(3, f.getScore());
                else stmtFilme.setNull(3, Types.DOUBLE);

                stmtFilme.setString(4, titulo);
                stmtFilme.setString(5, f.getStatus());
                stmtFilme.setString(6, f.getIdiomaOriginal());

                if (f.getOrcamento() != null) stmtFilme.setDouble(7, f.getOrcamento());
                else stmtFilme.setNull(7, Types.DOUBLE);

                if (f.getReceita() != null) stmtFilme.setDouble(8, f.getReceita());
                else stmtFilme.setNull(8, Types.DOUBLE);

                stmtFilme.setString(9, f.getPais());

                stmtFilme.executeUpdate();

                try (ResultSet rs = stmtFilme.getGeneratedKeys()) {
                    if (rs.next()) {
                        int idDoFilme = rs.getInt(1);

                        // gêneros: cadastra o gênero (se ainda não existir) e liga ao filme
                        for (String genero : f.getGeneros()) {
                            stmtGeneroCadastro.setString(1, genero);
                            stmtGeneroCadastro.executeUpdate();

                            stmtGenero.setInt(1, idDoFilme);
                            stmtGenero.setString(2, genero);
                            stmtGenero.executeUpdate();
                        }

                        // atores: cadastra o ator (se ainda não existir) e liga ao filme
                        for (AtorPersonagem ap : f.getElenco()) {
                            String ator = ap.getAtor();
                            if (ator != null && ator.length() > 150) ator = ator.substring(0, 150);

                            String personagem = ap.getPersonagem();
                            if (personagem != null && personagem.length() > 255) personagem = personagem.substring(0, 255);

                            stmtAtor.setString(1, ator);
                            stmtAtor.executeUpdate();

                            stmtFilmeAtor.setInt(1, idDoFilme);
                            stmtFilmeAtor.setString(2, personagem);
                            stmtFilmeAtor.setString(3, ator);
                            stmtFilmeAtor.executeUpdate();
                        }

                        // sinopse já tratada: palavras separadas por espaço
                        String[] palavras = f.getSinopse().split(" ");

                        for (String genero : f.getGeneros()) {
                            for (String palavra : palavras) {
                                if (palavra.length() > 100) palavra = palavra.substring(0, 100);

                                stmtPalavra.setString(1, palavra);
                                stmtPalavra.setString(2, genero);
                                stmtPalavra.executeUpdate();
                            }
                        }
                    }
                }
            }
            conn.commit();
            System.out.println("✅ Todos os filmes foram salvos com sucesso!");

        } catch (SQLException e) {
            System.err.println("❌ Erro no banco de dados: " + e.getMessage());
        }
    }
}