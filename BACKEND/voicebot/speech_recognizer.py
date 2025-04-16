# backend/speech_recognizer.py

from vosk import Model, KaldiRecognizer
import json

# Make sure to download a Vosk model and point to its directory
model = Model("model_directory")

def recognize_audio(audio_bytes, sample_rate=16000):
    rec = KaldiRecognizer(model, sample_rate)
    if rec.AcceptWaveform(audio_bytes):
        result = rec.Result()
    else:
        result = rec.PartialResult()
    # Return recognized text from the JSON result
    result_dict = json.loads(result)
    return result_dict.get("text", "")
