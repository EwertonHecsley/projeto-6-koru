const apiKeyInput = document.getElementById("apiKey");
const userQuestionInput = document.getElementById("userQuestion");
const chatContainer = document.getElementById("chat");
const form = document.querySelector(".chat-input");

function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("mensagem", sender);
    msg.textContent = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

