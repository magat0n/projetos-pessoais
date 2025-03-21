const words = [
    "javascript", "html", "css", "python", "programacao",
    "frontend", "backend", "algoritmo", "sistema",
    "computador", "navegador", "internet", "rede", "tecnologia",
    "software", "hardware", "debug", "codificacao", "framework","software","hardware",
    "algoritmo","rede","github","git","linux","ios","sansung","motorola","nokia","apple",
    "microsoft","windows","android","google","yahoo","youtube","facebook","instagram","whatsapp",    
];

let chosenWord, displayWord, attempts, score, timer;
const maxAttempts = 6;
const timeLimit = 60;
let timeLeft;

function startGame() {
    chosenWord = words[Math.floor(Math.random() * words.length)].toUpperCase();
    displayWord = Array(chosenWord.length).fill("_");
    attempts = maxAttempts;
    timeLeft = timeLimit;
    document.getElementById("word-display").textContent = displayWord.join(" ");
    document.getElementById("message").textContent = "";
    document.getElementById("letters").innerHTML = "";
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

function guessLetter(letter, button) {
    button.disabled = true;  // Desabilita o botão
    button.style.backgroundColor = "#bdc3c7";  // Muda a cor para indicar que foi usado

    if (!chosenWord.includes(letter)) {
        attempts--;
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
}

function resetGame() {
    startGame();
}

startGame();
