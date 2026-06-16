"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { scenarios, reflectionQuestions, reflectionLabels } from "@/lib/scenarios";
import { generateDiagnosis } from "@/lib/scoring";

type Step = "theme" | `scenario-${number}` | "reflection";

const STEPS: Step[] = [
  "theme",
  "scenario-0",
  "scenario-1",
  "scenario-2",
  "reflection",
];
const TOTAL = STEPS.length;

export default function AssessmentPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [trainingTheme, setTrainingTheme] = useState("");
  const [scenarioAnswers, setScenarioAnswers] = useState<(number | null)[]>([null, null, null]);
  const [reflectionAnswers, setReflectionAnswers] = useState<(number | null)[]>([null, null, null, null]);

  const step = STEPS[stepIndex];
  const progress = (stepIndex / (TOTAL - 1)) * 100;

  const scenarioIndex =
    step === "scenario-0" ? 0 : step === "scenario-1" ? 1 : step === "scenario-2" ? 2 : -1;

  const canProceed = () => {
    if (step === "theme") return trainingTheme.trim().length > 0;
    if (scenarioIndex >= 0) return scenarioAnswers[scenarioIndex] !== null;
    if (step === "reflection") return reflectionAnswers.every((a) => a !== null);
    return false;
  };

  const handleNext = () => {
    if (stepIndex < TOTAL - 1) setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleSubmit = () => {
    const result = generateDiagnosis({
      trainingTheme,
      scenarioAnswers: scenarioAnswers as number[],
      reflectionAnswers: reflectionAnswers as number[],
    });
    sessionStorage.setItem("diagnosisResult", JSON.stringify(result));
    sessionStorage.setItem("trainingTheme", trainingTheme);
    router.push("/result");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center py-12 px-6">
      <div className="max-w-2xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>ステップ {stepIndex + 1} / {TOTAL}</span>
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
          {/* Step: Theme */}
          {step === "theme" && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                基本情報
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                受講した研修のテーマを教えてください
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                例：リーダーシップ研修、コミュニケーション強化研修、OJT指導者研修
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

          {/* Step: Scenario */}
          {scenarioIndex >= 0 && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                シナリオ {scenarioIndex + 1} / 3
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {scenarios[scenarioIndex].title}
              </h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 mb-1">状況</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {scenarios[scenarioIndex].situation}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-4">
                {scenarios[scenarioIndex].question}
              </p>
              <div className="space-y-3">
                {scenarios[scenarioIndex].options.map((opt) => {
                  const selected = scenarioAnswers[scenarioIndex] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const updated = [...scenarioAnswers];
                        updated[scenarioIndex] = opt.value;
                        setScenarioAnswers(updated);
                      }}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all ${
                        selected
                          ? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
                          : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <span className={`inline-block w-5 h-5 rounded-full border-2 mr-3 align-middle transition-colors ${selected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                        {selected && (
                          <svg className="w-full h-full text-white p-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: Reflection */}
          {step === "reflection" && (
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                振り返り
              </p>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                研修後の自分を振り返ってください
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                各質問について、現在の状況に最も近いものを選んでください。
              </p>
              <div className="space-y-7">
                {reflectionQuestions.map((q, qi) => (
                  <div key={q.id}>
                    <p className="text-sm font-semibold text-slate-800 mb-3">
                      {qi + 1}. {q.text}
                    </p>
                    <div className="flex gap-2">
                      {reflectionLabels.map((label, li) => {
                        const val = li + 1;
                        const selected = reflectionAnswers[qi] === val;
                        return (
                          <button
                            key={li}
                            onClick={() => {
                              const updated = [...reflectionAnswers];
                              updated[qi] = val;
                              setReflectionAnswers(updated);
                            }}
                            className={`flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl border text-xs transition-all ${
                              selected
                                ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                                : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full border-2 transition-colors ${selected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`} />
                            <span className="hidden sm:block text-center leading-tight">{label}</span>
                            <span className="sm:hidden font-bold">{val}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1 px-1 sm:hidden">
                      <span>全くない</span>
                      <span>常にある</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            {stepIndex > 0 ? (
              <button
                onClick={handleBack}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← 戻る
              </button>
            ) : (
              <div />
            )}

            {step !== "reflection" ? (
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
                disabled={!canProceed()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                診断結果を見る
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
