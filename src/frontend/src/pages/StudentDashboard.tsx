import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  BookOpen,
  ClipboardList,
  Heart,
  Link2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Copy, GraduationCap, Mail, Phone, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DailyTrackers from "../components/DailyTrackers";
import MoodCheckIn from "../components/MoodCheckIn";
import PinGate, { ChangePinDialog } from "../components/PinGate";
import { useAppContext } from "../context/AppContext";
import { getTodaysTip } from "../data/wellnessTips";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useProfile } from "../hooks/useProfile";
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

const todayTip = getTodaysTip();

const STORAGE_KEY = "lumi_arc_daily_logs";
const TODAY_KEY = new Date().toISOString().slice(0, 10);

function getTodayLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const logs = raw ? JSON.parse(raw) : {};
    return logs[TODAY_KEY] ?? {};
  } catch {
    return {};
  }
}

export default function StudentDashboard() {
  const { latestResult, setUserRole } = useAppContext();
  const { identity } = useInternetIdentity();
  const { profile: lumiProfile } = useProfile(identity);

  // Profile
  const [profile, setProfile] = useState<{
    displayName?: string;
    avatar?: string;
  } | null>(null);

  // Reminder banner
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [todayLog, setTodayLog] = useState(getTodayLog);

  useEffect(() => {
    setUserRole("student");
  }, [setUserRole]);
  useEffect(() => {
    // Set last active timestamp
    localStorage.setItem("lumiLastActive", new Date().toISOString());
    // Load profile
    try {
      const raw = localStorage.getItem("lumiProfile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      // ignore
    }
    // Refresh today log
    setTodayLog(getTodayLog());
  }, []);

  const missingTrackers = useMemo(() => {
    const missing: string[] = [];
    if (!todayLog.sleep) missing.push("sleep");
    if (!todayLog.exercise) missing.push("exercise");
    if (!todayLog.outdoor) missing.push("outdoor games");
    return missing;
  }, [todayLog]);

  const showBanner = !bannerDismissed && missingTrackers.length > 0;

  const displayName = profile?.displayName?.trim() || null;
  const avatarEmoji = profile?.avatar || null;

  const handleScrollToTrackers = () => {
    const el = document.getElementById("daily-habits-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PinGate userRole="student">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Reminder Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -12, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 overflow-hidden"
              data-ocid="dashboard.reminder.panel"
            >
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <Bell className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800 flex-1">
                  You haven&apos;t logged your{" "}
                  <span className="font-semibold">
                    {missingTrackers.join(", ")}
                  </span>{" "}
                  today — a small step counts!
                </p>
                <button
                  type="button"
                  onClick={handleScrollToTrackers}
                  className="text-xs font-semibold text-amber-700 underline underline-offset-2 flex-shrink-0"
                  data-ocid="dashboard.reminder.button"
                >
                  Log now
                </button>
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  className="text-amber-500 hover:text-amber-700 flex-shrink-0"
                  data-ocid="dashboard.reminder.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome header */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Sparkles className="w-4 h-4 text-teal-500" />
              Good to see you
            </div>
            <ChangePinDialog userRole="student" />
          </div>
          {displayName ? (
            <div className="flex items-center gap-3">
              {avatarEmoji && (
                <span className="text-4xl leading-none">{avatarEmoji}</span>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Welcome back, {displayName}! 👋
              </h1>
            </div>
          ) : (
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Your Wellness Dashboard
            </h1>
          )}
        </motion.div>

        {/* Two-column responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* ── Left / Main Column ── */}
          <div className="flex flex-col gap-6 min-w-0">
            {/* Mood Check-In — shown first on mobile */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.5}
              variants={fadeUp}
              className="lg:hidden"
            >
              <MoodCheckIn />
            </motion.div>

            {/* Latest Results or CTA */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
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
                      Take your first DASS-21 assessment to understand your
                      current mental wellness.
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
            >
              <h2 className="font-display text-xl font-semibold mb-4">
                Quick Access
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
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
                      <div className="font-semibold text-sm mb-1">
                        {link.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {link.description}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            {/* Student Code & Teacher Info */}
            {lumiProfile && (
              <motion.div
                initial="hidden"
                animate="visible"
                custom={2.2}
                variants={fadeUp}
                className="grid sm:grid-cols-2 gap-4"
              >
                {/* Student Code Card */}
                <div
                  className="rounded-2xl bg-teal-50 border border-teal-200 p-4 flex flex-col gap-2"
                  data-ocid="dashboard.student_code.card"
                >
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                      Your Student Code
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-lg text-foreground">
                      {lumiProfile.studentCode || "—"}
                    </span>
                    {lumiProfile.studentCode && (
                      <button
                        type="button"
                        data-ocid="dashboard.copy_code.button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            lumiProfile.studentCode || "",
                          );
                          toast.success("Student code copied!");
                        }}
                        className="p-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-teal-600" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-teal-600">
                    Share this code with your parent/guardian
                  </p>
                </div>

                {/* Teacher Info Card */}
                <div
                  className="rounded-2xl bg-sage-50 border border-sage-200 p-4 flex flex-col gap-2"
                  data-ocid="dashboard.teacher_info.card"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-sage-600" />
                    <span className="text-xs font-semibold text-sage-700 uppercase tracking-wide">
                      Your Mentor Teacher
                    </span>
                  </div>
                  {lumiProfile.linkedTeacherEmail ? (
                    <>
                      <p className="font-medium text-sm text-foreground">
                        {lumiProfile.linkedTeacherName || "Teacher"}
                      </p>
                      <a
                        href={`mailto:${lumiProfile.linkedTeacherEmail}`}
                        className="flex items-center gap-1 text-xs text-sage-600 hover:underline truncate"
                      >
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {lumiProfile.linkedTeacherEmail}
                      </a>
                      {(lumiProfile as any).linkedTeacherPhone && (
                        <a
                          href={`tel:${(lumiProfile as any).linkedTeacherPhone}`}
                          className="flex items-center gap-1 text-xs text-sage-600 hover:underline mt-0.5"
                        >
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          {(lumiProfile as any).linkedTeacherPhone}
                        </a>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Not yet linked to a teacher. Sign up via your teacher's
                      invite link to connect.
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Daily Habits Trackers */}
            <motion.div
              id="daily-habits-section"
              initial="hidden"
              animate="visible"
              custom={2.5}
              variants={fadeUp}
            >
              <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                🌱 Daily Habits
              </h2>
              <DailyTrackers />
            </motion.div>

            {/* Daily Tip */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
            >
              <Card
                className="rounded-2xl bg-gradient-to-br from-primary/5 to-sage-100/50 border-primary/20 shadow-sm"
                data-ocid="dashboard.wellness_tip.card"
              >
                <CardContent className="p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide">
                        Today&apos;s Wellness Tip
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <p className="text-foreground leading-relaxed text-sm">
                      {todayTip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ── Right Column — Mood Check-In (desktop only) ── */}
          <motion.div
            initial="hidden"
            animate="visible"
            custom={1.5}
            variants={fadeUp}
            className="hidden lg:block self-start sticky top-24"
          >
            <MoodCheckIn />
          </motion.div>
        </div>
      </div>
    </PinGate>
  );
}
