---
name: pacelops-frontend
description: >
  Full-stack frontend development skill for the PaceLops platform — a cloud-native,
  multi-tenant parcel & queue management PWA. Covers component architecture, state
  management, routing, payment integrations, offline-first patterns, role-based UI,
  barcode scanning, real-time notifications, and Vite/React project conventions.
---

# PaceLops Frontend — Development Skill

## Project Context

PaceLops is a **Progressive Web Application (PWA)** built with React.js and Vite. It serves three distinct user experiences from a single codebase:

| Interface | Primary Users | Device Target |
|---|---|---|
| Customer Portal | End customers | Mobile + desktop |
| Worker Dashboard | Branch workers | Desktop-first (scan-optimised) |
| Admin Console | Admins, branch managers | Desktop |

All interfaces share a common auth layer, design system, and API client. Role-based routing enforces strict view isolation between user types.

---

## Project Structure

```
frontend/
├── public/                    # Static assets, PWA manifest, service worker
├── src/
│   ├── assets/                # Images, icons, fonts
│   ├── components/            # Shared/reusable UI components
│   │   ├── ui/                # Base components (Button, Input, Badge, Modal…)
│   │   ├── layout/            # Shell, Sidebar, Topbar, PageWrapper
│   │   └── shared/            # Cross-feature components (ParcelStatusBadge, etc.)
│   ├── features/              # Feature-scoped modules (co-locate component + logic)
│   │   ├── auth/              # Login, registration, OTP, MFA
│   │   ├── tracking/          # Parcel status, timeline, scan history
│   │   ├── scheduling/        # Pickup slot booking and calendar
│   │   ├── delivery/          # Delivery request, proof capture
│   │   ├── payments/          # Paystack, MoMo, Hubtel flows
│   │   ├── notifications/     # Push and SMS preferences
│   │   ├── scanning/          # Barcode/QR scanner, intake forms
│   │   ├── worker/            # Worker dashboard and operational views
│   │   └── admin/             # Admin console, analytics, company management
│   ├── hooks/                 # Custom React hooks (useScanner, useOfflineQueue…)
│   ├── lib/                   # Third-party wrappers (axios instance, firebase, etc.)
│   ├── pages/                 # Route-level page components
│   ├── router/                # React Router config + route guards
│   ├── store/                 # Zustand global stores
│   ├── styles/                # Global CSS, design tokens, CSS variables
│   └── utils/                 # Pure utility functions
├── .env.example
├── index.html
├── vite.config.js
└── package.json
```

---

## Tech Stack & Tooling

| Concern | Tool / Library |
|---|---|
| Framework | React 18 |
| Build | Vite 5 |
| Routing | React Router v6 |
| Server state | TanStack Query (React Query) v5 |
| Client state | Zustand |
| Styling | Vanilla CSS + CSS Modules (no Tailwind) |
| PWA | vite-plugin-pwa + Workbox |
| Forms | React Hook Form + Zod |
| Barcode scanning | `@zxing/browser` or `html5-qrcode` |
| Payments | Paystack JS, Hubtel API, MoMo REST |
| Notifications | Firebase Cloud Messaging (push), Africa's Talking (SMS) |
| HTTP client | Axios (with interceptors for auth + tenant headers) |
| Auth | JWT + refresh token rotation; OTP via SMS |
| Linting | ESLint (with `eslint-plugin-react`, `eslint-plugin-react-hooks`) |
| Formatting | Prettier |
| Testing | Vitest + React Testing Library |

---

## Architecture Conventions

### File Naming
- Components: `PascalCase.jsx`
- Hooks: `camelCase.js` prefixed with `use`
- Utilities: `camelCase.js`
- Styles: `ComponentName.module.css` co-located with component

### Feature Module Pattern
Each feature under `src/features/` follows this structure:
```
features/tracking/
├── components/       # Feature-local components
├── hooks/            # Feature-local hooks
├── api.js            # API calls (using axios instance)
├── store.js          # Zustand slice (if feature needs client state)
└── index.js          # Public exports for this feature
```

### API Layer
- All HTTP calls go through `src/lib/axios.js` — a configured Axios instance with:
  - Base URL from `VITE_API_BASE_URL`
  - Auth token injection via request interceptor
  - Token refresh on 401 via response interceptor
  - Tenant ID header injection

### Role-Based Routing
- Routes are protected by a `<RoleGuard role="worker" />` wrapper
- Unauthenticated users are redirected to `/login`
- Unauthorised roles are redirected to their respective home route
- Role is derived from the decoded JWT payload

### State Management
- **Server state** (API data, parcel lists, slots): TanStack Query
- **Client/UI state** (sidebar open, modal state, user preferences): Zustand
- **Form state**: React Hook Form — do not use Zustand or useState for forms

### Offline Queue
- Scan events and parcel operations are queued in IndexedDB when offline
- `useOfflineQueue` hook wraps this logic and auto-flushes on reconnect
- Use `navigator.onLine` + the `online` event for detection

---

## Design System

### CSS Variables (Design Tokens)
Define all tokens in `src/styles/tokens.css`:
```css
:root {
  --color-primary: hsl(220, 90%, 56%);
  --color-surface: hsl(220, 15%, 10%);
  --color-text: hsl(0, 0%, 95%);
  --radius-md: 8px;
  --shadow-card: 0 4px 24px hsla(0, 0%, 0%, 0.3);
  /* ... */
}
```

### Component Principles
- All UI primitives live in `src/components/ui/`
- No ad-hoc inline styles — use CSS Modules
- Dark mode is the default; light mode is opt-in via a CSS class on `<html>`
- All interactive elements must have unique `id` attributes for accessibility and testing

---

## Key Development Patterns

### Parcel Status Badge
Always use the shared `<ParcelStatusBadge status="in_transit" />` component — never hardcode status colours inline.

### Scanner Integration
Use the `useScanner` hook which wraps `@zxing/browser`. It handles camera permissions, error states, and returns scan results via a callback. Do not instantiate the scanner directly in components.

### Payment Flows
Each payment gateway has its own isolated component under `features/payments/`. Never mix gateway logic. Paystack uses their official JS library via script injection; Hubtel and MoMo use REST calls through the backend API.

### Notifications
- Push notification permission is requested once after login, not on page load
- Firebase SDK is initialised lazily in `src/lib/firebase.js`
- SMS preferences are managed server-side; the frontend only exposes toggle UI

---

## Environment Variables

All env vars must be prefixed with `VITE_` to be exposed to the browser:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

Never commit `.env`. Only `.env.example` should be committed with placeholder values.

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run linter
npm run lint

# Run formatter
npm run format

# Run tests
npm run test

# Build for production
npm run build
```

---

## PWA Configuration

The service worker is managed by `vite-plugin-pwa` using Workbox. Key strategies:
- **Static assets**: CacheFirst
- **API responses**: NetworkFirst with offline fallback
- **Scan queue**: IndexedDB persistence (never cached by service worker)

The PWA manifest is in `public/manifest.json`. Icons should be provided in 192x192 and 512x512 PNG.

---

## Multi-Tenant Considerations

- The active company/tenant context is stored in Zustand after login
- All API requests include an `X-Tenant-ID` header injected by the Axios interceptor
- Company branding (logo, primary colour) is fetched on login and applied as CSS variables
- Never hardcode company-specific content in components

---

## Do's and Don'ts

### Do
- Co-locate feature logic with its components inside `features/`
- Use React Query for all server data — no manual `useEffect` + `fetch` patterns
- Validate all form inputs with Zod schemas before submission
- Test components with React Testing Library, not enzyme or direct DOM queries
- Keep components under 200 lines; extract logic into custom hooks

### Don't
- Don't use `any` TypeScript types (if TS is introduced later)
- Don't call APIs directly from components — always go through the feature `api.js`
- Don't store sensitive data (tokens, keys) in localStorage — use httpOnly cookies or memory
- Don't skip loading and error states in any data-fetching component
- Don't use `index.js` exports for pages — keep them explicit for code splitting
