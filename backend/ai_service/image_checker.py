"""
Image Moderation Module

This module handles image content moderation using Google Cloud Vision API.
It detects NSFW/inappropriate content and returns a confidence score and status.

Decision Logic:
- Score 0.0 - 0.3: SAFE (auto approve)
- Score 0.3 - 0.7: REVIEW (human moderator)
- Score 0.7 - 1.0: NSFW (auto reject)

Note: Requires GOOGLE_APPLICATION_CREDENTIALS environment variable set with service account key.
"""

import base64
import logging
from google.cloud import vision
from google.cloud.vision_v1 import types

logger = logging.getLogger(__name__)

# Initialize Vision API client
vision_client = vision.ImageAnnotatorClient()

# Likelihood mapping to scores
likelihood_scores = {
    types.Likelihood.UNKNOWN: 0.0,
    types.Likelihood.VERY_UNLIKELY: 0.1,
    types.Likelihood.UNLIKELY: 0.2,
    types.Likelihood.POSSIBLE: 0.5,
    types.Likelihood.LIKELY: 0.7,
    types.Likelihood.VERY_LIKELY: 0.9
}

async def check_image(image_data: str) -> dict:
    """
    Check the appropriateness of the given image.

    Args:
        image_data (str): Base64 encoded image data (without data URL prefix).

    Returns:
        dict: A dictionary containing:
            - "score": float (0.0 to 1.0) - confidence score of inappropriateness
            - "status": str - "SAFE", "REVIEW", or "NSFW"
            - "error": str (optional) - error message if any

    Examples:
        >>> await check_image("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==")  # 1x1 pixel image
        {"score": 0.1, "status": "SAFE"}

        >>> await check_image("<base64_of_nsfw_image>")
        {"score": 0.85, "status": "NSFW"}

        >>> await check_image("")  # Invalid base64
        {"score": 0.0, "status": "REVIEW", "error": "Invalid image data"}
    """
    try:
        if not image_data or not image_data.strip():
            return {
                "score": 0.0,
                "status": "REVIEW",
                "error": "Empty image data provided"
            }

        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
        except Exception as e:
            return {
                "score": 0.0,
                "status": "REVIEW",
                "error": f"Invalid base64 image data: {str(e)}"
            }

        # Create Vision API image object
        image = vision.Image(content=image_bytes)

        # Perform safe search detection
        response = vision_client.safe_search_detection(image=image)
        safe_search = response.safe_search_annotation

        if safe_search is None:
            return {
                "score": 0.0,
                "status": "REVIEW",
                "error": "Failed to analyze image"
            }

        # Extract likelihood scores for inappropriate content
        adult_score = likelihood_scores.get(safe_search.adult, 0.0)
        violence_score = likelihood_scores.get(safe_search.violence, 0.0)
        racy_score = likelihood_scores.get(safe_search.racy, 0.0)
        medical_score = likelihood_scores.get(safe_search.medical, 0.0)

        # Use the maximum score as the overall inappropriateness score
        max_score = max(adult_score, violence_score, racy_score, medical_score)

        # Determine status based on score
        if max_score < 0.3:
            status = "SAFE"
        elif max_score < 0.7:
            status = "REVIEW"
        else:
            status = "NSFW"

        return {
            "score": round(max_score, 3),
            "status": status
        }

    except Exception as e:
        logger.error(f"Error in image moderation: {str(e)}")
        return {
            "score": 0.0,
            "status": "REVIEW",  # Default to review on error
            "error": f"Failed to moderate image: {str(e)}"
        }