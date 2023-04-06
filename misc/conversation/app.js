const apiKeyInput = document.getElementById("apiKey");
const persona1 = document.getElementById("persona1");
const persona2 = document.getElementById("persona2");
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const sendMessage = document.getElementById("sendMessage");
const personaChat = document.getElementById("personaChat");

persona1.value = "Aristotle";
persona2.value = "Galileo";

let messages = [
    { "role": "system", "content": `You are now speaking as ${persona1.value}. Please have a conversation with ${persona2.value}.` },
    { "role": "assistant", "content": `Hello, I am ${persona1.value}.` },
];

let nextPersona = persona1.value;

sendMessage.addEventListener("click", async () => {
    const userInput = messageInput.value.trim();
    if (!userInput) return;

    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Please enter your OpenAI API key.");
        return;
    }

    appendMessage(userInput, "user", "You");
    messageInput.value = "";

    messages.push({ "role": "user", "content": `You: ${userInput}` });

    try {
        const apiResponse = await callOpenAIChatAPI(userInput, apiKey, true);
        appendMessage(apiResponse, "ai", persona1.value);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

personaChat.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Please enter your OpenAI API key.");
        return;
    }

    try {
        const apiResponse = await callOpenAIChatAPI("", apiKey);
        appendMessage(apiResponse, "ai", nextPersona);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }

    // Toggle between personas for the next chat
    nextPersona = nextPersona === persona1.value ? persona2.value : persona1.value;
});

async function callOpenAIChatAPI(userInput, apiKey, userJoined = false) {
    const apiURL = "https://api.openai.com/v1/chat/completions";

    if (!userJoined) {
        messages.push({ "role": "assistant", "content": `${nextPersona}: ${userInput}` });
    }

    messages.push({ "role": "system", "content": `You are now speaking as ${nextPersona}. Please have a conversation with ${nextPersona === persona1.value ? persona2.value : persona1.value}.` });
    messages.push({ "role": "assistant", "content": `${nextPersona}:` });

    // messages.push({ "role": "system", "content": `You are now speaking as ${nextPersona === persona1.value ? persona2.value : persona1.value}.` });
    // messages.push({ "role": "assistant", "content": `${nextPersona === persona1.value ? persona2.value : persona1.value}:` });
    
    // messages.push({ "role": "system", "content": `You are now speaking as ${nextPersona === persona1.value ? persona2.value : persona1.value}. Please have a conversation with ${nextPersona === persona1.value ? persona1.value : persona2.value}.` });
    // messages.push({ "role": "assistant", "content": `${nextPersona === persona1.value ? persona2.value : persona1.value}:` });

    const requestBody = {
        "model": "gpt-3.5-turbo",
        "messages": messages,
        "max_tokens": 150,
        "temperature": 0.7,
        "n": 1,
        "stop": null,
    };

    const response = await fetch(apiURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const responseData = await response.json();
        throw new Error(`API Error (${response.status}): ${responseData.error.message}`);
    }
    
    const responseData = await response.json();
    const responseMessage = responseData.choices[0].message.content.trim();

    messages.push({ "role": "assistant", "content": responseMessage });

    return responseMessage;
}

function appendMessage(content, role, persona) {
    const chatBox = document.getElementById("chatArea");
    
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const messageText = document.createElement("div");
    messageText.classList.add("message-text");

    const messageSender = document.createElement("div");
    messageSender.classList.add("message-sender");

    if (role === "ai") {
        messageSender.innerText = `${persona}:`;
    } else {
        messageSender.innerText = "You:";
    }

    messageText.innerText = content;

    messageContainer.appendChild(messageSender);
    messageContainer.appendChild(messageText);

    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}


