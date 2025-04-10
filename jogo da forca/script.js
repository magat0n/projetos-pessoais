const words = [
    "javascript", "html", "css", "python", "programacao",
     "frontend", "backend", "algoritmo", "sistema",
    "computador", "navegador", "internet", "rede", "tecnologia",
    "software", "hardware", "debug", "codificacao", "framework","software","hardware",
    "algoritmo","rede","github","git","linux","ios","sansung","motorola","nokia","apple",
    "microsoft","windows","android","google","yahoo","youtube","facebook","instagram","whatsapp",  
];

let chosenWord, displayWord, attempts, score, timer, playerName;
const maxAttempts = 6;
const timeLimit = 60;
let timeLeft;
let currentWord = '';
let guessedLetters = new Set();
let hintUsed = false;
const HINT_PENALTY = 50;

// Função para salvar pontuação
function saveScore(name, score) {
    let scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    
    // Verifica se o jogador já existe
    const existingPlayerIndex = scores.findIndex(player => player.name === name);
    
    if (existingPlayerIndex !== -1) {
        // Se o jogador já existe, atualiza apenas se a pontuação for maior
        if (score > scores[existingPlayerIndex].score) {
            scores[existingPlayerIndex].score = score;
        }
    } else {
        // Se é um novo jogador, adiciona à lista
        scores.push({ name, score });
    }
    
    // Ordena por pontuação (maior para menor)
    scores.sort((a, b) => b.score - a.score);
    // Mantém apenas as 10 melhores pontuações
    scores = scores.slice(0, 10);
    
    localStorage.setItem('hangmanScores', JSON.stringify(scores));
    updateScoresTable();
}

// Função para atualizar a tabela de pontuações
function updateScoresTable() {
    const scores = JSON.parse(localStorage.getItem('hangmanScores')) || [];
    const tbody = document.getElementById('scores-body');
    tbody.innerHTML = '';
    
    scores.forEach(score => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${score.name}</td>
            <td>${score.score}</td>
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
        scoresContent.classList.add('show');
        toggleButton.textContent = 'Ocultar Pontuações';
    } else {
        scoresContent.style.display = 'none';
        scoresContent.classList.remove('show');
        toggleButton.textContent = 'Mostrar Pontuações';
    }
}

// Função para verificar se uma tecla é uma letra válida
function isValidLetter(key) {
    return /^[a-zA-Z]$/.test(key);
}

// Função para processar a entrada do teclado
function handleKeyPress(event) {
    const key = event.key.toUpperCase();
    
    if (!isValidLetter(key)) return;
    
    const button = Array.from(document.querySelectorAll('.letter-btn'))
        .find(btn => btn.textContent === key && !btn.disabled);
    
    if (button) {
        guessLetter(key, button);
    }
}

// Funções para desenhar o stickman
function drawHangman() {
    const canvas = document.getElementById('hangman-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 3;

    // Desenha a forca
    ctx.beginPath();
    ctx.moveTo(20, 180);
    ctx.lineTo(180, 180);
    ctx.moveTo(40, 180);
    ctx.lineTo(40, 20);
    ctx.lineTo(120, 20);
    ctx.lineTo(120, 40);
    ctx.stroke();

    // Desenha as partes do corpo baseado nos erros
    const errors = maxAttempts - attempts;
    
    if (errors >= 1) { // Cabeça
        ctx.beginPath();
        ctx.arc(120, 60, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    if (errors >= 2) { // Corpo
        ctx.beginPath();
        ctx.moveTo(120, 80);
        ctx.lineTo(120, 130);
        ctx.stroke();
    }
    
    if (errors >= 3) { // Braço esquerdo
        ctx.beginPath();
        ctx.moveTo(120, 90);
        ctx.lineTo(90, 110);
        ctx.stroke();
    }
    
    if (errors >= 4) { // Braço direito
        ctx.beginPath();
        ctx.moveTo(120, 90);
        ctx.lineTo(150, 110);
        ctx.stroke();
    }
    
    if (errors >= 5) { // Perna esquerda
        ctx.beginPath();
        ctx.moveTo(120, 130);
        ctx.lineTo(90, 160);
        ctx.stroke();
    }
    
    if (errors >= 6) { // Perna direita
        ctx.beginPath();
        ctx.moveTo(120, 130);
        ctx.lineTo(150, 160);
        ctx.stroke();
    }
}

function startGame() {
    playerName = document.getElementById('player-name').value.trim();
    const alertMessage = document.getElementById('alert-message');
    
    if (!playerName) {
        alertMessage.textContent = 'Por favor, digite seu nome!';
        alertMessage.style.display = 'block';
        return;
    }
    
    alertMessage.style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    document.addEventListener('keydown', handleKeyPress);
    
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill("_");
    attempts = maxAttempts;
    timeLeft = timeLimit;
    score = 0;
    hintUsed = false;
    document.getElementById('hint-btn').disabled = false;
    
    document.getElementById("word-display").textContent = displayWord.join(" ");
    document.getElementById("message").textContent = "";
    document.getElementById("attempts").textContent = attempts;
    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = timeLeft;
    document.getElementById("letters").innerHTML = "";
    
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    // Desenha a forca inicial
    drawHangman();

    for (let i = 65; i <= 90; i++) {
        let btn = document.createElement("button");
        btn.textContent = String.fromCharCode(i);
        btn.classList.add("letter-btn");
        btn.onclick = function () {
            guessLetter(this.textContent, this);
        };
        document.getElementById("letters").appendChild(btn);
    }
}

function guessLetter(letter, button) {
    button.disabled = true;
    button.style.backgroundColor = "#bdc3c7";

    if (!chosenWord.includes(letter)) {
        attempts--;
        document.getElementById("attempts").textContent = attempts;
        drawHangman();
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
    }
    document.getElementById("word-display").textContent = displayWord.join(" ");

    if (!displayWord.includes("_")) {
        endGame("Parabéns! Você venceu!");
    } else if (attempts === 0) {
        endGame("Você perdeu! A palavra era " + chosenWord);
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
    } else {
        endGame("Tempo esgotado! A palavra era " + chosenWord);
    }
}

function endGame(message) {
    clearInterval(timer);
    document.getElementById("message").textContent = message;
    document.querySelectorAll(".letter-btn").forEach(btn => btn.disabled = true);
    saveScore(playerName, score);
}

function nextWord() {
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill("_");
    attempts = maxAttempts;
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

    for (let i = 65; i <= 90; i++) {
        let btn = document.createElement("button");
        btn.textContent = String.fromCharCode(i);
        btn.classList.add("letter-btn");
        btn.onclick = function () {
            guessLetter(this.textContent, this);
        };
        document.getElementById("letters").appendChild(btn);
    }
}

function resetGame() {
    // Remove o listener do teclado
    document.removeEventListener('keydown', handleKeyPress);
    
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('player-name').value = '';
}

// Inicializar a tabela de pontuações quando a página carregar
window.onload = function() {
    updateScoresTable();
};

function giveHint() {
    if (hintUsed || score < HINT_PENALTY) {
        return;
    }

    // Encontra todas as letras não reveladas
    const unrevealedLetters = [];
    for (let i = 0; i < chosenWord.length; i++) {
        if (!guessedLetters.has(chosenWord[i])) {
            unrevealedLetters.push(i);
        }
    }

    if (unrevealedLetters.length > 0) {
        // Escolhe uma letra aleatória não revelada
        const randomIndex = unrevealedLetters[Math.floor(Math.random() * unrevealedLetters.length)];
        const letter = chosenWord[randomIndex];
        
        // Revela a letra
        guessedLetters.add(letter);
        updateWordDisplay();
        
        // Desabilita o botão de dica
        document.getElementById('hint-btn').disabled = true;
        hintUsed = true;
        
        // Aplica a penalidade na pontuação
        score = Math.max(0, score - HINT_PENALTY);
        updateScore();
        
        // Mostra mensagem de dica usada
        showAlert(`Dica usada! A letra "${letter.toUpperCase()}" foi revelada. -${HINT_PENALTY} pontos.`);
    }
}

// Adiciona o evento de clique no botão de dica
document.getElementById('hint-btn').addEventListener('click', giveHint);

startGame();
