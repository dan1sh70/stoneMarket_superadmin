# Stone Market India — Super Admin Panel

This is the dedicated enterprise administration application for **Stone Market India**, built to manage industrial vendors, stone manufacturers, mining quarries, machine builders, chemical & abrasives suppliers, inquiries, verification, and catalogue operations.

---

## 1. Architecture & Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with Stone Market India Enterprise Design System
  - Navy Primary: `#102B4C`
  - Accent Blue: `#2563EB`
  - Workspace Canvas: `#F3F6FB`
  - Card Surfaces: `#FFFFFF`
  - Borders: `#E1E8F0`
- **Icons**: Lucide React
- **Charting**: Recharts
- **HTTP Client**: Axios with JWT Bearer Interceptors & 401 Session Redirects
- **Routing**: React Router v7 with protected routes

---

## 2. Directory Structure

```text
stone-market-india/
├── backend/                   # Existing Node.js / Express backend
└── superadmin/                # Dedicated Super Admin Panel
    ├── src/
    │   ├── contexts/          # AuthContext with session management
    │   ├── layouts/           # MainLayout (Navy Sidebar, Topbar, User Profile)
    │   ├── pages/             # Dashboard, Users, Businesses, Catalogue, Verification, etc.
    │   ├── services/          # apiClient & superAdminService
    │   ├── types/             # TypeScript definitions matching Mongoose schemas
    │   ├── App.tsx            # Protected Router
    │   ├── main.tsx           # Entry point
    │   └── index.css          # Tailwind CSS styles
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── README.md
```

---

## 3. Installation & Local Development

### Prerequisites
- Node.js >= 18
- Running Stone Market India Backend (`http://localhost:5000`)

### Steps
1. Navigate to the `superadmin` folder:
   ```bash
   cd stone-market-india/superadmin
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL=http://localhost:5000/api`.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Access the Super Admin panel at `http://localhost:5173`.

---

## 4. Production Build

To generate an optimized production bundle:
```bash
npm run build
```
The output will be placed in `superadmin/dist/`.
