# Butler — Premium Errand & Concierge Platform (Frontend)

Welcome to the frontend repository for **Butler**, a luxury, on-demand personal concierge and errand-running platform. This application provides entirely distinct, role-based interfaces for Clients, Operators, Drivers, and Platform Administrators.

## 🌟 Project Overview

Butler is designed to give high-net-worth individuals and busy professionals a seamless way to offload daily tasks. The platform operates on a territory-based franchise model, where local Operators manage Drivers who fulfill Client requests.

This frontend is a strictly scoped, data-driven single-page application (SPA) built with modern React. It utilizes entirely custom CSS (via Tailwind) and deeply integrated animations to deliver a premium, native-app-like feel on both desktop and mobile devices.

### 🎭 Role-Based Architecture

The platform enforces strict data boundaries across four distinct user roles:

1. **Client (Service Interface)**
   - Place detailed errand requests (Grocery, Pharmacy, Dry Cleaning, Packages, Food, Custom).
   - Track driver ETA, view driver ratings, and directly message/call assigned drivers.
   - View "Monthly Time Saved" ROI metrics and manage premium subscriptions.

2. **Driver (Execution Layer)**
   - View available orders in their assigned territory and accept/decline in real-time.
   - Manage active tasks, map routes, and upload photo proof of completion.
   - Track daily/weekly earnings, completion rates, and personal ratings.

3. **Operator (Territory Management)**
   - Manage a specific geographic region (franchise model).
   - Oversee the territory's order pipeline (New → Assigned → In Progress → Completed).
   - Track territory revenue, auto-calculated commissions, and driver performance.
   - Monitor and flag client accounts, and reassign driver tasks.

4. **Admin (Global Command Center)**
   - Global visibility across all territories, operators, drivers, and clients.
   - Track key business metrics: MRR, ARR, CAC, LTV, LTV:CAC Ratio, and Churn Rate.
   - View data-rich interactive charts (Orders Over Time, Client Growth, Revenue by Territory).
   - Monitor a real-time Live Operations Feed of all platform activity.

---

## 🛠️ Technology Stack

- **Core Framework:** React 18 + Vite (Fast HMR and optimized builds)
- **Routing:** React Router DOM (v6)
- **State Management:** Zustand (Lightweight, hook-based global state)
- **Styling:** Tailwind CSS v4 + pure inline CSS for specific grid utility classes
- **Animations:** Framer Motion (PageTransitions, FadeIns, Staggered list loading)
- **Data Visualization:** Recharts (Responsive Area, Line, Bar, and Donut charts)
- **Icons:** Phosphor Icons (Consistent, premium iconography)
- **Notifications:** Sonner (Highly polished, stackable toast notifications)
- **Form Validation:** React Hook Form + Zod (Strict schema validation)
- **Deployment:** Vercel (`vercel.json` configured for SPA routing)

---

## 📱 Design & UX Philosophy

Butler's UI/UX is built on the following principles:

- **Mobile-First Responsiveness:** Every dashboard, table, and chart degrades gracefully. On mobile, complex data tables automatically convert into readable, stackable "Cards".
- **Zero Layout Shift Skeletons:** Every asynchronous data load is preceded by a perfectly sized skeleton loader (`SkeletonCard`, `SkeletonTable`) to prevent layout jumping.
- **Micro-interactions:** Buttons provide tactile feedback, lists stagger in gracefully, and page transitions prevent jarring flashes of white.
- **"Dead End" Prevention:** Comprehensive empty states (e.g., "No drivers found", "No active requests") feature custom icons and clear actionable next steps.
- **Null-Safety & Edge Cases:** Broad handling for missing profile images, long text truncation, missing ratings, and preventative file-size validations on proof-of-completion uploads.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/strattonterrace/butler-app-official.git
   cd butler-app-official/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Demo Access

The current frontend utilizes mock data located in `src/mock/data.js` to simulate database interactions. To explore the different role-based views, navigate to the `/login` page and use the role switcher at the bottom of the sidebar (or just log in, as credentials auto-fill based on the selected demo role).

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── layout/       # AppShell, Sidebar, TopBar, MobileNav, MobileDrawer
│   ├── motion/       # Framer Motion wrappers (PageTransition, FadeIn)
│   └── ui/           # Reusable generic UI (Card, Button, Badge, Input)
├── features/
│   ├── admin/        # Admin Global Dashboard & Management pages
│   ├── auth/         # Login, Register, Forgot Password
│   ├── client/       # Client Dashboard, Request Engine, Settings
│   ├── driver/       # Driver Dashboard, Task Execution, History
│   └── operator/     # Operator Dashboard, Territory Queue, Management
├── hooks/            # Custom React hooks (useIsMobile, usePageTitle, etc.)
├── lib/              # Utility functions (formatting, date logic, validation schemas)
├── mock/             # Simulated database and localized data stores
├── router/           # React Router configuration & Protected Route wrappers
└── store/            # Zustand global state (authStore)
```

---

## 🔒 Next Steps (Phase 2 - Backend)

This application is currently ready for its Phase 2 integration with a live Django REST Framework + PostgreSQL backend. The mock data structure in `src/mock/data.js` perfectly mimics the expected JSON responses from the forthcoming APIs.
