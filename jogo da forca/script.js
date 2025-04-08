const words = [
    "javascript", "html", "css", "python", "programacao",
     "frontend", "backend", "algoritmo", "sistema",
    "computador", "navegador", "internet", "rede", "tecnologia",
    "software", "hardware", "debug", "codificacao", "framework","software","hardware",
    "algoritmo","rede","github","git","linux","ios","sansung","motorola","nokia","apple",
    "microsoft","windows","android","google","yahoo","youtube","facebook","instagram","whatsapp",    
];

let chosenWord, displayWord, attempts, score, timer, playerName;
const maxAttempts = 5;
const timeLimit = 60;
let timeLeft;

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

function startGame() {
    playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Por favor, digite seu nome!');
        return;
    }

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill("_");
    attempts = maxAttempts;
    timeLeft = timeLimit;
    document.getElementById("word-display").textContent = displayWord.join(" ");
    document.getElementById("message").textContent = "";
    document.getElementById("letters").innerHTML = "";
    document.getElementById("attempts").textContent = attempts;
    score = 0;
    document.getElementById("score").textContent = score;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

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
    } else {
        for (let i = 0; i < chosenWord.length; i++) {
            if (chosenWord[i] === letter) {
                displayWord[i] = letter;
            }
        }
        score += 10;
    }
    document.getElementById("word-display").textContent = displayWord.join(" ");
    document.getElementById("score").textContent = score;

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
    
    // Reinicia o timer para a próxima palavra
    timeLeft = timeLimit;
    document.getElementById("timer").textContent = timeLeft;
    timer = setInterval(updateTimer, 1000);
}

function resetGame() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('player-name').value = '';
}

// Inicializar a tabela de pontuações quando a página carregar
window.onload = function() {
    updateScoresTable();
};

startGame();
