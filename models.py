"""
Gemini Models Configuration
Available models aur unke use cases
"""

# Available Gemini Models (Based on your API key - 2026 Updated)
GEMINI_MODELS = {
    'gemini-2.5-flash': {
        'description': 'Fast and efficient model (Latest)',
        'use_case': 'Quick responses, general chat',
        'best_for': 'chat'
    },
    'gemini-2.0-flash': {
        'description': 'Stable efficient model',
        'use_case': 'Reliable fallback',
        'best_for': 'chat'
    },
    'gemini-1.5-flash': {
         'description': 'Legacy stable model',
         'use_case': 'Maximum compatibility',
         'best_for': 'chat'
    }
}

# Default models for different tasks
DEFAULT_CHAT_MODEL = 'gemini-2.0-flash'  # Stable and reliable
DEFAULT_IMAGE_MODEL = 'gemini-2.0-flash' # Flash works great for prompts
FALLBACK_MODEL = 'gemini-2.5-flash-lite' # Good quota backup

# Model selection helper
def get_best_model(task_type='chat'):
    """
    Task ke hisaab se best model return karta hai
    
    Args:
        task_type: 'chat', 'image', 'complex'
    
    Returns:
        str: Model name
    """
    model_map = {
        'chat': DEFAULT_CHAT_MODEL,
        'image': DEFAULT_IMAGE_MODEL,
        'complex': 'gemini-2.0-flash', 
        'fast': 'gemini-2.5-flash-lite'
    }
    
    return model_map.get(task_type, DEFAULT_CHAT_MODEL)

def get_available_models():
    """Return list of all available model names"""
    return list(GEMINI_MODELS.keys())

def get_model_info(model_name):
    """Get information about a specific model"""
    return GEMINI_MODELS.get(model_name, {})
