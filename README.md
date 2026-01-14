# 🩸 Red Drop - Blood Donation Management System

![React](https://img.shields.io/badge/React-18.2-blue)
![Django](https://img.shields.io/badge/Django-4.2-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Overview

**Red Drop** is a real-time blood donation platform that connects donors with recipients during emergencies. It provides instant matching, secure communication, and location-based coordination to save lives through timely blood donations.

---

## 🎯 Project Title
### **Red Drop: Emergency Blood Network**
*Your drop of blood can save a life*

---

## 📝 Description

Red Drop is a web-based application designed to streamline the blood donation process during emergencies. The platform serves as a bridge between blood donors and recipients, ensuring timely help when it matters most.

### 🔥 **Core Features**
- **Emergency Request System** - Create urgent blood donation requests
- **Smart Matching Algorithm** - Match donors by blood type and proximity
- **Real-time Chat** - Secure communication between donors and recipients
- **Interactive Map** - Visualize donors and hospital locations
- **Instant Notifications** - Get alerts for nearby emergencies
- **User Dashboard** - Track requests, donations, and history

---

## 🧭 **Navigation System**

### **🔤 Primary Navigation Bar**
Located at the top of every page for seamless user experience:

| Navigation Item | Icon | Description | User Type |
|-----------------|------|-------------|-----------|
| **🏠 Dashboard** | 📊 | Personal dashboard with stats & quick actions | All Users |
| **🩸 Blood Requests** | 🔴 | Browse & filter emergency blood requests | All Users |
| **🗺️ Map View** | 📍 | Interactive map with donors & hospitals | All Users |
| **💬 Live Chat** | 💭 | Real-time messaging with matches | All Users |
| **📢 Notifications** | 🔔 | Alerts for nearby emergencies (🔴 Badge for unread) | All Users |
| **👤 Profile** | 👨‍⚕️ | User profile & settings | All Users |

### **🎯 Role-Based Navigation**

#### **For Recipients (Patients/Hospitals):**
- **🆕 Create Request** - Quick access button in navbar
- **📋 My Requests** - Track created requests
- **🏥 Nearby Donors** - View available donors
- **📊 Request History** - Past request records

#### **For Donors:**
- **✅ Available to Donate** - Toggle availability status
- **🤝 Accepted Requests** - View accepted donations
- **📅 Donation Schedule** - Schedule upcoming donations
- **🏆 Donation History** - Track past donations

#### **For Administrators:**
- **👥 User Management** - Manage all users
- **📈 Analytics** - System statistics & reports
- **⚠️ Request Moderation** - Review & verify requests
- **🏥 Hospital Directory** - Manage hospital listings

### **📱 Responsive Navigation**
- **Desktop**: Full navigation bar with dropdown menus
- **Tablet**: Compact navbar with hamburger menu for secondary items
- **Mobile**: Hamburger menu with priority items first

### **🎨 Navigation Features**
1. **Active State Highlighting** - Visual indication of current page
2. **Badge Notifications** - 🔴 Red badge for pending actions/unread messages
3. **Quick Actions** - Floating action button for emergency requests on mobile
4. **Breadcrumb Trail** - Shows user's location within app hierarchy
5. **Search Bar** - Quick search across requests, users, hospitals
6. **Language Selector** - Support for multiple languages (if implemented)

### **🚀 Quick Access Menu**
Contextual quick actions based on user role:

```javascript
// Example quick actions for donors:
const donorQuickActions = [
  { icon: "🩸", label: "Emergency Nearby", action: "viewEmergency" },
  { icon: "📅", label: "Schedule Donation", action: "schedule" },
  { icon: "📍", label: "Update Location", action: "updateLocation" },
  { icon: "✅", label: "Toggle Availability", action: "toggleAvailability" }
];

// Example quick actions for recipients:
const recipientQuickActions = [
  { icon: "🆘", label: "Create Emergency Request", action: "createRequest" },
  { icon: "🔍", label: "Find Donors", action: "findDonors" },
  { icon: "🏥", label: "Nearby Hospitals", action: "viewHospitals" },
  { icon: "💬", label: "Active Chats", action: "viewChats" }
];
```

### **📍 Breadcrumb Navigation**
Example: `Home > Blood Requests > Emergency Requests > Request #1234`

### **⚙️ User Menu (Top Right)**
Dropdown with:
- 👤 Profile Settings
- 🔔 Notification Center
- 🌙 Dark/Light Mode Toggle
- 🆘 Emergency Hotline
- 🚪 Logout

---

### 👥 **User Roles**
| Role | Purpose | Key Actions |
|------|---------|-------------|
| **Recipient** | Need blood | Create requests, chat with donors |
| **Donor** | Want to donate | Accept requests, share location |
| **Admin** | Manage system | Monitor activity, verify users |

### 🛠️ **Technology Stack**
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + Tailwind CSS | User interface |
| **Backend** | Django REST Framework | API & business logic |
| **Database** | PostgreSQL | Data storage |
| **Real-time** | Django Channels | Live chat & notifications |
| **Maps** | React Leaflet | Location visualization |

---

## 🚀 How to Run the Project

### **📋 Prerequisites**
- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL 12+
- Git

### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/yourusername/red-drop.git
cd red-drop
```

### **2️⃣ Backend Setup**

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

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Run database migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

### **3️⃣ Frontend Setup**

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install Node.js dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with API URL (default: http://localhost:8000/api)

# Start React development server
npm start
```

### **4️⃣ Database Configuration**

```sql
-- Create PostgreSQL database
CREATE DATABASE reddrop;
CREATE USER reddrop_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE reddrop TO reddrop_user;
ALTER USER reddrop_user CREATEDB;
```

### **5️⃣ Access the Application**

| Service | URL | Port | Default Credentials |
|---------|-----|------|---------------------|
| **Frontend** | http://localhost:3000 | 3000 | Register new user |
| **Backend API** | http://localhost:8000 | 8000 | - |
| **Admin Panel** | http://localhost:8000/admin | 8000 | Created during setup |
| **API Documentation** | http://localhost:8000/api/docs/ | 8000 | - |

---

## 📁 Project Structure
```
red-drop/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── navigation/   # Navigation components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Breadcrumbs.jsx
│   │   │   │   └── QuickActions.jsx
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── .env.local           # Frontend environment variables
│
├── backend/                  # Django Backend API
│   ├── api/                 # Main API application
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views
│   │   └── urls.py          # URL routing
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Backend environment variables
│
└── README.md                # This file
```

---

## ⚙️ Environment Variables

### **Backend (.env file)**
```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_NAME=reddrop
DB_USER=reddrop_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# JWT Authentication
JWT_SECRET_KEY=your-jwt-secret-key

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### **Frontend (.env.local file)**
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_APP_NAME=Red Drop
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register new user |
| `POST` | `/api/auth/login/` | User login |
| `POST` | `/api/requests/` | Create blood request |
| `GET` | `/api/requests/` | List all requests |
| `POST` | `/api/requests/{id}/accept/` | Accept request as donor |
| `GET` | `/api/chat/rooms/` | Get chat rooms |
| `POST` | `/api/chat/messages/` | Send message |
| `GET` | `/api/notifications/` | Get notifications |

---

## 🧪 Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
cd frontend
npm test

# Run all tests
cd frontend
npm run test:all
```

---

## 🤝 Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -m 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Open a Pull Request

**Guidelines:**
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/red-drop/issues)
- **Documentation**: Included in `/docs` folder
- **Email**: support@reddrop.org

---

<div align="center">

## ❤️ **Every Drop Counts - Be a Hero Today!**

*Join Red Drop and make a difference in someone's life*

</div>
