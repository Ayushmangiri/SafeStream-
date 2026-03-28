"""
SafeStream AI Service (Unified Moderation API)
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from text_checker import check_text
from image_checker import check_image
from ai_moderator import run_ai_moderation

#LOGGING
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

#APP
app = FastAPI(title="SafeStream AI Service", version="2.0.0")

#CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#REQUEST MODEL
class CombinedRequest(BaseModel):
    text: str | None = None
    image_url: str | None = None


#UNIFIED ENDPOINT
@app.post("/moderate")
async def moderate(request: CombinedRequest):
    try:
        if not request.text and not request.image_url:
            raise HTTPException(
                status_code=400,
                detail="At least one of text or image_url is required"
            )

        text_result = None
        image_result = None

        if request.text:
            text_result = await check_text(request.text)

        if request.image_url:
            image_result = await check_image(request.image_url)

        final_result = await run_ai_moderation(
            text=request.text,
            image_url=request.image_url,
            text_result=text_result,
            image_result=image_result
        )

        return final_result

    except Exception as e:
        logger.error(f"[ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail="Moderation failed")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}