# Siyer Yolu · Yayınlama

## 1. Web'e çıkar (bot ile hemen çalışır)
1. GitHub'da yeni depo: `siyer-yolu` (Public) → bu klasörün **içindekileri** yükle → Commit.
2. Vercel → Add New → Project → `siyer-yolu` → Preset: **Other** → Deploy.
3. Adres: `https://siyer-yolu.vercel.app` (Vercel farklı verirse onu kullan).

## 2. Canlı yarışı aç (Supabase, ücretsiz)
1. supabase.com → New project → ad: `siyer-yolu`, bölge: **Frankfurt (EU)**.
2. **Authentication → Sign In / Providers → "Allow anonymous sign-ins" → AÇ.**
3. **SQL Editor** → `supabase/schema.sql` dosyasının tamamını yapıştır → **Run**.
4. **Project Settings → API**: "Project URL" ve **anon public** anahtarını kopyala.
5. GitHub'da `js/config.js` dosyasını aç (kalem) → iki değeri tırnakların içine yapıştır → Commit.
   ⚠️ "service_role" / "secret" anahtarını ASLA yazma.
6. Vercel kendiliğinden günceller. İki telefonda "Canlı rakip bul"a basıp dene.

## 3. Google Play
Harf Bahçesi ile aynı yol (kimlik doğrulaması bitince):
1. pwabuilder.com → adresi yaz → Package for stores → Android
   - Package ID: `com.saadetevreni.siyeryolu`
   - İnen zip'i (imza anahtarı) güvenli yerde sakla.
2. Zip'teki `assetlinks.json` → depoda `.well-known/assetlinks.json` olarak oluştur.
3. Play Console → Uygulama oluştur → metin ve görseller `magaza` klasöründe.
4. Kapalı test: 12 testçi, 14 gün → Üretim.

## İçerik
- Dersler `js/data.js` içinde. Her sorunun **ilk seçeneği doğru** cevaptır (ekranda karışık gösterilir).
- Soru eklersen kimliği `ders no × 10 + sıra` olur; yeni kimliği sunucuya da ekle:
  `insert into questions(id) values (215);`
- Yayından önce bir ilahiyatçıya dersleri okut.
