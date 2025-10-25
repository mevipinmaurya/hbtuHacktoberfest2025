#!/usr/bin/env python3
"""
Codebreaker Game - Improved Edition (with Difficulty & Hints)

New Features Added:
1. Difficulty Levels:
   - Easy: 3 digits, 8 attempts
   - Medium: 4 digits, 6 attempts
   - Hard: 5 digits, 5 attempts

2. Hint System:
   - Type 'hint' once per game to reveal one correct digit position.
   - Using a hint reduces your remaining attempts by 2.

Existing Features:
- Feedback using ✅ ⚠️ ❌ symbols.
- Auto/demo/test modes.
- Safe input handling in both interactive and non-interactive environments.
"""

from __future__ import annotations
import argparse
import os
import random
import sys
from typing import List, Optional

_input_manager: Optional['InputManager'] = None


class InputManager:
    def __init__(self, simulated: Optional[List[str]] = None, default: str = 'quit'):
        self.simulated = list(simulated) if simulated else []
        self.default = default
        try:
            self.interactive = sys.stdin.isatty() and sys.stdout.isatty()
        except Exception:
            self.interactive = False

    def get(self, prompt: str = '') -> str:
        try:
            if self.interactive:
                return input(prompt + ' ').strip()
            if self.simulated:
                resp = self.simulated.pop(0)
                print(f"{prompt} {resp}")
                return resp
            print(f"{prompt} {self.default}  # default (non-interactive)")
            return self.default
        except (EOFError, OSError):
            if self.simulated:
                resp = self.simulated.pop(0)
                print(f"{prompt} {resp}  # fallback after input error")
                return resp
            print(f"{prompt} {self.default}  # fallback after input error")
            return self.default


def safe_input(prompt: str = '') -> str:
    global _input_manager
    if _input_manager is None:
        _input_manager = InputManager(simulated=None, default='quit')
    return _input_manager.get(prompt)


def generate_code(length: int = 3) -> str:
    """Generate random numeric code of given length."""
    return ''.join(str(random.randint(0, 9)) for _ in range(length))


def give_feedback(secret: str, guess: str) -> str:
    """Return feedback with emojis based on guess accuracy."""
    secret_list = list(secret)
    feedback_tokens: List[str] = [''] * len(guess)

    # ✅ correct digits in correct place
    for i, g in enumerate(guess):
        if i < len(secret) and g == secret[i]:
            feedback_tokens[i] = '✅'
            secret_list[i] = None

    # ⚠️ correct digits in wrong place, ❌ incorrect
    for i, g in enumerate(guess):
        if feedback_tokens[i]:
            continue
        if g in secret_list:
            feedback_tokens[i] = '⚠️'
            secret_list[secret_list.index(g)] = None
        else:
            feedback_tokens[i] = '❌'

    # Combine with guessed digits
    pairs = [f"{feedback_tokens[i]}{guess[i]}" for i in range(len(guess))]
    return ' '.join(pairs)


def play_simple() -> None:
    print("=== CODEBREAKER: ADVANCED EDITION ===")
    print("Instructions:")
    print("✅ = Correct digit & correct position")
    print("⚠️ = Digit is in code but wrong position")
    print("❌ = Digit not in code at all")
    print("You can type 'hint' once to reveal one correct digit (costs 2 attempts).")
    print("Type 'quit' anytime to exit.\n")

    # --- NEW FEATURE 1: Difficulty selection ---
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
        prompt = f"[{attempts} attempts left] Enter guess ({length} digits):"
        guess = safe_input(prompt).strip()

        # Quit option
        if guess.lower() in ('quit', 'exit', 'giveup'):
            print("Quitting game.")
            return

        # --- NEW FEATURE 2: Hint System ---
        if guess.lower() == 'hint':
            if used_hint:
                print("Hint already used! You can use only one per game.")
                continue
            reveal_index = random.randint(0, len(secret) - 1)
            print(f"💡 Hint: The digit at position {reveal_index + 1} is {secret[reveal_index]}")
            used_hint = True
            attempts -= 2
            continue

        # Validate input
        if len(guess) != length or not guess.isdigit():
            print(f"Enter exactly {length} digits (e.g. {'0'*length}).")
            continue

        # Check correctness
        if guess == secret:
            print("ACCESS GRANTED! ✅ You cracked the code!")
            return

        print(give_feedback(secret, guess))
        attempts -= 1

    print(f"ACCESS DENIED. The code was {secret}.")


# --- Test Function (unchanged) ---
def run_tests() -> bool:
    errors: List[str] = []

    def assert_eq(a, b, msg=''):
        if a != b:
            errors.append(f"Assertion failed: {a!r} != {b!r}. {msg}")

    for ln in (1, 3, 5):
        c = generate_code(ln)
        assert_eq(len(c), ln)
        assert_eq(c.isdigit(), True)

    assert_eq(give_feedback('123', '123'), '✅1 ✅2 ✅3')
    assert_eq(give_feedback('1234', '4123'), '⚠️4 ⚠️1 ⚠️2 ⚠️3')
    assert_eq(give_feedback('1234', '5678'), '❌5 ❌6 ❌7 ❌8')
    expected = '⚠️2 ⚠️1 ✅2 ❌2'
    assert_eq(give_feedback('1223', '2122'), expected)

    if errors:
        print('\nTESTS FAILED:')
        for e in errors:
            print(' -', e)
        return False
    print('\nAll tests passed.')
    return True


def parse_args():
    p = argparse.ArgumentParser(description='Codebreaker with Difficulty & Hints')
    p.add_argument('--test', action='store_true', help='Run tests and exit')
    p.add_argument('--auto', action='store_true', help='Run in auto/demo mode (non-interactive)')
    p.add_argument('--sim', type=str, help='Simulated inputs (comma-separated)')
    return p.parse_args()


def build_input_manager(args) -> InputManager:
    sim_list: Optional[List[str]] = None
    if args.sim:
        sim_list = [s.strip() for s in args.sim.split(',') if s.strip()]
    else:
        env = os.environ.get('CODEBREAKER_INPUTS')
        if env:
            sim_list = [s.strip() for s in env.split(',') if s.strip()]

    if args.auto and not sim_list:
        sim_list = [f"{d}{d}{d}" for d in '012345']

    return InputManager(simulated=sim_list, default='quit')


def main() -> int:
    global _input_manager
    args = parse_args()
    _input_manager = build_input_manager(args)

    if args.test:
        ok = run_tests()
        return 0 if ok else 2

    try:
        play_simple()
    except Exception as e:
        print('An unexpected error occurred during play:', e)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
