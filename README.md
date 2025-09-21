# YouTube Transcript Generator

A minimal, production-ready web app that extracts transcripts from YouTube videos. Built with React and Spring Boot, deployed as a single container on Fly.io.

## ✨ Features

- **Instant Transcript Extraction**: Get transcripts from public YouTube videos without uploading files
- **Clean Dark UI**: Modern, minimalist interface with dark theme
- **Flexible Display**: Toggle timestamps on/off for different viewing preferences
- **Easy Export**: Copy to clipboard or download as text file
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Single Container**: React SPA embedded in Spring Boot static resources

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Java 17 + Spring Boot 3 + Maven
- **Deployment**: Docker (multi-stage build) + Fly.io
- **Styling**: Tailwind CSS with custom dark theme

## 📁 Project Structure

```
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API service
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main app component
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # Spring Boot API
│   ├── src/main/java/
│   │   └── com/youtube/transcript/
│   │       ├── controller/     # REST controllers
│   │       ├── service/        # Business logic
│   │       ├── dto/            # Data transfer objects
│   │       └── config/         # Configuration
│   ├── pom.xml
│   └── src/main/resources/
├── Dockerfile                  # Multi-stage container build
├── fly.toml                   # Fly.io configuration
├── deploy.sh                  # Deployment script
├── dev.sh                     # Development script
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Docker (for containerization)
- Fly.io CLI (for deployment)

### Development

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd YoutubeTranscripts
   ```

2. **Start development environment**:
   ```bash
   ./dev.sh
   ```
   This starts both frontend (http://localhost:5173) and backend (http://localhost:8080) servers.

3. **Or start individually**:
   ```bash
   # Backend only
   cd backend && ./mvnw spring-boot:run
   
   # Frontend only (in another terminal)
   cd frontend && npm install && npm run dev
   ```

### Production Build

```bash
# Build frontend and copy to backend
cd frontend && npm run build

# Build backend with embedded frontend
cd backend && ./mvnw clean package
```

## 🐳 Docker

### Build locally
```bash
docker build -t youtube-transcript-generator .
```

### Run locally
```bash
docker run -p 8080:8080 youtube-transcript-generator
```

## ☁️ Deployment to Fly.io

1. **Install Fly.io CLI**:
   ```bash
   # macOS
   brew install flyctl
   
   # Or download from https://fly.io/docs/hands-on/install-flyctl/
   ```

2. **Login and deploy**:
   ```bash
   flyctl auth login
   ./deploy.sh
   ```

3. **Your app will be available at**:
   ```
   https://youtube-transcript-generator.fly.dev
   ```

## 🎯 API Endpoints

### POST `/api/transcribe`
Extract transcript from a YouTube video.

**Request**:
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "includeTimestamps": true
}
```

**Response**:
```json
{
  "video": {
    "id": "VIDEO_ID",
    "title": "Video Title",
    "channel": "Channel Name",
    "duration": "10:30"
  },
  "transcript": {
    "language": "en"
  },
  "segments": [
    {
      "start": 0.0,
      "end": 5.2,
      "text": "Hello and welcome to this video..."
    }
  ],
  "fullTranscript": "[0.00] Hello and welcome...",
  "source": "captions"
}
```

### GET `/api/health`
Health check endpoint.

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 8080)
- `SERVER_TIMEOUT`: Request timeout (default: 30s)

### Customization
- **Styling**: Modify `frontend/tailwind.config.js` for theme changes
- **API**: Update `backend/src/main/resources/application.properties` for server config
- **Deployment**: Adjust `fly.toml` for Fly.io settings

## 🐛 Troubleshooting

### Common Issues

1. **Build fails with Tailwind errors**:
   ```bash
   cd frontend && npm install @tailwindcss/postcss
   ```

2. **Backend can't fetch YouTube data**:
   - Check internet connectivity
   - Verify YouTube URL format
   - Ensure video has captions enabled

3. **Deployment fails**:
   - Ensure you're logged into Fly.io: `flyctl auth whoami`
   - Check Docker is running
   - Verify `fly.toml` configuration

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the API documentation
- Open an issue on GitHub
