"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DiagnosisResult } from "@/lib/types";

function ScoreRing({ score }: { score: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  const color =
    score >= 8
      ? "#22c55e"
      : score >= 6
        ? "#3b82f6"
        : score >= 4
          ? "#f59e0b"
          : "#ef4444";

  const label =
    score >= 8
      ? "行動が大きく変わっています"
      : score >= 6
        ? "着実に変化が見られます"
        : score >= 4
          ? "変化の兆しがあります"
          : "これから一歩ずつ";

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="-mt-[88px] flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-900">{score}</span>
        <span className="text-xs text-slate-400">/10</span>
      </div>
      <p className="mt-6 text-sm font-semibold" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

export default function ResultPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [trainingTheme, setTrainingTheme] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosisResult");
    const theme = sessionStorage.getItem("trainingTheme");
    if (stored) setResult(JSON.parse(stored));
    if (theme) setTrainingTheme(theme);
  }, []);

  if (!result) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">結果を読み込んでいます...</p>
          <Link href="/" className="text-blue-600 text-sm underline">
            トップへ戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
            診断結果
          </p>
          <h1 className="text-xl font-bold text-slate-900 mb-1">
            行動変容診断レポート
          </h1>
          {trainingTheme && (
            <p className="text-sm text-slate-500">研修テーマ：{trainingTheme}</p>
          )}

          <div className="mt-8 flex flex-col items-center">
            <ScoreRing score={result.score} />
          </div>

          <div className="mt-8 bg-slate-50 rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              総合診断
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              研修後に見られる変化・強み
            </h2>
          </div>
          <ul className="space-y-2">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-green-500 mt-0.5 shrink-0">●</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h2 className="text-sm font-bold text-slate-900">
              さらに伸ばせる成長テーマ
            </h2>
          </div>
          <ul className="space-y-2">
            {result.growthAreas.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-amber-500 mt-0.5 shrink-0">●</span>
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* Advice */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white">
          <h2 className="text-sm font-bold mb-3">今後に向けたアドバイス</h2>
          <p className="text-sm leading-relaxed opacity-90">{result.advice}</p>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">
            今すぐ実践できるアクション
          </h2>
          <ol className="space-y-3">
            {result.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center shrink-0 mt-0.5 font-semibold">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 text-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            トップへ戻る
          </Link>
          <Link
            href="/assessment"
            className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    </main>
  );
}
