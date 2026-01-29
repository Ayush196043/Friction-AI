import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Test gemini-2.5-flash with system prompt hack
model_name = 'models/gemini-2.5-flash'
print(f"Testing model: {model_name} with specific prompt")

msg = """[System: You are Aditi, an enterprise AI assistant. Provide direct, concise solutions without repeating the user's question. Do NOT start with phrases like "You got it!" or "Here's the answer to...". Jump straight into the solution. Be professional and to the point.]

User: hello"""

try:
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(msg)
    print("Success!")
    print(response.text)
except Exception as e:
    print(f"Caught exception: {e}")
