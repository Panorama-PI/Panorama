package school.sptech;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.poi.ss.usermodel.*;

public class TratamentoUtils {

    
    public static String repararEncoding(String texto) {
        if (texto == null || texto.isEmpty()) return texto;

        boolean candidatoAMojibake = false;

        
        for (int i = 0; i < texto.length(); i++) {
                 char c = texto.charAt(i);

            
            
            if (c > 0x00FF) {
                
                if (c != '\u20AC' && c != '\u201A' && c != '\u0192' && c != '\u201E' &&
                        c != '\u2026' && c != '\u2020' && c != '\u2021' && c != '\u02C6' &&
                        c != '\u2030' && c != '\u0160' && c != '\u2039' && c != '\u0152' &&
                        c != '\u017D' && c != '\u2018' && c != '\u2019' && c != '\u201C' &&
                        c != '\u201D' && c != '\u2022' && c != '\u2013' && c != '\u2014' &&
                        c != '\u02DC' && c != '\u2122' && c != '\u0161' && c != '\u203A' &&
                        c != '\u0153' && c != '\u017E' && c != '\u0178') {
                    return texto; 
                }
            }

            
            if (c >= 0x0080) {
                candidatoAMojibake = true;
            }
        }

        
        if (!candidatoAMojibake) {
            return texto;
        }

        
        try {
            byte[] bytes = new byte[texto.length()];
            for (int i = 0; i < texto.length(); i++) {
                char c = texto.charAt(i);
                switch (c) {
                    case '\u20AC': bytes[i] = (byte) 0x80; break;
                    case '\u201A': bytes[i] = (byte) 0x82; break;
                    case '\u0192': bytes[i] = (byte) 0x83; break;
                    case '\u201E': bytes[i] = (byte) 0x84; break;
                    case '\u2026': bytes[i] = (byte) 0x85; break;
                    case '\u2020': bytes[i] = (byte) 0x86; break;
                    case '\u2021': bytes[i] = (byte) 0x87; break;
                    case '\u02C6': bytes[i] = (byte) 0x88; break;
                    case '\u2030': bytes[i] = (byte) 0x89; break;
                    case '\u0160': bytes[i] = (byte) 0x8A; break;
                    case '\u2039': bytes[i] = (byte) 0x8B; break;
                    case '\u0152': bytes[i] = (byte) 0x8C; break;
                    case '\u017D': bytes[i] = (byte) 0x8E; break;
                    case '\u2018': bytes[i] = (byte) 0x91; break;
                    case '\u2019': bytes[i] = (byte) 0x92; break;
                    case '\u201C': bytes[i] = (byte) 0x93; break;
                    case '\u201D': bytes[i] = (byte) 0x94; break;
                    case '\u2022': bytes[i] = (byte) 0x95; break;
                    case '\u2013': bytes[i] = (byte) 0x96; break;
                    case '\u2014': bytes[i] = (byte) 0x97; break;
                    case '\u02DC': bytes[i] = (byte) 0x98; break;
                    case '\u2122': bytes[i] = (byte) 0x99; break;
                    case '\u0161': bytes[i] = (byte) 0x9A; break;
                    case '\u203A': bytes[i] = (byte) 0x9B; break;
                    case '\u0153': bytes[i] = (byte) 0x9C; break;
                    case '\u017E': bytes[i] = (byte) 0x9E; break;
                    case '\u0178': bytes[i] = (byte) 0x9F; break;
                    default: bytes[i] = (byte) (c & 0xFF); break; 
                }
            }

            String corrigido = new String(bytes, java.nio.charset.StandardCharsets.UTF_8);

            
            
            
            if (corrigido.contains("\uFFFD")) return texto;

            return corrigido;
        } catch (Exception e) {
            return texto;
        }
    }

    


    public static List<String> extrairGeneros(String textoBruto) {
        List<String> lista = new ArrayList<>();
        if (textoBruto != null) {
            
            String textoReparado = repararEncoding(textoBruto).replace("\u00A0", " ");
            String[] pedacos = textoReparado.split(",");
            for (String pedaco : pedacos) {
                lista.add(pedaco.trim());
            }
        }
        return lista;
    }

    public static List<AtorPersonagem> extrairElenco(String textoBruto) {
        List<AtorPersonagem> lista = new ArrayList<>();
        if (textoBruto != null) {
            
            String textoReparado = repararEncoding(textoBruto);
            String[] pedacos = textoReparado.split(",");
            for (int i = 0; i < pedacos.length - 1; i += 2) {
                lista.add(new AtorPersonagem(pedacos[i].trim(), pedacos[i + 1].trim()));
            }
        }
        return lista;
    }

    
    public static Double extrairMonetario(String valorRaw) {
        if (valorRaw == null) return null;
        try {
            double valor = Double.parseDouble(valorRaw);
            
            if (valor < 1000 || valor == 175269998.8) return null;
            return valor;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static Integer extrairScore(String scoreRaw) {
        if (scoreRaw == null) return null;
        try {
            int score = (int) Double.parseDouble(scoreRaw);
            return score <= 0 ? null : score;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
