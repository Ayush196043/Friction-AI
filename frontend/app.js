document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const messagesContainer = document.getElementById('messagesContainer');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const newChatBtn = document.getElementById('newChatBtn');
    const chatHistory = document.getElementById('chatHistory');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    let currentThreadId = localStorage.getItem('friction_thread_id') || `thread_${Date.now()}`;
    localStorage.setItem('friction_thread_id', currentThreadId);

    // Settings State
    let settings = JSON.parse(localStorage.getItem('friction_settings')) || {
        model: 'gemini-flash-lite-latest',
        style: 'balanced',
        voice: false
    };

    const micBtn = document.getElementById('micBtn');
    const voiceToggle = document.getElementById('voiceToggle');

    const settingsBtn = document.querySelector('.settings-btn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const modelSelect = document.getElementById('modelSelect');
    const skillChips = document.querySelectorAll('.skill-chip');

    // UI Initialization
    modelSelect.value = settings.model;
    if (voiceToggle) voiceToggle.checked = settings.voice;
    skillChips.forEach(chip => {
        if (chip.dataset.style === settings.style) chip.classList.add('active');
        else chip.classList.remove('active');
    });

    // Attachment State
    let attachments = [];
    const fileInput = document.getElementById('fileInput');
    const attachBtn = document.getElementById('attachBtn');
    const attachmentTray = document.getElementById('attachmentTray');
    const attachmentMenu = document.getElementById('attachmentMenu');
    const uploadFileOption = document.getElementById('uploadFileOption');
    const photosOption = document.getElementById('photosOption');
    const importCodeOption = document.getElementById('importCodeOption');

    // Initialize marked with highlight.js
    marked.setOptions({
        highlight: function (code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-'
    });

    // GSAP Welcome Animation
    if (window.gsap) {
        gsap.from('.welcome-screen h1', { opacity: 0, y: 30, duration: 1, ease: 'power4.out', delay: 0.2 });
        gsap.from('.welcome-screen p', { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 0.4 });
        gsap.from('.prompt-chip', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power4.out',
            delay: 0.6
        });
    }

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
    });

    // Handle Send (Streaming)
    // Handle Send (Streaming)
    const handleSend = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        userInput.value = '';
        userInput.style.height = 'auto';
        welcomeScreen.style.display = 'none';

        addMessage(text, 'user');

        const aiMessageDiv = addMessage('', 'ai', true);
        const aiContent = aiMessageDiv.querySelector('.content');
        let fullText = '';

        const attachmentData = attachments.map(a => ({
            data: a.base64,
            mime_type: a.type
        }));

        // Reset attachments
        attachments = [];
        attachmentTray.innerHTML = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    thread_id: currentThreadId,
                    model: settings.model,
                    style: settings.style,
                    attachments: attachmentData
                })
            });

            if (!response.ok) throw new Error('Failed to connect to Friction AI');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            aiContent.innerHTML = ''; // Remove typing indicator

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    // Check if this thread needs an AI title (only if it has exactly 1 turn)
                    const threadHistory = await fetch(`/api/history/${currentThreadId}`).then(res => res.json());
                    if (threadHistory.length === 1) {
                        generateAiTitle(currentThreadId);
                    }
                    if (settings.voice) {
                        speak(fullText.replace(/[*#`]/g, ''));
                    }
                    renderHistory();
                    break;
                }

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') {
                            renderHistory();
                            break;
                        }
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.chunk) {
                                fullText += data.chunk;
                                aiContent.innerHTML = marked.parse(fullText);
                                if (window.hljs) hljs.highlightAll();
                                addCopyButtons(aiContent);
                                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                            } else if (data.error) {
                                throw new Error(data.error);
                            }
                        } catch (e) {
                            console.error('Error parsing chunk:', e);
                        }
                    }
                }
            }
        } catch (error) {
            aiContent.innerHTML = `<span style="color: var(--error)">Error: ${error.message}</span>`;
        }
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    function addMessage(text, role, isPending = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        if (isPending) {
            contentDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
        } else {
            contentDiv.innerHTML = role === 'ai' ? marked.parse(text) : text;
            if (role === 'ai') addCopyButtons(contentDiv);
        }

        messageDiv.appendChild(contentDiv);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        return messageDiv;
    }

    function addCopyButtons(container) {
        container.querySelectorAll('pre').forEach(pre => {
            if (pre.querySelector('.copy-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.innerHTML = '<i class="far fa-copy"></i>';
            btn.title = 'Copy code';
            btn.onclick = () => {
                const code = pre.querySelector('code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => btn.innerHTML = '<i class="far fa-copy"></i>', 2000);
                });
            };
            pre.appendChild(btn);
        });
    }
    let currentCategory = '';
    let searchQuery = '';

    async function renderHistory() {
        try {
            let url = '/api/history';
            if (searchQuery) {
                url = `/api/search?q=${encodeURIComponent(searchQuery)}`;
            } else if (currentCategory) {
                url = `/api/history?category=${encodeURIComponent(currentCategory)}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            chatHistory.innerHTML = '';

            data.forEach(item => {
                const div = document.createElement('div');
                div.className = `history-item ${item.thread_id === currentThreadId ? 'active' : ''}`;

                const titleSpan = document.createElement('span');
                titleSpan.innerText = item.title.substring(0, 30) + (item.title.length > 30 ? '...' : '');
                div.appendChild(titleSpan);

                const badge = document.createElement('span');
                badge.className = 'category-badge';
                badge.innerText = item.category || 'General';
                div.appendChild(badge);

                const actions = document.createElement('div');
                actions.className = 'history-item-actions';

                // Move Folder Button
                const moveBtn = document.createElement('i');
                moveBtn.className = 'fas fa-folder-open history-action-btn';
                moveBtn.title = 'Move to category';
                moveBtn.onclick = (e) => {
                    e.stopPropagation();
                    const newCat = prompt('Enter new category (General, Work, Personal, etc.):', item.category);
                    if (newCat) changeCategory(item.thread_id, newCat);
                };

                // Delete Button
                const delBtn = document.createElement('i');
                delBtn.className = 'fas fa-trash history-action-btn del-chat-btn';
                delBtn.title = 'Delete chat';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteThread(item.thread_id);
                };

                actions.appendChild(moveBtn);
                actions.appendChild(delBtn);
                div.appendChild(actions);

                div.onclick = () => loadThread(item.thread_id);
                chatHistory.appendChild(div);
            });
        } catch (error) {
            console.error('History fetch failed:', error);
        }
    }

    async function changeCategory(threadId, category) {
        try {
            await fetch(`/api/history/${threadId}/category`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category })
            });
            renderHistory();
        } catch (error) {
            console.error('Change category failed:', error);
        }
    }

    async function generateAiTitle(threadId) {
        try {
            await fetch(`/api/history/${threadId}/title`, { method: 'POST' });
            renderHistory(); // Refresh to show new title
        } catch (error) {
            console.error('Title generation failed:', error);
        }
    }

    // Search Logic
    const chatSearch = document.getElementById('chatSearch');
    chatSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderHistory();
    });

    // Folder Logic
    const folderTabs = document.querySelectorAll('.folder-tab');
    folderTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            folderTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            searchQuery = ''; // Clear search when switching folders
            chatSearch.value = '';
            renderHistory();
        });
    });

    async function deleteThread(threadId) {
        if (!confirm('Are you sure you want to delete this chat?')) return;
        try {
            await fetch(`/api/history/${threadId}`, { method: 'DELETE' });
            if (currentThreadId === threadId) {
                newChatBtn.click();
            } else {
                renderHistory();
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    }

    async function loadThread(threadId) {
        currentThreadId = threadId;
        localStorage.setItem('friction_thread_id', threadId);
        welcomeScreen.style.display = 'none';
        messagesContainer.innerHTML = '';

        try {
            const response = await fetch(`/api/history/${threadId}`);
            const messages = await response.json();
            messages.forEach(m => {
                addMessage(m.user_msg, 'user');
                addMessage(m.ai_msg, 'ai');
            });
            renderHistory();
        } catch (error) {
            console.error('Load thread failed:', error);
        }
    }

    newChatBtn.addEventListener('click', () => {
        currentThreadId = `thread_${Date.now()}`;
        localStorage.setItem('friction_thread_id', currentThreadId);
        messagesContainer.innerHTML = '';
        messagesContainer.appendChild(welcomeScreen);
        welcomeScreen.style.display = 'block';
        renderHistory();
    });

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Chip Support
    document.querySelectorAll('.prompt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.dataset.prompt;
            handleSend();
        });
    });

    function downloadChat() {
        const messages = Array.from(messagesContainer.querySelectorAll('.message'));
        if (messages.length === 0) return;

        let text = 'Friction AI Chat Export\n' + '='.repeat(30) + '\n\n';
        messages.forEach(m => {
            const role = m.classList.contains('user') ? 'You' : 'Friction AI';
            const content = m.querySelector('.content').innerText;
            text += `[${role}]: ${content}\n\n`;
        });

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `friction_chat_${currentThreadId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Create Download Button in Header
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    downloadBtn.title = 'Export Chat';
    downloadBtn.onclick = downloadChat;
    document.querySelector('.chat-header').appendChild(downloadBtn);

    // Attachment Logic
    attachBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        attachmentMenu.classList.toggle('open');
    });

    uploadFileOption.addEventListener('click', () => {
        fileInput.setAttribute('accept', 'image/*,.pdf,.txt');
        fileInput.click();
        attachmentMenu.classList.remove('open');
    });

    photosOption.addEventListener('click', () => {
        fileInput.setAttribute('accept', 'image/*');
        fileInput.click();
        attachmentMenu.classList.remove('open');
    });

    importCodeOption.addEventListener('click', () => {
        fileInput.setAttribute('accept', '.py,.js,.html,.css,.java,.cpp,.txt');
        fileInput.click();
        attachmentMenu.classList.remove('open');
    });

    // Close menu when clicking outside
    window.addEventListener('click', (e) => {
        if (!attachmentMenu.contains(e.target) && e.target !== attachBtn) {
            attachmentMenu.classList.remove('open');
        }
    });

    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            if (attachments.length >= 5) {
                alert('Max 5 attachments allowed');
                break;
            }

            const base64 = await toBase64(file);
            const attachment = {
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                base64: base64.split(',')[1]
            };

            attachments.push(attachment);
            renderAttachment(attachment);
        }
        fileInput.value = '';
    });

    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    function renderAttachment(att) {
        const div = document.createElement('div');
        div.className = 'attachment-preview';

        if (att.type.startsWith('image/')) {
            div.innerHTML = `<img src="data:${att.type};base64,${att.base64}">`;
        } else {
            const icon = att.type === 'application/pdf' ? 'fa-file-pdf' : 'fa-file-alt';
            div.innerHTML = `<i class="fas ${icon}"></i>`;
        }

        const removeBtn = document.createElement('div');
        removeBtn.className = 'remove-attachment';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            attachments = attachments.filter(a => a.id !== att.id);
            div.remove();
        };

        div.appendChild(removeBtn);
        attachmentTray.appendChild(div);
    }

    // Modal Control
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('open');
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('open');
    });

    saveSettings.addEventListener('click', () => {
        settings.model = modelSelect.value; // Use the value from the dropdown
        const activeChip = document.querySelector('.skill-chip.active');
        settings.style = activeChip ? activeChip.dataset.style : 'balanced';
        settings.voice = voiceToggle.checked;
        localStorage.setItem('friction_settings', JSON.stringify(settings));
        settingsModal.classList.remove('open');

        // Show indicator in UI
        const modelDisplay = document.querySelector('.current-model span');
        if (modelDisplay) {
            modelDisplay.innerText = settings.model.includes('pro') ? 'Friction Pro' : 'Friction Flash';
        }
    });

    skillChips.forEach(chip => {
        chip.addEventListener('click', () => {
            skillChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('open');
    });

    renderHistory();

    // Voice Assistance Logic (STT & TTS)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            micBtn.classList.add('recording');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            userInput.style.height = 'auto';
            userInput.style.height = userInput.scrollHeight + 'px';
            handleSend();
        };

        recognition.onerror = () => {
            micBtn.classList.remove('recording');
        };

        recognition.onend = () => {
            micBtn.classList.remove('recording');
        };

        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('recording')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });
    } else {
        if (micBtn) micBtn.style.display = 'none';
    }

    function speak(text) {
        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a nice female/premium voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    }
});
