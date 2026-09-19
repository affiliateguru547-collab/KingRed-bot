import time
import json
import re
from typing import Dict, Any, Callable, Optional, List

# ==========================================
# STEP 3: MEMORY & CONTEXT
# ==========================================
class UserMemory:
    """Stores user preferences, language settings, and interaction counts."""
    
    def __init__(self):
        # In production, replace with a database (e.g., PostgreSQL, Redis, or SQLite)
        self.db: Dict[str, Dict[str, Any]] = {}

    def get_profile(self, user_id: str) -> Dict[str, Any]:
        if user_id not in self.db:
            self.db[user_id] = {
                "preferred_language": "English",
                "downloads_count": 0,
                "preferred_platform": None,
                "is_admin": False,
                "last_active": time.time()
            }
        return self.db[user_id]

    def update_profile(self, user_id: str, key: str, value: Any) -> None:
        profile = self.get_profile(user_id)
        profile[key] = value
        profile["last_active"] = time.time()

    def increment_download(self, user_id: str, platform: str) -> int:
        profile = self.get_profile(user_id)
        profile["downloads_count"] += 1
        profile["preferred_platform"] = platform
        return profile["downloads_count"]


# ==========================================
# STEP 1: THE LISTENER - Understanding Intent
# ==========================================
class IntentClassifier:
    """Classifies incoming messages into Fast, Tool, Knowledge, or General Chat intents."""

    @staticmethod
    def classify(message: str) -> Dict[str, Any]:
        msg = message.strip().lower()

        # 1. Fast Path Triggers
        if msg in ["ping", "time", "status", "uptime"]:
            return {"type": "FAST", "action": msg}

        # 2. Tool Path Triggers (Actions)
        url_pattern = r'https?://[^\s]+'
        if re.search(url_pattern, msg):
            url = re.search(url_pattern, msg).group(0)
            platform = "unknown"
            if "tiktok.com" in url:
                platform = "tiktok"
            elif "youtube.com" in url or "youtu.be" in url:
                platform = "youtube"
            elif "instagram.com" in url:
                platform = "instagram"
            return {"type": "TOOL", "action": "download", "url": url, "platform": platform}

        # 3. Knowledge Base Triggers (Questions)
        kb_keywords = ["how to", "what is", "help", "guide", "documentation", "who are you"]
        if any(keyword in msg for keyword in kb_keywords):
            return {"type": "KNOWLEDGE", "query": msg}

        # 4. Default / Conversational Path
        return {"type": "CHAT", "query": msg}


# ==========================================
# STEP 2: THE BRAIN ROUTER (3 Layers)
# ==========================================
class BotBrainRouter:
    """Routes messages to Fast, Tool, or Knowledge handlers."""

    def __init__(self, memory: UserMemory):
        self.memory = memory
        self.start_time = time.time()
        
        # Simple Knowledge Base (RAG substitute)
        self.knowledge_base = {
            "who are you": "I am KingRed Assistant, modeled after intelligent agent architectures.",
            "how to use bot": "Send me any video URL (TikTok/YouTube) to download, or ask me questions about using the platform.",
            "help": "Commands: Send a media link to download, type 'ping' for latency, or type 'status' for system check."
        }

    def process_message(self, user_id: str, text: str) -> str:
        user_profile = self.memory.get_profile(user_id)
        intent = IntentClassifier.classify(text)

        # Path A: Fast Path (No heavy processing)
        if intent["type"] == "FAST":
            return self._handle_fast_path(intent["action"])

        # Path B: Tool Path (Action / API execution)
        elif intent["type"] == "TOOL":
            return self._handle_tool_path(user_id, intent)

        # Path C: Knowledge Path (Search / Documentation)
        elif intent["type"] == "KNOWLEDGE":
            return self._handle_knowledge_path(intent["query"])

        # Fallback: General Chat
        return self._handle_chat_path(user_profile, text)

    def _handle_fast_path(self, action: str) -> str:
        if action == "ping":
            return "Pong! ⚡ latency: ~2ms"
        elif action == "status":
            uptime = int(time.time() - self.start_time)
            return f"🟢 System operational. Uptime: {uptime}s."
        elif action == "time":
            return f"🕒 Current server time: {time.strftime('%Y-%m-%d %H:%M:%S')}"
        return "⚡ Fast response."

    def _handle_tool_path(self, user_id: str, intent: Dict[str, Any]) -> str:
        platform = intent["platform"]
        url = intent["url"]
        
        # Update user profile memory
        count = self.memory.increment_download(user_id, platform)
        
        # Simulate external API call for downloading
        response = f"📥 [TOOL EXECUTION] Extracting video from {platform.capitalize()}...\nURL: {url}\nStatus: Media successfully fetched!"
        
        # Check proactive trigger post-execution
        proactive_msg = ProactiveEngine.check_triggers(user_id, self.memory)
        if proactive_msg:
            response += f"\n\n🤖 {proactive_msg}"

        return response

    def _handle_knowledge_path(self, query: str) -> str:
        for key, answer in self.knowledge_base.items():
            if key in query:
                return f"📖 [KNOWLEDGE BASE]: {answer}"
        return "📖 [KNOWLEDGE BASE]: I couldn't find a direct answer in my documentation. Please type 'help' for available guides."

    def _handle_chat_path(self, user_profile: Dict[str, Any], query: str) -> str:
        lang = user_profile["preferred_language"]
        if lang == "Swahili":
            return f"Habari! Nimekuelewa: '{query}'. Ninawezaje kukusaidia zaidi?"
        return f"I received your message: '{query}'. How can I assist you further?"


# ==========================================
# STEP 4: PROACTIVE ENGINE
# ==========================================
class ProactiveEngine:
    """Monitors state and user behavior to generate unsolicited assistance."""

    @staticmethod
    def check_triggers(user_id: str, memory: UserMemory) -> Optional[str]:
        profile = memory.get_profile(user_id)

        # Proactive rule: If user downloads > 3 media files from the same platform
        if profile["downloads_count"] >= 3 and profile.get("preferred_platform"):
            platform = profile["preferred_platform"].capitalize()
            # Reset counter after triggering notification
            profile["downloads_count"] = 0 
            return f"Notice: Boss, I see you download a lot of {platform} content. Would you like me to auto-save links you post in groups?"

        return None


# ==========================================
# APPLICATION ENTRY POINT & DEMO
# ==========================================
if __name__ == "__main__":
    # Initialize Memory & Bot Router
    memory_store = UserMemory()
    bot = BotBrainRouter(memory_store)

    user = "user_42"

    print("--- 1. FAST PATH TEST ---")
    print("User: ping")
    print("Bot:", bot.process_message(user, "ping"))
    print()

    print("--- 2. TOOL PATH TEST ---")
    print("User: send me this tiktok https://www.tiktok.com/@example/video/12345")
    print("Bot:", bot.process_message(user, "send me this tiktok https://www.tiktok.com/@example/video/12345"))
    print()

    print("--- 3. KNOWLEDGE PATH TEST ---")
    print("User: how to use bot")
    print("Bot:", bot.process_message(user, "how to use bot"))
    print()

    print("--- 4. MEMORY & PROACTIVE ENGINE TEST ---")
    print("User sends 2 more TikTok links...")
    bot.process_message(user, "https://www.tiktok.com/@example/video/12346")
    response = bot.process_message(user, "https://www.tiktok.com/@example/video/12347")
    print("Bot:", response)
