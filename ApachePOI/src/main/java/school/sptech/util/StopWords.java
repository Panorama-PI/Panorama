package school.sptech.util;

import java.util.Set;

public final class StopWords {

    private StopWords() {
    }

    private static final Set<String> GRAMATICAIS = Set.of(
            "a", "about", "above", "after", "again", "against", "all", "almost",
            "also", "am", "an", "and", "any", "are", "aren", "as",
            "at", "be", "because", "been", "before", "being", "below", "between",
            "both", "but", "by", "can", "cannot", "could", "couldn", "did",
            "didn", "do", "does", "doesn", "doing", "don", "down", "during",
            "each", "either", "else", "ever", "every", "few", "for", "from",
            "further", "had", "hadn", "has", "hasn", "have", "haven", "having",
            "he", "her", "here", "hers", "herself", "him", "himself", "his",
            "how", "however", "i", "if", "in", "into", "is", "isn",
            "it", "its", "itself", "just", "let", "me", "more", "most",
            "much", "my", "myself", "neither", "no", "nor", "not", "now",
            "of", "off", "on", "once", "only", "or", "other", "ought",
            "our", "ours", "ourselves", "out", "over", "own", "per", "same",
            "shan", "she", "should", "shouldn", "so", "some", "such", "than",
            "that", "the", "their", "theirs", "them", "themselves", "then", "there",
            "these", "they", "this", "those", "though", "through", "thus", "to",
            "too", "toward", "towards", "under", "until", "up", "upon", "us",
            "very", "via", "was", "wasn", "we", "were", "weren", "what",
            "when", "whenever", "where", "whether", "which", "while", "who", "whom",
            "whose", "why", "will", "with", "within", "without", "won", "would",
            "wouldn", "yet", "you", "your", "yours", "yourself", "yourselves"
    );


    private static final Set<String> GENERICAS = Set.of(
            "one", "two", "three", "four", "five", "first", "second",
            "still", "soon", "back",
            "find", "finds", "found", "finding",
            "become", "becomes", "became", "becoming",
            "take", "takes", "took", "taking",
            "begin", "begins", "began",
            "make", "makes", "made", "making",
            "get", "gets", "got", "getting",
            "must", "may", "might", "shall",
            "help", "helps", "tries", "try", "trying", "way"
    );

    public static boolean ehStopWord(String palavraMinuscula) {
        return GRAMATICAIS.contains(palavraMinuscula) || GENERICAS.contains(palavraMinuscula);
    }
}
