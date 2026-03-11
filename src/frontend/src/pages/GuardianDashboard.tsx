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
import {
  AlertCircle,
  Calendar,
  Loader2,
  Search,
  SmilePlus,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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
import type { DASS21Assessment } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useGuardianHabitData } from "../hooks/useGuardianHabitData";
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

// ─── Mood History Helpers ─────────────────────────────────────────────────────

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

// ─── Daily Habits Section ─────────────────────────────────────────────────────

function DailyHabitsSection() {
  const {
    sleepStreak,
    exerciseStreak,
    outdoorStreak,
    totalXP,
    levelLabel,
    xpProgress,
    xpToNextLevel,
    weeklyActivityData,
    unlockedBadges,
  } = useGuardianHabitData();

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
          Viewing this student's device habit data
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

export default function GuardianDashboard() {
  const { actor } = useActor();
  const [studentIdInput, setStudentIdInput] = useState("");
  const [studentPrincipal, setStudentPrincipal] = useState<Principal | null>(
    null,
  );
  const [inputError, setInputError] = useState("");

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

  const weeklyMoodData = getRealWeeklyMoodData();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Users className="w-4 h-4" />
          Guardian View
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Student Wellbeing Tracker
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Enter a student's Principal ID to view their mental health assessment
          history.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                      risk: getSocialIsolationRisk(getSocialScore(latest)).risk,
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
                      Mood score: 1 = Very Sad · 2 = Sad · 3 = Okay · 4 = Happy
                      · 5 = Very Happy
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
                      Showing this device's logged mood check-ins for the last 7
                      days.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Daily Habits Section */}
              <DailyHabitsSection />

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
                                    {formatSeverityLabel(a.depression.severity)}
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

      {!studentPrincipal && !isLoading && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="guardian.empty_state"
        >
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-display text-lg font-semibold mb-1 text-foreground">
            Enter a student's ID to begin
          </p>
          <p className="text-sm">
            Students can share their Principal ID from the "Link Guardian" page.
          </p>
        </div>
      )}
    </div>
  );
}
