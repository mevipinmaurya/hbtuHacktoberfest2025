#!/usr/bin/env python3
"""
Codebreaker Game - Advanced Edition (with Difficulty Levels & Hints + Extra Challenge Ideas)
"""

from __future__ import annotations
import random

# --- Helper Function ---
def safe_input(prompt: str = '') -> str:
    try:
        return input(prompt)
    except (EOFError, KeyboardInterrupt):
        return 'quit'


def generate_code(length: int = 3, digits: list[int] | None = None, unique: bool = False) -> str:
    """Generate random numeric code of given length."""
    digits = digits or list(range(10))
    if unique and length <= len(digits):
        return ''.join(str(d) for d in random.sample(digits, length))
    return ''.join(str(random.choice(digits)) for _ in range(length))


def give_feedback(secret: str, guess: str, scramble_feedback: bool = False) -> str:
    """Return feedback string with emojis for each guessed digit."""
    secret_list = list(secret)
    feedback_tokens = [''] * len(guess)

    # ✅ Correct position
    for i, g in enumerate(guess):
        if g == secret[i]:
            feedback_tokens[i] = '✅'
            secret_list[i] = None

    # ⚠️ Wrong position, ❌ Not in code
    for i, g in enumerate(guess):
        if feedback_tokens[i]:
            continue
        elif g in secret_list:
            feedback_tokens[i] = '⚠️'
            secret_list[secret_list.index(g)] = None
        else:
            feedback_tokens[i] = '❌'

    if scramble_feedback:
        random.shuffle(feedback_tokens)

    return ' '.join(f"{feedback_tokens[i]}{guess[i]}" for i in range(len(guess)))


def play_codebreaker() -> None:
    print("=== 🧠 CODEBREAKER: ADVANCED DIFFICULTY EDITION ===\n")
    print("✅ = Correct digit & correct position")
    print("⚠️ = Digit is in code but wrong position")
    print("❌ = Digit not in code")
    print("You can type 'hint' once to reveal one correct digit (costs 2 attempts).")
    print("Type 'quit' anytime to exit.\n")

    # --- Choose difficulty ---
    level = safe_input("Choose difficulty (easy / medium / hard / expert / insane): ").lower()

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
    else:
        print("Invalid choice, defaulting to Easy mode.")
        config = dict(length=3, attempts=8, allow_hint=True, unique=False, digits=list(range(10)))

    secret = generate_code(config["length"], config["digits"], config.get("unique", False))
    used_hint = False
    attempts = config["attempts"]

    while attempts > 0:
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
            print(f"💡 Hint: Digit at position {reveal_index + 1} is {secret[reveal_index]}")
            used_hint = True
            attempts -= 2
            continue

        # --- Validate input ---
        if len(guess) != config["length"] or not guess.isdigit():
            print(f"Enter exactly {config['length']} digits (e.g. {'0'*config['length']}).")
            continue

        # --- Check win ---
        if guess == secret:
            print("🎉 ACCESS GRANTED! You cracked the code!")
            return

        # --- Give feedback ---
        print(give_feedback(secret, guess, scramble_feedback=config.get("scramble", False)))
        attempts -= 1

    print(f"🚫 ACCESS DENIED. The code was {secret}.")


if __name__ == "__main__":
    play_codebreaker()
