let somAcerto = new Audio('../som/acerto.mp3');
let somErro = new Audio('../som/erro.mp3');

let pais;
let bandeira;
let pais_br;

let timerElemento = document.getElementById("timer");
let tempoRestante = 90; // Tempo inicial para a contagem regressiva
let tempoDecorrido = 0; // Tempo que passou desde o início
let intervaloTimer;

let img = document.getElementsByClassName('bandeira');
let frm = document.querySelector('.resposta'); 
let pontuacaoElemento = document.getElementById('pontuacao');
let nome_pais = document.getElementById('nome_pais'); 
let botao = document.querySelector('.bnt'); 

let pontuacao = 0;

document.addEventListener("DOMContentLoaded", () => {
    iniciarTimer();
});

function iniciarTimer() {
    intervaloTimer = setInterval(() => {
        tempoRestante--;  // Subtrai um segundo a cada vez
        tempoDecorrido++; // Conta o tempo que passou desde o início
        timerElemento.innerText = `Timer: ${tempoRestante}s`;

        if (tempoRestante <= 0) { // Se o tempo restante chegar a 0
            pararTimer();
            var nome = localStorage.getItem("nomeJogador");
            if (nome) {
                enviarDadosParaServidor(nome, pontuacao, tempoDecorrido);
            }
            window.location.href = "ranking.html"; // Redireciona para o ranking
        }
    }, 1000);
}

function pararTimer() {
    clearInterval(intervaloTimer);
}

fetch('https://restcountries.com/v2/all')
    .then(response => response.json())
    .then(data => {
        api = data;
        sortPais(); 
    });

function sortPais() {    
    const paisAleatorio = api[Math.floor(Math.random() * api.length)];

    pais = paisAleatorio.name;
    bandeira = paisAleatorio.flags.png;
    pais_br = paisAleatorio.translations.pt;

    img[0].src = bandeira;
    nome_pais.innerText = pais_br;
}

botao.addEventListener("click", () => {
    let resposta_pais = frm.value.trim();
    const etapas = document.querySelectorAll(".etapa");

    if (rodadaAtual < 10) {
        if (resposta_pais.toLowerCase() === pais_br.toLowerCase()) {
            pontuacao += 10;
            etapas[rodadaAtual].classList.add("acertou");
            somAcerto.play(); // Toca som de acerto
        } else {
            pontuacao -= 5;
            etapas[rodadaAtual].classList.add("errou");
            somErro.play(); // Toca som de erro
        }

        pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
        frm.value = "";
        rodadaAtual++;

        if (rodadaAtual < 10) {
            sortPais();
        } else {
            pararTimer(); 
            var nome = localStorage.getItem("nomeJogador");
            if (nome) {
                enviarDadosParaServidor(nome, pontuacao, tempoDecorrido);
            }
            window.location.href = "ranking.html"; // Redireciona para o ranking
        }
    }
});

let rodadaAtual = 0;

function atualizarBarraProgresso() {
    const etapas = document.querySelectorAll(".etapa");

    etapas.forEach((etapa, index) => {
        if (index < rodadaAtual) {
            etapa.classList.add("ativa");
        } else {
            etapa.classList.remove("ativa");
        }
    });
}

// Captura o evento de pressionar tecla (para enviar a resposta com "Enter")
frm.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); 
        botao.click(); 
    }
});

const btnFechar = document.querySelector('.bnnt');
const modal = document.getElementById('modal');
const cancelar = document.getElementById('cancelar');
const confirmar = document.getElementById('confirmar');
btnFechar.addEventListener('click', () => {
    modal.style.display = 'flex';
});
cancelar.addEventListener('click', () => {
    modal.style.display = 'none';
});
confirmar.addEventListener('click', () => {
    window.location.href = '../index.html'; 
});

function enviarDadosParaServidor(nome, pontos, tempo) {
    const url = `http://127.0.0.1:1880/recebedados?jogador=${encodeURIComponent(nome)}&pontos=${pontos}&tempo=${tempo}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log("Dados enviados com sucesso!");
            } else {
                console.error("Erro ao enviar dados para o servidor.");
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
}