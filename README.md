🚢 Ship Maintenance Dashboard
A comprehensive React-based application for managing ship maintenance operations. This dashboard enables maritime organizations to track ships, components, maintenance schedules, and repair jobs—with robust role-based access control.

🔗 Live Demo
👉 Click here to view the deployed app (Replace this with your actual deployment link)

✨ Features
🔐 Role-Based Authentication:

Admin: Full access

Inspector: Can view ships/components/jobs and create inspection jobs

Engineer: Can view assigned jobs and update status

🛳️ Ship Management: Track vessel name, IMO number, flag, and status

⚙️ Component Tracking: Manage components, installation & maintenance dates

🗓️ Maintenance Scheduling: Create and track jobs with priority and status

📊 Dashboard Analytics: Visual KPIs and charts on fleet maintenance status

📱 Responsive Design: Works seamlessly on desktop, tablet, and mobile

🔐 Demo Credentials
Role	Email	Password
Admin	admin@entnt.in	admin123
Inspector	inspector@entnt.in	inspect123
Engineer	engineer@entnt.in	engine123

⚙️ Setup & Installation
🔧 Prerequisites
Node.js v16+

npm

Git

📥 Installation Steps
Clone the repo

bash
Copy
Edit
git clone https://github.com/yourusername/ship-maintenance-dashboard.git
cd ship-maintenance-dashboard
Install dependencies
npm install
Start the development server
npm run dev
If on Windows, ensure cross-env is installed:

npm install --save-dev cross-env
npm run dev
Open the app
Navigate to: http://localhost

Application Architecture
Tech Stack
Frontend: React 18 + TypeScript

UI: Tailwind CSS + shadcn/ui (built on Radix UI)

State: React Context API

Routing: Wouter

Forms: react-hook-form + zod

Storage: localStorage

Folder Structure
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

State Management
The app uses React Context API with the following contexts:

AuthContext – Authentication state

ShipsContext – Ship data

ComponentsContext – Component data

JobsContext – Maintenance job tracking

NotificationsContext – In-app alerts
All state is persisted in localStorage, simulating a backend experience.

- Known Limitations
- LocalStorage Persistence: Data is browser-bound and unsynced across devices
- Windows Support: Some issues with environment vars may arise
- Browser Compatibility: Tested on modern browsers only
-Dropdown Filters: Limited handling of empty values

Technical Highlights
- Frontend-Only Stack
- No backend required—ideal for static hosting like Vercel or Netlify
Fast to set up and deploy

✅ Context API vs Redux
Chose Context API for simplicity
No need for Redux overhead on a small app

✅ Why shadcn/ui?
Headless & accessible
Easy to customize with Tailwind
Built on Radix UI primitives

✅ Role-Based Security
Simulates a real enterprise system
Protects UI and routes by user type

🚀 Future Enhancements
- Backend integration (e.g., PostgreSQL, MongoDB)
- Real-time updates via WebSockets
- File uploads for reports and documentation
- Advanced filtering and analytics
