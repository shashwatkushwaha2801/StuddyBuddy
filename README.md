# StudyBuddy – Smart Student Collaboration Platform

**StudyBuddy** is a modern, responsive, and full-featured student collaboration web application designed to help college students connect with compatible study partners, join active course study circles, and organize academic deliverables.

---

## 🌟 Key Features

### 1. 🎯 Smart Study Partner Matching Algorithm (Weighted Mathematical Engine)
- **Live Database-Driven Recommendations**: Computes dynamic compatibility across all registered student profiles. The logged-in student is never recommended to themselves.
- **Weighted Formula**:
  - **Common Academic Subjects (50%)**: Normalized overlap ratio across selected subjects.
  - **Compatible Study Timings (25%)**: Exact timeslot match (25 pts), flexible/overlapping times (22 pts), or adjacent periods (15 pts).
  - **Similar Learning Goals (25%)**: Alignment across exam preparation, competitive programming, project development, research, etc.
- **Descending Order Ranking**: Candidates are ranked strictly by highest compatibility percentage.
- **Detailed Score Breakdown Modal**: Visual transparency explaining exactly how each percentage score was calculated.
- **Dynamic Filters**: Search by keyword, college, branch, or filter by subject, timing, year, and a minimum compatibility score slider.

### 2. 🤝 Comprehensive Connection Request System
- **Real-Time States**: Send connection requests with optional personalized study notes.
- **Request Management**: Accept, decline, or cancel pending requests.
- **Connections Hub**:
  - *My Study Buddies*: Active partners with integrated direct messaging and study session scheduling.
  - *Received Requests*: Notification bell with quick-action approvals.
  - *Sent Requests*: Track invitations with one-click cancel options.
- **Integrity**: Prevents duplicate requests and self-requests.

### 3. 👥 Real Database-Backed Study Groups
- **Pre-Seeded & User-Created Communities**:
  - *Programming Pals* (Computer Science / Algorithms)
  - *Mathematics Circle* (Multivariable Calculus & Linear Algebra)
  - *Physics Forum* (Classical & Quantum Mechanics)
  - *Data Structures Club* (Tree Traversals, DP, Graphs)
  - *AI & Machine Learning Guild* (PyTorch, Deep Learning, LLMs)
- **Interactive Features**: Join/leave groups, view member rosters with college & branch info, and post questions on group discussion boards.

### 4. 📅 Personal Study Planner & Pomodoro Timer
- **Task Management**: Add, edit, delete, and organize daily academic tasks with subject tags, priority indicators (Urgent, High, Medium, Low), deadlines, and estimated minutes.
- **Completion Tracking**: Check off tasks with celebratory confetti animations and real-time completion rate statistics.
- **Integrated Pomodoro Timer**: Switch between 25-minute deep focus sprints and 5-minute restorative breaks.

### 5. 🎓 Student Profile & Persona Switcher
- **Editable Student Profile**: Customize profile picture, university name, branch/major, academic year, subject tags, skill level (Beginner/Intermediate/Advanced), learning goals, preferred study timing, and bio.
- **1-Click Persona Switcher**: Instantly switch perspective between different student personas (e.g. *Alex Chen*, *Sophia Patel*, *Marcus Vance*, *Elena Gomez*) to test matching and connection requests in real-time.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Canvas Confetti |
| **Backend** | Node.js, Express, CORS, Dotenv |
| **Database & Auth** | Supabase (PostgreSQL), Supabase Auth |
| **State & Persistence** | React Context API, LocalStorage Sync, In-Memory Seed Store Fallback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Quick Start (Runs in Demo Mode Immediately)

1. **Clone or Navigate to the project root:**
   ```bash
   cd "STUDY BUDDY"
   ```

2. **Run both Frontend and Backend concurrently:**
   ```bash
   npm run dev
   ```
   Or start them individually in separate terminals:
   ```bash
   # Terminal 1: Backend API (port 5000)
   npm run server

   # Terminal 2: Frontend Client (port 5173)
   npm run client
   ```

3. Open **`http://localhost:5173`** in your browser.

---

## 🔌 Supabase (PostgreSQL) Setup (Optional)

StudyBuddy runs out-of-the-box in **Active Demo Mode** with persistent data. To connect your live Supabase cloud PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the migrations script located at:
   ```
   server/db/schema.sql
   ```
3. (Optional) Run the seed script to populate sample students and groups:
   ```
   server/db/seed.sql
   ```
4. Copy `.env.example` to `.env` in the root (or in `client/` and `server/`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
5. Restart the server. The badge in the top navigation will automatically switch to **🟢 Supabase Live**.

---

## 📐 Matching Algorithm Specification

Given two students $U$ (current user) and $C$ (candidate partner):

$$\text{Total Score} = \text{SubjectScore} + \text{TimingScore} + \text{GoalScore}$$

Where:
- **Common Subjects ($50\%$ weight)**:
  $$\text{SubjectRatio} = \frac{|U_{\text{subjects}} \cap C_{\text{subjects}}|}{\max(|U_{\text{subjects}}|, |C_{\text{subjects}}|)}$$
  $$\text{SubjectScore} = \text{round}(\text{SubjectRatio} \times 50)$$
- **Study Timing ($25\%$ weight)**:
  - Exact match: $25\text{ pts}$
  - Either profile specifies "Flexible": $22\text{ pts}$
  - Adjacent timeslots (e.g., Afternoon & Evening): $15\text{ pts}$
  - Different timeslots: $5\text{ pts}$
- **Learning Goals ($25\%$ weight)**:
  $$\text{GoalRatio} = \frac{|U_{\text{goals}} \cap C_{\text{goals}}|}{\max(|U_{\text{goals}}|, |C_{\text{goals}}|)}$$
  $$\text{GoalScore} = \text{round}(\text{GoalRatio} \times 25)$$

*Result:* If two students share all their selected subjects, prefer the same study timing, and have aligned learning goals, their compatibility score is **$100\%$**.
