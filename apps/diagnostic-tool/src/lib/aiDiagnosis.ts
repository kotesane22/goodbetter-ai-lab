import { AssessmentData, DiagnosisResult } from "./types";
import { scenarios, reflectionQuestions, reflectionLabels } from "./scenarios";

const STORAGE_KEY = "anthropicApiKey";

// --- APIキー管理（ブラウザのlocalStorageにのみ保存。サーバーには送りません） ---
export function getApiKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

export function setApiKey(key: string): void {
  if (typeof window === "undefined") return;
  const trimmed = key.trim();
  if (trimmed) {
    window.localStorage.setItem(STORAGE_KEY, trimmed);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function clearApiKey(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

// 構造化出力のスキーマ（DiagnosisResult に一致）
const RESULT_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "integer", description: "1〜10の総合スコア" },
    summary: { type: "string", description: "総合診断（150〜250字程度）" },
    strengths: { type: "array", items: { type: "string" }, description: "研修後に見られる強み（2〜3件）" },
    growthAreas: { type: "array", items: { type: "string" }, description: "さらに伸ばせる成長テーマ（1〜2件）" },
    advice: { type: "string", description: "今後に向けたアドバイス" },
    nextSteps: { type: "array", items: { type: "string" }, description: "今すぐ実践できる具体的アクション（3件）" },
  },
  required: ["score", "summary", "strengths", "growthAreas", "advice", "nextSteps"],
  additionalProperties: false,
} as const;

function buildPrompt(data: AssessmentData): string {
  const { trainingTheme, scenarioAnswers, reflectionAnswers } = data;

  const scenarioLines = scenarios
    .map((s, i) => {
      const chosen = s.options.find((o) => o.value === scenarioAnswers[i]);
      return `【${s.title}】\n状況: ${s.situation}\n選んだ対応(4段階中${scenarioAnswers[i]}): ${chosen?.label ?? "未回答"}`;
    })
    .join("\n\n");

  const reflectionLines = reflectionQuestions
    .map((q, i) => {
      const rating = reflectionAnswers[i];
      const label = reflectionLabels[rating - 1] ?? "";
      return `- ${q.text}\n  回答: ${rating}/5（${label}）`;
    })
    .join("\n");

  return `以下は「${trainingTheme}」を受講した人の、研修後の行動変容に関する自己診断データです。

# 職場シナリオへの対応（値が高いほど望ましい行動変容）
${scenarioLines}

# 研修後の振り返り（5段階評価）
${reflectionLines}

このデータをもとに、行動変容の度合いを診断してください。scoreは1〜10の整数で、シナリオの対応レベルと振り返りの評価を総合して決めてください。summary・advice・nextSteps・strengths・growthAreas はすべて日本語で、受講者本人に語りかける温かく具体的なトーンで書いてください。研修テーマ「${trainingTheme}」の文脈を反映させてください。`;
}

const SYSTEM_PROMPT =
  "あなたは企業研修の行動変容を評価する経験豊富な人材開発の専門家です。受講者を励ましつつ、具体的で実践的なフィードバックを返します。断定的に責めるのではなく、次の一歩につながる前向きな診断を心がけてください。";

// ブラウザから直接 Claude API を呼び出して診断を生成する（BYOK方式）
export async function generateDiagnosisAI(data: AssessmentData): Promise<DiagnosisResult> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("APIキーが設定されていません");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // ブラウザからの直接呼び出しを許可（BYOK）
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPrompt(data) }],
      output_config: { format: { type: "json_schema", schema: RESULT_SCHEMA } },
    }),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const err = await res.json();
      detail = err?.error?.message ?? "";
    } catch {
      // ignore
    }
    throw new Error(`Claude APIエラー (${res.status})${detail ? `: ${detail}` : ""}`);
  }

  const json = await res.json();
  const textBlock = (json.content ?? []).find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) throw new Error("診断結果を取得できませんでした");

  const parsed = JSON.parse(textBlock.text) as DiagnosisResult;

  // スコアを1〜10にクランプし、配列が空でも破綻しないよう最低限を担保
  const score = Math.max(1, Math.min(10, Math.round(parsed.score)));
  return {
    score,
    summary: parsed.summary,
    strengths: parsed.strengths?.length ? parsed.strengths : ["診断に前向きに取り組めています"],
    growthAreas: parsed.growthAreas?.length ? parsed.growthAreas : ["学びをさらに深める"],
    advice: parsed.advice,
    nextSteps: parsed.nextSteps?.length ? parsed.nextSteps : ["研修の学びを1つ選んで明日試してみる"],
  };
}
