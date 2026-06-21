import { AssessmentData, DiagnosisResult } from "./types";

type ScoreCategory = "high" | "medium-high" | "medium-low" | "low";

function getCategory(score: number): ScoreCategory {
  if (score >= 8) return "high";
  if (score >= 6) return "medium-high";
  if (score >= 4) return "medium-low";
  return "low";
}

export function generateDiagnosis(data: AssessmentData): DiagnosisResult {
  const { scenarioAnswers: sa, reflectionAnswers: ra, trainingTheme: theme } = data;

  // Score: scenarios weighted 60%, reflection 40%
  const scenarioNorm = (sa.reduce((a, b) => a + b, 0) - 3) / 9; // min=3, max=12
  const reflectionNorm = (ra.reduce((a, b) => a + b, 0) - 4) / 16; // min=4, max=20
  const score = Math.max(1, Math.min(10, Math.round(scenarioNorm * 0.6 * 9 + reflectionNorm * 0.4 * 9 + 1)));
  const category = getCategory(score);

  // Strengths: derived from high-scoring items
  const candidateStrengths: { condition: boolean; text: string }[] = [
    { condition: sa[0] >= 3, text: "困っているメンバーへの関わり方が、解決策を押しつけるのではなく一緒に考えるスタンスに変わっています" },
    { condition: sa[1] >= 3, text: "急な変化や不確実な状況に対して、まず背景を理解してから建設的に動こうとする姿勢が見られます" },
    { condition: sa[2] >= 3, text: "意見が異なる場面でも、対話を大切にしながら合意を目指せています" },
    { condition: ra[2] >= 4, text: "研修の学びを周囲と共有し、チームや組織への波及効果を生んでいます" },
    { condition: ra[3] >= 4, text: "実際の業務で研修の学びを活かした具体的な成功体験があります" },
    { condition: ra[0] >= 4, text: "研修の内容を常に意識しながら業務に臨んでいます" },
  ];

  let strengths = candidateStrengths.filter((s) => s.condition).map((s) => s.text).slice(0, 3);
  if (strengths.length === 0) {
    strengths = [
      "研修に参加し、自己診断に向き合う姿勢自体が変化の第一歩です",
      "現状を客観的に把握しようとする意識があります",
    ];
  } else if (strengths.length === 1) {
    strengths.push("診断に正直に向き合い、自己理解を深めようとしています");
  }

  // Growth areas: derived from low-scoring items
  const candidateGrowth: { condition: boolean; text: string }[] = [
    { condition: sa[0] <= 2, text: "困っている相手の気持ちに寄り添い、一緒に解決策を考える傾聴・共感の実践" },
    { condition: sa[1] <= 2, text: "変化が起きたときにまず背景を理解してから動く習慣化" },
    { condition: sa[2] <= 2, text: "意見が異なる場面でのアサーティブなコミュニケーションスキルの強化" },
    { condition: ra[1] <= 2, text: "研修前後の自分の行動の違いを日々の業務で意識的に観察する" },
  ];

  let growthAreas = candidateGrowth.filter((g) => g.condition).map((g) => g.text).slice(0, 2);
  if (growthAreas.length === 0) {
    growthAreas = [
      "高い行動変容をさらに深め、チームや後輩への影響力を広げる",
      "自分が実践していることを言語化・体系化して他者への指導に活かす",
    ];
  }

  const summaries: Record<ScoreCategory, string> = {
    high: `${theme}の研修で得た学びが、日常の行動にしっかりと根づいています。シナリオへの回答と振り返りの両方から、研修前と比べた明確な行動変容が確認できます。特に、状況を丁寧に観察し相手の立場を考えた対応ができるようになっている点が顕著です。継続してこのスタンスを維持し、周囲にも良い影響を与え続けてください。`,
    "medium-high": `${theme}の研修で学んだことが、少しずつ行動に表れています。すべての場面で完璧に実践できているわけではありませんが、意識の変化が行動の変化につながっている証拠が見えます。もう一歩踏み込んで実践することで、さらに大きな変化が期待できます。`,
    "medium-low": `${theme}の研修を受けて、意識や考え方は変わってきています。ただ、まだ行動として完全に定着していない部分もあるようです。「わかっているが、できていない」という状態は多くの人が経験するステップです。小さな場面から意識して実践を続けることが大切です。`,
    low: `${theme}の研修を受けてから、日々の業務が続く中で、学びを実践するのが難しいと感じているかもしれません。それは決して珍しいことではありません。まずは一つの行動に絞って、意識的に取り組むところから始めてみましょう。`,
  };

  const advices: Record<ScoreCategory, string> = {
    high: "現在の行動変容をさらに深めるために、自分が実践していることを言語化し、チームメンバーや後輩と共有してみましょう。教えることで自分自身の理解も深まり、組織全体の成長につながります。",
    "medium-high": "「ほぼできている」状態から「完全に習慣化している」状態に進むには、うまくいったときの具体的な場面を記録する習慣が効果的です。成功体験を積み重ねることで、行動が自然なものになっていきます。",
    "medium-low": "今の段階で最も重要なのは「小さく実践する」ことです。すべての場面で完璧にやろうとせず、まず一つの場面だけに集中して研修の学びを試してみましょう。成功体験が積み重なると、自然と他の場面にも広がっていきます。",
    low: "研修の振り返りを行うことで、学びへの意識が再び高まります。まず「研修で最も印象に残ったこと」を一つ選び、明日の業務でそれだけを意識するところから始めてみましょう。一歩でも前に進むことが大切です。",
  };

  const nextStepsMap: Record<ScoreCategory, string[]> = {
    high: [
      "自分が実践していることをチームのミーティングで一度シェアしてみる",
      "研修後の変化について上司や同僚にフィードバックをもらう機会を作る",
      "研修の学びをさらに深める本や記事を一冊・一本選んで読む",
    ],
    "medium-high": [
      "今週の業務で研修の学びを活かせた場面を日記やメモに記録する",
      "「うまくできなかった場面」を一つ振り返り、次はどうするかを考えてメモする",
      "同じ研修を受けた同僚と実践状況を共有し合う場を設ける",
    ],
    "medium-low": [
      "今日から一つの場面だけに絞って研修の学びを実践する",
      "研修テキストやメモを見直し、特に印象に残った学びを一つ選ぶ",
      "一週間後に自分の変化を振り返る時間を今すぐカレンダーに入れる",
    ],
    low: [
      "研修で学んだことを箇条書きで5分間書き出してみる",
      "明日の業務で研修の学びを「一度だけ」意識して使ってみる",
      "研修後の変化についての悩みを上司や研修担当者に相談してみる",
    ],
  };

  return {
    score,
    summary: summaries[category],
    strengths,
    growthAreas,
    advice: advices[category],
    nextSteps: nextStepsMap[category],
  };
}
