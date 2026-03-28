# SafeStream AI Service

SafeStream is an AI-based content moderation service built using FastAPI. It evaluates user content (text, image, or both) and determines whether it is safe or requires manual review.

---

## Features

* Single API for text, image (URL), and combined input
* Text moderation using toxic-bert
* Image moderation using CLIP
* Context-aware text handling
* Fail-safe logic (unsafe or processing failure → review)

---

## API

### POST /moderate

**Request**

```json
{
  "text": "your text here",
  "image_url": "image_url_or_null"
}
```

**Response**

```json
{
  "status": "SAFE" | "REVIEW",
  "confidence": float,
  "text_result": {...},
  "image_result": {...},
  "final_reason": string
}
```

---

## Decision Logic

* **Text Moderation**:

  * Score < 0.5 → SAFE
  * Score ≥ 0.5 → REVIEW

* **Image Moderation**:

  * Score < 0.6 → SAFE
  * Score ≥ 0.6 → REVIEW

* **Final Decision**:

  * If text or image is unsafe → REVIEW
  * If image processing fails → REVIEW
  * Otherwise → SAFE

---

## Run Locally

```bash
uvicorn main:app --reload --port 8001
```

Open:
http://127.0.0.1:8001/docs

---

## Structure

* main.py
* text_checker.py
* image_checker.py
* ai_moderator.py

---

## Notes

* Image input must be a valid public URL
* System follows a conservative moderation approach
