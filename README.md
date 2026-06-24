# SkillSync

SkillSync is an AI-powered placement preparation platform that analyzes a student's resume, identifies skill gaps, evaluates placement readiness, and generates personalized learning recommendations for top companies.

The long-term vision is to help colleges provide students with an individualized roadmap for placements instead of generic training programs.

---

## Features

- AI-powered resume analysis
- Resume parsing from PDF/DOCX
- Placement readiness scoring
- Company-specific skill matching
- Personalized skill gap analysis
- 4-week learning roadmap
- Modern responsive dashboard
- Secure backend API

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI (MUI)

### Backend
- Node.js
- Express.js

### Database
- Supabase

### AI
- OpenRouter API
- Gemini 2.5 Flash

---

## Current Workflow

1. Upload your resume.
2. Resume text is extracted.
3. AI analyzes the resume.
4. Skills, education, projects and certifications are parsed.
5. Placement readiness score is generated.
6. Company-wise skill matching is calculated.
7. Missing skills are identified.
8. A personalized roadmap is generated.

---

## Dashboard Includes

- Placement readiness score
- Resume quality evaluation
- Technical skill assessment
- Company-wise match percentage
- Matched skills
- Missing skills
- Personalized recommendations
- Learning roadmap

---

## Future Improvements

- GitHub profile analysis
- LeetCode integration
- ATS score analysis
- Company-specific interview preparation
- Authentication
- Student profiles
- College admin dashboard
- Placement analytics
- Real-time job role recommendations
- Progress tracking
- Resume version comparison

---

## Project Structure

```
SkillSync/
│
├── Frontend/
│   ├── src/
│   └── ...
│
├── Backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── ...
│
└── README.md
```

---

## Installation

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/SkillSync.git
cd SkillSync
```

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## Environment Variables

Backend requires a `.env` file.

```
PORT=

SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=

AI_MODEL=google/gemini-2.5-flash
```

---

## Screenshots

### Resume Analysis

_Add screenshot here_

### Dashboard

_Add screenshot here_

### Company Skill Match

_Add screenshot here_

---

## Status

🚧 Currently under active development.

Several planned features are still being implemented.

---

## Vision

The goal of SkillSync is to bridge the gap between academic learning and placement expectations by providing students with personalized, AI-driven career guidance instead of one-size-fits-all preparation.

---

## Author

**Arun Raj**

Computer Science Engineering (IoT)

