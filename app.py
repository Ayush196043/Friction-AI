"""
Backend server for Friction AI (formerly Aditi Chatbot).
Handles chat interactions, code translation, and image generation using Google Gemini API.
"""
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
from io import BytesIO
from models import get_best_model, DEFAULT_CHAT_MODEL, DEFAULT_IMAGE_MODEL, FALLBACK_MODEL

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@app.route('/')
def home():
    """Render the main chat interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses"""
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({'error': 'API key not configured. Please add GEMINI_API_KEY to .env file'}), 500
        
        # Try with multiple models to ensure success
        # Prioritizing 2.0 Flash (Stable) and Lite models (High Quota)
        models_to_try = [
            'gemini-2.0-flash',          # Verified available, stable
            'gemini-2.5-flash-lite',     # Lite model = Higher rate limits
            'gemini-flash-latest',       # Generic alias fallback
            'gemini-2.5-flash'           # Latest (try last due to low quota)
        ]
        
        # System instruction for the model
        system_instruction = """You are Friction AI, an advanced enterprise AI assistant developed by the Antigravity team.
    
    CORE IDENTITY:
    - Name: Friction AI
    - Persona: Professional, precise, and code-focused. 
    - Tone: Direct and efficient. Minimise conversational filler.
    
    RESPONSE GUIDELINES:
    1. CODING TASKS:
       - PRIORITIZE Code: When asked for code, provide the solution immediately in a code block.
       - AVOID "Yapping": Do not add unnecessary intros like "Here is the code" or "Sure". Just give the code and a brief explanation if needed.
       - STYLE: Use clean, Pythonic/Idiomatic code. Use comments for clarity.
       - FORMAT: Always use markdown with language tags (e.g., ```python).
    
    2. GENERAL QUERIES:
       - Be helpful and concise. Use Markdown (bold, lists) for readability.
    
    3. IMAGE GENERATION:
       - Guide users to the 'Generate Image' button for visual requests.
    
    4. INTERACTION:
       - Identify as "Friction AI" by Antigravity.
    """
        
        errors = []
        for model_name in models_to_try:
            try:
                print(f"🔄 Trying model: {model_name}")
                model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
                response = model.generate_content(user_message)
                
                print(f"✅ Success with model: {model_name}")
                return jsonify({
                    'response': response.text,
                    'success': True,
                    'model_used': model_name
                })
            except Exception as model_error:
                error_msg = str(model_error)
                print(f"❌ Failed with {model_name}: {error_msg}")
                errors.append(f"{model_name}: {error_msg}")
                
                # If rate limit (429), wait a bit before trying next
                if "429" in error_msg:
                    print("⏳ Quota exceeded, waiting 4s before next model...")
                    import time
                    time.sleep(4)
                
                continue
        
        # If all models failed
        return jsonify({
            'error': f'All models failed. Primary reason: Quota Exceeded (429). Please wait 30s.. Details: {errors[0]}',
            'success': False
        }), 500
    
    except Exception as e:
        return jsonify({
            'error': f'Server Error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/generate-image', methods=['POST'])
def generate_image():
    """Enhanced image generation with professional prompt engineering"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        style = data.get('style', 'professional')
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({'error': 'API key not configured'}), 500
        
        # Use Gemini for professional prompt engineering
        model = genai.GenerativeModel(DEFAULT_IMAGE_MODEL)
        
        # Enhanced prompt engineering
        enhanced_prompt = f"""You are an expert AI image generation prompt engineer.

User's request: "{prompt}"
Style preference: {style}

Create a professional, detailed image generation prompt with these sections:

**1. Enhanced Description** (2-3 sentences)
Expand the user's idea with rich visual details, specific elements, and atmospheric qualities.

**2. Technical Specifications**
- Lighting: (e.g., golden hour, studio lighting, dramatic shadows)
- Camera: (e.g., wide angle, macro, aerial view)
- Composition: (e.g., rule of thirds, centered, dynamic)
- Quality: (e.g., 8k resolution, highly detailed, photorealistic)

**3. Style & Aesthetic**
- Art style: (e.g., photorealistic, digital art, 3D render)
- Color palette: (specific colors and tones)
- Mood: (e.g., professional, dramatic, serene)

**4. Negative Prompt**
List 5-7 things to avoid for better results (e.g., blurry, distorted, low quality)

**5. Platform Recommendations**
- Best suited for: DALL-E 3 / Midjourney / Stable Diffusion
- Suggested aspect ratio
- Additional tips

Format clearly with markdown headers. Make it copy-paste ready for immediate use."""
        
        response = model.generate_content(enhanced_prompt)
        
        return jsonify({
            'response': response.text,
            'original_prompt': prompt,
            'style': style,
            'success': True,
            'platforms': {
                'dalle3': {
                    'name': 'DALL-E 3',
                    'url': 'https://platform.openai.com/playground',
                    'best_for': 'Photorealistic, precise prompts'
                },
                'midjourney': {
                    'name': 'Midjourney',
                    'url': 'https://www.midjourney.com/',
                    'best_for': 'Artistic, creative styles'
                },
                'leonardo': {
                    'name': 'Leonardo.AI',
                    'url': 'https://leonardo.ai/',
                    'best_for': 'Game assets, 3D renders'
                },
                'stable_diffusion': {
                    'name': 'Stable Diffusion',
                    'url': 'https://stability.ai/',
                    'best_for': 'Customizable, open-source'
                }
            },
            'message': '✨ Professional prompt created! Copy and use with your preferred platform.'
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Error: {str(e)}',
            'success': False
        }), 500

@app.route('/api/translate-code', methods=['POST'])
def translate_code():
    """Translate code to a different programming language"""
    try:
        data = request.json
        code = data.get('code', '')
        target_language = data.get('target_language', '')
        
        if not code or not target_language:
            return jsonify({'error': 'Code and target language are required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({'error': 'API key not configured'}), 500
            
        model = genai.GenerativeModel(DEFAULT_CHAT_MODEL)
        
        prompt = f"""You are an expert code translator.
translate the following code to {target_language}.
Return ONLY the translated code. Do not include markdown backticks, explanations, or any other text.
Maintain the original logic and comments (translated if necessary).

Code to translate:
{code}"""
        
        response = model.generate_content(prompt)
        
        return jsonify({
            'translated_code': response.text.strip(),
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': f'Error translating code: {str(e)}',
            'success': False
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'api_configured': bool(GEMINI_API_KEY)
    })

if __name__ == '__main__':
    print("🚀 Starting Friction AI Server...")
    print("📝 Make sure to add your GEMINI_API_KEY to the .env file")
    print("🌐 Server running on http://localhost:5000")
    print("✨ Image generation: Enhanced prompt engineering enabled")
    app.run(debug=True, host='0.0.0.0', port=5000)
