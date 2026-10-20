dadosMockados();

function dadosMockados(){
    const dados = [
            {
                "id": 1,
                "titulo": "Entre Linhas",
                "genero": "Drama",
                "tema": "Relações familiares",
                "roteirista": "Ana Ribeiro",
                "premissa": "Premissa sobre escolhas e consequências."
            },
            {
                "id": 2,
                "titulo": "Última Estação",
                "genero": "Suspense",
                "tema": "Mistério",
                "roteirista": "Lucas Martins",
                "premissa": "Um desaparecimento conecta histórias da cidade."
            },
            {
                "id": 3,
                "titulo": "Sons do Silêncio",
                "genero": "Drama",
                "tema": "Superação",
                "roteirista": "Camila Duarte",
                "premissa": "Um pianista clássico perde a audição e tenta reconstruir a sua carreira através de memórias sensoriais."
            },
            {
                "id": 4,
                "titulo": "Circuito Fechado",
                "genero": "Ficção Científica",
                "tema": "Inteligência Artificial",
                "roteirista": "Rodrigo Neves",
                "premissa": "Num complexo residencial automatizado, os moradores descobrem que estão a ser controlados por um algoritmo autónomo."
            },
            {
                "id": 5,
                "titulo": "Sombra e Cinzas",
                "genero": "Suspense",
                "tema": "Investigação Criminal",
                "roteirista": "Beatriz Fonseca",
                "premissa": "Uma investigadora aposentada é forçada a rever um caso antigo quando novos indícios surgem na sua antiga cidade natal."
            },
            {
                "id": 6,
                "titulo": "O Último Voo do Falcão",
                "genero": "Ação",
                "tema": "Espionagem",
                "roteirista": "Tiago Albuquerque",
                "premissa": "Um piloto clandestino envolve-se numa teia de chantagens diplomáticas ao transportar uma carga secreta através de fronteiras."
            },
            {
                "id": 7,
                "titulo": "Aquarela Noturna",
                "genero": "Romance",
                "tema": "Encontros e Desencontros",
                "roteirista": "Mariana Lopes",
                "premissa": "Dois artistas desconhecidos encontram-se todas as madrugadas no mesmo metro para desenhar passageiros anónimos."
            },
            {
                "id": 8,
                "titulo": "Raízes do Tempo",
                "genero": "Épico / Histórico",
                "tema": "Luta e Herança",
                "roteirista": "Gabriel Santana",
                "premissa": "A saga de três gerações de uma família na tentativa de proteger as suas terras durante o início da revolução industrial."
            }
    ];

    const cardsContainer = document.querySelector('.cards-publicacoes');

    dados.forEach(dado => {
        cardsContainer.innerHTML += `
            <div class="card-publicacao">
                <div class="card-coluna info-projeto">
                    <h2>${dado.titulo}</h2>
                    <div class="tags">
                        <span class="tag-verde">${dado.genero}</span>
                        <span class="ponto">•</span>
                        <span class="tag-verde">${dado.tema}   </span>
                    </div>
                </div>

                <div class="card-coluna autor-premissa">
                    <span class="autor">Por: ${dado.roteirista}</span>
                    <p class="premissa">${dado.premissa}</p>
                </div>

                <div class="card-coluna acao">
                    <a href="#" class="btn-outline">Abrir projeto</a>
                </div>
            </div>
        `;
    });
}