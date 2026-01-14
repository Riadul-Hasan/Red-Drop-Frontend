# 🩸 Red Drop - Blood Donation Management System

## 📋 Table of Contents
- [🎯 Project Title](#-project-title)
- [📝 Description](#-description)
- [🚀 How to Run](#-how-to-run)
- [👥 User Roles](#-user-roles)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment Setup](#️-environment-setup)
- [📡 API Endpoints](#-api-endpoints)

---

## 🎯 Project Title
### **Red Drop: Emergency Blood Network**
*Your drop of blood can save a life*

---

## 📝 Description
Red Drop is a real-time blood donation platform connecting donors with recipients during emergencies. The system provides instant matching based on blood type and location, secure communication channels, and real-time notifications to facilitate timely blood donations.

**Key Features:**
- 🚨 Emergency blood request system
- 📍 Location-based donor matching
- 💬 Real-time chat between donors & recipients
- 🗺️ Interactive map visualization
- 🔔 Instant notifications
- 📊 User dashboard & history tracking

---

## 🚀 How to Run

### **Prerequisites**
- Node.js 16+ & npm
- Python 3.8+
- PostgreSQL 12+
- Git

### **Quick Start**

```bash
# 1. Clone repository
git clone https://github.com/yourusername/red-drop.git
cd red-drop

# 2. Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # Configure your database
python manage.py migrate
python manage.py runserver

# 3. Frontend setup (new terminal)
cd frontend
npm install
npm start

# 4. Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Admin: http://localhost:8000/admin
```

---

## 👥 User Roles
| Role | Purpose | Key Features |
|------|---------|--------------|
| **Recipient** | Needs blood | Create requests, chat with donors, track status |
| **Donor** | Wants to donate | Accept requests, set availability, view emergencies |
| **Admin** | System management | Monitor activity, verify users, generate reports |

---

## 🛠️ Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + Tailwind CSS | Responsive UI |
| **Backend** | Django REST Framework | API & logic |
| **Database** | PostgreSQL | Data storage |
| **Real-time** | Django Channels | WebSockets for chat |
| **Maps** | React Leaflet | Location visualization |

---

## 📁 Project Structure
```
red-drop/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/     # Page views
│   │   └── services/  # API calls
│   └── package.json
│
├── backend/            # Django API
│   ├── api/
│   │   ├── models.py  # Database models
│   │   ├── views.py   # API endpoints
│   │   └── urls.py    # URL routing
│   └── manage.py
│
└── README.md
```

---

## ⚙️ Environment Setup

### **Backend (.env)**
```env
DEBUG=True
SECRET_KEY=your-secret-key
DB_NAME=reddrop
DB_USER=reddrop_user
DB_PASSWORD=your_password
```

### **Frontend (.env.local)**
```env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
```

---

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register/` | User registration |
| `POST` | `/auth/login/` | User login |
| `POST` | `/requests/` | Create blood request |
| `GET` | `/requests/` | List all requests |
| `POST` | `/requests/{id}/accept/` | Accept request |
| `GET` | `/notifications/` | Get notifications |

---

## 🤝 Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under MIT License. See `LICENSE` for more information.

---

<div align="center">

## ❤️ Every Drop Counts - Be a Hero Today!

*Join Red Drop and make a difference in someone's life*

</div>
