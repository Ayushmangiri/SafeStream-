"""
Text Moderation Module

This module handles text content moderation using a pre-trained toxic-bert model from HuggingFace.
It detects toxic/abusive language and returns a confidence score and status.

Decision Logic:
- Score 0.0 - 0.3: SAFE (auto approve)
- Score 0.3 - 0.7: REVIEW (human moderator)
- Score 0.7 - 1.0: TOXIC (auto reject)
"""

from transformers import pipeline
import logging

# Initialize the toxicity classifier
# Using 'unitary/toxic-bert' model for toxicity detection
toxicity_classifier = pipeline(
    "text-classification",
    model="unitary/toxic-bert",
    tokenizer="unitary/toxic-bert",
    return_all_scores=True
)

logger = logging.getLogger(__name__)

async def check_text(text: str) -> dict:
    """
    Check the toxicity of the given text.

    Args:
        text (str): The text content to moderate.

    Returns:
        dict: A dictionary containing:
            - "score": float (0.0 to 1.0) - confidence score of toxicity
            - "status": str - "SAFE", "REVIEW", or "TOXIC"
            - "error": str (optional) - error message if any

    Examples:
        >>> await check_text("This is a safe message.")
        {"score": 0.05, "status": "SAFE"}

        >>> await check_text("You are an idiot!")
        {"score": 0.85, "status": "TOXIC"}

        >>> await check_text("")  # Empty text
        {"score": 0.0, "status": "SAFE", "error": "Empty text provided"}
    """
    try:
        if not text or not text.strip():
            return {
                "score": 0.0,
                "status": "SAFE",
                "error": "Empty text provided"
            }

        # Get predictions from the model
        predictions = toxicity_classifier(text)

        # Extract the toxicity score
        # The model returns scores for different labels, we take the 'toxic' label
        toxic_score = 0.0
        if isinstance(predictions, list) and len(predictions) > 0:
            result = predictions[0] if isinstance(predictions[0], list) else predictions
            if isinstance(result, list):
                for pred in result:
                    if pred.get('label', '').lower() == 'toxic':
                        toxic_score = pred.get('score', 0.0)
                        break
            else:
                if result.get('label', '').lower() == 'toxic':
                    toxic_score = result.get('score', 0.0)

        # Determine status based on score
        if toxic_score < 0.3:
            status = "SAFE"
        elif toxic_score < 0.7:
            status = "REVIEW"
        else:
            status = "TOXIC"

        return {
            "score": round(toxic_score, 3),
            "status": status
        }

    except Exception as e:
        logger.error(f"Error in text moderation: {str(e)}")
        return {
            "score": 0.0,
            "status": "REVIEW",  # Default to review on error
            "error": f"Failed to moderate text: {str(e)}"
        }