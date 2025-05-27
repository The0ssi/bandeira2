document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:1880/retornadados")
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar dados do ranking");
            return response.text();
        })
        .then(dados => {
            const container = document.getElementById("ranking");
            const jogadores = dados.match(/\d+°\s+[^:]+:\s+-?\d+\s+pontos\s+em\s+\d+seg/g);
            if (!jogadores) {
                container.innerHTML = "<p>Nenhum dado encontrado.</p>";
                return;
            }

            const listaJogadores = jogadores.map((jogador, index) => {
                const match = jogador.match(/(\d+)°\s+([^:]+):\s+(-?\d+)\s+pontos\s+em\s+(\d+)seg/);
                if (!match) return null;
                const [, pos, nome, pontos, tempo] = match;
                return { pos: Number(pos), nome, pontos: Number(pontos), tempo: Number(tempo) };
            }).filter(Boolean);

            // Construir pódio (até 3 jogadores)
            // Construir pódio (em ordem visual 2º - 1º - 3º)
            const podioHTML = `
            <div class="podio">
                ${[2, 1, 3].map(pos => {
                    const jogador = listaJogadores.find(j => j.pos === pos);
                    const classes = ["segundo", "primeiro", "terceiro"];
                    return jogador
                        ? `<div class="coluna ${classes[[2, 1, 3].indexOf(pos)]}">
                            <div class="posicao">${pos}°</div>
                            <div class="nome">${jogador.nome}</div>
                        </div>`
                        : '';
                }).join('')}
            </div>
            `;


            // Construir lista completa
            // Lista de jogadores (com posições numeradas)
            const listaHTML = listaJogadores.map(jogador => `
                <div class="linha-ranking">
                    <div class="bolinha">${jogador.pos}</div>
                    <div class="info-nome">${jogador.nome}</div>
                    <div class="info">${jogador.pontos} pontos</div>
                    <div class="info">${jogador.tempo}</div>
                </div>
            `).join('');


            container.innerHTML = podioHTML + listaHTML;
        })
        .catch(error => {
            document.getElementById("ranking").textContent = "Erro: " + error.message;
        });
});
