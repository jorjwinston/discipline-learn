import { GoogleGenAI } from "@google/genai";

const STUDY_PLAN_SCHEMA = {
  type: "object",
  properties: {
    bookTitle: { type: "string" },
    authorMeta: { type: "string" },
    totalUnits: { type: "integer" },
    planMeta: { type: "string" },
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          sub: { type: "string" },
        },
        required: ["title", "sub"],
      },
    },
    units: {
      type: "array",
      items: {
        type: "object",
        properties: {
          unitNum: { type: "integer" },
          page: { type: "string" },
          badge: { type: "string" },
          heading: { type: "string" },
          desc: { type: "string" },
          source: { type: "string" },
          line1: { type: "string" },
          line2: { type: "string" },
          pct: { type: "integer" },
        },
        required: [
          "unitNum",
          "page",
          "badge",
          "heading",
          "desc",
          "source",
          "line1",
          "line2",
          "pct",
        ],
      },
    },
    exercises: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: { type: "string" },
          studentSentence: { type: "string" },
          context: { type: "string" },
          wrong: { type: "string" },
          right: { type: "string" },
          explanation: { type: "string" },
          source: { type: "string" },
          line1: { type: "string" },
          line2: { type: "string" },
          prompt: { type: "string" },
          sample: { type: "string" },
          hint: { type: "string" },
          keywords: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "label",
          "studentSentence",
          "context",
          "wrong",
          "right",
          "explanation",
          "source",
          "line1",
          "line2",
          "prompt",
          "sample",
          "hint",
          "keywords",
        ],
      },
    },
    flashcards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          badge: { type: "string" },
          meta: { type: "string" },
          wrong: { type: "string" },
          right: { type: "string" },
          rule: { type: "string" },
        },
        required: ["badge", "meta", "wrong", "right", "rule"],
      },
    },
  },
  required: [
    "bookTitle",
    "authorMeta",
    "totalUnits",
    "planMeta",
    "tasks",
    "units",
    "exercises",
    "flashcards",
  ],
};

const CHECK_ANSWER_SCHEMA = {
  type: "object",
  properties: {
    isCorrect: { type: "boolean" },
    feedbackLabel: { type: "string" },
    feedbackText: { type: "string" },
    wrongFragment: { type: "string" },
    rightFragment: { type: "string" },
    ruleSummary: { type: "string" },
  },
  required: [
    "isCorrect",
    "feedbackLabel",
    "feedbackText",
    "wrongFragment",
    "rightFragment",
    "ruleSummary",
  ],
};

async function callInteractionsModel(ai, model, prompt, schema) {
  const interaction = await ai.interactions.create({
    model,
    input: prompt,
    response_format: schema,
  });
  const textOutput = interaction.outputs?.find((o) => o.type === "text")?.text;
  if (!textOutput) {
    throw new Error("Empty model response");
  }
  return JSON.parse(textOutput);
}

async function runStructuredGeneration(apiKey, prompt, schema) {
  const ai = new GoogleGenAI({ apiKey });

  try {
    return await Promise.race([
      callInteractionsModel(ai, "gemini-3.8-flash", prompt, schema),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("PRIMARY_MODEL_TIMEOUT")), 5500)
      ),
    ]);
  } catch {
    return await callInteractionsModel(ai, "gemini-3.5-flash-lite", prompt, schema);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Faqat POST so‘rovlar qabul qilinadi." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const apiKey = (
    body.apiKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    ""
  ).trim();

  if (!apiKey) {
    return res.status(400).json({
      error: "MISSING_API_KEY",
      message:
        "Gemini API kaliti topilmadi. Profil oynasida API kalitni kiriting yoki Vercel'da GEMINI_API_KEY o‘zgaruvchisini sozlang.",
    });
  }

  const action = body.action || "analyze_pdf";

  try {
    if (action === "analyze_pdf") {
      const fileName = String(body.fileName || "Darslik.pdf");
      const pageCount = Number(body.pageCount || 1);
      const rawText = String(body.pdfText || "").slice(0, 12000);

      const prompt = `Siz "Discipline Learn" ilovasining sun'iy intellekt o‘quv reja va repetitor tizimisiz.
Foydalanuvchi "${fileName}" (${pageCount} sahifa) nomli PDF darslik yukladi.
Quyida ushbu PDF kitobdan ajratib olingan haqiqiy matn berilgan:
"""
${rawText}
"""

Vazifangiz — aynan ushbu PDF kitob mazmunidan kelib chiqib, o‘zbek tilida to‘liq o‘quv rejasi, mavzular konspekti, repetitor mashqlari va takrorlash kartochkalarini tuzib berish:
1. "tasks": 5 ta aniq kunlik vazifa (masalan, 1-mavzu qoidasini o‘qish, mashq bajarish, xatolarni repetitor bilan tahlil qilish, mustaqil gap yozish).
2. "units": 3 ta asosiy mavzu/bo‘lim. Har birida:
   - "heading": Mavzu nomi
   - "desc": O‘zbek tilida tushunarli qoida/izoh (2 gap)
   - "line1" va "line2": Kitob ichidagi haqiqiy misol yoki muhim jumlaning 1- va 2-qatori (har biri ~35-48 belgi, sariq markerda ko‘rsatish uchun)
   - "source": "Kitobda: Unit X · s. Y" ko‘rinishida.
3. "exercises": 3 ta mashq. Har birida o‘quvchi adashishi mumkin bo‘lgan gap ("studentSentence"), xato qism ("wrong"), to‘g‘ri qism ("right"), o‘zbekcha tushuntirish ("explanation"), kitobdan iqtibos ("line1", "line2"), va o‘quvchi o‘zi tarjima qilishi/yozishi uchun o‘zbekcha topshiriq ("prompt") hamda to‘g‘ri namuna ("sample").
4. "flashcards": 3 ta takrorlash kartochkasi ("wrong", "right", "rule", "badge": "1-kun", "meta": "Unit 1 · s. 2").`;

      const parsed = await runStructuredGeneration(apiKey, prompt, STUDY_PLAN_SCHEMA);
      return res.status(200).json({ ok: true, source: "gemini-3.8-flash", data: parsed });
    }

    if (action === "check_answer") {
      const userAnswer = String(body.userAnswer || "").trim();
      const exercise = body.exercise || {};

      const prompt = `Siz "Discipline Learn" AI repetitorisiz.
Mavzu va topshiriq: "${exercise.prompt || ""}"
Kutilgan to‘g‘ri namuna: "${exercise.sample || ""}"
Asosiy qoida: "${exercise.explanation || ""}"
O‘quvchining yozgan javobi: "${userAnswer}"

O‘quvchi javobini tekshiring:
- Agar ma’nosi va grammatik qoidasi to‘g‘ri bo‘lsa, "isCorrect": true, "feedbackLabel": "Barakalla · Qoida to‘g‘ri qo‘llandi!", "feedbackText": o‘quvchi javobining tasdig‘i.
- Agar xato bo‘lsa, "isCorrect": false, "feedbackLabel": qisqa maslahat (o‘zbek tilida), "feedbackText": to‘g‘ri variant va tushuntirish, hamda "wrongFragment" (o‘quvchi xatosi), "rightFragment" (to‘g‘ri shakl) va "ruleSummary" (qisqa qoida) maydonlarini to‘ldiring.`;

      const parsed = await runStructuredGeneration(apiKey, prompt, CHECK_ANSWER_SCHEMA);
      return res.status(200).json({ ok: true, source: "gemini-3.8-flash", data: parsed });
    }

    return res.status(400).json({ error: "Noto‘g‘ri action parametri." });
  } catch (err) {
    return res.status(500).json({
      error: "AI_EXECUTION_ERROR",
      message: err?.message || "Gemini AI tahlilida xatolik yuz berdi.",
    });
  }
}
