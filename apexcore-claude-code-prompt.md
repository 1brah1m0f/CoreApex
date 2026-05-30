# ApexCore — UI Overhaul & Full Functionality Prompt

## Project Overview
ApexCore is a web platform for managing district-level civic issues. There are 3 roles:
- **Citizen** — submits problem reports, proposes ideas, tracks government alerts
- **Inspector** — field officer who executes assigned tasks
- **Executive** — manager who monitors analytics, creates tasks, publishes announcements

---

## Task

Do the following:

### 1. UI Redesign (Clean government portal look — similar to idda.az / myGov.az style)

**Color Palette:**
```css
--primary: #1A3C6E;        /* deep government blue */
--primary-light: #2557A7;  /* hover state */
--accent: #E8A020;         /* yellow-orange highlight */
--bg: #F4F6FA;             /* light gray background */
--surface: #FFFFFF;        /* card background */
--text-main: #1A1F2E;      /* primary text */
--text-muted: #6B7280;     /* secondary text */
--success: #16A34A;
--warning: #D97706;
--danger: #DC2626;
--border: #E2E8F0;
```

**Typography:**
- Headings: `'Montserrat', sans-serif` (bold, 700)
- Body text: `'Source Sans 3', sans-serif`
- Import both from Google Fonts

**Component Styles:**
- Cards: `border-radius: 12px`, subtle shadow (`box-shadow: 0 2px 8px rgba(0,0,0,0.08)`), white background
- Buttons: `border-radius: 8px`, solid primary color, hover → `primary-light`
- Sidebar/Nav: dark `#1A3C6E` background, white icons and text
- Status badges: colored pill shape (`pending` → yellow, `inprogress` → blue, `resolved` → green, `overdue` → red)
- Input fields: `border: 1px solid var(--border)`, focus → `primary` colored outline
- Tables: zebra striping (`#F8FAFC` alternate rows), hover row highlight
- Header: white background with a thin `primary` colored bottom border

**General Layout:**
- Fixed left sidebar (250px wide), main content on the right
- Responsive: sidebar collapses to hamburger menu on mobile
- Dashboard cards in 2×2 or 4-column grid
- Breadcrumb at the top of each page

---

### 2. Make All Buttons Functional

Every interaction below must be wired to a real API call. **API base URL: `/api/v1`**. All `fetch` calls go to these endpoints — no mock or hardcoded data remains:

#### 🟦 CITIZEN DASHBOARD
| Button / Action | API Endpoint |
|---|---|
| Login (SİMA / Asan / Phone) | `POST /auth/login/citizen` |
| Send OTP | `POST /auth/otp/send` |
| Verify OTP | `POST /auth/otp/verify` |
| Submit Report | `POST /reports` |
| Upload Photo → AI category | `POST /reports/ai-classify` |
| My Reports list | `GET /reports/mine` |
| Proposals list | `GET /proposals` |
| New Proposal | `POST /proposals` |
| Vote / Unvote | `POST /proposals/{id}/vote` |
| Alerts | `GET /alerts` |

#### 🟧 INSPECTOR DASHBOARD
| Button / Action | API Endpoint |
|---|---|
| Login | `POST /auth/login/staff` |
| My Tasks | `GET /tasks/mine` |
| Task Detail | `GET /tasks/{id}` |
| Mark as Resolved | `PATCH /tasks/{id}/status` |
| Upload Proof Photo | `POST /tasks/{id}/proof` |
| Update Report Status | `PATCH /reports/{id}/status` |
| Load Simulation Layers | `GET /simulation/layers` |
| Run Simulation | `POST /simulation/run` |
| AI Risk Assessment | `POST /simulation/risk-assess` |

#### 🟥 EXECUTIVE DASHBOARD
| Button / Action | API Endpoint |
|---|---|
| Login | `POST /auth/login/staff` |
| KPI Cards | `GET /analytics/summary` |
| By-neighborhood chart | `GET /analytics/by-neighborhood` |
| By-category chart | `GET /analytics/by-category` |
| Monthly trend chart | `GET /analytics/monthly-trend` |
| Agency performance | `GET /analytics/agency-performance` |
| SLA breaches | `GET /analytics/sla-breaches` |
| All reports | `GET /reports` |
| Report detail | `GET /reports/{id}` |
| Create Task | `POST /tasks` |
| Submit SLA Report | `POST /reports/{id}/sla-report` |
| Publish Alert | `POST /alerts` |
| Delete Alert | `DELETE /alerts/{id}` |
| Export Archive (CSV) | `GET /reports/export` |

---

### 3. API Integration Rules

```typescript
// Auth token must be attached to every request
const apiCall = async (method: string, path: string, body?: any) => {
  const token = localStorage.getItem('apexcore_token');
  const res = await fetch(`/api/v1${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};
```

- After login, store `access_token` → `localStorage.setItem('apexcore_token', token)`
- Store `role` → `localStorage.setItem('apexcore_role', role)` and redirect to the matching dashboard
- If no token or a 401 is returned → redirect to login page
- Show a loading state (spinner or skeleton) during every API call
- On error, show a toast/alert with a user-friendly error message

---

### 4. Page Structure

```
/                      → Landing Page (3 login choices: Citizen / Inspector / Executive)
/login/citizen         → Citizen login (SİMA, Asan, ID card, myGov, Phone options)
/login/staff           → Staff login (email + password)
/citizen               → Citizen Dashboard
/citizen/reports       → My Reports
/citizen/new-report    → New Report (form + AI photo upload)
/citizen/proposals     → Community Proposals
/citizen/alerts        → Government Alerts
/inspector             → Inspector Dashboard (task list + map)
/inspector/tasks       → Tasks (detailed view)
/inspector/simulation  → Simulation Panel
/executive             → Executive Dashboard (KPIs + charts)
/executive/reports     → All Reports
/executive/analytics   → Analytics
/executive/alerts      → Alert Management
/executive/archive     → Archive + Export
```

---

### 5. Reusable Components

**StatusBadge:**
```tsx
// pending → yellow, inprogress → blue, resolved → green, overdue → red
<StatusBadge status="pending" />
```

**ReportCard** — shows report ID, title, status badge, date, address

**KPICard** — number + label + accent color + icon (for Executive dashboard)

**TaskCard** — colored left border by priority (high=red, medium=yellow, low=green)

**ProposalCard** — vote count, vote toggle button, tag badge

**AlertCard** — icon by type (info=🔵, warning=🟡, success=🟢)

---

### 6. Form Validations

- Report form: `description` min 5 chars, `category` must be selected, `address` must not be empty
- Proposal form: `description` min 10 chars, `title` must not be empty, `tag` must be selected
- OTP input: exactly 6 digits, numbers only
- Staff login: valid email format, password must not be empty
- All validation errors appear in red text below the respective field

---

### 7. Responsive Requirements

- **Desktop (≥1024px)**: Sidebar always open, multi-column layout
- **Tablet (768–1023px)**: Sidebar opens as an overlay panel
- **Mobile (<768px)**: Bottom navigation bar, full-width cards

---

## Notes
- All UI text should be in Azerbaijani
- Visual style: clean, professional, government portal aesthetic (idda.az / myGov.az reference)
- Every component must be written in TypeScript
- Do not go outside the API contract — only the endpoints listed above are used
- Every page loads real data via an API call inside `useEffect`
