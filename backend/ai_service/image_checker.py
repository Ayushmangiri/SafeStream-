"""
Image Moderation Module

This module handles image content moderation using Google Gemini Vision API.
It detects NSFW/inappropriate content and returns a confidence score and status.

Decision Logic:
- Score 0.0 - 0.3: SAFE (auto approve)
- Score 0.3 - 0.7: REVIEW (human moderator)
- Score 0.7 - 1.0: NSFW (auto reject)

Note: Uses Gemini API for AI-powered content analysis.
"""

import google.generativeai as genai
import base64
import logging
from PIL import Image
import io

logger = logging.getLogger(__name__)

# Gemini API key
GEMINI_API_KEY = 'AIzaSyCQZAIOuC_Z8BNEYwGnmib4GH1h3n6l-f0'

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

async def check_image(image_data: str) -> dict:
    """
    Check image for inappropriate content using Gemini Vision API.

    Args:
        image_data (str): Base64 encoded image data

    Returns:
        dict: Moderation result with score, status, and optional error
    """
    try:
        if not image_data or not image_data.strip():
            return {
                "score": 0.0,
                "status": "SAFE",
                "error": "Empty image data provided"
            }

        # Decode base64 image
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            return {
                "score": 0.0,
                "status": "REVIEW",
                "error": f"Invalid base64 image data: {str(e)}"
            }

        # Initialize Gemini model
        model = genai.GenerativeModel('gemini-pro-vision')

        # Create prompt for content moderation
        prompt = """
        Analyze this image and determine if it contains any inappropriate, NSFW, adult, violent, or harmful content.
        Rate the content on a scale of 0-10 where:
        0 = Completely safe and appropriate content
        10 = Extremely inappropriate, NSFW, pornographic, violent, or harmful content

        Consider factors like:
        - Nudity or sexual content
        - Violence or gore
        - Hate symbols or offensive content
        - Adult themes

        Respond with only: SCORE: X (where X is 0-10)
        """

        # Generate response
        response = model.generate_content([prompt, image])
        result_text = response.text.strip()

        logger.info(f"Gemini response: {result_text}")

        # Parse score from response
        try:
            # Extract score from response like "SCORE: 5"
            if 'SCORE:' in result_text.upper():
                score_part = result_text.upper().split('SCORE:')[1].strip()
                # Extract first number
                score = float(''.join(filter(lambda x: x.isdigit() or x == '.', score_part.split()[0])))
            else:
                # Try to find any number in response
                import re
                numbers = re.findall(r'\d+\.?\d*', result_text)
                score = float(numbers[0]) if numbers else 5.0

            # Ensure score is within 0-10 range
            score = max(0.0, min(10.0, score))

        except Exception as e:
            logger.warning(f"Could not parse score from response: {result_text}, error: {e}")
            # Fallback scoring based on keywords
            result_lower = result_text.lower()
            if any(word in result_lower for word in ['safe', 'appropriate', 'clean']):
                score = 1.0
            elif any(word in result_lower for word in result_lower for word in ['inappropriate', 'nsfw', 'adult', 'violent', 'harmful']):
                score = 8.0
            else:
                score = 5.0

        # Normalize to 0-1 scale
        normalized_score = score / 10.0

        # Decision logic
        if normalized_score < 0.3:
            status = "SAFE"
        elif normalized_score < 0.7:
            status = "REVIEW"
        else:
            status = "NSFW"

        return {
            "score": round(normalized_score, 3),
            "status": status
        }

    except Exception as e:
        logger.error(f"Error in image moderation: {str(e)}")
        return {
            "score": 0.0,
            "status": "REVIEW",
            "error": f"Failed to moderate image: {str(e)}"
        }
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