document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("ranking");

    // Conecta ao WebSocket do Node-RED
    const ws = new WebSocket("ws://10.106.208.42:1880/ws/ranking");

    // Quando a conexão for aberta, envia uma mensagem para solicitar os dados
    ws.onopen = function () {
        ws.send("solicitar_dados_ranking");
    };

    // Quando receber dados do servidor
    ws.onmessage = function (event) {
        const dados = event.data;

        const jogadores = dados.match(/\d+°\s+[^:]+:\s+-?\d+\s+pontos\s+em\s+\d+seg/g);
        if (!jogadores) {
            container.innerHTML = "<p>Nenhum dado encontrado.</p>";
            return;
        }

        const listaJogadores = jogadores.map(jogador => {
            const match = jogador.match(/(\d+)°\s+([^:]+):\s+(-?\d+)\s+pontos\s+em\s+(\d+)seg/);
            if (!match) return null;
            const [, pos, nome, pontos, tempo] = match;
            return { pos: Number(pos), nome, pontos: Number(pontos), tempo: Number(tempo) };
        }).filter(Boolean);

        const podioHTML = `
            <div class="podio">
                ${[2, 1, 3].map(pos => {
                    const jogador = listaJogadores.find(j => j.pos === pos);
                    const classes = ["segundo", "primeiro", "terceiro"];
                    return jogador
                        ? `<div class="coluna ${classes[[2, 1, 3].indexOf(pos)]}">
                            <div class="posicao">${pos}°</div>
                            <div class="nome">${jogador.nome}</div>
                        </div>` : '';
                }).join('')}
            </div>
        `;

        const listaHTML = listaJogadores.map(jogador => `
            <div class="linha-ranking">
                <div class="bolinha">${jogador.pos}</div>
                <div class="info-nome">${jogador.nome}</div>
                <div class="info">${jogador.pontos} pontos</div>
                <div class="info">${jogador.tempo}</div>
            </div>
        `).join('');

        container.innerHTML = podioHTML + listaHTML;
    };

    // Em caso de erro na conexão
    ws.onerror = function (error) {
        container.innerHTML = "<p>Erro na conexão WebSocket.</p>";
        console.error("WebSocket error:", error);
    };

    // Em caso de desconexão
    ws.onclose = function () {
        console.warn("WebSocket desconectado.");
    };
});
