# Genesis Admin Panel

## Overview
A React + Vite admin dashboard application for Genesis Labs. The application provides a comprehensive admin interface with metrics, financial data, user management, analytics, and system parameters.

## Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter
- **Animation**: Framer Motion

## Project Structure
```
├── client/           # React frontend source
│   ├── src/          # Application source code
│   ├── public/       # Static assets
│   └── index.html    # Entry HTML
├── server/           # Express server (production only)
├── shared/           # Shared types/utilities
├── patches/          # pnpm patches
└── dist/             # Build output
```

## Authentication
The application uses token-based authentication with Laravel Sanctum. Users must configure their Laravel API URL and login with email/password.

### Required Laravel API Endpoints
- `POST /api/login` - Accepts `{email, password}`, returns `{token, user}`
- `GET /api/user` - Returns authenticated user data (requires Bearer token)
- `POST /api/logout` (optional) - Revoke token server-side

### Configuration
Users can configure the API URL via the login page settings. The token is stored in localStorage.

## Development
- Uses pnpm as package manager
- Dev server runs on port 5000 with `npm run dev`
- All hosts are allowed for Replit proxy compatibility

## Building
```bash
npm run build
```
Outputs to `dist/public` for static hosting.

## Deployment
Configured for static deployment from `dist/public` directory.
