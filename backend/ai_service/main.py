"""
SafeStream AI Service

AI-powered content moderation microservice (Text + Image)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from ai_service.text_checker import check_text
from ai_service.image_checker import check_image

# ---------------- LOGGING ---------------- #
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- APP ---------------- #
app = FastAPI(
    title="SafeStream AI Service",
    description="AI-powered content moderation platform",
    version="1.0.0"
)

# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ production me restrict karna
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- REQUEST MODELS ---------------- #

class TextModerationRequest(BaseModel):
    text: str


class ImageModerationRequest(BaseModel):
    image_data: str  # base64


# ---------------- ENDPOINTS ---------------- #

@app.post("/moderate/text")
async def moderate_text(request: TextModerationRequest):
    try:
        logger.info(f"[TEXT] Input: {request.text[:50]}")

        result = await check_text(request.text)

        logger.info(f"[TEXT] Result: {result}")
        return result

    except Exception as e:
        logger.error(f"[TEXT ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/moderate/image")
async def moderate_image(request: ImageModerationRequest):
    try:
        logger.info("[IMAGE] Processing image...")

        result = await check_image(request.image_data)

        logger.info(f"[IMAGE] Result: {result}")
        return result

    except Exception as e:
        logger.error(f"[IMAGE ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ---------------- HEALTH ---------------- #

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "SafeStream AI Service"
    }


# ---------------- RUN ---------------- #

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)