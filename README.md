# 🩸 BloodBridge - Blood Donation Management System

<div align="center">

![BloodBridge Banner](https://img.shields.io/badge/BloodBridge-Life_Saver_Network-red?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Django](https://img.shields.io/badge/Django-4.2-green?style=for-the-badge&logo=django)

*A modern, real-time platform connecting blood donors with recipients in emergencies*

[![GitHub stars](https://img.shields.io/github/stars/yourusername/bloodbridge?style=social)](https://github.com/yourusername/bloodbridge)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yourusername/bloodbridge/pulls)

</div>

📋 Navigation Table
<div align="center">
📚 Section	📝 Description	🚀 Quick Link
✨ Features	Complete feature overview	View Features ↓
🛠️ Tech Stack	Technologies & frameworks used	View Tech Stack ↓
🚀 Quick Start	Get started in 5 minutes	Quick Start ↓
🔧 Installation	Detailed setup guide	Install Guide ↓
📁 Structure	Project organization	View Structure ↓
⚙️ Environment	Configuration variables	View Config ↓
📡 API Docs	API endpoints & usage	API Docs ↓
🧪 Testing	Testing procedures	Run Tests ↓
🤝 Contributing	How to contribute	Contribute ↓
📄 License	License information	View License ↓
</div>


## ✨ Features

### 🩺 **Core Functionalities**
- **Real-time Blood Request Management** - Create, track, and manage blood donation requests
- **Smart Donor Matching** - Automatic matching based on blood type compatibility and location
- **Interactive Blood Map** - Visualize donors and recipients on an interactive map
- **In-app Chat System** - Secure communication between donors and recipients
- **Real-time Notifications** - Instant alerts for requests, messages, and updates
- **User Profiles** - Comprehensive donor/recipient profiles with medical information

### 🏥 **For Blood Recipients**
- Create emergency blood requests with detailed patient information
- Review and approve/reject donor offers
- Track request status in real-time
- Communicate directly with approved donors
- View donor locations and estimated arrival times

### 🩸 **For Blood Donors**
- Browse active requests matching your blood type
- Accept/decline donation requests
- Share location for easy coordination
- Track donation history and impact
- Receive urgent request notifications

### 🔒 **Security & Privacy**
- Secure user authentication with JWT tokens
- Encrypted chat communications
- Location privacy controls
- Medical data protection
- Role-based access control

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI library
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animations
- **React Leaflet** - Interactive maps
- **Lucide React** - Icons
- **Axios** - HTTP client

### **Backend**
- **Django** - Web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Database
- **Redis** - Caching and real-time features
- **JWT** - Authentication
- **Django Channels** - WebSocket support

### **DevOps & Tools**
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD
- **Postman** - API testing
- **ESLint & Prettier** - Code quality

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- PostgreSQL 12+
- Git

### Docker Deployment (Recommended)
```bash
# Clone the repository
git clone https://github.com/yourusername/bloodbridge.git
cd bloodbridge

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/api/docs/
```

## 🔧 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/bloodbridge.git
cd bloodbridge
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your configuration

# Run database migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
# or
yarn install

# Start development server
npm start
# or
yarn start
```

### 4. Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE bloodbridge;
CREATE USER bloodbridge_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bloodbridge TO bloodbridge_user;
ALTER USER bloodbridge_user CREATEDB;
```

## 📁 Project Structure

```
bloodbridge/
├── frontend/                    # React Frontend Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Dashboard/       # Dashboard components
│   │   │   ├── Chat/           # Chat system components
│   │   │   ├── Common/         # Shared components
│   │   │   └── Layout/         # Layout components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API services
│   │   ├── utils/              # Utility functions
│   │   ├── styles/             # Global styles
│   │   ├── App.jsx             # Main App component
│   │   └── main.jsx            # Application entry point
│   ├── package.json
│   └── vite.config.js          # Vite configuration
│
├── backend/                     # Django Backend API
│   ├── bloodbridge/            # Main project settings
│   ├── api/                    # API application
│   │   ├── views/              # API views
│   │   ├── serializers/        # Data serializers
│   │   ├── models/             # Database models
│   │   ├── urls.py             # API URL routing
│   │   └── permissions.py      # Custom permissions
│   ├── users/                  # User management app
│   ├── donations/              # Blood donation app
│   ├── notifications/          # Notifications app
│   ├── chat/                   # Real-time chat app
│   ├── manage.py               # Django management script
│   └── requirements.txt        # Python dependencies
│
├── docker-compose.yml          # Docker Compose configuration
├── Dockerfile                  # Docker configuration
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore file
└── README.md                  # This file
```

## 🔧 Environment Variables

### Backend (.env file)
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=bloodbridge
DB_USER=bloodbridge_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT Authentication
JWT_SECRET_KEY=your-jwt-secret-key

# Redis (for caching and WebSockets)
REDIS_URL=redis://localhost:6379/0

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
EMAIL_USE_TLS=True
```

### Frontend (.env file)
```env
# API Configuration
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws

# Map Configuration
VITE_MAPBOX_TOKEN=your-mapbox-token

# Application Settings
VITE_APP_NAME=BloodBridge
VITE_APP_VERSION=1.0.0
```

## 🎯 API Documentation

### Base URL
```
http://localhost:8000/api/
```

### Authentication Endpoints
```http
POST /api/auth/register/     # User registration
POST /api/auth/login/        # User login
POST /api/auth/logout/       # User logout
GET  /api/auth/user/         # Get current user
```

### Blood Requests Endpoints
```http
GET    /api/requests/              # List all requests
POST   /api/requests/              # Create new request
GET    /api/requests/{id}/         # Get request details
PUT    /api/requests/{id}/         # Update request
DELETE /api/requests/{id}/         # Delete request
POST   /api/requests/{id}/accept/  # Accept request as donor
POST   /api/requests/{id}/ignore/  # Ignore request
```

### User Management
```http
GET    /api/users/                 # List users
GET    /api/users/{id}/            # User details
PUT    /api/users/{id}/            # Update user
GET    /api/users/profile/         # Current user profile
POST   /api/users/update-location/ # Update user location
```

### Chat System
```http
GET    /api/chat/rooms/            # List chat rooms
GET    /api/chat/rooms/{id}/       # Get room details
GET    /api/chat/rooms/{id}/messages/  # Get messages
POST   /api/chat/rooms/{id}/messages/  # Send message
WS     /ws/chat/{room_id}/         # WebSocket for real-time chat
```

### Notifications
```http
GET    /api/notifications/         # List notifications
POST   /api/notifications/{id}/mark-read/  # Mark as read
POST   /api/notifications/mark-all-read/   # Mark all as read
DELETE /api/notifications/{id}/    # Delete notification
```

## 🧪 Testing

### Backend Testing
```bash
# Run Django tests
cd backend
python manage.py test

# Run with coverage
coverage run manage.py test
coverage report
```

### Frontend Testing
```bash
# Run React tests
cd frontend
npm test
# or
yarn test

# Run tests with coverage
npm test -- --coverage
```

### End-to-End Testing
```bash
# Run Cypress tests (if configured)
npm run cypress:open
# or
npm run cypress:run
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure no linting errors

### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Use ESLint and Prettier configuration
- **CSS**: Follow Tailwind CSS utility-first approach

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 BloodBridge Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE PERFORMANCE THEREOF.
```

## 👨‍💻 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)
- **Contributors** - See the [contributors list](https://github.com/yourusername/bloodbridge/graphs/contributors)

## 🙏 Acknowledgments

- Thanks to all blood donors who inspire this project
- Open source community for amazing tools and libraries
- Medical professionals for guidance and feedback
- Test users for valuable feedback and bug reports

## 📞 Support

For support, please:
1. Check the [documentation](#)
2. Search for existing [issues](https://github.com/yourusername/bloodbridge/issues)
3. Create a new issue if needed

---

<div align="center">

### 💖 Donate Blood, Save Lives!

*Every drop counts. Join us in making a difference.*

[![Star on GitHub](https://img.shields.io/badge/⭐_Star_this_repository-000?style=for-the-badge&logo=github)](https://github.com/yourusername/bloodbridge)
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-000?style=for-the-badge&logo=github)](https://github.com/yourusername/bloodbridge/issues)
[![Request Feature](https://img.shields.io/badge/💡_Request_Feature-000?style=for-the-badge&logo=github)](https://github.com/yourusername/bloodbridge/issues)

</div>
