document.addEventListener("DOMContentLoaded", function() {

    // Recupera o nome salvo no login
    const nome = localStorage.getItem("nomeJogador");
    console.log("Nome recuperado:", nome);

    // Seleciona a lista onde vai mostrar os jogadores
    const list = document.getElementById('playersList');

    // Cria a conexão com o WebSocket
    const ws = new WebSocket("ws://10.106.208.42:1880/ws/sala");  // Altere se o Node-RED estiver em outro IP ou porta

    // Quando conectar com sucesso
    ws.onopen = () => {
        console.log("✅ WebSocket conectado!");
        
        const payload = { acao: "entrar", nome: nome };  // <<< CRIAR AQUI!
        
        console.log("Enviando dados:", payload);
        ws.send(JSON.stringify(payload));
    };

    // Se der algum erro
    ws.onerror = (error) => {
        console.error("❌ Erro no WebSocket:", error);
    };

    // Se o WebSocket for fechado
    ws.onclose = () => {
        console.warn("⚠️ WebSocket foi fechado.");
    };

    // Quando receber uma mensagem do servidor
    ws.onmessage = (event) => {
        console.log("📨 Mensagem recebida:", event.data);
        const data = JSON.parse(event.data);

        // Atualiza a lista de jogadores na tela
        updatePlayerList(data.players);

        // Se o servidor mandar o sinal, redireciona pro jogo
        if (data.sinal) {
            window.location.replace("../html/jogo.html");
        }
    };

    // Antes de fechar a aba, avisa o servidor que está saindo
    window.addEventListener("beforeunload", function() {
        console.log("Saindo da sala...");
        ws.send(JSON.stringify({ acao: "sair", nome: nome }));
    });

    // Função para atualizar a lista de jogadores na tela
    function updatePlayerList(players) {
        list.innerHTML = "";  // limpa a lista
        players.forEach(player => {
            const li = document.createElement("li");
            li.innerText = player;
            list.appendChild(li);
        });
    }

});
