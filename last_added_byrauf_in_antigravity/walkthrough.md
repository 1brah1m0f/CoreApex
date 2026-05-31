# CoreApex / Nərimanov SmartOps — Tam Kod Analizi

> **Layihənin təyinatı:** Nərimanov rayonunda (Bakı) şəhər xidmətlərini idarə etmək üçün smart-city platforması. Vətəndaş problem bildirir → AI təsnifatdan keçir → müvafiq quruma yönləndirilir → inspektor icra edir → icraçı (executive) nəzarət edir.

---

## ADDIM 1 — Ümumi Struktur Xəritəsi

```
CoreApex/
├── .git/                          # Git repo
├── .gitignore                     # 14 bayt, minimal
├── README.md
├── apexcore-claude-code-prompt.md # AI assistant prompt/konfiqurasiya (7 KB)
├── api.txt                        # Frontend-dən çıxarılmış API specification (12 KB)
├── image.png                      # Ehtimal ki, layihə screenshot-u
│
├── backend/                       # 🐍 Python / FastAPI backend
│   ├── main.py                    # Giriş nöqtəsi — FastAPI app yaradılır
│   ├── requirements.txt           # Python asılılıqları
│   ├── .gitignore
│   ├── core/
│   │   └── dependencies.py        # Supabase client factory
│   ├── models/
│   │   └── schemas.py             # Pydantic request/response modellər
│   ├── routers/
│   │   ├── auth.py                # Auth endpoint-ləri (/auth/*)
│   │   ├── reports.py             # Hesabat endpoint-ləri (/reports/*)
│   │   └── simulation.py          # Simulyasiya endpoint-ləri (/simulation/*)
│   └── services/
│       ├── security.py            # Şəkil doğrulama (EXIF + Laplacian)
│       └── ai_classifier.py       # MobileNetV2 şəkil təsnifatı
│
├── frontend/                      # ⚛️ React + TypeScript + Vite
│   ├── index.html
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── .env.example               # VITE_GOOGLE_MAPS_API_KEY
│   └── src/
│       ├── main.tsx               # React DOM render
│       ├── App.tsx                 # Router + APIProvider
│       ├── index.css              # Tailwind + base stils
│       ├── api/
│       │   ├── client.ts          # Axios instance (interceptors)
│       │   └── index.ts           # Bütün API çağırış funksiyaları
│       ├── types/
│       │   └── index.ts           # TypeScript tipləri
│       ├── hooks/
│       │   └── useApi.ts          # Generic data-fetch hook
│       ├── mocks/
│       │   └── index.ts           # Hardcoded test datası (315 sətir)
│       ├── layouts/
│       │   ├── Sidebar.tsx        # Ortaq sidebar komponenti
│       │   ├── CitizenLayout.tsx   # Citizen portal layout
│       │   ├── InspectorLayout.tsx # Inspector portal layout
│       │   └── ExecutiveLayout.tsx # Executive portal layout
│       ├── components/
│       │   ├── PortalHeader.tsx   # Hər portal üçün ortaq header
│       │   ├── LocationPickerMap.tsx
│       │   ├── TaskMap.tsx
│       │   ├── AlertCard.tsx
│       │   ├── KPICard.tsx
│       │   ├── ProposalCard.tsx
│       │   ├── ReportCard.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── TaskCard.tsx
│       │   └── ui/               # Primitiv UI komponentləri
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Modal.tsx
│       │       ├── Spinner.tsx
│       │       └── Breadcrumb.tsx
│       └── pages/
│           ├── Landing.tsx        # Ana səhifə (/)
│           ├── AuthPage.tsx       # Login/Register (/auth)
│           ├── CitizenPage.tsx    # Vətəndaş portalı (/citizen) — tək SPA
│           ├── citizen/           # Alt-komponentlər (istifadə olunmur?)
│           │   ├── Dashboard.tsx
│           │   ├── Reports.tsx
│           │   ├── Proposals.tsx
│           │   ├── Alerts.tsx
│           │   └── NewReport.tsx
│           ├── inspector/
│           │   ├── InspectorPage.tsx  # Əsas inspektor portalı (/inspector)
│           │   ├── Dashboard.tsx
│           │   ├── Tasks.tsx
│           │   └── Simulation.tsx
│           └── executive/
│               ├── ExecutivePage.tsx  # Əsas icraçı portalı (/executive)
│               ├── Dashboard.tsx
│               ├── Analytics.tsx
│               ├── Reports.tsx
│               ├── AlertsPage.tsx
│               └── Archive.tsx
│
└── smart-city-extracted/          # ❓ Demək olar ki BOŞ
    └── .vite/
        └── deps/                  # Vite dependency cache (build artifact)
```

### `smart-city-extracted/` qovluğu haqqında

> [!IMPORTANT]
> Bu qovluqda **heç bir mənbə kodu yoxdur**. Yalnız `.vite/deps/` cache qovluğu var — bu, Vite-ın dependency pre-bundling zamanı yaratdığı artefaktdır. Ehtimal ki, əvvəlki bir layihənin (smart-city adlı) çıxarılmış (extracted) faylları burada olub, amma onlar ya silinib, ya da `.gitignore` ilə izlənməyib. **Bu qovluq layihənin aktiv hissəsi deyil** — nə backend, nə frontend ona istinad edir.

---

## ADDIM 2 — Texnoloji Stack (Faktiki)

### Backend — Python

| Kitabxana | Versiya | Məqsəd |
|---|---|---|
| [fastapi](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/requirements.txt) | 0.111.0 | API framework — async endpoint-lər, avtomatik OpenAPI docs |
| uvicorn | 0.29.0 | ASGI server — FastAPI-ni işlədir (`uvicorn main:app --reload`) |
| pydantic | 2.7.1 | Request/response data validasiyası (FastAPI ilə inteqrasiya) |
| supabase | 2.4.5 | PostgreSQL BaaS — auth, database, storage üçün SDK |
| python-dotenv | 1.0.1 | `.env` faylından mühit dəyişənlərini oxumaq |
| httpx | 0.27.0 | Async HTTP client — şəkil URL-dən yüklənməsi üçün |
| pillow | 10.3.0 | Şəkil emalı — EXIF metadata oxunması (anti-fake yoxlaması) |
| opencv-python-headless | 4.9.0.80 | Kompüter görmə — Laplacian Variance hesablanması (anti-AI süzgəc) |
| tensorflow | 2.16.1 | Dərin öyrənmə — MobileNetV2 ilə şəkil təsnifatı |
| numpy | 1.26.4 | Ədədi hesablamalar — TF/OpenCV üçün lazım |

### Frontend — TypeScript / React

| Kitabxana | Versiya | Məqsəd |
|---|---|---|
| [react](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/package.json) | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | React DOM renderer |
| react-router-dom | ^6.28.0 | Client-side routing (portallar arası keçid) |
| axios | ^1.7.9 | HTTP client — backend API çağırışları |
| recharts | ^2.15.2 | Data vizualizasiya (bar, line, pie chart-lar — executive panel) |
| lucide-react | ^0.487.0 | SVG ikon kitabxanası (bütün ikonlar buradan) |
| sonner | ^2.0.3 | Toast notification sistemi |
| @vis.gl/react-google-maps | ^1.8.3 | Google Maps inteqrasiyası (xəritə, lokasiya seçici) |
| clsx | ^2.1.1 | Conditional CSS class-ları birləşdirmək |

**Dev alətləri:** Vite ^6.0.5, TypeScript ^5.7.2, TailwindCSS ^3.4.17, PostCSS, Autoprefixer

**Paket meneceri:** pnpm (`.npmrc` + `pnpm-lock.yaml` + `pnpm-workspace.yaml` var)

---

## ADDIM 3 — Backend Memarlığı və API

### Framework və Giriş Nöqtəsi

Backend **FastAPI** istifadə edir. Giriş nöqtəsi [main.py](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/main.py) faylıdır:

```python
app = FastAPI(title="CoreApex API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
app.include_router(auth.router)      # /auth/*
app.include_router(reports.router)   # /reports/*
app.include_router(simulation.router) # /simulation/*
```

İşlədilmə: `uvicorn main:app --reload`

### Bütün API Endpoint-lərinin Tam Siyahısı

> [!NOTE]
> Backend-də **kodda** mövcud olan endpoint-lər aşağıdakılardır. Frontend-in [api/index.ts](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/api/index.ts) faylında isə daha çox endpoint çağırılır (proposals, alerts, tasks, analytics) — bunlar **backend-də hələ kodlanmayıb**, frontend onları çağırır amma `catch` blokunda mock success göstərir.

#### Auth Router — [auth.py](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/routers/auth.py)

| Metod | Yol | Nə edir |
|---|---|---|
| `POST` | `/auth/login/citizen` | Vətəndaş girişi — Supabase `sign_in_with_password`, `role: "citizen"` qaytarır |
| `POST` | `/auth/login/staff` | İşçi (inspektor/icraçı) girişi — rol `user_metadata.role`-dan oxunur, default `"inspector"` |
| `POST` | `/auth/otp/send` | Mock OTP göndərmə (implementasiya yoxdur) |
| `POST` | `/auth/otp/verify` | Mock OTP yoxlama (mock token qaytarır) |

> [!WARNING]
> Frontend `/auth/login` və `/auth/register` endpoint-lərini çağırır (bax [api.txt](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/api.txt) L135-146), amma backend-də bu yollar yoxdur. Backend-də `/auth/login/citizen` və `/auth/login/staff` var. Bu uyğunsuzluq frontend-in `catch` blokunda mock-la aradan qaldırılır.

#### Reports Router — [reports.py](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/routers/reports.py)

| Metod | Yol | Nə edir |
|---|---|---|
| `POST` | `/reports/ai-classify` | Şəkli URL-dən yükləyir → EXIF/Laplacian süzgəcindən keçirir → MobileNetV2 ilə təsnifləyir → qurum/prioritet qaytarır |
| `POST` | `/reports/` | Yeni müraciət yaradır. **Hazırda Supabase insert comment-ə alınıb**, mock data qaytarılır |
| `GET`  | `/reports/` | Bütün müraciətləri qaytarır — **mock: boş array qaytarır** |

#### Simulation Router — [simulation.py](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/routers/simulation.py)

| Metod | Yol | Nə edir |
|---|---|---|
| `GET`  | `/simulation/layers` | Koordinata əsasən 5 simulyasiya layı (water, traffic, wind, noise, soil) üçün random risk data yaradır |
| `POST` | `/simulation/run` | Aktiv layer-lərə əsasən impact score hesablayır (imitasiya) |
| `POST` | `/simulation/risk-assess` | Task üçün random risk qiyməti verir (imitasiya) |

#### Backend-də OLMAYAN amma Frontend-in Gözlədiyi Endpoint-lər

Bu endpoint-lər [api/index.ts](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/api/index.ts) faylında çağırılır amma backend-də kodlanmayıb:

- `/auth/login`, `/auth/register`, `/auth/me`
- `/reports/mine`, `/reports/{id}`, `/reports/{id}/status` (PATCH), `/reports/{id}/sla-report`, `/reports/export`
- `/proposals`, `/proposals/{id}/vote`
- `/alerts`, `/alerts/{id}` (DELETE)
- `/tasks/mine`, `/tasks/{id}`, `/tasks/{id}/status` (PATCH), `/tasks/{id}/proof`, `/tasks` (POST)
- `/analytics/summary`, `/analytics/by-neighborhood`, `/analytics/by-category`, `/analytics/monthly-trend`, `/analytics/agency-performance`, `/analytics/sla-breaches`

### Verilənlər Bazası

**Supabase** (hosted PostgreSQL) istifadə olunur. Bağlantı [dependencies.py](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/core/dependencies.py) faylında qurulur:

```python
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
                or os.getenv("SUPABASE_ANON_KEY")
                or os.getenv("SUPABASE_KEY")
return create_client(supabase_url, supabase_key)
```

> [!IMPORTANT]
> Kodda **Supabase cədvəl yaratma (migration) faylları yoxdur**. `reports.py`-da `supabase.table("reports").insert(data)` sətri comment-ə alınıb. Yəni hazırda DB-yə heç nə yazılmır — data ya mock olaraq qaytarılır, ya da Supabase Auth-un öz `auth.users` cədvəli istifadə olunur.

**Gözlənilən cədvəl strukturu** (koddan çıxarılmış, Supabase-də yaradılmalıdır):

| Cədvəl | Əsas sahələr |
|---|---|
| `reports` | id, category, description, address, lat, lng, photo_url, status, assigned_agency, created_at, citizen_id |
| `proposals` | id, title, description, author, date, votes, voted_by_me, tag |
| `alerts` | id, title, body, type, district, date, time |
| `tasks` | id, title, address, category, priority, status, date, description, agency_body, agency_requirements, map_x, map_y |

### Autentifikasiya MƏNTİQİ

**Necə işləyir (backend tərəf):**

1. İstifadəçi email+password göndərir
2. Backend Supabase Auth SDK-nı çağırır: `supabase.auth.sign_in_with_password({email, password})`
3. Supabase JWT token və user obyekti qaytarır
4. **Rol təyini:**
   - **Citizen login** (`/auth/login/citizen`): rol hardcoded `"citizen"` olaraq qaytarılır
   - **Staff login** (`/auth/login/staff`): rol `user.user_metadata.role`-dan oxunur, əgər yoxdursa default `"inspector"`
   - Yəni **Supabase Dashboard-da user yaradılarkən `user_metadata`-ya `role: "executive"` və ya `role: "inspector"` yazılmalıdır**
5. Response: `{ access_token, role, user: {id, email, full_name} }`

> [!CAUTION]
> Backend-də **token verification middleware-i yoxdur**. Yəni endpoint-lər `Authorization: Bearer <token>` header-ini yoxlamır. Bu, hazırda prototip/hackathon fazasında olduğu deməkdir — production üçün JWT decode/verify əlavə edilməlidir.

---

## ADDIM 4 — Frontend Memarlığı və Routing

### Routing Strukturu

[App.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/App.tsx) faylında `createBrowserRouter` ilə qurulub:

```
/               → Landing.tsx        (Ana səhifə — portal seçimi)
/auth           → AuthPage.tsx       (Login / Register)
/citizen        → CitizenPage.tsx     (Vətəndaş portalı — tab-based SPA)
/inspector      → InspectorPage.tsx   (İnspektor portalı — tab-based SPA)
/executive      → ExecutivePage.tsx   (İcraçı portalı — tab-based SPA)
*               → Navigate to /       (404 → ana səhifə)
```

> [!NOTE]
> Routing **flat**-dır — nested routing yoxdur. Hər portal tək bir route-da yaşayır və daxilində tab-based naviqasiya var (React state ilə). `layouts/` qovluğundakı `CitizenLayout.tsx`, `InspectorLayout.tsx`, `ExecutiveLayout.tsx` faylları `<Outlet />` istifadə edir amma hazırda router-da istifadə olunmur — bunlar ehtimal ki, gələcəkdə nested routing üçün hazırlanıb.

### Üç Portalın Kod Səviyyəsində Ayrılması

Hər portal **ayrı böyük SPA komponenti** olaraq qurulub:

| Portal | Fayl | Tab-lar | Ölçüsü |
|---|---|---|---|
| Vətəndaş | [CitizenPage.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/CitizenPage.tsx) | Müraciətlərim, Təkliflərim, Bildirişlər | 444 sətir, 21 KB |
| İnspektor | [InspectorPage.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/inspector/InspectorPage.tsx) | Gündalik Marşrut, Tapşırıqlar, Simulyasiya, Təkliflər | 357 sətir, 17 KB |
| İcraçı | [ExecutivePage.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/executive/ExecutivePage.tsx) | Analitik Panel, Rəqəmsal Arxiv, Qurumlara Nəzarət, Xəbərdarlıqlar | 566 sətir, 28 KB |

Hər portal faylı daxilində tab state-i `useState<Tab>` ilə idarə olunur və tab komponentləri eyni fayl daxilində `function` olaraq yazılıb (məs: `AnalyticsTab()`, `SimulationTab()` və s.). Bu, monolitik yanaşmadır — hər şey bir faylda.

`pages/citizen/`, `pages/inspector/`, `pages/executive/` alt-qovluqlarında da ayrıca `Dashboard.tsx`, `Reports.tsx` və s. fayllar var, amma **əsas portal səhifələri (CitizenPage, InspectorPage, ExecutivePage) onları import etmir** — onlar ya köhnəlib, ya da gələcəkdə refactoring üçün saxlanılıb.

### Komponent Təşkilatı

**Ortaq (shared) komponentlər — `components/`:**

| Komponent | Nə edir |
|---|---|
| [PortalHeader.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/PortalHeader.tsx) | Hər portalda istifadə olunan sticky header — brend, bildiriş, profil, çıxış düyməsi |
| [TaskMap.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/TaskMap.tsx) | Google Maps üzərində tapşırıqlar xəritəsi (inspektor üçün) |
| [LocationPickerMap.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/LocationPickerMap.tsx) | Müraciət yaradarkən xəritədən yer seçmə |
| [StatusBadge.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/StatusBadge.tsx) | Status rəngləndirmə (pending/inprogress/resolved/overdue) |
| [AlertCard.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/AlertCard.tsx), [ReportCard.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/ReportCard.tsx), [KPICard.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/KPICard.tsx), [ProposalCard.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/ProposalCard.tsx), [TaskCard.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/components/TaskCard.tsx) | Data kartları |

**Primitiv UI komponentləri — `components/ui/`:**

| Komponent | Nə edir |
|---|---|
| `Button.tsx` | Variant (primary/secondary/ghost/danger), size (sm/md/lg), loading state |
| `Input.tsx` | Label + error message ilə styled input |
| `Modal.tsx` | Overlay + content + footer slotlu modal dialoq |
| `Spinner.tsx` | Loading animasiyası |
| `Breadcrumb.tsx` | Naviqasiya breadcrumb (hazırda istifadə olunmur) |

### State (Vəziyyət) İdarəsi

**Global state management kitabxanası istifadə olunmur** (Redux, Zustand, Context yoxdur). State tamamilə lokal:

1. **Auth state:** `localStorage`-da saxlanılır:
   - `apexcore_token` — JWT token
   - `apexcore_role` — `citizen|inspector|executive`
   - `apexcore_user` — JSON string `{id, name, email}`

2. **Tab state:** hər portal daxilində `useState<Tab>` ilə

3. **Data fetch:** [useApi](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/hooks/useApi.ts) custom hook-u ilə:
   ```typescript
   const { data, loading, error, refetch } = useApi<T>(() => apiCall(), [deps])
   ```
   Bu hook `useEffect` ilə API çağırır, `cancelled` flag ilə race condition-u idarə edir, `refetch` üçün `tick` counter istifadə edir.

### API Client (Axios)

[client.ts](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/api/client.ts):

```typescript
const client = axios.create({
  baseURL: '/api/v1',           // ← Relative URL! Proxy lazımdır
  headers: { 'Content-Type': 'application/json' },
})
```

**Request interceptor:** localStorage-dən `apexcore_token` oxuyur → `Authorization: Bearer <token>` header-i əlavə edir

**Response interceptor:**
- Uğurlu cavab → `res.data` qaytarır (axios wrapper-i çıxarır)
- 401 xəta → token/role silir, ana səhifəyə yönləndirir
- Digər xəta → `detail` və ya `message` sahəsini `Error` obyektinə çevirir

> [!WARNING]
> `baseURL: '/api/v1'` relative URL-dir. Backend isə `localhost:8000`-da `/auth/...`, `/reports/...` kimi yollarda işləyir. Yəni **Vite proxy konfiqurasiyası lazımdır** (hazırda `vite.config.ts`-də proxy yoxdur) və ya backend `/api/v1` prefix-i ilə yenidən qurulmalıdır.

---

## ADDIM 5 — Rol Bölgüsü və İcazələr

### Login Prosesi — Addım-addım

1. İstifadəçi `/auth` səhifəsinə gedir ([AuthPage.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/AuthPage.tsx))
2. Login və ya Register formunu doldurur
3. `authApi.login(email, password)` çağırılır → `POST /api/v1/auth/login`
4. Backend `{ token, role, user }` qaytarır
5. Frontend `localStorage`-a yazır:
   ```javascript
   localStorage.setItem('apexcore_token', token)
   localStorage.setItem('apexcore_role', role)
   localStorage.setItem('apexcore_user', JSON.stringify(user))
   ```
6. Rola əsasən yönləndirmə:
   ```javascript
   const ROLE_PATHS = {
     citizen: '/citizen',
     inspector: '/inspector',
     executive: '/executive',
   }
   navigate(ROLE_PATHS[role] ?? '/citizen')
   ```

### Hər Rolun Girə Bildiyi Səhifələr

| Rol | Giriş yolu | Tablar/Bölmələr |
|---|---|---|
| **Citizen** (Vətəndaş) | `/citizen` | Müraciətlərim, Təkliflərim, Bildirişlər + Yeni müraciət/təklif yaratma |
| **Inspector** (Müfəttiş) | `/inspector` | Gündalik Marşrut (xəritə), Tapşırıqlar (status dəyişmə, sübut yükləmə), Simulyasiya (Digital Twin), Təkliflər (oxuma) |
| **Executive** (İcraçı) | `/executive` | Analitik Panel (qrafiklər, KPI), Rəqəmsal Arxiv (axtarış, CSV export), Qurumlara Nəzarət (SLA izləmə), Xəbərdarlıqlar (yaratma/silmə) |

### "Admin Panel" haqqında

**Ayrıca admin panel yoxdur.** Executive portal faktiki olaraq admin funksiyalarını yerinə yetirir:
- Bütün müraciətləri görür (Archive tab)
- KPI və analitika izləyir
- Bildiriş yaradır/silir
- Qurumlararası sorğuları nəzarət edir
- SLA pozuntularını izləyir

### Qorunan Route-lar (Protected Routes)

> [!CAUTION]
> **Kodda protected route mexanizmi YOXDUR.** Yəni:
> - `/citizen`, `/inspector`, `/executive` yollarına birbaşa URL yazıb girmək mümkündür
> - Heç bir `PrivateRoute`, `AuthGuard`, `RequireAuth` və ya oxşar komponent yoxdur
> - Token yoxlanışı yalnız API çağırışı zamanı baş verir — 401 cavab gəldikdə interceptor istifadəçini çıxarır
> - Backend-də də endpoint-lərdə auth middleware yoxdur (token yoxlanılmır)
>
> Bu, prototip/hackathon səviyyəsində qəbul edilir amma production üçün əlavə edilməlidir.

---

## ADDIM 6 — Əsas İş Axını (Data Flow)

**Ssenari:** Vətəndaş "Su borusu sızır" problem bildirişi göndərir.

### Addım 1 — Vətəndaş Müraciət Yaradır

**Komponent:** [CitizenPage.tsx → NewReportModal](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/CitizenPage.tsx#L108-L245)

1. Vətəndaş `/citizen` portalında **"Yeni müraciət"** düyməsinə basır → `setNewReportOpen(true)`
2. Modal açılır (`NewReportModal`) — başlıq, təsvir, kateqoriya, GPS/xəritə, şəkil sahələri var
3. GPS düyməsinə basır → `navigator.geolocation.getCurrentPosition()` ilə koordinat alınır
4. Şəkil əlavə edə bilər (local file seçimi, blob URL yaradılır)
5. "Göndər" basır → `submit()` funksiyası çağırılır

### Addım 2 — API Çağırışı

**Fayl:** [api/index.ts → reportsApi.create()](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/api/index.ts#L18-L20)

```typescript
reportsApi.create({ ...form, lat: location?.lat, lng: location?.lng })
// → client.post('/reports', data)
// → POST /api/v1/reports  (axios baseURL = '/api/v1')
```

### Addım 3 — Backend Emalı

**Fayl:** [reports.py → create_report()](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/routers/reports.py#L38-L75)

1. `ReportCreateRequest` Pydantic ilə validasiya olunur (category, description, address, lat, lng, photo_url)
2. `report_id` yaradılır: `f"MR-{uuid4()[:8].upper()}"`
3. Kateqoriyaya əsasən qurum təyin olunur:
   - `road` → AAYDA
   - `waste` → MKTB
   - `water` → Azərsu
4. **Hazırda Supabase insert comment-ə alınıb** — mock data qaytarılır
5. Status: `"pending"` olaraq yaradılır

### Addım 4 — AI Təsnifat (Əgər şəkil varsa)

İstifadəçi fotoşəkil göndərsə, əlavə olaraq `POST /reports/ai-classify` çağırıla bilər:

1. [security.py → verify_image_authenticity()](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/services/security.py#L14-L65):
   - **Anti-Fake:** Pillow ilə EXIF metadata yoxlanır (Make, DateTime, DateTimeOriginal)
   - **Anti-AI:** OpenCV Laplacian Variance hesablanır — əgər < 120 isə, şəkil süni sayılır

2. [ai_classifier.py → classify_and_route_image()](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/backend/services/ai_classifier.py#L14-L76):
   - MobileNetV2 (ImageNet) ilə şəkil analiz edilir
   - Raw label → Azərbaycan dövlət qurumuna mapping:
     - `pothole/street/road` → **AAYDA** (yol), high priority, 48 saat
     - `trash/bin/garbage` → **MKTB** (tullantı), high priority, 12 saat
     - `tree/plant/flower` → **Yaşıllaşdırma**, medium priority, 48 saat
     - `water/pipe/fountain` → **Azərsu**, high priority, 24 saat

### Addım 5 — Frontend Cavab Alır

`CitizenPage.tsx`-da:
```typescript
try {
  await reportsApi.create({ ... })
  toast.success('Müraciət göndərildi')
} catch {
  toast.success('Müraciət qeydə alındı')  // ← API fail etsə belə, mock success göstərir
}
```
Modal bağlanır, `reportsFetch.refetch()` çağırılır.

### Addım 6 — İnspektor Portalında Görünmə

**Komponent:** [InspectorPage.tsx → TasksTab](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/inspector/InspectorPage.tsx#L39-L144)

1. `tasksApi.mine()` çağırılır → API cavab verməsə `MOCK_TASKS` istifadə olunur
2. Tapşırıq kartlarında: başlıq, ünvan, prioritet, status, qurum tələbləri göstərilir
3. İnspektor:
   - "Başla" (pending → inprogress) və ya "Tamamla" (inprogress → resolved) düyməsinə basır → `tasksApi.updateStatus()`
   - "Sübut yüklə" ilə fotoşəkil göndərir → `tasksApi.uploadProof()`

### Addım 7 — İcraçı Portalında Nəzarət

**Komponent:** [ExecutivePage.tsx](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/src/pages/executive/ExecutivePage.tsx)

1. **Analitik Panel** — KPI (cəmi, həll olunmuş, açıq, SLA pozuntusu), rayon/kateqoriya qrafikləri
2. **Rəqəmsal Arxiv** — bütün müraciətlər cədvəl şəklində, filtr + axtarış + CSV export
3. **Qurumlara Nəzarət** — qurumlararası sorğular, SLA son tarixlər, gecikən işlər
4. **Xəbərdarlıqlar** — yeni bildiriş yaratma, mövcud bildirişləri silmə

---

## ADDIM 7 — Dizayn Pattern-ləri və Konvensiyalar

### 1. API Fallback Pattern-i (Mock-first)

Bütün portallarda eyni pattern istifadə olunur:

```typescript
const reportsFetch = useApi<Report[]>(() => reportsApi.mine())
const reports = toArr<Report>(reportsFetch.data).length > 0
  ? toArr<Report>(reportsFetch.data)
  : MOCK_REPORTS    // ← API boş/xətalı isə mock data göstərilir
```

`toArr<T>()` utility funksiyası hər portal faylında yenidən yazılıb:
```typescript
function toArr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}
```

**Nəticə:** Frontend həmişə işləyir — backend olmasa da mock data ilə tam demo keçirmək olur.

### 2. Komponent Adlandırma Konvensiyası

- **Səhifələr:** `PascalCase` + `Page` suffix — `CitizenPage`, `InspectorPage`, `ExecutivePage`
- **Alt-komponentlər:** Funksiya adına görə — `TasksTab`, `SimulationTab`, `AnalyticsTab`
- **Ortaq komponentlər:** `PascalCase` — `PortalHeader`, `TaskMap`, `StatusBadge`
- **UI primitivləri:** `PascalCase` — `Button`, `Input`, `Modal`, `Spinner`

### 3. Tab-Based SPA Pattern-i

Hər portal **tək route + tab state** yanaşması ilə qurulub:

```typescript
type Tab = 'reports' | 'proposals' | 'alerts'
const [tab, setTab] = useState<Tab>('reports')

// Render:
{tab === 'reports' && <ReportsContent />}
{tab === 'proposals' && <ProposalsContent />}
```

### 4. Tailwind Token Sistemi

[tailwind.config.ts](file:///c:/Users/Mr.Jafarov/Desktop/CoreApex/CoreApex/frontend/tailwind.config.ts) faylında custom design token-lar təyin olunub:

| Token | Dəyər | İstifadə |
|---|---|---|
| `primary` | `#1A3C6E` (tünd göy) | Brend rəng, düymələr, sidebar |
| `accent` | `#E8A020` (sarı) | Aksent elementlər |
| `bg` | `#F4F6FA` (açıq boz) | Səhifə arxa planı |
| `success` | `#16A34A` | Uğurlu status |
| `warning` | `#D97706` | Xəbərdarlıq |
| `danger` | `#DC2626` | Xəta/təhlükə |
| Font `heading` | Montserrat | Başlıqlar |
| Font `body` | Source Sans 3 | Əsas mətn |

### 5. Qovluq Strukturunun Məntiqi

```
src/
├── api/          → Backend ilə əlaqə (client + funksiyalar)
├── types/        → Paylaşılan TypeScript interfeys-ləri
├── hooks/        → Custom React hook-lar
├── mocks/        → Hardcoded test datası
├── layouts/      → Portal skeleti (sidebar + outlet) — gələcək üçün
├── components/   → Paylaşılan komponentlər
│   └── ui/       → Primitiv UI blokları
└── pages/        → Səhifə komponentləri
    ├── citizen/  → Vətəndaş portal alt-komponentləri
    ├── inspector/→ İnspektor portal alt-komponentləri
    └── executive/→ İcraçı portal alt-komponentləri
```

### 6. Yeni Səhifə/Funksiya Əlavə Etsəniz, Bu Qaydalara Əməl Edin

1. **Tip əlavə edin** → `types/index.ts`-ə yeni interfeys yazın
2. **Mock data əlavə edin** → `mocks/index.ts`-ə test datası qoyun
3. **API funksiyası yazın** → `api/index.ts`-ə yeni çağırış əlavə edin
4. **Komponent yaradın** → paylaşılacaqsa `components/`-ə, xüsusidirsə portal qovluğuna
5. **Fallback pattern istifadə edin** → `useApi` + `toArr` + `MOCK_*`
6. **Tailwind token-ları istifadə edin** — hardcoded rəng yazmayin, `text-primary`, `bg-bg`, `text-danger` və s. istifadə edin
7. **Azərbaycan dilini qoruyun** — bütün UI mətni, toast mesajları, placeholder-lər Azərbaycan dilindədir
8. **Error handling:** `catch` blokunda API xəta verəndə mock success göstərin (prototip üçün UX qırılmasın)

---

> [!TIP]
> **TL;DR Xülasə:**
> - Layihə hackathon-level prototipdir — backend yarımçıq, frontend mock data ilə tam demoqabildir
> - 3 portal (citizen/inspector/executive) var, hər biri tək route-da tab-based SPA
> - Auth Supabase vasitəsilə, rol `user_metadata`-dan
> - AI feature-lər: MobileNetV2 şəkil təsnifatı + EXIF/Laplacian doğrulama
> - Simulyasiya modulları imitasiya (random data)
> - Protected route-lar, DB migration, proper error handling hələ yoxdur
