# MERN Authentication Backend

This is the backend for a MERN stack authentication system, providing user registration and login functionality with JWT-based session management.

## Features

- User registration with password hashing (bcrypt)
- User login with JWT authentication
- Role-based access control (`USER` and `ADMIN`)
- JWT tokens with 10-hour expiration for session management
- MongoDB Atlas for data storage
- RESTful API built with Express.js
- CORS enabled for cross-origin requests

## Technologies Used

- Node.js & Express.js
- MongoDB Atlas & Mongoose
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- dotenv for environment variables

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account with connection URI
- `.env` file configured with:

