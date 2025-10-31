#!/usr/bin/env python3
"""
Codebreaker Game - Advanced Edition v4.0
========================================
Features:
✅ Difficulty Levels
✅ Hint System
✅ Leaderboard (persistent JSON)
✅ Time Challenge Mode
✅ Custom Mode
✅ Color Output (colorama)
✅ Sound Feedback
✅ Main Menu System
"""

from __future__ import annotations
import random
import json
import time
import threading
import sys
from pathlib import Path
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

# --- Safe Input ---
def safe_input(prompt: str = '') -> str:
    try:
        return input(prompt)
    except (EOFError, KeyboardInterrupt):
        return 'quit'


# --- Sound Feedback (cross-platform) ---
def beep_success():
    print("\a", end='', flush=True)
    if sys.platform == "win32":
        import winsound
        winsound.Beep(800, 200)


def beep_fail():
    print("\a", end='', flush=True)
    if sys.platform == "win32":
        import winsound
        winsound.Beep(400, 400)


# --- Leaderboard System ---
LEADERBOARD_FILE = Path("leaderboard.json")

def load_leaderboard():
    if LEADERBOARD_FILE.exists():
        with open(LEADERBOARD_FILE, "r") as f:
            return json.load(f)
    return []

def save_leaderboard(data):
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump(data, f, indent=2)

def add_to_leaderboard(name, level, attempts_left, elapsed_time=None):
    leaderboard = load_leaderboard()
    entry = {
        "player": name,
        "level": level,
        "score": attempts_left * 10,
        "time": round(elapsed_time, 2) if elapsed_time else None
    }
    leaderboard.append(entry)
    leaderboard.sort(key=lambda e: (-e["score"], e["time"] or 9999))
    save_leaderboard(leaderboard)

def show_leaderboard(top_n=10):
    leaderboard = load_leaderboard()
    print("\n=== 🏆 LEADERBOARD ===")
    if not leaderboard:
        print("🏁 No scores yet — be the first to play!\n")
        return
    for i, entry in enumerate(leaderboard[:top_n], 1):
        print(f"{i:2d}. {entry['player']:10} | {entry['level']:8} | "
              f"Score: {entry['score']:3} | Time: {entry['time'] or '-'}s")
    print()

def clear_leaderboard():
    if LEADERBOARD_FILE.exists():
        LEADERBOARD_FILE.unlink()
    print("🧹 Leaderboard cleared!\n")


# --- Code Generation ---
def generate_code(length: int = 3, digits: list[int] | None = None, unique: bool = False) -> str:
    digits = digits or list(range(10))
    if unique and length <= len(digits):
        return ''.join(str(d) for d in random.sample(digits, length))
    return ''.join(str(random.choice(digits)) for _ in range(length))


# --- Feedback System (with color) ---
def give_feedback(secret: str, guess: str, scramble_feedback: bool = False) -> str:
    secret_list = list(secret)
    feedback_tokens = [''] * len(guess)

    for i, g in enumerate(guess):
        if g == secret[i]:
            feedback_tokens[i] = f"{Fore.GREEN}✅{g}{Style.RESET_ALL}"
            secret_list[i] = None

    for i, g in enumerate(guess):
        if feedback_tokens[i]:
            continue
        elif g in secret_list:
            feedback_tokens[i] = f"{Fore.YELLOW}⚠️{g}{Style.RESET_ALL}"
            secret_list[secret_list.index(g)] = None
        else:
            feedback_tokens[i] = f"{Fore.RED}❌{g}{Style.RESET_ALL}"

    if scramble_feedback:
        random.shuffle(feedback_tokens)

    return ' '.join(feedback_tokens)


# --- Timer Utility ---
def start_timer(seconds, timeout_callback):
    def countdown():
        time.sleep(seconds)
        timeout_callback()
    t = threading.Thread(target=countdown, daemon=True)
    t.start()


# --- Main Gameplay ---
def play_codebreaker() -> None:
    print("\n=== 🧠 CODEBREAKER: ADVANCED EDITION ===\n")
    print("✅ = Correct digit & position")
    print("⚠️ = Digit is in code but wrong position")
    print("❌ = Digit not in code")
    print("💡 Type 'hint' once per game to reveal a correct digit (costs 2 attempts).")
    print("Type 'quit' anytime to exit.\n")

    player_name = safe_input("Enter your name: ").strip() or "Anonymous"
    level = safe_input("Choose difficulty (easy / medium / hard / expert / insane / challenge / custom): ").lower()

    # --- Configurations ---
    if level == "easy":
        config = dict(length=3, attempts=8, allow_hint=True, unique=False, digits=list(range(10)))
    elif level == "medium":
        config = dict(length=4, attempts=6, allow_hint=True, unique=False, digits=list(range(10)))
    elif level == "hard":
        config = dict(length=5, attempts=5, allow_hint=False, unique=False, digits=list(range(1, 8)))
    elif level == "expert":
        config = dict(length=6, attempts=4, allow_hint=False, unique=True, digits=list(range(10)))
    elif level == "insane":
        config = dict(length=7, attempts=3, allow_hint=False, unique=False, digits=list(range(10)), scramble=True)
    elif level == "challenge":
        config = dict(length=5, attempts=5, allow_hint=False, unique=False, digits=list(range(10)))
    elif level == "custom":
        length = int(safe_input("Enter code length (3–10): "))
        attempts = int(safe_input("Enter number of attempts: "))
        unique = safe_input("Unique digits only? (y/n): ").lower().startswith("y")
        allow_hint = safe_input("Allow hints? (y/n): ").lower().startswith("y")
        config = dict(length=length, attempts=attempts, allow_hint=allow_hint, unique=unique, digits=list(range(10)))
    else:
        print("Invalid choice, defaulting to Easy mode.")
        config = dict(length=3, attempts=8, allow_hint=True, unique=False, digits=list(range(10)))

    secret = generate_code(config["length"], config["digits"], config.get("unique", False))
    used_hint = False
    attempts = config["attempts"]
    start_time = time.time()
    timeout_triggered = False

    # --- Time Challenge ---
    if level == "challenge":
        time_limit = 60
        print(f"🔥 Challenge Mode: Crack the code in {time_limit} seconds!")
        def time_up():
            nonlocal timeout_triggered
            timeout_triggered = True
            print(f"\n⏰ Time’s up! The code was {secret}.")
        start_timer(time_limit, time_up)

    # --- Game Loop ---
    while attempts > 0:
        if timeout_triggered:
            return
        guess = safe_input(f"[{attempts} attempts left] Enter your guess ({config['length']} digits): ").strip()

        if guess.lower() in ('quit', 'exit'):
            print("Game exited. The secret code was:", secret)
            return

        # --- Hint System ---
        if guess.lower() == 'hint':
            if not config["allow_hint"]:
                print("❌ Hints are disabled for this difficulty!")
                continue
            if used_hint:
                print("❌ You already used your hint!")
                continue
            reveal_index = random.randint(0, len(secret) - 1)
            print(f"💡 Hint: Digit at position {reveal_index + 1} is {Fore.CYAN}{secret[reveal_index]}{Style.RESET_ALL}")
            used_hint = True
            attempts -= 2
            continue

        # --- Input Validation ---
        if len(guess) != config["length"] or not guess.isdigit():
            print(f"Enter exactly {config['length']} digits (e.g. {'0'*config['length']}).")
            continue

        # --- Check Win ---
        if guess == secret:
            elapsed = time.time() - start_time
            beep_success()
            print(f"\n🎉 {Fore.GREEN}ACCESS GRANTED! You cracked the code!{Style.RESET_ALL}")
            print(f"⏱️ Time: {elapsed:.2f}s")
            add_to_leaderboard(player_name, level, attempts, elapsed)
            show_leaderboard()
            return

        # --- Feedback ---
        print(give_feedback(secret, guess, scramble_feedback=config.get("scramble", False)))
        beep_fail()
        attempts -= 1

    print(f"\n🚫 ACCESS DENIED. The code was {secret}.")


# --- Main Menu ---
def main_menu():
    while True:
        print(f"""
{Fore.CYAN}=== CODEBREAKER MAIN MENU ==={Style.RESET_ALL}
1️⃣  Play Game
2️⃣  View Leaderboard
3️⃣  Clear Leaderboard
4️⃣  Quit
""")
        choice = safe_input("Select an option (1-4): ").strip()

        if choice == '1':
            play_codebreaker()
        elif choice == '2':
            show_leaderboard()
        elif choice == '3':
            confirm = safe_input("Are you sure you want to clear all scores? (y/n): ").lower()
            if confirm == 'y':
                clear_leaderboard()
        elif choice == '4' or choice.lower() in ('quit', 'exit'):
            print(f"{Fore.MAGENTA}👋 Thanks for playing Codebreaker!{Style.RESET_ALL}")
            break
        else:
            print("Invalid choice. Please try again.")


# --- Entry Point ---
if __name__ == "__main__":
    main_menu()
