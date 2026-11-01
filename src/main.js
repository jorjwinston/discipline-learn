/**
 * Discipline Learn — Mobile Web App Controller
 * - Umumiy progress (94%) = All-time daily login attendance rate (not daily task %)
 * - Bottom Nav Dock switches between 4 separate non-scrollable tab screens:
 *   Bugun | Kitob | Repetitor | Takrorlash
 */

const body = document.body;
const screenApp = document.getElementById("screen-app");
const metaThemeColor = document.getElementById("meta-theme-color");
const previewTabs = document.querySelectorAll(".preview-tab");
const googleLoginBtn = document.getElementById("btn-google-login");
const avatarBtn = document.getElementById("btn-avatar");
const bottomNavTabs = document.querySelectorAll(".bottom-nav__tab");
const tabPanels = document.querySelectorAll(".tab-panel");
const taskRows = document.querySelectorAll(".task-row");
const progressValueEl = document.getElementById("progress-value");
const repetitorForm = document.getElementById("repetitor-form");
const composerInput = document.getElementById("composer-input");
const micBtn = document.getElementById("btn-mic");
const practicePromptEl = document.querySelector(".practice-box__prompt");
const practiceLabelEl = document.querySelector(".practice-box__label");
const reviewStartBtn = document.getElementById("btn-review-start");
const pdfUploadInput = document.getElementById("pdf-upload-input");
const activeBookTitleEl = document.getElementById("active-book-title");
const activeBookAuthorEl = document.getElementById("active-book-author");

const CHECK_SVG_DONE = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect width="20" height="20" rx="10" fill="#557329"/>
    <path d="M16 4L7.75 16L4 10.5455" stroke-width="1.13" stroke-linecap="round" stroke="white"/>
  </svg>
`;

/**
 * 1. All-Time Attendance / Consistency Rate (Umumiy progress)
 * Tracks how many days the user has logged in out of total days since registration.
 */
function initAllTimeAttendance() {
  const STORAGE_KEY = "dl_attendance_stats_v1";
  const todayStr = new Date().toISOString().slice(0, 10);
  let stats = {
    totalDays: 50,
    activeDays: 47,
    lastVisitedDate: todayStr
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.totalDays === "number" && typeof parsed.activeDays === "number") {
        stats = parsed;
      }
    }
    if (stats.lastVisitedDate !== todayStr) {
      stats.totalDays += 1;
      stats.activeDays += 1;
      stats.lastVisitedDate = todayStr;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Fallback to default 47/50 = 94%
  }

  const pct = Math.min(100, Math.round((stats.activeDays / Math.max(1, stats.totalDays)) * 100));
  if (progressValueEl) {
    progressValueEl.textContent = `${pct}%`;
  }
}

initAllTimeAttendance();

/**
 * 2. Desktop Preview Toolbar (Login | Asosiy ekran | Yonma-yon)
 */
function setViewMode(mode) {
  body.setAttribute("data-view-mode", mode);

  previewTabs.forEach((tab) => {
    const active = tab.dataset.mode === mode;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", mode === "login" ? "#0e7c86" : "#f4f8f8");
  }
}

previewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setViewMode(tab.dataset.mode);
  });
});

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    if (body.getAttribute("data-view-mode") !== "both") {
      setViewMode("app");
    }
    setActiveDockTab("bugun");
  });
}

if (avatarBtn) {
  avatarBtn.addEventListener("click", () => {
    const current = body.getAttribute("data-view-mode");
    setViewMode(current === "login" ? "app" : "login");
  });
}

/**
 * 3. Bottom Nav Dock -> Separate Non-Scrollable Screen Switching
 * (Bugun | Kitob | Repetitor | Takrorlash)
 */
function setActiveDockTab(tabName) {
  if (screenApp) {
    screenApp.setAttribute("data-active-tab", tabName);
  }

  bottomNavTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    if (isActive) {
      tab.setAttribute("aria-current", "page");
    } else {
      tab.removeAttribute("aria-current");
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
 * 4. Daily Plan (Reja) Task Toggling
 * Only updates the daily task states (does NOT alter all-time 94% Umumiy progress)
 */
const taskWaterSurface = document.querySelector(".task-water-surface");

function syncCurrentTaskWave() {
  let foundCurrent = false;
  taskRows.forEach((r) => {
    const isDone = r.classList.contains("task-row--done");
    const checkEl = r.querySelector(".task-row__check");
    if (!isDone && !foundCurrent) {
      foundCurrent = true;
      r.classList.remove("task-row--future");
      r.classList.add("task-row--current");
      if (checkEl) {
        checkEl.className = "task-row__check task-row__check--current";
        checkEl.innerHTML = '<span class="task-row__dot"></span>';
      }
      if (taskWaterSurface && taskWaterSurface.parentElement !== r) {
        r.prepend(taskWaterSurface);
      }
      if (taskWaterSurface) taskWaterSurface.hidden = false;
    } else if (!isDone) {
      r.classList.remove("task-row--current");
      r.classList.add("task-row--future");
      if (checkEl) {
        checkEl.className = "task-row__check task-row__check--future";
        checkEl.innerHTML = "";
      }
    }
  });
  if (!foundCurrent && taskWaterSurface) {
    taskWaterSurface.hidden = true;
  }
}

taskRows.forEach((row) => {
  row.addEventListener("click", () => {
    const isDone = row.classList.contains("task-row--done");
    const checkEl = row.querySelector(".task-row__check");

    if (isDone) {
      row.classList.remove("task-row--done");
      row.classList.add("task-row--future");
      row.setAttribute("aria-pressed", "false");
    } else {
      row.classList.remove("task-row--current", "task-row--future");
      row.classList.add("task-row--done");
      row.setAttribute("aria-pressed", "true");
      if (checkEl) {
        checkEl.className = "task-row__check task-row__check--done";
        checkEl.innerHTML = CHECK_SVG_DONE;
      }
    }
    syncCurrentTaskWave();
  });
});

/**
 * 5. Kitob Tab — PDF Textbook Upload
 */
if (pdfUploadInput) {
  pdfUploadInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cleanName = file.name.replace(/\.pdf$/i, "");
    if (activeBookTitleEl) activeBookTitleEl.textContent = cleanName;
    if (activeBookAuthorEl) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      activeBookAuthorEl.textContent = `Yuklangan PDF · ${sizeMb} MB`;
    }
  });
}

/**
 * 6. Repetitor Practice Translation & Voice Input
 */
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
      recognition.onerror = () => {
        micBtn.classList.remove("is-recording");
      };
      recognition.onend = () => {
        micBtn.classList.remove("is-recording");
      };
      recognition.start();
    } else {
      composerInput.value = "When I arrived at the station, the train had already left.";
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

    const hasPastPerfect = /\bhad\s+(already\s+)?(left|gone|departed)\b/i.test(val);
    if (practiceLabelEl && practicePromptEl) {
      if (hasPastPerfect) {
        practiceLabelEl.textContent = "Barakalla · Past Perfect to‘g‘ri qo‘llandi";
        practiceLabelEl.style.color = "#16a34a";
        practicePromptEl.textContent = `✓ ${val}`;
      } else {
        practiceLabelEl.textContent = "Maslahat · had + fe’lning 3-shaklini ishlating";
        practiceLabelEl.style.color = "#0e7c86";
        practicePromptEl.textContent = "Namuna: When I got to the station, the train had already left.";
      }
    }
    composerInput.value = "";
  });
}

if (reviewStartBtn) {
  reviewStartBtn.addEventListener("click", () => {
    setActiveDockTab("repetitor");
    composerInput?.focus();
  });
}
