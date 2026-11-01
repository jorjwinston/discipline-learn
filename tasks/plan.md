# Implementation Plan: Discipline Learn Web App (PWA)

## Overview
**Discipline Learn** — til o'rganuvchilar uchun shaxsiy PDF darslikka (masalan, *Raymond Murphy — English Grammar in Use*) asoslangan kunlik intizom (Todoist uslubida), Ebbinghaus `1-3-7-14` xatolar takrorlash tizimi va Google NotebookLM uslubidagi PDF-cheklangan AI repetitorini birlashtiruvchi veb-ilova (Progressive Web App — PWA). Loyiha **0 so'm xarajat (`$0` stack)** tamoyili asosida quriladi, Figmadagi tasdiqlangan dizaynlar (`Login Page`, `Mobile Login`, `Web App Workspace`, `Mobile PWA Screen`) bilan 1:1 vizual aniqlikda ishlaydi va ham kompyuterda, ham Android smartfonlarda (PWA / QR-kod orqali) to'liq ochiladi.

---

## Architecture Decisions (`Ponytail` + `$0` Stack)

1. **Frontend & Build Tool (`Vite + Vanilla TS/JS yoki Preact/React + Tailwind CSS` — Bun orqali):**
   - **Qaror:** `Bun` (`v1.4.2` tayyor o'rnatilgan) + `Vite` — og'ir SSR freymvorklarsiz, 1 soniyada ishga tushadigan, ham lokalda, ham Vercel/GitHub Pages'da 100% bepul ishlaydigan tezkor SPA + PWA.
2. **Avtorizatsiya (`Faqat Google OAuth`):**
   - **Qaror:** Google Identity Services / Firebase Auth (Free Tier) + **Instant Demo Google OAuth rejimi** (3-noyabr taqdimot vaqtida internet uzilsa ham yoki hakamlar QR-kod orqali kirganda 1-klikda `"Google hisobi orqali davom etish"` uzluksiz ishlashi uchun).
3. **Ma'lumotlar bazasi va PDF Saqlash (`Offline-First: IndexedDB + LocalStorage`):**
   - **Qaror:** Katta hajmli PDF darsliklar (10–30 MB) bulutli pullik serverda emas, bevosita brauzerning `IndexedDB` xotirasida saqlanadi (`$0` xarajat, `0ms` yuklanish). Kunlik vazifalar, `94%` intizom ko'rsatkichi va `1-3-7-14` xatolar jadvali strukturalangan lokal store'da saqlanadi (tayyor *English Grammar in Use — Unit 14, Past Perfect, s. 28* demo ma'lumotlari bilan birga).
4. **NotebookLM uslubidagi PDF-Grounded AI Repetitor (`pdfjs-dist` + `@google/genai` Gemini 2.5 Flash):**
   - **Qaror:** Yuklangan PDF fayl `pdf.js` orqali sahifama-sahifa o'qib olinadi. Talaba mashqda xato qilganda yoki savol berganda, AI promtiga **faqatgina shu PDF sahifasining matni** yuboriladi va qat'iy JSON sxema (`responseSchema`) talab qilinadi:
     - `wrong`: xato qism (`"broke"`)
     - `correct`: to'g'ri shakl (`"had broken"`)
     - `explanationUz`: o'zbek tilida qisqa tushuntirish
     - `bookQuote`: kitobdan aynan olingan iqtibos (**`#FFD43B` limon-sariq marker** bilan ajratib ko'rsatish uchun)
     - `citation`: aniq bob va sahifa (`"Unit 14, B bo'lim · s. 28"`)
     - `followUpTaskUz`: qoidani mustahkamlash uchun o'zbekcha tarjima topshirig'i.
5. **Dizayn va Harakatlar (`emil-design-eng` + Figma 1:1):**
   - Samarqand yulduz-xoch (xatam) SVG naqshi va rasmiy 5 pog'onali zinapoya logotipi (`logo-mark.svg`).
   - `Umumiy progress 94%` va `4-vazifa (Hozir)` ichidagi jonli suzuvchi SVG suv to'lqini (`water-wave` CSS animatsiyasi).
   - Barcha tugmalarda `:active { transform: scale(0.97) }` va `cubic-bezier(0.23, 1, 0.32, 1)` o'tish egri chizig'i.

---

## Dependency Graph

```
Task 1: Loyiha karkasi, Dizayn Tokenlar (DESIGN.md), Shriftlar va SVG Naqsh/Logotip
    │
    ├── Task 2: Login Ekranlari (Desktop 2-ustunli + Mobile Bottom-Sheet) va Google OAuth Oqimi
    │       │
    │       └── Task 3: Asosiy Ish Maydoni (Sidebar, 94% To'lqinli Progress va Kunlik Reja Vazifalari)
    │               │
    │               ├── Task 4: Ebbinghaus 1-3-7-14 Xatolar Takrorlash Moduli (Spaced Repetition)
    │               │
    │               └── Task 5: PDF O'qish (pdf.js) va NotebookLM uslubidagi AI Repetitor (Gemini API + Sariq Marker)
    │                       │
    │                       └── Task 6: Mobile PWA (4-tabli Bottom Nav, manifest.json) va Qattiq Tekshiruv
```

---

## Task List

### Phase 1: Foundation & Authentication
- [ ] **Task 1:** Loyiha poydevori, `DESIGN.md` tokenlari, Samarqand SVG naqshi va rasmiy SVG logotip tizimi
- [ ] **Task 2:** Desktop & Mobile Login sahifasi (`O'rgan · Mustahkamla · Rivojlan`) va Google OAuth kirish oqimi

### Checkpoint 1: Foundation & Auth
- [ ] Ilova xatosiz yig'iladi (`bun run build`), Desktop (`1440px`) va Mobile (`390px`) Login sahifasi Figmadagi `264:4107` va `294:390` freymlari bilan bir xil ko'rinadi hamda Google tugmasi bosilganda asosiy ish maydoniga o'tadi.

### Phase 2: Core Study & Spaced Repetition Engine
- [ ] **Task 3:** Asosiy Ish Maydoni (`Sidebar`, `94%` jonli to'lqinli progress, `Reja` vazifalar ro'yxati va yangi vazifa qo'shish)
- [ ] **Task 4:** Ebbinghaus `1-3-7-14` Xatolar Takrorlash (`Bugun takrorlanadi`) interaktiv moduli va Darsliklar (`PDF yuklash`) oynasi

### Checkpoint 2: Core Study Flow
- [ ] Vazifalarni belgilash (`checkbox`), suv to'lqini (`94%`) o'zgarishi, yangi vazifa qo'shish (`Enter`) va `3-kun` / `7-kun` xatolarini takrorlash to'liq ishlaydi.

### Phase 3: NotebookLM AI Repetitor & Mobile PWA Polish
- [ ] **Task 5:** NotebookLM uslubidagi PDF-Grounded AI Repetitor (`English Grammar in Use` konteksti, Gemini API integratsiyasi, `broke → had broken` tahlili, `#FFD43B` sariq markerli iqtibos va tarjima tekshiruvchisi)
- [ ] **Task 6:** Mobile PWA moslashuvi (`Bugun, Kitob, Repetitor, Takrorlash` pastki navigatsiyasi, `manifest.json` va `emil-design-eng` mikro-animatsiyalari)

### Checkpoint 3: Complete & Competition Ready
- [ ] Barcha 6 ta vazifa mezonlari bajarilgan, brauzerda Desktop va Mobile ko'rinishlar vizual tekshirilgan, tanlovda jonli namoyish qilishga 100% tayyor.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
| :--- | :---: | :--- |
| Taqdimot vaqtida (3-noyabr) zalda internet sekin bo'lishi yoki Gemini API kaliti cheklovi | High | Barcha asosiy darslik sahifalari (`Unit 14, Past Perfect, s. 28–29`, `Unit 4`, `Unit 7`) va AI repetitor javoblari uchun lokal **Smart Fallback Engine** kiritiladi — API kaliti bo'lsa jonli Gemini 2.5 Flash ishlaydi, internet uzilsa ham 0ms kechikish bilan haqiqiy darslik sahifasidan javob qaytaradi. |
| Katta PDF fayllarni brauzerda o'qish tezligi | Medium | `pdf.js` faqat kerakli sahifalar matnini ajratib oladi va `IndexedDB` keshida saqlaydi. |
| Mobil ekranda (`390px`) 3 ta ustunning sig'masligi | High | Mobil ko'rinishda Figmadagi `264:2364` freymiga mos 4 ta tab (`Bugun`, `Kitob`, `Repetitor`, `Takrorlash`) va silliq tab almashinuvi qo'llaniladi. |

## Open Questions
- Gemini API kalitingiz (`GEMINI_API_KEY`) hozir bormi yoki ilova ichida sozlamalar (`⚙️`) tugmasidan kalit kiritish + kalitsiz ham ishlaydigan **Smart PDF Repetitor** rejimini birga qo'shib ketaylikmi?
- `Card / Today` paneli uchun hozirgi `Umumiy progress 94%` to'lqinli dizaynni qoldiramizmi yoki boyagi 3 ta yangi variantdan (A: Intizom zanjiri, B: Ebbinghaus, C: 5-bosqichli zinapoya) birini tanlaysizmi?
