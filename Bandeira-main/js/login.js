document.addEventListener("DOMContentLoaded", function () {
    var botaoJogar = document.getElementById("jogarBnt");
    if (botaoJogar) {
        botaoJogar.addEventListener("click", function () {
            var nome = document.getElementById("nomeJogador").value;
            if (nome.trim() !== "") {
                localStorage.setItem("nomeJogador", nome);
                window.location.href = "../html/sincronização.html";
            } else {
                alert("Por favor, digite seu nome!");
            }
        });
    }
});