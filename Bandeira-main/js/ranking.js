document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:1880/retornadados")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar dados do ranking");
            }
            return response.text();
        })
        .then(texto => {
            document.getElementById("ranking").textContent = texto;
        })
        .catch(error => {
            document.getElementById("ranking").textContent = "Erro: " + error.message;
        });
});
