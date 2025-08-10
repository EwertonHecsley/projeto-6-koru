const apiKeyInput = document.getElementById("apiKey");
const userQuestionInput = document.getElementById("userQuestion");
const chat = document.getElementById("chat");
const form = document.querySelector(".chat-input");

apiKeyInput.value = localStorage.getItem("geminiApiKey") || "";
apiKeyInput.addEventListener("input", () => {
    localStorage.setItem("geminiApiKey", apiKeyInput.value.trim());
});


function addMessage(text, sender = "ia") {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("mensagem", sender);
    msgDiv.textContent = text;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}


function addLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("mensagem", "ia");
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

form.addEventListener("submit", async () => {
    const apiKey = apiKeyInput.value.trim();
    const question = userQuestionInput.value.trim();

    if (!apiKey) {
        showAlert("Por favor, insira sua chave de API do Gemini.");
        return;
    }
    if (!question) {
        showAlert("Digite uma pergunta antes de enviar.");
        return;
    }

    addMessage(question, "user");
    userQuestionInput.value = "";

    addLoading();

    const answer = await askGemini(apiKey, question);

    removeLoading();
    addMessage(answer, "ia");
});

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

