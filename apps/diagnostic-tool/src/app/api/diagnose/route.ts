import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { AssessmentData, DiagnosisResult } from "@/lib/types";
import { scenarios } from "@/lib/scenarios";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const data: AssessmentData = await request.json();

  const scenarioText = data.scenarioAnswers
    .map((ans) => {
      const scenario = scenarios.find((s) => s.id === ans.scenarioId);
      if (!scenario) return "";
      return `【${scenario.title}】
状況: ${scenario.situation}
あなたの対応: ${ans.answer}`;
    })
    .join("\n\n");

  const prompt = `あなたは企業研修の効果測定と行動変容の専門家です。
以下の情報をもとに、受講者の研修後の行動変容度合いを診断し、具体的なフィードバックを提供してください。

## 研修テーマ
${data.trainingTheme}

## シナリオへの回答
${scenarioText}

## 研修後の振り返り
実際に取り組んだこと:
${data.reflection.whatTried}

うまくいったこと・難しかったこと:
${data.reflection.successAndChallenge}

---

上記の回答を分析し、「${data.trainingTheme}」の研修を受けた後の行動変容度合いを評価してください。
シナリオへの回答が、研修の学びを実践しようとしているか、具体的かつ相手を思いやる視点があるかを重視してください。

以下のJSON形式のみで回答してください（説明文は不要）：
{
  "score": 研修の学びが行動に反映されている度合い（1〜10の整数）,
  "summary": "受講者の全体的な行動変容の特徴（3〜4文、日本語）",
  "strengths": ["研修後に見られる強みや良い変化（3項目、各20〜40文字）"],
  "growthAreas": ["さらに伸ばせる成長テーマ（2項目、各20〜40文字）"],
  "advice": "今後に向けた具体的なアドバイス（2〜3文、日本語）",
  "nextSteps": ["今すぐ実践できる具体的なアクション（3項目、各30〜50文字）"]
}`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonText = content.text.replace(/```json\n?|\n?```/g, "").trim();
    const result: DiagnosisResult = JSON.parse(jsonText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Diagnosis error:", error);
    return NextResponse.json(
      { error: "診断中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
