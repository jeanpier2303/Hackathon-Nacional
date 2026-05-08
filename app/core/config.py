import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY=os.getenv("OPENROUTER_API_KEY")

BASE_LLM_URL="https://openrouter.ai/api/v1/chat/completions"

CHAT_MODEL="deepseek/deepseek-chat-v3"

ANALYSIS_MODEL="qwen/qwen-2.5-72b-instruct"

CHAT_TEMPERATURE=0.4

ANALYSIS_TEMPERATURE=0.2

MAX_CONTEXT_MESSAGES=10