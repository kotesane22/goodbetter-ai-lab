"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scenarios } from "@/lib/scenarios";
import { AssessmentData } from "@/lib/types";

type Step = "theme" | "scenario-0" | "scenario-1" | "scenario-2" | "reflection";

const STEPS: Step[] = ["theme", "scenario-0", "scenario-1", "scenario-2", "reflection"];
const TOTAL_STEPS = STEPS.length;

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [trainingTheme, setTrainingTheme] = useState("");
  const [scenarioAnswers, setScenarioAnswers] = useState(["", "", ""]);
  const [whatTried, setWhatTried] = useState("");
  const [successAndChallenge, setSuccessAndChallenge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex) / (TOTAL_STEPS - 1)) * 100;

  const canProceed = () => {
    if (currentStep === "theme") return trainingTheme.trim().length > 0;
    if (currentStep === "scenario-0") return scenarioAnswers[0].trim().length > 0;
    if (currentStep === "scenario-1") return scenarioAnswers[1].trim().length > 0;
    if (currentStep === "scenario-2") return scenarioAnswers[2].trim().length > 0;
    if (currentStep === "reflection") return whatTried.trim().length > 0 && successAndChallenge.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (currentStepIndex < TOTAL_STEPS - 1) {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    const data: AssessmentData = {
      trainingTheme,
      scenarioAnswers: scenarios.map((s, i) => ({
        scenarioId: s.id,
        answer: scenarioAnswers[i],
      })),
      reflection: { whatTried, successAndChallenge },
    };

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("API error");
      const result = await res.json();
      sessionStorage.setItem("diagnosisResult", JSON.stringify(result));
      sessionStorage.setItem("trainingTheme", trainingTheme);
      router.push("/result");
    } catch {
      setError("診断中にエラーが発生しました。もう一度お試しください。");
      setIsSubmitting(false);
    }
  };

  const scenarioIndex =
    currentStep === "scenario-0" ? 0 : currentStep === "scenario-1" ? 1 : 2;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-start p-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>
              ステップ {currentStepIndex + 1} / {TOTAL_STEPS}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Step: Training Theme */}
          {currentStep === "theme" && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                基本情報
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                受講した研修のテーマを教えてください
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                例：「リーダーシップ研修」「コミュニケーション強化研修」「OJT指導者研修」など
              </p>
              <input
                type="text"
                value={trainingTheme}
                onChange={(e) => setTrainingTheme(e.target.value)}
                placeholder="研修テーマを入力..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => e.key === "Enter" && canProceed() && handleNext()}
              />
            </div>
          )}

          {/* Step: Scenarios */}
          {(currentStep === "scenario-0" || currentStep === "scenario-1" || currentStep === "scenario-2") && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                シナリオ {scenarioIndex + 1} / 3
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {scenarios[scenarioIndex].title}
              </h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  状況
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scenarios[scenarioIndex].situation}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-3">
                {scenarios[scenarioIndex].question}
              </p>
              <textarea
                value={scenarioAnswers[scenarioIndex]}
                onChange={(e) => {
                  const updated = [...scenarioAnswers];
                  updated[scenarioIndex] = e.target.value;
                  setScenarioAnswers(updated);
                }}
                placeholder="あなたの対応を具体的に記入してください..."
                rows={5}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-slate-400 mt-2">
                研修で学んだことを意識しながら、できるだけ具体的に書いてみましょう
              </p>
            </div>
          )}

          {/* Step: Reflection */}
          {currentStep === "reflection" && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                振り返り
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                研修後の実際の行動を振り返りましょう
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                研修で学んだことを日常業務でどう活かしたか、正直に書いてみてください。
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    研修後に実際に取り組んだこと・変えようとしたことは？
                  </label>
                  <textarea
                    value={whatTried}
                    onChange={(e) => setWhatTried(e.target.value)}
                    placeholder="例：毎朝メンバーに声をかけるようにした、会議では必ず一度相手の意見を受け止めてから発言した..."
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    うまくいったこと・難しかったことは？
                  </label>
                  <textarea
                    value={successAndChallenge}
                    onChange={(e) => setSuccessAndChallenge(e.target.value)}
                    placeholder="例：声かけは習慣になってきたが、プレッシャーがかかる場面では以前の対応に戻ってしまうことがある..."
                    rows={4}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            {currentStepIndex > 0 ? (
              <button
                onClick={handleBack}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← 戻る
              </button>
            ) : (
              <div />
            )}

            {currentStep !== "reflection" ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                次へ →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    AIが分析中...
                  </>
                ) : (
                  "診断する"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
