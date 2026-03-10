import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type ActivityEntry,
  useDailyTrackers,
} from "../hooks/useDailyTrackers";

// ── helpers ──────────────────────────────────────────────────────────────────
function calcSleepDuration(bedtime: string, wakeTime: string): string {
  if (!bedtime || !wakeTime) return "";
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins < 0) mins += 24 * 60;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

const EXERCISE_OPTIONS = [
  "Running",
  "Walking",
  "Yoga",
  "Gym",
  "Cycling",
  "Swimming",
  "Dance",
  "Meditation",
  "Stretching",
  "HIIT",
  "Pilates",
  "Other",
];

const OUTDOOR_OPTIONS = [
  "Cricket",
  "Football",
  "Basketball",
  "Badminton",
  "Tennis",
  "Volleyball",
  "Frisbee",
  "Hiking",
  "Skating",
  "Cycling outdoors",
  "Other",
];

const DURATIONS = [15, 30, 45, 60, 75, 90];

// ── Activity multi-selector ───────────────────────────────────────────────────
function ActivitySelector({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: ActivityEntry[];
  onChange: (entries: ActivityEntry[]) => void;
}) {
  function toggle(name: string) {
    const exists = selected.find((s) => s.name === name);
    if (exists) {
      onChange(selected.filter((s) => s.name !== name));
    } else {
      onChange([...selected, { name, durationMins: 30 }]);
    }
  }

  function setDuration(name: string, durationMins: number) {
    onChange(
      selected.map((s) => (s.name === name ? { ...s, durationMins } : s)),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = !!selected.find((s) => s.name === opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all select-none",
                active
                  ? "bg-teal-500 text-white border-teal-500 shadow-sm scale-105"
                  : "border-border/50 text-muted-foreground hover:border-teal-400 hover:text-teal-700",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {selected.map((entry) => (
          <motion.div
            key={entry.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="bg-teal-50 rounded-2xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-teal-800">
                  {entry.name}
                </span>
                <span className="text-xs text-teal-600 font-bold">
                  {entry.durationMins} min
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(entry.name, d)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                      entry.durationMins === d
                        ? "bg-teal-500 text-white border-teal-500"
                        : "border-teal-200 text-teal-600 hover:bg-teal-100",
                    )}
                  >
                    {d}m
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ── Badge shelf ───────────────────────────────────────────────────────────────
function BadgeShelf({
  badges,
}: { badges: ReturnType<typeof useDailyTrackers>["unlockedBadges"] }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3">
        Achievements
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            data-ocid={`trackers.badge.item.${i + 1}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              "flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl border w-20 transition-all",
              badge.unlocked
                ? "border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50 shadow-sm shadow-amber-100"
                : "border-border/30 bg-muted/30 opacity-50 grayscale",
            )}
            title={badge.unlocked ? badge.description : badge.hint}
          >
            <span className="text-2xl">
              {badge.unlocked ? badge.emoji : "🔒"}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold text-center leading-tight",
                badge.unlocked ? "text-amber-800" : "text-muted-foreground",
              )}
            >
              {badge.name}
            </span>
          </motion.div>
        ))}
      </div>
      {/* Avatar unlock hint */}
      <div className="mt-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 text-xs text-purple-700 font-medium flex items-center gap-2">
        <span>🎨</span>
        <span>Log habits for 30 days to unlock 2 exclusive avatars!</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DailyTrackers() {
  const {
    todayLog,
    saveSleepLog,
    saveExerciseLog,
    saveOutdoorLog,
    streak,
    totalXP,
    levelLabel,
    xpToNextLevel,
    xpProgress,
    unlockedBadges,
  } = useDailyTrackers();

  // Sleep state
  const [bedtime, setBedtime] = useState(todayLog.sleep?.bedtime ?? "");
  const [wakeTime, setWakeTime] = useState(todayLog.sleep?.wakeTime ?? "");
  const [sleepQuality, setSleepQuality] = useState(
    todayLog.sleep?.qualityRating ?? 0,
  );

  // Exercise state
  const [exerciseActivities, setExerciseActivities] = useState<ActivityEntry[]>(
    todayLog.exercise?.activities ?? [],
  );

  // Outdoor state
  const [outdoorActivities, setOutdoorActivities] = useState<ActivityEntry[]>(
    todayLog.outdoor?.activities ?? [],
  );

  function handleLogSleep() {
    if (!bedtime || !wakeTime || sleepQuality === 0) {
      toast.error("Please fill in all sleep fields and rate quality");
      return;
    }
    saveSleepLog(bedtime, wakeTime, sleepQuality);
    toast.success("🌙 Sleep logged! +10 XP");
  }

  function handleLogExercise() {
    if (exerciseActivities.length === 0) {
      toast.error("Please select at least one activity");
      return;
    }
    saveExerciseLog(exerciseActivities);
    toast.success("💪 Exercise logged! +10 XP");
  }

  function handleLogOutdoor() {
    if (outdoorActivities.length === 0) {
      toast.error("Please select at least one activity");
      return;
    }
    saveOutdoorLog(outdoorActivities);
    toast.success("🌳 Outdoor activity logged! +10 XP");
  }

  const sleepDuration = calcSleepDuration(bedtime, wakeTime);

  return (
    <Card className="rounded-3xl overflow-hidden border-0 shadow-md">
      {/* Gradient header */}
      <div
        className="px-5 pt-5 pb-4"
        style={{
          background:
            "linear-gradient(135deg, #e07a5f 0%, #f2b49b 40%, #81b29a 80%, #3d9987 100%)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Streak */}
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 2,
                ease: "easeInOut",
              }}
              className="text-3xl"
            >
              🔥
            </motion.span>
            <div>
              {streak > 0 ? (
                <>
                  <p className="text-white font-black text-xl leading-none">
                    {streak}-day streak
                  </p>
                  <p className="text-white/80 text-xs">Keep it going!</p>
                </>
              ) : (
                <>
                  <p className="text-white font-bold text-base leading-none">
                    Start your streak today!
                  </p>
                  <p className="text-white/80 text-xs">
                    Log any habit to begin
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Level badge */}
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-white font-semibold text-sm">
              {levelLabel}
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="flex justify-between text-white/90 text-xs mb-1.5">
            <span>{totalXP} XP total</span>
            <span>
              {xpToNextLevel > 0
                ? `${xpToNextLevel} XP to next level`
                : "Max level! 🏆"}
            </span>
          </div>
          <div className="h-2.5 bg-white/25 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <Tabs defaultValue="sleep">
          <TabsList className="w-full mb-4 rounded-2xl bg-muted/60 p-1 h-auto">
            <TabsTrigger
              value="sleep"
              data-ocid="trackers.sleep_tab"
              className="flex-1 rounded-xl text-xs font-semibold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              🌙 Sleep
              {todayLog.sleep && <span className="ml-1 text-green-500">✓</span>}
            </TabsTrigger>
            <TabsTrigger
              value="exercise"
              data-ocid="trackers.exercise_tab"
              className="flex-1 rounded-xl text-xs font-semibold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              💪 Exercise
              {todayLog.exercise && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="outdoor"
              data-ocid="trackers.outdoor_tab"
              className="flex-1 rounded-xl text-xs font-semibold py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              🌳 Outdoor
              {todayLog.outdoor && (
                <span className="ml-1 text-green-500">✓</span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Sleep Tab ── */}
          <TabsContent value="sleep" className="mt-0">
            {todayLog.sleep ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center"
                data-ocid="trackers.sleep.success_state"
              >
                <p className="text-2xl mb-1">🌙</p>
                <p className="text-green-700 font-bold text-sm">
                  Sleep logged today ✓
                </p>
                <p className="text-green-600 text-xs mt-1">
                  {todayLog.sleep.bedtime} → {todayLog.sleep.wakeTime} ·{" "}
                  {"⭐".repeat(todayLog.sleep.qualityRating)}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="sleep-bedtime"
                      className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-1.5 block"
                    >
                      Bedtime
                    </label>
                    <input
                      id="sleep-bedtime"
                      type="time"
                      data-ocid="trackers.sleep.input"
                      value={bedtime}
                      onChange={(e) => setBedtime(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border/60 text-sm bg-background focus:outline-none focus:border-[#e07a5f] focus:ring-1 focus:ring-[#e07a5f]/30"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sleep-waketime"
                      className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-1.5 block"
                    >
                      Wake time
                    </label>
                    <input
                      id="sleep-waketime"
                      type="time"
                      data-ocid="trackers.sleep.input"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border/60 text-sm bg-background focus:outline-none focus:border-[#e07a5f] focus:ring-1 focus:ring-[#e07a5f]/30"
                    />
                  </div>
                </div>

                {sleepDuration && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-1"
                  >
                    <span className="text-xs text-muted-foreground">
                      Sleep duration:{" "}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {sleepDuration}
                    </span>
                  </motion.div>
                )}

                {/* Quality stars */}
                <div>
                  <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-2">
                    Sleep Quality
                  </p>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSleepQuality(star)}
                        className="text-3xl transition-all focus:outline-none"
                        data-ocid="trackers.sleep.toggle"
                        aria-label={`${star} star`}
                      >
                        <span
                          className={cn(
                            "transition-all",
                            star <= sleepQuality ? "opacity-100" : "opacity-25",
                          )}
                        >
                          ⭐
                        </span>
                      </motion.button>
                    ))}
                  </div>
                  {sleepQuality > 0 && (
                    <p className="text-center text-xs text-muted-foreground mt-1">
                      {
                        ["Poor", "Fair", "Good", "Great", "Excellent!"][
                          sleepQuality - 1
                        ]
                      }
                    </p>
                  )}
                </div>

                <motion.button
                  type="button"
                  data-ocid="trackers.sleep.log_button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogSleep}
                  className="w-full h-11 rounded-2xl font-bold text-sm text-white shadow-md transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #e07a5f 0%, #d4614a 100%)",
                    boxShadow: "0 4px 14px rgba(224,122,95,0.35)",
                  }}
                >
                  Log Sleep 🌙
                </motion.button>
              </div>
            )}
          </TabsContent>

          {/* ── Exercise Tab ── */}
          <TabsContent value="exercise" className="mt-0">
            {todayLog.exercise ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center"
                data-ocid="trackers.exercise.success_state"
              >
                <p className="text-2xl mb-1">💪</p>
                <p className="text-green-700 font-bold text-sm">
                  Exercise logged today ✓
                </p>
                <p className="text-green-600 text-xs mt-1">
                  {todayLog.exercise.activities
                    .map((a) => `${a.name} (${a.durationMins}m)`)
                    .join(" · ")}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                <ActivitySelector
                  options={EXERCISE_OPTIONS}
                  selected={exerciseActivities}
                  onChange={setExerciseActivities}
                />
                <motion.button
                  type="button"
                  data-ocid="trackers.exercise.log_button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogExercise}
                  className="w-full h-11 rounded-2xl font-bold text-sm text-white shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #81b29a 0%, #3d9987 100%)",
                    boxShadow: "0 4px 14px rgba(61,153,135,0.3)",
                  }}
                >
                  Log Exercise 💪
                </motion.button>
              </div>
            )}
          </TabsContent>

          {/* ── Outdoor Tab ── */}
          <TabsContent value="outdoor" className="mt-0">
            {todayLog.outdoor ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center"
                data-ocid="trackers.outdoor.success_state"
              >
                <p className="text-2xl mb-1">🌳</p>
                <p className="text-green-700 font-bold text-sm">
                  Outdoor activity logged today ✓
                </p>
                <p className="text-green-600 text-xs mt-1">
                  {todayLog.outdoor.activities
                    .map((a) => `${a.name} (${a.durationMins}m)`)
                    .join(" · ")}
                </p>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                <ActivitySelector
                  options={OUTDOOR_OPTIONS}
                  selected={outdoorActivities}
                  onChange={setOutdoorActivities}
                />
                <motion.button
                  type="button"
                  data-ocid="trackers.outdoor.log_button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogOutdoor}
                  className="w-full h-11 rounded-2xl font-bold text-sm text-white shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #56a3a6 0%, #3d7a8a 100%)",
                    boxShadow: "0 4px 14px rgba(56,163,166,0.3)",
                  }}
                >
                  Log Outdoor Activity 🌳
                </motion.button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Badge shelf */}
        <BadgeShelf badges={unlockedBadges} />
      </CardContent>
    </Card>
  );
}
