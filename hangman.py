import random
WORD_BANK = [
    "apple", "basket", "cactus", "dragon", "engine",
    "flute", "garden", "helmet", "island", "jacket",
    "kitten", "lantern", "mirror", "noodle", "ocean",
    "pirate", "queen", "ribbon", "scooter", "ticket",
    "umbrella", "violet", "window", "yarn", "zebra"
]
HANGMAN_PICS = [
    """
    ------
         |
         |
         |
         |
         |
    --------
    """,
    """
    ------
    |    |
    O    |
         |
         |
         |
    --------
    """,
    """
    ------
    |    |
    O    |
    |    |
         |
         |
    --------
    """,
    """
    ------
    |    |
    O    |
   /|    |
         |
         |
    --------
    """,
    """
    ------
    |    |
    O    |
   /|\   |
         |
         |
    --------
    """,
    """
    ------
    |    |
    O    |
   /|\   |
   /     |
         |
    --------
    """,
    """
    ------
    |    |
    O    |
   /|\   |
   / \   |
         |
    --------
    """
]

def choose_word(used=None):
    if used is None:
        used=set()
    pool=[w for w in WORD_BANK if w not in used]
    return random.choice(pool)

def show_board(secret_word, guessed, mistakes):
    print(HANGMAN_PICS[mistakes])
    progress = " ".join(
        [ch if (i == 0 or ch in guessed) else "_" for i, ch in enumerate(secret_word)]
    )
    print("Word:", progress)
    print("Guessed:", ", ".join(sorted(guessed)) if guessed else "None")
    print(f"Attempts left: {6-mistakes}\n")

def play():
    mistakes=0
    used_words = set()
    secret=choose_word(used_words)
    used_words.add(secret)

    guessed={secret[0]}  # reveal first letter

    print("=== Hangman ===")
    print("Tip: The first letter is given.")
    print("Note: A wrong guess changes the word!\n")

    while mistakes<6:
        show_board(secret, guessed, mistakes)
        guess=input("Enter a letter: ").lower().strip()

        if len(guess)!=1 or not guess.isalpha():
            print("Invalid input. Please type a single letter.\n")
            continue

        if guess in guessed:
            print("Already tried that one.\n")
            continue

        guessed.add(guess)

        if guess not in secret:
            mistakes+=1
            print(f"Oops! Wrong guess. {6 - mistakes} tries left.")
            secret=choose_word(used_words)
            used_words.add(secret)
            guessed={secret[0]}  
            print("New word picked!\n")
        else:
            print("Correct Guess\n")

        if all(ch in guessed for ch in secret):
            show_board(secret, guessed, mistakes)
            print("YOU WON! Well played.")
            break
    else:
        show_board(secret, guessed, mistakes)
        print(f"Out of tries. The word was '{secret}'.")
play()