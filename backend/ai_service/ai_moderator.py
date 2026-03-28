async def run_ai_moderation(text, image_url, text_result, image_result):

    text_status = text_result["status"] if text_result else None
    image_status = image_result["status"] if image_result else None

    text_score = text_result["score"] if text_result else 0
    image_score = image_result["score"] if image_result else 0

    # CASE 1: Any unsafe
    if text_status == "REVIEW" or image_status == "REVIEW":
        return {
            "status": "REVIEW",
            "confidence": max(text_score, image_score),
            "text_result": text_result,
            "image_result": image_result,
            "final_reason": "Content flagged as unsafe"
        }

    # CASE 2: Image failed → send to moderator
    if image_status == "ERROR":
        return {
            "status": "REVIEW",
            "confidence": 1.0,
            "text_result": text_result,
            "image_result": image_result,
            "final_reason": "Image could not be processed, sent to moderator"
        }

    # CASE 3: All safe
    return {
        "status": "SAFE",
        "confidence": max(text_score, image_score),
        "text_result": text_result,
        "image_result": image_result,
        "final_reason": "Content is safe"
    }