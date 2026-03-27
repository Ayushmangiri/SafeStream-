About my backend part

Overview

The backend receives user input (text and images), processes it, and determines whether the content should be accepted, flagged for review, or rejected. Images are uploaded to Cloudinary, and their URLs are used for moderation instead of raw files. The backend communicates with an external ML service, which analyzes the content and returns a status.

Based on the ML response, the backend takes appropriate action:
1.Safe content is stored and shown in the feed
2.Flagged content is sent to the admin for review
3.Rejected content is blocked and not stored

Core Features

1.User Authentication
The system provides user registration and login functionality. Passwords are securely hashed using bcrypt, and authentication is handled using JWT tokens. Protected routes ensure that only authenticated users can access certain features.

2.Role-Based Access Control
The backend supports different roles such as users and admins. Admins have additional permissions to review and manage flagged content.

3.Post Management
Users can create posts containing text and optionally an image. Images are uploaded using Multer and stored on Cloudinary. The backend saves the image URL along with the post data in the database.

4.AI Moderation Integration
The backend sends text and image URLs to an external ML service using HTTP requests. The ML service returns a classification such as safe, flagged, or rejected. This response is used to determine how the content should be handled.

5.Moderation Workflow
If content is marked as safe, it is directly visible in the feed. If it is flagged, it is stored but not shown publicly and is instead sent to the admin dashboard. If it is rejected, the request is denied and the content is not saved.

6.Admin Control
Admins can view all flagged posts and take actions such as accepting or deleting them. Accepted posts are moved to the public feed, while deleted posts are removed from the system.

7.Feed System
The feed displays only safe posts. Pagination is implemented to efficiently load posts in smaller batches.

System Workflow

When a user creates a post, the backend first uploads the image to Cloudinary (if provided). It then sends the text and image URL to the ML service. The backend waits for the response and decides the status of the content. Based on the result, the post is either saved as safe, marked for moderation, or rejected entirely.

Technologies Used

Node.js and Express.js for server-side development
MongoDB with Mongoose for database management
Cloudinary for image storage
Multer for handling file uploads
JWT for authentication
Axios for communication with the ML service

Environment Configuration

The backend uses environment variables for configuration, including database connection, JWT secret, Cloudinary credentials, and frontend URL. This ensures secure and flexible deployment.

