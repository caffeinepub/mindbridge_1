import type { Badge, DayLog } from "./useDailyTrackers";

const STORAGE_KEY = "lumi_arc_daily_logs";

function loadLogs(): Record<string, DayLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function dateKey(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

function computeCategoryStreak(
  logs: Record<string, DayLog>,
  category: "sleep" | "exercise" | "outdoor",
): number {
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const key = dateKey(i);
    if (logs[key]?.[category]) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeTotalXP(logs: Record<string, DayLog>): number {
  let xp = 0;
  for (const log of Object.values(logs)) {
    if (log.sleep) xp += 10;
    if (log.exercise) xp += 10;
    if (log.outdoor) xp += 10;
  }
  return xp;
}

const LEVELS = [
  { min: 0, max: 49, label: "Seeker", emoji: "🌱" },
  { min: 50, max: 149, label: "Mindful", emoji: "🧘" },
  { min: 150, max: 299, label: "Balanced", emoji: "⚖️" },
  { min: 300, max: 499, label: "Radiant", emoji: "🌟" },
  {
    min: 500,
    max: Number.POSITIVE_INFINITY,
    label: "Wellness Champion",
    emoji: "🏆",
  },
];

function getLevelInfo(xp: number) {
  const idx = Math.max(
    0,
    LEVELS.findIndex((l) => xp >= l.min && xp <= l.max),
  );
  const safeIdx = idx === -1 ? LEVELS.length - 1 : idx;
  const current = LEVELS[safeIdx];
  const next = LEVELS[safeIdx + 1];
  const xpInLevel = xp - current.min;
  const levelRange = next ? next.min - current.min : 100;
  const xpProgress = next
    ? Math.min(100, Math.round((xpInLevel / levelRange) * 100))
    : 100;
  const xpToNextLevel = next ? next.min - xp : 0;
  return {
    levelLabel: `${current.emoji} ${current.label}`,
    xpToNextLevel,
    xpProgress,
    levelIdx: safeIdx,
  };
}

function computeBadges(
  logs: Record<string, DayLog>,
  overallStreak: number,
  xp: number,
): Badge[] {
  const allLogs = Object.values(logs);
  const sleepCount = allLogs.filter((l) => l.sleep).length;
  const fiveStarSleeps = allLogs.filter(
    (l) => l.sleep?.qualityRating === 5,
  ).length;
  const yogaSessions = allLogs.filter((l) =>
    l.exercise?.activities.some((a) =>
      ["yoga", "stretching", "meditation", "pilates"].includes(
        a.name.toLowerCase(),
      ),
    ),
  ).length;
  const runWalkSessions = allLogs.filter((l) =>
    l.exercise?.activities.some((a) =>
      ["running", "walking"].includes(a.name.toLowerCase()),
    ),
  ).length;
  const outdoorSessions = allLogs.filter(
    (l) => l.outdoor && l.outdoor.activities.length > 0,
  ).length;
  const { levelIdx } = getLevelInfo(xp);

  return [
    {
      id: "sleep_champion",
      emoji: "😴",
      name: "Sleep Champion",
      description: "7 sleep logs total",
      hint: "Log sleep 7 times",
      unlocked: sleepCount >= 7,
    },
    {
      id: "early_riser",
      emoji: "🌅",
      name: "Early Riser",
      description: "3 five-star sleep nights",
      hint: "Rate sleep 5 stars, 3 times",
      unlocked: fiveStarSleeps >= 3,
    },
    {
      id: "yoga_warrior",
      emoji: "🧘",
      name: "Yoga Warrior",
      description: "5 yoga/stretching sessions",
      hint: "Log yoga or stretching 5 times",
      unlocked: yogaSessions >= 5,
    },
    {
      id: "step_master",
      emoji: "👟",
      name: "Step Master",
      description: "10 running/walking sessions",
      hint: "Log running or walking 10 times",
      unlocked: runWalkSessions >= 10,
    },
    {
      id: "outdoor_explorer",
      emoji: "🌳",
      name: "Outdoor Explorer",
      description: "5 outdoor game sessions",
      hint: "Log outdoor games 5 times",
      unlocked: outdoorSessions >= 5,
    },
    {
      id: "streak_starter",
      emoji: "🔥",
      name: "Streak Starter",
      description: "3-day streak",
      hint: "Log habits 3 days in a row",
      unlocked: overallStreak >= 3,
    },
    {
      id: "streak_legend",
      emoji: "⚡",
      name: "Streak Legend",
      description: "7-day streak",
      hint: "Log habits 7 days in a row",
      unlocked: overallStreak >= 7,
    },
    {
      id: "wellness_star",
      emoji: "⭐",
      name: "Wellness Star",
      description: "Earn 30 total XP",
      hint: "Earn 30 XP total",
      unlocked: xp >= 30,
    },
    {
      id: "radiant",
      emoji: "🌟",
      name: "Radiant",
      description: "Reach Radiant level",
      hint: "Reach 300 XP",
      unlocked: levelIdx >= 3,
    },
    {
      id: "champion",
      emoji: "🏆",
      name: "Champion",
      description: "Reach Wellness Champion",
      hint: "Reach 500 XP",
      unlocked: levelIdx >= 4,
    },
  ];
}

export interface GuardianHabitData {
  sleepStreak: number;
  exerciseStreak: number;
  outdoorStreak: number;
  totalXP: number;
  levelLabel: string;
  xpProgress: number;
  xpToNextLevel: number;
  weeklyActivityData: { day: string; count: number }[];
  unlockedBadges: Badge[];
}

export function useGuardianHabitData(): GuardianHabitData {
  const logs = loadLogs();

  const sleepStreak = computeCategoryStreak(logs, "sleep");
  const exerciseStreak = computeCategoryStreak(logs, "exercise");
  const outdoorStreak = computeCategoryStreak(logs, "outdoor");

  // Overall streak (any category) for badge computation
  let overallStreak = 0;
  for (let i = 0; i < 365; i++) {
    const key = dateKey(i);
    const log = logs[key];
    if (log && (log.sleep || log.exercise || log.outdoor)) {
      overallStreak++;
    } else {
      break;
    }
  }

  const totalXP = computeTotalXP(logs);
  const { levelLabel, xpProgress, xpToNextLevel } = getLevelInfo(totalXP);

  // Last 7 days activity counts
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyActivityData = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i; // 6 days ago → today
    const key = dateKey(offset);
    const d = new Date();
    d.setDate(d.getDate() - offset);
    const dayLabel = DAY_LABELS[d.getDay()];
    const log = logs[key];
    const count = log
      ? (log.sleep ? 1 : 0) + (log.exercise ? 1 : 0) + (log.outdoor ? 1 : 0)
      : 0;
    return { day: dayLabel, count };
  });

  const unlockedBadges = computeBadges(logs, overallStreak, totalXP);

  return {
    sleepStreak,
    exerciseStreak,
    outdoorStreak,
    totalXP,
    levelLabel,
    xpProgress,
    xpToNextLevel,
    weeklyActivityData,
    unlockedBadges,
  };
}
