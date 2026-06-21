import { Scenario, ReflectionQuestion } from "./types";

export const scenarios: Scenario[] = [
  {
    id: "team-deadline",
    title: "場面 1｜チームメンバーの遅延",
    situation:
      "あなたのチームメンバーの一人が、重要なプロジェクトの締め切り2日前に「作業が間に合わないかもしれない」と報告してきました。",
    question: "あなたはどのように対応しますか？最も近いものを選んでください。",
    options: [
      {
        value: 1,
        label: "自分が引き取るか、上司に判断を仰ぐ",
      },
      {
        value: 2,
        label: "まず状況を確認して、何が問題かを把握しようとする",
      },
      {
        value: 3,
        label: "原因をヒアリングしてから、一緒に解決策を考える",
      },
      {
        value: 4,
        label:
          "相手の状況を受け止め、残りのタスクを整理して一緒に優先順位を決め直す",
      },
    ],
  },
  {
    id: "change-management",
    title: "場面 2｜急な方針変更",
    situation:
      "上司から突然「今まで進めてきた企画の方向性を大きく変えてほしい」と言われました。あなたはこの企画に数週間かけて取り組んできました。",
    question: "あなたはどのように対応しますか？最も近いものを選んでください。",
    options: [
      {
        value: 1,
        label: "内心不満だが、指示通りに作業し直す",
      },
      {
        value: 2,
        label: "変更の理由を確認してから、対応を検討する",
      },
      {
        value: 3,
        label: "理由を確認し、これまでの成果物で活かせる部分を提案する",
      },
      {
        value: 4,
        label:
          "変更の背景を理解した上で、今までの作業の活用策を提案しながら前向きに進める",
      },
    ],
  },
  {
    id: "disagreement",
    title: "場面 3｜意見の相違",
    situation:
      "会議で議論が白熱し、あなたの提案とは異なる方向性で話が進んでいます。あなたは自分のアイデアの方が効果的だと確信しています。",
    question: "あなたはどのように対応しますか？最も近いものを選んでください。",
    options: [
      {
        value: 1,
        label: "場の流れに合わせて、自分の意見を引っ込める",
      },
      {
        value: 2,
        label: "後から個別に自分の意見を伝える",
      },
      {
        value: 3,
        label: "「少し意見があるのですが」と切り出して自分の考えを伝える",
      },
      {
        value: 4,
        label:
          "相手の意見の良い点を認めてから、自分のアイデアの根拠を丁寧に説明して議論する",
      },
    ],
  },
];

export const reflectionQuestions: ReflectionQuestion[] = [
  {
    id: "awareness",
    text: "研修で学んだことを、意識的に日常業務で実践しようとしている",
  },
  {
    id: "change-felt",
    text: "研修前と比べて、自分の行動や対応の仕方が変わったと感じる",
  },
  {
    id: "sharing",
    text: "研修での気づきを、同僚や部下と共有したり話題にしたことがある",
  },
  {
    id: "success",
    text: "研修後に「以前と違うやり方で対応できた」と感じた瞬間がある",
  },
];

export const reflectionLabels = [
  "全くない",
  "あまりない",
  "ときどきある",
  "よくある",
  "常にある",
];
