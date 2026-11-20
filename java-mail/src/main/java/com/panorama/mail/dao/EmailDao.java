package com.panorama.mail.dao;

import com.panorama.mail.config.ConnectionProvider;
import com.panorama.mail.model.*;

import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

public class EmailDao {

    ConnectionProvider connectionProvider = new ConnectionProvider();

    public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

    // Mantém a consulta dos e-mails que já existiam.
    public List<PendenciaEmailEnvio> verificarEmailPendente() {

        String sql = """
                SELECT *
                FROM vw_emails_pendentes
                WHERE (status_enviado = 0 OR status_enviado > 1)
                AND (notificacao = 1 OR notificacao IS NULL);
                """;

        return jdbcTemplate.query(sql, (rs, row) -> {

            String tipo = rs.getString("tipo");

            String nomeEmpresa = rs.getString("nome_empresa");

            Empresa empresa = nomeEmpresa != null
                    ? new Empresa(nomeEmpresa)
                    : null;

            String nomeProdutor = rs.getString("nome_produtor");

            Produtor produtor = nomeProdutor != null
                    ? new Produtor(nomeProdutor)
                    : null;

            String nomeRoteirista = rs.getString("nome_roteirista");

            String emailDestinatario = rs.getString("email_destinatario");

            Roteirista roteirista = new Roteirista(
                    nomeRoteirista,
                    emailDestinatario
            );

            Feedback feedback = null;

            Object idFeedbackObj = rs.getObject("id_feedback");

            if (idFeedbackObj != null) {
                feedback = new Feedback(
                        ((Number) idFeedbackObj).intValue(),
                        rs.getString("texto_feedback")
                );
            }

            Token token = null;

            String codigoToken = rs.getString("codigo");

            Timestamp expiracaoTs = rs.getTimestamp("expiracao");

            Integer status = rs.getInt("status_enviado");

            if (codigoToken != null) {

                java.time.LocalDateTime expiracao =
                        expiracaoTs != null
                                ? expiracaoTs.toLocalDateTime()
                                : null;

                token = new Token(codigoToken, expiracao);
            }

            return new PendenciaEmailEnvio(
                    tipo,
                    status,
                    empresa,
                    produtor,
                    roteirista,
                    feedback,
                    token
            );
        });
    }

    // Busca produtores que possuem publicações ainda não avaliadas.
    public List<ResumoProdutorEmail> buscarProdutoresPendentes() {

        String sql = """
                SELECT
                    produtor.id,
                    produtor.nome,
                    produtor.email,
                    COUNT(DISTINCT p.id) AS quantidade_pendentes

                FROM usuario produtor

                INNER JOIN publicacao p
                    ON 1 = 1

                INNER JOIN usuario roteirista
                    ON roteirista.id = p.usuario_id

                LEFT JOIN avaliacao a
                    ON a.publicacao_id = p.id
                    AND a.autor_id = produtor.id

                WHERE produtor.perfil_id = 1
                  AND roteirista.perfil_id = 2
                  AND produtor.id_empresa = roteirista.id_empresa

                  AND (produtor.notificacao = 1
                       OR produtor.notificacao IS NULL)

                  AND produtor.dia_resumo_semanal =
                      WEEKDAY(CURDATE()) + 1

                  AND CURTIME() BETWEEN
                      COALESCE(produtor.horario_inicio, '00:00:00')
                      AND
                      COALESCE(produtor.horario_fim, '23:59:59')

                  AND a.id IS NULL

                  AND NOT EXISTS (
                      SELECT 1
                      FROM email_envio_semanal es
                      WHERE es.usuario_id = produtor.id
                        AND es.tipo = 'LEMBRETE_PRODUTOR'
                        AND es.periodo_inicio =
                            DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                  )

                GROUP BY
                    produtor.id,
                    produtor.nome,
                    produtor.email

                HAVING COUNT(DISTINCT p.id) > 0;
                """;

        return jdbcTemplate.query(sql, (rs, row) ->
                new ResumoProdutorEmail(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("email"),
                        rs.getInt("quantidade_pendentes")
                )
        );
    }

    // Busca o resumo das avaliações recebidas pelos roteiristas.
    public List<ResumoRoteiristaEmail> buscarResumosRoteiristas() {

        String sql = """
                SELECT
                    roteirista.id,
                    roteirista.nome,
                    roteirista.email,

                    COUNT(a.id) AS quantidade_avaliacoes,

                    COUNT(DISTINCT p.id) AS publicacoes_avaliadas,

                    ROUND(AVG(a.texto), 1) AS media_avaliacoes

                FROM usuario roteirista

                INNER JOIN publicacao p
                    ON p.usuario_id = roteirista.id

                INNER JOIN avaliacao a
                    ON a.publicacao_id = p.id

                INNER JOIN usuario produtor
                    ON produtor.id = a.autor_id

                WHERE roteirista.perfil_id = 2
                  AND produtor.perfil_id = 1

                  AND produtor.id_empresa = roteirista.id_empresa

                  AND (roteirista.notificacao = 1
                       OR roteirista.notificacao IS NULL)

                  AND roteirista.dia_resumo_semanal =
                      WEEKDAY(CURDATE()) + 1

                  AND CURTIME() BETWEEN
                      COALESCE(roteirista.horario_inicio, '00:00:00')
                      AND
                      COALESCE(roteirista.horario_fim, '23:59:59')

                  AND a.criado_em >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                  AND a.criado_em < NOW()

                  AND NOT EXISTS (
                      SELECT 1
                      FROM email_envio_semanal es
                      WHERE es.usuario_id = roteirista.id
                        AND es.tipo = 'RESUMO_ROTEIRISTA'
                        AND es.periodo_inicio =
                            DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                  )

                GROUP BY
                    roteirista.id,
                    roteirista.nome,
                    roteirista.email

                HAVING COUNT(a.id) > 0;
                """;

        return jdbcTemplate.query(sql, (rs, row) ->
                new ResumoRoteiristaEmail(
                        rs.getInt("id"),
                        rs.getString("nome"),
                        rs.getString("email"),
                        rs.getInt("quantidade_avaliacoes"),
                        rs.getInt("publicacoes_avaliadas"),
                        rs.getDouble("media_avaliacoes")
                )
        );
    }

    // Registra o envio para impedir duplicidade na mesma semana.
    public void marcarEnvioSemanal(
            Integer idUsuario,
            String tipo,
            LocalDate periodoInicio,
            LocalDate periodoFim
    ) {

        String sql = """
                INSERT INTO email_envio_semanal
                    (usuario_id, tipo, periodo_inicio, periodo_fim)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    enviado_em = CURRENT_TIMESTAMP;
                """;

        jdbcTemplate.update(
                sql,
                idUsuario,
                tipo,
                periodoInicio,
                periodoFim
        );
    }
}