# 🤖 Aditi AI Chatbot - Modern 3D UI

A stunning, modern AI chatbot powered by Google Gemini with premium 3D UI/UX design.

## ✨ Features

### 🎨 Modern UI/UX
- **3D Components**: Floating spheres, rotating cubes, and depth effects
- **Glassmorphism**: Beautiful frosted glass effects throughout
- **Animated Background**: Dynamic gradient orbs with smooth animations
- **Dark Mode**: Toggle between light and dark themes with smooth transitions
- **Responsive Design**: Works perfectly on all devices

### 🚀 Functionality
- **Real-time Chat**: Instant responses from Gemini 2.5 Flash
- **Multilingual Support**: Chat in any language
- **Image Generation Guidance**: Get detailed image descriptions
- **Smart Prompts**: Quick-start suggestions for common queries
- **Message Formatting**: Support for **bold**, *italic*, and `code`
- **Typing Indicators**: Animated dots while AI is thinking
- **Error Handling**: Graceful error messages with auto-dismiss

### 🎯 Advanced Features
- **Theme Persistence**: Your theme choice is saved
- **Smooth Animations**: Bouncy, professional animations throughout
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Auto-scroll**: Messages automatically scroll into view
- **Clear Chat**: Easy conversation reset
- **Status Indicator**: Live connection status

## 🎨 Design Highlights

### Color Palette
- Primary Gradient: Purple to Blue (#667eea → #764ba2)
- Secondary Gradient: Pink to Red (#f093fb → #f5576c)
- Accent Gradient: Blue to Cyan (#4facfe → #00f2fe)

### 3D Elements
1. **Rotating Logo Cube**: 3D cube with perspective transform
2. **Floating Sphere**: Welcome screen centerpiece with glow effect
3. **Feature Cards**: Hover effects with depth and shadows
4. **Glass Buttons**: Frosted glass with backdrop blur
5. **Gradient Orbs**: Animated background elements

### Animations
- Smooth fade-ins and slide-ins
- Bounce effects on interactive elements
- Floating and rotating 3D objects
- Pulsing status indicators
- Gradient transitions

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **AI Model**: Google Gemini 2.5 Flash
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Fonts**: Inter, Space Grotesk
- **Design**: Custom CSS with 3D transforms, glassmorphism

## 📦 Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up your API key in `.env`:
```
GEMINI_API_KEY=your-api-key-here
```

3. Run the server:
```bash
python app.py
```

4. Open browser:
```
http://localhost:5000
```

## 🎮 Usage

### Basic Chat
1. Type your message in the input box
2. Press Enter or click the send button
3. Get instant AI responses

### Quick Prompts
Click any of the suggested prompt chips to instantly start a conversation:
- 🔬 Quantum Computing
- 🚀 Space Story
- 💻 Learn Python
- 🥗 Healthy Meals

### Image Generation
1. Type your image description
2. Click the image icon (🎨)
3. Get detailed generation guidance

### Dark Mode
Click the theme toggle button (☀️/🌙) in the header to switch themes.

### Clear Chat
Click the trash icon to clear all messages and start fresh.

## 🎨 Customization

### Change Colors
Edit `static/css/style.css` and modify the CSS variables:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... */
}
```

### Modify Animations
Adjust animation durations in CSS:
```css
--transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
```

## 🌟 Key Files

- `app.py` - Flask backend with Gemini integration
- `models.py` - Available Gemini models configuration
- `templates/index.html` - Main HTML structure
- `static/css/style.css` - Complete styling with 3D effects
- `static/js/script.js` - Interactive functionality

## 🚀 Performance

- Optimized animations using CSS transforms
- Efficient DOM manipulation
- Lazy loading of heavy effects
- Smooth 60fps animations
- Minimal JavaScript overhead

## 🎯 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## 📝 License

MIT License - Feel free to use and modify!

## 🙏 Credits

- **AI Model**: Google Gemini
- **Design**: Custom modern 3D UI
- **Fonts**: Google Fonts (Inter, Space Grotesk)

---

**Enjoy your beautiful AI chatbot! 🎉**

For issues or questions, check the console for detailed logs.
