/**
 * Discipline Learn — Production Mobile Web App Controller
 * - Login-first authentication flow with persisted Google user profile
 * - 100% responsive mobile viewport (no fixed 390×844 scaling)
 * - Interactive persisted state for Bugun (Reja), Kitob, Repetitor, and Takrorlash
 */

const STORAGE_KEYS = {
  USER: "dl_auth_user_v1",
  GOOGLE_CLIENT_ID: "dl_google_client_id_v1",
  TASKS: "dl_daily_tasks_v1",
  BOOK: "dl_active_book_v1",
  UNIT_INDEX: "dl_unit_idx_v1",
  REP_INDEX: "dl_rep_idx_v1",
  REVIEWS: "dl_reviews_v1",
};

// Default Google OAuth Web Client ID (can also be overridden via ?client_id= or modal)
const DEFAULT_GOOGLE_CLIENT_ID = "";

const body = document.body;
const metaThemeColor = document.getElementById("meta-theme-color");
const screenApp = document.getElementById("screen-app");

// Auth & Profile DOM
const googleLoginBtn = document.getElementById("btn-google-login");
const googleBtnLabel = document.getElementById("google-btn-label");
const googleAuthSheet = document.getElementById("google-auth-sheet");
const closeAuthSheetBtn = document.getElementById("btn-close-auth-sheet");
const googleAuthForm = document.getElementById("google-auth-form");
const authClientIdInput = document.getElementById("auth-client-id-input");

const avatarBtn = document.getElementById("btn-avatar");
const avatarInitialsEl = document.getElementById("avatar-initials");
const profileSheet = document.getElementById("profile-sheet");
const closeProfileSheetBtn = document.getElementById("btn-close-profile-sheet");
const profileSheetAvatar = document.getElementById("profile-sheet-avatar");
const profileSheetName = document.getElementById("profile-sheet-name");
const profileSheetEmail = document.getElementById("profile-sheet-email");
const profileStatPct = document.getElementById("profile-stat-pct");
const profileStatDays = document.getElementById("profile-stat-days");
const logoutBtn = document.getElementById("btn-logout");

// Navigation DOM
const bottomNavTabs = document.querySelectorAll(".bottom-nav__tab[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel[data-tab-panel]");

// Tab 1: Bugun DOM
const progressDateEl = document.getElementById("progress-date");
const progressValueEl = document.getElementById("progress-value");
const planCardEl = document.getElementById("plan-card");
const addTaskBtn = document.getElementById("btn-add-task");
const addTaskSheet = document.getElementById("add-task-sheet");
const closeTaskSheetBtn = document.getElementById("btn-close-task-sheet");
const addTaskForm = document.getElementById("add-task-form");
const newTaskTitleInput = document.getElementById("new-task-title");
const newTaskSubInput = document.getElementById("new-task-sub");

// Tab 2: Kitob DOM
const pdfUploadInput = document.getElementById("pdf-upload-input");
const activeBookTitleEl = document.getElementById("active-book-title");
const activeBookAuthorEl = document.getElementById("active-book-author");
const bookUnitCounterEl = document.getElementById("book-unit-counter");
const bookProgressPctEl = document.getElementById("book-progress-pct");
const bookProgressFillEl = document.getElementById("book-progress-fill");
const prevUnitBtn = document.getElementById("btn-prev-unit");
const nextUnitBtn = document.getElementById("btn-next-unit");
const readerUnitMetaEl = document.getElementById("reader-unit-meta");
const readerUnitBadgeEl = document.getElementById("reader-unit-badge");
const readerUnitPageEl = document.getElementById("reader-unit-page");
const readerUnitHeadingEl = document.getElementById("reader-unit-heading");
const readerUnitDescEl = document.getElementById("reader-unit-desc");
const readerQuoteSourceEl = document.getElementById("reader-quote-source");
const readerQuoteLine1El = document.getElementById("reader-quote-line1");
const readerQuoteLine2El = document.getElementById("reader-quote-line2");
const practiceUnitBtn = document.getElementById("btn-practice-unit");

// Tab 3: Repetitor DOM
const nextExerciseBtn = document.getElementById("btn-next-exercise");
const repExerciseLabelEl = document.getElementById("rep-exercise-label");
const repStudentSentenceEl = document.getElementById("rep-student-sentence");
const repCorrContextEl = document.getElementById("rep-corr-context");
const repCorrWrongEl = document.getElementById("rep-corr-wrong");
const repCorrRightEl = document.getElementById("rep-corr-right");
const repExplanationEl = document.getElementById("rep-explanation");
const repQuoteSourceEl = document.getElementById("rep-quote-source");
const repQuoteLine1El = document.getElementById("rep-quote-line1");
const repQuoteLine2El = document.getElementById("rep-quote-line2");
const practiceLabelEl = document.getElementById("practice-label");
const practicePromptEl = document.getElementById("practice-prompt");
const repetitorForm = document.getElementById("repetitor-form");
const composerInput = document.getElementById("composer-input");
const micBtn = document.getElementById("btn-mic");

// Tab 4: Takrorlash DOM
const reviewStartBtn = document.getElementById("btn-review-start");
const reviewStartLabelEl = document.getElementById("review-start-label");
const reviewListCardEl = document.getElementById("review-list-card");
const flashcardSessionEl = document.getElementById("flashcard-session");
const fcBadgeEl = document.getElementById("fc-badge");
const fcCounterEl = document.getElementById("fc-counter");
const fcWrongEl = document.getElementById("fc-wrong");
const fcAnswerEl = document.getElementById("fc-answer");
const fcRightEl = document.getElementById("fc-right");
const fcRuleEl = document.getElementById("fc-rule");
const fcRevealBtn = document.getElementById("btn-fc-reveal");
const fcGradeRow = document.getElementById("fc-grade-row");
const fcHardBtn = document.getElementById("btn-fc-hard");
const fcGoodBtn = document.getElementById("btn-fc-good");

const CHECK_SVG_DONE = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="10" fill="#557329"/>
    <path d="M16 4L7.75 16L4 10.5455" stroke-width="1.13" stroke-linecap="round" stroke="white"/>
  </svg>
`;

const WAVE_MARKUP = `
  <span class="task-water-surface" aria-hidden="true">
    <svg class="task-wave-svg task-wave-svg--back" viewBox="0 0 668 54" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 26 C 83 20, 167 32, 250 26 C 292 23, 315 25, 334 26 C 417 20, 501 32, 584 26 C 626 23, 649 25, 668 26 L 668 54 L 0 54 Z" fill="#D8EEEC" fill-opacity="0.9"/>
    </svg>
    <svg class="task-wave-svg task-wave-svg--front" viewBox="0 0 668 54" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 27 C 76 21, 142 33, 218 27 C 276 22, 305 25, 334 27 C 410 21, 476 33, 552 27 C 610 22, 639 25, 668 27 L 668 54 L 0 54 Z" fill="#B5DAD9"/>
      <path d="M0 27 C 76 21, 142 33, 218 27 C 276 22, 305 25, 334 27 C 410 21, 476 33, 552 27 C 610 22, 639 25, 668 27" stroke="#7DB9BA" stroke-opacity="0.55" stroke-width="2.5"/>
    </svg>
  </span>
`;

/**
 * 1. Format Current Uzbek Date
 */
function formatUzbekDate() {
  const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  const months = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"
  ];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()}-${months[now.getMonth()]}`;
}

if (progressDateEl) {
  progressDateEl.textContent = formatUzbekDate();
}

/**
 * 2. Real Google OAuth 2.0 Verification (Google Identity Services)
 */
function getInitials(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getGoogleClientId() {
  const urlParams = new URLSearchParams(window.location.search);
  const fromQuery = urlParams.get("client_id");
  if (fromQuery && fromQuery.includes(".apps.googleusercontent.com")) {
    localStorage.setItem(STORAGE_KEYS.GOOGLE_CLIENT_ID, fromQuery.trim());
    return fromQuery.trim();
  }
  return (
    localStorage.getItem(STORAGE_KEYS.GOOGLE_CLIENT_ID) ||
    DEFAULT_GOOGLE_CLIENT_ID ||
    ""
  ).trim();
}

function setViewMode(mode) {
  body.setAttribute("data-view-mode", mode);
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", mode === "login" ? "#0e7c86" : "#f4f8f8");
  }
}

function applyUserToUI(user) {
  const initials = user.initials || getInitials(user.name);
  if (avatarBtn) {
    avatarBtn.setAttribute("aria-label", `${user.name} profili`);
    if (user.picture) {
      avatarBtn.innerHTML = `<img src="${user.picture}" alt="${user.name}" referrerpolicy="no-referrer" />`;
    } else {
      avatarBtn.innerHTML = `<span id="avatar-initials">${initials}</span>`;
    }
  }
  if (profileSheetAvatar) {
    if (user.picture) {
      profileSheetAvatar.innerHTML = `<img src="${user.picture}" alt="${user.name}" referrerpolicy="no-referrer" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />`;
    } else {
      profileSheetAvatar.textContent = initials;
    }
  }
  if (profileSheetName) profileSheetName.textContent = user.name;
  if (profileSheetEmail) profileSheetEmail.textContent = user.email;
  const consistency = user.consistency || 94;
  const activeDays = user.activeDays || 1;
  if (progressValueEl) progressValueEl.textContent = `${consistency}%`;
  if (profileStatPct) profileStatPct.textContent = `${consistency}%`;
  if (profileStatDays) profileStatDays.textContent = `${activeDays} kun`;
}

function loadUserSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      setViewMode("login");
      return null;
    }
    const user = JSON.parse(raw);
    applyUserToUI(user);
    setViewMode("app");
    return user;
  } catch {
    setViewMode("login");
    return null;
  }
}

function startRealGoogleSignIn(clientId) {
  if (!window.google?.accounts?.oauth2) {
    alert("Google Identity Services yuklanmoqda, 1 soniyadan so‘ng qayta bosing.");
    return;
  }

  if (googleBtnLabel) googleBtnLabel.textContent = "Google bilan bog‘lanmoqda...";

  const tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: "openid email profile",
    callback: async (tokenResponse) => {
      if (tokenResponse.error) {
        if (googleBtnLabel) googleBtnLabel.textContent = "Google hisobi orqali davom etish";
        return;
      }
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error("Google userinfo xatosi");
        const profile = await res.json();
        const user = {
          sub: profile.sub,
          name: profile.name || profile.given_name || "Google Foydalanuvchi",
          email: profile.email || "",
          picture: profile.picture || "",
          initials: getInitials(profile.name || profile.email),
          consistency: 100,
          activeDays: 1,
          lastLogin: new Date().toISOString().slice(0, 10),
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        applyUserToUI(user);
        if (googleBtnLabel) googleBtnLabel.textContent = "Google hisobi orqali davom etish";
        setViewMode("app");
      } catch {
        if (googleBtnLabel) googleBtnLabel.textContent = "Google hisobi orqali davom etish";
      }
    },
  });

  tokenClient.requestAccessToken({ prompt: "select_account" });
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    const clientId = getGoogleClientId();
    if (clientId) {
      startRealGoogleSignIn(clientId);
    } else if (googleAuthSheet) {
      googleAuthSheet.hidden = false;
      setTimeout(() => authClientIdInput?.focus(), 60);
    }
  });
}

if (closeAuthSheetBtn && googleAuthSheet) {
  closeAuthSheetBtn.addEventListener("click", () => {
    googleAuthSheet.hidden = true;
  });
}

if (googleAuthForm) {
  googleAuthForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const clientId = authClientIdInput.value.trim();
    if (!clientId) return;
    localStorage.setItem(STORAGE_KEYS.GOOGLE_CLIENT_ID, clientId);
    googleAuthSheet.hidden = true;
    startRealGoogleSignIn(clientId);
  });
}

if (avatarBtn && profileSheet) {
  avatarBtn.addEventListener("click", () => {
    profileSheet.hidden = false;
  });
}

if (closeProfileSheetBtn && profileSheet) {
  closeProfileSheetBtn.addEventListener("click", () => {
    profileSheet.hidden = true;
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.USER);
    if (raw && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    if (profileSheet) profileSheet.hidden = true;
    setViewMode("login");
  });
}

/**
 * 3. Bottom Navigation Dock — 4 Separate Views
 */
function setActiveDockTab(tabName) {
  if (!screenApp) return;
  screenApp.dataset.activeTab = tabName;

  bottomNavTabs.forEach((t) => {
    const isMatch = t.dataset.tab === tabName;
    t.classList.toggle("is-active", isMatch);
    t.setAttribute("aria-selected", String(isMatch));
    if (isMatch) {
      t.setAttribute("aria-current", "page");
    } else {
      t.removeAttribute("aria-current");
    }
  });

  tabPanels.forEach((panel) => {
    const isMatch = panel.dataset.tabPanel === tabName;
    panel.classList.toggle("is-active", isMatch);
    if (isMatch) {
      panel.removeAttribute("hidden");
    } else {
      panel.setAttribute("hidden", "");
    }
  });
}

bottomNavTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveDockTab(tab.dataset.tab);
  });
});

/**
 * 4. Tab 1: Daily Plan (Reja) with Persisted State & Liquid Wave Sync
 */
const DEFAULT_TASKS = [
  { id: 1, title: "Unit 14 qoidasini o‘qish: Past Perfect", sub: "12 daq · s. 28", done: true },
  { id: 2, title: "14.1-mashq, 8 ta gap", sub: "8 / 8 to‘g‘ri · s. 29", done: true },
  { id: 3, title: "14.2-mashq, 6 ta gap", sub: "4 / 6 to‘g‘ri · 2 ta xato takrorlashga qo‘shildi", done: true },
  { id: 4, title: "2 ta xatoni repetitor bilan ko‘rib chiqish", sub: "5 daq · s. 28", done: false },
  { id: 5, title: "Past Perfect bilan o‘zingiz 3 ta gap yozing", sub: "10 daq · yozma", done: false },
];

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    return raw ? JSON.parse(raw) : DEFAULT_TASKS;
  } catch {
    return DEFAULT_TASKS;
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

let dailyTasks = loadTasks();

function renderTasks() {
  if (!planCardEl) return;
  let foundCurrent = false;
  planCardEl.innerHTML = "";

  dailyTasks.forEach((task) => {
    const isCurrent = !task.done && !foundCurrent;
    if (isCurrent) foundCurrent = true;
    const stateClass = task.done
      ? "task-row--done"
      : isCurrent
      ? "task-row--current"
      : "task-row--future";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `task-row ${stateClass}`;
    btn.dataset.taskId = String(task.id);
    btn.setAttribute("aria-pressed", String(task.done));

    btn.innerHTML = `
      ${isCurrent ? WAVE_MARKUP : ""}
      <span class="task-row__check ${task.done ? "task-row__check--done" : isCurrent ? "task-row__check--current" : "task-row__check--future"}" aria-hidden="true">
        ${task.done ? CHECK_SVG_DONE : ""}
      </span>
      <span class="task-row__body">
        <span class="task-row__title">${task.title}</span>
        <span class="task-row__sub">${task.sub}</span>
      </span>
      <span class="task-row__badge">Hozir</span>
    `;

    btn.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks(dailyTasks);
      renderTasks();
    });

    planCardEl.appendChild(btn);
  });
}

renderTasks();

if (addTaskBtn && addTaskSheet) {
  addTaskBtn.addEventListener("click", () => {
    addTaskSheet.hidden = false;
    setTimeout(() => newTaskTitleInput?.focus(), 60);
  });
}

if (closeTaskSheetBtn && addTaskSheet) {
  closeTaskSheetBtn.addEventListener("click", () => {
    addTaskSheet.hidden = true;
  });
}

if (addTaskForm) {
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = newTaskTitleInput.value.trim();
    const sub = newTaskSubInput.value.trim() || "10 daq · mustaqil";
    if (!title) return;
    dailyTasks.push({
      id: Date.now(),
      title,
      sub,
      done: false,
    });
    saveTasks(dailyTasks);
    renderTasks();
    newTaskTitleInput.value = "";
    newTaskSubInput.value = "";
    addTaskSheet.hidden = true;
  });
}

/**
 * 5. Tab 2: Kitob — Interactive Multi-Unit Reader & PDF Upload
 */
const BOOK_UNITS = [
  {
    unitNum: 14,
    page: "s. 28",
    badge: "Unit 14 · B bo‘lim",
    heading: "Past perfect (I had done)",
    desc: "O‘tgan zamondagi biror voqeadan oldinroq sodir bo‘lib tugagan ish-harakat uchun <strong>had + past participle</strong> (<em>had gone, had seen, had broken</em>) ishlatiladi.",
    source: "Kitobda: Unit 14, B bo‘lim · s. 28",
    line1: "When we got home last night, we found",
    line2: "that somebody had broken into the flat.",
    pct: 40,
  },
  {
    unitNum: 15,
    page: "s. 30",
    badge: "Unit 15 · A bo‘lim",
    heading: "Past perfect continuous (I had been doing)",
    desc: "O‘tgan zamondagi biror voqeagacha davom etib kelgan jarayon uchun <strong>had been + V-ing</strong> ishlatiladi.",
    source: "Kitobda: Unit 15, A bo‘lim · s. 30",
    line1: "When the boys came into the house, their",
    line2: "clothes were dirty. They had been playing football.",
    pct: 44,
  },
  {
    unitNum: 7,
    page: "s. 14",
    badge: "Unit 7 · B bo‘lim",
    heading: "Present perfect vs Past simple",
    desc: "Aniq tugagan o‘tgan vaqt (<em>yesterday, last year, in 2020</em>) ko‘rsatilganda Present Perfect emas, faqat <strong>Past Simple</strong> ishlatiladi.",
    source: "Kitobda: Unit 7, B bo‘lim · s. 14",
    line1: "Do not use the present perfect (have done)",
    line2: "together with a finished time (yesterday, last year).",
    pct: 25,
  },
  {
    unitNum: 4,
    page: "s. 8",
    badge: "Unit 4 · A bo‘lim",
    heading: "State verbs (I know / I like)",
    desc: "Holat va fikr fe’llari (<em>know, like, want, understand, remember</em>) Continuous (-ing) zamonlarida ishlatilmaydi.",
    source: "Kitobda: Unit 4, A bo‘lim · s. 8",
    line1: "These verbs are not normally used in",
    line2: "continuous forms: I know the answer now.",
    pct: 15,
  },
];

let currentUnitIdx = Number(localStorage.getItem(STORAGE_KEYS.UNIT_INDEX) || 0) % BOOK_UNITS.length;

function renderCurrentUnit() {
  const u = BOOK_UNITS[currentUnitIdx];
  if (!u) return;
  if (readerUnitMetaEl) readerUnitMetaEl.textContent = `Unit ${u.unitNum} · ${u.page}`;
  if (readerUnitBadgeEl) readerUnitBadgeEl.textContent = u.badge;
  if (readerUnitPageEl) readerUnitPageEl.textContent = u.page;
  if (readerUnitHeadingEl) readerUnitHeadingEl.textContent = u.heading;
  if (readerUnitDescEl) readerUnitDescEl.innerHTML = u.desc;
  if (readerQuoteSourceEl) readerQuoteSourceEl.textContent = u.source;
  if (readerQuoteLine1El) readerQuoteLine1El.textContent = u.line1;
  if (readerQuoteLine2El) readerQuoteLine2El.textContent = u.line2;
  if (bookUnitCounterEl) bookUnitCounterEl.textContent = `Unit ${u.unitNum} / 145`;
  if (bookProgressPctEl) bookProgressPctEl.textContent = `${u.pct}%`;
  if (bookProgressFillEl) bookProgressFillEl.style.width = `${u.pct}%`;
}

renderCurrentUnit();

if (prevUnitBtn) {
  prevUnitBtn.addEventListener("click", () => {
    currentUnitIdx = (currentUnitIdx - 1 + BOOK_UNITS.length) % BOOK_UNITS.length;
    localStorage.setItem(STORAGE_KEYS.UNIT_INDEX, String(currentUnitIdx));
    renderCurrentUnit();
  });
}

if (nextUnitBtn) {
  nextUnitBtn.addEventListener("click", () => {
    currentUnitIdx = (currentUnitIdx + 1) % BOOK_UNITS.length;
    localStorage.setItem(STORAGE_KEYS.UNIT_INDEX, String(currentUnitIdx));
    renderCurrentUnit();
  });
}

if (practiceUnitBtn) {
  practiceUnitBtn.addEventListener("click", () => {
    currentRepIdx = currentUnitIdx % REPETITOR_EXERCISES.length;
    renderRepetitorExercise();
    setActiveDockTab("repetitor");
  });
}

if (pdfUploadInput) {
  pdfUploadInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const authorMeta = `Yuklangan PDF · ${sizeMb} MB`;
    if (activeBookTitleEl) activeBookTitleEl.textContent = cleanName;
    if (activeBookAuthorEl) activeBookAuthorEl.textContent = authorMeta;
    localStorage.setItem(STORAGE_KEYS.BOOK, JSON.stringify({ title: cleanName, author: authorMeta }));
  });
}

try {
  const savedBook = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOK) || "null");
  if (savedBook?.title && activeBookTitleEl) activeBookTitleEl.textContent = savedBook.title;
  if (savedBook?.author && activeBookAuthorEl) activeBookAuthorEl.textContent = savedBook.author;
} catch {
  // Ignore invalid storage
}

/**
 * 6. Tab 3: Repetitor — Multi-Exercise Interactive Grammar Coach
 */
const REPETITOR_EXERCISES = [
  {
    label: "14.2-mashq, 4-gap (1 / 4)",
    studentSentence: "When we got home last night, we found that somebody broke into the flat.",
    context: "somebody",
    wrong: "broke",
    right: "had broken",
    explanation:
      "Uyga kelishingizdan oldin kimdir kvartiraga kirib bo‘lgan edi. O‘tgan zamondagi voqeadan oldinroq tugagan ish uchun Past Perfect ishlatiladi: had + fe’lning 3-shakli.",
    source: "Kitobda: Unit 14, B bo‘lim · s. 28",
    line1: "When we got home last night, we found",
    line2: "that somebody had broken into the flat.",
    prompt: "Men vokzalga yetib kelganimda, poyezd allaqachon ketib bo‘lgan edi.",
    regex: /\bhad\s+(already\s+)?(left|gone|departed)\b/i,
    sample: "When I arrived at the station, the train had already left.",
    hint: "Maslahat · had + fe’lning 3-shaklini (had left) ishlating",
  },
  {
    label: "15.1-mashq, 2-gap (2 / 4)",
    studentSentence: "The ground was very wet. It rained all night.",
    context: "It",
    wrong: "rained",
    right: "had been raining",
    explanation:
      "Yer ho‘l bo‘lishidan oldin tun bo‘yi yomg‘ir yog‘ish jarayoni davom etgan. Jarayon davomiyligi uchun Past Perfect Continuous (had been + V-ing) ishlatiladi.",
    source: "Kitobda: Unit 15, A bo‘lim · s. 30",
    line1: "When I looked out of the window,",
    line2: "it had been raining.",
    prompt: "U juda charchagan edi, chunki kun bo‘yi qattiq ishlagan edi.",
    regex: /\bhad\s+been\s+working\b/i,
    sample: "He was very tired because he had been working hard all day.",
    hint: "Maslahat · had been working birikmasini ishlating",
  },
  {
    label: "7.3-mashq, 5-gap (3 / 4)",
    studentSentence: "She has gone to Paris last year with her family.",
    context: "She",
    wrong: "has gone",
    right: "went",
    explanation:
      "Gapda 'last year' (o‘tgan yili — tugagan aniq vaqt) qatnashgani uchun Present Perfect emas, Past Simple (went) ishlatilishi shart.",
    source: "Kitobda: Unit 7, B bo‘lim · s. 14",
    line1: "Do not use the present perfect (have done)",
    line2: "together with a finished time (yesterday, last year).",
    prompt: "Men kecha ushbu kitobning 14-bo‘limini tugatdim.",
    regex: /\b(finished|completed|read)\b/i,
    sample: "I finished Unit 14 of this book yesterday.",
    hint: "Maslahat · kecha (yesterday) bilan Past Simple (finished) ishlating",
  },
  {
    label: "4.2-mashq, 1-gap (4 / 4)",
    studentSentence: "Wait a moment, I am knowing the answer to this question now.",
    context: "I",
    wrong: "am knowing",
    right: "know",
    explanation:
      "'Know' (bilmoq) harakat emas, balki holat fe’li (state verb) hisoblanadi, shuning uchun -ing olmaydi.",
    source: "Kitobda: Unit 4, A bo‘lim · s. 8",
    line1: "These verbs are not normally used in",
    line2: "continuous forms: I know the answer now.",
    prompt: "Men hozir bu grammatik qoidani juda yaxshi tushunyapman.",
    regex: /\bI\s+(really\s+|very\s+well\s+)?understand\b/i,
    sample: "I understand this grammar rule very well now.",
    hint: "Maslahat · 'understand' holat fe’li bo‘lgani uchun 'I understand' deb yozing",
  },
];

let currentRepIdx = Number(localStorage.getItem(STORAGE_KEYS.REP_INDEX) || 0) % REPETITOR_EXERCISES.length;

function renderRepetitorExercise() {
  const ex = REPETITOR_EXERCISES[currentRepIdx];
  if (!ex) return;
  if (repExerciseLabelEl) repExerciseLabelEl.textContent = ex.label;
  if (repStudentSentenceEl) repStudentSentenceEl.textContent = ex.studentSentence;
  if (repCorrContextEl) repCorrContextEl.textContent = ex.context;
  if (repCorrWrongEl) repCorrWrongEl.textContent = ex.wrong;
  if (repCorrRightEl) repCorrRightEl.textContent = ex.right;
  if (repExplanationEl) repExplanationEl.textContent = ex.explanation;
  if (repQuoteSourceEl) repQuoteSourceEl.textContent = ex.source;
  if (repQuoteLine1El) repQuoteLine1El.textContent = ex.line1;
  if (repQuoteLine2El) repQuoteLine2El.textContent = ex.line2;
  if (practiceLabelEl) {
    practiceLabelEl.textContent = "Endi o‘zingiz tarjima qiling";
    practiceLabelEl.style.color = "";
  }
  if (practicePromptEl) practicePromptEl.textContent = ex.prompt;
  if (composerInput) composerInput.value = "";
}

renderRepetitorExercise();

if (nextExerciseBtn) {
  nextExerciseBtn.addEventListener("click", () => {
    currentRepIdx = (currentRepIdx + 1) % REPETITOR_EXERCISES.length;
    localStorage.setItem(STORAGE_KEYS.REP_INDEX, String(currentRepIdx));
    renderRepetitorExercise();
  });
}

if (micBtn && composerInput) {
  micBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      micBtn.classList.add("is-recording");
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || "";
        composerInput.value = transcript;
        micBtn.classList.remove("is-recording");
      };
      recognition.onerror = () => micBtn.classList.remove("is-recording");
      recognition.onend = () => micBtn.classList.remove("is-recording");
      recognition.start();
    } else {
      const ex = REPETITOR_EXERCISES[currentRepIdx];
      composerInput.value = ex ? ex.sample : "";
      composerInput.focus();
    }
  });
}

if (repetitorForm && composerInput) {
  repetitorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = composerInput.value.trim();
    if (!val) {
      composerInput.focus();
      return;
    }

    const ex = REPETITOR_EXERCISES[currentRepIdx];
    const isCorrect = ex ? ex.regex.test(val) : false;

    if (practiceLabelEl && practicePromptEl && ex) {
      if (isCorrect) {
        practiceLabelEl.textContent = "Barakalla · Qoida to‘g‘ri qo‘llandi!";
        practiceLabelEl.style.color = "#16a34a";
        practicePromptEl.textContent = `✓ ${val}`;
      } else {
        practiceLabelEl.textContent = ex.hint;
        practiceLabelEl.style.color = "#0e7c86";
        practicePromptEl.textContent = `Namuna: ${ex.sample}`;
      }
    }
    composerInput.value = "";
  });
}

/**
 * 7. Tab 4: Takrorlash — Spaced Repetition Flashcard Session
 */
const FLASHCARDS = [
  {
    id: 1,
    badge: "3-kun · Unit 4",
    wrong: "I am knowing",
    right: "I know the answer now",
    rule: "State verbs (know, like, understand, want) Continuous (-ing) zamonida ishlatilmaydi.",
  },
  {
    id: 2,
    badge: "7-kun · Unit 7",
    wrong: "She has gone to Paris last year",
    right: "She went to Paris last year",
    rule: "Aniq tugagan vaqt (last year, yesterday) bilan faqat Past Simple ishlatiladi.",
  },
  {
    id: 3,
    badge: "1-kun · Unit 14",
    wrong: "somebody broke into the flat",
    right: "somebody had broken into the flat",
    rule: "O‘tgan zamondagi voqeadan oldinroq tugagan ish uchun Past Perfect (had + V3) ishlatiladi.",
  },
];

let fcIndex = 0;
let isReviewSessionOpen = false;

function renderFlashcard() {
  const card = FLASHCARDS[fcIndex];
  if (!card) return;
  if (fcBadgeEl) fcBadgeEl.textContent = card.badge;
  if (fcCounterEl) fcCounterEl.textContent = `${fcIndex + 1} / ${FLASHCARDS.length}`;
  if (fcWrongEl) fcWrongEl.textContent = card.wrong;
  if (fcRightEl) fcRightEl.textContent = card.right;
  if (fcRuleEl) fcRuleEl.textContent = card.rule;
  if (fcAnswerEl) fcAnswerEl.hidden = true;
  if (fcRevealBtn) fcRevealBtn.hidden = false;
  if (fcGradeRow) fcGradeRow.hidden = true;
}

function toggleReviewSession(forceOpen) {
  isReviewSessionOpen = typeof forceOpen === "boolean" ? forceOpen : !isReviewSessionOpen;
  if (reviewListCardEl) reviewListCardEl.hidden = isReviewSessionOpen;
  if (flashcardSessionEl) flashcardSessionEl.hidden = !isReviewSessionOpen;
  if (reviewStartLabelEl) {
    reviewStartLabelEl.textContent = isReviewSessionOpen ? "Ro‘yxatga qaytish" : "Boshlash";
  }
  if (isReviewSessionOpen) {
    fcIndex = 0;
    renderFlashcard();
  }
}

if (reviewStartBtn) {
  reviewStartBtn.addEventListener("click", () => toggleReviewSession());
}

document.querySelectorAll(".review-item").forEach((item, idx) => {
  item.addEventListener("click", () => {
    toggleReviewSession(true);
    fcIndex = idx % FLASHCARDS.length;
    renderFlashcard();
  });
});

if (fcRevealBtn) {
  fcRevealBtn.addEventListener("click", () => {
    if (fcAnswerEl) fcAnswerEl.hidden = false;
    fcRevealBtn.hidden = true;
    if (fcGradeRow) fcGradeRow.hidden = false;
  });
}

function advanceFlashcard() {
  if (fcIndex + 1 < FLASHCARDS.length) {
    fcIndex += 1;
    renderFlashcard();
  } else {
    toggleReviewSession(false);
    if (reviewStartLabelEl) reviewStartLabelEl.textContent = "Yakunlandi ✓";
  }
}

if (fcHardBtn) fcHardBtn.addEventListener("click", advanceFlashcard);
if (fcGoodBtn) fcGoodBtn.addEventListener("click", advanceFlashcard);

// Initialize Auth State on Load
loadUserSession();
