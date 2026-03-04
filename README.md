<div align="center">

# ⚡ Flash Hire

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**AI-powered job matching platform — upload your CV, get scored recommendations, and receive automated job alerts.**

</div>

---

## ✨ About

Flash Hire solves the pain of manual job hunting. Instead of blindly applying to hundreds of jobs, users upload their CV once and let AI handle the rest — matching against real job openings with a clear compatibility score, skill gap analysis, and automated alerts for new relevant opportunities.

---

## 🛠️ Tech Stack

| Technology                                                                                                    | Purpose                                 |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat&logo=nextdotjs&logoColor=white)          | Full-stack React framework              |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)      | Type-safe JavaScript                    |
| ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat&logo=supabase&logoColor=white)            | Auth & database                         |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)                  | Type-safe ORM                           |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) | Utility-first CSS framework             |
| [![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?logo=openapiinitiative&logoColor=white)](#)           | LLM providers for CV parsing & matching |
| **Upstash QStash**                                                                                            | Scheduled job alert automation          |
| **Upstash Redis**                                                                                             | Caching & rate limiting                 |
| **Resend + React Email**                                                                                      | Transactional email notifications       |
| **NextAuth**                                                                                                  | Authentication & session management     |
| **Zod**                                                                                                       | Schema validation                       |
| ![Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)                         | Linting & formatting                    |

---

## 📋 Features

**🤖 AI-Powered CV Matching**
- Upload CV (PDF) once — AI extracts your skills, experience, and education automatically
- Input target role and preferences (location, remote/hybrid) to fetch real job listings from Adzuna API
- Each job gets a match score (0–100%) calculated from how well your CV aligns with the job requirements
- Job detail page shows matched skills (✓) vs. missing skills (✗) with actionable gap suggestions
- Editable parsed CV data so you can correct any AI extraction errors before searching

**🔔 Job Alerts**
- Create alerts based on your search criteria — job title, location, and minimum match score
- Choose delivery frequency: daily (every morning at 8 AM) or weekly (every Monday)
- Automated email digest via Resend delivers your top 5 matched jobs on schedule
- Powered by Upstash QStash for reliable background job scheduling — no missed alerts
- Full alert management: view, edit, pause, or delete alerts anytime from your dashboard

**🔐 Authentication**
- Secure email & password signup/login via Supabase Auth + NextAuth
- CV data, saved jobs, and alerts are all tied to your account and persisted across sessions
- Protected routes enforced via middleware — dashboard and alerts inaccessible without login
- Row-Level Security (RLS) on all database tables ensures users can only access their own data

**💼 Job Management**
- Browse job recommendations sorted by match score with color-coded indicators (green/yellow/red)
- Save interesting jobs to review later
- Direct link to the original job posting on the company's website
- Dashboard overview showing your active CV, recent searches, and alert statuses

**⚡ Performance & Reliability**
- Job search results delivered in under 10 seconds end-to-end
- Upstash Redis caching reduces redundant AI and API calls for faster repeat searches
- Rate limiting on API routes to prevent abuse and keep costs predictable

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/flash-hire.git
cd flash-hire

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your API keys and service URLs

# 4. Push database schema
npx prisma generate
npx prisma db push

# 5. Start development server
npm run dev
```

---

## ⚙️ Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# AI Providers
GROQ_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
OPENAI_API_KEY=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
QSTASH_TOKEN=

# Email (Resend)
RESEND_API_KEY=

# Database
DATABASE_URL=
```

---

## 📁 Project Structure

```
flash-hire/
├── public/
└── src/
    ├── app/
    │   ├── (app)/          # Main app routes (protected)
    │   ├── (auth)/         # Auth routes (login, register)
    │   └── api/            # API route handlers
    ├── components/         # Reusable UI components
    ├── constants/          # App-wide constants
    ├── cron/               # Scheduled job alert tasks
    ├── features/           # Feature-based modules
    ├── lib/                # Utility functions & configurations
    ├── services/           # AI matching & external service logic
    ├── types/              # TypeScript type definitions
    ├── utils/              # Helper utilities
    └── middleware.ts       # Auth & rate limit middleware
```

---

<div align="center">

_Built to save job seekers time — one smart match at a time. ⚡_

\*by **Your Name\***

</div>
