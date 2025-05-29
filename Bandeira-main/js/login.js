// ~~ VARIAVEL ~~
var botaoJogar = document.getElementById("jogarBnt");

// ~~ DIRECIONAMENTO ~~
document.addEventListener("DOMContentLoaded", function () {
    if (botaoJogar) {
        botaoJogar.addEventListener("click", function () {
            // ~ salvar informações ~
            var nome = document.getElementById("nomeJogador").value;
            if (nome.trim() !== "") {
                localStorage.setItem("nomeJogador", nome);
                window.location.href = "../html/sincronização.html";
            } 
            // ~ alerta ~
            else {
                alert("Por favor, digite seu nome!");
            }
        });
    }
});