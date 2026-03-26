"""
Image Moderation Module (CLIP-based)

This module handles image moderation using CLIP (no billing).
Detects NSFW / unsafe content.

Decision Logic:
- 0.0 - 0.3 → SAFE
- 0.3 - 1.0 → REVIEW

"""

import base64
import logging
from PIL import Image
import io
import torch
from transformers import CLIPProcessor, CLIPModel

logger = logging.getLogger(__name__)

# Load CLIP model once (IMPORTANT)
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

# Labels (tune for better accuracy)
LABELS = [
    "a safe normal image",
    "explicit nudity",
    "pornographic content",
    "graphic violence",
    "bloody scene",
    "person holding gun",
    "knife attack",
    "illegal drugs"
]


async def check_image(image_data: str) -> dict:
    try:
        # ✅ Validate input
        if not image_data or not image_data.strip():
            return {
                "score": 0.0,
                "status": "SAFE",
                "error": "Empty image data provided"
            }

        # ✅ Decode base64
        try:
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            return {
                "score": 0.0,
                "status": "REVIEW",
                "error": f"Invalid base64 image: {str(e)}"
            }

        # ✅ Prepare CLIP input
        inputs = clip_processor(
            text=LABELS,
            images=image,
            return_tensors="pt",
            padding=True
        )

        # ✅ Model inference
        with torch.no_grad():
            outputs = clip_model(**inputs)

        probs = outputs.logits_per_image.softmax(dim=1)[0]

        results = dict(zip(LABELS, probs.tolist()))

        # ✅ Unsafe score = max of unsafe labels
        unsafe_labels = LABELS[1:]  # skip safe label
        max_score = max(results[label] for label in unsafe_labels)

        # ✅ Decision logic (FIXED)
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
            "status": "REVIEW",
            "error": f"Failed to moderate image: {str(e)}"
        }