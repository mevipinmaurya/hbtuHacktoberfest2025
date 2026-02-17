import random
import webbrowser
import sys
try:
    from textblob import TextBlob
except ImportError:
    print("[!] Error: TextBlob library not found. Run 'pip install textblob'")
    sys.exit(1)

def get_mood_recommendation(user_input):
    """
    Analyzes sentiment polarity and returns a corresponding mood category.
    Polarity ranges from -1.0 (negative) to 1.0 (positive).
    """
    analysis = TextBlob(user_input)
    score = analysis.sentiment.polarity
    
    if score > 0.2:
        return "positive", score
    elif score < -0.2:
        return "negative", score
    else:
        return "neutral", score

def main():
    mood_library = {
        "positive": [
            "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
            "https://www.youtube.com/watch?v=UqyT8IEBkvY",
            "https://www.youtube.com/watch?v=09R8_2nJtjg"
        ],
        "negative": [
            "https://www.youtube.com/watch?v=RBumgq5yVrA",
            "https://www.youtube.com/watch?v=RgKAFK5djSk",
            "https://www.youtube.com/watch?v=hoNb6HuNmU0"
        ],
        "neutral": [
            "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
            "https://www.youtube.com/watch?v=kXYiU_JCYtU",
            "https://www.youtube.com/watch?v=YykjpeuMNEk"
        ]
    }

    print("--- AI Sentiment Media Recommender ---")
    try:
        user_text = input("How are you feeling today? ").strip()
        
        if not user_text:
            print("[!] No input detected. Exiting.")
            return

        mood, polarity_score = get_mood_recommendation(user_text)
        
        selected_url = random.choice(mood_library[mood])
        
        print(f"[*] Detected Polarity: {polarity_score:.2f}")
        print(f"[*] Mood Category: {mood.capitalize()}")
        print("[*] Directing to matching media...")
        
        webbrowser.open(selected_url)

    except KeyboardInterrupt:
        print("\n[!] Process interrupted by user.")
    except Exception as e:
        print(f"[!] An unexpected error occurred: {e}")

if __name__ == "__main__":
    main()
