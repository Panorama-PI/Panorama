package com.panorama.cronjob.template;

import java.util.List;
import java.time.DayOfWeek;

import com.panorama.cronjob.model.Publicacao;
import com.panorama.mail.model.Empresa;
import com.panorama.mail.model.Produtor;

public class EmailTemplate {

    public static String htmlResumoPublicacoesPendentes(Produtor produtor, Empresa empresa,
            List<Publicacao> publicacoes) {
        StringBuilder listaPublicacoesHtml = new StringBuilder();

        for (Publicacao pub : publicacoes) {
            String diaFormatado = formatarDiaSemanaPtBr(pub.getDiaSemana());
            String nomeRoteirista = (pub.getRoteirista() != null && pub.getRoteirista().getNome() != null)
                    ? pub.getRoteirista().getNome()
                    : "Roteirista";

            listaPublicacoesHtml.append(
                    "<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color: #1c1c1c; border: 1px solid #2a2a2a; border-left: 3px solid #e50914; border-radius: 6px; margin-bottom: 12px;\">"
                            +
                            "<tr>" +
                            "<td style=\"padding: 15px 18px; text-align: left;\">" +
                            "<p style=\"color: #ffffff; font-size: 15px; font-weight: bold; margin: 0 0 6px 0;\">" +
                            pub.getNome() +
                            "</p>" +
                            "<p style=\"color: #b3b3b3; font-size: 13px; margin: 0;\">" +
                            "Roteirista: <strong style=\"color: #e0e0e0;\">" + nomeRoteirista
                            + "</strong> &bull; Publicado em: <span style=\"color: #e50914;\">" + diaFormatado
                            + "</span>" +
                            "</p>" +
                            "</td>" +
                            "</tr>" +
                            "</table>");
        }

        int total = publicacoes.size();
        String textoQuantidade = (total == 1)
                ? "1 publicação aguardando seu feedback"
                : total + " publicações aguardando seu feedback";

        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">"
                +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">"
                +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">"
                +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">"
                +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Resumo Semanal de Pendências</h2>"
                +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 25px;\">" +
                "Olá, <strong>" + produtor.getNome() + "</strong>! Na empresa <strong>" + empresa.getNome()
                + "</strong>, você possui <strong>" + textoQuantidade + "</strong> nos últimos 7 dias:" +
                "</p>" +

                // <!-- LISTA DE PUBLICAÇÕES -->
                "<div style=\"margin-bottom: 25px;\">" +
                listaPublicacoesHtml.toString() +
                "</div>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 25px; margin-bottom: 10px;\">" +
                "Acesse a plataforma <strong>Panorama</strong> para avaliar os roteiros e enviar seus feedbacks." +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Esta é uma mensagem automática, por favor não responda a este e-mail." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">"
                +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }

    private static String formatarDiaSemanaPtBr(DayOfWeek diaSemana) {
        if (diaSemana == null)
            return "Data não informada";
        return switch (diaSemana) {
            case SUNDAY -> "Domingo";
            case MONDAY -> "Segunda-feira";
            case TUESDAY -> "Terça-feira";
            case WEDNESDAY -> "Quarta-feira";
            case THURSDAY -> "Quinta-feira";
            case FRIDAY -> "Sexta-feira";
            case SATURDAY -> "Sábado";
        };
    }
}
