# IELTS CAMP — Rasmiy Veb-Sayti

**IELTS Camp** ta'lim markazining zamonaviy, to'liq ishlaydigan veb-sayti va boshqaruv tizimi.

> **GitHub Repository:** `samariddinfurqatov8/ielts-camp-website`  
> **Manzil:** Jizzax viloyati, Zomin tumani, Yom qishlog'i  
> **Kurslar:** Ingliz tili / CEFR (200 000 so'm/oyiga) va Tarix (200 000 so'm/oyiga)  
> **Bosh O'qituvchi:** Diyorbek Mirzaolimov (Ingliz tili, C1)  
> **Admin Telegram:** [@diyorbek_mirzaolim0v](https://t.me/diyorbek_mirzaolim0v)

---

## 🚀 Asosiy Xususiyatlar

1. **Telegram Botsiz To'liq Ishlash:**
   - Bot tokeni, Bot API yoki avtomatik xabarlar talab etilmaydi.
   - Saytdagi barcha "Admin bilan bog'lanish" tugmalari to'g'ridan-to'g'ri Diyorbek Mirzaolimov ning shaxsiy Telegram profiliga (`https://t.me/diyorbek_mirzaolim0v`) yo'naltiradi.

2. **Haqiqiy Ma'lumotlar Bazasi va Validatsiya:**
   - O'quvchilar arizalari faqat xabarnoma emas, balki xavfsiz ma'lumotlar bazasida doimiy saqlanadi.
   - Har bir arizaga noyob identifikator (masalan: `IC-2026-1042`) biriktiriladi.
   - Frontend va server darajasida kiritilgan ma'lumotlar (ism, telefon, kurs, sinf) qat'iy tekshiriladi.

3. **Xavfsiz Administrator Paneli:**
   - Parol xeshlanishi (PBKDF2/SHA-512) va seans tokenlari orqali himoyalangan.
   - Arizalarni holatlar bo'yicha saralash: `yangi`, `bog'lanildi`, `qabul qilindi`, `rad etildi`.
   - Qidiruv (ism, telefon yoki ID bo'yicha) va sana/kurs filtrlari.
   - Ichki admin izohlarini kiritish va arizalarni o'chirish.
   - **CSV eksport:** Arizalarni bir tugma bilan Excel/Google Sheets uchun mos UTF-8 formatda yuklab olish.
   - Kurslar narxlari va tavsiflarini boshqarish.
   - O'qituvchi ma'lumotlarini tahrirlash.
   - Administrator parolini yangilash.

4. **Netlify va Supabase Mosligi:**
   - `netlify.toml` — SPA routing va Netlify Serverless Functions konfiguratsiyasi.
   - `supabase_schema.sql` — PostgreSQL jadvallari, indekslar va Row Level Security (RLS) siyosatlari.

---

## 🛠 O'rnatish va Mahalliy Ishga Tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Server va frontendni ishlab chiqish (dev) rejimida ishga tushirish
npm run dev

# 3. Ishlab chiqarish (production) uchun build qilish
npm run build
```

Sayt brauzerda: `http://localhost:3000`

---

## 🔐 Standart Administrator Hisobi

Admin paneliga kirish uchun:
- **Login:** `admin`
- **Parol:** `IeltsCamp2026!` (yoki `.env` dagi `ADMIN_PASSWORD`)

> *Tavsiya:* Admin panelidagi **"Xavfsizlik"** bo'limi orqali parolingizni yangilang.

---

## 🌐 Netlify'ga Joylashtirish (Deploy)

1. Loyihani GitHub (`samariddinfurqatov8/ielts-camp-website`) omboriga yuklang.
2. [Netlify](https://app.netlify.com) tizimiga kiring va **"Add new site" -> "Import an existing project"** ni tanlang.
3. GitHub omboringizni tanlang:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions` (loyihadagi `netlify.toml` avtomatik aniqlaydi)
4. **Environment Variables** bo'limida quyidagilarni kiriting:
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: Xavfsiz parolingiz
   - `SUPABASE_URL`: (Agar Supabase ulanayotgan bo'lsa)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Supabase xizmat kaliti)
5. **Deploy site** tugmasini bosing.

---

## 🗄 Supabase PostgreSQL Sozlash (Ixtiyoriy)

Agar Netlify'da doimiy bulutli ma'lumotlar bazasi sifatida Supabase'dan foydalanmoqchi bo'lsangiz:

1. [Supabase](https://supabase.com) saytida yangi bepul loyiha yarating.
2. Chap menyudan **SQL Editor** bo'limiga o'ting.
3. Loyihadagi `supabase_schema.sql` fayli tarkibini nusxalab, SQL Editor'ga joylashtiring va **Run** tugmasini bosing.
4. Supabase **Project Settings -> API** bo'limidan URL va Service Role Secret kalitini olib, Netlify muhit o'zgaruvchilariga kiriting.
