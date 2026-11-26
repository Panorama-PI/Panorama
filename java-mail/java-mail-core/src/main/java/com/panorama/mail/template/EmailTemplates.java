package com.panorama.mail.template;

import com.panorama.mail.model.Empresa;
import com.panorama.mail.model.Produtor;
import com.panorama.mail.model.Roteirista;
import com.panorama.mail.model.Token;

public class EmailTemplates {


    public static String htmlFeedback(Roteirista roteirista, Produtor produtor, Empresa empresa){
        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Novo Feedback Recebido</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;\">" +
                "Olá, <strong>" + roteirista.getNome() + "</strong>! A empresa <strong>" + empresa.getNome() + "</strong> informou que há um novo feedback feito pelo produtor <strong>" + produtor.getNome() + "</strong> na sua publicação." +
                "</p>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 30px; margin-bottom: 10px;\">" +
                "Acesse a plataforma <strong>Panorama</strong> para conferir os detalhes e interagir." +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Esta é uma mensagem automática, por favor não responda a este e-mail." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }


    public static String htmlFeedbackEditado(Roteirista roteirista, Produtor produtor, Empresa empresa){
        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Feedback Editado</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;\">" +
                "Olá, <strong>" + roteirista.getNome() + "</strong>! A empresa <strong>" + empresa.getNome() + "</strong> informou que o feedback feito pelo produtor <strong>" + produtor.getNome() + "</strong> na sua publicação foi atualizado." +
                "</p>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 30px; margin-bottom: 10px;\">" +
                "Acesse diretamente a plataforma <strong>Panorama</strong> para conferir as alterações." +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Esta é uma mensagem automática, por favor não responda a este e-mail." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }


    public static String htmlToken(Empresa empresa, Token token){
        return "<div style=\"background-color: #0b0b0b; padding: 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 40px 30px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 10px;\">Código de Verificação</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 30px;\">" +
                "Olá, a empresa " + empresa.getNome() + " solicitou um código de acesso para a sua conta no <strong>Panorama</strong>. Utilize o token abaixo para prosseguir:" +
                "</p>" +

                // <!-- CAIXA DESTAQUE DO TOKEN -->
                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"background-color: #1f1f1f; border: 2px dashed #e50914; border-radius: 8px; margin: 0 auto;\">" +
                "<tr>" +
                "<td style=\"padding: 20px 40px; text-align: center;\">" +
                "<span style=\"font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: bold; color: #ffffff; letter-spacing: 8px;\">" +
                token.getToken() +
                "</span>" +
                "</td>" +
                "</tr>" +
                "</table>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 30px; margin-bottom: 10px;\">" +
                "Este código é válido por 15 minutos" +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Se você não solicitou este código, por favor ignore este e-mail. Nenhuma alteração será feita na sua conta." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }

    public static String htmlAvaliacao(Roteirista roteirista, Produtor produtor, Empresa empresa, double nota) {
        return montarHtmlAvaliacao(
                roteirista,
                produtor,
                empresa,
                nota,
                "Nova Avaliação Recebida",
                "informou que sua publicação recebeu uma nova avaliação feita pelo produtor"
        );
    }

    public static String htmlAvaliacaoEditada(Roteirista roteirista, Produtor produtor, Empresa empresa, double nota) {
        return montarHtmlAvaliacao(
                roteirista,
                produtor,
                empresa,
                nota,
                "Avaliação Editada",
                "informou que a avaliação feita pelo produtor"
        );
    }

    private static String montarHtmlAvaliacao(
            Roteirista roteirista,
            Produtor produtor,
            Empresa empresa,
            double nota,
            String titulo,
            String acaoTexto
    ) {
        // Garante que a nota fique entre 0.0 e 5.0
        double notaLimitada = Math.max(0.0, Math.min(5.0, nota));
        String notaFormatada = String.format(java.util.Locale.US, "%.1f", notaLimitada);
        String estrelasHtml = gerarEstrelasHtml(notaLimitada);

        String complementoFrase = titulo.equals("Avaliação Editada")
                ? " na sua publicação foi atualizada."
                : " na sua publicação.";

        return "<div style=\"background-color: #0b0b0b; padding: 20px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e0e0e0;\">" +
                "<table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%; max-width: 600px; background-color: #141414; border: 1px solid #222222; border-radius: 8px; overflow: hidden;\">" +

                // <!-- CABEÇALHO -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 25px 20px; border-bottom: 3px solid #e50914;\">" +
                "<h1 style=\"color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;\">" +
                "Panorama" +
                "</h1>" +
                "</td>" +
                "</tr>" +

                // <!-- CONTEÚDO PRINCIPAL -->
                "<tr>" +
                "<td style=\"padding: 35px 20px; background-color: #141414; text-align: center;\">" +
                "<h2 style=\"color: #ffffff; font-size: 20px; margin-top: 0; margin-bottom: 12px;\">" + titulo + "</h2>" +
                "<p style=\"color: #b3b3b3; font-size: 15px; line-height: 1.5; margin-top: 0; margin-bottom: 25px;\">" +
                "Olá, <strong>" + roteirista.getNome() + "</strong>! A empresa <strong>" + empresa.getNome() + "</strong> " +
                acaoTexto + " <strong>" + produtor.getNome() + "</strong>" + complementoFrase +
                "</p>" +

                // <!-- CAIXA DESTAQUE DA AVALIAÇÃO (RESPONSIVA) -->
                "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"center\" style=\"width: 100%; max-width: 340px; background-color: #1f1f1f; border: 1px solid #2c2c2c; border-top: 3px solid #f5c518; border-radius: 8px; margin: 0 auto;\">" +
                "<tr>" +
                "<td style=\"padding: 20px 15px; text-align: center;\">" +
                "<div style=\"font-size: 28px; line-height: 1.2; letter-spacing: 4px; margin-bottom: 8px;\">" +
                estrelasHtml +
                "</div>" +
                "<div style=\"font-size: 18px; font-weight: bold; color: #ffffff;\">" +
                notaFormatada + " <span style=\"font-size: 14px; font-weight: normal; color: #888888;\">/ 5.0</span>" +
                "</div>" +
                "</td>" +
                "</tr>" +
                "</table>" +

                "<p style=\"color: #888888; font-size: 13px; margin-top: 28px; margin-bottom: 10px;\">" +
                "Acesse a plataforma <strong>Panorama</strong> para conferir os detalhes da avaliação." +
                "</p>" +
                "<p style=\"color: #777777; font-size: 13px; margin: 0; line-height: 1.4;\">" +
                "Esta é uma mensagem automática, por favor não responda a este e-mail." +
                "</p>" +

                "</td>" +
                "</tr>" +

                // <!-- RODAPÉ -->
                "<tr>" +
                "<td align=\"center\" style=\"background-color: #000000; padding: 20px; border-top: 1px solid #222222;\">" +
                "<p style=\"color: #666666; font-size: 12px; margin: 0;\">" +
                "© 2026 Panorama. Todos os direitos reservados." +
                "</p>" +
                "</td>" +
                "</tr>" +

                "</table>" +
                "</div>";
    }

    private static String gerarEstrelasHtml(double nota) {
        StringBuilder sb = new StringBuilder();
        int estrelasCheias = (int) Math.floor(nota);
        double fracao = nota - estrelasCheias;

        // Se a fração for >= 0.75, arredonda para estrela cheia; entre 0.25 e 0.74, destaca como meia estrela
        if (fracao >= 0.75) {
            estrelasCheias++;
            fracao = 0;
        }
        boolean temMeiaEstrela = (fracao >= 0.25);

        for (int i = 1; i <= 5; i++) {
            if (i <= estrelasCheias) {
                // Estrela cheia (Dourada)
                sb.append("<span style=\"color: #f5c518;\">&#9733;</span>");
            } else if (i == estrelasCheias + 1 && temMeiaEstrela) {
                // Meia estrela (Dourado suave para representar fração)
                sb.append("<span style=\"color: #b89414;\">&#9733;</span>");
            } else {
                // Estrela vazia (Cinza escuro)
                sb.append("<span style=\"color: #3a3a3a;\">&#9733;</span>");
            }
        }
        return sb.toString();
    }
}
