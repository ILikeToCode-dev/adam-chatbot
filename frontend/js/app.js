class RoleplayBot {
    constructor() {
        this.apiUrl = window.location.origin + '/api';
        this.conversationId = null;

        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.statusIndicator = document.getElementById('status');

        this.init();
    }

    async init() {
        await this.loadCharacterInfo();
        this.setupEventListeners();
    }

    async loadCharacterInfo() {
        try {
            const response = await fetch(`${this.apiUrl}/character`);
            const data = await response.json();

            if (data.initialMessage) {
                this.addMessage(data.initialMessage, 'bot');
            }
        } catch (error) {
            console.error('Error loading character:', error);
        }
    }

    setupEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.sendBtn.disabled = true;
        this.showTyping();
        this.updateStatus('thinking');

        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    conversationId: this.conversationId
                })
            });

            const data = await response.json();

            this.hideTyping();
            this.updateStatus('online');
            this.sendBtn.disabled = false;

            if (data.success) {
                this.conversationId = data.conversationId;
                this.addMessage(data.message, 'bot');
            } else {
                throw new Error(data.error || 'Unknown error');
            }

        } catch (error) {
            console.error('Error:', error);
            this.hideTyping();
            this.updateStatus('online');
            this.sendBtn.disabled = false;
            this.addMessage('Connection interrupted. Please try again.', 'bot');
        }
    }

    addMessage(text, type) {
        const container = document.createElement('div');

        if (type === 'user') {
            container.className = 'flex items-start gap-3 justify-end message-animate-right';
            container.innerHTML = `
                <div class="flex flex-col gap-1.5 max-w-[70%] items-end">
                    <p class="text-xs font-medium text-gray-600 dark:text-gray-400">You</p>
                    <div class="bg-gradient-to-br from-primary to-primary-dark p-4 rounded-2xl rounded-tr-md shadow-sm">
                        <p class="text-white leading-relaxed">${this.escapeHtml(text)}</p>
                    </div>
                    <span class="text-xs text-gray-400 dark:text-gray-500 px-2">${this.getTimeStamp()}</span>
                </div>
            `;
        } else {
            container.className = 'flex items-start gap-3 message-animate-left';
            container.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-primary text-xl">
                        fitness_center
                    </span>
                </div>
                <div class="flex flex-col gap-1.5 max-w-[70%]">
                    <p class="text-xs font-medium text-gray-600 dark:text-gray-400">ADAM</p>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-md shadow-sm border border-gray-200 dark:border-gray-700">
                        <p class="text-gray-800 dark:text-gray-200 leading-relaxed">${this.escapeHtml(text)}</p>
                    </div>
                    <span class="text-xs text-gray-400 dark:text-gray-500 px-2">${this.getTimeStamp()}</span>
                </div>
            `;
        }

        this.messagesContainer.appendChild(container);
        this.chatMessages.scrollTo({
            top: this.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }

    showTyping() {
        this.typingIndicator.classList.remove('hidden');
        setTimeout(() => {
            this.chatMessages.scrollTo({
                top: this.chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    hideTyping() {
        this.typingIndicator.classList.add('hidden');
    }

    updateStatus(status) {
        const statusConfig = {
            'online': {
                text: 'Online',
                color: 'text-green-600 dark:text-green-400',
                dotColor: 'bg-green-500'
            },
            'thinking': {
                text: 'Thinking...',
                color: 'text-orange-600 dark:text-orange-400',
                dotColor: 'bg-orange-500'
            }
        };

        const config = statusConfig[status] || statusConfig['online'];
        this.statusIndicator.className = `flex items-center gap-1.5 text-sm font-medium ${config.color}`;
        this.statusIndicator.innerHTML = `
            <span class="w-2 h-2 rounded-full ${config.dotColor} ${status === 'online' ? 'status-pulse' : ''}"></span>
            ${config.text}
        `;
    }

    getTimeStamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the roleplay bot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new RoleplayBot();
});