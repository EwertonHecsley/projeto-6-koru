const apiKeyInput = document.getElementById("apiKey");
apiKeyInput.type = 'password'
const userQuestionInput = document.getElementById("userQuestion");
const chat = document.getElementById("chat");
const form = document.querySelector(".chat-input");

let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

function saveHistory() {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function addMessage(message) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("mensagem", message.sender);
    msgDiv.dataset.messageId = message.id;
  
    const textElement = document.createElement("span");

    if (message.sender === 'ia' && window.marked) {
        textElement.innerHTML = marked.parse(message.text);
    } else {
        textElement.textContent = message.text;
    }   

    msgDiv.appendChild(textElement);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "message-actions";

    if (message.sender === 'ia') {
        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn";
        copyBtn.title = "Copiar resposta";
        copyBtn.textContent = "📋";
        copyBtn.addEventListener("click", () => {          
            navigator.clipboard.writeText(message.text).then(() => showAlert("Resposta copiada!"));
        });
        actionsDiv.appendChild(copyBtn);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Apagar mensagem";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
        if (confirm("Você tem certeza que deseja apagar esta mensagem?")) {
            msgDiv.remove();
            chatHistory = chatHistory.filter(msg => msg.id !== message.id);
            saveHistory();
        }
    });
    actionsDiv.appendChild(deleteBtn);

    msgDiv.appendChild(actionsDiv);
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

function renderChat() {
    chat.innerHTML = "";
    if (chatHistory.length === 0) {
        const welcomeDiv = document.createElement("div");
        welcomeDiv.classList.add("mensagem", "ia");
        welcomeDiv.textContent = "Olá! Sou sua Inteligência Artificial. Como posso ajudar hoje?";
        chat.appendChild(welcomeDiv);
    } else {
        chatHistory.forEach(message => {
            addMessage(message);
        });
    }
}

function addLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("mensagem", "ia", "loading");
    loadingDiv.textContent = "Digitando...";
    loadingDiv.id = "loadingMsg";
    chat.appendChild(loadingDiv);
    chat.scrollTop = chat.scrollHeight;
}


function removeLoading() {
    const loadingDiv = document.getElementById("loadingMsg");
    if (loadingDiv) loadingDiv.remove();
}

async function askGemini(apiKey, question) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [
            {
                parts: [
                    { text: question }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro API:", data);
            throw new Error(`Erro: ${response.status}`);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível obter resposta.";
    } catch (error) {
        console.error("Erro na requisição:", error);
        return "Ocorreu um erro ao conectar com a API.";
    }
}

function showAlert(message, type = "success") {
    const alertBox = document.getElementById("customAlert");
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;

    setTimeout(() => {
        alertBox.classList.remove("show");
        setTimeout(() => {
            alertBox.classList.add("hidden");
        }, 300);
    }, 3000);
}

apiKeyInput.addEventListener("input", () => {
    localStorage.setItem("geminiApiKey", apiKeyInput.value.trim());
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value.trim();
    const question = userQuestionInput.value.trim();

    if (!apiKey || !question) {
        showAlert(!apiKey ? "Por favor, insira sua chave de API." : "Digite uma pergunta.", "error");
        return;
    }
    
    const userMessage = { id: Date.now(), text: question, sender: 'user' };
    chatHistory.push(userMessage);
    addMessage(userMessage);

    userQuestionInput.value = "";
    addLoading();

    const answer = await askGemini(apiKey, question);
    removeLoading();

    const aiMessage = { id: Date.now() + 1, text: answer, sender: 'ia' };
    chatHistory.push(aiMessage);
    addMessage(aiMessage);

    saveHistory();
});

function createClearButton() {
    const chatActionsContainer = document.querySelector(".chat-actions");
    if (chatActionsContainer) {
        const clearChatBtn = document.createElement("button");
        clearChatBtn.id = "clearChatBtn";
        clearChatBtn.title = "Limpar histórico";
        clearChatBtn.textContent = "🧹";

        clearChatBtn.addEventListener("click", () => {
            if (confirm("Você tem certeza que deseja limpar todo o histórico do chat? Esta ação não pode ser desfeita.")) {
                chatHistory = [];
                saveHistory();
                renderChat();
                showAlert("O histórico do chat foi limpo!");
            }
        });

        chatActionsContainer.appendChild(clearChatBtn);
    }
}

apiKeyInput.value = localStorage.getItem("geminiApiKey") || "";
renderChat();
createClearButton();


const charCounterElement = document.getElementById("charCounter");
const maxChars = 5000; 

function updateCharCounter() {
    const currentLength = userQuestionInput.value.length; 
    charCounterElement.textContent = currentLength; 
      
    if (currentLength > maxChars) {
        charCounterElement.style.color = "red"; 
    } else {
        charCounterElement.style.color = "";     }
}
userQuestionInput.addEventListener("input", updateCharCounter);

form.addEventListener("submit", (event) => {
    setTimeout(updateCharCounter, 0); 
});


const toggleThemeBtn = document.getElementById("toggleTheme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    toggleThemeBtn.textContent = "☀️ Modo Claro";
  } else {
    toggleThemeBtn.textContent = "🌙 Modo Escuro";
  }
});


const btnSalvar = document.getElementById("btnSalvar");
btnSalvar.addEventListener("click", () => {
  const element = document.querySelector("main"); // o conteúdo principal

  const opt = {
    margin:       0.5,
    filename:     'debug-beauty-chat.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save();
});


