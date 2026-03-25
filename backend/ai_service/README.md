# SafeStream AI Service

An AI-powered content moderation microservice built with Python and FastAPI.

## Features

- **Text Moderation**: Detects toxic/abusive language using toxic-bert model
- **Image Moderation**: Detects NSFW/inappropriate content using Google Vision API
- **Confidence Scores**: All responses include clear confidence scores (0.0-1.0)
- **Decision Logic**: Automatic SAFE/REVIEW/TOXIC status based on scores
- **Async Processing**: Asynchronous endpoints for better performance
- **Error Handling**: Graceful error handling with fallback to REVIEW status

## Decision Logic

- Score 0.0 - 0.3: **SAFE** (auto approve)
- Score 0.3 - 0.7: **REVIEW** (human moderator)
- Score 0.7 - 1.0: **TOXIC/NSFW** (auto reject)

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Google Vision API Setup** (Windows):
   - Create a Google Cloud Project
   - Enable Vision API
   - Create a service account and download the JSON key
   - Set environment variable: `set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\key.json`

   (Linux/Mac: `export GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json`)

3. **Run the Service**:
   ```bash
   python main.py
   ```
   The service will start on `http://localhost:8001`

## API Endpoints

### POST /moderate/text
Moderate text content.

**Request Body**:
```json
{
  "text": "Your text content here"
}
```

**Response**:
```json
{
  "score": 0.123,
  "status": "SAFE"
}
```

### POST /moderate/image
Moderate image content.

**Request Body**:
```json
{
  "image_data": "base64_encoded_image_data"
}
```

**Response**:
```json
{
  "score": 0.456,
  "status": "REVIEW"
}
```

### GET /health
Health check endpoint.

## Examples

### Text Moderation Examples

**Safe Text**:
```bash
curl -X POST "http://localhost:8001/moderate/text" \
     -H "Content-Type: application/json" \
     -d '{"text": "This is a wonderful day!"}'
```
Response: `{"score": 0.02, "status": "SAFE"}`

**Toxic Text**:
```bash
curl -X POST "http://localhost:8001/moderate/text" \
     -H "Content-Type: application/json" \
     -d '{"text": "You are stupid and worthless!"}'
```
Response: `{"score": 0.89, "status": "TOXIC"}`

**Empty Text (Failure Case)**:
```bash
curl -X POST "http://localhost:8001/moderate/text" \
     -H "Content-Type: application/json" \
     -d '{"text": ""}'
```
Response: `{"score": 0.0, "status": "SAFE", "error": "Empty text provided"}`

### Image Moderation Examples

**Safe Image** (1x1 pixel):
```bash
curl -X POST "http://localhost:8001/moderate/image" \
     -H "Content-Type: application/json" \
     -d '{"image_data": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="}'
```
Response: `{"score": 0.1, "status": "SAFE"}`

**Invalid Image Data (Failure Case)**:
```bash
curl -X POST "http://localhost:8001/moderate/image" \
     -H "Content-Type: application/json" \
     -d '{"image_data": "invalid_base64"}'
```
Response: `{"score": 0.0, "status": "REVIEW", "error": "Invalid base64 image data"}`

## Architecture

- `main.py`: FastAPI application with endpoints
- `text_checker.py`: Text moderation using HuggingFace toxic-bert
- `image_checker.py`: Image moderation using Google Cloud Vision
- `requirements.txt`: Python dependencies

## Error Handling

- All errors are caught and logged
- On failure, defaults to "REVIEW" status to ensure human moderation
- Error messages are included in responses for debugging
- HTTP 500 errors for unexpected server issues

## Performance

- Asynchronous processing for concurrent requests
- Model caching to avoid reloading
- Efficient base64 decoding and API calls