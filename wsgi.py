"""
WSGI Entry Point for Vercel Serverless Deployment
This file serves as the entry point for Vercel's serverless Python runtime.
"""
from app import app

# Vercel expects the Flask app to be named 'app'
# This is already the case, but we're making it explicit
if __name__ == "__main__":
    app.run()
