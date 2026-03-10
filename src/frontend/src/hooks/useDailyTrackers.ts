import { useCallback, useEffect, useState } from "react";

export interface ActivityEntry {
  name: string;
  durationMins: number;
}

export interface DayLog {
  date: string;
  sleep?: { bedtime: string; wakeTime: string; qualityRating: number };
  exercise?: { activities: ActivityEntry[] };
  outdoor?: { activities: ActivityEntry[] };
}

export interface Badge {
  id: string;
  emoji: string;
  name: string;
  description: string;
  hint: string;
  unlocked: boolean;
}

const STORAGE_KEY = "lumi_arc_daily_logs";

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadLogs(): Record<string, DayLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLogs(logs: Record<string, DayLog>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function computeStreak(logs: Record<string, DayLog>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const log = logs[key];
    if (log && (log.sleep || log.exercise || log.outdoor)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function computeXP(logs: Record<string, DayLog>): number {
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
  const level = LEVELS.findIndex((l) => xp >= l.min && xp <= l.max);
  const idx = level === -1 ? LEVELS.length - 1 : level;
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const xpInLevel = xp - current.min;
  const levelRange = next ? next.min - current.min : 100;
  const xpProgress = next
    ? Math.min(100, Math.round((xpInLevel / levelRange) * 100))
    : 100;
  const xpToNextLevel = next ? next.min - xp : 0;
  return {
    level: idx,
    levelLabel: `${current.emoji} ${current.label}`,
    xpToNextLevel,
    xpProgress,
  };
}

function computeBadges(
  logs: Record<string, DayLog>,
  streak: number,
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
  const { level } = getLevelInfo(xp);

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
      unlocked: streak >= 3,
    },
    {
      id: "streak_legend",
      emoji: "⚡",
      name: "Streak Legend",
      description: "7-day streak",
      hint: "Log habits 7 days in a row",
      unlocked: streak >= 7,
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
      unlocked: level >= 3,
    },
    {
      id: "champion",
      emoji: "🏆",
      name: "Champion",
      description: "Reach Wellness Champion",
      hint: "Reach 500 XP",
      unlocked: level >= 4,
    },
  ];
}

export function useDailyTrackers() {
  const [logs, setLogs] = useState<Record<string, DayLog>>(loadLogs);

  // Reload if another tab writes
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setLogs(loadLogs());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const today = todayDate();
  const todayLog: DayLog = logs[today] ?? { date: today };

  const updateLog = useCallback(
    (patch: Partial<DayLog>) => {
      setLogs((prev) => {
        const updated = {
          ...prev,
          [today]: { ...prev[today], date: today, ...patch },
        };
        saveLogs(updated);
        return updated;
      });
    },
    [today],
  );

  const saveSleepLog = useCallback(
    (bedtime: string, wakeTime: string, qualityRating: number) => {
      updateLog({ sleep: { bedtime, wakeTime, qualityRating } });
    },
    [updateLog],
  );

  const saveExerciseLog = useCallback(
    (activities: ActivityEntry[]) => {
      updateLog({ exercise: { activities } });
    },
    [updateLog],
  );

  const saveOutdoorLog = useCallback(
    (activities: ActivityEntry[]) => {
      updateLog({ outdoor: { activities } });
    },
    [updateLog],
  );

  const streak = computeStreak(logs);
  const totalXP = computeXP(logs);
  const { level, levelLabel, xpToNextLevel, xpProgress } =
    getLevelInfo(totalXP);
  const unlockedBadges = computeBadges(logs, streak, totalXP);

  return {
    todayLog,
    saveSleepLog,
    saveExerciseLog,
    saveOutdoorLog,
    streak,
    totalXP,
    level,
    levelLabel,
    xpToNextLevel,
    xpProgress,
    unlockedBadges,
  };
}
