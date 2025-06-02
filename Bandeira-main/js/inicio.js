// ~~ VARIAVEIL ~~
var botaoJogar = document.getElementById("jogarBnt");

// ~ botão de direcionamento - login ~
document.addEventListener("DOMContentLoaded", function () {

    if (botaoJogar) {
        botaoJogar.addEventListener("click", function () {
            window.location.href = "html/login.html";
        });
    }

});

