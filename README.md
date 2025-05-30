# SpeakUp Anonymous Issue Reporting System

An anonymous platform for employees to report company issues and track their status using unique codes.

## Features
- Anonymous issue reporting without login
- Unique 9-10 digit tracking code generation
- Report status tracking
- Admin panel for issue management
- Complete anonymity maintained

## Tech Stack
- Frontend: React.js
- Backend: Node.js/Express
- Database: MongoDB
- Authentication: JWT (for admin only)

## Project Structure
```
speakup-mern/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create .env file with required environment variables
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Environment Variables
Create a .env file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Endpoints

### Public Endpoints
- POST /api/reports - Create new anonymous report
- GET /api/reports/:trackingCode - Get report status

### Admin Endpoints
- POST /api/admin/login - Admin login
- GET /api/admin/reports - Get all reports
- PUT /api/admin/reports/:trackingCode - Update report status 