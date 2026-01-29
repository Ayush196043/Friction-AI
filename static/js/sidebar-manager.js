// ============================================
// SIMPLIFIED SIDEBAR - BASIC CHAT HISTORY
// ============================================

class SimpleSidebarManager {
    constructor() {
        this.chatHistory = [];
        this.currentChatId = null;
        this.chatHistoryList = document.getElementById('chatHistoryList');

        this.loadChatHistory();
        this.initQuickActions();
    }

    // Initialize quick action buttons
    initQuickActions() {
        // Image Generation button
        const imageBtn = document.getElementById('sidebarImageBtn');
        if (imageBtn) {
            imageBtn.addEventListener('click', () => {
                if (window.chatAppInstance) {
                    window.chatAppInstance.openImageGenerationModal();
                }
            });
        }

        // Voice Assistant button
        const voiceBtn = document.getElementById('sidebarVoiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => {
                this.toggleVoiceAssistant(voiceBtn);
            });
        }

        // Image Upload button
        const uploadBtn = document.getElementById('sidebarUploadBtn');
        const fileInput = document.getElementById('sidebarImageUpload');

        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });
        }
    }

    // Handle image upload
    handleImageUpload(file) {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Read and display image
        const reader = new FileReader();
        reader.onload = (e) => {
            this.showImagePreviewModal(e.target.result, file.name);
        };
        reader.readAsDataURL(file);
    }

    // Show image preview modal with editing tools
    showImagePreviewModal(imageData, fileName) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content glass-panel" style="max-width: 900px;">
                <span class="close-modal">×</span>
                <h2 class="gradient-text">Edit & Analyze Image</h2>
                <div style="margin-top: var(--spacing-xl);">
                    <!-- Image Editor -->
                    <div style="display: grid; grid-template-columns: 1fr 250px; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
                        <!-- Image Canvas -->
                        <div style="text-align: center; background: rgba(0,0,0,0.3); border-radius: var(--radius-lg); padding: var(--spacing-lg); position: relative;">
                            <canvas id="imageCanvas" style="max-width: 100%; max-height: 400px; border-radius: var(--radius-md);"></canvas>
                            <img id="originalImage" src="${imageData}" style="display: none;">
                        </div>
                        
                        <!-- Editing Tools -->
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
                            <h3 style="font-size: 0.875rem; color: var(--text-secondary); margin: 0;">Edit Tools</h3>
                            
                            <!-- Rotate -->
                            <button class="edit-tool-btn" id="rotateBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" stroke-width="2"/>
                                </svg>
                                Rotate 90°
                            </button>
                            
                            <!-- Flip Horizontal -->
                            <button class="edit-tool-btn" id="flipHBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3m8 0h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3m0 18V3" stroke-width="2"/>
                                </svg>
                                Flip Horizontal
                            </button>
                            
                            <!-- Flip Vertical -->
                            <button class="edit-tool-btn" id="flipVBtn">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 8V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M3 12h18" stroke-width="2"/>
                                </svg>
                                Flip Vertical
                            </button>
                            
                            <!-- Brightness -->
                            <div>
                                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">
                                    Brightness: <span id="brightnessValue">100</span>%
                                </label>
                                <input type="range" id="brightnessSlider" min="0" max="200" value="100" 
                                       style="width: 100%;">
                            </div>
                            
                            <!-- Contrast -->
                            <div>
                                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">
                                    Contrast: <span id="contrastValue">100</span>%
                                </label>
                                <input type="range" id="contrastSlider" min="0" max="200" value="100" 
                                       style="width: 100%;">
                            </div>
                            
                            <!-- Saturation -->
                            <div>
                                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">
                                    Saturation: <span id="saturationValue">100</span>%
                                </label>
                                <input type="range" id="saturationSlider" min="0" max="200" value="100" 
                                       style="width: 100%;">
                            </div>
                            
                            <!-- Filters -->
                            <div>
                                <label style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 4px;">
                                    Filters
                                </label>
                                <select id="filterSelect" style="width: 100%; padding: 6px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: var(--radius-sm); color: var(--text-primary);">
                                    <option value="none">None</option>
                                    <option value="grayscale">Grayscale</option>
                                    <option value="sepia">Sepia</option>
                                    <option value="invert">Invert</option>
                                    <option value="blur">Blur</option>
                                </select>
                            </div>
                            
                            <!-- Reset -->
                            <button class="edit-tool-btn" id="resetBtn" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3);">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke-width="2"/>
                                    <path d="M3 3v5h5" stroke-width="2"/>
                                </svg>
                                Reset All
                            </button>
                        </div>
                    </div>
                    
                    <!-- Question Input -->
                    <div style="margin-bottom: var(--spacing-lg);">
                        <label style="display: block; margin-bottom: var(--spacing-sm); color: var(--text-secondary); font-size: 0.875rem;">
                            Ask a question about this image (optional)
                        </label>
                        <textarea id="imageQuestion" 
                                  placeholder="What's in this image? Describe it in detail..."
                                  style="width: 100%; min-height: 80px; padding: var(--spacing-md); background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: var(--radius-md); color: var(--text-primary); font-family: inherit; resize: vertical;"></textarea>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="display: flex; gap: var(--spacing-md);">
                        <button class="generate-btn" id="analyzeImageBtn" style="flex: 1;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-right: 8px;">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke-width="2"/>
                            </svg>
                            Analyze Image
                        </button>
                        <button class="generate-btn" id="downloadBtn" style="flex: 1; background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1));">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="margin-right: 8px;">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2"/>
                            </svg>
                            Download
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Initialize image editor
        this.initImageEditor(modal, imageData, fileName);

        // Close modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Initialize image editor
    initImageEditor(modal, imageData, fileName) {
        const canvas = modal.querySelector('#imageCanvas');
        const ctx = canvas.getContext('2d');
        const img = modal.querySelector('#originalImage');

        let rotation = 0;
        let flipH = 1;
        let flipV = 1;
        let brightness = 100;
        let contrast = 100;
        let saturation = 100;
        let filter = 'none';

        // Load image
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            applyEdits();
        };

        const applyEdits = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Save context
            ctx.save();

            // Apply transformations
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(flipH, flipV);

            // Apply filters
            let filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

            if (filter === 'grayscale') filterStr += ' grayscale(100%)';
            else if (filter === 'sepia') filterStr += ' sepia(100%)';
            else if (filter === 'invert') filterStr += ' invert(100%)';
            else if (filter === 'blur') filterStr += ' blur(3px)';

            ctx.filter = filterStr;

            // Draw image
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            // Restore context
            ctx.restore();
        };

        // Rotate button
        modal.querySelector('#rotateBtn').addEventListener('click', () => {
            rotation = (rotation + 90) % 360;
            applyEdits();
        });

        // Flip horizontal
        modal.querySelector('#flipHBtn').addEventListener('click', () => {
            flipH *= -1;
            applyEdits();
        });

        // Flip vertical
        modal.querySelector('#flipVBtn').addEventListener('click', () => {
            flipV *= -1;
            applyEdits();
        });

        // Brightness slider
        const brightnessSlider = modal.querySelector('#brightnessSlider');
        const brightnessValue = modal.querySelector('#brightnessValue');
        brightnessSlider.addEventListener('input', (e) => {
            brightness = e.target.value;
            brightnessValue.textContent = brightness;
            applyEdits();
        });

        // Contrast slider
        const contrastSlider = modal.querySelector('#contrastSlider');
        const contrastValue = modal.querySelector('#contrastValue');
        contrastSlider.addEventListener('input', (e) => {
            contrast = e.target.value;
            contrastValue.textContent = contrast;
            applyEdits();
        });

        // Saturation slider
        const saturationSlider = modal.querySelector('#saturationSlider');
        const saturationValue = modal.querySelector('#saturationValue');
        saturationSlider.addEventListener('input', (e) => {
            saturation = e.target.value;
            saturationValue.textContent = saturation;
            applyEdits();
        });

        // Filter select
        modal.querySelector('#filterSelect').addEventListener('change', (e) => {
            filter = e.target.value;
            applyEdits();
        });

        // Reset button
        modal.querySelector('#resetBtn').addEventListener('click', () => {
            rotation = 0;
            flipH = 1;
            flipV = 1;
            brightness = 100;
            contrast = 100;
            saturation = 100;
            filter = 'none';

            brightnessSlider.value = 100;
            brightnessValue.textContent = 100;
            contrastSlider.value = 100;
            contrastValue.textContent = 100;
            saturationSlider.value = 100;
            saturationValue.textContent = 100;
            modal.querySelector('#filterSelect').value = 'none';

            applyEdits();
        });

        // Download button
        modal.querySelector('#downloadBtn').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'edited_' + fileName;
            link.href = canvas.toDataURL();
            link.click();
        });

        // Analyze button
        modal.querySelector('#analyzeImageBtn').addEventListener('click', () => {
            const question = modal.querySelector('#imageQuestion').value.trim();
            const editedImageData = canvas.toDataURL();
            this.sendImageToChat(editedImageData, fileName, question);
            modal.remove();
        });
    }

    // Send image to chat
    async sendImageToChat(imageData, fileName, question) {
        if (!window.chatAppInstance) return;

        // Add user message with image
        const userMessage = question || 'Analyze this image';
        window.chatAppInstance.addMessage(userMessage, 'user');

        // Add image preview to chat
        const messagesContainer = document.getElementById('messages');
        const imagePreview = document.createElement('div');
        imagePreview.className = 'message user-message';
        imagePreview.innerHTML = `
            <div class="message-content">
                <img src="${imageData}" alt="${fileName}" 
                     style="max-width: 300px; border-radius: var(--radius-md); margin-top: var(--spacing-sm);">
            </div>
        `;
        messagesContainer.appendChild(imagePreview);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Show loading
        window.chatAppInstance.addMessage('', 'bot');

        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: question || 'What is in this image? Describe it in detail.',
                    image: imageData
                })
            });

            const data = await response.json();

            // Remove loading message
            const loadingMsg = messagesContainer.querySelector('.message.bot-message:last-child');
            if (loadingMsg) loadingMsg.remove();

            // Add bot response
            if (data.response) {
                window.chatAppInstance.addMessage(data.response, 'bot');
            } else if (data.error) {
                window.chatAppInstance.addMessage('Error: ' + data.error, 'bot');
            }
        } catch (error) {
            console.error('Error analyzing image:', error);
            const loadingMsg = messagesContainer.querySelector('.message.bot-message:last-child');
            if (loadingMsg) loadingMsg.remove();
            window.chatAppInstance.addMessage('Sorry, there was an error analyzing the image.', 'bot');
        }
    }

    // Toggle voice assistant
    toggleVoiceAssistant(button) {
        if (window.chatAppInstance && window.chatAppInstance.voiceAssistant) {
            const isListening = window.chatAppInstance.voiceAssistant.isListening;

            if (isListening) {
                window.chatAppInstance.voiceAssistant.stop();
                button.classList.remove('active');
            } else {
                window.chatAppInstance.voiceAssistant.start();
                button.classList.add('active');
            }
        }
    }

    // Load chat history from localStorage
    loadChatHistory() {
        const saved = localStorage.getItem('frictionAI_chatHistory');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
            this.renderChatHistory();
        }
    }

    // Save chat history to localStorage
    saveChatHistory() {
        localStorage.setItem('frictionAI_chatHistory', JSON.stringify(this.chatHistory));
    }

    // Create new chat
    createNewChat(firstMessage = '') {
        const chatId = 'chat_' + Date.now();
        const chat = {
            id: chatId,
            title: firstMessage ? this.generateChatTitle(firstMessage) : 'New chat',
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.chatHistory.unshift(chat);
        this.currentChatId = chatId;
        this.saveChatHistory();
        this.renderChatHistory();

        return chatId;
    }

    // Generate chat title from first message
    generateChatTitle(message) {
        let title = message.substring(0, 40);
        if (message.length > 40) {
            title += '...';
        }
        return title;
    }

    // Update chat with new message
    updateChat(chatId, message, sender) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (chat) {
            chat.messages.push({ sender, text: message, timestamp: new Date().toISOString() });
            chat.updatedAt = new Date().toISOString();

            if (sender === 'user' && chat.messages.length === 1) {
                chat.title = this.generateChatTitle(message);
            }

            this.saveChatHistory();
            this.renderChatHistory();
        }
    }

    // Render chat history list
    renderChatHistory() {
        if (!this.chatHistoryList) return;

        this.chatHistoryList.innerHTML = '';

        if (this.chatHistory.length === 0) {
            this.chatHistoryList.innerHTML = `
                <div style="padding: var(--spacing-lg); text-align: center; color: var(--text-muted); font-size: 0.875rem;">
                    No chats yet
                </div>
            `;
            return;
        }

        this.chatHistory.forEach(chat => {
            const item = this.createChatHistoryItem(chat);
            this.chatHistoryList.appendChild(item);
        });
    }

    // Create chat history item element
    createChatHistoryItem(chat) {
        const div = document.createElement('div');
        div.className = 'chat-history-item';
        if (chat.id === this.currentChatId) {
            div.classList.add('active');
        }
        div.dataset.chatId = chat.id;

        div.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" 
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="chat-title">${this.escapeHtml(chat.title)}</span>
        `;

        // Click to load chat
        div.addEventListener('click', () => {
            this.loadChat(chat.id);
        });

        return div;
    }

    // Load a specific chat
    loadChat(chatId) {
        const chat = this.chatHistory.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;

        // Clear current messages
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }

        // Hide welcome screen
        const welcomeScreen = document.getElementById('welcomeScreen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }

        // Load messages
        if (window.chatAppInstance) {
            chat.messages.forEach(msg => {
                window.chatAppInstance.addMessage(msg.text, msg.sender);
            });
        }

        this.renderChatHistory();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize sidebar manager
let sidebarManager;
document.addEventListener('DOMContentLoaded', () => {
    sidebarManager = new SimpleSidebarManager();
});
