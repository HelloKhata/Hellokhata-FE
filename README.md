<div align="center">

# 🏪 HelloKhata (হ্যালো খাতা)
### Enterprise-Grade, AI-Powered Retail Operating System & ERP for South Asian SMEs

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/State-Zustand_v5-4338CA?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![Port](https://img.shields.io/badge/Dev_Port-8200-0E5B43?style=for-the-badge)](http://localhost:8200)

**HelloKhata** is an enterprise-ready retail operating system and cloud ERP engineered specifically for modern merchants, wholesalers, and multi-branch retail enterprises across Bangladesh and South Asia. Combining full-spectrum double-entry financial accounting, multi-warehouse batch inventory tracking, an ultra-responsive POS terminal, and a state-machine driven conversational AI engine with native Bengali voice recognition, HelloKhata elevates daily shop floor operations into data-driven commerce.

[✨ Core Capabilities](#-core-capabilities) • [🏛️ System Architecture](#️-system-architecture) • [📦 Feature Modules](#-feature-modules) • [🤖 AI & Voice Engine](#-ai-and-voice-engine) • [🎨 Design System](#-design-system) • [🚀 Getting Started](#-getting-started) • [⚙️ Configuration](#️-configuration)

---

</div>

## 📑 Table of Contents

- [Executive Summary](#-executive-summary)
- [Core Capabilities](#-core-capabilities)
- [System Architecture](#️-system-architecture)
- [Deep-Dive Feature Modules](#-deep-dive-feature-modules)
  - [1. Point of Sale (POS) & Sales Management](#1-point-of-sale-pos--sales-management)
  - [2. Inventory & Multi-Warehouse Supply Chain](#2-inventory--multi-warehouse-supply-chain)
  - [3. Digital Khata & Parties (Credit Control)](#3-digital-khata--parties-credit-control)
  - [4. Double-Entry Accounting & Financial Hub](#4-double-entry-accounting--financial-hub)
  - [5. HRM & Granular Role-Based Access Control](#5-hrm--granular-role-based-access-control)
  - [6. BI Analytics & Reporting Suite](#6-bi-analytics--reporting-suite)
- [AI & Voice Engine Architecture](#-ai-and-voice-engine-architecture)
  - [Voice Recognition (Bangla + English)](#voice-recognition-bangla--english)
  - [AI Copilot Drawer](#ai-copilot-drawer)
  - [Autonomous AI v2 Agent State Machine](#autonomous-ai-v2-agent-state-machine)
- [Design System & UI Architecture](#-design-system--ui-architecture)
- [Project Directory Structure](#-project-directory-structure)
- [State Management & Data Layer](#-state-management--data-layer)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts & Production Deployment](#-scripts--production-deployment)
- [Enterprise Feature Tiers](#-enterprise-feature-tiers)
- [Security & Resilience](#-security--resilience)

---

## 🌟 Executive Summary

Traditional point-of-sale and accounting tools in emerging markets remain fragmented, desktop-bound, or poorly adapted to local commerce behaviors (such as customer credit "baki/khata", multi-channel mobile payments, and bilingual merchant workflows). 

**HelloKhata** solves this by delivering an end-to-end, high-performance web platform designed with:

1. **Bilingual-First Ergonomics:** Full native English and Bengali (`বাংলা`) localization across every dashboard widget, data grid, invoice template, and modal.
2. **Persistent Multi-Branch Orchestration:** Effortless switching between physical retail counters, wholesale divisions, and regional distribution warehouses with real-time stock transfer workflows.
3. **Voice-Activated Intelligence:** Direct voice recognition enabling merchants to trigger complex queries (*"কম স্টক পণ্য দেখাও"*, *"Show me today's receivables"*) and generate actions hands-free.
4. **Resilient Network Performance:** Optimistic UI state updates, offline mutation queuing, and proactive token refresh interceptors engineered for varying network conditions.

---

## ✨ Core Capabilities

| Capability | Engineering Highlights | Business Impact |
|---|---|---|
| **High-Throughput POS** | Sub-100ms item search, barcode reader integration, live stock validations, split-tender checkout (Cash, Bank, bKash, Nagad). | Minimizes counter queue times and eliminates stock discrepancy at point of sale. |
| **Batch & Expiry Control** | FIFO stock movement, lot/batch assignment, automatic expiry alerts, inter-warehouse transfers. | Prevents perishable stock losses and ensures traceability in pharmaceutical, FMCG, and electronics retail. |
| **Digital Credit Khata** | Aging bucketing (0-30, 31-60, 61-90, 90+ days), credit limits, risk scoring, SMS reminders. | Accelerates receivables collection, prevents bad debts, and maintains healthy working capital. |
| **Double-Entry Accounting** | Comprehensive General Ledger, Preliminary P&L, Trial Balance, Cash/Bank Books, VAT/Tax management. | Provides real-time financial clarity without waiting for end-of-month manual auditing. |
| **Agentic AI Copilot (v1/v2)** | Transactional state-machine supporting pending action approvals, contextual suggestions, and voice interactions. | Delivers automated business oversight, identifying margin leakage and inventory bottlenecks automatically. |

---

## 🏛️ System Architecture

HelloKhata is architected as an **API-decoupled Single Page Application (SPA)** utilizing Next.js 16 App Router for client-side rendering and client routing, backed by an external high-performance RESTful API microservice suite.

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT RUNTIME (BROWSER)                                 │
│                                                                                         │
│  ┌─────────────────────── Next.js 16 (App Router) + React 19 ────────────────────────┐  │
│  │                                                                                   │  │
│  │   ┌────────────────────┐   ┌────────────────────┐   ┌─────────────────────────┐   │  │
│  │   │   App Route Tree   │   │  Radix UI Primitives│  │   AI Copilot & Voice    │   │  │
│  │   │  (POS, Sales, Fin, │   │  Tailwind CSS v4   │  │  (Web Speech Recognition│   │  │
│  │   │   HRM, Inventory)  │   │  Executive Themes  │  │   State Machine Client) │   │  │
│  │   └─────────┬──────────┘   └─────────┬──────────┘   └───────────┬─────────────┘   │  │
│  │             │                        │                          │                 │  │
│  │             ▼                        ▼                          ▼                 │  │
│  │   ┌───────────────────────────────────────────────────────────────────────────┐   │  │
│  │   │                       CLIENT STATE & CACHING LAYER                        │   │  │
│  │   │                                                                           │   │  │
│  │   │  • Zustand Stores: sessionStore, uiStore, branchStore, featureGateStore   │   │  │
│  │   │  • TanStack React Query v5: Cache invalidation, queries, optimistic muts │   │  │
│  │   └─────────────────────────────────────┬─────────────────────────────────────┘   │  │
│  │                                         │                                         │  │
│  │                                         ▼                                         │  │
│  │   ┌───────────────────────────────────────────────────────────────────────────┐   │  │
│  │   │                     SECURE AXIOS TRANSPORT INTERCEPTOR                    │   │  │
│  │   │                                                                           │   │  │
│  │   │  • BaseURL routing (NEXT_PUBLIC_API_URL)                                  │   │  │
│  │   │  • withCredentials: true (HttpOnly session cookies)                       │   │  │
│  │   │  • 401 Interceptor: Automated queueing + /api/auth/refresh retry loop     │   │  │
│  │   └─────────────────────────────────────┬─────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────┼─────────────────────────────────────────┘  │
└────────────────────────────────────────────┼────────────────────────────────────────────┘
                                             │ HTTPS REST + Streaming SSE
                                             ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                REMOTE ERP BACKEND API                                   │
│                     (https://voiceerp.mapleitfirm.com / External)                       │
│                                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  Auth & RBAC     │  │  POS & Inventory │  │ General Ledger & │  │  AI Reasoning & │  │
│  │  Session Refresh │  │  Batch Engine    │  │ Financial Hub    │  │  Voice Backend  │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Deep-Dive Feature Modules

### 1. Point of Sale (POS) & Sales Management
- **High-Velocity POS Terminal (`/sales/new`):** Optimized for touchscreens, desktop keyboards, and barcode readers. Features instant product lookups, live unit price adaptation, tax category additions, and discount allocations.
- **Sales Invoicing & Ledger Entries (`/sales`):** Generates compliant thermal receipts and full-page PDF invoices with customizable headers, branding, and QR/barcode tracking.
- **Quotations to Invoice Pipeline (`/sales/quotations`):** Drafts customer estimates with configurable expiration dates, convertible to realized sales in a single click.
- **Sales Returns & Restocking (`/sales/returns`):** Granular return processing that restores inventory counts to specific branches/warehouses while calculating cash refunds or account credit adjustments.
- **Payment-In Vouchers (`/sales/payment-in`):** Logs partial or full counter settlements with direct mapping to accounts receivable.

### 2. Inventory & Multi-Warehouse Supply Chain
- **Master Catalog & Variant Matrix (`/inventory`):** Supports item categorization, primary/secondary units of measure, tax classifications, and multi-tier pricing (Retail, Wholesale, Special).
- **Batch & Serial Lifecycle (`/inventory/batches`):** Complete traceability for lot numbers, manufacturing timestamps, and expiration thresholds.
- **Warehouse Logistics (`/inventory/warehouse`):** Define unlimited regional warehouses and physical branches with distinct managerial ownership and stock allocations.
- **Inter-Branch Stock Transfers (`/inventory/stock-transfer`):** Multi-stage transfer management (Initiated → In Transit → Received & Verified) ensuring no shrinkage occurs between dispatch and receipt.
- **Stock Reconciliations & Adjustments (`/inventory/stock-adjustment`):** Accommodates audit variances, breakage, shrinkage, and surplus discoveries with mandatory reason-logging.

### 3. Digital Khata & Parties (Credit Control)
- **Comprehensive CRM Hub (`/parties`):** Unified customer and supplier registries tracking contact profiles, billing addresses, credit limits, and current balances.
- **Aging Analysis Engine:** Segregates outstanding credit into risk-based aging buckets (`0–30 days`, `31–60 days`, `61–90 days`, `90+ days`), highlighting high-exposure accounts.
- **Direct Settlement Vouchers (`/parties/payment-in`, `/parties/payment-out`):** Simplifies party reconciliations with multi-invoice allocation and automated payment receipts.

### 4. Double-Entry Accounting & Financial Hub
- **Unified Finance Dashboard (`/finance/overview`):** Live KPI cards tracking gross revenue, cost of goods sold, operating expenditures, net margin, and working capital.
- **Comprehensive Ledger & Transaction Log (`/finance/transactions`):** Complete chronological audit trail for every cash, bank, and ledger movement across all accounts.
- **Income & Expense Tracking (`/finance/income`, `/finance/expenses`):** Categorized operational expenditure (OPEX) and miscellaneous revenue entries with branch tagging and receipt attachments.
- **Bank & Digital Wallet Vault (`/finance/banks`):** Native tracking of conventional bank accounts alongside Bangladeshi Mobile Financial Services (bKash, Nagad, Rocket, Upay) with automated transfer logging.
- **Receivables & Payables Ledgers (`/finance/receivables`, `/finance/payables`):** Instant balance tracking against debtors and creditors.

### 5. HRM & Granular Role-Based Access Control
- **Employee Directory (`/hrm/employees`):** Centralized employee records including designation, contact credentials, department assignments, and salary baselines.
- **Roles & Permissions Matrix (`/hrm/roles-permissions`):** Fine-grained permission assignments defining access policies across POS terminals, report exports, financial adjustments, and administrative settings.

### 6. BI Analytics & Reporting Suite
- **Inventory Health & Stock Valuation (`/reports/inventory`):** Real-time stock audit engine featuring instant status filtering (`All`, `In Stock`, `Low Stock`, `Out of Stock`), category breakdown, branch scoping, and automated client-side CSV/Excel spreadsheet generation.
- **Financial Statements Hub (`/reports/finance`):**
  - Preliminary Profit & Loss (P&L) statements with gross and operating margin breakdowns.
  - Cash & Bank flow statements.
  - Receivables and Payables aging summaries.
  - Multi-range date filters (Today, This Week, This Month, This Quarter, Custom Ranges).
- **Sales & Purchase Performance Reports (`/reports/sales`, `/reports/purchase`):** Granular analytical views analyzing revenue trends, top-selling SKUs, margin performance, and supplier purchase volume.

---

## 🤖 AI and Voice Engine Architecture

HelloKhata features an integrated Artificial Intelligence engine tailored for rapid retail execution.

### Voice Recognition (Bangla + English)
Integrated directly via `VoiceModal.tsx` and the Web Speech API:
- Native parsing of Bengali speech (e.g., *"আজকের বিক্রি কত?"*, *"কম স্টক পণ্য দেখাও"*).
- Visual live audio waveform feedback during active speech capture.
- Intelligent intent extraction mapping directly to application filters and routing parameters.

### AI Copilot Drawer
Accessible across the application via `AIDrawer.tsx` (Hotkey: `Ctrl+\`):
- **Executive Daily Brief:** AI-synthesized morning rundown identifying critical action items, revenue pace, and immediate risks.
- **Natural Language Data Inquiries:** Ask direct questions regarding gross margins, slow-moving inventory, and pending collections.
- **Suggested Playbooks:** Actionable operational recommendations (e.g., clearance discount triggers for 90-day dead stock).

### Autonomous AI v2 Agent State Machine
Under `NEXT_PUBLIC_AI_V2_ENABLED`, HelloKhata activates the next-generation transactional AI client (`src/services/ai-v2.state-client.ts`):
- **State-Driven Workflow:** Governed by explicit states (`IDLE`, `LISTENING`, `PROMPT_BUILDING`, `EXECUTING`, `PENDING_ACTION`, `CONFIRMING`, `RECOVERING`).
- **Human-in-the-Loop Safeguards:** Any irreversible action (creating a bulk draft invoice, approving stock write-offs) generates a signed `PendingAction` contract requiring explicit merchant confirmation.
- **Stateful Crash Recovery:** Preserves client request tokens across network disruptions, preventing duplicate operations or severed workflows.

---

## 🎨 Design System

HelloKhata utilizes a custom-engineered **Elite SaaS Design System** implemented in [src/app/globals.css](file:///e:/Projects/Hellokhata-FE/src/app/globals.css) with Tailwind CSS v4 and modern CSS variables.

### Themes & Color Palettes

#### 🌙 Dark Theme (Default — Cinematic Executive)
Engineered for low eyestrain during prolonged operational hours:
- **Base Background:** `#0B0F19` (Cinematic Midnight Navy)
- **Secondary Surfaces & Cards:** `#0D131F` / `#111827`
- **Primary Brand Accent:** `#0E5B43` (Deep Pine Green)
- **Financial Metric Accent:** `#0FBF9F` (Vibrant Emerald / Teal)
- **Borders & Separators:** `rgba(51, 65, 85, 0.6)`
- **Typography:** `#F1F5F9` (Primary), `#94A3B8` (Muted)

#### ☀️ Light Theme (Modern High-Contrast Executive)
Crisp, editorial, and warm:
- **Base Background:** `#F6F1E5` (Warm Cream)
- **Secondary Surfaces & Cards:** `#EDE7D8` / `#FFFFFF`
- **Primary Brand Accent:** `#0E5B43` (Pine Green)
- **Financial Metric Accent:** `#059669` (Emerald Green)
- **Text & Contrast:** High-contrast `#0F172A` with `#64748B` muted accents.

---

## 📁 Project Directory Structure

```
Hellokhata-FE/
├── public/                       # Static assets, branding icons, manifests
├── src/
│   ├── app/                      # Next.js 16 App Router hierarchy
│   │   ├── (auth)/               # Authentication routing group
│   │   │   ├── login/            # Merchant credentials login
│   │   │   ├── register/         # Merchant onboarding
│   │   │   ├── forgot-password/  # Password reset initiation
│   │   │   └── verify-otp/       # Multi-factor / SMS OTP verification
│   │   ├── (dashboard)/          # Authenticated ERP workspace
│   │   │   ├── page.tsx          # Executive Command Center Dashboard
│   │   │   ├── ai/               # Dedicated AI Hub & V2 Agent Workspace
│   │   │   ├── sales/            # POS Terminal, Invoices, Quotations, Returns
│   │   │   ├── purchases/        # Purchase Orders, Bills, Vendor Returns
│   │   │   ├── inventory/        # Catalog, Batches, Warehouses, Adjustments
│   │   │   ├── parties/          # Customers, Suppliers, Khata Ledgers
│   │   │   ├── finance/          # Transactions, Income, Expense, Banks, Vault
│   │   │   ├── hrm/              # Employees, Payroll, Permissions Matrix
│   │   │   ├── reports/          # Inventory, Finance, Sales, Purchases BI
│   │   │   ├── reminders/        # Due date and debt collection reminders
│   │   │   ├── plans/            # Subscription tier management
│   │   │   └── settings/         # Business profiles, branches, invoice layout
│   │   ├── globals.css           # Tailwind v4 theme tokens & custom utilities
│   │   └── layout.tsx            # Root application layout & font loader
│   ├── components/               # Modular UI component architecture
│   │   ├── ai/                   # AI Drawer, Voice Modal, V2 Chat components
│   │   ├── common/               # PageHeader, Table wrappers, Modals, Loaders
│   │   ├── finance/              # Financial stat cards, ledger grids
│   │   ├── inventory/            # Barcode cards, batch selectors, stock forms
│   │   ├── layout/               # Header, Sidebar, BranchSwitcher, CommandPalette
│   │   ├── reports/              # Interactive chart widgets, tabbed hubs
│   │   └── ui/                   # Radix UI primitives & custom UI elements
│   ├── hooks/
│   │   ├── api/                  # TanStack React Query wrappers (26+ hooks)
│   │   ├── useAppTranslation.ts  # Native Bengali/English localization hook
│   │   └── use-toast.ts          # Reactive toast dispatcher
│   ├── lib/
│   │   ├── api-url.ts            # Base API URL resolvers
│   │   ├── axios.ts              # Axios instance with 401 refresh interceptor
│   │   ├── nav-config.ts         # Navigation taxonomy & permission routes
│   │   └── utils.ts              # Class merging (`cn`) & formatting helpers
│   ├── services/                 # Pure async HTTP client functions (Axios)
│   ├── stores/                   # Zustand global stores (Session, UI, Branch, Gate)
│   └── types/                    # Enterprise TypeScript contracts & schemas
├── .env                          # Local environment variables
├── next.config.ts                # Next.js compiler & deployment configurations
├── package.json                  # Scripts, engine definitions, dependencies
└── tsconfig.json                 # Strict TypeScript configuration
```

---

## ⚡ State Management & Data Layer

HelloKhata strictly bifurcates state into **Server State** and **Client State**:

### 1. Server State (TanStack React Query v5)
- All network interactions originate in `/src/services/*.ts` as pure async functions and are consumed via `/src/hooks/api/use*.ts`.
- Structured query keys (e.g., `['items', branchId]`, `['transactions', dateRange]`) enable precise cache invalidation on mutations.
- Features automatic background revalidation, stale-while-revalidate data freshness, and optimistic UI transitions.

### 2. Client & Session State (Zustand v5)
- **`sessionStore.ts`:** Manages user profile, active business configuration, authentication state, and token lifecycle.
- **`branchStore.ts`:** Tracks the globally active branch/warehouse context, ensuring all data fetching is automatically scoped.
- **`uiStore.ts`:** Controls theme toggling (`light` / `dark`), sidebar expansion, and modal visibility.
- **`featureGateStore.ts`:** Enforces entitlement boundaries based on active subscription tier.

### 3. Resilient HTTP Interceptors (`src/lib/axios.ts`)
```typescript
// Automatic Silent Refresh Interceptor
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Queues concurrent requests while /api/auth/refresh executes
      await executeTokenRefresh();
      return client(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `v20.x` or higher (LTS recommended)
- **Package Manager:** `npm` (v10+) or `bun` / `pnpm`
- **Backend API:** An active HelloKhata / VoiceERP backend instance

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Maple-Service-Solution-Ltd/hellokhata.git
   cd hellokhata
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the project root:
   ```env
   # Remote ERP Backend API base URL (must include /api prefix or trailing slash)
   NEXT_PUBLIC_API_URL=https://voiceerp.mapleitfirm.com/

   # AI Copilot Feature Flags
   NEXT_PUBLIC_AI_ENABLED=true
   NEXT_PUBLIC_AI_V2_ENABLED=false
   ```

4. **Launch Local Development Server:**
   ```bash
   npm run dev
   ```
   The development server starts on **port 8200**:
   👉 Open [http://localhost:8200](http://localhost:8200) in your browser.

---

## ⚙️ Configuration

### Key Environment Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | String | `https://voiceerp.mapleitfirm.com/` | Fully qualified base URL of the remote ERP backend API. |
| `NEXT_PUBLIC_AI_ENABLED` | Boolean | `false` | Enables the v1 AI Copilot drawer and Voice Modal. |
| `NEXT_PUBLIC_AI_V2_ENABLED` | Boolean | `false` | Enables the transactional AI v2 Agent state machine client. |

---

## 🛠️ Scripts & Production Deployment

### Available NPM Scripts

```bash
# Start development server on port 8200
npm run dev

# Run static TypeScript and Next.js production build
npm run build

# Start production server on port 8200
npm run start

# Run ESLint validation across codebase
npm run lint
```

### Production Deployment (PM2 / Linux Server)

HelloKhata is preconfigured to bind to port **8200**. For production deployment with PM2:

```bash
# 1. Build optimized bundle
npm run build

# 2. Launch with PM2 process manager
pm2 start npm --name "hellokhata-fe" -- run start

# 3. Configure automated startup
pm2 save
pm2 startup
```

---

## 💎 Enterprise Feature Tiers

Subscription access is governed by `src/stores/featureGateStore.ts`:

| Feature Set | Free (৳0) | Starter | Growth | Intelligence (Pro) |
|---|:---:|:---:|:---:|:---:|
| **POS & Quick Sales** | ✅ Included | ✅ Included | ✅ Included | ✅ Included |
| **Catalog & Basic Items** | Up to 100 SKUs | Unlimited | Unlimited | Unlimited |
| **Data Export (CSV / Excel)** | ❌ | ✅ Included | ✅ Included | ✅ Included |
| **Dead Stock & Aging Alerts** | ❌ | ✅ Included | ✅ Included | ✅ Included |
| **Multi-Branch Operations** | 1 Branch | 1 Branch | Up to 5 Branches | Unlimited |
| **Batch & Expiry Logistics** | ❌ | ❌ | ✅ Included | ✅ Included |
| **Voice AI Recognition** | ❌ | ❌ | Basic Queries | Full Autonomous Copilot |
| **Agentic AI v2 Assistant** | ❌ | ❌ | ❌ | ✅ Included |

---

## 🔒 Security & Resilience

- **HttpOnly Cookie Authentication:** Session tokens are secured via `withCredentials: true`, safeguarding authentication credentials from client-side script inspection.
- **Automatic Token Rotation:** Silent 401 refresh interception ensures zero session disruption for active floor staff during cashier shifts.
- **Client-Side Safe Parsing:** Form submissions and query parameters are validated with `Zod` and `Ajv` to prevent unexpected input states.
- **Bilingual Fault Tolerance:** Missing translation tokens automatically fall back to standardized English strings, guaranteeing zero blank labels or interface disruption.

---

<div align="center">

**Built with pride by Maple Service Solution Ltd.**  
*Empowering South Asian Retailers with Modern, Intelligent Commerce Systems.*

</div>
