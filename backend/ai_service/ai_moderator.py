async def run_ai_moderation(text, image_url, text_result, image_result):
    text_status = text_result["status"] if text_result else "SAFE"
    image_status = image_result["status"] if image_result else "SAFE"

    text_score = text_result["score"] if text_result else 0.0
    image_score = image_result["score"] if image_result else 0.0

    max_score = max(text_score, image_score)

    # All potentially unsafe content or errors go to REVIEW
    if text_status == "REVIEW" or image_status == "REVIEW" or image_status == "ERROR" or max_score >= 0.5:
        return {
            "status": "REVIEW",
            "confidence": max_score,
            "text_result": text_result,
            "image_result": image_result,
            "final_reason": "Content flagged for manual moderation review."
        }

    # Otherwise, it's SAFE
    return {
        "status": "SAFE",
        "confidence": max_score,
        "text_result": text_result,
        "image_result": image_result,
        "final_reason": "Content is safe for publishing."
    }