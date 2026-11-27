/* =========================
   CONFIGURAÇÃO
========================= */

// nome da chave que o login grava no sessionStorage
const CHAVE_ID_EMPRESA = "ID_EMPRESA";
const FOTO_PADRAO = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
        '<rect width="40" height="40" fill="#3C3C41"/>' +
        '<circle cx="20" cy="15" r="7" fill="#A1A1AA"/>' +
        '<path d="M6 36c0-8 6-12 14-12s14 4 14 12z" fill="#A1A1AA"/>' +
    '</svg>'
);

document.getElementById("foto-admin").src = FOTO_PADRAO;

const idEmpresa = sessionStorage.getItem(CHAVE_ID_EMPRESA);

let usuarios = [];
let indiceParaExcluir = null;
const campoBusca = document.getElementById("busca-funcionarios");
const filtroFuncionarios = document.getElementById("filtro-funcionarios");
const ordenarFuncionarios = document.getElementById("ordenar-funcionarios");

const listaFuncionarios = document.getElementById("lista-funcionarios");
const containerInfos = document.querySelector(".informacoes");


/* =========================
   FUNÇÕES AUXILIARES
========================= */

// evita que um nome com HTML dentro quebre (ou ataque) a página
// Chama a função que preenche a side bar
function escapar(texto) {
    const div = document.createElement("div");
    div.textContent = texto === null || texto === undefined ? "" : texto;
    return div.innerHTML;
}

// se o back respondeu com erro, lê a "mensagem" dele e lança como Error
function tratarResposta(res) {
    if (res.ok) {
        return res;
    }

    return res.json()
        .catch(function () {
            return {};
        })
        .then(function (corpo) {
            throw new Error(corpo.mensagem || "Erro inesperado. Tente novamente.");
        });
}

function mostrarErro(idElemento, mensagem) {
    const elemento = document.getElementById(idElemento);
    elemento.innerText = mensagem;
    elemento.classList.toggle("visivel", mensagem !== "");
}


/* =========================
   TOOLTIP DO CÓDIGO DA EMPRESA
========================= */

const btnInfo = document.querySelector(".btn-info-codigo");
const modalCodigo = document.getElementById("modal-codigo");

btnInfo.onmouseenter = function () {
    modalCodigo.style.display = "flex";
};

btnInfo.onmouseleave = function () {
    modalCodigo.style.display = "none";
};





/* =========================
   INFORMAÇÕES DA EMPRESA
========================= */

function formatarCnpj(valor) {
    const cnpj = String(valor || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (cnpj.length !== 14) return valor || "—";
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
}

function formatarTelefone(valor) {
    const digitos = String(valor || "").replace(/\D/g, "");
    if (digitos.length === 11) {
        return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
    }
    if (digitos.length === 10) {
        return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return valor || "—";
}

function converterData(data) {
    const partes = String(data || "").split("/");
    if (partes.length !== 3) return new Date(data).getTime();
    return new Date(partes[2], partes[1] - 1, partes[0]).getTime();
}

function buscarEmpresa() {
    fetch("/empresas/buscar/" + idEmpresa)
        .then(tratarResposta)
        .then(res => res.json())
        .then(dados => {
            // o model devolve uma lista com 1 item; aceita objeto também
            const empresa = Array.isArray(dados) ? dados[0] : dados;

            if (!empresa) {
                containerInfos.innerText = "Empresa não encontrada.";
                return;
            }

            containerInfos.innerHTML = `
                <div class="informacao-empresa">
                    <span>Nome da Empresa</span>
                    <strong>${escapar(empresa.nome)}</strong>
                </div>
                <div class="informacao-empresa">
                    <span>CNPJ</span>
                    <strong>${escapar(formatarCnpj(empresa.cnpj))}</strong>
                </div>
                <div class="informacao-empresa">
                    <span>Telefone</span>
                    <strong>${escapar(formatarTelefone(empresa.telefone))}</strong>
                </div>
            `;
        })
        .catch(err => {
            console.error("Erro ao buscar a empresa:", err);
            containerInfos.innerText = "Não foi possível carregar as informações da empresa.";
        });
}


/* =========================
   LISTAR FUNCIONÁRIOS
========================= */

function buscarFuncionarios() {
    fetch("/usuarios/listar/" + idEmpresa)
        .then(tratarResposta)
        .then(res => res.json())
        .then(dados => {
            usuarios = dados;
            if (!Array.isArray(usuarios)) usuarios = [];
            listarFuncionarios();
        })
        .catch(err => {
            console.error("Erro ao buscar funcionários:", err);
            listaFuncionarios.innerHTML = `<p class="lista-vazia">Não foi possível carregar os funcionários.</p>`;
        });
}

function listarFuncionarios() {
    listaFuncionarios.innerHTML = "";

    const busca = campoBusca.value.trim().toLocaleLowerCase("pt-BR");
    const filtro = filtroFuncionarios.value.toLocaleLowerCase("pt-BR");
    let exibidos = usuarios.filter(usuario => {
        const texto = `${usuario.nome} ${usuario.email} ${usuario.cargo} ${usuario.status}`.toLowerCase();
        return texto.includes(busca) && (!filtro || String(usuario.cargo).toLowerCase() === filtro || String(usuario.status).toLowerCase() === filtro);
    });

    const ordem = ordenarFuncionarios.value;
    exibidos.sort((a, b) => {
        if (ordem === "nome") return String(a.nome || "").localeCompare(String(b.nome || ""), "pt-BR");
        if (ordem === "nome-desc") return String(b.nome || "").localeCompare(String(a.nome || ""), "pt-BR");
        if (ordem === "data") return converterData(b.data) - converterData(a.data);
        if (ordem === "data-antiga") return converterData(a.data) - converterData(b.data);
        return 0;
    });

    if (exibidos.length === 0) {
        listaFuncionarios.innerHTML = `<p class="lista-vazia">${usuarios.length ? "Nenhum funcionário corresponde à busca ou aos filtros." : "Nenhum funcionário cadastrado ainda."}</p>`;
        return;
    }

    for (const usuario of exibidos) {
        const i = usuarios.indexOf(usuario);
        const foto = usuario.foto || FOTO_PADRAO;

        const card = document.createElement("div");
        card.classList.add("card-funcionario");
        card.innerHTML = `
            <div class="funcionario-nome">
                <img src="${escapar(foto)}" alt="Foto do funcionário">
                <h3>${escapar(usuario.nome)}</h3>
            </div>
            <div>
                <p>${escapar(usuario.email)}</p>
            </div>
            <div>
                <p>${escapar(usuario.cargo)}</p>
            </div>
            <div>
                <p>${escapar(usuario.data)}</p>
            </div>
            <div>
                <p class="status ${escapar(String(usuario.status).toLowerCase())}">
                    ${escapar(usuario.status)}
                </p>
            </div>
            <div>
                <button type="button" class="btn-editar" onclick="abrirModalEditar(${i})">
                    <img src="assets/icon/lapis-icon.png" alt="">
                    Editar
                </button>
                <button type="button" class="btn-excluir" aria-label="Excluir ${escapar(usuario.nome)}" onclick="abrirModalExcluir(${i})"><span aria-hidden="true">🗑️</span> Excluir</button>
            </div>
        `;
        listaFuncionarios.appendChild(card);
    }
}

[campoBusca, filtroFuncionarios, ordenarFuncionarios].forEach(campo => campo.addEventListener("input", listarFuncionarios));
[filtroFuncionarios, ordenarFuncionarios].forEach(campo => campo.addEventListener("change", listarFuncionarios));


/* =========================
   MODAIS (BASE)
========================= */

function abrirModal(idModal) {
    document.getElementById(idModal).classList.add("aberto");
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.remove("aberto");
}


/* =========================
   EDITAR FUNCIONÁRIO
========================= */

function abrirModalEditar(i) {
    document.getElementById("editar-id").value = i;
    document.getElementById("editar-nome").value = usuarios[i].nome;
    document.getElementById("editar-email").value = usuarios[i].email;
    document.getElementById("editar-cargo").value = usuarios[i].cargo;

    mostrarErro("erro-editar", "");
    abrirModal("modal-editar");
}

function salvarEdicao() {
    const i = document.getElementById("editar-id").value;
    const nome = document.getElementById("editar-nome").value.trim();
    const email = document.getElementById("editar-email").value.trim();
    const cargo = document.getElementById("editar-cargo").value;

    if (nome === "" || email === "") {
        mostrarErro("erro-editar", "Preencha o nome e o e-mail.");
        return;
    }

    fetch("/usuarios/editar/" + usuarios[i].id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idEmpresa: idEmpresa,
            nome: nome,
            email: email,
            cargo: cargo
        })
    })
    .then(tratarResposta)
    .then(() => {
        fecharModal("modal-editar");
        buscarFuncionarios();
    })
    .catch(err => {
        console.error("Erro ao editar:", err);
        mostrarErro("erro-editar", err.message);
    });
}


/* =========================
   EXCLUIR FUNCIONÁRIO
========================= */

function abrirModalExcluir(i) {
    indiceParaExcluir = i;
    document.getElementById("excluir-nome").innerText = usuarios[i].nome;

    mostrarErro("erro-excluir", "");
    abrirModal("modal-excluir");
}

function confirmarExclusao() {
    fetch("/usuarios/excluir/" + usuarios[indiceParaExcluir].id + "/" + idEmpresa, {
        method: "DELETE"
    })
    .then(tratarResposta)
    .then(() => {
        fecharModal("modal-excluir");
        indiceParaExcluir = null;
        buscarFuncionarios();
    })
    .catch(err => {
        console.error("Erro ao excluir:", err);
        mostrarErro("erro-excluir", err.message);
    });
}

// fecha os modais com ESC
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        fecharModal("modal-editar");
        fecharModal("modal-excluir");
    }
});


/* =========================
   INICIALIZAÇÃO
========================= */

if (idEmpresa === null) {
    console.error("Chave " + CHAVE_ID_EMPRESA + " não encontrada no sessionStorage.");
    containerInfos.innerText = "Sessão não encontrada. Faça login novamente.";
} else {
    buscarEmpresa();
    buscarFuncionarios();
}

function limparSessao() {
    sessionStorage.clear();
    window.location.replace("login.html");
}
if (typeof preencherUsuario === "function") {
        preencherUsuario();
    }
function preencherUsuario() {
        document.getElementById("a_usuario").textContent =
            sessionStorage.NOME_USUARIO || "Usuário";

        document.getElementById("c_email").textContent =
            sessionStorage.EMAIL_USUARIO || "";

        document.getElementById("b_cargo").textContent =
            ehProdutor ? "Produtor" : "Roteirista";
    }
