import requests
import json

url = "http://localhost:5000/api/chat"
data = {
    "message": "hi",
    "thread_id": "test_thread",
    "model": "gemini-flash-lite-latest"
}

with open("debug_log.txt", "w", encoding="utf-8") as f:
    try:
        response = requests.post(url, json=data, stream=True)
        f.write(f"Status Code: {response.status_code}\n")
        for line in response.iter_lines():
            if line:
                f.write(f"Response: {line.decode('utf-8')}\n")
    except Exception as e:
        f.write(f"Error: {e}\n")
print("Done. Check debug_log.txt")
