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

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Global error handlers to ensure JSON responses
@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors with JSON response"""
    return jsonify({
        'error': 'Endpoint not found',
        'success': False
    }), 404

@app.errorhandler(500)
def internal_error(e):
    """Handle 500 errors with JSON response"""
    return jsonify({
        'error': f'Internal server error: {str(e)}',
        'success': False
    }), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all uncaught exceptions with JSON response"""
    return jsonify({
        'error': f'An unexpected error occurred: {str(e)}',
        'success': False
    }), 500

@app.route('/')
def home():
    """Render the main chat interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI responses (with optional image support)"""
    try:
        data = request.json
        user_message = data.get('message', '')
        image_data = data.get('image', None)  # Base64 image data
        
        if not user_message and not image_data:
            return jsonify({'error': 'Message or image is required'}), 400
        
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
    - Persona: Professional, precise, and educational.
    - Tone: Structured, clear, and easy to understand.
    
    RESPONSE FORMATTING GUIDELINES (STRICT):
    1. **Structure**:
       - Use clearly defined sections with **Bold Headers**.
       - Use **Numbered Lists** (1. 2. 3.) for main steps or points.
       - Use **Bullet Points** (* or -) for details under main points.
    
    2. **Explanation Style**:
       - Start with a direct definition or answer.
       - Use a "Simple words me:" section for complex topics.
       - Break down long explanations into points.
    
    3. **Visuals**:
       - Use Markdown for bolding key terms (e.g., **CPU**, **RAM**).
       - Ensure good spacing between sections.
    
    4. **CODING TASKS**:
       - Provide code in markdown blocks with language tags.
       - briefly explain the code after the block.

    5. **Language**:
       - If the user asks in Hinglish/Hindi, reply in the same language but keep technical terms in English.
    """
        
        errors = []
        for model_name in models_to_try:
            try:
                print(f"🔄 Trying model: {model_name}")
                model = genai.GenerativeModel(model_name, system_instruction=system_instruction)
                
                # If image is provided, process it
                if image_data:
                    # Import PIL for image processing
                    from PIL import Image
                    import io
                    
                    # Remove data URL prefix if present (data:image/png;base64,...)
                    if ',' in image_data:
                        image_data = image_data.split(',')[1]
                    
                    # Decode base64 image
                    image_bytes = base64.b64decode(image_data)
                    image = Image.open(io.BytesIO(image_bytes))
                    
                    # Generate content with image and text
                    if user_message:
                        response = model.generate_content([user_message, image])
                    else:
                        response = model.generate_content(["What is in this image? Describe it in detail.", image])
                else:
                    # Text-only message
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
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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
            
        model = genai.GenerativeModel('gemini-2.0-flash')
        
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
    # Production mode - debug=False for deployment
    app.run(debug=False, host='0.0.0.0', port=5000)

