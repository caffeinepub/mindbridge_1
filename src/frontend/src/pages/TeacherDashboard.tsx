import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Dumbbell,
  Flame,
  Moon,
  Smile,
  TreePine,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  ALL_BADGES,
  type MoodValue,
  type StudentRecord,
  teacherStudents,
} from "../data/teacherSampleData";

import { Copy, Link2, Mail, User } from "lucide-react";
import { toast } from "sonner";
import PinGate, { ChangePinDialog } from "../components/PinGate";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { generateTeacherInviteLink, useProfile } from "../hooks/useProfile";
// ── Mood helpers ─────────────────────────────────────────────────────────────────────────────

const MOOD_CONFIG: Record<
  MoodValue,
  { label: string; color: string; bar: string; emoji: string }
> = {
  "Very Happy": {
    label: "Very Happy",
    color: "bg-teal-100 text-teal-700",
    bar: "bg-teal-400",
    emoji: "😄",
  },
  Happy: {
    label: "Happy",
    color: "bg-green-100 text-green-700",
    bar: "bg-green-400",
    emoji: "🙂",
  },
  Neutral: {
    label: "Neutral",
    color: "bg-amber-100 text-amber-700",
    bar: "bg-amber-400",
    emoji: "😐",
  },
  Sad: {
    label: "Sad",
    color: "bg-orange-100 text-orange-700",
    bar: "bg-orange-400",
    emoji: "😕",
  },
  "Very Sad": {
    label: "Very Sad",
    color: "bg-red-100 text-red-700",
    bar: "bg-red-400",
    emoji: "😢",
  },
};

const MOOD_SCORE: Record<MoodValue, number> = {
  "Very Happy": 5,
  Happy: 4,
  Neutral: 3,
  Sad: 2,
  "Very Sad": 1,
};

const MOOD_EMOJIS_BY_SCORE: string[] = ["", "😢", "😕", "😐", "🙂", "😄"];

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  Normal: { label: "Normal", color: "bg-teal-100 text-teal-700" },
  Mild: { label: "Mild", color: "bg-amber-100 text-amber-700" },
  Moderate: { label: "Moderate", color: "bg-orange-100 text-orange-700" },
  Severe: { label: "Severe", color: "bg-red-100 text-red-700" },
  "Extremely Severe": {
    label: "Extremely Severe",
    color: "bg-red-200 text-red-800",
  },
};

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.Normal;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Class Overview ─────────────────────────────────────────────────────────────────────────────

type FilterType = "all" | "at-risk" | "active";

function ClassOverview({
  onSelectStudent,
}: {
  onSelectStudent: (s: StudentRecord) => void;
}) {
  const [filter, setFilter] = useState<FilterType>("all");

  const atRiskCount = teacherStudents.filter((s) => s.isAtRisk).length;
  const avgMoodScore =
    teacherStudents.reduce((acc, s) => acc + MOOD_SCORE[s.mood], 0) /
    teacherStudents.length;
  const avgMoodEmoji = MOOD_EMOJIS_BY_SCORE[Math.round(avgMoodScore)] ?? "😐";
  const avgXP = Math.round(
    teacherStudents.reduce((acc, s) => acc + s.xp, 0) / teacherStudents.length,
  );

  const filtered = useMemo(() => {
    if (filter === "at-risk") return teacherStudents.filter((s) => s.isAtRisk);
    if (filter === "active")
      return teacherStudents.filter((s) => s.lastActive === "Today");
    return teacherStudents;
  }, [filter]);

  const filterBtns: { key: FilterType; label: string }[] = [
    { key: "all", label: "All Students" },
    { key: "at-risk", label: "At Risk" },
    { key: "active", label: "Active Today" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Class Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Mental wellness at a glance — {teacherStudents.length} students
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <Users className="w-4 h-4" />
          Lumi Arc Teacher View
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: String(teacherStudents.length),
            icon: Users,
            color: "bg-teal-50 border-teal-200",
            iconColor: "text-teal-600",
            valueColor: "text-teal-700",
            isEmoji: false,
          },
          {
            label: "At Risk",
            value: String(atRiskCount),
            icon: AlertTriangle,
            color: "bg-red-50 border-red-200",
            iconColor: "text-red-500",
            valueColor: "text-red-600",
            isEmoji: false,
          },
          {
            label: "Average Mood",
            value: avgMoodEmoji,
            icon: Smile,
            color: "bg-amber-50 border-amber-200",
            iconColor: "text-amber-500",
            valueColor: "text-amber-700",
            isEmoji: true,
          },
          {
            label: "Class Avg XP",
            value: `${avgXP} XP`,
            icon: Zap,
            color: "bg-purple-50 border-purple-200",
            iconColor: "text-purple-500",
            valueColor: "text-purple-700",
            isEmoji: false,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border p-5 ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
              <div
                className={`font-display font-bold ${stat.valueColor} ${stat.isEmoji ? "text-4xl" : "text-3xl"}`}
              >
                {stat.value}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {filterBtns.map((btn) => (
          <button
            type="button"
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            data-ocid="teacher.filter.tab"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === btn.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            {btn.label}
            {btn.key === "at-risk" && atRiskCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {atRiskCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Student grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((student, i) => (
            <motion.div
              key={student.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ delay: i * 0.04 }}
              data-ocid={`teacher.student.card.${i + 1}`}
              onClick={() => onSelectStudent(student)}
              className={`relative bg-card border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group ${
                student.isAtRisk
                  ? "border-red-200 hover:border-red-300"
                  : "border-border/50 hover:border-primary/30"
              }`}
            >
              {/* At-risk banner */}
              {student.isAtRisk && (
                <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-t-2xl flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" />
                  Needs Attention
                </div>
              )}

              <div className={student.isAtRisk ? "pt-5" : ""}>
                {/* Avatar + name */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-sage-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                    {student.avatarEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate">
                      {student.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {student.fieldOfStudy}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {student.lastActive}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>

                {/* Mood + DASS */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {MOOD_CONFIG[student.mood] && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${MOOD_CONFIG[student.mood].color}`}
                    >
                      {MOOD_CONFIG[student.mood].emoji} {student.mood}
                    </span>
                  )}
                  <SeverityBadge severity={student.dass21.severity} />
                </div>

                {/* Streaks */}
                <div className="flex gap-4 mb-4">
                  {[
                    { label: "Sleep", val: student.sleepStreak },
                    { label: "Exercise", val: student.exerciseStreak },
                    { label: "Outdoor", val: student.outdoorStreak },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1 text-xs text-muted-foreground"
                    >
                      <span className="text-orange-400">🔥</span>
                      <span className="font-semibold text-foreground">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                {/* XP level */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    <Zap className="w-3 h-3" />
                    {student.xpLevel}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {student.xp} XP
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div
          data-ocid="teacher.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium">No students match this filter</p>
        </div>
      )}
    </div>
  );
}

// ── Individual Student Profile ──────────────────────────────────────────────────────────────────────────────

function StudentProfile({
  student,
  onBack,
}: {
  student: StudentRecord;
  onBack: () => void;
}) {
  const moodBarHeight = (mood: MoodValue | null): number => {
    if (!mood) return 0;
    return (MOOD_SCORE[mood] / 5) * 100;
  };

  const moodBarColor = (mood: MoodValue | null): string => {
    if (!mood) return "bg-muted";
    return MOOD_CONFIG[mood].bar;
  };

  const dassColor = (score: number, max: number): string => {
    const pct = score / max;
    if (pct < 0.2) return "bg-teal-400";
    if (pct < 0.35) return "bg-amber-400";
    if (pct < 0.55) return "bg-orange-400";
    return "bg-red-500";
  };

  // Build compact 30-day chart data
  const mood30ChartColor = (mood: MoodValue | null): string => {
    if (!mood) return "#e5e7eb";
    const colors: Record<MoodValue, string> = {
      "Very Happy": "#2dd4bf",
      Happy: "#4ade80",
      Neutral: "#fbbf24",
      Sad: "#fb923c",
      "Very Sad": "#f87171",
    };
    return colors[mood];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        data-ocid="teacher.back.button"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Class Overview
      </button>

      {/* Student header */}
      <div
        className={`rounded-2xl p-6 ${
          student.isAtRisk
            ? "bg-red-50 border border-red-200"
            : "bg-teal-50 border border-teal-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-purple-100 flex items-center justify-center text-4xl shadow-md flex-shrink-0">
            {student.avatarEmoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {student.name}
              </h2>
              {student.isAtRisk && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Needs Attention
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {student.fieldOfStudy} · Age {student.age}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="w-3.5 h-3.5" /> {student.xpLevel} · {student.xp}{" "}
                XP
              </span>
              <SeverityBadge severity={student.dass21.severity} />
              <span className="text-sm text-muted-foreground self-center">
                Last active: {student.lastActive}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-col grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood 7 days */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-500" />
            Mood — Last 7 Days
          </h3>
          <div className="flex items-end gap-2 h-32">
            {student.moodHistory.map(({ day, mood }) => (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: "96px" }}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all ${moodBarColor(mood)}`}
                    style={{
                      height: `${moodBarHeight(mood)}%`,
                      minHeight: mood ? "4px" : "0",
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day}</span>
                <span className="text-xs">
                  {mood ? MOOD_CONFIG[mood].emoji : "–"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
            {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
              <span
                key={key}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>

        {/* DASS-21 Scores */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            DASS-21 Scores
          </h3>
          <div className="space-y-5">
            {(
              [
                {
                  label: "Depression",
                  score: student.dass21.depression,
                  max: 42,
                },
                { label: "Anxiety", score: student.dass21.anxiety, max: 42 },
                { label: "Stress", score: student.dass21.stress, max: 42 },
              ] as Array<{ label: string; score: number; max: number }>
            ).map(({ label, score, max }) => {
              const pct = Math.min(100, (score / max) * 100);
              let sev = "Normal";
              if (label === "Depression") {
                sev =
                  score >= 28
                    ? "Extremely Severe"
                    : score >= 21
                      ? "Severe"
                      : score >= 14
                        ? "Moderate"
                        : score >= 10
                          ? "Mild"
                          : "Normal";
              } else if (label === "Anxiety") {
                sev =
                  score >= 20
                    ? "Extremely Severe"
                    : score >= 15
                      ? "Severe"
                      : score >= 10
                        ? "Moderate"
                        : score >= 8
                          ? "Mild"
                          : "Normal";
              } else {
                sev =
                  score >= 34
                    ? "Extremely Severe"
                    : score >= 26
                      ? "Severe"
                      : score >= 19
                        ? "Moderate"
                        : score >= 15
                          ? "Mild"
                          : "Normal";
              }
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{score}</span>
                      <SeverityBadge severity={sev} />
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${dassColor(score, max)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood Trend — Last 30 Days */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
        data-ocid="teacher.mood30.panel"
      >
        <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          Mood Trend — Last 30 Days
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Each bar represents one day. Colour indicates mood; grey = no
          check-in.
        </p>
        <div className="flex items-end gap-0.5" style={{ height: "80px" }}>
          {student.moodHistory30.map(({ day, mood }) => (
            <div
              key={`mood30-${day}`}
              className="flex-1 relative group"
              style={{ height: "80px" }}
              title={mood ? `${day}: ${mood}` : `${day}: No check-in`}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-all"
                style={{
                  height: mood ? `${(MOOD_SCORE[mood] / 5) * 100}%` : "4px",
                  backgroundColor: mood30ChartColor(mood),
                  minHeight: "4px",
                }}
              />
            </div>
          ))}
        </div>
        {/* Day labels for start, mid, end */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Day 1</span>
          <span className="text-xs text-muted-foreground">Day 15</span>
          <span className="text-xs text-muted-foreground">Day 30</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/40">
          {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
            <span
              key={key}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
              {cfg.label}
            </span>
          ))}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            No check-in
          </span>
        </div>
      </motion.div>

      {/* Habit Streaks */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Habit Streaks
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Sleep",
              streak: student.sleepStreak,
              Icon: Moon,
              color: "bg-blue-50 border-blue-200 text-blue-700",
            },
            {
              label: "Exercise",
              streak: student.exerciseStreak,
              Icon: Dumbbell,
              color: "bg-green-50 border-green-200 text-green-700",
            },
            {
              label: "Outdoor",
              streak: student.outdoorStreak,
              Icon: TreePine,
              color: "bg-teal-50 border-teal-200 text-teal-700",
            },
          ].map(({ label, streak, Icon, color }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 text-center ${color}`}
            >
              <Icon className="w-5 h-5 mx-auto mb-2 opacity-70" />
              <div className="font-display text-2xl font-bold">
                {streak > 0 ? `🔥${streak}` : "—"}
              </div>
              <div className="text-xs font-medium mt-1 opacity-80">{label}</div>
              <div className="text-xs opacity-60">
                {streak === 1 ? "day" : "days"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          Badges Earned
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_BADGES.map((badge) => {
            const earned = student.badges.includes(badge);
            return (
              <span
                key={badge}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  earned
                    ? "bg-purple-100 border-purple-200 text-purple-700"
                    : "bg-muted border-border/40 text-muted-foreground line-through opacity-50"
                }`}
              >
                {earned ? "🏅 " : ""}
                {badge}
              </span>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {student.badges.length} / {ALL_BADGES.length} badges earned
        </p>
      </div>
    </motion.div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null,
  );
  const { identity } = useInternetIdentity();
  const { profile } = useProfile(identity);

  const inviteLink = identity ? generateTeacherInviteLink(identity) : "";

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard!");
    });
  };

  return (
    <PinGate userRole="teacher">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-10 max-w-6xl">
          {/* Teacher Account Banner */}
          {profile && (
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {profile.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-teal-700">
                    <Mail className="w-3 h-3" />
                    <a
                      href={`mailto:${profile.email}`}
                      className="hover:underline"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              </div>
              {/* Share Invite Link */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white border border-teal-200 rounded-xl px-3 py-2">
                  <Link2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {inviteLink || "Generating..."}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  data-ocid="teacher.invite_link.button"
                  className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Invite Link
                </button>
              </div>
            </div>
          )}
          <ChangePinDialog userRole="teacher" />
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StudentProfile
                  student={selectedStudent}
                  onBack={() => setSelectedStudent(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ClassOverview onSelectStudent={setSelectedStudent} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PinGate>
  );
}
