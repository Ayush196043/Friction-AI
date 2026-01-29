"""Test script to check if Gemini API is working"""
import google.generativeai as genai
import os
from dotenv import load_dotenv
from models import DEFAULT_CHAT_MODEL, FALLBACK_MODEL

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
print(f"API Key found: {bool(GEMINI_API_KEY)}")
print(f"API Key (first 10 chars): {GEMINI_API_KEY[:10] if GEMINI_API_KEY else 'None'}")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Try different models
    models_to_try = [DEFAULT_CHAT_MODEL, FALLBACK_MODEL, 'gemini-1.5-pro', 'gemini-pro']
    
    for model_name in models_to_try:
        try:
            print(f"\n🔄 Trying model: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Say hello in one word")
            print(f"✅ SUCCESS with {model_name}")
            print(f"Response: {response.text}")
            break
        except Exception as e:
            print(f"❌ FAILED with {model_name}")
            print(f"Error: {str(e)}")
            print(f"Error type: {type(e).__name__}")
else:
    print("❌ No API key found!")
