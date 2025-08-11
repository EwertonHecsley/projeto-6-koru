# Debug & Beauty — Assistente IA (Gemini)

Uma aplicação web de chat que utiliza a API do **Google Gemini** para responder perguntas dos usuários.  
O projeto mantém histórico de mensagens no navegador, suporta formatação em **Markdown** e permite ações como copiar ou apagar respostas.

## 📁 Estrutura do projeto

projeto-6-koru/

├─ index.html # Estrutura da página
├─ style.css # Estilos e layout
├─ script.js # Lógica do chat e integração com a API
└─ chatgpt-image-2025-08-09-215248.png


## 🚀 Como rodar

1. Abra o arquivo `index.html` no navegador.
2. Cole sua **API key do Google Gemini** no campo “API do Google Gemini”.
3. Digite sua pergunta no campo de entrada e clique em **Enviar**.
4. A resposta da IA será exibida no chat.

## 🔑 Configuração da API 

- Crie uma API key no Google AI Studio (https://aistudio.google.com/).
- A chave é lida do input e armazenada no localStorage para conveniência.

## 🧠 Como funciona

- O usuário envia a pergunta pelo formulário.
- `script.js` chama `askGemini(apiKey, question)` com `fetch`:

POST https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=<SUA_API_KEY>

- A resposta é renderizada (com Markdown) e armazenada no `localStorage` junto com a pergunta.

O corpo da requisição (`body`) é enviado no formato:

```json
{
  "contents": [
    {
      "parts": [
        { "text": "Sua pergunta aqui" }
      ]
    }
  ]
}
```

A resposta é processada e o texto retornado é exibido no chat.

## 📌 Funcionalidades
- Campo para API key (salvo no localStorage).
- Campo de entrada para a pergunta.
- Exibição de mensagens do usuário e da IA.
- Markdown nas respostas da IA (via marked.js).
- Botão para copiar o texto da resposta.
- Botão para apagar mensagens individuais.
- Botão para limpar todo o histórico.
- Histórico salvo no localStorage (mantém as conversas ao recarregar a página).
- Mensagem inicial de boas-vindas da IA.
- Indicador “Digitando...” enquanto a resposta é carregada.
- Alertas visuais para feedback de ações.

## 🎨 Interface

O layout utiliza:
- Gradientes de fundo e efeitos de blur.
- Diferenciação visual entre mensagens do usuário e da IA.
- Animações sutis na entrada das mensagens.
- Scrollbar customizado para o chat.
- Toasts para mensagens de sucesso ou erro.

## 📦 Dependências

`marked.js` para renderização de Markdown.

Incluída no `index.html` via CDN:

`<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>`

## 🛡️ Segurança e privacidade

- Chave no navegador: A API key é persistida em `localStorage`.
- Renderização de Markdown: As respostas são inseridas via `innerHTML`.