SciScope is a comprehensive full-stack application that helps researchers, students, and academics discover papers, ask questions across multiple documents, detect plagiarism, generate citations, and identify research gaps—all powered by cutting-edge AI.

FeaturesCore Capabilities
1. Multi-Source Paper Search - Search arXiv and Semantic Scholar instantly
2. AI-Powered Q&A - Ask questions across multiple papers with GPT-quality answers
3. Semantic Search - Find papers using AI embeddings (FAISS)
4. Knowledge Graph - Visualize connections between papers, authors, and concepts
5. Multi-Turn Chat - Persistent sessions with conversation context

Advanced Features
1. Citation Generator - Generate citations in 7 formats (APA, IEEE, MLA, Chicago, Harvard, Springer, BibTeX)
2. Plagiarism Detector - Check drafts for similarity with advanced AI
3. Research Gap Analyzer - Get AI insights on your research draft with improvement suggestions
4. Dashboard Analytics - Track your research activity and progress

Technology Stack
Frontend

React 18 + React Router
Tailwind CSS for styling
Zustand for state management
D3.js + React Force Graph for visualizations
Axios for API calls

Backend

Node.js + Express
MongoDB + Mongoose ODM
JWT authentication
Winston logging
arXiv & Semantic Scholar API integration

ML Service

Python 3.8+ + FastAPI
Sentence Transformers (embeddings)
FAISS (vector search)
Groq API (Llama 3.1 70B)
Scikit-learn (plagiarism detection)

Prerequisites
bashNode.js 18+
Python 3.8+
MongoDB 4.4+
4GB+ RAM
1️⃣ Clone Repository
bashgit clone https://github.com/yourusername/papernova.git
cd papernova
2️⃣ Setup Backend
bashcd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
Backend .env:
envPORT=5000
MONGODB_URI=mongodb://localhost:27017/papernova
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
ML_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
3️⃣ Setup ML Service
bashcd ../ml-service

# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux/Mac
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download models
python download_models.py

# Configure
cp .env.example .env
# Add your Groq API key
ML Service .env:
envHOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your_api_key_here  # Get from https://console.groq.com
GROQ_MODEL=llama-3.1-70b-versatile
LOG_LEVEL=INFO
Start ML Service:
bashpython app.py
4️⃣ Setup Frontend
bashcd ../frontend
npm install
cp .env.example .env
npm start
Frontend .env:
envREACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_SERVICE_URL=http://localhost:8000
5️⃣ Access Application

Frontend: http://localhost:3000
Backend API: http://localhost:5000
ML Service Docs: http://localhost:8000/docs

# Install MongoDB
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: apt install mongodb

# Start MongoDB
mongod --dbpath=/path/to/data
```

**Option B: MongoDB Atlas (Recommended)**

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to `backend/.env`

### Groq API Key (Required for AI Features)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Create API key
4. Add to `ml-service/.env`

**Why Groq?**
- ⚡ Fastest LLM inference available
- 🆓 Generous free tier (14,400 requests/day)
- 🎯 Llama 3.1 70B is extremely capable
- 💡 Perfect for research applications

---

## 💡 Usage Guide

### Complete Workflow

#### 1. **Register & Login**
- Create account at http://localhost:3000
- Login to access dashboard

#### 2. **Search for Papers**
```
Navigate to "Papers" → "Search Papers"
Enter: "transformer architecture"
Select source: arXiv or Semantic Scholar
Click "Search"
```

#### 3. **Select & Save Papers**
```
Check boxes on 3-5 interesting papers
Click "Start Chat →"
```

#### 4. **Create Chat Session**
```
Enter session name: "Transformer Research"
Click "Create Session"
```

#### 5. **Ask Questions**
```
Type: "What are the main innovations in these papers?"
Get AI-generated answer with citations
Follow up: "How do these approaches compare?"
```

#### 6. **Generate Knowledge Graph**
```
Go to "Knowledge Graph"
Select papers
Click "Generate Graph"
Explore connections between papers, authors, concepts
```

#### 7. **Advanced Features**

**Citation Generator:**
```
Select papers → Click "Generate Citations"
Choose format: APA, IEEE, MLA, etc.
Copy or export bibliography
```

**Plagiarism Checker:**
```
Select reference papers
Click "Check Plagiarism"
Paste your draft text
Get similarity report with recommendations
```

**Research Analyzer:**
```
Click "Analyze Research"
Paste your draft or outline
Get AI insights, gap analysis, and paper recommendations
```

---

## 🎯 Key Features in Detail

### 1. AI-Powered Chat

**Powered by:** Groq (Llama 3.1 70B)

**Capabilities:**
- Multi-paper reasoning
- Citation-aware answers
- Context retention across conversation
- Professional academic language
- Source attribution

**Example Questions:**
```
- What are the main contributions of these papers?
- How do the methodologies differ?
- What are the limitations discussed?
- Can you compare their results?
- What future work is suggested?
```

### 2. Citation Generator

**Supported Formats:**
- **APA** (7th Edition)
- **IEEE**
- **MLA** (9th Edition)
- **Chicago** (17th Edition)
- **Harvard**
- **Springer**
- **BibTeX**

**Features:**
- Batch processing
- Copy to clipboard
- Export to file
- Proper author formatting
- URL/DOI inclusion

### 3. Plagiarism Detection

**Technology:**
- TF-IDF vectorization
- Cosine similarity
- N-gram analysis (1-3 words)
- Chunk-based comparison

**Output:**
- Overall similarity score
- Risk level assessment
- Flagged sections
- Matched sources
- Improvement recommendations

**Risk Levels:**
- 🟢 **None**: <40% similarity
- 🔵 **Low**: 40-60% similarity
- 🟡 **Medium**: 60-80% similarity
- 🔴 **High**: >80% similarity

### 4. Research Gap Analyzer

**AI Analysis:**
- Document structure assessment
- Concept extraction
- Gap identification
- Improvement suggestions
- Paper recommendations
- Search query generation

**Insights Provided:**
- Strengths & weaknesses
- Missing sections
- Research opportunities
- Recommended reading
- Specific actionable steps

### 5. Knowledge Graph

**Visualization:**
- Papers (blue nodes)
- Authors (purple nodes)
- Concepts (green nodes)
- Methods (orange nodes)
- Keywords (pink nodes)

**Interactions:**
- Drag to rearrange
- Click for details
- Zoom in/out
- Discover connections
- Filter by type

---

## 📁 Project Structure
```
papernova/
├── backend/                    # Node.js Express API
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── constants.js       # App constants
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── paperController.js
│   │   ├── chatController.js
│   │   ├── graphController.js
│   │   ├── citationController.js
│   │   ├── plagiarismController.js
│   │   └── researchController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Paper.js
│   │   ├── ChatSession.js
│   │   ├── Message.js
│   │   └── KnowledgeGraph.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── paperRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── graphRoutes.js
│   │   ├── citationRoutes.js
│   │   ├── plagiarismRoutes.js
│   │   └── researchRoutes.js
│   ├── services/
│   │   ├── arxivService.js
│   │   ├── semanticScholarService.js
│   │   └── citationService.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── utils/
│   │   ├── auth.js
│   │   ├── logger.js
│   │   └── validators.js
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/                   # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Reusable components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── papers/
│   │   │   │   ├── PaperCard.jsx
│   │   │   │   ├── PaperList.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── PaperDetailsModal.jsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatBox.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── CitationCard.jsx
│   │   │   │   └── SessionList.jsx
│   │   │   ├── graph/
│   │   │   │   ├── KnowledgeGraph.jsx
│   │   │   │   └── GraphControls.jsx
│   │   │   ├── citations/
│   │   │   │   └── CitationGenerator.jsx
│   │   │   ├── plagiarism/
│   │   │   │   └── PlagiarismChecker.jsx
│   │   │   └── research/
│   │   │       └── ResearchAnalyzer.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PaperSearch.jsx
│   │   │   ├── MyPapers.jsx
│   │   │   ├── Chat.jsx
│   │   │   └── KnowledgeGraphPage.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── paperService.js
│   │   │   ├── chatService.js
│   │   │   ├── graphService.js
│   │   │   ├── citationService.js
│   │   │   ├── plagiarismService.js
│   │   │   └── researchService.js
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── paperStore.js
│   │   │   └── chatStore.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   └── useLocalStorage.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
│
├── ml-service/                 # Python ML Microservice
│   ├── config/
│   │   └── settings.py        # Configuration
│   ├── models/                # Downloaded ML models
│   ├── data/
│   │   ├── embeddings/        # Embedding metadata
│   │   └── vectors/           # FAISS index
│   ├── app.py                 # FastAPI application
│   ├── embeddings.py          # Embedding generation
│   ├── vector_db.py           # FAISS vector database
│   ├── rag_model.py           # RAG Q&A system
│   ├── graph_extractor.py     # Knowledge graph extraction
│   ├── plagiarism_detector.py # Plagiarism detection
│   ├── research_analyzer.py   # Research gap analysis
│   ├── paper_parser.py        # PDF parsing
│   ├── models.py              # Pydantic models
│   ├── utils.py               # Utilities
│   ├── download_models.py     # Model download script
│   ├── test_service.py        # Test script
│   ├── .env.example
│   └── requirements.txt
│
├── docs/                      # Documentation
├── .gitignore
└── README.md