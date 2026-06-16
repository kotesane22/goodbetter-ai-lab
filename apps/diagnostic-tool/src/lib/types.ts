export interface ScenarioOption {
  value: number; // 1–4（低→高の行動変容）
  label: string;
}

export interface Scenario {
  id: string;
  title: string;
  situation: string;
  question: string;
  options: ScenarioOption[];
}

export interface ReflectionQuestion {
  id: string;
  text: string;
}

export interface AssessmentData {
  trainingTheme: string;
  scenarioAnswers: number[]; // 1–4 each
  reflectionAnswers: number[]; // 1–5 each
}

export interface DiagnosisResult {
  score: number;
  summary: string;
  strengths: string[];
  growthAreas: string[];
  advice: string;
  nextSteps: string[];
}
