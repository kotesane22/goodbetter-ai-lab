export interface Scenario {
  id: string;
  title: string;
  situation: string;
  question: string;
}

export interface ScenarioAnswer {
  scenarioId: string;
  answer: string;
}

export interface ReflectionData {
  whatTried: string;
  successAndChallenge: string;
}

export interface AssessmentData {
  trainingTheme: string;
  scenarioAnswers: ScenarioAnswer[];
  reflection: ReflectionData;
}

export interface DiagnosisResult {
  score: number;
  summary: string;
  strengths: string[];
  growthAreas: string[];
  advice: string;
  nextSteps: string[];
}
