(function () {
    var idProdutor = sessionStorage.ID_USUARIO;
    var baseUrl = "/publicacoes/produtor/" + encodeURIComponent(idProdutor) + "/notificacao";
    var painel = document.getElementById("sino-painel");
    var botao = document.getElementById("sino-botao");
    var mensagem = document.getElementById("sino-mensagem");
    var preferenciasMensagem = document.getElementById("preferencias-mensagem");
    var inicio = document.getElementById("horario-inicio");
    var fim = document.getElementById("horario-fim");

    function erroDaResposta(resposta) {
        return resposta.json().then(function (corpo) {
            throw new Error(corpo.mensagem || "Não foi possível atualizar as notificações.");
        });
    }

    function desenhar(ativo) {
        ativo = ativo === true || ativo === 1 || ativo === "1";
        painel.classList.toggle("sino-ativo", ativo);
        botao.setAttribute("aria-checked", ativo ? "true" : "false");
        document.getElementById("sino-estado").textContent = ativo ? "Ativado" : "Desativado";
        document.getElementById("sino-status").textContent = ativo
            ? "Você optou por receber notificações por e-mail."
            : "Você optou por não receber notificações por e-mail.";
    }

    function preencher(preferencias) {
        inicio.value = preferencias.horario_inicio ? String(preferencias.horario_inicio).substring(0, 5) : "";
        fim.value = preferencias.horario_fim ? String(preferencias.horario_fim).substring(0, 5) : "";
    }

    fetch(baseUrl, { cache: "no-store" })
        .then(function (resposta) { return resposta.ok ? resposta.json() : erroDaResposta(resposta); })
        .then(function (corpo) { desenhar(corpo.notificacao); preencher(corpo.preferencias || {}); })
        .catch(function (erro) {
            console.error("Erro ao carregar notificações do produtor:", erro);
            mensagem.textContent = "Não foi possível carregar as suas preferências de notificação.";
        })
        .finally(function () { botao.disabled = false; });

    botao.addEventListener("click", function () {
        var ativo = botao.getAttribute("aria-checked") === "true";
        botao.disabled = true;
        mensagem.textContent = "";
        fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ativo: !ativo })
        })
            .then(function (resposta) { return resposta.ok ? resposta.json() : erroDaResposta(resposta); })
            .then(function (corpo) { desenhar(corpo.notificacao); mensagem.textContent = corpo.mensagem || "Preferência atualizada."; })
            .catch(function (erro) { desenhar(ativo); mensagem.textContent = erro.message || "Não foi possível atualizar as notificações."; })
            .finally(function () { botao.disabled = false; });
    });

    var configurar = document.getElementById("btn-configurar-preferencias");
    configurar.addEventListener("click", function () {
        var abrir = configurar.getAttribute("aria-expanded") !== "true";
        configurar.setAttribute("aria-expanded", abrir ? "true" : "false");
        document.getElementById("sino-preferencias").hidden = !abrir;
        configurar.innerHTML = (abrir ? "Fechar configurações" : "Configurar notificações") +
            ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    });

    document.getElementById("btn-salvar-preferencias").addEventListener("click", function (evento) {
        var salvar = evento.currentTarget;
        preferenciasMensagem.textContent = "";
        if (!inicio.value || !fim.value || inicio.value >= fim.value) {
            preferenciasMensagem.textContent = "Informe horários válidos; o horário final deve ser maior que o inicial.";
            return;
        }
        salvar.disabled = true;
        fetch(baseUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ horario_inicio: inicio.value, horario_fim: fim.value })
        })
            .then(function (resposta) { return resposta.ok ? resposta.json() : erroDaResposta(resposta); })
            .then(function (corpo) {
                preencher(corpo.preferencias || { horario_inicio: inicio.value, horario_fim: fim.value });
                preferenciasMensagem.textContent = corpo.mensagem || "Preferências salvas com sucesso.";
            })
            .catch(function (erro) { preferenciasMensagem.textContent = erro.message || "Não foi possível salvar as preferências."; })
            .finally(function () { salvar.disabled = false; });
    });
})();
