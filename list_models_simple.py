import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("NO API KEY")
    exit()

genai.configure(api_key=api_key)

try:
    print("Listing models:")
    for m in genai.list_models():
        print(f"Model: {m.name}")
        print(f"Methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error: {e}")
