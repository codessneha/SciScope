# SciScope Backend API

Complete REST API for SciScope AI Research Copilot.

## Features

- 🔐 JWT Authentication
- 📄 Paper management (arXiv & Semantic Scholar integration)
- 💬 Chat sessions with RAG-based Q&A
- 🕸️ Knowledge graph generation
- 🔍 Semantic search with embeddings
- 📊 Pagination & filtering
- 🛡️ Input validation & error handling
- 📝 Comprehensive logging

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Validation:** express-validator
- **Logging:** Winston + Morgan

## Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- ML Service running on port 8000

### Setup

1. **Clone and navigate:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/papernova
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
```

4. **Start MongoDB** (if running locally):
```bash
mongod --dbpath=/path/to/data
```

5. **Run the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### **Users**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Register new user | Public |
| POST | `/users/login` | Login user | Public |
| GET | `/users/me` | Get current user | Private |
| PUT | `/users/me` | Update user profile | Private |
| PUT | `/users/updatepassword` | Change password | Private |

#### **Papers**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/papers/search` | Search papers from arXiv/Semantic Scholar | Private |
| POST | `/papers` | Add paper to database | Private |
| GET | `/papers` | Get all papers (paginated) | Private |
| GET | `/papers/:id` | Get single paper | Private |
| PUT | `/papers/:id` | Update paper | Private |
| DELETE | `/papers/:id` | Delete paper | Private |
| POST | `/papers/semantic-search` | Semantic search using embeddings | Private |
| GET | `/papers/arxiv/:arxivId` | Get paper by arXiv ID | Private |

#### **Chat**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/chat/sessions` | Create chat session | Private |
| GET | `/chat/sessions` | Get all user sessions | Private |
| GET | `/chat/sessions/:id` | Get single session | Private |
| PUT | `/chat/sessions/:id` | Update session | Private |
| DELETE | `/chat/sessions/:id` | Delete session | Private |
| POST | `/chat/sessions/:id/ask` | Ask question | Private |
| GET | `/chat/sessions/:id/messages` | Get session messages | Private |
| POST | `/chat/sessions/:id/papers` | Add papers to session | Private |

#### **Knowledge Graph**

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/graph/generate` | Generate knowledge graph | Private |
| GET | `/graph` | Get user's graphs | Private |
| GET | `/graph/:id` | Get single graph | Private |
| PUT | `/graph/:id` | Update graph | Private |
| DELETE | `/graph/:id` | Delete graph | Private |

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Search Papers
```bash
curl -X GET "http://localhost:5000/api/papers/search?query=machine%20learning&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Ask Question
```bash
curl -X POST http://localhost:5000/api/chat/sessions/SESSION_ID/ask \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the main challenges?",
    "paperIds": ["PAPER_ID_1", "PAPER_ID_2"]
  }'
```

## Project Structure
```
backend/
├── config/
│   ├── db.js                 # MongoDB connection
│   └── constants.js          # App constants
├── controllers/
│   ├── userController.js     # User logic
│   ├── paperController.js    # Paper logic
│   ├── chatController.js     # Chat logic
│   └── graphController.js    # Graph logic
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── errorHandler.js       # Error handling
│   └── logger.js             # HTTP logging
├── models/
│   ├── User.js              # User schema
│   ├── Paper.js             # Paper schema
│   ├── ChatSession.js       # Chat session schema
│   ├── Message.js           # Message schema
│   └── KnowledgeGraph.js    # Knowledge graph schema
├── routes/
│   ├── userRoutes.js        # User routes
│   ├── paperRoutes.js       # Paper routes
│   ├── chatRoutes.js        # Chat routes
│   └── graphRoutes.js       # Graph routes
├── services/
│   ├── arxivService.js      # arXiv API integration
│   ├── semanticScholarService.js  # Semantic Scholar API
│   └── mlService.js         # ML microservice client
├── utils/
│   ├── auth.js              # Auth utilities
│   ├── logger.js            # Winston logger
│   └── validators.js        # Input validation
├── logs/                    # Log files
├── .env                     # Environment variables
├── .env.example            # Environment template
├── server.js               # Main server file
└── package.json            # Dependencies
```

## Testing

### Run Test Script
```bash
node scripts/test-api.js
```

### Using Postman
1. Import `postman/PaperNova-API.postman_collection.json`
2. Set environment variables:
   - `BASE_URL`: http://localhost:5000
   - `TOKEN`: (will be set after login)

## Error Handling

All errors return JSON in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Logging

Logs are stored in:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## Development Tips

### Auto-reload on changes
```bash
npm run dev
```

### Check MongoDB connection
```bash
# In MongoDB shell
use papernova
db.users.find()
```

### Clear all data
```bash
# In MongoDB shell
use papernova
db.dropDatabase()
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `JWT_EXPIRE` | Token expiration | 7d |
| `ML_SERVICE_URL` | ML microservice URL | http://localhost:8000 |
| `CORS_ORIGIN` | Allowed origin | http://localhost:3000 |

## Next Steps

1. ✅ Backend complete
2. ⏭️ Build ML Service (Python + FastAPI)
3. ⏭️ Build Frontend (React)
4. ⏭️ Deploy

## Troubleshooting

### MongoDB connection error
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running

### JWT malformed error
```
Error: jwt malformed
```
**Solution:** Check Authorization header format: `Bearer <token>`

### Port already in use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Kill process on port 5000 or change PORT in .env

## Support

For issues, please check:
1. MongoDB is running
2. ML service is running (for chat features)
3. All environment variables are set
4. Dependencies are installed (`npm install`)

## License

MIT