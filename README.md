# 🩸 BloodBridge - Blood Donation Management System

<div align="center">

![BloodBridge Banner](https://img.shields.io/badge/BloodBridge-Life_Saver_Network-red?style=for-the-badge&logo=heart&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Django](https://img.shields.io/badge/Django-4.2-green?style=for-the-badge&logo=django)

*A modern, real-time platform connecting blood donors with recipients in emergencies*

</div>

---

## 📋 Navigation Table

<div align="center">

| 📚 Section | 📝 Description | 🚀 Quick Link |
|------------|---------------|---------------|
| **✨ Features** | Complete feature overview | [View Features ↓](#-features) |
| **🛠️ Tech Stack** | Technologies & frameworks used | [View Tech Stack ↓](#️-tech-stack) |
| **🚀 Quick Start** | Get started in 5 minutes | [Quick Start ↓](#-quick-start) |
| **🔧 Installation** | Detailed setup guide | [Install Guide ↓](#-installation-guide) |
| **📁 Structure** | Project organization | [View Structure ↓](#-project-structure) |
| **⚙️ Environment** | Configuration variables | [View Config ↓](#-environment-variables) |
| **📡 API Docs** | API endpoints & usage | [API Docs ↓](#-api-documentation) |
| **🧪 Testing** | Testing procedures | [Run Tests ↓](#-testing) |
| **🤝 Contributing** | How to contribute | [Contribute ↓](#-contributing) |
| **📄 License** | License information | [View License ↓](#-license) |

</div>

---

## ✨ Features

### 🎯 **Core Features**
| Feature | Description | Status |
|---------|-------------|--------|
| **Real-time Requests** | Create and manage blood donation requests | ✅ Implemented |
| **Smart Donor Matching** | Match donors by blood type and location | ✅ Implemented |
| **Interactive Blood Map** | Visualize donors/recipients on map | ✅ Implemented |
| **In-app Chat System** | Secure donor-recipient communication | ✅ Implemented |
| **Real-time Notifications** | Instant alerts for updates | ✅ Implemented |
| **User Profiles** | Comprehensive medical profiles | ✅ Implemented |

### 🏥 **For Recipients**
| Feature | Benefit |
|---------|---------|
| Emergency Request Creation | Quick blood request submission |
| Donor Management | Approve/reject donor offers |
| Location Sharing | Easy donor coordination |
| Status Tracking | Real-time request monitoring |

### 🩸 **For Donors**
| Feature | Benefit |
|---------|---------|
| Request Browsing | View matching blood requests |
| Quick Response | Accept/decline requests easily |
| Impact Tracking | Monitor donations and impact |
| Notification System | Get urgent request alerts |

---

## 🛠️ Tech Stack

### **Frontend Layer**
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 18.2 |
| **React Router** | Navigation | 6.8 |
| **Tailwind CSS** | Styling | 3.3 |
| **Framer Motion** | Animations | 10.0 |
| **React Leaflet** | Maps | 4.2 |
| **Axios** | HTTP Client | 1.3 |

### **Backend Layer**
| Technology | Purpose | Version |
|------------|---------|---------|
| **Django** | Web Framework | 4.2 |
| **Django REST** | API Framework | 3.14 |
| **PostgreSQL** | Database | 12+ |
| **Redis** | Caching/WebSockets | 7.0 |
| **JWT** | Authentication | 5.0 |
| **Django Channels** | Real-time features | 4.0 |

### **DevOps & Tools**
| Tool | Purpose |
|------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **GitHub Actions** | CI/CD Pipeline |
| **Postman** | API Testing |
| **ESLint/Prettier** | Code Quality |

---

## 🚀 Quick Start

### **Prerequisites Checklist**
| Requirement | Version | Check |
|-------------|---------|-------|
| Node.js | 16+ | `node --version` |
| Python | 3.8+ | `python --version` |
| PostgreSQL | 12+ | `psql --version` |
| Docker (Optional) | Latest | `docker --version` |
| Git | Latest | `git --version` |

### **Quick Deployment Methods**

#### **Method 1: Docker (Recommended)**
```bash
# Clone repository
git clone https://github.com/yourusername/bloodbridge.git
cd bloodbridge

# Start all services
docker-compose up -d

# Check running services
docker-compose ps
```

#### **Access Points**
| Service | URL | Port | Default Credentials |
|---------|-----|------|---------------------|
| **Frontend** | http://localhost:3000 | 3000 | User registration |
| **Backend API** | http://localhost:8000 | 8000 | - |
| **API Docs** | http://localhost:8000/api/docs/ | 8000 | - |
| **Admin Panel** | http://localhost:8000/admin | 8000 | Created during setup |

---

## 🔧 Installation Guide

### **Step-by-Step Setup**

#### **1. Backend Setup**
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Database setup
python manage.py migrate
python manage.py createsuperuser

# Run server
python manage.py runserver
```

#### **2. Frontend Setup**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local

# Start development server
npm start
```

#### **3. Database Configuration**
```sql
-- PostgreSQL setup
CREATE DATABASE bloodbridge;
CREATE USER bloodbridge_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE bloodbridge TO bloodbridge_user;
ALTER USER bloodbridge_user CREATEDB;
```

---

## 📁 Project Structure

### **Directory Layout**
```
bloodbridge/
├── 📁 frontend/                 # React Application
│   ├── 📁 public/              # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/      # UI Components
│   │   │   ├── 📁 Dashboard/   # Dashboard components
│   │   │   ├── 📁 Chat/        # Chat system
│   │   │   ├── 📁 Common/      # Shared components
│   │   │   └── 📁 Layout/      # Layout components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 services/       # API services
│   │   ├── 📁 utils/          # Utility functions
│   │   ├── 📁 styles/         # Global styles
│   │   ├── App.jsx           # Main component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend/                 # Django API
│   ├── 📁 bloodbridge/        # Project config
│   ├── 📁 api/                # API application
│   │   ├── 📁 views/          # API views
│   │   ├── 📁 serializers/    # Data serializers
│   │   ├── 📁 models/         # Database models
│   │   ├── urls.py           # URL routing
│   │   └── permissions.py    # Custom permissions
│   ├── 📁 users/             # User management
│   ├── 📁 donations/         # Blood donation logic
│   ├── 📁 notifications/     # Notifications system
│   ├── 📁 chat/              # Real-time chat
│   ├── manage.py            # Django CLI
│   └── requirements.txt     # Dependencies
│
└── 📄 docker-compose.yml     # Docker config
```

---

## 🔧 Environment Variables

### **Backend Configuration (.env)**
| Variable | Description | Example |
|----------|-------------|---------|
| `DEBUG` | Debug mode | `True` |
| `SECRET_KEY` | Django secret key | `your-secret-key` |
| `DB_NAME` | Database name | `bloodbridge` |
| `DB_USER` | Database user | `bloodbridge_user` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `JWT_SECRET_KEY` | JWT secret | `jwt-secret-key` |
| `REDIS_URL` | Redis connection | `redis://localhost:6379/0` |
| `CORS_ALLOWED_ORIGINS` | Allowed origins | `http://localhost:3000` |

### **Frontend Configuration (.env.local)**
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | API base URL | `http://localhost:8000/api` |
| `VITE_WS_URL` | WebSocket URL | `ws://localhost:8000/ws` |
| `VITE_MAPBOX_TOKEN` | Mapbox token | `pk.yourtoken` |
| `VITE_APP_NAME` | Application name | `BloodBridge` |
| `VITE_APP_VERSION` | App version | `1.0.0` |

---

## 🎯 API Documentation

### **Base URL**
```
http://localhost:8000/api/
```

### **Authentication Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register/` | User registration |
| `POST` | `/auth/login/` | User login |
| `POST` | `/auth/logout/` | User logout |
| `GET` | `/auth/user/` | Get current user |

### **Blood Requests**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/requests/` | List all requests |
| `POST` | `/requests/` | Create new request |
| `GET` | `/requests/{id}/` | Get request details |
| `PUT` | `/requests/{id}/` | Update request |
| `DELETE` | `/requests/{id}/` | Delete request |
| `POST` | `/requests/{id}/accept/` | Accept as donor |
| `POST` | `/requests/{id}/ignore/` | Ignore request |

### **User Management**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/` | List users |
| `GET` | `/users/{id}/` | User details |
| `PUT` | `/users/{id}/` | Update user |
| `GET` | `/users/profile/` | Current profile |
| `POST` | `/users/update-location/` | Update location |

### **Chat System**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/chat/rooms/` | List chat rooms |
| `GET` | `/chat/rooms/{id}/` | Room details |
| `GET` | `/chat/rooms/{id}/messages/` | Get messages |
| `POST` | `/chat/rooms/{id}/messages/` | Send message |
| `WS` | `/ws/chat/{room_id}/` | WebSocket chat |

### **Notifications**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications/` | List notifications |
| `POST` | `/notifications/{id}/mark-read/` | Mark as read |
| `POST` | `/notifications/mark-all-read/` | Mark all read |
| `DELETE` | `/notifications/{id}/` | Delete notification |

---

## 🧪 Testing

### **Testing Commands**
| Test Type | Command | Coverage Report |
|-----------|---------|-----------------|
| **Backend Tests** | `python manage.py test` | `coverage report` |
| **Frontend Tests** | `npm test` | `npm test -- --coverage` |
| **E2E Tests** | `npm run cypress:open` | N/A |
| **All Tests** | `npm run test:all` | N/A |

### **Test Coverage Goals**
| Component | Target Coverage |
|-----------|-----------------|
| API Endpoints | 90% |
| React Components | 85% |
| Utility Functions | 95% |
| Models & Serializers | 90% |

---

## 🤝 Contributing

### **Contribution Workflow**
| Step | Action | Command |
|------|--------|---------|
| 1 | Fork repository | GitHub UI |
| 2 | Create branch | `git checkout -b feature-name` |
| 3 | Make changes | Edit files |
| 4 | Commit changes | `git commit -m "Description"` |
| 5 | Push to fork | `git push origin feature-name` |
| 6 | Open PR | GitHub UI |

### **Code Standards**
| Language | Standards | Tools |
|----------|-----------|-------|
| **Python** | PEP 8, Django Style | Flake8, Black |
| **JavaScript** | Airbnb Style Guide | ESLint, Prettier |
| **React** | Functional Components | React Hooks Rules |
| **CSS** | Tailwind Utility First | Tailwind Classes |

### **PR Checklist**
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Code follows standards
- [ ] Changes are focused

---

## 📄 License

### **MIT License**
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

### **License Summary**
| Aspect | Details |
|--------|---------|
| **License Type** | MIT License |
| **Commercial Use** | ✅ Allowed |
| **Modification** | ✅ Allowed |
| **Distribution** | ✅ Allowed |
| **Private Use** | ✅ Allowed |
| **Liability** | ❌ No warranty |
| **Warranty** | ❌ None |

---

<div align="center">

## 💖 Support & Connect

| Platform | Link | Purpose |
|----------|------|---------|
| **GitHub** | [yourusername/bloodbridge](https://github.com/yourusername/bloodbridge) | Source Code |
| **Issues** | [Report Bug](https://github.com/yourusername/bloodbridge/issues) | Bug Reports |
| **Discussions** | [Join Discussion](https://github.com/yourusername/bloodbridge/discussions) | Q&A |
| **Email** | support@bloodbridge.org | Support |

### 🩸 *Every Drop Counts - Join Us in Saving Lives!*

</div>
