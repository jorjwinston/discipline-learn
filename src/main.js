/**
 * Discipline Learn — Real PDF-First AI Study Plan & Tutor Controller
 * - Per-user isolated workspace (`dl_workspace_v2_<username>`)
 * - Clean empty state on first login (no hardcoded fake books/tasks)
 * - Real client-side PDF text extraction via PDF.js
 * - Gemini 3.8 Flash integration via `/api/ai` + intelligent PDF content parser fallback
 */

const STORAGE_KEYS = {
  USER: "dl_auth_user_v2",
  ACCOUNTS: "dl_accounts_v2",
  API_KEY: "dl_gemini_api_key_v1",
};

if (window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

const body = document.body;
const metaThemeColor = document.getElementById("meta-theme-color");
const screenApp = document.getElementById("screen-app");

// Auth & Profile DOM
const loginForm = document.getElementById("login-form");
const loginUsernameInput = document.getElementById("login-username");
const loginPasswordInput = document.getElementById("login-password");
const togglePassBtn = document.getElementById("btn-toggle-pass");
const loginErrorEl = document.getElementById("login-error");

const avatarBtn = document.getElementById("btn-avatar");
const profileSheet = document.getElementById("profile-sheet");
const closeProfileSheetBtn = document.getElementById("btn-close-profile-sheet");
const profileSheetAvatar = document.getElementById("profile-sheet-avatar");
const profileSheetName = document.getElementById("profile-sheet-name");
const profileSheetEmail = document.getElementById("profile-sheet-email");
const profileStatPct = document.getElementById("profile-stat-pct");
const profileStatDays = document.getElementById("profile-stat-days");
const geminiApiKeyInput = document.getElementById("gemini-api-key-input");
const saveApiKeyBtn = document.getElementById("btn-save-api-key");
const apiKeyStatusHint = document.getElementById("api-key-status-hint");
const resetBookBtn = document.getElementById("btn-reset-book");
const logoutBtn = document.getElementById("btn-logout");

// Global PDF Upload Input & Trigger Buttons
const pdfUploadInput = document.getElementById("pdf-upload-input");
const uploadFromPlanBtn = document.getElementById("btn-upload-from-plan");
const uploadFromKitobBtn = document.getElementById("btn-upload-from-kitob");
const uploadFromKitobCardBtn = document.getElementById("btn-upload-from-kitob-card");
const uploadFromRepBtn = document.getElementById("btn-upload-from-rep");
const uploadFromRevBtn = document.getElementById("btn-upload-from-rev");
const kitobUploadBtnLabel = document.getElementById("kitob-upload-btn-label");

// AI Loading Progress Box
const aiLoadingBox = document.getElementById("ai-loading-box");
const aiLoadingStatus = document.getElementById("ai-loading-status");
const aiLoadingPct = document.getElementById("ai-loading-pct");
const aiLoadingFill = document.getElementById("ai-loading-fill");

// Navigation DOM
const bottomNavTabs = document.querySelectorAll(".bottom-nav__tab[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel[data-tab-panel]");

// Tab 1: Bugun DOM
const progressDateEl = document.getElementById("progress-date");
const progressValueEl = document.getElementById("progress-value");
const planUnitMetaEl = document.getElementById("plan-unit-meta");
const emptyPlanCard = document.getElementById("empty-plan-card");
const planCardEl = document.getElementById("plan-card");
const addTaskBtn = document.getElementById("btn-add-task");
const addTaskSheet = document.getElementById("add-task-sheet");
const closeTaskSheetBtn = document.getElementById("btn-close-task-sheet");
const addTaskForm = document.getElementById("add-task-form");
const newTaskTitleInput = document.getElementById("new-task-title");
const newTaskSubInput = document.getElementById("new-task-sub");

// Tab 2: Kitob DOM
const emptyKitobCard = document.getElementById("empty-kitob-card");
const kitobActiveWrap = document.getElementById("kitob-active-wrap");
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
const emptyRepetitorCard = document.getElementById("empty-repetitor-card");
const repetitorActiveCard = document.getElementById("repetitor-active-card");
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
const submitAnswerBtn = document.getElementById("btn-submit");
const micBtn = document.getElementById("btn-mic");

// Tab 4: Takrorlash DOM
const emptyReviewCard = document.getElementById("empty-review-card");
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
 * Current User & Workspace State
 */
let currentUser = null;
let workspace = createEmptyWorkspace();
let currentUnitIdx = 0;
let currentRepIdx = 0;
let fcIndex = 0;
let isReviewSessionOpen = false;

function createEmptyWorkspace() {
  return {
    hasBook: false,
    bookTitle: "",
    authorMeta: "",
    totalUnits: 0,
    planMeta: "Darslik yuklanmagan",
    tasks: [],
    units: [],
    exercises: [],
    flashcards: [],
  };
}

function getWorkspaceStorageKey(username) {
  const key = String(username || "guest").toLowerCase().trim();
  return `dl_workspace_v2_${key}`;
}

function loadUserWorkspace(username) {
  try {
    const raw = localStorage.getItem(getWorkspaceStorageKey(username));
    if (!raw) return createEmptyWorkspace();
    const parsed = JSON.parse(raw);
    return { ...createEmptyWorkspace(), ...parsed };
  } catch {
    return createEmptyWorkspace();
  }
}

function saveUserWorkspace() {
  if (!currentUser?.username) return;
  localStorage.setItem(getWorkspaceStorageKey(currentUser.username), JSON.stringify(workspace));
}

/**
 * 1. Format Current Uzbek Date
 */
function formatUzbekDate() {
  const days = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  const months = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ];
  const now = new Date();
  return `${days[now.getDay()]}, ${now.getDate()}-${months[now.getMonth()]}`;
}

if (progressDateEl) {
  progressDateEl.textContent = formatUzbekDate();
}

/**
 * 2. Username & Password Authentication
 */
function getInitials(username) {
  const clean = String(username || "").replace(/[^a-zA-Z0-9а-яА-ЯўқғҳЎҚҒҲ]/g, "").trim();
  if (!clean) return "U";
  return clean.slice(0, 2).toUpperCase();
}

function setViewMode(mode) {
  body.setAttribute("data-view-mode", mode);
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", mode === "login" ? "#0e7c86" : "#f4f8f8");
  }
}

function computePlanCompletionPct() {
  if (!workspace.hasBook || !workspace.tasks.length) return 0;
  const doneCount = workspace.tasks.filter((t) => t.done).length;
  return Math.round((doneCount / workspace.tasks.length) * 100);
}

function updateProgressUI() {
  const pct = computePlanCompletionPct();
  if (progressValueEl) progressValueEl.textContent = `${pct}%`;
  if (profileStatPct) profileStatPct.textContent = `${pct}%`;
}

function applyUserToUI(user) {
  const initials = user.initials || getInitials(user.username);
  const displayName = user.username || "Foydalanuvchi";
  if (avatarBtn) {
    avatarBtn.setAttribute("aria-label", `${displayName} profili`);
    avatarBtn.innerHTML = `<span id="avatar-initials">${initials}</span>`;
  }
  if (profileSheetAvatar) profileSheetAvatar.textContent = initials;
  if (profileSheetName) profileSheetName.textContent = displayName;
  if (profileSheetEmail) profileSheetEmail.textContent = `@${displayName.toLowerCase()}`;
  const activeDays = user.activeDays || 1;
  if (profileStatDays) profileStatDays.textContent = `${activeDays} kun`;

  workspace = loadUserWorkspace(displayName);
  currentUnitIdx = 0;
  currentRepIdx = 0;
  fcIndex = 0;
  isReviewSessionOpen = false;
  renderAllTabs();
}

function loadUserSession() {
  try {
    const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
    if (geminiApiKeyInput && savedKey) {
      geminiApiKeyInput.value = savedKey;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) {
      setViewMode("login");
      return null;
    }
    currentUser = JSON.parse(raw);
    applyUserToUI(currentUser);
    setViewMode("app");
    return currentUser;
  } catch {
    setViewMode("login");
    return null;
  }
}

if (togglePassBtn && loginPasswordInput) {
  togglePassBtn.addEventListener("click", () => {
    const isPass = loginPasswordInput.type === "password";
    loginPasswordInput.type = isPass ? "text" : "password";
    togglePassBtn.textContent = isPass ? "Yashirish" : "Ko‘rish";
  });
}

function showLoginError(msg) {
  if (!loginErrorEl) return;
  if (!msg) {
    loginErrorEl.hidden = true;
    loginErrorEl.textContent = "";
  } else {
    loginErrorEl.textContent = msg;
    loginErrorEl.hidden = false;
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = (loginUsernameInput?.value || "").trim();
    const password = loginPasswordInput?.value || "";

    if (username.length < 2) {
      showLoginError("Foydalanuvchi nomi kamida 2 ta belgidan iborat bo‘lsin.");
      loginUsernameInput?.focus();
      return;
    }

    if (password.length < 4) {
      showLoginError("Parol kamida 4 ta belgidan iborat bo‘lsin.");
      loginPasswordInput?.focus();
      return;
    }

    let accounts = {};
    try {
      accounts = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || "{}");
    } catch {
      accounts = {};
    }

    const key = username.toLowerCase();
    const existing = accounts[key];

    if (existing && existing.password !== password) {
      showLoginError("Ushbu foydalanuvchi nomi uchun parol noto‘g‘ri.");
      loginPasswordInput?.focus();
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const activeDays = existing
      ? existing.lastLogin === today
        ? existing.activeDays || 1
        : (existing.activeDays || 1) + 1
      : 1;

    const userRecord = {
      username: existing ? existing.username : username,
      password,
      initials: getInitials(username),
      activeDays,
      lastLogin: today,
    };

    accounts[key] = userRecord;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));

    currentUser = {
      username: userRecord.username,
      initials: userRecord.initials,
      activeDays: userRecord.activeDays,
      lastLogin: today,
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    showLoginError("");
    if (loginPasswordInput) loginPasswordInput.value = "";
    applyUserToUI(currentUser);
    setViewMode("app");
    setActiveDockTab("bugun");
  });
}

if (avatarBtn && profileSheet) {
  avatarBtn.addEventListener("click", () => {
    const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
    if (geminiApiKeyInput) geminiApiKeyInput.value = savedKey;
    profileSheet.hidden = false;
  });
}

if (closeProfileSheetBtn && profileSheet) {
  closeProfileSheetBtn.addEventListener("click", () => {
    profileSheet.hidden = true;
  });
}

if (saveApiKeyBtn && geminiApiKeyInput) {
  saveApiKeyBtn.addEventListener("click", () => {
    const val = geminiApiKeyInput.value.trim();
    if (val) {
      localStorage.setItem(STORAGE_KEYS.API_KEY, val);
      if (apiKeyStatusHint) {
        apiKeyStatusHint.textContent = "✓ Gemini API kaliti saqlandi! Endi PDF yuklab sinab ko‘ring.";
        apiKeyStatusHint.style.color = "#16a34a";
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
      if (apiKeyStatusHint) {
        apiKeyStatusHint.textContent = "API kalit tozalandi (server kaliti yoki lokal tahlil ishlaydi).";
        apiKeyStatusHint.style.color = "";
      }
    }
  });
}

if (resetBookBtn) {
  resetBookBtn.addEventListener("click", () => {
    workspace = createEmptyWorkspace();
    saveUserWorkspace();
    renderAllTabs();
    if (profileSheet) profileSheet.hidden = true;
    setActiveDockTab("bugun");
    triggerPdfFilePicker();
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    currentUser = null;
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
 * 4. Render All 4 Tabs Based on `workspace.hasBook`
 */
function renderAllTabs() {
  updateProgressUI();
  renderTasks();
  renderKitobTab();
  renderRepetitorTab();
  renderReviewTab();
}

function renderTasks() {
  if (!planCardEl || !emptyPlanCard) return;

  if (!workspace.hasBook || !workspace.tasks.length) {
    emptyPlanCard.hidden = false;
    planCardEl.hidden = true;
    if (addTaskBtn) addTaskBtn.hidden = true;
    if (planUnitMetaEl) planUnitMetaEl.textContent = "Darslik yuklanmagan";
    return;
  }

  emptyPlanCard.hidden = true;
  planCardEl.hidden = false;
  if (addTaskBtn) addTaskBtn.hidden = false;
  if (planUnitMetaEl) planUnitMetaEl.textContent = workspace.planMeta || "1-bo‘lim · s. 1";

  let foundCurrent = false;
  planCardEl.innerHTML = "";

  workspace.tasks.forEach((task) => {
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
      <span class="task-row__check ${
        task.done
          ? "task-row__check--done"
          : isCurrent
          ? "task-row__check--current"
          : "task-row__check--future"
      }" aria-hidden="true">
        ${task.done ? CHECK_SVG_DONE : ""}
      </span>
      <span class="task-row__body">
        <span class="task-row__title">${escapeHtml(task.title)}</span>
        <span class="task-row__sub">${escapeHtml(task.sub)}</span>
      </span>
      <span class="task-row__badge">Hozir</span>
    `;

    btn.addEventListener("click", () => {
      task.done = !task.done;
      saveUserWorkspace();
      updateProgressUI();
      renderTasks();
    });

    planCardEl.appendChild(btn);
  });
}

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
    workspace.tasks.push({
      id: Date.now(),
      title,
      sub,
      done: false,
    });
    saveUserWorkspace();
    updateProgressUI();
    renderTasks();
    newTaskTitleInput.value = "";
    newTaskSubInput.value = "";
    addTaskSheet.hidden = true;
  });
}

/**
 * 5. Tab 2: Kitob Renderer
 */
function renderKitobTab() {
  if (!workspace.hasBook || !workspace.units.length) {
    if (emptyKitobCard) emptyKitobCard.hidden = false;
    if (kitobActiveWrap) kitobActiveWrap.hidden = true;
    if (kitobUploadBtnLabel) kitobUploadBtnLabel.textContent = "PDF yuklash";
    return;
  }

  if (emptyKitobCard) emptyKitobCard.hidden = true;
  if (kitobActiveWrap) kitobActiveWrap.hidden = false;
  if (kitobUploadBtnLabel) kitobUploadBtnLabel.textContent = "Yangilash";

  if (activeBookTitleEl) activeBookTitleEl.textContent = workspace.bookTitle;
  if (activeBookAuthorEl) activeBookAuthorEl.textContent = workspace.authorMeta;

  const u = workspace.units[currentUnitIdx % workspace.units.length];
  if (!u) return;

  const totalUnits = workspace.totalUnits || workspace.units.length;
  if (readerUnitMetaEl) readerUnitMetaEl.textContent = `Unit ${u.unitNum} · ${u.page}`;
  if (readerUnitBadgeEl) readerUnitBadgeEl.textContent = u.badge;
  if (readerUnitPageEl) readerUnitPageEl.textContent = u.page;
  if (readerUnitHeadingEl) readerUnitHeadingEl.textContent = u.heading;
  if (readerUnitDescEl) readerUnitDescEl.textContent = u.desc;
  if (readerQuoteSourceEl) readerQuoteSourceEl.textContent = u.source;
  if (readerQuoteLine1El) readerQuoteLine1El.textContent = u.line1;
  if (readerQuoteLine2El) readerQuoteLine2El.textContent = u.line2;
  if (bookUnitCounterEl) bookUnitCounterEl.textContent = `Mavzu ${currentUnitIdx + 1} / ${totalUnits}`;
  if (bookProgressPctEl) bookProgressPctEl.textContent = `${u.pct}%`;
  if (bookProgressFillEl) bookProgressFillEl.style.width = `${u.pct}%`;
}

if (prevUnitBtn) {
  prevUnitBtn.addEventListener("click", () => {
    if (!workspace.units.length) return;
    currentUnitIdx = (currentUnitIdx - 1 + workspace.units.length) % workspace.units.length;
    renderKitobTab();
  });
}

if (nextUnitBtn) {
  nextUnitBtn.addEventListener("click", () => {
    if (!workspace.units.length) return;
    currentUnitIdx = (currentUnitIdx + 1) % workspace.units.length;
    renderKitobTab();
  });
}

if (practiceUnitBtn) {
  practiceUnitBtn.addEventListener("click", () => {
    if (workspace.exercises.length) {
      currentRepIdx = currentUnitIdx % workspace.exercises.length;
      renderRepetitorTab();
    }
    setActiveDockTab("repetitor");
  });
}

/**
 * 6. Tab 3: Repetitor Renderer & Live AI Evaluation
 */
function renderRepetitorTab() {
  if (!workspace.hasBook || !workspace.exercises.length) {
    if (emptyRepetitorCard) emptyRepetitorCard.hidden = false;
    if (repetitorActiveCard) repetitorActiveCard.hidden = true;
    if (nextExerciseBtn) nextExerciseBtn.hidden = true;
    return;
  }

  if (emptyRepetitorCard) emptyRepetitorCard.hidden = true;
  if (repetitorActiveCard) repetitorActiveCard.hidden = false;
  if (nextExerciseBtn) nextExerciseBtn.hidden = false;

  const ex = workspace.exercises[currentRepIdx % workspace.exercises.length];
  if (!ex) return;

  if (repExerciseLabelEl) {
    repExerciseLabelEl.textContent = `${ex.label} (${(currentRepIdx % workspace.exercises.length) + 1} / ${workspace.exercises.length})`;
  }
  if (repStudentSentenceEl) repStudentSentenceEl.textContent = ex.studentSentence;
  if (repCorrContextEl) repCorrContextEl.textContent = ex.context;
  if (repCorrWrongEl) repCorrWrongEl.textContent = ex.wrong;
  if (repCorrRightEl) repCorrRightEl.textContent = ex.right;
  if (repExplanationEl) repExplanationEl.textContent = ex.explanation;
  if (repQuoteSourceEl) repQuoteSourceEl.textContent = ex.source;
  if (repQuoteLine1El) repQuoteLine1El.textContent = ex.line1;
  if (repQuoteLine2El) repQuoteLine2El.textContent = ex.line2;
  if (practiceLabelEl) {
    practiceLabelEl.textContent = "Endi o‘zingiz tarjima qiling yoki yozing";
    practiceLabelEl.style.color = "";
  }
  if (practicePromptEl) practicePromptEl.textContent = ex.prompt;
  if (composerInput) composerInput.value = "";
}

if (nextExerciseBtn) {
  nextExerciseBtn.addEventListener("click", () => {
    if (!workspace.exercises.length) return;
    currentRepIdx = (currentRepIdx + 1) % workspace.exercises.length;
    renderRepetitorTab();
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
      const ex = workspace.exercises[currentRepIdx % workspace.exercises.length];
      composerInput.value = ex ? ex.sample : "";
      composerInput.focus();
    }
  });
}

if (repetitorForm && composerInput) {
  repetitorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const val = composerInput.value.trim();
    if (!val || !workspace.exercises.length) {
      composerInput.focus();
      return;
    }

    const ex = workspace.exercises[currentRepIdx % workspace.exercises.length];
    if (!ex) return;

    if (submitAnswerBtn) {
      submitAnswerBtn.disabled = true;
      submitAnswerBtn.textContent = "Tekshirilmoqda...";
    }

    let evaluatedByAi = false;
    try {
      const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check_answer",
          userAnswer: val,
          exercise: ex,
          apiKey,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        if (payload?.ok && payload.data) {
          evaluatedByAi = true;
          const d = payload.data;
          if (practiceLabelEl && practicePromptEl) {
            practiceLabelEl.textContent = d.feedbackLabel;
            practiceLabelEl.style.color = d.isCorrect ? "#16a34a" : "#0e7c86";
            practicePromptEl.textContent = d.feedbackText;
          }
          if (!d.isCorrect && d.wrongFragment && d.rightFragment) {
            addMistakeToReview({
              badge: "1-kun",
              meta: ex.source.replace(/^Kitobda:\s*/i, ""),
              wrong: d.wrongFragment,
              right: d.rightFragment,
              rule: d.ruleSummary || ex.explanation,
            });
          }
        }
      }
    } catch {
      // Fallback to local keyword evaluation below
    }

    if (!evaluatedByAi) {
      const keywords = Array.isArray(ex.keywords) && ex.keywords.length ? ex.keywords : [ex.right];
      const lowerVal = val.toLowerCase();
      const isCorrect = keywords.some((kw) => lowerVal.includes(String(kw).toLowerCase()));

      if (practiceLabelEl && practicePromptEl) {
        if (isCorrect) {
          practiceLabelEl.textContent = "Barakalla · Qoida to‘g‘ri qo‘llandi!";
          practiceLabelEl.style.color = "#16a34a";
          practicePromptEl.textContent = `✓ ${val}`;
        } else {
          practiceLabelEl.textContent = ex.hint || "Maslahat · Namuna bilan solishtiring";
          practiceLabelEl.style.color = "#0e7c86";
          practicePromptEl.textContent = `To‘g‘ri namuna: ${ex.sample}`;
          addMistakeToReview({
            badge: "1-kun",
            meta: ex.source.replace(/^Kitobda:\s*/i, ""),
            wrong: val.slice(0, 42),
            right: ex.sample,
            rule: ex.explanation,
          });
        }
      }
    }

    if (submitAnswerBtn) {
      submitAnswerBtn.disabled = false;
      submitAnswerBtn.textContent = "Yuborish";
    }
    composerInput.value = "";
  });
}

function addMistakeToReview(card) {
  if (!card?.wrong || !card?.right) return;
  const exists = workspace.flashcards.some(
    (c) => c.wrong.toLowerCase() === card.wrong.toLowerCase()
  );
  if (!exists) {
    workspace.flashcards.unshift(card);
    saveUserWorkspace();
    renderReviewTab();
  }
}

/**
 * 7. Tab 4: Takrorlash Renderer & Flashcard Quiz
 */
function renderReviewTab() {
  if (!workspace.hasBook || !workspace.flashcards.length) {
    if (emptyReviewCard) emptyReviewCard.hidden = false;
    if (reviewListCardEl) reviewListCardEl.hidden = true;
    if (flashcardSessionEl) flashcardSessionEl.hidden = true;
    if (reviewStartBtn) reviewStartBtn.hidden = true;
    return;
  }

  if (emptyReviewCard) emptyReviewCard.hidden = true;
  if (reviewStartBtn) reviewStartBtn.hidden = false;
  if (reviewListCardEl) reviewListCardEl.hidden = isReviewSessionOpen;
  if (flashcardSessionEl) flashcardSessionEl.hidden = !isReviewSessionOpen;

  if (reviewListCardEl) {
    reviewListCardEl.innerHTML = "";
    workspace.flashcards.forEach((item, idx) => {
      if (idx > 0) {
        const div = document.createElement("div");
        div.className = "review-divider";
        div.setAttribute("role", "separator");
        reviewListCardEl.appendChild(div);
      }
      const row = document.createElement("div");
      row.className = "review-item";
      row.innerHTML = `
        <span class="review-item__badge">${escapeHtml(item.badge || "1-kun")}</span>
        <div class="review-item__content">
          <span class="review-item__wrong">${escapeHtml(item.wrong)}</span>
          <span class="review-item__right">${escapeHtml(item.right)}</span>
        </div>
        <span class="review-item__meta">${escapeHtml(item.meta || "Mavzu 1")}</span>
      `;
      row.addEventListener("click", () => {
        toggleReviewSession(true);
        fcIndex = idx;
        renderFlashcard();
      });
      reviewListCardEl.appendChild(row);
    });
  }

  if (isReviewSessionOpen) {
    renderFlashcard();
  }
}

function renderFlashcard() {
  const card = workspace.flashcards[fcIndex % workspace.flashcards.length];
  if (!card) return;
  if (fcBadgeEl) fcBadgeEl.textContent = `${card.badge || "1-kun"} · ${card.meta || ""}`;
  if (fcCounterEl) fcCounterEl.textContent = `${(fcIndex % workspace.flashcards.length) + 1} / ${workspace.flashcards.length}`;
  if (fcWrongEl) fcWrongEl.textContent = card.wrong;
  if (fcRightEl) fcRightEl.textContent = card.right;
  if (fcRuleEl) fcRuleEl.textContent = card.rule;
  if (fcAnswerEl) fcAnswerEl.hidden = true;
  if (fcRevealBtn) fcRevealBtn.hidden = false;
  if (fcGradeRow) fcGradeRow.hidden = true;
}

function toggleReviewSession(forceOpen) {
  if (!workspace.flashcards.length) return;
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

if (fcRevealBtn) {
  fcRevealBtn.addEventListener("click", () => {
    if (fcAnswerEl) fcAnswerEl.hidden = false;
    fcRevealBtn.hidden = true;
    if (fcGradeRow) fcGradeRow.hidden = false;
  });
}

function advanceFlashcard() {
  if (fcIndex + 1 < workspace.flashcards.length) {
    fcIndex += 1;
    renderFlashcard();
  } else {
    toggleReviewSession(false);
    if (reviewStartLabelEl) reviewStartLabelEl.textContent = "Yakunlandi ✓";
  }
}

if (fcHardBtn) fcHardBtn.addEventListener("click", advanceFlashcard);
if (fcGoodBtn) fcGoodBtn.addEventListener("click", advanceFlashcard);

/**
 * 8. PDF Upload, Real Text Extraction (PDF.js) & Gemini AI Plan Generation
 */
function triggerPdfFilePicker() {
  if (!pdfUploadInput) return;
  pdfUploadInput.value = "";
  pdfUploadInput.click();
}

[
  uploadFromPlanBtn,
  uploadFromKitobBtn,
  uploadFromKitobCardBtn,
  uploadFromRepBtn,
  uploadFromRevBtn,
].forEach((btn) => {
  if (btn) {
    btn.addEventListener("click", triggerPdfFilePicker);
  }
});

function setAiLoadingProgress(visible, statusText = "", pct = 0) {
  if (!aiLoadingBox) return;
  aiLoadingBox.hidden = !visible;
  if (aiLoadingStatus && statusText) aiLoadingStatus.textContent = statusText;
  if (aiLoadingPct) aiLoadingPct.textContent = `${pct}%`;
  if (aiLoadingFill) aiLoadingFill.style.width = `${pct}%`;
  if (uploadFromPlanBtn) {
    uploadFromPlanBtn.disabled = visible;
    uploadFromPlanBtn.textContent = visible
      ? "Tahlil qilinmoqda..."
      : "PDF darslik tanlash va reja tuzish";
  }
}

async function extractTextFromPdfFile(file) {
  if (!window.pdfjsLib) {
    return { pageCount: 1, fullText: file.name, pages: [{ page: 1, text: file.name }] };
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageCount = pdf.numPages || 1;
  const maxPagesToRead = Math.min(pageCount, 20);
  const pages = [];
  let fullText = "";

  for (let i = 1; i <= maxPagesToRead; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str || "").join(" ");
    const cleaned = strings.replace(/\s+/g, " ").trim();
    if (cleaned.length > 20) {
      pages.push({ page: i, text: cleaned });
      fullText += `\n[Sahifa ${i}]\n${cleaned}\n`;
    }
    const progress = Math.min(55, 15 + Math.round((i / maxPagesToRead) * 40));
    setAiLoadingProgress(true, `PDF o‘qilmoqda (${i}/${maxPagesToRead} sahifa)...`, progress);
  }

  return { pageCount, fullText: fullText.trim(), pages };
}

function splitQuoteIntoTwoLines(sentence) {
  const clean = String(sentence || "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= 44) {
    return [clean, "See textbook example and context."];
  }
  const trimmed = clean.slice(0, 92);
  const mid = Math.floor(trimmed.length / 2);
  const breakIdx = trimmed.indexOf(" ", mid - 8);
  if (breakIdx > 12 && breakIdx < 60) {
    return [trimmed.slice(0, breakIdx).trim(), trimmed.slice(breakIdx + 1).trim()];
  }
  return [trimmed.slice(0, 44).trim(), trimmed.slice(44).trim()];
}

/**
 * Intelligent Real-PDF Fallback Parser:
 * Uses actual extracted pages & sentences from the uploaded PDF so even if
 * GEMINI_API_KEY is not yet configured on Vercel, the study plan, book quotes,
 * exercises, and flashcards are built directly from the user's uploaded PDF!
 */
function buildPlanFromExtractedPdf(file, pageCount, pages) {
  const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").trim() || "Shaxsiy Darslik";
  const sizeMb = Math.max(0.1, file.size / (1024 * 1024)).toFixed(1);
  const authorMeta = `${pageCount} sahifa · ${sizeMb} MB · PDF darslik`;

  // Collect meaningful sentences from extracted PDF pages
  const extractedItems = [];
  pages.forEach((p) => {
    const rawSentences = p.text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 32 && s.length <= 140 && /[a-zA-Zа-яА-Я]/.test(s));
    rawSentences.slice(0, 3).forEach((s) => {
      extractedItems.push({ page: p.page, sentence: s });
    });
  });

  while (extractedItems.length < 4) {
    const idx = extractedItems.length + 1;
    extractedItems.push({
      page: idx,
      sentence: `${cleanTitle} — Section ${idx}: key concepts, rules, and practical examples from page ${idx}.`,
    });
  }

  const picked = extractedItems.slice(0, 4);

  const units = picked.map((item, idx) => {
    const [line1, line2] = splitQuoteIntoTwoLines(item.sentence);
    const shortHeading = item.sentence
      .split(/\s+/)
      .slice(0, 5)
      .join(" ")
      .replace(/[.,:;!?]+$/, "");
    return {
      unitNum: idx + 1,
      page: `s. ${item.page}`,
      badge: `${idx + 1}-bo‘lim · s. ${item.page}`,
      heading: shortHeading || `${cleanTitle} — ${idx + 1}-mavzu`,
      desc: `"${cleanTitle}" darsligining ${item.page}-sahifasidan ajratib olingan asosiy nazariy qoida va amaliy kontekst. Quyidagi sariq markerli jumlani diqqat bilan o‘qing.`,
      source: `Kitobda: ${cleanTitle} · s. ${item.page}`,
      line1,
      line2,
      pct: Math.round(((idx + 1) / picked.length) * 100),
    };
  });

  const tasks = [
    {
      id: Date.now() + 1,
      title: `${cleanTitle}: 1-bo‘lim nazariyasini o‘qish`,
      sub: `15 daq · ${units[0].page}`,
      done: false,
    },
    {
      id: Date.now() + 2,
      title: `Kitobdagi asosiy jumlalarni tahlil qilish (${units[0].page})`,
      sub: `10 daq · Kitob bo‘limi`,
      done: false,
    },
    {
      id: Date.now() + 3,
      title: `AI Repetitor bilan 4 ta amaliy mashqni ishlash`,
      sub: `12 daq · Repetitor bo‘limi`,
      done: false,
    },
    {
      id: Date.now() + 4,
      title: `${units[1]?.page || "s. 2"} dagi yangi iboralarni takrorlash`,
      sub: `8 daq · Takrorlash bo‘limi`,
      done: false,
    },
    {
      id: Date.now() + 5,
      title: `Bugungi mavzu bo‘yicha 3 ta mustaqil jumla yozish`,
      sub: `10 daq · Yozma amaliyot`,
      done: false,
    },
  ];

  const exercises = picked.map((item, idx) => {
    const [line1, line2] = splitQuoteIntoTwoLines(item.sentence);
    const words = item.sentence.split(/\s+/).filter((w) => w.length > 3);
    const targetWord = (words[Math.min(2, words.length - 1)] || "example").replace(/[^a-zA-Z0-9']/g, "");
    const contextWord = (words[Math.max(0, Math.min(1, words.length - 2))] || "context").replace(/[^a-zA-Z0-9']/g, "");

    return {
      label: `${idx + 1}-mashq · s. ${item.page}`,
      studentSentence: item.sentence,
      context: contextWord || "Kalit so‘z:",
      wrong: `${targetWord} (noto‘g‘ri shakl)`,
      right: targetWord || "to‘g‘ri shakl",
      explanation: `Ushbu jumla "${cleanTitle}" darsligining ${item.page}-sahifasidan olindi. Kontekstda "${targetWord}" so‘zining to‘g‘ri qo‘llanishiga e’tibor bering.`,
      source: `Kitobda: ${cleanTitle} · s. ${item.page}`,
      line1,
      line2,
      prompt: `Kitobning ${item.page}-sahifasidagi ushbu asosiy jumlani yoki uning mazmunini ingliz tilida yozing: "${line1}..."`,
      sample: item.sentence,
      hint: `Maslahat · "${targetWord}" kalit so‘zini qatnashtirib yozing`,
      keywords: [targetWord.toLowerCase(), line1.split(" ")[0]?.toLowerCase() || ""].filter(Boolean),
    };
  });

  const flashcards = picked.slice(0, 3).map((item, idx) => {
    const [line1, line2] = splitQuoteIntoTwoLines(item.sentence);
    return {
      badge: `${idx + 1}-kun`,
      meta: `s. ${item.page}`,
      wrong: `${line1} ...`,
      right: `${line1} ${line2}`,
      rule: `"${cleanTitle}" (${item.page}-sahifa) dagi muhim qoida va jumla tuzilishi.`,
    };
  });

  return {
    hasBook: true,
    bookTitle: cleanTitle,
    authorMeta,
    totalUnits: Math.max(pageCount, units.length),
    planMeta: `1-bo‘lim · ${units[0].page}`,
    tasks,
    units,
    exercises,
    flashcards,
  };
}

if (pdfUploadInput) {
  pdfUploadInput.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveDockTab("bugun");
    setAiLoadingProgress(true, "PDF kitob o‘qilmoqda...", 15);

    try {
      const { pageCount, fullText, pages } = await extractTextFromPdfFile(file);
      setAiLoadingProgress(true, "Gemini AI o‘quv reja va mashqlar tuzmoqda...", 68);

      let aiPlan = null;
      try {
        const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || "";
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "analyze_pdf",
            fileName: file.name,
            pageCount,
            pdfText: fullText,
            apiKey,
          }),
        });

        if (res.ok) {
          const payload = await res.json();
          if (payload?.ok && payload.data?.tasks?.length) {
            aiPlan = payload.data;
          }
        }
      } catch {
        // Fallback to local PDF parser below
      }

      setAiLoadingProgress(true, "O‘quv maydoni tayyorlanmoqda...", 95);

      if (aiPlan) {
        const sizeMb = Math.max(0.1, file.size / (1024 * 1024)).toFixed(1);
        workspace = {
          hasBook: true,
          bookTitle: aiPlan.bookTitle || file.name.replace(/\.pdf$/i, ""),
          authorMeta: aiPlan.authorMeta || `${pageCount} sahifa · ${sizeMb} MB · AI tahlil`,
          totalUnits: aiPlan.totalUnits || pageCount,
          planMeta: aiPlan.planMeta || "1-bo‘lim · s. 1",
          tasks: aiPlan.tasks.map((t, i) => ({
            id: Date.now() + i,
            title: t.title,
            sub: t.sub,
            done: false,
          })),
          units: aiPlan.units || [],
          exercises: aiPlan.exercises || [],
          flashcards: aiPlan.flashcards || [],
        };
      } else {
        workspace = buildPlanFromExtractedPdf(file, pageCount, pages);
      }

      currentUnitIdx = 0;
      currentRepIdx = 0;
      fcIndex = 0;
      isReviewSessionOpen = false;
      saveUserWorkspace();
      setAiLoadingProgress(false);
      renderAllTabs();
    } catch (err) {
      console.error("PDF parse error:", err);
      setAiLoadingProgress(false);
    }
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Initialize Session on Startup
loadUserSession();
