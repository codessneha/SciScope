# SciScope Frontend

React-based frontend for SciScope AI Research Copilot.

## Features

- 🔍 **Paper Search** - Search arXiv and Semantic Scholar
- 💬 **AI Chat** - Ask questions about research papers
- 🕸️ **Knowledge Graph** - Visualize paper connections
- 📊 **Dashboard** - Overview of your research activity
- 🎨 **Modern UI** - Built with React + Tailwind CSS

## Quick Start

### Prerequisites

- Node.js v18+
- Backend API running on port 5000
- ML Service running on port 8000 (for chat and graph features)

### Installation
```bash
cd frontend
npm install
```

### Configuration

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ML_SERVICE_URL=http://localhost:8000
```

### Run Development Server
```bash
npm start
```

App will open at `http://localhost:3000`

## Project Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   ├── layout/          # Layout components
│   │   ├── papers/          # Paper-related components
│   │   ├── chat/            # Chat components
│   │   └── graph/           # Graph visualization
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── store/               # Zustand state management
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.js               # Main app component
│   └── index.js             # Entry point
└── package.json
```

## Available Pages

- `/login` - User login
- `/register` - User registration
- `/dashboard` - Main dashboard
- `/papers/search` - Search for papers
- `/papers` - My papers library
- `/chat` - Chat with papers
- `/graph` - Knowledge graph visualization

## Key Dependencies

- **React** - UI library
- **React Router** - Routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **D3 / React Force Graph** - Graph visualization
- **React Hot Toast** - Notifications
- **React Markdown** - Markdown rendering

## Building for Production
```bash
npm run build
```

Build files will be in `build/` directory.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000/api |
| `REACT_APP_ML_SERVICE_URL` | ML service URL | http://localhost:8000 |

## Features by Page

### Dashboard
- Overview statistics
- Quick actions
- Recent papers and sessions

### Paper Search
- Search arXiv and Semantic Scholar
- Select papers for chat
- View paper details

### My Papers
- View all saved papers
- Select papers for sessions
- Manage paper library

### Chat
- Create chat sessions
- Ask questions about papers
- View AI-generated answers with citations

### Knowledge Graph
- Generate graph from selected papers
- Interactive visualization
- Explore connections

## Troubleshooting

### API Connection Error
```
Error: Network Error
```
**Solution:** Make sure backend is running on port 5000

### Chat Not Working
```
Error: Failed to get answer
```
**Solution:** Make sure ML service is running on port 8000

### Build Warnings
```
Warning: Can't perform a React state update...
```
**Solution:** These are usually harmless in development. They won't appear in production build.

## Development Tips

### Hot Reload
Code changes automatically reload the page.

### Component Development
Each component is in its own file for easy maintenance.

### State Management
Zustand stores are in `src/store/` - simple and effective.

### Styling
Use Tailwind utility classes. Custom components in `src/index.css`.

## Next Steps

1. ✅ Frontend complete
2. Test all features
3. Build for production
4. Deploy to Vercel/Netlify

## Support

For issues:
1. Check console for errors
2. Verify backend/ML service are running
3. Check network tab for API calls
4. Review environment variables

## License

MIT