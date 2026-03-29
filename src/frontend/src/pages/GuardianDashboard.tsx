import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@icp-sdk/core/principal";
import { Copy, GraduationCap, Mail, Phone, User } from "lucide-react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Heart,
  Loader2,
  MessageSquareQuote,
  Search,
  SmilePlus,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { DASS21Assessment } from "../backend.d";
import type { HabitSummary, StudentExtProfile } from "../backend.d";
import PinGate, { ChangePinDialog } from "../components/PinGate";
import { useAppContext } from "../context/AppContext";
import { getTodaysTip } from "../data/wellnessTips";
import { useActor } from "../hooks/useActor";
import { useGuardianHabitData } from "../hooks/useGuardianHabitData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useProfile } from "../hooks/useProfile";
import { useGetStudentAssessments } from "../hooks/useQueries";
import {
  formatSeverityLabel,
  getSocialIsolationRisk,
  severityBgClass,
} from "../utils/scoring";

function formatDate(timestamp: bigint) {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getSocialScore(a: DASS21Assessment): number {
  const social = (a as unknown as { socialIsolationScore?: bigint })
    .socialIsolationScore;
  if (social !== undefined && social !== null) return Number(social);
  return 0;
}

// ─── Mood History Helpers ──────────────────────────────────────────────────────────────────────────

const MOOD_LABELS: Record<number, string> = {
  1: "Very Sad",
  2: "Sad",
  3: "Okay",
  4: "Happy",
  5: "Very Happy",
};

const MOOD_STRING_TO_NUMBER: Record<string, number> = {
  "very-sad": 1,
  sad: 2,
  okay: 3,
  happy: 4,
  "very-happy": 5,
};

function getRealWeeklyMoodData(): Array<{ day: string; mood: number }> {
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const result: Array<{ day: string; mood: number }> = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `lumi_arc_mood_${yyyy}-${mm}-${dd}`;
    const stored = localStorage.getItem(key);
    const mood = stored ? (MOOD_STRING_TO_NUMBER[stored] ?? 0) : 0;
    result.push({ day: DAY_NAMES[d.getDay()], mood });
  }
  return result;
}

const MOOD_BAR_COLORS: Record<number, string> = {
  0: "oklch(0.88 0.01 195)",
  1: "oklch(0.55 0.14 260)",
  2: "oklch(0.62 0.13 230)",
  3: "oklch(0.65 0.14 195)",
  4: "oklch(0.62 0.16 170)",
  5: "oklch(0.58 0.18 155)",
};

const HABIT_BAR_COLORS: Record<number, string> = {
  0: "oklch(0.85 0.01 195)",
  1: "oklch(0.62 0.14 35)",
  2: "oklch(0.55 0.13 195)",
  3: "oklch(0.72 0.14 85)",
};

function MoodTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  if (score === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-md text-xs">
        <div className="font-semibold text-foreground">{label}</div>
        <div className="text-muted-foreground mt-0.5">No check-in recorded</div>
      </div>
    );
  }
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-md text-xs">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="text-muted-foreground mt-0.5">
        {score} — {MOOD_LABELS[score]}
      </div>
    </div>
  );
}

function HabitTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const count = payload[0].value;
  const labels = [
    "No habits logged",
    "1 habit logged",
    "2 habits logged",
    "All 3 habits logged!",
  ];
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-md text-xs">
      <div className="font-semibold text-foreground">{label}</div>
      <div className="text-muted-foreground mt-0.5">
        {labels[count] ?? `${count} habits`}
      </div>
    </div>
  );
}

// ─── Encouraging Messages ──────────────────────────────────────────────────────────────────────────

const GUARDIAN_MESSAGES = [
  "You being here makes a difference. Stay connected, stay caring.",
  "A parent who checks in is a parent who cares deeply.",
  "Your presence in your child's wellness journey matters more than you know.",
  "Small gestures of love create lifelong resilience in young minds.",
  "Showing up for your child's mental health is an act of profound love.",
  "Every time you check in, you strengthen the invisible thread between you.",
  "Your child's wellbeing is a garden — and you are tending it with care.",
  "The fact that you are here says everything about the parent you are.",
  "Connection is the greatest gift you can give your child.",
  "Mental wellness begins at home — you are building that foundation.",
  "Your child may not always say it, but your care reaches them deeply.",
  "Empathy and attention are the most powerful tools a guardian has.",
  "You are raising a resilient soul — one mindful moment at a time.",
  "Love expressed through attention is the most healing force there is.",
  "Your child is lucky to have someone who cares this much.",
  "Checking in today is planting seeds of trust for tomorrow.",
  "A calm guardian creates a calm mind in their child.",
  "You can't pour from an empty cup — take care of yourself too.",
  "The most important conversations happen when you simply show up.",
  "Behind every thriving student is a guardian who pays attention.",
  "Compassion is not a weakness — it is the greatest strength.",
  "Your child's light shines brighter because of your steady presence.",
  "Noticing how your child feels is the first step to helping them flourish.",
  "Every check-in you do today is a gift to the person they'll become.",
  "You are doing something extraordinary just by being engaged.",
  "Your love is the most powerful mental health intervention there is.",
  "Being present in your child's life is never wasted time.",
  "You are not just a parent — you are their first safe space.",
  "Small consistent check-ins build unshakeable bonds over time.",
  "Your child's journey to wellness is a journey you walk together.",
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

// ─── DASS-21 Helpers ──────────────────────────────────────────────────────────────────────────────

type PlainSeverity = {
  level: string;
  description: string;
  color: string;
  bg: string;
};

function getDassPlainSeverity(
  type: "depression" | "anxiety" | "stress",
  score: number,
): PlainSeverity {
  if (type === "depression") {
    if (score < 10)
      return {
        level: "Normal",
        description: "Your child appears emotionally settled.",
        color: "text-teal-700",
        bg: "bg-teal-50 border-teal-200",
      };
    if (score < 14)
      return {
        level: "Mild",
        description: "Mild low mood at times — generally managing well.",
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
      };
    if (score < 21)
      return {
        level: "Moderate",
        description: "Some signs of low mood worth a gentle conversation.",
        color: "text-orange-700",
        bg: "bg-orange-50 border-orange-200",
      };
    if (score < 28)
      return {
        level: "Severe",
        description: "Notable depressive signs — consider additional support.",
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
      };
    return {
      level: "Extremely Severe",
      description:
        "Significant concern — professional support is strongly recommended.",
      color: "text-red-800",
      bg: "bg-red-100 border-red-300",
    };
  }
  if (type === "anxiety") {
    if (score < 8)
      return {
        level: "Normal",
        description: "Anxiety is within a healthy, manageable range.",
        color: "text-teal-700",
        bg: "bg-teal-50 border-teal-200",
      };
    if (score < 10)
      return {
        level: "Mild",
        description: "Occasional worry present — normal for students.",
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
      };
    if (score < 15)
      return {
        level: "Moderate",
        description: "Noticeable anxiety. Breathing exercises may help.",
        color: "text-orange-700",
        bg: "bg-orange-50 border-orange-200",
      };
    if (score < 20)
      return {
        level: "Severe",
        description: "High anxiety levels — a caring check-in is important.",
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
      };
    return {
      level: "Extremely Severe",
      description:
        "Intense anxiety — professional support is strongly recommended.",
      color: "text-red-800",
      bg: "bg-red-100 border-red-300",
    };
  }
  // stress
  if (score < 15)
    return {
      level: "Normal",
      description: "Stress levels appear healthy and manageable.",
      color: "text-teal-700",
      bg: "bg-teal-50 border-teal-200",
    };
  if (score < 19)
    return {
      level: "Mild",
      description: "Some everyday pressures — your child is managing.",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    };
  if (score < 26)
    return {
      level: "Moderate",
      description: "Moderate stress. Encourage breaks and sleep.",
      color: "text-orange-700",
      bg: "bg-orange-50 border-orange-200",
    };
  if (score < 34)
    return {
      level: "Severe",
      description:
        "High stress — consider reducing workload or seeking support.",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
    };
  return {
    level: "Extremely Severe",
    description: "Very high stress — urgent support is strongly recommended.",
    color: "text-red-800",
    bg: "bg-red-100 border-red-300",
  };
}

// ─── Last Active Helper ───────────────────────────────────────────────────────────────────────────

function getLastActiveLabel(): string {
  try {
    const raw = localStorage.getItem("lumiLastActive");
    if (!raw) return "Not yet active";
    const ts = new Date(raw);
    const now = new Date();
    const diffMs = now.getTime() - ts.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 5) return "Just now";
    if (diffHours < 1) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `Today (${diffHours}h ago)`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  } catch {
    return "Unknown";
  }
}

// ─── Daily Habits Section ───────────────────────────────────────────────────────────────────────────

function DailyHabitsSection({
  backendHabit,
}: { backendHabit?: import("../backend.d").HabitSummary | null }) {
  const localData = useGuardianHabitData();
  const {
    sleepStreak: localSleep,
    exerciseStreak: localExercise,
    outdoorStreak: localOutdoor,
    totalXP: localXP,
    levelLabel,
    xpProgress,
    xpToNextLevel,
    weeklyActivityData,
    unlockedBadges,
  } = localData;

  // Use backend data if available, otherwise fall back to local
  const sleepStreak = backendHabit
    ? Number(backendHabit.sleepStreak)
    : localSleep;
  const exerciseStreak = backendHabit
    ? Number(backendHabit.exerciseStreak)
    : localExercise;
  const outdoorStreak = backendHabit
    ? Number(backendHabit.outdoorStreak)
    : localOutdoor;
  const totalXP = backendHabit ? Number(backendHabit.xp) : localXP;

  const streaks = [
    {
      icon: "🌙",
      label: "Sleep Streak",
      value: sleepStreak,
      color: "from-indigo-100 to-violet-100 border-indigo-200",
    },
    {
      icon: "💪",
      label: "Exercise Streak",
      value: exerciseStreak,
      color: "from-orange-100 to-rose-100 border-orange-200",
    },
    {
      icon: "🌳",
      label: "Outdoor Streak",
      value: outdoorStreak,
      color: "from-emerald-100 to-teal-100 border-emerald-200",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="space-y-4"
      data-ocid="guardian.habits.section"
    >
      {/* Section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          🏃 Daily Habits Overview
        </h2>
        <span className="text-xs text-muted-foreground italic bg-muted/50 px-2 py-1 rounded-full">
          Viewing this student&apos;s device habit data
        </span>
      </div>

      {/* Streak cards */}
      <div className="grid grid-cols-3 gap-3" data-ocid="guardian.habits.panel">
        {streaks.map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border bg-gradient-to-br ${s.color} p-4 text-center shadow-sm`}
          >
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-1">
              {s.value > 0 && <span className="text-xl">🔥</span>}
              {s.value}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 font-medium">
              {s.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {s.value === 1 ? "day" : "days"}
            </div>
          </div>
        ))}
      </div>

      {/* XP Level banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="font-display font-bold text-foreground text-base">
              {levelLabel}
            </span>
          </div>
          <div className="text-sm font-semibold text-amber-700">
            {totalXP} XP
          </div>
        </div>
        <Progress value={xpProgress} className="h-2 bg-amber-100" />
        <div className="text-xs text-muted-foreground mt-1.5">
          {xpToNextLevel > 0
            ? `${xpToNextLevel} XP to next level`
            : "Max level reached! 🏆"}
        </div>
      </div>

      {/* Weekly Habit Activity chart */}
      <Card className="rounded-2xl border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <span>📅</span> Weekly Habit Activity
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Habits logged per day (0–3) over the last 7 days
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={weeklyActivityData}
              barCategoryGap="28%"
              margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="oklch(0.92 0.015 195)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 3]}
                ticks={[0, 1, 2, 3]}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<HabitTooltip />}
                cursor={{ fill: "oklch(0.96 0.02 195 / 0.5)" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {weeklyActivityData.map((entry) => (
                  <Cell
                    key={`habit-bar-${entry.day}`}
                    fill={HABIT_BAR_COLORS[entry.count] ?? HABIT_BAR_COLORS[0]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Badges shelf */}
      <Card className="rounded-2xl border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="font-display text-base flex items-center gap-2">
            🏅 Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                title={badge.unlocked ? badge.description : badge.hint}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
                  badge.unlocked
                    ? "bg-amber-50 border border-amber-200 shadow-sm ring-1 ring-amber-300/50"
                    : "bg-muted/40 border border-border/30 opacity-50 grayscale"
                }`}
              >
                <span className="text-xl">{badge.emoji}</span>
                <span className="text-[10px] font-medium leading-tight text-foreground">
                  {badge.name}
                </span>
                {badge.unlocked && (
                  <span className="text-[9px] text-amber-600 font-semibold">
                    Earned!
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Weekly Wellness Summary ────────────────────────────────────────────────────────────────────────

function WeeklyWellnessSummary({
  backendHabit,
}: { backendHabit?: import("../backend.d").HabitSummary | null }) {
  const localData = useGuardianHabitData();
  const sleepStreak = backendHabit
    ? Number(backendHabit.sleepStreak)
    : localData.sleepStreak;
  const exerciseStreak = backendHabit
    ? Number(backendHabit.exerciseStreak)
    : localData.exerciseStreak;
  const outdoorStreak = backendHabit
    ? Number(backendHabit.outdoorStreak)
    : localData.outdoorStreak;
  const STORAGE_KEY = "lumi_arc_daily_logs";

  const { sleepDays, exerciseDays } = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const logs: Record<
        string,
        { sleep?: unknown; exercise?: unknown; outdoor?: unknown }
      > = raw ? JSON.parse(raw) : {};
      const today = new Date();
      let sleepDays = 0;
      let exerciseDays = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        if (logs[key]?.sleep) sleepDays++;
        if (logs[key]?.exercise) exerciseDays++;
      }
      return { sleepDays, exerciseDays };
    } catch {
      return { sleepDays: 0, exerciseDays: 0, moodDominant: null };
    }
  }, []);

  // Determine dominant mood from last 7 days
  const dominantMood = useMemo(() => {
    const moodData = getRealWeeklyMoodData();
    const counts: Record<number, number> = {};
    for (const { mood } of moodData) {
      if (mood > 0) counts[mood] = (counts[mood] ?? 0) + 1;
    }
    const best = Object.entries(counts).sort(
      (a, b) => Number(b[1]) - Number(a[1]),
    )[0];
    if (!best) return "Calm";
    return MOOD_LABELS[Number(best[0])] ?? "Calm";
  }, []);

  const bestStreak = Math.max(sleepStreak, exerciseStreak, outdoorStreak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      data-ocid="guardian.wellness_summary.card"
    >
      <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-sage-50 border-l-4 border-l-teal-400 border border-teal-200 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <MessageSquareQuote className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1">
              Weekly Wellness Summary
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              This week, your child logged sleep{" "}
              <span className="font-semibold">{sleepDays}/7 days</span>,
              exercised{" "}
              <span className="font-semibold">{exerciseDays} times</span>, and
              was mostly feeling{" "}
              <span className="font-semibold">{dominantMood}</span>. Streak is
              holding at{" "}
              <span className="font-semibold">🔥 {bestStreak} days</span>.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────────────────────────

export default function GuardianDashboard() {
  const { actor } = useActor();
  const { setUserRole } = useAppContext();
  useEffect(() => {
    setUserRole("parent");
  }, [setUserRole]);

  // Auto-loaded linked student data
  const [studentPrincipal, setStudentPrincipal] = useState<Principal | null>(
    null,
  );
  const [linkedStudentProfile, setLinkedStudentProfile] =
    useState<StudentExtProfile | null>(null);
  const [linkedHabitData, setLinkedHabitData] = useState<HabitSummary | null>(
    null,
  );
  const [backendMoodData, setBackendMoodData] = useState<Array<{
    day: string;
    mood: number;
  }> | null>(null);
  const [autoLoadDone, setAutoLoadDone] = useState(false);
  const [autoLoadLoading, setAutoLoadLoading] = useState(false);

  // Manual fallback inputs (shown only if no linked student found)
  const [studentIdInput, setStudentIdInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [moodAlertDismissed, setMoodAlertDismissed] = useState(false);

  const { identity: guardianIdentity2 } = useInternetIdentity();

  // Auto-load linked student on mount
  useEffect(() => {
    if (!actor || !guardianIdentity2 || autoLoadDone) return;
    setAutoLoadLoading(true);
    (async () => {
      try {
        const linkedOpt = await (actor as any).getParentLinkedStudent();
        // Candid opt returns [] (None) or [value] (Some)
        const linkedArr = Array.isArray(linkedOpt)
          ? linkedOpt
          : linkedOpt?.__kind__ === "Some"
            ? [linkedOpt.value]
            : [];
        if (linkedArr.length > 0) {
          const sp = linkedArr[0];
          setStudentPrincipal(sp);
          // Load profile, habits, mood in parallel
          const [profileOpt, habitOpt, moodStr] = await Promise.all([
            (actor as any).getStudentExtendedProfile(sp).catch(() => []),
            (actor as any).getHabitSummary(sp).catch(() => []),
            (actor as any).getMoodHistory(sp).catch(() => ""),
          ]);
          const profileVal = Array.isArray(profileOpt)
            ? profileOpt[0]
            : profileOpt?.__kind__ === "Some"
              ? profileOpt.value
              : undefined;
          const habitVal = Array.isArray(habitOpt)
            ? habitOpt[0]
            : habitOpt?.__kind__ === "Some"
              ? habitOpt.value
              : undefined;
          if (profileVal) setLinkedStudentProfile(profileVal);
          if (habitVal) setLinkedHabitData(habitVal);
          if (moodStr) {
            const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const moodMap: Record<string, number> = {};
            for (const entry of moodStr.split(";")) {
              const [date, mood] = entry.split("=");
              if (date && mood)
                moodMap[date] = MOOD_STRING_TO_NUMBER[mood] ?? 0;
            }
            const parsed: Array<{ day: string; mood: number }> = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
              const d = new Date(today);
              d.setDate(today.getDate() - i);
              const key = d.toISOString().slice(0, 10);
              parsed.push({
                day: DAY_NAMES[d.getDay()],
                mood: moodMap[key] ?? 0,
              });
            }
            setBackendMoodData(parsed);
          }
        }
      } catch {}
      setAutoLoadDone(true);
      setAutoLoadLoading(false);
    })();
  }, [actor, guardianIdentity2, autoLoadDone]);

  const {
    data: assessments,
    isLoading,
    isError,
  } = useGetStudentAssessments(studentPrincipal);

  const handleSearch = () => {
    if (!studentIdInput.trim()) {
      setInputError("Please enter a student Principal ID");
      return;
    }
    try {
      const p = Principal.fromText(studentIdInput.trim());
      setStudentPrincipal(p);
      setInputError("");
    } catch {
      setInputError("Invalid Principal ID format. Please check and try again.");
    }
  };

  const chartData =
    assessments
      ?.slice()
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .map((a) => ({
        date: formatDate(a.timestamp),
        Depression: Number(a.depression.rawScore),
        Anxiety: Number(a.anxiety.rawScore),
        Stress: Number(a.stress.rawScore),
      })) ?? [];

  const latest = assessments?.[assessments.length - 1];

  // Mood data: prefer backend (linked student's real data), fallback to localStorage
  const weeklyMoodData = backendMoodData ?? getRealWeeklyMoodData();

  // Mood alert: 2+ consecutive sad days
  const moodAlertActive = useMemo(() => {
    let consecutive = 0;
    for (let i = weeklyMoodData.length - 1; i >= 0; i--) {
      const m = weeklyMoodData[i].mood;
      if (m === 1 || m === 2) {
        consecutive++;
        if (consecutive >= 2) return true;
      } else if (m > 0) {
        break;
      }
    }
    return false;
  }, [weeklyMoodData]);

  // Guardian encouraging message (daily rotation)
  const todayMessage =
    GUARDIAN_MESSAGES[getDayOfYear() % GUARDIAN_MESSAGES.length];

  // Today's wellness tip
  const todayTip = getTodaysTip();

  // Last active
  const lastActiveLabel = getLastActiveLabel();

  const guardianIdentity = guardianIdentity2;
  const { profile: guardianProfile } = useProfile(guardianIdentity);
  useEffect(() => {
    if (!actor || !guardianIdentity) return;
    const stored =
      localStorage.getItem(
        `lumiArcProfile_${guardianIdentity.getPrincipal().toText()}`,
      ) || localStorage.getItem("lumiProfile");
    let name = "Guardian";
    let email = "";
    if (stored) {
      try {
        const p = JSON.parse(stored);
        name = p.displayName || p.name || name;
        email = p.email || email;
      } catch {}
    }
    actor.createParentProfile(name, email).catch(() => {});
  }, [actor, guardianIdentity]);

  return (
    <PinGate userRole="guardian">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Change PIN + Principal ID */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          {guardianIdentity && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2 text-xs">
              <span className="text-muted-foreground whitespace-nowrap">
                Your Principal ID:
              </span>
              <span className="font-mono text-rose-700 truncate max-w-[160px]">
                {guardianIdentity.getPrincipal().toString()}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    guardianIdentity.getPrincipal().toString(),
                  );
                  toast.success("Principal ID copied!");
                }}
                className="ml-1 text-rose-400 hover:text-rose-600 transition-colors flex-shrink-0"
                title="Copy Principal ID"
                data-ocid="guardian.principal_id.button"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <ChangePinDialog userRole="guardian" />
        </div>
        {/* Teacher Contact Card (from profile) */}
        {(guardianProfile?.linkedTeacherEmailForGuardian ||
          guardianProfile?.linkedTeacherNameForGuardian) && (
          <div
            className="mb-4 bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4 flex items-center gap-4"
            data-ocid="guardian.teacher_contact.panel"
          >
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-teal-700" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-0.5">
                Your Child's Mentor Teacher
              </p>
              <p className="text-sm font-medium text-foreground">
                {guardianProfile.linkedTeacherNameForGuardian || "Teacher"}
              </p>
              {guardianProfile.linkedTeacherEmailForGuardian && (
                <a
                  href={`mailto:${guardianProfile.linkedTeacherEmailForGuardian}`}
                  className="flex items-center gap-1 text-xs text-teal-600 hover:underline mt-0.5"
                >
                  <Mail className="w-3 h-3" />
                  {guardianProfile.linkedTeacherEmailForGuardian}
                </a>
              )}
            </div>
          </div>
        )}
        {!guardianProfile?.linkedTeacherEmailForGuardian && (
          <div
            className="mb-4 bg-muted/30 border border-border/40 rounded-2xl px-5 py-3 flex items-center gap-3"
            data-ocid="guardian.teacher_contact.panel"
          >
            <GraduationCap className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Teacher contact not yet available. Your child's teacher
              information will appear here once linked.
            </p>
          </div>
        )}
        {/* Mood alert banner */}
        <AnimatePresence>
          {moodAlertActive && !moodAlertDismissed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
              data-ocid="guardian.mood_alert.panel"
            >
              <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
                <Heart className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-800 flex-1">
                  <span className="font-semibold">A gentle note:</span> Your
                  child may need some extra support this week. Consider reaching
                  out with warmth and care.
                </p>
                <button
                  type="button"
                  onClick={() => setMoodAlertDismissed(true)}
                  className="text-rose-400 hover:text-rose-600 flex-shrink-0"
                  data-ocid="guardian.mood_alert.close_button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Encouraging message card */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
          data-ocid="guardian.encouraging.card"
        >
          <div
            className="rounded-2xl bg-gradient-to-br from-lavender-50 to-rose-50 border border-purple-100 p-5 shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.03 300 / 0.5), oklch(0.96 0.03 10 / 0.5))",
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🧡</span>
              <p className="text-sm text-foreground/80 leading-relaxed italic">
                &ldquo;{todayMessage}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>

        {/* Today's Wellness Tip */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mb-6"
          data-ocid="guardian.wellness_tip.card"
        >
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-sage-100/40 border border-primary/20 p-4 flex gap-3 items-start shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-0.5">
                Today&apos;s Wellness Tip
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {todayTip}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              Guardian View
              <span className="inline-flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                Last active: {lastActiveLabel}
              </span>
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Student Wellbeing Tracker
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Enter a student&apos;s Principal ID to view their mental health
            assessment history.
          </p>
        </motion.div>

        {/* Auto-loading indicator */}
        {autoLoadLoading && (
          <div
            className="flex items-center gap-3 mb-6 text-muted-foreground text-sm"
            data-ocid="guardian.loading_state"
          >
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Loading your child's data...
          </div>
        )}

        {/* Linked student info banner OR manual search */}
        {autoLoadDone && studentPrincipal && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5 shadow-sm mb-8 border border-teal-200/60 bg-teal-50/40"
            data-ocid="guardian.student_linked.card"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-teal-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-0.5">
                  Viewing
                </p>
                <p className="font-semibold text-foreground text-base">
                  {linkedStudentProfile?.name || "Your Child"}
                </p>
                {linkedStudentProfile?.fieldOfStudy && (
                  <p className="text-xs text-muted-foreground">
                    {linkedStudentProfile.fieldOfStudy}
                  </p>
                )}
                {linkedStudentProfile?.wellnessGoal && (
                  <p className="text-xs text-muted-foreground italic mt-0.5">
                    🎯 {linkedStudentProfile.wellnessGoal}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {autoLoadDone && !studentPrincipal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glass-card rounded-2xl p-6 shadow-sm mb-8"
          >
            <p className="text-sm text-muted-foreground mb-4">
              No student linked automatically. You can enter a student Principal
              ID manually, or ask your child to link you from their portal.
            </p>
            <Label className="text-sm font-medium mb-2 block">
              Student Principal ID
            </Label>
            <div className="flex gap-3">
              <Input
                value={studentIdInput}
                onChange={(e) => {
                  setStudentIdInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="e.g. abc12-def34-..."
                className="h-11 rounded-xl flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-ocid="guardian.search.input"
              />
              <Button
                onClick={handleSearch}
                disabled={!actor || isLoading}
                className="h-11 px-5 rounded-xl bg-primary text-primary-foreground shadow-teal"
                data-ocid="guardian.search.button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2">Search</span>
              </Button>
            </div>
            {inputError && (
              <p
                className="text-destructive text-xs mt-2"
                data-ocid="guardian.search.error_state"
              >
                {inputError}
              </p>
            )}
          </motion.div>
        )}

        {/* Not logged in via II: show manual search always */}
        {!guardianIdentity2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="glass-card rounded-2xl p-6 shadow-sm mb-8"
          >
            <Label className="text-sm font-medium mb-2 block">
              Student Principal ID
            </Label>
            <div className="flex gap-3">
              <Input
                value={studentIdInput}
                onChange={(e) => {
                  setStudentIdInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="e.g. abc12-def34-..."
                className="h-11 rounded-xl flex-1"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-ocid="guardian.search.input"
              />
              <Button
                onClick={handleSearch}
                disabled={!actor || isLoading}
                className="h-11 px-5 rounded-xl bg-primary text-primary-foreground shadow-teal"
                data-ocid="guardian.search.button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2">Search</span>
              </Button>
            </div>
            {inputError && (
              <p
                className="text-destructive text-xs mt-2"
                data-ocid="guardian.search.error_state"
              >
                {inputError}
              </p>
            )}
          </motion.div>
        )}

        {/* Results */}
        {isLoading && (
          <div
            className="flex items-center justify-center py-16"
            data-ocid="guardian.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">
              Loading assessments...
            </span>
          </div>
        )}

        {isError && (
          <div className="text-center py-16" data-ocid="guardian.error_state">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">
              Could not load student data.
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              Ensure the student has linked you as their guardian.
            </p>
          </div>
        )}

        {assessments && !isLoading && (
          <div>
            {assessments.length === 0 ? (
              <div
                className="text-center py-16"
                data-ocid="guardian.assessments.empty_state"
              >
                <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-display text-lg font-semibold mb-1">
                  No assessments yet
                </h3>
                <p className="text-muted-foreground text-sm">
                  This student has not completed any assessments, or you may not
                  have guardian access.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Weekly Wellness Summary */}
                <WeeklyWellnessSummary backendHabit={linkedHabitData} />

                {/* Summary cards */}
                {latest && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    {[
                      {
                        label: "Depression",
                        score: Number(latest.depression.rawScore),
                        severity: latest.depression.severity,
                      },
                      {
                        label: "Anxiety",
                        score: Number(latest.anxiety.rawScore),
                        severity: latest.anxiety.severity,
                      },
                      {
                        label: "Stress",
                        score: Number(latest.stress.rawScore),
                        severity: latest.stress.severity,
                      },
                      {
                        label: "Social Risk",
                        score: getSocialScore(latest),
                        severity: null,
                        risk: getSocialIsolationRisk(getSocialScore(latest))
                          .risk,
                      },
                    ].map((item, i) => (
                      <Card
                        key={item.label}
                        className="rounded-2xl border-border/40 shadow-sm"
                        data-ocid={`guardian.summary.item.${i + 1}`}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="font-display text-3xl font-bold mb-1">
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
                                ? "Low"
                                : item.risk === "moderate"
                                  ? "Moderate"
                                  : item.risk === "high"
                                    ? "High"
                                    : "Very High"}
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                )}

                {/* DASS-21 Simplified Summary */}
                {latest && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    data-ocid="guardian.dass_summary.card"
                  >
                    <Card className="rounded-2xl border-border/40 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="font-display text-base flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          What the DASS-21 Scores Mean
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          A plain-language guide to your child&apos;s latest
                          results.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {[
                          {
                            type: "depression" as const,
                            label: "Depression",
                            score: Number(latest.depression.rawScore),
                          },
                          {
                            type: "anxiety" as const,
                            label: "Anxiety",
                            score: Number(latest.anxiety.rawScore),
                          },
                          {
                            type: "stress" as const,
                            label: "Stress",
                            score: Number(latest.stress.rawScore),
                          },
                        ].map(({ type, label, score }) => {
                          const sev = getDassPlainSeverity(type, score);
                          return (
                            <div
                              key={type}
                              className={`rounded-xl border p-3 ${sev.bg}`}
                            >
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                  {label}
                                </span>
                                <span
                                  className={`text-xs font-semibold ${sev.color}`}
                                >
                                  {sev.level}
                                </span>
                              </div>
                              <p
                                className={`text-sm leading-relaxed ${sev.color}`}
                              >
                                {sev.description}
                              </p>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Trend chart */}
                {chartData.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <Card className="rounded-2xl border-border/40 shadow-sm">
                      <CardHeader>
                        <CardTitle className="font-display text-base flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Assessment Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                          <LineChart data={chartData}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="oklch(0.9 0.02 180)"
                            />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} domain={[0, 42]} />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "1px solid oklch(0.88 0.025 180)",
                                fontSize: "12px",
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: "12px" }} />
                            <Line
                              type="monotone"
                              dataKey="Depression"
                              stroke="oklch(0.55 0.18 25)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Anxiety"
                              stroke="oklch(0.58 0.18 55)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="Stress"
                              stroke="oklch(0.42 0.09 195)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Weekly Mood History chart */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  data-ocid="guardian.mood.panel"
                >
                  <Card className="rounded-2xl border-border/40 shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-display text-base flex items-center gap-2">
                        <SmilePlus className="w-4 h-4 text-primary" />
                        Weekly Mood Check-Ins
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Mood score: 1 = Very Sad · 2 = Sad · 3 = Okay · 4 =
                        Happy · 5 = Very Happy
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                          data={weeklyMoodData}
                          barCategoryGap="28%"
                          margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="oklch(0.92 0.015 195)"
                          />
                          <XAxis
                            dataKey="day"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            content={<MoodTooltip />}
                            cursor={{ fill: "oklch(0.96 0.02 195 / 0.5)" }}
                          />
                          <Bar
                            dataKey="mood"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={48}
                          >
                            {weeklyMoodData.map((entry) => (
                              <Cell
                                key={`mood-bar-${entry.day}`}
                                fill={
                                  MOOD_BAR_COLORS[entry.mood] ??
                                  MOOD_BAR_COLORS[0]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-xs text-muted-foreground/70 mt-3 text-center italic">
                        Showing this device&apos;s logged mood check-ins for the
                        last 7 days.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Daily Habits Section */}
                <DailyHabitsSection backendHabit={linkedHabitData} />

                {/* History table */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28 }}
                >
                  <Card className="rounded-2xl border-border/40 shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-display text-base flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Assessment History ({assessments.length} records)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table data-ocid="guardian.assessments.table">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Depression</TableHead>
                              <TableHead>Anxiety</TableHead>
                              <TableHead>Stress</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assessments
                              .slice()
                              .sort((a, b) =>
                                a.timestamp > b.timestamp ? -1 : 1,
                              )
                              .map((a, i) => (
                                <TableRow
                                  key={a.id.toString()}
                                  data-ocid={`guardian.assessments.row.${i + 1}`}
                                >
                                  <TableCell className="text-sm">
                                    {formatDate(a.timestamp)}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={`text-xs rounded-full ${severityBgClass(a.depression.severity)}`}
                                    >
                                      {Number(a.depression.rawScore)} —{" "}
                                      {formatSeverityLabel(
                                        a.depression.severity,
                                      )}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={`text-xs rounded-full ${severityBgClass(a.anxiety.severity)}`}
                                    >
                                      {Number(a.anxiety.rawScore)} —{" "}
                                      {formatSeverityLabel(a.anxiety.severity)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={`text-xs rounded-full ${severityBgClass(a.stress.severity)}`}
                                    >
                                      {Number(a.stress.rawScore)} —{" "}
                                      {formatSeverityLabel(a.stress.severity)}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {!studentPrincipal && !isLoading && autoLoadDone && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="guardian.empty_state"
          >
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-display text-lg font-semibold mb-1 text-foreground">
              No student linked yet
            </p>
            <p className="text-sm">
              Ask your child to link you from their &ldquo;Link Guardian&rdquo;
              page, or enter their Principal ID above.
            </p>
          </div>
        )}
      </div>
    </PinGate>
  );
}
