// ============================================
// FRICTION ENTERPRISE AI - ENHANCED JAVASCRIPT
// Particle System | Matrix Rain | Typing Animation
// ============================================

// ============================================
// PARTICLE SYSTEM
// ============================================

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.mouse = { x: null, y: null, radius: 150 };

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        // Connect nearby particles
        this.connectParticles();

        requestAnimationFrame(() => this.animate());
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 1 - distance / 120;
                    this.ctx.strokeStyle = `rgba(102, 126, 234, ${opacity * 0.3})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 2; // Bigger particles
        this.speedX = (Math.random() * 4 - 2) * 1.5; // Faster horizontal speed
        this.speedY = (Math.random() * 4 - 2) * 1.5; // Faster vertical speed
        this.color = `rgba(102, 126, 234, ${Math.random() * 0.6 + 0.4})`; // Brighter
    }

    update(mouse) {
        // Mouse interaction - stronger repulsion
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 8; // Stronger push
            this.y -= Math.sin(angle) * force * 8;
        }

        // Move particle with momentum
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges with energy
        if (this.x < 0 || this.x > this.canvas.width) {
            this.speedX *= -1;
            this.x = this.x < 0 ? 0 : this.canvas.width;
        }
        if (this.y < 0 || this.y > this.canvas.height) {
            this.speedY *= -1;
            this.y = this.y < 0 ? 0 : this.canvas.height;
        }

        // Add slight random movement for organic feel
        this.speedX += (Math.random() - 0.5) * 0.1;
        this.speedY += (Math.random() - 0.5) * 0.1;

        // Limit max speed
        const maxSpeed = 3;
        this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
        this.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedY));
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ============================================
// MATRIX CODE RAIN
// ============================================

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/\\|';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
    }

    init() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    animate() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#667eea';
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Gradient effect
            const gradient = this.ctx.createLinearGradient(x, y - 20, x, y);
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0)');
            gradient.addColorStop(1, 'rgba(102, 126, 234, 0.8)');
            this.ctx.fillStyle = gradient;

            this.ctx.fillText(char, x, y);

            // Reset drop
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        setTimeout(() => requestAnimationFrame(() => this.animate()), 50);
    }
}

// ============================================
// BINARY RAIN ANIMATION
// ============================================

class BinaryRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.chars = '01';
        this.fontSize = 16;
        this.columns = 0;
        this.drops = [];

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
    }

    init() {
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -100;
        }
    }

    animate() {
        // Fade effect
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.08)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.font = `${this.fontSize}px monospace`;
        this.ctx.fontWeight = 'bold';

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.drops[i] * this.fontSize;

            // Cyan color for binary
            const gradient = this.ctx.createLinearGradient(x, y - 30, x, y);
            gradient.addColorStop(0, 'rgba(0, 242, 254, 0)');
            gradient.addColorStop(1, 'rgba(0, 242, 254, 0.9)');
            this.ctx.fillStyle = gradient;

            this.ctx.fillText(char, x, y);

            // Reset drop
            if (y > this.canvas.height && Math.random() > 0.98) {
                this.drops[i] = 0;
            }

            this.drops[i]++;
        }

        setTimeout(() => requestAnimationFrame(() => this.animate()), 60);
    }
}

// ============================================
// TERMINAL TYPING ANIMATION
// ============================================

class TerminalTyping {
    constructor(element) {
        this.element = element;
        this.texts = [
            'initializing AI systems...',
            'loading neural networks...',
            'connecting to Gemini 2.5...',
            'ready to assist you!'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;

        this.type();
    }

    type() {
        const currentText = this.texts[this.currentTextIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let speed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            speed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), speed);
    }
}

// ============================================
// TYPING ANIMATION FOR AI RESPONSES
// ============================================

function typeText(element, text, speed = 30) {
    return new Promise((resolve) => {
        let index = 0;
        element.textContent = '';

        const interval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;

                // Auto-scroll
                const messagesContainer = document.getElementById('messages');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// ============================================
// TEXT-TO-SPEECH SYSTEM
// ============================================

class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.enabled = false;
        this.language = 'en-US';
        this.voices = [];

        // Load voices
        this.loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synth.getVoices();
    }

    setLanguage(lang) {
        this.language = lang;
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    speak(text) {
        if (!this.enabled || !text) return;

        // Cancel any ongoing speech
        this.synth.cancel();

        // Create utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.language;
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Try to find a voice for the selected language
        const voice = this.voices.find(v => v.lang.startsWith(this.language.split('-')[0]));
        if (voice) {
            utterance.voice = voice;
        }

        // Speak
        this.synth.speak(utterance);
    }

    stop() {
        this.synth.cancel();
    }
}

// ============================================
// VOICE ASSISTANT (SPEECH-TO-TEXT)
// ============================================

class VoiceAssistant {
    constructor(inputElement, triggerBtn) {
        this.input = inputElement;
        this.btn = triggerBtn;
        this.recognition = null;
        this.isListening = false;

        this.init();
    }

    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US'; // Default to US English

            this.recognition.onstart = () => {
                this.isListening = true;
                this.btn.classList.add('listening');
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.btn.classList.remove('listening');
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.input.value += (this.input.value ? ' ' : '') + transcript;
                this.input.focus();
                // Auto-resize
                this.input.style.height = 'auto';
                this.input.style.height = this.input.scrollHeight + 'px';
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                this.stop();
            };

            // Toggle listener
            this.btn.addEventListener('click', () => {
                if (this.isListening) {
                    this.stop();
                } else {
                    this.start();
                }
            });
        } else {
            console.warn('Speech Recognition API not supported in this browser.');
            this.btn.style.display = 'none';
        }
    }

    start() {
        if (this.recognition) {
            // Update language based on selector if available
            const langSelector = document.getElementById('languageSelector');
            if (langSelector) {
                this.recognition.lang = langSelector.value;
            }
            this.recognition.start();
        }
    }

    stop() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}

// ============================================
// MAIN APPLICATION
// ============================================

class ChatApp {
    constructor() {
        this.messagesContainer = document.getElementById('messages');
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearBtn = document.getElementById('clearChat');
        this.imageBtn = document.getElementById('imageBtn');
        this.micBtn = document.getElementById('micBtn'); // New Mic Button
        this.attachImageBtn = document.getElementById('attachImageBtn'); // Image attach button
        this.attachImageInput = document.getElementById('attachImageInput'); // File input
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.languageSelector = document.getElementById('languageSelector');
        this.toggleSpeechBtn = document.getElementById('toggleSpeech');

        // Store attached image
        this.attachedImage = null;

        // Initialize text-to-speech
        this.tts = new TextToSpeech();

        // Initialize Voice Assistant
        this.voiceAssistant = new VoiceAssistant(this.userInput, this.micBtn);

        this.initEventListeners();
        this.initPromptChips();
        this.setupCodeCopyButtons();

        // Expose instance for inline handlers
        window.chatAppInstance = this;
    }


    initEventListeners() {
        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter to send (Shift+Enter for new line)
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.userInput.addEventListener('input', () => {
            this.userInput.style.height = 'auto';
            this.userInput.style.height = this.userInput.scrollHeight + 'px';
        });

        // Clear chat
        this.clearBtn.addEventListener('click', () => this.clearChat());

        // Image generation - ACTIVE
        this.imageBtn.addEventListener('click', () => this.openImageGenerationModal());

        // Image attachment for questions
        if (this.attachImageBtn && this.attachImageInput) {
            this.attachImageBtn.addEventListener('click', () => {
                this.attachImageInput.click();
            });

            this.attachImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleImageAttachment(file);
                }
            });
        }

        // Language selector
        this.languageSelector.addEventListener('change', (e) => {
            this.tts.setLanguage(e.target.value);
        });

        // Toggle speech
        this.toggleSpeechBtn.addEventListener('click', () => {
            const enabled = this.tts.toggle();
            this.toggleSpeechBtn.classList.toggle('active', enabled);

            if (enabled) {
                this.tts.speak('Text to speech enabled');
            } else {
                this.tts.stop();
            }
        });
    }

    initPromptChips() {
        const chips = document.querySelectorAll('.prompt-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const prompt = chip.getAttribute('data-prompt');
                this.userInput.value = prompt;
                this.userInput.focus();
            });
        });
    }

    // Handle image attachment
    handleImageAttachment(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Read image as base64
        const reader = new FileReader();
        reader.onload = (e) => {
            this.attachedImage = {
                data: e.target.result,
                name: file.name
            };

            // Show preview indicator
            this.showImagePreview(e.target.result, file.name);

            // Change attach button color to indicate image attached
            this.attachImageBtn.style.color = '#22c55e';
            this.attachImageBtn.title = `Image attached: ${file.name}`;
        };
        reader.readAsDataURL(file);
    }

    // Show image preview
    showImagePreview(imageData, fileName) {
        // Remove existing preview
        const existingPreview = document.querySelector('.image-preview-indicator');
        if (existingPreview) existingPreview.remove();

        // Create preview indicator
        const preview = document.createElement('div');
        preview.className = 'image-preview-indicator';
        preview.innerHTML = `
            <img src="${imageData}" alt="${fileName}" style="max-width: 60px; max-height: 60px; border-radius: 8px; object-fit: cover;">
            <span style="font-size: 0.75rem; color: var(--text-secondary); margin-left: 8px;">${fileName}</span>
            <button class="remove-image-btn" style="margin-left: auto; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.2rem;">×</button>
        `;
        preview.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px;';

        // Insert before input wrapper
        const inputContainer = document.querySelector('.input-container');
        const inputWrapper = document.querySelector('.input-wrapper');
        inputContainer.insertBefore(preview, inputWrapper);

        // Remove image button
        preview.querySelector('.remove-image-btn').addEventListener('click', () => {
            this.attachedImage = null;
            preview.remove();
            this.attachImageBtn.style.color = '';
            this.attachImageBtn.title = 'Attach image to solve questions';
            this.attachImageInput.value = '';
        });
    }

    async sendMessage() {
        const message = this.userInput.value.trim();

        // Check if there's a message or attached image
        if (!message && !this.attachedImage) return;

        // Hide welcome screen
        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }

        // Add user message
        this.addMessage(message || 'Analyze this image', 'user');

        // If image is attached, show it in chat
        if (this.attachedImage) {
            const imagePreview = document.createElement('div');
            imagePreview.className = 'message user-message';
            imagePreview.innerHTML = `
                <div class="message-content">
                    <img src="${this.attachedImage.data}" alt="${this.attachedImage.name}" 
                         style="max-width: 300px; border-radius: var(--radius-md); margin-top: var(--spacing-sm);">
                </div>
            `;
            this.messagesContainer.appendChild(imagePreview);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }

        // Clear input
        this.userInput.value = '';
        this.userInput.style.height = 'auto';

        // Disable send button
        this.sendBtn.disabled = true;

        // Show loading
        const loadingId = this.addLoadingMessage();

        try {
            // Prepare request body
            const requestBody = {
                message: message || 'What is in this image? Describe it in detail.'
            };

            // Add image if attached
            if (this.attachedImage) {
                requestBody.image = this.attachedImage.data;
            }

            // Send to API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            // Remove loading
            this.removeMessage(loadingId);

            if (data.success) {
                // Add AI response with typing animation
                await this.addMessageWithTyping(data.response, 'assistant');
            } else {
                this.addMessage(`Error: ${data.error}`, 'assistant');
            }

            // Clear attached image after sending
            if (this.attachedImage) {
                this.attachedImage = null;
                const preview = document.querySelector('.image-preview-indicator');
                if (preview) preview.remove();
                this.attachImageBtn.style.color = '';
                this.attachImageBtn.title = 'Attach image to solve questions';
                this.attachImageInput.value = '';
            }
        } catch (error) {
            this.removeMessage(loadingId);
            this.addMessage(`Error: ${error.message}`, 'assistant');
        } finally {
            this.sendBtn.disabled = false;
            this.userInput.focus();
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.id = `msg-${Date.now()}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'U' : 'F';

        const content = document.createElement('div');
        content.className = 'message-content';

        // Parse markdown-style code blocks
        const formattedText = this.formatMessage(text);
        content.innerHTML = formattedText;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        // Highlight code blocks
        messageDiv.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });

        return messageDiv.id;
    }

    async addMessageWithTyping(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? 'U' : 'F';

        const content = document.createElement('div');
        content.className = 'message-content';

        const textElement = document.createElement('p');
        content.appendChild(textElement);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);

        // Type the text
        await typeText(textElement, text, 20);

        // Format after typing
        const formattedText = this.formatMessage(text);
        content.innerHTML = formattedText;

        // Highlight code blocks
        messageDiv.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });

        // Speak the response if enabled
        if (this.tts.enabled) {
            this.tts.speak(text);
        }

        this.scrollToBottom();
    }

    addLoadingMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        const id = `loading-${Date.now()}`;
        messageDiv.id = id;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = 'F';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `
            <div class="loading-dots">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        `;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();

        return id;
    }

    removeMessage(id) {
        const message = document.getElementById(id);
        if (message) {
            message.remove();
        }
    }

    formatMessage(text) {
        let formatted = text;

        // 0. Escape HTML (safety first)
        formatted = formatted.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // 1. Extract Code Blocks (Placeholder)
        const codeBlocks = new Map();
        formatted = formatted.replace(/```(\w*)\s*([\s\S]*?)```/g, (match, lang, code) => {
            const id = `CODEBLOCK_${Math.random().toString(36).substr(2, 9)}`;
            codeBlocks.set(id, { lang: lang || 'plaintext', code: code });
            return id;
        });

        // 2. Bold Text (**text**)
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 3. Headers (### Header)
        formatted = formatted.replace(/^#{3}\s+(.*$)/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^#{2}\s+(.*$)/gm, '<h2>$1</h2>');
        formatted = formatted.replace(/^#{1}\s+(.*$)/gm, '<h1>$1</h1>');

        // 4. Unordered Lists (* or -)
        // Match a block of lines starting with - or *
        formatted = formatted.replace(/^(?:[\*\-]\s+.*(?:\r?\n|$))+/gm, (match) => {
            const items = match.trim().split(/\r?\n/);
            const listItems = items.map(item => `<li>${item.replace(/^[\*\-]\s+/, '')}</li>`).join('');
            return `<ul>${listItems}</ul>`;
        });

        // 5. Ordered Lists (1. )
        // Match a block of lines starting with number.
        formatted = formatted.replace(/^(?:\d+\.\s+.*(?:\r?\n|$))+/gm, (match) => {
            const items = match.trim().split(/\r?\n/);
            const listItems = items.map(item => `<li>${item.replace(/^\d+\.\s+/, '')}</li>`).join('');
            return `<ol>${listItems}</ol>`;
        });

        // 6. Section "Simple words me:" styling
        formatted = formatted.replace(/(Simple words me:)/gi, '<div class="simple-words-label">$1</div>');

        // 7. Inline Code (`code`)
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // 8. Paragraphs & Newlines
        // Wrap text that isn't a block element in <p>
        formatted = formatted.split(/\n\n+/).map(block => {
            if (block.trim().startsWith('<') || block.trim().startsWith('CODEBLOCK_')) {
                return block;
            }
            return `<p>${block.replace(/\n/g, '<br>')}</p>`;
        }).join('');

        // 9. Restore Code Blocks
        formatted = formatted.replace(/CODEBLOCK_\w+/g, (match) => {
            const block = codeBlocks.get(match);
            if (!block) return match;

            const languageLabel = this.getLanguageLabel(block.lang);
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            // Decode HTML entities for execution/display
            const decodedCode = block.code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

            // Generate language options
            const commonLangs = ['Python', 'JavaScript', 'Java', 'C++', 'Go', 'Rust', 'PHP', 'HTML', 'CSS', 'SQL', 'Bash', 'JSON'];
            let options = commonLangs.map(l =>
                `<option value="${l}" ${l.toLowerCase() === languageLabel.toLowerCase() ? 'selected' : ''}>${l}</option>`
            ).join('');

            if (!commonLangs.some(l => l.toLowerCase() === languageLabel.toLowerCase()) && languageLabel !== 'Code') {
                options = `<option value="${languageLabel}" selected>${languageLabel}</option>` + options;
            }

            return `
                <div class="code-block-container">
                    <div class="code-block-header">
                        <div class="language-select-wrapper">
                            <select class="code-language-select" onchange="window.chatAppInstance.translateCode('${codeId}', this.value)">
                                ${options}
                            </select>
                        </div>
                        <button class="code-copy-btn" onclick="window.chatAppInstance.copyCode('${codeId}')" title="Copy code">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"></path>
                            </svg>
                            <span class="copy-text">Copy code</span>
                        </button>
                    </div>
                    <pre><code id="${codeId}" class="language-${block.lang}">${this.escapeHtml(decodedCode.trim())}</code></pre>
                </div>
            `;
        });

        return formatted;
    }

    async translateCode(codeId, targetLang) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;

        const originalCode = codeElement.textContent;
        const currentLangClass = codeElement.className;

        // Show loading state
        codeElement.style.opacity = '0.5';

        try {
            const response = await fetch('/api/translate-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: originalCode,
                    target_language: targetLang
                })
            });

            const data = await response.json();

            if (data.success) {
                // Update code content
                codeElement.textContent = data.translated_code;
                codeElement.className = `language-${targetLang.toLowerCase()}`;
                hljs.highlightElement(codeElement);
            } else {
                console.error('Translation failed:', data.error);
                alert('Translation failed: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error translating code');
        } finally {
            codeElement.style.opacity = '1';
        }
    }

    copyCode(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;

        const text = codeElement.textContent;
        navigator.clipboard.writeText(text).then(() => {
            // Find the button associated with this code block
            const btn = codeElement.closest('.code-block-container').querySelector('.code-copy-btn');
            const originalHtml = btn.innerHTML;

            btn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 6L9 17l-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="copy-text">Copied!</span>
            `;
            btn.classList.add('copied');

            setTimeout(() => {
                btn.innerHTML = originalHtml;
                btn.classList.remove('copied');
            }, 2000);
        });
    }

    getLanguageLabel(lang) {
        const labels = {
            'python': 'Python',
            'javascript': 'JavaScript',
            'js': 'JavaScript',
            'typescript': 'TypeScript',
            'ts': 'TypeScript',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'csharp': 'C#',
            'cs': 'C#',
            'php': 'PHP',
            'ruby': 'Ruby',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'html': 'HTML',
            'css': 'CSS',
            'sql': 'SQL',
            'bash': 'Bash',
            'shell': 'Shell',
            'json': 'JSON',
            'xml': 'XML',
            'yaml': 'YAML',
            'markdown': 'Markdown',
            'md': 'Markdown',
            'plaintext': 'Code'
        };
        return labels[lang.toLowerCase()] || lang.toUpperCase();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearChat() {
        if (confirm('Clear all messages?')) {
            this.messagesContainer.innerHTML = '';
            this.welcomeScreen.style.display = 'block';
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // Image Generation Feature
    openImageGenerationModal() {
        const modal = document.createElement('div');
        modal.className = 'image-gen-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎨 AI Image Generation</h3>
                    <button class="modal-close" onclick="this.closest('.image-gen-modal').remove()">×</button>
                </div>
                <div class="modal-body">
                    <label>Describe the image you want to create:</label>
                    <textarea id="imagePrompt" placeholder="e.g., A futuristic city at sunset with flying cars..." rows="3"></textarea>
                    
                    <label>Style:</label>
                    <select id="imageStyle">
                        <option value="professional">Professional</option>
                        <option value="artistic">Artistic</option>
                        <option value="photorealistic">Photorealistic</option>
                        <option value="digital-art">Digital Art</option>
                        <option value="3d-render">3D Render</option>
                        <option value="anime">Anime</option>
                    </select>
                    
                    <button class="generate-btn" onclick="window.chatAppInstance.generateImage()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                            <path d="M21 15l-5-5L5 21" stroke-width="2"/>
                        </svg>
                        Generate Enhanced Prompt
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('imagePrompt').focus();
    }

    async generateImage() {
        const prompt = document.getElementById('imagePrompt').value.trim();
        const style = document.getElementById('imageStyle').value;

        if (!prompt) {
            alert('Please enter a description for the image!');
            return;
        }

        document.querySelector('.image-gen-modal').remove();

        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }

        this.addMessage(`🎨 Generate image: ${prompt} (${style} style)`, 'user');

        const loadingId = this.addLoadingMessage();

        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, style })
            });

            const data = await response.json();
            this.removeMessage(loadingId);

            if (data.success) {
                let message = `## 🎨 Enhanced Image Prompt\n\n${data.response}\n\n---\n\n### 🚀 Generate Your Image:\n\n`;

                for (const [key, platform] of Object.entries(data.platforms)) {
                    message += `**${platform.name}** - ${platform.best_for}\n`;
                    message += `[Open ${platform.name}](${platform.url})\n\n`;
                }

                await this.addMessageWithTyping(message, 'assistant');
            } else {
                this.addMessage(`❌ Error: ${data.error}`, 'assistant');
            }
        } catch (error) {
            this.removeMessage(loadingId);
            this.addMessage(`❌ Error: ${error.message}`, 'assistant');
        }
    }

    // Add copy functionality for code blocks
    setupCodeCopyButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.code-copy-btn')) {
                const btn = e.target.closest('.code-copy-btn');
                const codeId = btn.getAttribute('data-code-id');
                const codeElement = document.getElementById(codeId);

                if (codeElement) {
                    const code = codeElement.textContent;
                    navigator.clipboard.writeText(code).then(() => {
                        const copyText = btn.querySelector('.copy-text');
                        const originalText = copyText.textContent;
                        copyText.textContent = 'Copied!';
                        btn.classList.add('copied');

                        setTimeout(() => {
                            copyText.textContent = originalText;
                            btn.classList.remove('copied');
                        }, 2000);
                    });
                }
            }
        });
    }
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        new ParticleSystem(particleCanvas);
    }

    // Initialize matrix rain
    const matrixCanvas = document.getElementById('matrixCanvas');
    if (matrixCanvas) {
        new MatrixRain(matrixCanvas);
    }

    // Initialize binary rain
    const binaryCanvas = document.getElementById('binaryCanvas');
    if (binaryCanvas) {
        new BinaryRain(binaryCanvas);
    }

    // Initialize terminal typing
    const terminalText = document.getElementById('terminalText');
    if (terminalText) {
        new TerminalTyping(terminalText);
    }

    // Initialize chat app
    window.chatAppInstance = new ChatApp();

    // Initialize Navigation Handler
    new NavigationHandler();

    // Initialize New Chat Button
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            // Access text typing instance if needed to stop it
            // Clear messages
            const messagesDiv = document.getElementById('messages');
            if (messagesDiv) messagesDiv.innerHTML = '';

            // Show welcome screen
            const welcomeScreen = document.getElementById('welcomeScreen');
            if (welcomeScreen) welcomeScreen.style.display = 'block';

            // Reset input
            const userInput = document.getElementById('userInput');
            if (userInput) {
                userInput.value = '';
                userInput.style.height = 'auto';
            }

            // Optional: Reset any session ID or context on backend if required
            console.log('🔄 Chat reset');
        });
    }

    console.log('🚀 Friction Enterprise AI - Initialized');
    console.log('✨ 3D Animations Active');
    console.log('🎨 Particle System Running');
    console.log('💻 Matrix Rain Active');
    console.log('🔢 Binary Rain Active');
    console.log('🧊 3D Code Cubes Floating');
    console.log('🔊 Text-to-Speech Ready');
});

// ============================================
// NAVIGATION & MODALS
// ============================================

class NavigationHandler {
    constructor() {
        this.initLinkListeners();
        this.initModalListeners();
    }

    initLinkListeners() {
        const homeLink = document.getElementById('nav-home');
        const featuresLink = document.getElementById('nav-features');
        const modelsLink = document.getElementById('nav-models');
        const contactLink = document.getElementById('nav-contact');

        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.setActive(homeLink);
            });
        }

        if (featuresLink) {
            featuresLink.addEventListener('click', (e) => {
                e.preventDefault();
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    this.setActive(featuresLink);
                }
            });
        }

        if (modelsLink) {
            modelsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('modelsModal');
                this.setActive(modelsLink);
            });
        }

        if (contactLink) {
            contactLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal('contactModal');
                this.setActive(contactLink);
            });
        }
    }

    setActive(link) {
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
    }

    initModalListeners() {
        // Close buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                this.closeModal(modal);
            });
        });

        // Click outside to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Escape key to close
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.show');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            // Trigger reflow
            modal.offsetHeight;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300); // Match transition duration
        }
    }
}
