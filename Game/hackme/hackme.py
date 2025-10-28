#!/usr/bin/env python3
"""
Codebreaker Game - Advanced Edition (with Difficulty Levels & Hints)

Instructions:
- Guess the secret numeric code. Digits may repeat.
- You’ll get feedback after every guess using emojis:
  ✅ = Correct digit in the correct position
  ⚠️ = Digit is in the code but wrong position
  ❌ = Digit not in the code
- You can type 'hint' once per game to reveal one correct digit (costs 2 attempts).
- Type 'quit' anytime to exit the game.

Difficulty Levels:
- Easy: 3 digits, 8 attempts
- Medium: 4 digits, 6 attempts
- Hard: 5 digits, 5 attempts
"""

from __future__ import annotations
import random

# Helper function for safe input
def safe_input(prompt: str = '') -> str:
    try:
        return input(prompt)
    except (EOFError, KeyboardInterrupt):
        return 'quit'


def generate_code(length: int = 3) -> str:
    """Generate random numeric code of given length."""
    return ''.join(str(random.randint(0, 9)) for _ in range(length))


def give_feedback(secret: str, guess: str) -> str:
    """Return feedback string with emojis for each guessed digit."""
    secret_list = list(secret)
    feedback_tokens = [''] * len(guess)

    # ✅ Correct digit and correct place
    for i, g in enumerate(guess):
        if g == secret[i]:
            feedback_tokens[i] = '✅'
            secret_list[i] = None  # Mark as used

    # ⚠️ Wrong position, ❌ Not in code
    for i, g in enumerate(guess):
        if feedback_tokens[i]:
            continue
        elif g in secret_list:
            feedback_tokens[i] = '⚠️'
            secret_list[secret_list.index(g)] = None
        else:
            feedback_tokens[i] = '❌'

    return ' '.join(f"{feedback_tokens[i]}{guess[i]}" for i in range(len(guess)))


def play_codebreaker() -> None:
    print("=== CODEBREAKER: ADVANCED EDITION ===\n")
    print("✅ = Correct digit & correct position")
    print("⚠️ = Digit is in code but wrong position")
    print("❌ = Digit not in code")
    print("You can type 'hint' once to reveal one correct digit (costs 2 attempts).")
    print("Type 'quit' anytime to exit.\n")

    # --- Choose difficulty ---
    level = safe_input("Choose difficulty (easy / medium / hard): ").lower()
    if level == "easy":
        length, attempts = 3, 8
    elif level == "medium":
        length, attempts = 4, 6
    elif level == "hard":
        length, attempts = 5, 5
    else:
        print("Invalid choice, defaulting to Easy mode.")
        length, attempts = 3, 8

    secret = generate_code(length)
    used_hint = False

    while attempts > 0:
        guess = safe_input(f"[{attempts} attempts left] Enter your guess ({length} digits): ").strip()

        if guess.lower() in ('quit', 'exit'):
            print("Game exited. The secret code was:", secret)
            return

        # --- Hint System ---
        if guess.lower() == 'hint':
            if used_hint:
                print("❌ You already used your hint!")
                continue
            reveal_index = random.randint(0, len(secret) - 1)
            print(f"💡 Hint: Digit at position {reveal_index + 1} is {secret[reveal_index]}")
            used_hint = True
            attempts -= 2
            continue

        # --- Validate input ---
        if len(guess) != length or not guess.isdigit():
            print(f"Enter exactly {length} digits (e.g. {'0'*length}).")
            continue

        # --- Check win ---
        if guess == secret:
            print("ACCESS GRANTED! ✅ You cracked the code!")
            return

        # --- Give feedback ---
        print(give_feedback(secret, guess))
        attempts -= 1

    print(f"ACCESS DENIED. The code was {secret}.")


if __name__ == "__main__":
    play_codebreaker()
