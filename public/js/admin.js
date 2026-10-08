const usuarios = [
    {
        nome: "João Silva",
        email: "joao@exemplo.com",
        tipo: "Produtor",
        data: "15/09/2025",
        status: "Ativo",
        foto: "assets/imgs/gabril.jpg"
    },
    {
        nome: "Maria Souza",
        email: "maria@exemplo.com",
        tipo: "Roteirista",
        data: "20/09/2025",
        status: "Ativo",
        foto: "assets/imgs/larissa.jpg"
    },
    {
        nome: "Pedro Santos",
        email: "pedro@exemplo.com",
        tipo: "Produtor",
        data: "22/09/2025",
        status: "Inativo",
        foto: "assets/imgs/david.jpg"
    },
    {
        nome: "Vitor Campos",
        email: "vitor@exemplo.com",
        tipo: "Roteirista",
        data: "02/10/2025",
        status: "Inativo",
        foto: "assets/imgs/matheus.jpg"
    }
];

const listaFuncionarios = document.getElementById("lista-funcionarios");

for (let i = 0; i < usuarios.length; i++) {
    const card = document.createElement("div");
    card.classList.add("card-funcionario");
    card.innerHTML = `
        <div class="funcionario-nome">
            <img src="${usuarios[i].foto}" alt="Foto do funcionário">
            <h3>${usuarios[i].nome}</h3>
        </div>
        <div>    
            <p>${usuarios[i].email}</p>
        </div>
        <div>
            <p>${usuarios[i].tipo}</p>
        </div>
        <div>
            <p>${usuarios[i].data}</p>
        </div>
        <div>
            <p class="status ${usuarios[i].status.toLowerCase()}">
                ${usuarios[i].status}
            </p>
        </div>
        <div>
            <button class="btn-editar">
                <img src="assets/icon/lapis-icon.png" alt="">
                Editar
            </button>
            <button class="btn-excluir">Excluir</button>
        </div>
    `;
    listaFuncionarios.appendChild(card);
}