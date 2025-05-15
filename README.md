# Ship Maintenance Dashboard #
A comprehensive React-based application for managing ship maintenance operations. This dashboard enables maritime organizations to track ships, components, maintenance schedules, and repair jobs — with robust role-based access control.

🔗Live Demo
👉 Click here to view the deployed app
(Replace this with your actual deployment link)

✨ Features
🔐 Role-Based Authentication
- Admin: Full access
- Inspector: Can view ships/components/jobs and create inspection jobs
- Engineer: Can view assigned jobs and update status

🛳️ Ship Management
- Track vessel name, IMO number, flag, and status

⚙️ Component Tracking
- Manage components, installation & maintenance dates

🗓️ Maintenance Scheduling
- Create and track jobs with priority and status

📊 Dashboard Analytics
- Visual KPIs and charts on fleet maintenance status + Notifications

📱 Responsive Design
- Works seamlessly on desktop, tablet, and mobile

🔐 Demo Credentials
Role	         Email	         Password
Admin	     admin@entnt.in	     admin123
Inspector	inspector@entnt.in	 inspect123
Engineer	engineer@entnt.in	 engine123

⚙️ Setup & Installation
🔧 Prerequisites
Node.js v16 + npm + Git

📥 Installation Steps
Clone the repository
git clone https://github.com/yourusername/ship-maintenance-dashboard.git
cd ship-maintenance-dashboard
Install dependencies
npm install
Start the development server

✅ For Linux/Mac:
npm run dev:frontend
✅ For Windows:
npm install --save-dev cross-env
npm run dev:frontend

🏗️ Application Architecture
🧰 Tech Stack
- Frontend: React 18 + TypeScript
- UI: Tailwind CSS + shadcn/ui (built on Radix UI)
- State Management: React Context API
- Routing: wouter (chosen for its minimal API and small bundle size, ideal for simple projects like this one)
- Forms: react-hook-form + zod
- Storage: localStorage (simulated backend)

📁 Folder Structure

/
├── client/                 # Frontend code
│   └── src/
│       ├── components/     # UI components
│       ├── contexts/       # Global state
│       ├── hooks/          # Custom hooks
│       ├── lib/            # Utils & libraries
│       ├── pages/          # Route pages
│       ├── types/          # TypeScript types
│       └── utils/          # Helper functions
│
├── server/                 # Simulated backend (optional)
│   ├── index.ts            # Entry point
│   └── routes.ts           # Routes mockup
│
└── shared/
    └── schema.ts           # Shared schemas/types
🧠 State Management
The app uses React Context API with the following contexts:
- AuthContext – Authentication state
- ShipsContext – Ship data
- ComponentsContext – Component data
- JobsContext – Maintenance job tracking
- NotificationsContext – In-app alerts

🗃️ All state is persisted using localStorage, simulating a backend experience.

⚠️ Known Limitations
- LocalStorage Persistence: Data is browser-bound and unsynced across devices
- Windows Support: May face environment variable issues
-Browser Compatibility: Tested on modern browsers only
- Dropdown Filters: Limited handling of empty values

⚙️ Technical Highlights
✅ Frontend-Only Stack
- No backend required — great for Netlify/Vercel
- Fast setup and lightweight deployment

✅ Context API vs Redux
- Context API offers built-in, dependency-free state management
- Ideal for small/medium-sized apps without Redux complexity

✅ Why shadcn/ui?
- Headless & accessible components
- Customizable with TailwindCSS
- Based on Radix UI primitives for accessibility

✅ Why wouter instead of React Router?
- Lightweight, minimal routing library
- Smaller bundle size — perfect for small dashboards

✅ Role-Based Security
- Simulates a realistic enterprise-level access control system
- UI & route protection based on user roles

🚀 Future Enhancements
- Backend integration with PostgreSQL or MongoDB
- Real-time updates using WebSockets
- File upload support for maintenance reports
- Enhanced filters and analytics dashboard
