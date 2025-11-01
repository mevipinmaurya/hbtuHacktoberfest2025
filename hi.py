#Hacktober pull & merge attempts

from deep_translator import GoogleTranslator
#pip install deep-translator

text_to_translate = "hii bhai kaise ho"

# Create a translator instance
    # 'auto' for source language detection, 'en' for english as target language
translator = GoogleTranslator(source='auto', target='en')

    # Perform the translation
translated_text = translator.translate(text_to_translate)

    # Print the translated text
print(f"Original text: {text_to_translate}")
print(f"Translated text (English): {translated_text}")

print("/n--Additional Examples ---")

text_english = "Hello brother, how are you?"

    # You can also translate to other languages, e.g., Hindi ('hi')
translator_to_hindi = GoogleTranslator(source='en', target='hi')
translated_hindi = translator_to_hindi.translate(text_english)
print(f"\nEnglish: {text_english}")
print(f"Hindi: {translated_hindi}")