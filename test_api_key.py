"""Test with different API configurations"""
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

print(f"API Key present: {bool(GEMINI_API_KEY)}")
print(f"API Key length: {len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")
print(f"API Key starts with: {GEMINI_API_KEY[:10] if GEMINI_API_KEY else 'None'}...")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Try the simplest possible test
    print("\nTrying to list models...")
    try:
        models_list = list(genai.list_models())
        print(f"Total models available: {len(models_list)}")
        
        if len(models_list) == 0:
            print("\nWARNING: No models found!")
            print("This usually means:")
            print("1. API key is invalid or expired")
            print("2. API key doesn't have proper permissions")
            print("3. Region restriction")
            print("\nPlease get a new API key from:")
            print("https://aistudio.google.com/app/apikey")
        else:
            print("\nAll available models:")
            for m in models_list:
                print(f"  - {m.name}")
                
    except Exception as e:
        print(f"\nError: {e}")
        print(f"Error type: {type(e).__name__}")
        print("\nThis might be an authentication error.")
        print("Please verify your API key at: https://aistudio.google.com/app/apikey")
