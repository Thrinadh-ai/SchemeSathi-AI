# SchemeSathi AI (స్కీమ్‌సాథి AI / स्कीमसाथी AI)
> **Your Guide to Government Schemes.**
> An intelligent, full-stack, responsive public discovery platform designed to help citizens across India explore welfare schemes, evaluate eligibility criteria, prepare document checklists, and connect directly with official government portals.

---

## 🏛️ Project Overview

**SchemeSathi AI** bridges the information gap between Indian citizens and public welfare initiatives. Millions of eligible students, farmers, women, small business owners, and senior citizens miss out on crucial welfare benefits simply because scheme information is fragmented, eligibility criteria are hard to parse, and official application portals are difficult to locate.

SchemeSathi AI solves this through:
1. **Search & Exploration**: Discover verified Central and State programs with transparent metadata.
2. **Deterministic Eligibility Engine**: Evaluate criteria against explicit rules (not speculative guessing).
3. **Grounded AI Assistant**: Chat with an AI assistant that answers strictly using verified scheme facts and cites official `.gov.in` portals.
4. **Interactive Document Checklist**: Prepare required proofs and certificates locally with zero privacy risk.
5. **Multilingual Support**: Real-time interface localization in **English, Telugu (తెలుగు), and Hindi (हिन्दी)**.

---

## 🌟 The Twelve Core Features

| # | Feature | Description |
|---|---|---|
| 1 | **Home Dashboard** | Overview, trust metrics, quick beneficiary shortcuts, and category discovery. |
| 2 | **Scheme Search & Filtering** | Multi-attribute search by name, department, state jurisdiction, level, and category executed on the backend. |
| 3 | **Eligibility Checker** | Evaluates age, state, income, occupation, and categories. Distinguishes *Potentially eligible*, *Not eligible based on available rules*, and *Insufficient information*. |
| 4 | **Grounded AI Assistant** | RAG-based conversational interface answering questions strictly from verified records with official portal links. |
| 5 | **Category Browsing** | Structured sector browsing: Agriculture, Education, Healthcare, Women & Child, Small Business, Housing, etc. |
| 6 | **State-wise Jurisdiction** | Clear separation between All-India Central programs and State-specific programs (e.g. Andhra Pradesh, Telangana). |
| 7 | **Multilingual Interface** | Instant translation dictionary for English, Telugu, and Hindi across all navigation, buttons, and form labels. |
| 8 | **Document Checklist** | Scheme-specific document readiness tracker with local browser checkboxes and progress calculation. |
| 9 | **Detailed Scheme Modals** | Full modal view showing overview, benefits, eligibility rules, application steps, and required documents. |
| 10 | **Verified Official Links** | Direct links to verified government domains (`pmkisan.gov.in`, `pmjay.gov.in`, `scholarships.gov.in`, `mudra.org.in`, etc.). |
| 11 | **Saved Schemes (Favourites)** | Browser `localStorage` bookmarks allowing citizens to save schemes for quick offline reference. |
| 12 | **User Preferences** | Save preferred language, state, and primary category locally without creating unnecessary accounts. |

---

## 🏗️ System Architecture

```
SchemeSathi-AI/
├── index.html        # Semantic HTML5 frontend layout, accessible modals, and views
├── style.css         # Modern, mobile-first responsive styling (Navy & Clean Blue palette)
├── script.js         # Frontend controller, multilingual i18n, API client, & localStorage
├── server.py         # Python Flask REST API, eligibility evaluator, RAG AI assistant, & DB router
├── requirements.txt  # Python dependency specifications
├── schema.sql        # Supabase PostgreSQL schema, RLS policies, indexes, & seed data
├── test_server.py    # Automated test suite (15 test cases)
└── README.md         # Comprehensive documentation & deployment guide
```

### Architecture Workflow
1. **Frontend**: Static, lightweight Single Page Application (SPA). Can be served directly by Flask or hosted separately on **Vercel / Netlify / GitHub Pages**.
2. **Backend**: Python Flask REST API running on port `5000` (or host-provided `$PORT` on **Render / Railway**).
3. **Database Layer**: Dual-mode data manager:
   - **Supabase PostgreSQL Mode**: Connects when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided.
   - **High-Fidelity Demo Mode**: Operates seamlessly with built-in verified records when external credentials are absent.
4. **AI Layer**: RAG workflow with configurable provider (`AI_API_KEY`, `AI_MODEL`, `AI_API_BASE_URL`). Falls back gracefully to a verified records engine if no AI API key is configured.

---

## ⚙️ Prerequisites

- **Python**: Version 3.10, 3.11, or 3.12.
- **Node / Browser**: Any modern browser (Chrome, Edge, Firefox, Safari).
- **Git**: For version control and deployment.

---

## 🚀 Local Quickstart Guide

### 1. Clone or Open the Workspace
```bash
cd c:\Users\poola\Desktop\SchemeSathi-AI
```

### 2. Create and Activate a Virtual Environment
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
copy .env.example .env
```
Edit `.env` (optional — works out-of-the-box in Demo Mode):
```env
PORT=5000
FRONTEND_ORIGIN=*
# Optional: Supabase credentials
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
# Optional: AI assistant credentials
AI_API_KEY=
AI_MODEL=gpt-4o-mini
AI_API_BASE_URL=https://api.openai.com/v1
```

### 5. Run the Server
```bash
python server.py
```
Open your browser at: **[http://localhost:5000](http://localhost:5000)**.
Both the frontend and REST APIs are served directly from this single local endpoint!

---

## 🧪 Automated Testing

Execute the comprehensive test suite:
```bash
python test_server.py
```
Expected output:
```
Ran 15 tests in 0.227s
OK
```

The test suite covers:
- System health and metadata diagnostics
- Scheme listing, keyword queries, and category filtering
- 404 handling on unknown scheme IDs
- Realistic eligibility evaluations (Student, Farmer, Income rules)
- Input validation rejection (negative age, negative income, invalid JSON)
- Grounded AI fallback without API keys
- Static asset serving

---

## 🗄️ Supabase PostgreSQL Setup

If you wish to host dynamic scheme records in an external database:

1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new project (e.g. `schemesathi-db`).
3. Open the **SQL Editor** in the Supabase Dashboard.
4. Paste and execute the contents of `schema.sql`:
   - Creates the `schemes` table with JSONB fields.
   - Configures indexes for fast queries.
   - Enables Row Level Security (RLS) with public read access.
   - Seeds verified initial schemes.
5. In **Project Settings** > **API**, retrieve:
   - `Project URL`
   - `service_role` secret key (kept server-side only).
6. Set these values in your backend environment variables:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
7. When restarted, SchemeSathi AI will automatically detect Supabase and switch `database_mode` to `supabase`.

---

## 🤖 AI Assistant Configuration

The assistant uses an evidence-grounded Retrieval Augmented Generation (RAG) pattern:
1. Citizen inputs a prompt.
2. The backend retrieves the most relevant verified schemes.
3. The prompt + verified scheme context are sent to the AI model with strict grounding instructions.
4. The model returns a structured answer citing official URLs.

Supported providers:
- **OpenAI**: `AI_API_KEY=sk-...`, `AI_MODEL=gpt-4o-mini`, `AI_API_BASE_URL=https://api.openai.com/v1`
- **Groq**: `AI_API_KEY=gsk_...`, `AI_MODEL=llama-3.1-8b-instant`, `AI_API_BASE_URL=https://api.groq.com/openai/v1`
- **Any OpenAI-Compatible Gateway**: Point `AI_API_BASE_URL` to your endpoint.

*If no `AI_API_KEY` is provided, SchemeSathi AI gracefully defaults to its deterministic verified records engine.*

---

## 🌐 Production Deployment

### Option A: Frontend on Vercel + Backend on Render

#### 1. Deploy Backend on Render
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/) and click **New Web Service**.
3. Connect your GitHub repository.
4. Configure:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app --bind 0.0.0.0:$PORT`
5. In **Environment Variables**, add:
   - `FRONTEND_ORIGIN`: `https://your-frontend.vercel.app`
   - `PORT`: `10000`
   - (Optional) `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_API_KEY`
6. Click **Deploy**. Note your live URL: `https://schemesathi-api.onrender.com`.

#### 2. Deploy Frontend on Vercel
1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure:
   - **Framework Preset**: `Other`
   - **Output Directory**: `.` (Root)
4. In `index.html`, set the backend URL by adding this script snippet inside `<head>` before `script.js`:
   ```html
   <script>window.__SCHEMESATHI_API_URL__ = "https://schemesathi-api.onrender.com";</script>
   ```
5. Click **Deploy**. Your frontend is live with automatic SSL!

---

## 🔒 Security Best Practices

- **Zero Document Upload**: SchemeSathi AI never asks for or stores Aadhaar cards, OTPs, bank passwords, or sensitive documents.
- **LocalStorage Favourites**: Bookmarks and document checklist progress stay strictly inside the citizen's browser.
- **CORS Hardening**: Configurable allowed origin (`FRONTEND_ORIGIN`) prevents unauthorized cross-site requests.
- **Payload Limits**: Requests are capped at 1MB to prevent memory exhaustion attacks.
- **Grounded AI Guardrails**: Strict system prompting prevents prompt injection and hallucinations.

---

## ⚠️ Statutory Government Disclaimer

> **Fair Use & Public Interest Notice:**
> **SchemeSathi AI** is an independent, non-governmental public information platform built solely to assist Indian citizens in discovering public welfare opportunities. SchemeSathi AI is **NOT** affiliated, endorsed, authorized, or associated with the Government of India, any State Government, or any government ministry or department.
>
> Scheme names, logos, guidelines, and benefits belong to their respective government authorities. Guidelines, quotas, income limits, and application deadlines are subject to official revision. Citizens must independently verify all rules and submit applications exclusively through official government portals (`.gov.in` / `.nic.in`). SchemeSathi AI never charges fees or processes transactions.
