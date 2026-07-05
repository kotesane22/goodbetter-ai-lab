"use client";

import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-10 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            研修後 行動変容診断
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Training Behavioral Change Assessment
          </p>

          <div className="text-left bg-slate-50 rounded-xl p-5 mb-8 space-y-3">
            <p className="text-sm font-semibold text-slate-700">
              このツールについて
            </p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">●</span>
                3つの職場シナリオにあなたの対応を回答します
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">●</span>
                研修後の実際の取り組みを振り返ります
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">●</span>
                行動変容の度合いを診断し、フィードバックを提供します（AI診断は任意で利用可）
              </li>
            </ul>
            <p className="text-xs text-slate-400 pt-1">所要時間：約10〜15分</p>
          </div>

          <Link
            href="/assessment"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            診断を始める
          </Link>
        </div>
      </div>
    </main>
  );
}
