SafeStream Backend – Content Moderation System


1. Project Overview

SafeStream backend is responsible for handling user authentication, post management, and AI-based content moderation. The system ensures that user-generated content such as text and images is filtered before being displayed publicly.

When a user creates a post, the backend processes the data, uploads images to cloud storage, and sends the content to an external machine learning service. Based on the response received, the backend classifies the content as safe, flagged, or rejected.

Safe content is directly shown in the feed, flagged content is sent to the admin for review, and rejected content is blocked. This approach helps in maintaining a safe and controlled environment for users.

2. Architecture Diagram

The backend follows a layered architecture and interacts with external services as shown below:

User (Frontend) ->

Backend Server (Node.js + Express)->

Image Upload (Cloudinary)->

ML Service (Content Moderation API)->

Decision Layer (Backend Logic)->

Database (MongoDB)->

Response to Frontend

The backend acts as the central decision-making layer that coordinates between the frontend, database, and ML service.

3. Tech Stack

The backend is built using the following technologies:

. Node.js for server-side runtime
. Express.js for building REST APIs
. MongoDB with Mongoose for database management
. Cloudinary for image storage and URL generation
. Multer for handling file uploads
. JSON Web Tokens (JWT) for authentication
. bcrypt for password hashing
. Axios for communication with the ML service

4. Setup Instructions
To run the backend locally, follow these steps:

Clone the repository and navigate to the backend folder
Install dependencies using npm install

Create a .env file and configure the following variables:

PORT = 3000
MONGO_URL = your_mongodb_connection
JWT_SECRET = your_secret_key

CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret

FRONTEND_URL = http://localhost:5173

Start the server using npm run dev
The backend will run on http://localhost:3000

5. Team Roles

Backend Developer
Responsible for implementing authentication, database schema, API routes, middleware, and integration with Cloudinary and ML service.

ML/AI Developer
Responsible for building and maintaining the machine learning model that classifies content as safe, flagged, or rejected.

Frontend Developer
Responsible for building user interface, integrating APIs, and displaying feed and moderation dashboard.

6. API Documentation

Authentication APIs
POST /api/v1/users/register – Register a new user
POST /api/v1/users/login – Login user and generate token
GET /api/v1/users/getMe – Get logged-in user details

Post APIs
POST /api/v1/posts/create – Create a new post (text/image)
GET /api/v1/posts/feed – Fetch all safe posts
GET /api/v1/posts/moderation – Fetch flagged posts (admin only)
PUT /api/v1/posts/moderate/:id – Approve or delete post (admin only)

ML Integration API (External)
POST /check – Send text and image URL to ML service and receive classification

7. Key Design Decisions (ADR)

Use of Cloudinary instead of storing images locally
Images are stored in Cloudinary to reduce server load and improve scalability. Only image URLs are stored in the database.

Separation of ML Service
The ML model is implemented as a separate service. This allows independent development, better scalability, and easier maintenance.

Status-Based Moderation System
Each post is assigned a status (safe, flagged, rejected). This simplifies filtering logic and ensures clear separation of responsibilities between system and admin.

Synchronous ML Processing
The backend waits for the ML response before saving the post. This ensures that only validated content is stored.

Role-Based Access Control
Admin-specific routes are protected using middleware to ensure only authorized users can access moderation features.

Conclusion

The SafeStream backend provides a structured and scalable solution for handling content moderation using AI integration. It demonstrates how backend systems can manage user data, interact with external services, and enforce content policies effectively in a real-world scenario.