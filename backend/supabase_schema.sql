-- CoreApex - Supabase Schema
-- Supabase Dashboard -> SQL Editor bölməsindən bu skripti çalışdırın

-- ── reports cədvəli ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reports (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    category        TEXT NOT NULL,
    description     TEXT NOT NULL,
    address         TEXT NOT NULL,
    neighborhood    TEXT,
    lat             FLOAT DEFAULT 0,
    lng             FLOAT DEFAULT 0,
    photo_url       TEXT,
    status          TEXT DEFAULT 'pending',
    assigned_agency TEXT,
    ai_routed       BOOLEAN DEFAULT FALSE,
    citizen_id      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    body TEXT,
    type TEXT,
    district TEXT,
    date TEXT,
    time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proposals (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT,
    description TEXT,
    author TEXT,
    date TEXT,
    votes INT DEFAULT 0,
    tag TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    report_id TEXT,
    inspector_id TEXT,
    status TEXT DEFAULT 'pending',
    deadline TEXT,
    proof_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security: hər kəs oxuya bilər, yazan isə öz recordunu görür
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_all"  ON public.reports FOR SELECT  USING (true);
CREATE POLICY "reports_insert_all"  ON public.reports FOR INSERT  WITH CHECK (true);
CREATE POLICY "reports_update_own"  ON public.reports FOR UPDATE  USING (true);
CREATE POLICY "reports_delete_own"  ON public.reports FOR DELETE  USING (true);

CREATE POLICY "alerts_select_all"  ON public.alerts FOR SELECT  USING (true);
CREATE POLICY "alerts_insert_all"  ON public.alerts FOR INSERT  WITH CHECK (true);
CREATE POLICY "alerts_update_own"  ON public.alerts FOR UPDATE  USING (true);
CREATE POLICY "alerts_delete_own"  ON public.alerts FOR DELETE  USING (true);

CREATE POLICY "proposals_select_all"  ON public.proposals FOR SELECT  USING (true);
CREATE POLICY "proposals_insert_all"  ON public.proposals FOR INSERT  WITH CHECK (true);
CREATE POLICY "proposals_update_own"  ON public.proposals FOR UPDATE  USING (true);
CREATE POLICY "proposals_delete_own"  ON public.proposals FOR DELETE  USING (true);

CREATE POLICY "tasks_select_all"  ON public.tasks FOR SELECT  USING (true);
CREATE POLICY "tasks_insert_all"  ON public.tasks FOR INSERT  WITH CHECK (true);
CREATE POLICY "tasks_update_own"  ON public.tasks FOR UPDATE  USING (true);
CREATE POLICY "tasks_delete_own"  ON public.tasks FOR DELETE  USING (true);
