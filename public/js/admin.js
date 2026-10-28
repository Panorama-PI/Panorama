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

const listaFuncionarios = document.getElementById("lista-funcionarios");
const containerInfos = document.querySelector(".informacoes");


/* =========================
   FUNÇÕES AUXILIARES
========================= */

// evita que um nome com HTML dentro quebre (ou ataque) a página
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
                    <strong>${escapar(empresa.cnpj)}</strong>
                </div>
                <div class="informacao-empresa">
                    <span>Telefone</span>
                    <strong>${escapar(empresa.telefone)}</strong>
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
            listarFuncionarios();
        })
        .catch(err => {
            console.error("Erro ao buscar funcionários:", err);
            listaFuncionarios.innerHTML = `<p class="lista-vazia">Não foi possível carregar os funcionários.</p>`;
        });
}

function listarFuncionarios() {
    listaFuncionarios.innerHTML = "";

    if (usuarios.length === 0) {
        listaFuncionarios.innerHTML = `<p class="lista-vazia">Nenhum funcionário cadastrado ainda.</p>`;
        return;
    }

    for (let i = 0; i < usuarios.length; i++) {
        const foto = usuarios[i].foto || FOTO_PADRAO;

        const card = document.createElement("div");
        card.classList.add("card-funcionario");
        card.innerHTML = `
            <div class="funcionario-nome">
                <img src="${escapar(foto)}" alt="Foto do funcionário">
                <h3>${escapar(usuarios[i].nome)}</h3>
            </div>
            <div>
                <p>${escapar(usuarios[i].email)}</p>
            </div>
            <div>
                <p>${escapar(usuarios[i].cargo)}</p>
            </div>
            <div>
                <p>${escapar(usuarios[i].data)}</p>
            </div>
            <div>
                <p class="status ${escapar(String(usuarios[i].status).toLowerCase())}">
                    ${escapar(usuarios[i].status)}
                </p>
            </div>
            <div>
                <button type="button" class="btn-editar" onclick="abrirModalEditar(${i})">
                    <img src="assets/icon/lapis-icon.png" alt="">
                    Editar
                </button>
                <button type="button" class="btn-excluir" onclick="abrirModalExcluir(${i})">Excluir</button>
            </div>
        `;
        listaFuncionarios.appendChild(card);
    }
}


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