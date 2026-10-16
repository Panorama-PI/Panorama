package school.sptech;

import java.sql.*;
import java.util.List;

public class FilmeDAO {

    private static final String URL = "jdbc:mysql://localhost:3306/Panorama?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASS = "@Chokito5"; 

    public void salvarFilmes(List<Filme> filmes) {
        String sqlFilme = "INSERT INTO filme (nome, data_lancamento, score, sinopse, titulo_original, status_filme, idioma_original, orcamento, receita, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String sqlGenero = "INSERT INTO filme_genero (filme_id, genero) VALUES (?, ?)";
        String sqlElenco = "INSERT INTO filme_elenco (filme_id, ator, personagem) VALUES (?, ?, ?)";

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement stmtFilme = conn.prepareStatement(sqlFilme, Statement.RETURN_GENERATED_KEYS);
             PreparedStatement stmtGenero = conn.prepareStatement(sqlGenero);
             PreparedStatement stmtElenco = conn.prepareStatement(sqlElenco)) {

            System.out.println("Iniciando a gravação no banco. Isso pode levar alguns minutos...");

            for (Filme f : filmes) {

                

                
                String titulo = f.getTituloOriginal();
                if (titulo != null && titulo.length() > 255) titulo = titulo.substring(0, 255);

                String nome = f.getNome();
                if (nome != null && nome.length() > 255) nome = nome.substring(0, 255);

                stmtFilme.setString(1, nome);
                stmtFilme.setString(2, f.getDataLancamento());

                if (f.getScore() != null) stmtFilme.setInt(3, f.getScore());
                else stmtFilme.setNull(3, Types.INTEGER);

                stmtFilme.setString(4, f.getSinopse());
                stmtFilme.setString(5, titulo);
                stmtFilme.setString(6, f.getStatus());
                stmtFilme.setString(7, f.getIdiomaOriginal());

                if (f.getOrcamento() != null) stmtFilme.setDouble(8, f.getOrcamento());
                else stmtFilme.setNull(8, Types.DOUBLE);

                if (f.getReceita() != null) stmtFilme.setDouble(9, f.getReceita());
                else stmtFilme.setNull(9, Types.DOUBLE);

                stmtFilme.setString(10, f.getPais());

                
                stmtFilme.executeUpdate();

                
                try (ResultSet rs = stmtFilme.getGeneratedKeys()) {
                    if (rs.next()) {
                        int idDoFilme = rs.getInt(1);

                        
                        for (String genero : f.getGeneros()) {
                            stmtGenero.setInt(1, idDoFilme);
                            stmtGenero.setString(2, genero);
                            stmtGenero.executeUpdate();
                        }

                        
                        for (AtorPersonagem ator : f.getElenco()) {
                            stmtElenco.setInt(1, idDoFilme);
                            stmtElenco.setString(2, ator.getAtor());
                            stmtElenco.setString(3, ator.getPersonagem());
                            stmtElenco.executeUpdate();
                        }
                    }
                }
            }

            System.out.println("✅ Todos os filmes foram salvos com sucesso!");

        } catch (SQLException e) {
            System.err.println("❌ Erro no banco de dados: " + e.getMessage());
        }
    }
}