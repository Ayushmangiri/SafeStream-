"""
SafeStream AI Service

A FastAPI-based microservice for content moderation using AI/ML models.
Provides text and image moderation endpoints with confidence scores and decision logic.

Endpoints:
- POST /moderate/text: Moderate text content
- POST /moderate/image: Moderate image content

All responses include:
- score: float (0.0-1.0) - confidence score
- status: str - SAFE/REVIEW/TOXIC (text) or SAFE/REVIEW/NSFW (image)
- error: str (optional) - error message if any

Decision Logic:
- Score 0.0 - 0.3: SAFE (auto approve)
- Score 0.3 - 0.7: REVIEW (human moderator)
- Score 0.7 - 1.0: TOXIC/NSFW (auto reject)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
from text_checker import check_text
from image_checker import check_image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="SafeStream AI Service",
    description="AI-powered content moderation platform",
    version="1.0.0"
)

# Add CORS middleware for cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextModerationRequest(BaseModel):
    """
    Request model for text moderation.

    Attributes:
        text (str): The text content to moderate.
    """
    text: str

class ImageModerationRequest(BaseModel):
    """
    Request model for image moderation.

    Attributes:
        image_data (str): Base64 encoded image data (without data URL prefix).
    """
    image_data: str

@app.post("/moderate/text")
async def moderate_text(request: TextModerationRequest) -> dict:
    """
    Moderate text content for toxicity.

    This endpoint analyzes the provided text using a pre-trained toxic-bert model
    and returns a confidence score and moderation status.

    Args:
        request (TextModerationRequest): Request containing the text to moderate.

    Returns:
        dict: Moderation result with score, status, and optional error.

    Examples:
        POST /moderate/text
        {
            "text": "This is a wonderful day!"
        }
        Response: {"score": 0.02, "status": "SAFE"}

        POST /moderate/text
        {
            "text": "You are stupid and worthless!"
        }
        Response: {"score": 0.89, "status": "TOXIC"}

        POST /moderate/text
        {
            "text": ""
        }
        Response: {"score": 0.0, "status": "SAFE", "error": "Empty text provided"}
    """
    try:
        logger.info(f"Moderating text: {request.text[:50]}...")
        result = await check_text(request.text)
        logger.info(f"Text moderation result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in text moderation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/moderate/image")
async def moderate_image(request: ImageModerationRequest) -> dict:
    """
    Moderate image content for inappropriateness.

    This endpoint analyzes the provided image using Google Cloud Vision API
    and returns a confidence score and moderation status.

    Args:
        request (ImageModerationRequest): Request containing base64 image data.

    Returns:
        dict: Moderation result with score, status, and optional error.

    Examples:
        POST /moderate/image
        {
            "image_data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        }
        Response: {"score": 0.1, "status": "SAFE"}

        POST /moderate/image
        {
            "image_data": "<base64_of_inappropriate_image>"
        }
        Response: {"score": 0.85, "status": "NSFW"}

        POST /moderate/image
        {
            "image_data": "invalid_base64"
        }
        Response: {"score": 0.0, "status": "REVIEW", "error": "Invalid base64 image data"}
    """
    try:
        logger.info("Moderating image...")
        result = await check_image(request.image_data)
        logger.info(f"Image moderation result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error in image moderation endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Service health status.
    """
    return {"status": "healthy", "service": "SafeStream AI Service"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)