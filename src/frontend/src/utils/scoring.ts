// DASS-21 Scoring utilities

export type Severity =
  | "normal"
  | "mild"
  | "moderate"
  | "severe"
  | "extremelySevere";

export interface ScoreResult {
  rawScore: number;
  severity: Severity;
  label: string;
  color: string;
  description: string;
}

export type SocialRisk = "low" | "moderate" | "high" | "veryHigh";

export interface SocialIsolationResult {
  rawScore: number;
  risk: SocialRisk;
  label: string;
  color: string;
  description: string;
}

// Questions mapped to subscales (1-indexed)
export const DEPRESSION_ITEMS = [3, 5, 10, 13, 16, 17, 21]; // * 2
export const ANXIETY_ITEMS = [2, 4, 7, 9, 15, 19, 20]; // * 2
export const STRESS_ITEMS = [1, 6, 8, 11, 12, 14, 18]; // * 2

export function calcDepressionScore(answers: number[]): number {
  return (
    DEPRESSION_ITEMS.reduce((sum, i) => sum + (answers[i - 1] ?? 0), 0) * 2
  );
}

export function calcAnxietyScore(answers: number[]): number {
  return ANXIETY_ITEMS.reduce((sum, i) => sum + (answers[i - 1] ?? 0), 0) * 2;
}

export function calcStressScore(answers: number[]): number {
  return STRESS_ITEMS.reduce((sum, i) => sum + (answers[i - 1] ?? 0), 0) * 2;
}

export function getDepressionSeverity(score: number): ScoreResult {
  let severity: Severity;
  let label: string;
  let description: string;
  if (score <= 9) {
    severity = "normal";
    label = "Normal";
    description =
      "Your mood appears balanced. Keep nurturing your emotional wellbeing.";
  } else if (score <= 13) {
    severity = "mild";
    label = "Mild";
    description =
      "You may be experiencing some low mood. Small daily habits can make a big difference.";
  } else if (score <= 20) {
    severity = "moderate";
    label = "Moderate";
    description =
      "Moderate depressive symptoms detected. Consider talking to a trusted adult or counselor.";
  } else if (score <= 27) {
    severity = "severe";
    label = "Severe";
    description =
      "Please reach out to a mental health professional or trusted person in your life.";
  } else {
    severity = "extremelySevere";
    label = "Extremely Severe";
    description =
      "Immediate support is strongly recommended. Please speak with a counselor or mental health professional today.";
  }
  return {
    rawScore: score,
    severity,
    label,
    color: severityColor(severity),
    description,
  };
}

export function getAnxietySeverity(score: number): ScoreResult {
  let severity: Severity;
  let label: string;
  let description: string;
  if (score <= 7) {
    severity = "normal";
    label = "Normal";
    description =
      "Your anxiety levels appear manageable. Great work taking care of yourself.";
  } else if (score <= 9) {
    severity = "mild";
    label = "Mild";
    description =
      "Mild anxiety present. Breathing exercises and grounding techniques can help.";
  } else if (score <= 14) {
    severity = "moderate";
    label = "Moderate";
    description =
      "Moderate anxiety symptoms. Consider mindfulness practices and talking with someone you trust.";
  } else if (score <= 19) {
    severity = "severe";
    label = "Severe";
    description =
      "Significant anxiety detected. Professional support can provide effective strategies.";
  } else {
    severity = "extremelySevere";
    label = "Extremely Severe";
    description =
      "Please seek professional support soon. You deserve care and effective treatment.";
  }
  return {
    rawScore: score,
    severity,
    label,
    color: severityColor(severity),
    description,
  };
}

export function getStressSeverity(score: number): ScoreResult {
  let severity: Severity;
  let label: string;
  let description: string;
  if (score <= 14) {
    severity = "normal";
    label = "Normal";
    description =
      "Your stress levels are within a healthy range. Keep practicing self-care.";
  } else if (score <= 18) {
    severity = "mild";
    label = "Mild";
    description =
      "Mild stress noted. Regular breaks and physical activity can help restore balance.";
  } else if (score <= 25) {
    severity = "moderate";
    label = "Moderate";
    description =
      "Moderate stress levels detected. Time management and relaxation techniques may help.";
  } else if (score <= 33) {
    severity = "severe";
    label = "Severe";
    description =
      "High stress levels. Please prioritize rest and consider speaking with a counselor.";
  } else {
    severity = "extremelySevere";
    label = "Extremely Severe";
    description =
      "Critical stress levels. Please seek professional support immediately.";
  }
  return {
    rawScore: score,
    severity,
    label,
    color: severityColor(severity),
    description,
  };
}

export function getSocialIsolationRisk(score: number): SocialIsolationResult {
  let risk: SocialRisk;
  let label: string;
  let color: string;
  let description: string;
  if (score <= 5) {
    risk = "low";
    label = "Low Risk";
    color = "text-green-700 bg-green-100";
    description =
      "You maintain healthy social connections. Keep nurturing your relationships.";
  } else if (score <= 10) {
    risk = "moderate";
    label = "Moderate Risk";
    color = "text-yellow-700 bg-yellow-100";
    description =
      "Some signs of social withdrawal. Try reaching out to one person this week.";
  } else if (score <= 15) {
    risk = "high";
    label = "High Risk";
    color = "text-orange-700 bg-orange-100";
    description =
      "Significant social isolation indicators. Reconnecting with others can greatly improve your wellbeing.";
  } else {
    risk = "veryHigh";
    label = "Very High Risk";
    color = "text-red-700 bg-red-100";
    description =
      "Serious social isolation detected. Please speak with a counselor or trusted adult about ways to reconnect.";
  }
  return { rawScore: score, risk, label, color, description };
}

export function severityColor(severity: Severity): string {
  switch (severity) {
    case "normal":
      return "severity-normal";
    case "mild":
      return "severity-mild";
    case "moderate":
      return "severity-moderate";
    case "severe":
      return "severity-severe";
    case "extremelySevere":
      return "severity-extreme";
  }
}

export function severityBgClass(severity: string): string {
  switch (severity) {
    case "normal":
      return "bg-green-100 text-green-800";
    case "mild":
      return "bg-yellow-100 text-yellow-800";
    case "moderate":
      return "bg-orange-100 text-orange-800";
    case "severe":
      return "bg-red-100 text-red-800";
    case "extremelySevere":
      return "bg-red-200 text-red-900";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function formatSeverityLabel(severity: string): string {
  switch (severity) {
    case "normal":
      return "Normal";
    case "mild":
      return "Mild";
    case "moderate":
      return "Moderate";
    case "severe":
      return "Severe";
    case "extremelySevere":
      return "Extremely Severe";
    default:
      return severity;
  }
}
