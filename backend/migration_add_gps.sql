-- Mövcud reports cədvəlinə lat/lng sütunları əlavə et
-- Supabase Dashboard → SQL Editor bölməsindən çalışdırın

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS lat  FLOAT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lng  FLOAT DEFAULT 0;
