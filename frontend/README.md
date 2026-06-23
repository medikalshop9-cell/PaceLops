# PaceLops — Smart Parcel & Queue Management Platform

> A cloud-native, multi-tenant logistics operating platform that digitizes the complete parcel lifecycle for courier companies, branch operators, workers, and customers.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [User Experiences](#user-experiences)
  - [Customer Portal](#1-customer-portal)
  - [Worker Dashboard](#2-worker-dashboard)
  - [Admin Console](#3-admin-console)
- [Platform Capabilities](#platform-capabilities)
  - [Multi-Tenant SaaS](#multi-tenant-saas)
  - [Security & Trust](#security--trust)
  - [Offline-First Design](#offline-first-design)
- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Roadmap](#roadmap)
- [Getting Started](#getting-started)

---

## Overview

**PaceLops** eliminates the chaos of traditional parcel collection. Instead of customers arriving blindly at collection centres and waiting in queues, PaceLops introduces a data-driven, appointment-first logistics experience.

The platform connects every actor in the parcel ecosystem — parcel companies, branch operators, workers, delivery personnel, and end customers — into one unified, real-time system.

### Core Capabilities at a Glance

| Capability | Description |
|---|---|
| Real-time parcel visibility | Live status updates across the entire parcel journey |
| Pickup scheduling | Appointment-based collection to eliminate queues |
| Barcode/QR scanning | Instant parcel registration and scan-event logging |
| Delivery workflows | End-to-end delivery with proof capture |
| Digital payments | Integrated MoMo, Paystack & Hubtel |
| Push & SMS notifications | Event-driven alerts across all channels |
| Analytics & reporting | Operational KPIs, revenue metrics, and daily summaries |
| Offline operations | Scan and operate without internet; auto-sync on reconnect |
| Multi-company infrastructure | Isolated, independently configurable tenants |

---

## Architecture

### Frontend

The entire user-facing platform is built as a **Progressive Web Application (PWA)** using **React.js**, designed desktop-first for workers and admins, with a fully responsive experience for customers.

```
PaceLops Frontend
├── Customer Portal       → Web + PWA (mobile-responsive)
├── Worker Dashboard      → Desktop-first PWA (scan-optimised)
└── Admin Console         → Desktop-first management interface
```

### Deployment Strategy

```
Phase 1 → PWA / Web (current)
Phase 2 → Desktop Operations (Electron wrapper, if needed)
Phase 3 → Native Mobile (Android + iOS)
```

---

## User Experiences

### 1. Customer Portal

Customers interact through a mobile-friendly web interface and PWA.

**Registration & Authentication**
- Phone number or email registration
- OTP verification + optional MFA
- Secure session management with refresh token rotation

**Parcel Tracking**

Customers have full visibility into their parcel's journey:

| State | Description |
|---|---|
| `Pending` | Parcel registered, awaiting intake |
| `In Transit` | Moving between branches or depots |
| `Ready for Pickup` | Available at destination branch |
| `Collected` | Customer collected in person |
| `Delivered` | Home delivery completed |
| `Returned` | Parcel returned to sender |
| `Lost` | Parcel flagged as missing |

**Pickup Scheduling**

Customers book an appointment slot instead of walking in and waiting:

1. View available pickup windows at their branch
2. Select a preferred time slot
3. Receive a booking confirmation + reminder
4. Reschedule or cancel at any time

> The system enforces booking caps per slot to prevent overcrowding and uses historical data to surface recommended off-peak times.

**Home Delivery**

For customers who prefer convenience over collection:
- Request delivery to a chosen address
- Pay delivery fees in-app
- Receive real-time delivery tracking
- Delivery completed with signature capture, proof photo, and timestamped confirmation

**Notifications**

Customers control their own notification preferences:

| Channel | Events |
|---|---|
| SMS | Parcel arrival, status changes, pickup reminders |
| Push | Delivery completion, booking reminders |

**Digital Payments**

All payment flows are embedded and handled within the platform:

| Gateway | Use Case |
|---|---|
| Mobile Money (MoMo) | Primary mobile payment |
| Paystack | Card & bank transfers |
| Hubtel | Local payment aggregation |

Customers can pay delivery fees, view transaction receipts, and request refunds (subject to operational approval workflow).

---

### 2. Worker Dashboard

Workers operate through a fast, scan-optimised dashboard built for speed and simplicity — assuming users may have limited technical experience.

**Parcel Intake**

Upon receiving a parcel, workers:
- Scan the barcode or QR code
- Parcel is automatically registered with full metadata:
  - Sender & receiver details
  - Weight & parcel type
  - Tracking number
  - Assigned branch
  - Intake timestamp and worker identity

**Operational Scanning**

Workers scan parcels at every handoff point:

| Stage | Action |
|---|---|
| Incoming | Log parcel arrival at branch |
| Outgoing | Log parcel dispatch to next leg |
| Pickup | Confirm customer collection |
| Delivery | Confirm handoff to delivery driver |

Every scan creates an immutable audit entry in the parcel's timeline.

**Parcel Search**

Workers can look up any parcel via:
- Tracking number
- Barcode scan
- Customer phone number

**Operational Monitoring**

Workers see a live view of:
- Daily intake volume
- Active pickup queues
- Pending delivery requests
- Recent scan logs

**Offline Operations**

PaceLops is built for environments with unstable internet connectivity:
- Workers continue scanning and operating offline
- All actions are queued locally
- Data automatically synchronises when connectivity is restored — zero data loss

---

### 3. Admin Console

Admins operate through a full management interface with hierarchical role-based access control.

**Authority Levels**

| Role | Scope |
|---|---|
| Super Admin | Full platform access; manages all companies |
| Company Admin | Manages their company's branches, workers, and settings |
| Branch Manager | Manages a single branch and its workers |
| Worker | Operational access only |
| Customer | Self-service portal only |

Each role has strictly scoped access — users see only what they are authorised to see.

**Company & Branch Management**

- Create and configure branches
- Assign and manage workers per branch
- Set branch-level operational settings (opening hours, slot capacity, etc.)

**Analytics & Reporting**

Administrators gain full business visibility through operational dashboards:

*KPI Metrics:*
- Parcel volume (daily, weekly, monthly)
- Queue reduction effectiveness
- Delivery success rates
- Revenue performance

*Generated Reports:*
- Daily operational summaries
- Monthly performance reports
- Custom date-range exports

---

## Platform Capabilities

### Multi-Tenant SaaS

PaceLops is infrastructure, not a single courier app. Multiple independent parcel companies operate on the same platform simultaneously, each with:

- **Data isolation** — strict tenant boundaries at the database level
- **Independent user management** — users belong to a company, not the platform
- **Company branding** — logos, colours, and configuration per tenant
- **Future white-labelling** — custom domains and fully branded experiences

### Security & Trust

Security is a first-class citizen, not an afterthought.

**Authentication**
- Email + password login
- Phone number + OTP login
- Multi-Factor Authentication (MFA)
- Session expiry with refresh token rotation
- "Logout everywhere" session invalidation

**Encryption & Transport**
- TLS 1.3 for all data in transit
- AES-256 for data at rest
- bcrypt / Argon2 for password hashing

**Application Security**
- JWT-based session tokens with rotation
- Rate limiting on all public endpoints
- Least-privilege access model (RBAC)
- Full audit trail for all sensitive actions

**Audited Events**
- Login attempts (success and failure)
- Parcel scans and status changes
- Payment transactions
- Data exports

### Offline-First Design

PaceLops is designed for the realities of logistics operations — power cuts, poor connectivity, and high-throughput environments. The offline-first architecture ensures branch operations never stop due to network issues.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React.js |
| Build Tool | Vite |
| Styling | CSS Modules / Vanilla CSS |
| State Management | Zustand + React Query |
| PWA | vite-plugin-pwa |
| Payment Integrations | Paystack SDK, Hubtel API, MoMo API |
| Notifications | Firebase Cloud Messaging (Push), Africa's Talking (SMS) |
| Auth | JWT + OTP + MFA |
| Linting | ESLint + Prettier |

---

## Design Philosophy

PaceLops is designed as a **Web + Desktop-first** logistics operating platform, with mobile introduced later as an extension layer — not the foundation.

**Core Principles**

- **PWA-first** — installable, offline-capable, app-like experience from a browser
- **Desktop-first operations** — workers and admins operate on screens optimised for productivity
- **Responsive customer experience** — customers access the portal from any device
- **Offline-first capabilities** — operations continue without internet
- **Low-bandwidth optimisation** — built for real-world network conditions
- **Fast scanning workflows** — sub-second scan-to-log operations for workers
- **Cross-platform access** — any modern browser, any OS

---

## Roadmap

### Phase 1 — Web / PWA *(Current)*
- [ ] Core parcel tracking
- [ ] Pickup scheduling system
- [ ] Worker scan interface
- [ ] Admin dashboard & RBAC
- [ ] Payment integrations
- [ ] Push & SMS notifications
- [ ] Offline sync

### Phase 2 — Desktop Operations *(Planned)*
- [ ] Electron desktop wrapper for branch workers
- [ ] Local DB sync engine (SQLite + background sync)
- [ ] Dedicated branch manager tools

### Phase 3 — Native Mobile *(Future)*
- [ ] Native Android application
- [ ] Native iOS application
- [ ] Expanded mobile worker tools
- [ ] Dedicated customer mobile app

**Delivery sequence:** `PWA/Web → Desktop Operations → Native Mobile`

---

## Getting Started

### Prerequisites

- Node.js `>=18.x`
- npm `>=9.x` or pnpm `>=8.x`

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/pacelops-frontend.git
cd pacelops-frontend/frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

---

*PaceLops — Turning parcel chaos into operational clarity.*