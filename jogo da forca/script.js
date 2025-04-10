const words = [
    // Programação e Tecnologia
    "javascript", "python", "java", "typescript", "ruby", "php", "swift", "kotlin", "rust", "golang",
    "react", "angular", "vue", "node", "express", "django", "flask", "spring", "laravel", "bootstrap",
    "mongodb", "mysql", "postgresql", "oracle", "firebase", "aws", "azure", "docker", "kubernetes", "redis",
    "algoritmo", "variavel", "funcao", "classe", "objeto", "metodo", "heranca", "polimorfismo", "interface", "abstrato",
    "frontend", "backend", "fullstack", "api", "rest", "graphql", "websocket", "http", "ssl", "cache",
    
    // Hardware e Dispositivos
    "processador", "memoria", "placa", "monitor", "teclado", "mouse", "impressora", "scanner", "webcam", "pendrive",
    "smartphone", "tablet", "notebook", "desktop", "servidor", "roteador", "modem", "switch", "cabo", "bluetooth",
    
    // Empresas e Marcas
    "microsoft", "apple", "google", "amazon", "facebook", "netflix", "spotify", "twitter", "linkedin", "samsung",
    "intel", "amd", "nvidia", "dell", "hp", "lenovo", "asus", "acer", "xiaomi", "huawei",
    
    // Sistemas e Plataformas
    "windows", "linux", "macos", "android", "ios", "chrome", "firefox", "safari", "edge", "opera",
    "ubuntu", "debian", "fedora", "centos", "mint", "arch", "redhat", "suse", "kali", "manjaro",
    
    // Redes e Internet
    "internet", "intranet", "ethernet", "wifi", "protocolo", "servidor", "cliente", "dominio", "hosting", "backup",
    "firewall", "proxy", "vpn", "dns", "ftp", "ssh", "telnet", "email", "spam", "virus",
    
    // Desenvolvimento Web
    "html", "css", "sass", "less", "webpack", "babel", "jquery", "ajax", "xml", "json",
    "responsivo", "framework", "biblioteca", "componente", "template", "layout", "grid", "flex", "modal", "menu",
    
    // Segurança
    "criptografia", "senha", "token", "autenticacao", "autorizar", "certificado", "malware", "ransomware", "phishing", "backdoor",
    
    // Conceitos Gerais
    "algoritmo", "debug", "compilar", "interpretar", "executar", "otimizar", "refatorar", "testar", "deployar", "versionar",
    "commit", "branch", "merge", "pull", "push", "fork", "clone", "issue", "release", "tag",
    
    // Novas Tecnologias
    "blockchain", "bitcoin", "ethereum", "nft", "metaverso", "realidade", "virtual", "aumentada", "inteligencia", "artificial",
    "machine", "learning", "chatbot", "biometria", "quantum", "drone", "robo", "sensor", "iot", "wearable"
];

let chosenWord, displayWord, attempts, score, timer, playerName;
const maxAttempts = 6;
const timeLimit = 60;
let timeLeft;
let currentWord = '';
let guessedLetters = new Set();
let hintUsed = false;
const HINT_PENALTY = 50;

// Estrutura do banco de dados
let scoresDB = {
    scores: []
};

// Carregar dados do localStorage
function loadDatabase() {
    const savedData = localStorage.getItem('hangmanDB');
    if (savedData) {
        scoresDB = JSON.parse(savedData);
    }
}

// Salvar dados no localStorage
function saveDatabase() {
    localStorage.setItem('hangmanDB', JSON.stringify(scoresDB));
}

// Função para salvar pontuação
function saveScore(name, score) {
    loadDatabase();
    
    // Verifica se o jogador já existe
    const existingPlayerIndex = scoresDB.scores.findIndex(player => player.name === name);
    
    if (existingPlayerIndex !== -1) {
        // Se o jogador já existe, atualiza apenas se a pontuação for maior
        if (score > scoresDB.scores[existingPlayerIndex].score) {
            scoresDB.scores[existingPlayerIndex].score = score;
        }
    } else {
        // Se é um novo jogador, adiciona à lista
        scoresDB.scores.push({ name, score });
    }
    
    // Ordena por pontuação (maior para menor)
    scoresDB.scores.sort((a, b) => b.score - a.score);
    // Mantém apenas as 10 melhores pontuações
    scoresDB.scores = scoresDB.scores.slice(0, 10);
    
    saveDatabase();
    updateScoresTable();
}

// Função para remover jogador do ranking
function removePlayer(name) {
    loadDatabase();
    
    // Remove do ranking de pontuações
    scoresDB.scores = scoresDB.scores.filter(player => player.name !== name);
    
    saveDatabase();
    updateScoresTable();
}

// Função para atualizar a tabela de pontuações
function updateScoresTable() {
    const tbody = document.getElementById('scores-body');
    tbody.innerHTML = '';
    
    scoresDB.scores.forEach(score => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${score.name}</td>
            <td>${score.score}</td>
            <td>
                <button class="action-button" onclick="removePlayer('${score.name}')">Remover</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Função para mostrar/esconder a tabela de pontuações
function toggleScores() {
    const scoresContent = document.getElementById('scores-content');
    const toggleButton = document.getElementById('toggle-scores');
    
    if (scoresContent.style.display === 'none') {
        scoresContent.style.display = 'block';
        toggleButton.textContent = 'Ocultar Rankings';
    } else {
        scoresContent.style.display = 'none';
        toggleButton.textContent = 'Mostrar Rankings';
    }
}

// Função para verificar se uma tecla é uma letra válida
function isValidLetter(key) {
    return /^[a-zA-Z]$/.test(key);
}

// Função para processar a entrada do teclado
function handleKeyPress(event) {
    // Verifica se o jogo está em andamento
    if (document.getElementById("game-screen").style.display === "none") {
        return;
    }

    const key = event.key.toUpperCase();
    
    if (!isValidLetter(key)) return;
    
    // Encontra o botão correspondente à letra
    const buttons = document.querySelectorAll('.letter-btn');
    const button = Array.from(buttons).find(btn => 
        btn.textContent === key && !btn.disabled
    );
    
    // Se encontrou um botão válido, simula o clique
    if (button) {
        guessLetter(key, button);
    }
}

// Funções para desenhar o stickman
function drawHangman() {
    const canvas = document.getElementById('hangman-canvas');
    const ctx = canvas.getContext('2d');
    
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;

    // Desenha a forca
    ctx.beginPath();
    ctx.moveTo(40, 160);
    ctx.lineTo(160, 160);
    ctx.moveTo(60, 160);
    ctx.lineTo(60, 20);
    ctx.lineTo(140, 20);
    ctx.lineTo(140, 40);
    ctx.stroke();

    const errors = maxAttempts - attempts;
    
    // Desenha as partes do corpo baseado nos erros
    if (errors >= 1) { // Cabeça
        ctx.beginPath();
        ctx.arc(140, 60, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (errors >= 2) { // Corpo
        ctx.beginPath();
        ctx.moveTo(140, 80);
        ctx.lineTo(140, 120);
        ctx.stroke();
    }
    if (errors >= 3) { // Braço esquerdo
        ctx.beginPath();
        ctx.moveTo(140, 90);
        ctx.lineTo(110, 110);
        ctx.stroke();
    }
    if (errors >= 4) { // Braço direito
        ctx.beginPath();
        ctx.moveTo(140, 90);
        ctx.lineTo(170, 110);
        ctx.stroke();
    }
    if (errors >= 5) { // Perna esquerda
        ctx.beginPath();
        ctx.moveTo(140, 120);
        ctx.lineTo(110, 150);
        ctx.stroke();
    }
    if (errors >= 6) { // Perna direita
        ctx.beginPath();
        ctx.moveTo(140, 120);
        ctx.lineTo(170, 150);
        ctx.stroke();
    }
}

function createLetterButtons() {
    const lettersContainer = document.getElementById("letters");
    lettersContainer.innerHTML = '';
    
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const button = document.createElement("button");
        button.textContent = letter;
        button.classList.add("letter-btn");
        button.onclick = function() {
            if (!this.disabled) {
                guessLetter(letter, this);
            }
        };
        lettersContainer.appendChild(button);
    }
}

function guessLetter(letter, button) {
    if (button.disabled || !chosenWord) return;
    
    button.disabled = true;
    button.style.backgroundColor = "#bdc3c7";
    guessedLetters.add(letter);

    if (!chosenWord.includes(letter)) {
        attempts--;
        document.getElementById("attempts").textContent = attempts;
        drawHangman();
        
        if (attempts === 0) {
            endGame("Você perdeu! A palavra era " + chosenWord);
            return;
        }
    } else {
        let lettersFound = 0;
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                displayWord[i] = letter;
                lettersFound++;
            }
        }
        
        // Adiciona pontos e tempo bônus por letra encontrada
        score += lettersFound * 10;
        timeLeft += lettersFound * 5; // Adiciona 5 segundos por letra encontrada
        document.getElementById("score").textContent = score;
        document.getElementById("timer").textContent = timeLeft;
        document.getElementById("word-display").textContent = displayWord.join(" ");

        if (!displayWord.includes("_")) {
            endGame("Parabéns! Você venceu!");
            return;
        }
    }
}

function startGame() {
    const name = document.getElementById("player-name").value.trim();
    const alertMessage = document.getElementById('alert-message');
    
    if (!name) {
        showAlert('Por favor, digite seu nome!');
        return;
    }

    // Remove o listener anterior se existir
    document.removeEventListener('keydown', handleKeyPress);
    
    playerName = name;
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    
    // Reinicia o jogo
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill("_");
    guessedLetters = new Set();
    attempts = maxAttempts;
    score = 0;
    hintUsed = false;
    
    // Reinicia o timer
    if (timer) clearInterval(timer);
    timeLeft = timeLimit;
    
    // Atualiza a interface
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("attempts").textContent = attempts;
    document.getElementById("score").textContent = score;
    document.getElementById("message").textContent = "";
    document.getElementById("word-display").textContent = displayWord.join(" ");
    
    // Limpa e redesenha o canvas
    const canvas = document.getElementById("hangman-canvas");
    canvas.width = 200;
    canvas.height = 200;
    drawHangman();
    
    // Habilita o botão de dica
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.disabled = false;
    }
    
    // Cria os botões de letra
    createLetterButtons();
    
    // Inicia o timer
    timer = setInterval(updateTimer, 1000);
    
    // Adiciona o listener do teclado
    document.addEventListener('keydown', handleKeyPress);
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        if (timeLeft === 0) {
            endGame("Tempo esgotado! A palavra era " + chosenWord);
        }
    }
}

function endGame(message) {
    clearInterval(timer);
    document.getElementById("message").textContent = message;
    document.querySelectorAll(".letter-btn").forEach(btn => btn.disabled = true);
    document.removeEventListener('keydown', handleKeyPress);
    
    // Salva a pontuação apenas se o jogo terminou com vitória
    if (message.includes("Parabéns")) {
        saveScore(playerName, score);
    }
}

function nextWord() {
    // Remove o listener anterior
    document.removeEventListener('keydown', handleKeyPress);
    
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill("_");
    attempts = maxAttempts;
    hintUsed = false;
    
    // Habilita o botão de dica
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.disabled = false;
    }
    
    document.getElementById("word-display").textContent = displayWord.join(" ");
    document.getElementById("message").textContent = "";
    document.getElementById("attempts").textContent = attempts;
    document.getElementById("letters").innerHTML = "";
    
    // Reinicia o timer para a nova palavra
    clearInterval(timer);
    timeLeft = timeLimit;
    document.getElementById("timer").textContent = timeLeft;
    timer = setInterval(updateTimer, 1000);
    
    // Redesenha a forca
    drawHangman();
    
    // Recria os botões
    createLetterButtons();
    
    // Adiciona o novo listener do teclado
    document.addEventListener('keydown', handleKeyPress);
}

function resetGame() {
    // Remove o listener do teclado
    document.removeEventListener('keydown', handleKeyPress);
    
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('player-name').value = '';
}

// Inicializar o banco de dados e eventos quando a página carregar
window.onload = function() {
    loadDatabase();
    updateScoresTable();
    
    // Adiciona evento de tecla Enter no campo de nome
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startGame();
            }
        });
    }
    
    // Inicializa o botão de dica
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
        hintBtn.onclick = giveHint;
    }
};

function giveHint() {
    if (hintUsed) {
        showAlert("Você já usou a dica nesta palavra!");
        return;
    }
    
    if (score < HINT_PENALTY) {
        showAlert(`Você precisa de pelo menos ${HINT_PENALTY} pontos para usar a dica!`);
        return;
    }

    // Encontra letras não reveladas
    const unrevealedIndices = [];
    for (let i = 0; i < chosenWord.length; i++) {
        if (displayWord[i] === '_') {
            unrevealedIndices.push(i);
        }
    }

    if (unrevealedIndices.length > 0) {
        // Escolhe uma letra aleatória não revelada
        const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
        const letter = chosenWord[randomIndex];
        
        // Revela a letra
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                displayWord[i] = letter;
            }
        }
        
        // Atualiza a exibição
        document.getElementById("word-display").textContent = displayWord.join(" ");
        
        // Desabilita o botão da letra correspondente
        const letterButtons = document.querySelectorAll('.letter-btn');
        letterButtons.forEach(btn => {
            if (btn.textContent === letter) {
                btn.disabled = true;
            }
        });
        
        // Aplica a penalidade e atualiza o score
        score -= HINT_PENALTY;
        document.getElementById("score").textContent = score;
        
        // Marca a dica como usada e desabilita o botão
        hintUsed = true;
        document.getElementById('hint-btn').disabled = true;
        
        showAlert(`Dica usada! A letra "${letter}" foi revelada. -${HINT_PENALTY} pontos.`);
    }
}

// Função para mostrar alerta
function showAlert(message) {
    const alertMessage = document.getElementById('alert-message');
    alertMessage.textContent = message;
    alertMessage.style.display = 'block';
    
    // Esconde o alerta após 3 segundos
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
}
