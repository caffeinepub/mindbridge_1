import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Heart,
  Link2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { formatSeverityLabel, severityBgClass } from "../utils/scoring";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const quickLinks = [
  {
    to: "/assessment",
    icon: ClipboardList,
    label: "Take Assessment",
    description: "DASS-21 questionnaire",
    color: "from-teal-500/10 to-teal-600/5 hover:from-teal-500/20",
    iconColor: "text-teal-600 bg-teal-100",
  },
  {
    to: "/resources",
    icon: BookOpen,
    label: "Wellness Resources",
    description: "Books, podcasts & articles",
    color: "from-sage-500/10 to-sage-600/5 hover:from-sage-500/20",
    iconColor: "text-sage-600 bg-sage-100",
  },
  {
    to: "/activities",
    icon: Activity,
    label: "Language Activities",
    description: "Journaling & affirmations",
    color: "from-purple-500/10 to-purple-600/5 hover:from-purple-500/20",
    iconColor: "text-purple-600 bg-purple-100",
  },
  {
    to: "/link-guardian",
    icon: Link2,
    label: "Link Guardian",
    description: "Connect teacher & parent",
    color: "from-rose-500/10 to-rose-600/5 hover:from-rose-500/20",
    iconColor: "text-rose-600 bg-rose-100",
  },
];

const wellnessTips = [
  "Take a 10-minute walk outside today — even brief nature exposure reduces cortisol levels.",
  "Try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8.",
  "Write down three things you appreciate about yourself, no matter how small.",
  "Reach out to one friend today, even just to share a meme or a kind message.",
  "Set a gentle boundary with one stressor today — you don't have to do everything at once.",
];

const todayTip = wellnessTips[new Date().getDay() % wellnessTips.length];

export default function StudentDashboard() {
  const { latestResult } = useAppContext();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Welcome header */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={fadeUp}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Sparkles className="w-4 h-4 text-teal-500" />
          Good to see you
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Your Wellness Dashboard
        </h1>
      </motion.div>

      {/* Latest Results or CTA */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={fadeUp}
        className="mb-8"
      >
        {latestResult ? (
          <Card className="rounded-2xl border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-teal-50 to-sage-50 border-b border-border/40">
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  Latest Assessment Results
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {latestResult.timestamp.toLocaleDateString()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Depression",
                    score: latestResult.depression.rawScore,
                    severity: latestResult.depression.severity,
                  },
                  {
                    label: "Anxiety",
                    score: latestResult.anxiety.rawScore,
                    severity: latestResult.anxiety.severity,
                  },
                  {
                    label: "Stress",
                    score: latestResult.stress.rawScore,
                    severity: latestResult.stress.severity,
                  },
                  {
                    label: "Social Isolation",
                    score: latestResult.socialIsolation.rawScore,
                    severity: null,
                    risk: latestResult.socialIsolation.risk,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="text-center p-3 rounded-xl bg-muted/40"
                    data-ocid={`dashboard.${item.label.toLowerCase().replace(" ", "_")}.card`}
                  >
                    <div className="font-display text-2xl font-bold text-foreground mb-1">
                      {item.score}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {item.label}
                    </div>
                    {item.severity ? (
                      <Badge
                        className={`text-xs rounded-full ${severityBgClass(item.severity)}`}
                      >
                        {formatSeverityLabel(item.severity)}
                      </Badge>
                    ) : (
                      <Badge
                        className={`text-xs rounded-full ${
                          item.risk === "low"
                            ? "bg-green-100 text-green-800"
                            : item.risk === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.risk === "high"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.risk === "low"
                          ? "Low Risk"
                          : item.risk === "moderate"
                            ? "Moderate"
                            : item.risk === "high"
                              ? "High Risk"
                              : "Very High"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <Link to="/results" data-ocid="dashboard.results.link">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-sm"
                  >
                    View Full Results
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="rounded-2xl border-dashed border-2 border-teal-300 bg-teal-50/50 shadow-none">
            <CardContent
              className="p-8 text-center"
              data-ocid="dashboard.assessment.empty_state"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                No assessment yet
              </h3>
              <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
                Take your first DASS-21 assessment to understand your current
                mental wellness.
              </p>
              <Link
                to="/assessment"
                data-ocid="dashboard.start_assessment.button"
              >
                <Button className="rounded-xl bg-primary text-primary-foreground shadow-teal h-10">
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Quick links */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={2}
        variants={fadeUp}
        className="mb-8"
      >
        <h2 className="font-display text-xl font-semibold mb-4">
          Quick Access
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={`dashboard.quicklink.${i + 1}`}
                className={`group p-5 rounded-2xl bg-gradient-to-br ${link.color} border border-border/40 transition-all hover:shadow-sm hover:-translate-y-0.5`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${link.iconColor}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm mb-1">{link.label}</div>
                <div className="text-xs text-muted-foreground">
                  {link.description}
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Daily Tip */}
      <motion.div
        initial="hidden"
        animate="visible"
        custom={3}
        variants={fadeUp}
      >
        <Card className="rounded-2xl bg-gradient-to-br from-primary/5 to-sage-100/50 border-primary/20 shadow-sm">
          <CardContent className="p-6 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">
                Today's Wellness Tip
              </div>
              <p className="text-foreground leading-relaxed text-sm">
                {todayTip}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
