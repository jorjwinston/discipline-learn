# Discipline Learn — Design System & UI/UX Specification (`DESIGN.md`)

> **Loyiha:** Discipline Learn (O‘quv darsliklariga asoslangan intizomli til o‘rganish va shaxsiy AI repetitori veb-platformasi / PWA)  
> **Uslub yo‘nalishi (Unslop Direction):** Tetik, aniq, iliq (Yoz kuni stol ustidagi muzli limonad stakani: sovuq firuza suv, limon bo‘lagi, kunduzgi yorug‘lik; Todoist aniqligi + Headspace iliqligi)  
> **Imzo detali (Signature):** Kitobdan olingan har bir iqtibos **limon-sariq marker (`#FFD43B` 55%)** bilan chizilgandek ajratiladi va yonida aniq sahifa raqami (`s. 28`) turadi.  
> **Figma Sahifasi:** `Discipline Learn` (`NO Auto-Layout`, koordinataga asoslangan freymlar va Master Componentlar)

---

## 1. Ranglar Palitrasi (Color Palette)

Uzoq vaqt PDF kitob o‘qish va mashq bajarishda ko‘zni charchatmaslik uchun barcha yuzalar juda och firuza-kulrang (`#F4F8F8`) va toza oq (`#FFFFFF`) tusda saqlanadi. Boy ranglar faqat ikkita "moment"da (kirish ekranidagi limon-muz sahnasi hamda kunlik progress kartasidagi limonad stakani) va imzo markerida ishlatiladi.

| Token Nomi | Toifa | HEX | RGB / Opacity | Vazifasi va Ishlatilish Joyi |
| :--- | :--- | :--- | :--- | :--- |
| `color-primary` | Brand / Accent | `#0E7C86` | `rgb(14, 124, 134)` / `100%` | Asosiy firuza aksent (oq matn bilan `4.9:1` kontrast): asosiy tugmalar, bajarilgan vazifa belgisi, faol havola |
| `color-secondary` | Signature / Marker | `#FFD43B` | `rgb(255, 212, 59)` / `55%` | **Imzo detali:** faqat PDF darslikdan olingan iqtibos satrlari ostidagi limon-sariq marker |
| `color-tertiary` | Deep Ink | `#0E1A1C` | `rgb(14, 26, 28)` / `100%` | Asosiy matn, sarlavhalar va yuqori kontrastli urg‘ular |
| `color-neutral` | Neutral / Muted | `#6B7E82` | `rgb(107, 126, 130)` / `100%` | Sahifa raqamlari (`s. 28`), vaqt belgilari, yordamchi ikonkalar (`18px`, `1.5px` stroke) |
| `bg-page` | Background | `#F4F8F8` | `rgb(244, 248, 248)` / `100%` | Asosiy sahifa foni (juda och firuza-kulrang) |
| `bg-sidebar` | Surface / Sidebar | `#EEF4F4` | `rgb(238, 244, 244)` / `100%` | Chap navigatsiya paneli foni |
| `bg-card` | Surface / Card | `#FFFFFF` | `rgb(255, 255, 255)` / `100%` | Kartochkalar, vazifalar ro‘yxati va repetitor muloqot oynasi |
| `bg-raised` | Surface / Raised | `#EAF1F1` | `rgb(234, 241, 241)` / `100%` | Talaba xabari pufakchasi, takrorlash intervallari (`3-kun`, `7-kun`) va klaviatura tugmalari (`Enter`) |
| `bg-accent-soft` | Surface / Active | `#E3F2F3` | `rgb(227, 242, 243)` / `100%` | Hozir bajarilayotgan faol vazifa qatori foni |
| `border-hairline` | Border / Divider | `#0E1A1C` | `rgba(14, 26, 28, 0.08)` / `8%` | Kartalar va qatorlar orasidagi nozik `1px` chegara |
| `text-primary` | Typography | `#0E1A1C` | `rgb(14, 26, 28)` / `100%` | Asosiy o‘quv matni va vazifa nomlari |
| `text-secondary` | Typography | `#475A5E` | `rgb(71, 90, 94)` / `100%` | Ikkilamchi tushuntirish matnlari va bajarilgan vazifalar |
| `status-positive` | Semantic / Right | `#16A34A` | `rgb(22, 163, 74)` / `100%` | To‘g‘ri tuzatilgan grammatik shakl (`had broken`) va ijobiy o‘zgarish (`+4% o'tgan oyga nisbatan`) |
| `status-negative` | Semantic / Wrong | `#DC2626` | `rgb(220, 38, 38)` / `100%` | O‘quvchi xato yozgan fe'l (`broke`, ustidan chizilgan) |

---

## 2. Tipografiya (Typography)

### Shrift Oilalari (Font Families)
1. **Display / Sarlavhalar:** `Bricolage Grotesque` (Medium `500`, SemiBold `600`) — Do‘stona, iliq va xarakterli sarlavha shrifti; yangi boshlovchiga ishtiyoq beradi, biroq o‘yinchoq ko‘rinmaydi.
2. **Interface & Body:** `Figtree` (Regular `400`, Medium `500`) — Kunlik vazifalar, darslik iqtiboslari va grammatik tushuntirishlar uchun toza, o‘qishga yengil shrift.

> **Unslop qoidasi:** `700–900` qalinliklar, `UPPERCASE` keng harfli yorliqlar va qiya (`italic`) urg‘ular ishlatilmaydi. Iyerarxiya faqat o‘lcham va rang orqali quriladi.

### Iyerarxiya va O‘lchamlar Jadvali

| Daraja | Shrift Oilasi | Vazni (Weight) | O‘lchami (px) | Qator oralig‘i (Line-Height) | Harf oralig‘i (Tracking) | Tailwind CSS Ekvivalenti |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Hero Headline (Kirish)** | `Bricolage Grotesque` | Medium (`500`) | `52px` | `56px` (`1.08`) | `-0.025em` | `font-display text-[52px] font-medium leading-[56px] tracking-[-0.025em]` |
| **Card Figure (3 / 5)** | `Bricolage Grotesque` | Medium (`500`) | `44px` | `48px` (`1.09`) | `-0.02em` | `font-display text-[44px] font-medium tabular-nums tracking-tight` |
| **Page Title (Bugun)** | `Bricolage Grotesque` | Medium (`500`) | `32px` | `36px` (`1.12`) | `-0.01em` | `font-display text-[32px] font-medium leading-9 tracking-tight` |
| **Section Heading (Reja)** | `Figtree` | Medium (`500`) | `16px` | `20px` (`1.25`) | `0em` | `font-sans text-base font-medium` |
| **Body / Explanation** | `Figtree` | Regular (`400`) | `14px` | `22px` (`1.57`) | `0em` | `font-sans text-sm font-normal leading-[22px]` |
| **Task Item Title** | `Figtree` | Medium (`500`) | `14px` | `20px` (`1.43`) | `0em` | `font-sans text-sm font-medium` |
| **Secondary / Subhead** | `Figtree` | Regular (`400`) | `13px` | `18px` (`1.38`) | `0em` | `font-sans text-[13px] text-[#475A5E]` |
| **Meta / Page Citation** | `Figtree` | Regular (`400`) | `12px` | `16px` (`1.33`) | `0em` | `font-sans text-xs tabular-nums text-[#6B7E82]` |

---

## 3. O‘lchamlar, Masofalar va To‘r (Spacing & Layout)

### Spacing Scale (`4px` qat'iy to‘r)
* `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`
* **Navigatsiya qatorlari:** `36px` balandlik, qatorlar orasida `4px` masofa (`y: 72, 112, 152, 192, 232`).
* **Vazifa qatorlari:** `56px` yagona balandlik, `1px` ichki hairline ajratkich.
* **Karta ichki chekinishi (padding):** `20px` dan `24px` gacha.

### Layout To‘r (5 ta Asosiy Freym)
1. **`Discipline Learn // Login Page` (`1440 × 960 px`, `id: "264:4107"`):**
   * **Chap ustun (`520px`, `left-panel`):** SVG logotip, til tanlash, `Kitobingizdan o'rganing.` sarlavhasi, 3 ta imkoniyat tegi va faqat Google orqali kirish kartasi (`Component // Google OAuth Button` instansi).
   * **O‘ng ustun (`920px`, `art-panel`) — to‘liq vektor:** `#097482` firuza fon, ustida Samarqand “yulduz va xoch” (khatam) naqshi (`120px` katak, 8 qirrali yulduzlar, oq `1.5px` chiziq `13%` shaffoflikda) va markazda `720px` kenglikdagi brend belgisi (zinapoya + kufiy naqshli kitob; to‘q qismlar `#23262B`, och qismlar `#E9EEEC`). Pastda belgining chap chetiga tekislangan `#23262B` (`96%`) kitob misoli kartasi. Foto va gradient overlay ishlatilmaydi.
2. **`Discipline Learn // Onboarding & Kirish` (`1440 × 960 px`, `x: 0, y: 0`, `id: "264:2107"`):**
   * Chap tomonda (`800px`) sokin `#F4F8F8` fonda sarlavha, 2 ta asosiy tugma va jonli dars namunasi; o‘ng tomonda (`640 × 928 px`) yuqoridan suratga olingan limon bo‘laklari, muz va firuza suv sahnasi.
3. **`Discipline Learn // Web App Workspace` (`1440 × 960 px`, `x: 1520, y: 0`, `id: "264:2177"`):**
   * **Sidebar (`256px`):** Brend belgisi, 5 ta bo‘lim, faol PDF kitob (`English Grammar in Use`, `Unit 58 / 145`, `40%`) va foydalanuvchi qatori.
   * **Markaziy ustun (`616px`):** `Bugungi reja (3 / 5)` kartasi (ichida muzli limonad stakani — `Moment 2`), 5 ta kunlik vazifa va `Bugun takrorlanadi` (`3-kun`, `7-kun`) ro‘yxati.
   * **O‘ng ustun (`480px`):** `Repetitor` — talabaning mashqdagi gapi, qisqa tuzatish (`somebody broke → had broken`), o‘zbek tilida qoida tushuntirishi, **limon-sariq markerli kitob iqtibosi (`Unit 14, B bo'lim · s. 28`)** va mustaqil tarjima mashqi.
4. **`Discipline Learn // Mobile PWA Screen` (`390 × 844 px`, `x: 3040, y: 0`, `id: "264:2364"`):**
   * Smartfon brauzerida (QR-kod orqali) ochiladigan ixcham mobil ko‘rinish.
5. **`Discipline Learn // Stitch Design Info Board` (`1380 × 840 px`, `x: 3510, y: 0`, `id: "264:2446"`):**
   * Rasmiy `1380 × 840 px` Bento spetsifikatsiya doskasi.
6. **`Discipline Learn // Today Card Variants` (`1440 × 820 px`, `x: 1520, y: 1040`, `id: "294:239"`):**
   * **Variant A (Intizom Zanjiri):** Kunlik `3/5` maqsad, 5 ta segmentli progress va 14 kunlik uzluksiz zanjir (haftalik Du-Ya faollik nuqtalari).
   * **Variant B (Darslik & Ebbinghaus):** Faol kitob paneli (`English Grammar in Use · Unit 14 · s. 28`), `60%` o'zlashtirish va 1-3-7 takrorlash xotira saqlanish darajasi (`88%`).
   * **Variant C (Brend Zinapoyasi):** Logodagi 5 pog'onali intizom zinapoyasining vizual modeli, B2 daraja ko'rsatkichi va keyingi qadam (`4-qadam: Repetitor tahlili`) harakat tugmasi.
7. **`Logo` (`1080 × 1080 px`, `x: 281, y: 1362`, `id: "264:4079"`):**
   * Rasmiy vektor (`SVG`) logotip: 5 pog‘onali intizom zinapoyasi (`#097482` va `#23262B`) hamda Samarqand kufiy naqshli kitob muqovasi.

### Nested Border Radius
* **Kichik teg va klaviatura tugmasi (`Enter`, `3-kun`):** `4px – 6px`
* **Tugma, input va navigatsiya qatori:** `8px – 12px`
* **Ichki bloklar va xabar pufakchalari:** `12px`
* **Asosiy kartalar (`Card / Google Authentication`, `Card / Today`, `Card / Plan`, `Card / Repetitor`):** `16px – 20px`

---

## 4. Effektlar va Soyalar (Shadows & Elevation)

* **Asosiy kartalar:** Qavatlar (`#F4F8F8` ustida `#FFFFFF`) va `1px` `rgba(14, 26, 28, 0.08)` hairline chegarasi bilan ajratiladi.
* **Login & Onboarding Cards:** `0px 8px 24px rgba(14, 26, 28, 0.05)` mayin neytral soya.
* **Motion:** Barcha o‘tishlar uchun yagona egri chiziq: `cubic-bezier(0.22, 1, 0.36, 1)`, hover `150ms`, kirish `320ms`.

---

## 5. Komponentlar va Ikonkalar (Components & Icons)

### Master Components (`figma.createComponent()`)
1. `Component // Task Row` (`616 × 56 px`) — Firuza tasdiq belgisi, vazifa nomi va sahifa ko‘rsatkichi.
2. `Component // Textbook Quote Marker` (`400 × 56 px`) — Kitob sahifasi (`s. 28`) va `#FFD43B` limon-sariq marker bilan ajratilgan iqtibos.
3. `Component // Primary Button` (`168 × 44 px`) — `#0E7C86` firuza tugma.
4. `Component // Google OAuth Button` (`400 × 56 px`) — `#0E1A1C` asosiy tugma, `36 × 36 px` oq fonda rasmiy 4-rangli Google `G` SVG belgisi va o‘ng yo‘nalish strelkasi.

### Ikonkalar To‘plami
* **To‘plam:** Rasmiy SVG Brend Logotipi (`#097482` / `#23262B`), rasmiy Google `G` 4-rangli SVG vektori hamda Lucide Icons (`14px–18px`, `1.5px–1.8px` stroke).
