# EduInsight AI 🎓

> An enterprise-grade AI-powered student answer sheet analysis platform — built with Next.js 15, NestJS, MongoDB, and Claude AI.

![EduInsight AI](https://img.shields.io/badge/EduInsight-AI-blueviolet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-red?style=for-the-badge&logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?style=for-the-badge&logo=mongodb)
![Railway](https://img.shields.io/badge/Railway-Deployed-purple?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

---

## 🚀 What is EduInsight AI?

EduInsight AI scans handwritten student answer sheets using OCR + Claude AI, evaluates performance, identifies weaknesses, and generates detailed improvement reports for teachers, students, parents, and school management.

### Key Features

- 📷 **AI OCR Pipeline** — Upload answer sheets; Claude reads handwritten text
- 🤖 **AI Evaluation** — Per-question scoring with rubric-aware feedback
- 📊 **Rich Analytics** — Performance trends, radar charts, score distributions
- 🧠 **Growth Prediction** — AI predicts at-risk students before they fail
- 📋 **Improvement Plans** — Daily & weekly study plans generated per student
- 💬 **AI Chat** — Students can chat with the AI about their results
- 👨‍👩‍👧 **5 User Roles** — Super Admin, School Admin, Teacher, Student, Parent
- 🔐 **JWT Auth** — Secure with refresh token rotation

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion |
| UI Components | ShadCN UI (base-ui), Recharts, ApexCharts |
| State | Zustand, React Query |
| Backend | NestJS 11, TypeScript, REST API, JWT |
| Database | MongoDB (Railway) via Mongoose |
| AI | Claude AI (Anthropic SDK) |
| Storage | Cloudinary |
| Hosting | Vercel (frontend) + Railway (backend + DB) |

---

## 📁 Project Structure

```
eduinsight-ai/
├── frontend/          # Next.js 15 App Router
│   ├── src/
│   │   ├── app/       # Pages (auth, dashboard routes)
│   │   ├── components/  # UI components + charts
│   │   ├── lib/       # API client, utilities
│   │   └── stores/    # Zustand state (auth, ui)
│   └── vercel.json
│
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/   # auth, users, schools, students, teachers, subjects, exams, ai, notifications
│   │   ├── database/  # Mongoose schemas
│   │   ├── common/    # Guards, decorators, interceptors, filters
│   │   └── config/    # Configuration
│   └── railway.json
│
├── docker-compose.yml  # Local dev with MongoDB
└── nginx.conf         # Reverse proxy config
```

---

## ⚡ Quick Start (Local)

### Prerequisites
- Node.js 20+
- MongoDB running locally or Docker

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/eduinsight-ai.git
cd eduinsight-ai
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run start:dev
```

### 3. Frontend setup
```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm install
npm run dev
```

### 4. Or use Docker Compose
```bash
docker compose up --build
```

---

## 🌐 Deployment

### Frontend → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Set environment variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app/api` |
| `NEXT_PUBLIC_APP_NAME` | `EduInsight AI` |

### Backend + Database → Railway

1. Create a new project on [railway.app](https://railway.app)
2. Add a **MongoDB** service (Railway provides it)
3. Add a **GitHub repo** service pointing to the `backend/` directory
4. Set environment variables from `.env.example`
5. Railway auto-detects `railway.json` for build/start commands

#### Required Railway Environment Variables

```env
PORT=4000
MONGODB_URI=${{MongoDB.MONGODB_URL}}   # Auto-set by Railway MongoDB plugin
JWT_SECRET=your-super-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
FRONTEND_URL=https://your-app.vercel.app
CLAUDE_API_KEY=your-anthropic-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NODE_ENV=production
```

---

## 🔑 API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/schools` | List schools |
| GET | `/api/students` | List students |
| GET | `/api/exams` | List exams |
| POST | `/api/ai/evaluate` | AI evaluate answer sheet |
| POST | `/api/ai/chat` | AI chat |
| GET | `/api/health` | Health check |

---

## 🧑‍💻 User Roles

| Role | Access |
|---|---|
| `super_admin` | Full platform access, manage all schools |
| `school_admin` | Manage their school, teachers, students |
| `teacher` | Create exams, upload answer sheets, view results |
| `student` | View own results, AI chat, study planner |
| `parent` | View child's performance and reports |

---

## 📄 License

MIT © EduInsight AI
