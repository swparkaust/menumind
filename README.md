# 🍽️ MenuMind - AI Food Menu Recommendation App

MenuMind is a smart, AI-powered food recommendation web application that suggests personalized meals based on your preferences, location, weather, and time of day.

## ✨ Features

- **AI-Powered Recommendations**: Uses Google Gemini AI to suggest personalized food choices
- **Context-Aware**: Considers weather, time, location, and personal preferences
- **Progressive Web App (PWA)**: Install and use like a native mobile app
- **Modern UI**: Glass-morphism design with smooth animations
- **Korean Language Support**: Fully localized interface and AI responses
- **Real-time Weather Integration**: Weather-based food suggestions
- **User Preference Learning**: Adapts to your food choices over time

## 🚀 Quick Start

### Prerequisites

- Ruby 3.2+
- Node.js 18+
- PostgreSQL 14+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd food-menu-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   bundle install
   cp .env.example .env
   # Add your API keys to .env file
   rails db:create db:migrate db:seed
   rails server -p 3001
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Configure API URL in .env.local
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/v1
   - Health Check: http://localhost:3001/up

## 🔧 Configuration

### Required API Keys

1. **Google Gemini API Key**
   - Get from: https://makersuite.google.com/app/apikey
   - Add to `backend/.env`: `GEMINI_API_KEY=your_key`

2. **OpenWeather API Key**
   - Get from: https://openweathermap.org/api
   - Add to `backend/.env`: `OPENWEATHER_API_KEY=your_key`

### Environment Variables

**Backend (.env)**
```bash
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## 🏗️ Tech Stack

### Backend
- Ruby on Rails 8.0 (API mode)
- PostgreSQL
- Google Gemini AI
- OpenWeather API

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- PWA capabilities

## 📱 PWA Installation

The app can be installed as a Progressive Web App:

1. Open the app in a mobile browser
2. Look for "Add to Home Screen" prompt
3. Install and use like a native app

## 🧪 Testing

```bash
# Test the full application
ruby test_full_app.rb

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && bundle exec rspec
```

## 🚀 Deployment

### Backend (Railway)
1. Connect GitHub repository
2. Set root directory to `/backend`
3. Add environment variables
4. Deploy automatically

### Frontend (Vercel)
1. Connect GitHub repository
2. Set root directory to `/frontend`
3. Configure build settings
4. Deploy automatically

## 📊 API Endpoints

- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{uuid}` - Get user
- `POST /api/v1/users/{uuid}/recommendations` - Create recommendation
- `GET /api/v1/users/{uuid}/recommendations` - List recommendations
- `PATCH /api/v1/users/{uuid}/recommendations/{id}/respond` - Respond to recommendation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.