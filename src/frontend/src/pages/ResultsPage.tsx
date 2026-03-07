import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Brain,
  Heart,
  RefreshCw,
  Smile,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import {
  formatSeverityLabel,
  getAnxietySeverity,
  getDepressionSeverity,
  getSocialIsolationRisk,
  getStressSeverity,
  severityBgClass,
} from "../utils/scoring";

const resourceRecommendations: Record<string, string[]> = {
  normal: ["Keep up your positive routines", "Explore gratitude journaling"],
  mild: [
    "Try the 4-7-8 breathing exercise",
    "Read 'The Happiness Lab' podcast",
  ],
  moderate: [
    "Speak with a school counselor",
    "Try progressive muscle relaxation",
  ],
  severe: [
    "Connect with a mental health professional",
    "Reach out to a trusted adult today",
  ],
  extremelySevere: [
    "Seek immediate professional support",
    "Contact a crisis helpline if needed",
  ],
};

function ScoreGauge({
  score,
  max,
  color,
}: { score: number; max: number; color: string }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>0</span>
        <span>{max}+</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const { latestResult } = useAppContext();

  if (!latestResult) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">No results yet</h2>
        <p className="text-muted-foreground mb-6">
          Complete a DASS-21 assessment to see your results here.
        </p>
        <Link to="/assessment" data-ocid="results.assessment.link">
          <Button className="rounded-xl bg-primary text-primary-foreground shadow-teal">
            Take Assessment
          </Button>
        </Link>
      </div>
    );
  }

  const depression = getDepressionSeverity(latestResult.depression.rawScore);
  const anxiety = getAnxietySeverity(latestResult.anxiety.rawScore);
  const stress = getStressSeverity(latestResult.stress.rawScore);
  const social = getSocialIsolationRisk(latestResult.socialIsolation.rawScore);

  const worstSeverity = [
    depression.severity,
    anxiety.severity,
    stress.severity,
  ].reduce((worst, s) => {
    const order = ["normal", "mild", "moderate", "severe", "extremelySevere"];
    return order.indexOf(s) > order.indexOf(worst) ? s : worst;
  }, "normal");

  const recommendations =
    resourceRecommendations[worstSeverity] || resourceRecommendations.normal;

  const scores = [
    {
      label: "Depression",
      icon: Brain,
      rawScore: depression.rawScore,
      severity: depression.severity,
      label2: depression.label,
      description: depression.description,
      max: 42,
      gaugeColor:
        depression.severity === "normal"
          ? "bg-green-400"
          : depression.severity === "mild"
            ? "bg-yellow-400"
            : depression.severity === "moderate"
              ? "bg-orange-400"
              : "bg-red-500",
    },
    {
      label: "Anxiety",
      icon: Heart,
      rawScore: anxiety.rawScore,
      severity: anxiety.severity,
      label2: anxiety.label,
      description: anxiety.description,
      max: 42,
      gaugeColor:
        anxiety.severity === "normal"
          ? "bg-green-400"
          : anxiety.severity === "mild"
            ? "bg-yellow-400"
            : anxiety.severity === "moderate"
              ? "bg-orange-400"
              : "bg-red-500",
    },
    {
      label: "Stress",
      icon: Smile,
      rawScore: stress.rawScore,
      severity: stress.severity,
      label2: stress.label,
      description: stress.description,
      max: 42,
      gaugeColor:
        stress.severity === "normal"
          ? "bg-green-400"
          : stress.severity === "mild"
            ? "bg-yellow-400"
            : stress.severity === "moderate"
              ? "bg-orange-400"
              : "bg-red-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Your Wellness Results
        </h1>
        <p className="text-muted-foreground">
          {latestResult.timestamp.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* Encouragement banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-teal-50 to-sage-50 border border-teal-200/60 rounded-2xl p-5 mb-6 flex gap-3 items-start"
        data-ocid="results.success_state"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Smile className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <p className="font-semibold text-teal-800 text-sm mb-1">
            You took an important step today
          </p>
          <p className="text-teal-700 text-sm leading-relaxed">
            Understanding your mental state is the first step toward wellbeing.
            These results are a snapshot — not a definition. With the right
            support and tools, growth is always possible.
          </p>
        </div>
      </motion.div>

      {/* DASS-21 Scores */}
      <div className="space-y-4 mb-6">
        {scores.map((score, i) => {
          const Icon = score.icon;
          return (
            <motion.div
              key={score.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              data-ocid={`results.${score.label.toLowerCase()}.card`}
            >
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {score.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score: {score.rawScore}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`rounded-full text-xs ${severityBgClass(score.severity)}`}
                    >
                      {score.label2}
                    </Badge>
                  </div>
                  <ScoreGauge
                    score={score.rawScore}
                    max={score.max}
                    color={score.gaugeColor}
                  />
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    {score.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Social Isolation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45 }}
        className="mb-6"
        data-ocid="results.social.card"
      >
        <Card className="rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              Social Isolation Proximity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">
                Score:{" "}
                <span className="font-semibold text-foreground">
                  {social.rawScore}
                </span>{" "}
                / 18
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${social.color}`}
              >
                {social.label}
              </span>
            </div>
            <ScoreGauge
              score={social.rawScore}
              max={18}
              color={
                social.risk === "low"
                  ? "bg-green-400"
                  : social.risk === "moderate"
                    ? "bg-yellow-400"
                    : social.risk === "high"
                      ? "bg-orange-400"
                      : "bg-red-500"
              }
            />
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              {social.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mb-6"
      >
        <Card className="rounded-2xl bg-gradient-to-br from-primary/5 to-sage-50 border-primary/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 p-5">
            <ul className="space-y-2">
              {recommendations.map((rec) => (
                <li key={rec} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="grid sm:grid-cols-3 gap-3"
      >
        <Link
          to="/resources"
          data-ocid="results.resources.link"
          className="col-span-1"
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl gap-2 text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Resources
          </Button>
        </Link>
        <Link
          to="/activities"
          data-ocid="results.activities.link"
          className="col-span-1"
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl gap-2 text-sm"
          >
            <Activity className="w-4 h-4" />
            Activities
          </Button>
        </Link>
        <Link
          to="/assessment"
          data-ocid="results.retake.link"
          className="col-span-1"
        >
          <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground shadow-teal gap-2 text-sm">
            <RefreshCw className="w-4 h-4" />
            Retake
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
