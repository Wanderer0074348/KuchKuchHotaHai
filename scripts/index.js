class BrutalChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.statusIndicator = document.getElementById('status-indicator');
        this.messageHistory = [];
        this.isTyping = false;

        this.init();
    }

    init() {
        this.addEventListeners();
        this.setOnlineStatus();
        this.welcomeMessage();
    }

    addEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserInput());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });

        // Add input focus effects
        this.userInput.addEventListener('focus', () => {
            this.userInput.style.borderColor = '#fff';
        });

        this.userInput.addEventListener('blur', () => {
            this.userInput.style.borderColor = '#000';
        });
    }

    setOnlineStatus() {
        this.statusIndicator.classList.remove('offline');
        this.statusIndicator.classList.add('online');
    }

    async handleUserInput() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, true);
        this.userInput.value = '';

        // Show typing indicator
        this.setTypingStatus();

        try {
            // Here you would integrate with Botpress
            // For now, we'll simulate a response
            await this.simulateBotResponse(message);
        } catch (error) {
            this.addMessage('Error: Could not connect to the bot.', false);
        }

        this.setOnlineStatus();
    }

    addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        // Add timestamp
        const timestamp = new Date().toLocaleTimeString();
        const timeSpan = document.createElement('span');
        timeSpan.className = 'timestamp';
        timeSpan.textContent = timestamp;

        // Add message content
        const contentDiv = document.createElement('div');
        contentDiv.textContent = message;

        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeSpan);

        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();

        // Store message in history
        this.messageHistory.push({
            content: message,
            isUser,
            timestamp
        });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    setTypingStatus() {
        this.statusIndicator.classList.remove('online', 'offline');
        this.statusIndicator.classList.add('typing');
        this.isTyping = true;
    }

    async simulateBotResponse(userMessage) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simple response logic
        let response;
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = "Hello! How can I help you today?";
        } else if (lowerMessage.includes('help')) {
            response = "I'm here to help! What do you need assistance with?";
        } else if (lowerMessage.includes('bye')) {
            response = "Goodbye! Have a great day!";
        } else {
            response = "I'm a simple bot for now. Try saying 'hello', 'help', or 'bye'!";
        }

        this.addMessage(response, false);
    }

    welcomeMessage() {
        setTimeout(() => {
            this.addMessage("Welcome to BrutalBot! How can I assist you today?", false);
        }, 500);
    }

    // Method to integrate with Botpress
    async connectToBotpress() {
        // Add your Botpress integration code here
        // This would typically involve setting up webhooks or using their SDK
    }
}

// Initialize the chatbot when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new BrutalChatbot();
});
