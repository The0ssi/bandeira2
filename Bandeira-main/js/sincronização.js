document.addEventListener("DOMContentLoaded", function () {
    var botaoPronto = document.getElementById("jogarBnt"); // ID do botão "Pronto"

    if (botaoPronto) {
        botaoPronto.addEventListener("click", function () {
            // Esconde o botão ao ser clicado
            botaoPronto.style.display = 'none';

            // Envia um GET para informar que o jogador está pronto
            fetch('http://127.0.0.1:1880/pronto')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'ok') {
                        console.log("Todos estão prontos!");
                        iniciarContagem();
                    } else {
                        console.log(data.mensagem); // Mostra "aguardando mais jogadores"
                    }
                })
                .catch(error => {
                    console.error("Erro na comunicação com o servidor:", error);
                });
        });
    }

    function iniciarContagem() {
        var contagemElemento = document.getElementById("contagem");
        var tempoRestante = 5;

        contagemElemento.textContent = `O jogo vai começar em: ${tempoRestante}s`;

        var contador = setInterval(function () {
            tempoRestante--;
            contagemElemento.textContent = `O jogo vai começar em: ${tempoRestante}s`;

            if (tempoRestante <= 0) {
                clearInterval(contador);
                window.location.href = "../html/jogo.html";
            }
        }, 1000);
    }
});
