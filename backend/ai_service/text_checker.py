import asyncio
from transformers import pipeline

toxicity_classifier = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    top_k=None
)

#Context-aware phrases (SAFE slang)
SAFE_PHRASES = [
    "killed it",
    "kill it",
    "you killed it",
    "that killed",
]

# Dangerous phrases (REVIEW)
DANGEROUS_PHRASES = [
    "kill you",
    "i will kill",
    "die now",
    "go die",
    "i will murder",
    "shoot you"
]


async def check_text(text: str) -> dict:

    #Empty input
    if not text or not text.strip():
        return {
            "status": "SAFE",
            "score": 0.0,
            "reason": "Empty text"
        }

    text_lower = text.lower()

    # Step 1: Check SAFE slang (avoid false positives)
    if any(phrase in text_lower for phrase in SAFE_PHRASES):
        return {
            "status": "SAFE",
            "score": 0.1,
            "reason": "Casual/slang expression detected"
        }

    #Step 2: Check clearly harmful phrases
    if any(phrase in text_lower for phrase in DANGEROUS_PHRASES):
        return {
            "status": "REVIEW",
            "score": 0.9,
            "reason": "Explicit harmful or violent intent"
        }

    #Step 3: Run ML model
    try:
        loop = asyncio.get_running_loop()
        predictions = await loop.run_in_executor(None, toxicity_classifier, text)

        result = predictions[0] if isinstance(predictions[0], list) else predictions

        toxic_keywords = [
            "toxic", "severe_toxic", "obscene",
            "insult", "threat", "identity_hate"
        ]

        max_score = 0.0

        for pred in result:
            label = pred["label"].lower()
            if any(k in label for k in toxic_keywords):
                max_score = max(max_score, pred["score"])

        status = "REVIEW" if max_score >= 0.5 else "SAFE"

        return {
            "status": status,
            "score": round(max_score, 4),
            "reason": "Toxic content detected" if status == "REVIEW" else "Safe text"
        }

    except Exception:
        return {
            "status": "REVIEW",
            "score": 1.0,
            "reason": "Model error - sent to review"
        }