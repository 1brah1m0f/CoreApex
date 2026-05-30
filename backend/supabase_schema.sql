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

-- Row Level Security: hər kəs oxuya bilər, yazan isə öz recordunu görür
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_all"  ON public.reports FOR SELECT  USING (true);
CREATE POLICY "reports_insert_all"  ON public.reports FOR INSERT  WITH CHECK (true);
CREATE POLICY "reports_update_own"  ON public.reports FOR UPDATE  USING (true);
CREATE POLICY "reports_delete_own"  ON public.reports FOR DELETE  USING (true);
