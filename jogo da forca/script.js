const words = [
    "javascript", "html", "css", "forca", "programacao",
    "desenvolvimento", "front-end", "back-end", "algoritmo", "sistema",
    "computador", "navegador", "internet", "rede", "tecnologia",
    "software", "hardware", "debug", "codificacao", "framework"
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
        btn.onclick = () => guessLetter(btn.textContent);
        document.getElementById("letters").appendChild(btn);
    }
}

function guessLetter(letter) {
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
