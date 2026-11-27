package com.panorama.cronjob.dao;

import com.panorama.cronjob.model.PendenciaEmailEnvioCron;
import com.panorama.mail.config.ConnectionProvider;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;

public class CronDao {

  ConnectionProvider connectionProvider = new ConnectionProvider();
  public JdbcTemplate jdbcTemplate = connectionProvider.getConnection();

  public List<PendenciaEmailEnvioCron> verificarPublicacoes() {
    String sql = """
            SELECT\s
                produtor.id              AS id_produtor,
                produtor.nome            AS nome_produtor,
                produtor.email           AS email_produtor,
                e.nome                   AS nome_empresa,
                p.id                     AS id_publicacao,
                p.titulo                 AS titulo_publicacao,
                p.criado_em              AS data_publicacao,
                roteirista.nome          AS nome_roteirista,
                proj.nome                AS nome_projeto
            FROM usuario produtor
            INNER JOIN empresa e\s
                ON e.id = produtor.id_empresa
            INNER JOIN usuario roteirista\s
                ON roteirista.id_empresa = e.id\s
                AND roteirista.id <> produtor.id
            INNER JOIN publicacao p\s
                ON p.usuario_id = roteirista.id
            LEFT JOIN projeto proj\s
                ON proj.id = p.projeto_id
            LEFT JOIN feedback f\s
                ON f.publicacao_id = p.id
            WHERE\s
                produtor.perfil_id = 2
                AND produtor.notificacao = 1
                AND produtor.dia_resumo_semanal = DAYOFWEEK(CURDATE())
                AND (produtor.ultimo_resumo_enviado IS NULL OR produtor.ultimo_resumo_enviado < CURDATE())
                AND (produtor.horario_inicio IS NULL OR CURTIME() >= produtor.horario_inicio)
                AND (produtor.horario_fim IS NULL OR CURTIME() <= produtor.horario_fim)
                AND p.criado_em >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                AND f.id IS NULL
            ORDER BY produtor.id, p.criado_em DESC;
        """;

    return JdbcTemplate.query(sql, rs -> {
      Map<Integer, PendenciaEmailEnvioCron> agrupadoPorProdutor = new LinkedHashMap<>();

      while (rs.next()) {
        Integer idProdutor = rs.getInt("id_produtor");

        PendenciaEmailEnvioCron pendente = agrupadoPorProdutor.get(idProdutor);
        if (pendente == null) {    
                    
        }

      }
    });

  }

}
