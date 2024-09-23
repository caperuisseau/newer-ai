// script.js

document.getElementById('sendBtn').addEventListener('click', interagirAvecNewerAI);
document.getElementById('userInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        interagirAvecNewerAI();
    }
});
document.getElementById('setNameBtn').addEventListener('click', setAiName);

let aiName = "Newer AI"; // Nom par défaut
let knowledgeBase = JSON.parse(localStorage.getItem('knowledgeBase')) || {};

function interagirAvecNewerAI() {
    var input = nettoyerInput(document.getElementById('userInput').value);
    if (!input) return;

    ajouterMessage(input, 'userMessage');
    document.getElementById('userInput').value = "";

    var response = genererReponse(input);
    setTimeout(() => {
        ajouterMessage(response, 'aiMessage');
        synthesizeSpeech(response); // Répondre par audio
        if (response === "Désolé, je ne comprends pas. Essayez quelque chose d'autre !") {
            demanderApprentissage(input);
        }
    }, 1000); // Réponse après 1 seconde
}

function nettoyerInput(input) {
    return input.toLowerCase().replace(/[.,!?:;]*/g, '').trim();
}

function ajouterMessage(message, type) {
    var chatBox = document.getElementById('chatBox');
    var messageElement = document.createElement('div');
    messageElement.className = 'message ' + type;
    messageElement.textContent = message;

    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight; // Défiler vers le bas
}

function genererReponse(input) {
    // Réponses aléatoires
    const responses = {
        "salut": ["Salut ! Comment puis-je t'aider aujourd'hui ?", "Bonjour ! Que puis-je faire pour toi ?"],
        "comment ça va": ["Je suis une IA, tout va bien !", "Je vais bien, merci de demander !"],
        "qui es-tu": [`Je suis ${aiName}, votre assistant virtuel.`, "Je suis une intelligence artificielle."],
        "merci": ["Avec plaisir !", "De rien !"],
        "au revoir": ["À bientôt !", "À la prochaine !"]
    };

    // Si l'input existe déjà dans la base de connaissances
    if (knowledgeBase[input]) {
        return knowledgeBase[input];
    }

    // Choisir une réponse aléatoire
    const responseArray = responses[input] || ["Désolé je ne savais pas mais maintenant je sais"];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

function demanderApprentissage(input) {
    let userResponse = prompt("Je ne sais pas répondre à ça. Que devrais-je dire ?");
    if (userResponse) {
        knowledgeBase[input] = userResponse.trim();
        localStorage.setItem('knowledgeBase', JSON.stringify(knowledgeBase)); // Sauvegarder dans localStorage
        alert("Merci ! J'ai appris une nouvelle réponse !");
    }
}

function setAiName() {
    const inputName = document.getElementById('aiName').value.trim();
    if (inputName) {
        aiName = inputName;
        alert(`L'IA s'appelle maintenant ${aiName}`);
    }
}

function synthesizeSpeech(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}
