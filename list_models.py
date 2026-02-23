import google.generativeai as genai
import os
from dotenv import load_dotenv

dotenv_path = os.path.join("backend", ".env")
load_dotenv(dotenv_path)
api_key = os.getenv("GEMINI_API_KEY")

with open("models_list.txt", "w") as f:
    if api_key:
        genai.configure(api_key=api_key)
        try:
            f.write("Available models:\n")
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    f.write(f"{m.name}\n")
        except Exception as e:
            f.write(f"Error: {e}\n")
    else:
        f.write("API Key not found\n")
