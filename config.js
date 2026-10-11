// Canlı yarış sunucusu (Supabase). İkisi de boşsa uygulama yalnızca bot rakiple çalışır.
// Supabase → Project Settings → API: "Project URL" ve "anon public" anahtarı. Anon anahtar herkese açıktır, gizli değildir.
// ⚠️ "service_role" / "secret" anahtarını ASLA buraya yazma.
export const SUPABASE_URL = 'https://lgexvajgpddnbhhupsbx.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZXh2YWpncGRkbmJoaHVwc2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0ODg3ODEsImV4cCI6MjEwNzA2NDc4MX0.-CiIL2i7K88nD_sRVLx7DvSSJ25LCN1MmBWYRHmhnB4';
// Günlük hadis bildirimi: web push için açık (public) VAPID anahtarı. Gizli değildir.
// Bunun eşi olan ÖZEL anahtar yalnızca Supabase → Edge Functions → Secrets içinde VAPID_PRIVATE_KEY olarak durur; buraya yazılmaz.
export const VAPID_PUBLIC_KEY = 'BCErTGXmrdRRSLORtjweZPod0wuiZcQzE5V8H-nAeNoV5DI2aMpXc12u4BguhlmEncTY5vzeaA-8zE1FoEKdqt8';
