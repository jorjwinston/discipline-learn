# Discipline Learn — Implementation Task List (`tasks/todo.md`)

## Task 1: Loyiha poydevori, `DESIGN.md` tokenlari, Samarqand SVG naqshi va rasmiy SVG logotip tizimi

**Description:** `Bun` va `Vite` yordamida yengil, tezkor veb-ilova karkasini yaratish; `Bricolage Grotesque` va `Figtree` shriftlarini ulash; `DESIGN.md` dagi barcha rang tokenlari (`#097482`, `#23262B`, `#F4F8F8`, `#EEF4F4`, `#FFD43B`, `#D9ED82`), Samarqand yulduz-xoch (xatam) SVG fon naqshi hamda rasmiy SVG logotip (`logo-mark.svg`) komponentlarini shakllantirish.

**Acceptance criteria:**
- [ ] `package.json`, `index.html`, `src/styles/main.css` va `src/assets/` strukturasi yaratilgan va `DESIGN.md` tokenlari CSS o'zgaruvchilari sifatida kiritilgan.
- [ ] Samarqand xatam naqshi (`120px` katakdagi 8-qirrali yulduz va xoch) ham to'q firuza (`#097482`), ham och kulrang (`#EEF4F4`) fonlar uchun toza SVG komponent sifatida ishlaydi.
- [ ] Rasmiy 5 pog'onali zinapoya + kufiy kitob SVG logotipi ham to'liq rangli, ham Login sahifasidagi chizma (outlined wireframe) ko'rinishida aniq chiziladi.

**Verification:**
- [ ] Build succeeds: `bun run build`
- [ ] Manual check: Lokal serverda (`bun run dev`) shriftlar, ranglar va SVG logotip pikselma-piksel aniq ko'rinadi.

**Dependencies:** None

**Files likely touched:**
- `package.json`
- `index.html`
- `src/styles/main.css`
- `src/components/BrandAssets.js`

**Estimated scope:** Small (3-4 files)

---

## Task 2: Desktop & Mobile Login sahifasi va Google OAuth kirish oqimi

**Description:** Figmadagi `Discipline Learn // Login Page` (`264:4107`) va `Mobile Login` (`294:390`) freymlarini 1:1 ko'rinishda yaratish: chapda (yoki mobilda pastki bottom-sheetda) `O'zbek (UZ)` til tanlash, `O'rgan · Mustahkamla · Rivojlan` shiori, `Xush kelibsiz` kartasi va rasmiy 4-rangli `G` ikonkali `"Google hisobi orqali davom etish"` tugmasi; o'ngda (mobilda yuqorida) Samarqand naqshli `#097482` panel va chizma-vektor logotip.

**Acceptance criteria:**
- [ ] Desktop (`>=1024px`) da 2 ustunli (`520px` + `920px`), Mobile (`<1024px`) da esa yuqori firuza vitrina + pastki oq `Bottom Sheet` (`r: 24px`) ko'rinishiga avtomatik o'tadi.
- [ ] `"Google hisobi orqali davom etish"` tugmasi bosilganda Google OAuth (yoki 1-klikli tayyor profil seansi) orqali foydalanuvchi (`Shaxriyorov`) tizimga kiradi va holat `localStorage` da saqlanadi.
- [ ] Til almashtirish (`O'zbek (UZ)`) va tizimdan chiqish (`Logout`) funksiyasi ishlaydi.

**Verification:**
- [ ] Build succeeds: `bun run build`
- [ ] Manual check: Desktop (`1440×960`) va Mobile (`390×844`) Login ekranlari Figmadagi dizayn bilan solishtirilib tekshiriladi.

**Dependencies:** Task 1

**Files likely touched:**
- `src/components/LoginView.js`
- `src/state/store.js`
- `src/main.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint 1: After Tasks 1-2
- [ ] Application builds without errors (`bun run build`)
- [ ] Desktop va Mobile Login sahifalari Figmadagi `264:4107` va `294:390` ga 100% mos
- [ ] Google orqali kirish oqimi ishlaydi

---

## Task 3: Asosiy Ish Maydoni (`Sidebar`, `94%` To'lqinli Progress va `Reja` Vazifalar Boshqaruvi)

**Description:** Figmadagi `Discipline Learn // Web App Workspace` (`264:2177`) ning chap navigatsiya paneli (`Sidebar`: 5 ta bo'lim, faol PDF kitob kartasi `English Grammar in Use · Unit 58/145 · 40%`, foydalanuvchi profili) va markaziy ustunning yuqori qismini (`Bugun` sarlavhasi, `Umumiy progress 94%` jonli to'lqinli karta, `Reja` — 5 ta vazifa ro'yxati, bajarilgan vazifalarning yashil to'lishi, faol vazifaning `Hozir` suv to'lqini va `+ Vazifa qo'shish` inputi) jonli ishlaydigan qilish.

**Acceptance criteria:**
- [ ] Vazifa ustiga bosilganda (yoki `checkbox` belgilanganda) u bajarilgan holatga o'tadi, `Hozir` tegi va suv to'lqini avtomatik keyingi bajarilmagan vazifaga ko'chadi hamda progress foizi (`94%` / kunlik ko'rsatkich) silliq yangilanadi.
- [ ] `+ Vazifa qo'shish` maydoniga yangi vazifa yozib `Enter` bosilganda ro'yxatga yangi vazifa qo'shiladi va xotirada saqlanadi.
- [ ] Yuqori o'ngdagi `PDF yuklash` va chapdagi `+ Darslik qo'shish` tugmalari haqiqiy `.pdf` fayl tanlash oynasini ochadi.

**Verification:**
- [ ] Build succeeds: `bun run build`
- [ ] Manual check: Vazifalarni belgilash, yangi vazifa qo'shish va suv to'lqini animatsiyasi brauzerda tekshiriladi.

**Dependencies:** Task 2

**Files likely touched:**
- `src/components/Sidebar.js`
- `src/components/TodayColumn.js`
- `src/state/store.js`
- `src/styles/main.css`

**Estimated scope:** Medium (4 files)

---

## Task 4: Ebbinghaus `1-3-7-14` Xatolar Takrorlash (`Bugun takrorlanadi`) va Darsliklar Moduli

**Description:** Markaziy ustunning pastki qismidagi `Bugun takrorlanadi` (`3-kun`: `I am knowing → I know the answer now · Unit 4 · s. 8`; `7-kun`: `has gone → She went to Paris last year · Unit 7 · s. 14`) blokini va `Boshlash →` / `Takrorlash` bo'limini interaktiv flashcard/sinov rejimida ishlaydigan qilish; `Darsliklar` bo'limida yuklangan PDF kitoblarni ko'rish va almashtirish imkonini yaratish.

**Acceptance criteria:**
- [ ] `Bugun takrorlanadi` kartasidagi xato ustiga yoki `Boshlash →` tugmasiga bosilganda talaba ushbu xatoni qayta mashq qiladi; to'g'ri topshirilsa xato keyingi Ebbinghaus bosqichiga (`1-kun → 3-kun → 7-kun → 14-kun → O'zlashtirildi`) o'tadi.
- [ ] Foydalanuvchi yangi `.pdf` darslik yuklaganda fayl nomi, sahifalar soni va matni lokal xotiraga (`IndexedDB` / `store`) bog'lanadi.

**Verification:**
- [ ] Build succeeds: `bun run build`
- [ ] Manual check: `3-kun` xatosini takrorlash va uning `7-kun` bosqichiga o'tishini tekshirish.

**Dependencies:** Task 3

**Files likely touched:**
- `src/components/ReviewSection.js`
- `src/components/BooksModal.js`
- `src/state/store.js`

**Estimated scope:** Medium (3 files)

---

## Checkpoint 2: After Tasks 3-4
- [ ] Kunlik reja (`Reja`), progress to'lqini va Ebbinghaus `1-3-7-14` takrorlash zanjiri to'liq ishlaydi
- [ ] PDF fayl yuklash va darslik almashtirish ishlaydi

---

## Task 5: NotebookLM uslubidagi PDF-Grounded AI Repetitor (Gemini API + Sariq Marker)

**Description:** O'ng ustundagi `Card / Repetitor` (`Faqat English Grammar in Use bo'yicha javob beradi`) modulini to'liq jonlantirish: talabaning mashqdagi xatosini (`somebody broke → had broken`) tahlil qilish, darslikdan olingan iqtibosni **`#FFD43B` limon-sariq marker** va sahifa raqami (`Unit 14, B bo'lim · s. 28`) bilan ko'rsatish, `"Men vokzalga yetib kelganimda, poyezd allaqachon ketib bo'lgan edi"` kabi mustahkamlovchi tarjima mashqlarini tekshirish (`Tekshirish` tugmasi + ovozli kiritish `Web Speech API` mikrofoni) va `@google/genai` (Gemini 2.5 Flash) + lokal PDF bilimlar bazasi orqali javob qaytarish.

**Acceptance criteria:**
- [ ] Talaba `Javobingizni yozing` maydoniga tarjimani (masalan: `"When I arrived at the station, the train had already left"`) yozib `Tekshirish` tugmasini bosganda (yoki mikrofon tugmasi orqali aytganda), Repetitor javobni tekshiradi.
- [ ] Agar javobda xato bo'lsa, xato qism qizil chizilgan (`broke`), to'g'risi yashil (`had broken`), kitob sahifasidan sariq markerli iqtibos (`s. 28`) bilan chiqadi va avtomatik ravishda `1-3-7-14` takrorlash ro'yxatiga qo'shish taklif etiladi.
- [ ] `Yana bitta misol` tugmasi bosilganda aynan shu darslik sahifasidan yangi misol va tarjima topshirig'i beriladi; Gemini API kaliti kiritilgan bo'lsa jonli Gemini 2.5 Flash, kalitsiz holatda esa o'rnatilgan boy darslik bazasi (`Unit 4, 7, 14, 58`) uzluksiz ishlaydi.

**Verification:**
- [ ] Build succeeds: `bun run build`
- [ ] Manual check: Tarjima yozib `Tekshirish` ni bosish, to'g'ri va xato javob holatlarini, sariq markerli iqtibosni hamda `Yana bitta misol` tugmasini tekshirish.

**Dependencies:** Task 3, Task 4

**Files likely touched:**
- `src/components/RepetitorColumn.js`
- `src/services/pdfRepetitor.js`
- `src/data/murphyKnowledgeBase.js`

**Estimated scope:** Medium (3 files)

---

## Task 6: Mobile PWA moslashuvi, Mikro-animatsiyalar (`emil-design-eng`) va Yakuniy Tekshiruv

**Description:** Figmadagi `Discipline Learn // Mobile PWA Screen` (`264:2364`) va `Mobile Login` (`294:390`) ga 99%+ mos mobil ko'rinishni (`Bugun`, `Kitob`, `Repetitor`, `Takrorlash` pastki navigatsiya paneli va Samarqand naqshli tab-bar), PWA `manifest.json` faylini yaratish hamda keyingi bosqich uchun animatsiya imkoniyatlarini tahlil qilish.

**Acceptance criteria:**
- [x] Mobil ekranda (`390×844`) `Mobile Login` (`294:390`) va `Mobile PWA Screen` (`264:2364` / `310:218`) pastki 4 ta tab (`Bugun`, `Kitob`, `Repetitor`, `Takrorlash`) orqali silliq almashadi va Figmadagi dizayn bilan 99%+ bir xil ko'rinadi.
- [x] `public/manifest.json` va rasmiy SVG ikonkalar ulangan (smartfonda "Add to Home Screen" qilish mumkin).
- [ ] Foydalanuvchi tanlagan animatsiyalarni (`find-animation-opportunities` ro'yxatidan) qo'llash.

**Verification:**
- [x] Lokal server (`http://127.0.0.1:5173`) xatosiz ishga tushirilgan va barcha resurslar `200 OK` qaytaradi.
- [x] Manual check: `Mobile Login` (`294:390`) va `Mobile PWA Screen` (`264:2364`) o'lchamlari, gradientlari va tipografiyasi tekshirildi.

**Dependencies:** Task 5

**Files likely touched:**
- `public/manifest.json`
- `index.html`
- `src/styles/main.css`
- `src/main.js`

**Estimated scope:** Small-Medium (4 files)

---

## Checkpoint 3: Complete
- [x] Mobile First Phase (`Mobile Login` + `Mobile PWA Screen`) to'liq tayyorlandi (`http://127.0.0.1:5173`)
- [ ] Foydalanuvchi tanlagan animatsiyalarni qo'llash va Desktop versiyasiga o'tish

