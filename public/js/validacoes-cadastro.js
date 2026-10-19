// =====================================================================
// VALIDAÇÕES DO CADASTRO DE EMPRESA + ADMINISTRADOR
//
// Este arquivo é a FONTE ÚNICA das regras. Ele funciona nos dois lados:
//   - no navegador:  <script src="./js/validacoes-cadastro.js"></script>
//                    e depois usa  ValidacoesCadastro.validarCadastroEmpresa(...)
//   - no backend:    require("../../public/js/validacoes-cadastro")
//             
// =====================================================================

(function (raiz, criar) {
    if (typeof module === "object" && module.exports) {
        module.exports = criar();
    } else {
        raiz.ValidacoesCadastro = criar();
    }
})(typeof self !== "undefined" ? self : this, function () {

    var NUMEROS = "0123456789";
    var CHAR_ESPECIAIS = "@!#$%&*_-";
    var LIMITE_NOME_EMPRESA = 120;
    var LIMITE_NOME_ADMIN = 120;
    var LIMITE_EMAIL = 150;
    var DDDS_VALIDOS = [
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28,
        31, 32, 33, 34, 35, 37, 38,
        41, 42, 43, 44, 45, 46, 47, 48, 49,
        51, 53, 54, 55,
        61, 62, 63, 64, 65, 66, 67, 68, 69,
        71, 73, 74, 75, 77, 79,
        81, 82, 83, 84, 85, 86, 87, 88, 89,
        91, 92, 93, 94, 95, 96, 97, 98, 99
    ];

    function contem(texto, conjunto) {
        return Array.from(texto).some(function (c) { return conjunto.indexOf(c) !== -1; });
    }

    function normalizarTexto(valor) {
        return String(valor).replace(/\s+/g, " ").trim();
    }

    // Aceita com ou sem máscara. Desde julho de 2026 a Receita emite CNPJ
    // com letras nas 12 primeiras posições; os 2 últimos são sempre números.
    function limparCnpj(valor) {
        return String(valor).toUpperCase().replace(/[.\-\/\s]/g, "");
    }

    // Dígito verificador: módulo 11, cada caractere vale (código ASCII - 48),
    // então números valem 0-9 e letras valem 17-42.
    function calcularDigitoCnpj(base) {
        var pesos = base.length === 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        var soma = 0;

        for (var i = 0; i < base.length; i++) {
            soma += (base.charCodeAt(i) - 48) * pesos[i];
        }

        var resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    function validarCnpj(valor) {
        var cnpj = limparCnpj(valor);

        if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) return false;

        if (/^(.)\1{13}$/.test(cnpj)) return false;

        var dv1 = calcularDigitoCnpj(cnpj.slice(0, 12));
        var dv2 = calcularDigitoCnpj(cnpj.slice(0, 12) + dv1);

        return cnpj.slice(12) === String(dv1) + String(dv2);
    }

    // TELEFONE
    // Padrão do sistema: celular com DDD = 11 dígitos, 3º dígito sempre 9.
    // Aceita (11) 99999-9999, 11 99999-9999 ou 11999999999.
    function limparTelefone(valor) {
        return String(valor).replace(/[()\s\-]/g, "");
    }

    function validarTelefone(valor) {
        var telefone = limparTelefone(valor);

        if (!/^\d{11}$/.test(telefone)) return false;
        if (DDDS_VALIDOS.indexOf(Number(telefone.slice(0, 2))) === -1) return false;

        return telefone.charAt(2) === "9";
    }

    // EMAIL
    function validarEmail(valor) {
        var email = String(valor).trim().toLowerCase();

        if (email.length > LIMITE_EMAIL) return false;
        if (email.indexOf("..") !== -1) return false;

        var formato = /^[a-z0-9._%+\-]+@[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)*\.[a-z]{2,}$/;
        if (!formato.test(email)) return false;

        var parteLocal = email.split("@")[0];
        return parteLocal.charAt(0) !== "." && parteLocal.charAt(parteLocal.length - 1) !== ".";
    }

    // SENHA
    function validarSenha(senha) {
        var erros = [];

        if (senha.length < 8) erros.push("A senha precisa ter no mínimo 8 caracteres.");
        if (senha.length > 12) erros.push("A senha precisa ter no máximo 12 caracteres.");
        if (!contem(senha, NUMEROS)) erros.push("A senha precisa incluir números.");
        if (!contem(senha, CHAR_ESPECIAIS)) erros.push("A senha precisa incluir caracteres especiais.");
        if (senha.toLowerCase() === senha) erros.push("A senha precisa incluir letras maiúsculas.");
        if (senha.toUpperCase() === senha) erros.push("A senha precisa incluir letras minúsculas.");

        return erros;
    }

    // NOMES
    // Admin: só letras, espaço, apóstrofo, hífen e ponto (sem números nem símbolos).
    function nomePessoaValido(nome) {
        return /^[\p{L}][\p{L} .'’\-]*$/u.test(nome);
    }

    // Empresa: aceita números e pontuação comum,
    // só bloqueia o que costuma ser usado para injetar código.
    function nomeEmpresaValido(nome) {
        return !/[<>"`\\\u0000-\u001f]/.test(nome);
    }

    // CADASTRO COMPLETO
    // Recebe: { nomeEmpresa, cnpj, telefone, nomeAdmin, email, senha, confirmacaoSenha }
    // Devolve: { erros: [mensagens], dados: { valores já limpos } }
    function validarCadastroEmpresa(corpo) {
        var campos = ["nomeEmpresa", "cnpj", "telefone", "nomeAdmin", "email", "senha", "confirmacaoSenha"];
        var erros = [];

        if (corpo === null || typeof corpo !== "object") {
            return { erros: ["Dados enviados em formato inválido."], dados: null };
        }

        for (var i = 0; i < campos.length; i++) {
            var valor = corpo[campos[i]];
            if (valor !== undefined && valor !== null && typeof valor !== "string") {
                return { erros: ["Dados enviados em formato inválido."], dados: null };
            }
        }

        var nomeEmpresa = normalizarTexto(corpo.nomeEmpresa || "");
        var cnpj = String(corpo.cnpj || "").trim();
        var telefone = String(corpo.telefone || "").trim();
        var nomeAdmin = normalizarTexto(corpo.nomeAdmin || "");
        var email = String(corpo.email || "").trim().toLowerCase();
        var senha = corpo.senha || "";
        var confirmacaoSenha = corpo.confirmacaoSenha || "";

        // Campos obrigatórios.
        if (!nomeEmpresa || !cnpj || !telefone || !nomeAdmin || !email || !senha || !confirmacaoSenha) {
            erros.push("Preencha todos os campos obrigatórios.");
        }

        // Empresa.
        if (nomeEmpresa) {
            if (nomeEmpresa.length < 2) erros.push("O nome da empresa precisa ter no mínimo 2 caracteres.");
            if (nomeEmpresa.length > LIMITE_NOME_EMPRESA) erros.push("O nome da empresa pode ter no máximo " + LIMITE_NOME_EMPRESA + " caracteres.");
            if (!nomeEmpresaValido(nomeEmpresa)) erros.push("O nome da empresa contém caracteres inválidos.");
        }

        if (cnpj && !validarCnpj(cnpj)) erros.push("Informe um CNPJ válido.");

        if (telefone && !validarTelefone(telefone)) {
            erros.push("Informe um telefone válido com DDD e 11 dígitos. Exemplo: (11) 99999-9999.");
        }

        // Administrador.
        if (nomeAdmin) {
            if (nomeAdmin.length < 3) erros.push("O nome do administrador precisa ter no mínimo 3 caracteres.");
            if (nomeAdmin.length > LIMITE_NOME_ADMIN) erros.push("O nome do administrador pode ter no máximo " + LIMITE_NOME_ADMIN + " caracteres.");
            if (!nomePessoaValido(nomeAdmin)) erros.push("O nome do administrador não pode incluir números nem caracteres especiais.");
        }

        if (email && !validarEmail(email)) erros.push("Informe um e-mail válido.");

        if (senha) {
            validarSenha(senha).forEach(function (erro) { erros.push(erro); });
        }

        if (senha !== confirmacaoSenha) erros.push("As senhas não conferem.");

        if (erros.length > 0) return { erros: erros, dados: null };

        return {
            erros: [],
            dados: {
                nomeEmpresa: nomeEmpresa,
                cnpj: limparCnpj(cnpj),
                telefone: limparTelefone(telefone),
                nomeAdmin: nomeAdmin,
                email: email,
                senha: senha
            }
        };
    }

    return {
        limparCnpj: limparCnpj,
        limparTelefone: limparTelefone,
        validarCnpj: validarCnpj,
        validarTelefone: validarTelefone,
        validarEmail: validarEmail,
        validarSenha: validarSenha,
        validarCadastroEmpresa: validarCadastroEmpresa
    };
});