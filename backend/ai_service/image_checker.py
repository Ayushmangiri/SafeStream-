import asyncio
import requests
import io
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

# Load model
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

LABELS = [
    "safe image",
    "nudity",
    "porn",
    "violence",
    "weapon",
    "drugs"
]


def _run_clip(image: Image.Image) -> float:
    inputs = clip_processor(
        text=LABELS,
        images=image,
        return_tensors="pt",
        padding=True
    )

    with torch.no_grad():
        outputs = clip_model(**inputs)

    probs = outputs.logits_per_image.softmax(dim=1)[0]
    return float(max(probs.tolist()[1:]))


async def fetch_image(image_url: str) -> Image.Image:
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/*"
    }

    #  Retry logic (important)
    for attempt in range(2):
        try:
            response = requests.get(image_url, headers=headers, timeout=8)
            response.raise_for_status()

            #  Ensure it's actually an image
            if "image" not in response.headers.get("Content-Type", ""):
                raise ValueError("URL did not return an image")

            return Image.open(io.BytesIO(response.content)).convert("RGB")

        except Exception as e:
            print(f"[Retry {attempt+1}] IMAGE FETCH ERROR:", str(e))

    raise Exception("Failed to fetch image after retries")


async def check_image(image_url: str) -> dict:

    #  Empty input
    if not image_url or not image_url.strip():
        return {
            "status": "SAFE",
            "score": 0.0,
            "reason": "No image provided"
        }

    #  Invalid URL
    if not image_url.startswith("http"):
        return {
            "status": "ERROR",
            "score": 1.0,
            "reason": "Invalid image URL"
        }

    #  Fetch image
    try:
        image = await fetch_image(image_url)

    except Exception as e:
        print("FINAL IMAGE ERROR:", str(e))

        return {
            "status": "ERROR",
            "score": 1.0,
            "reason": "Image could not be processed"
        }

    #  Run CLIP
    try:
        loop = asyncio.get_running_loop()
        score = await loop.run_in_executor(None, _run_clip, image)

        status = "REVIEW" if score >= 0.6 else "SAFE"

        return {
            "status": status,
            "score": round(score, 4),
            "reason": "Unsafe image detected" if status == "REVIEW" else "Safe image"
        }

    except Exception as e:
        print("MODEL ERROR:", str(e))

        return {
            "status": "ERROR",
            "score": 1.0,
            "reason": "Model error during image analysis"
        }