import { RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// ─── Types ─────────────────────────────────────────────────────────────────────────────────

type MoodKey = "very-sad" | "sad" | "okay" | "happy" | "very-happy";

interface Mood {
  key: MoodKey;
  label: string;
  emoji: string;
  overlayTitle: string;
  overlayBody: string;
  color: string;
  ringColor: string;
  glowColor: string;
  confetti: boolean;
}

interface ConfettiPiece {
  id: number;
  left: number;
  size: number;
  color: string;
  shape: "square" | "circle" | "rect";
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
}

interface FireworkBurst {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
}

// ─── Mood Data ────────────────────────────────────────────────────────────────────────────

const MOODS: Mood[] = [
  {
    key: "very-sad",
    label: "Very Sad",
    emoji: "😢",
    overlayTitle: "Hey, I see you. 💙",
    overlayBody:
      "It's okay not to be okay. You don't have to carry this alone. Take a breath — take it one moment at a time. You are not your struggles, and brighter days are ahead. Reach out to someone you trust today. You matter more than you know.",
    color: "from-indigo-100/90 to-indigo-200/90",
    ringColor: "border-indigo-400",
    glowColor: "rgba(99,102,241,0.5)",
    confetti: false,
  },
  {
    key: "sad",
    label: "Sad",
    emoji: "🌧️",
    overlayTitle: "That's okay. 🌧️",
    overlayBody:
      "Feeling sad is a sign that you care deeply. Give yourself some grace today. Rest, hydrate, and do one small kind thing for yourself. This feeling will pass — you are stronger than this moment.",
    color: "from-sky-100/90 to-blue-200/90",
    ringColor: "border-blue-400",
    glowColor: "rgba(59,130,246,0.5)",
    confetti: false,
  },
  {
    key: "okay",
    label: "Okay",
    emoji: "🌿",
    overlayTitle: "Steady and strong. 🌿",
    overlayBody:
      "Not every day needs to be amazing. Being okay is actually a great place to be. Keep showing up for yourself — that consistency is everything. Small steady steps lead to big beautiful destinations.",
    color: "from-teal-100/90 to-emerald-100/90",
    ringColor: "border-teal-400",
    glowColor: "rgba(20,184,166,0.5)",
    confetti: false,
  },
  {
    key: "happy",
    label: "Happy",
    emoji: "🌟",
    overlayTitle: "Yes! That's amazing! 🌟",
    overlayBody:
      "Your happiness matters so much! Keep riding this wave. Share a smile with someone today — because joy is genuinely contagious. You deserve every single bit of this good feeling. Let it fuel you!",
    color: "from-amber-100/90 to-yellow-100/90",
    ringColor: "border-amber-400",
    glowColor: "rgba(251,191,36,0.6)",
    confetti: true,
  },
  {
    key: "very-happy",
    label: "Very Happy",
    emoji: "🎉",
    overlayTitle: "YOU ARE ON FIRE! 🎉🔥",
    overlayBody:
      "This energy is EVERYTHING! You are absolutely shining today. Let this joy fuel your entire week, spread it around freely, and remember this feeling whenever things get tough. YOU are incredible — the world is brighter because you are in it!",
    color: "from-rose-100/90 to-fuchsia-100/90",
    ringColor: "border-fuchsia-400",
    glowColor: "rgba(217,70,239,0.6)",
    confetti: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  return `lumi_arc_mood_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function makeConfetti(): ConfettiPiece[] {
  const colors = [
    "#f97316",
    "#facc15",
    "#38bdf8",
    "#a78bfa",
    "#4ade80",
    "#fb7185",
    "#e879f9",
    "#34d399",
  ];
  const shapes: ConfettiPiece["shape"][] = ["square", "circle", "rect"];
  return Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 6 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    delay: Math.random() * 1.5,
    duration: 2.8 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 160,
    rotation: Math.random() * 720,
  }));
}

function makeFireworks(): FireworkBurst[] {
  const colors = ["#facc15", "#f97316", "#e879f9", "#38bdf8", "#4ade80"];
  const positions = [
    { x: 15, y: 15 },
    { x: 85, y: 10 },
    { x: 50, y: 20 },
    { x: 20, y: 70 },
    { x: 80, y: 65 },
  ];
  return positions.map((p, i) => ({
    id: i,
    x: p.x,
    y: p.y,
    color: colors[i % colors.length],
    delay: i * 0.3,
  }));
}

// ─── Brain SVG ────────────────────────────────────────────────────────────────────────────

interface BrainEmojiProps {
  mood: MoodKey;
  size?: number;
  isSelected?: boolean;
  blink?: boolean;
}

function BrainEmoji({
  mood,
  size = 64,
  isSelected = false,
  blink = false,
}: BrainEmojiProps) {
  const [blinking, setBlinking] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function scheduleBlink() {
      const delay = 3000 + Math.random() * 2000;
      timerRef.current = setTimeout(() => {
        setBlinking(true);
        setTimeout(() => {
          setBlinking(false);
          scheduleBlink();
        }, 200);
      }, delay);
    }
    if (blink) scheduleBlink();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [blink]);

  const eyeConfig: Record<
    MoodKey,
    {
      leftY: number;
      rightY: number;
      leftRx: number;
      leftRy: number;
      rightRx: number;
      rightRy: number;
      droopy: boolean;
      teary: boolean;
      sparkle: boolean;
      shine: boolean;
    }
  > = {
    "very-sad": {
      leftY: 36,
      rightY: 36,
      leftRx: 5,
      leftRy: 3,
      rightRx: 5,
      rightRy: 3,
      droopy: true,
      teary: true,
      sparkle: false,
      shine: false,
    },
    sad: {
      leftY: 34,
      rightY: 34,
      leftRx: 5,
      leftRy: 4,
      rightRx: 5,
      rightRy: 4,
      droopy: false,
      teary: true,
      sparkle: false,
      shine: false,
    },
    okay: {
      leftY: 33,
      rightY: 33,
      leftRx: 5,
      leftRy: 5,
      rightRx: 5,
      rightRy: 5,
      droopy: false,
      teary: false,
      sparkle: false,
      shine: false,
    },
    happy: {
      leftY: 32,
      rightY: 32,
      leftRx: 5,
      leftRy: 5.5,
      rightRx: 5,
      rightRy: 5.5,
      droopy: false,
      teary: false,
      sparkle: false,
      shine: true,
    },
    "very-happy": {
      leftY: 31,
      rightY: 31,
      leftRx: 5,
      leftRy: 6,
      rightRx: 5,
      rightRy: 6,
      droopy: false,
      teary: false,
      sparkle: true,
      shine: true,
    },
  };

  const mouthPath: Record<MoodKey, string> = {
    "very-sad": "M 30 54 Q 40 48 50 54",
    sad: "M 29 53 Q 40 49 51 53",
    okay: "M 29 52 L 51 52",
    happy: "M 29 50 Q 40 58 51 50",
    "very-happy": "M 28 49 Q 40 61 52 49",
  };

  const eyeBlinkRy = blinking ? 0.5 : undefined;
  const ec = eyeConfig[mood];

  return (
    <svg
      viewBox="0 0 80 80"
      width={size}
      height={size}
      style={{ overflow: "visible", display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {isSelected && (
        <circle
          cx="40"
          cy="42"
          r="36"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.4"
          className="text-current"
        />
      )}

      <path
        d="
          M 40 12
          C 28 10, 16 16, 14 26
          C 11 32, 14 38, 18 40
          C 14 44, 13 50, 16 55
          C 20 62, 30 65, 40 65
          C 50 65, 60 62, 64 55
          C 67 50, 66 44, 62 40
          C 66 38, 69 32, 66 26
          C 64 16, 52 10, 40 12 Z
        "
        fill="#ffb3c6"
        stroke="#f4849e"
        strokeWidth="1.5"
      />

      <path
        d="M 40 13 C 40 38, 40 52, 40 64"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1.2"
        opacity="0.6"
      />

      <path
        d="M 22 25 Q 26 22 30 25"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 18 36 Q 23 32 27 35"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 20 48 Q 25 44 29 47"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 50 25 Q 54 22 58 25"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 53 35 Q 57 32 62 36"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1"
        opacity="0.5"
      />
      <path
        d="M 51 47 Q 55 44 60 48"
        fill="none"
        stroke="#f4849e"
        strokeWidth="1"
        opacity="0.5"
      />

      <ellipse
        cx="29"
        cy={ec.leftY}
        rx={ec.leftRx}
        ry={blinking ? eyeBlinkRy : ec.leftRy}
        fill="white"
        stroke="#333"
        strokeWidth="0.8"
      />
      {!blinking && (
        <ellipse
          cx={29 + (mood === "very-sad" ? -1 : 0)}
          cy={ec.leftY + (mood === "very-sad" ? 1 : 0)}
          rx={2}
          ry={ec.sparkle ? 1.5 : 2}
          fill={
            mood === "okay"
              ? "#555"
              : mood === "very-sad" || mood === "sad"
                ? "#5566aa"
                : "#333"
          }
        />
      )}
      {ec.sparkle && !blinking && (
        <>
          <circle cx={26} cy={ec.leftY - 2} r="0.9" fill="#facc15" />
          <circle cx={32} cy={ec.leftY - 1.5} r="0.7" fill="white" />
        </>
      )}
      {ec.shine && !blinking && (
        <circle
          cx={27}
          cy={ec.leftY - 1.5}
          r="1.2"
          fill="white"
          opacity="0.85"
        />
      )}
      {ec.droopy && (
        <path
          d={`M ${29 - ec.leftRx} ${ec.leftY} Q 29 ${ec.leftY - ec.leftRy * 0.5} ${29 + ec.leftRx} ${ec.leftY}`}
          fill="#ffb3c6"
          stroke="none"
        />
      )}

      <ellipse
        cx="51"
        cy={ec.rightY}
        rx={ec.rightRx}
        ry={blinking ? eyeBlinkRy : ec.rightRy}
        fill="white"
        stroke="#333"
        strokeWidth="0.8"
      />
      {!blinking && (
        <ellipse
          cx={51 + (mood === "very-sad" ? 1 : 0)}
          cy={ec.rightY + (mood === "very-sad" ? 1 : 0)}
          rx={2}
          ry={ec.sparkle ? 1.5 : 2}
          fill={
            mood === "okay"
              ? "#555"
              : mood === "very-sad" || mood === "sad"
                ? "#5566aa"
                : "#333"
          }
        />
      )}
      {ec.sparkle && !blinking && (
        <>
          <circle cx={48} cy={ec.rightY - 2} r="0.9" fill="#facc15" />
          <circle cx={54} cy={ec.rightY - 1.5} r="0.7" fill="white" />
        </>
      )}
      {ec.shine && !blinking && (
        <circle
          cx={49}
          cy={ec.rightY - 1.5}
          r="1.2"
          fill="white"
          opacity="0.85"
        />
      )}
      {ec.droopy && (
        <path
          d={`M ${51 - ec.rightRx} ${ec.rightY} Q 51 ${ec.rightY - ec.rightRy * 0.5} ${51 + ec.rightRx} ${ec.rightY}`}
          fill="#ffb3c6"
          stroke="none"
        />
      )}

      {ec.teary && (
        <ellipse
          cx={26}
          cy={ec.leftY + 8}
          rx={1.5}
          ry={2.5}
          fill="#93c5fd"
          opacity="0.85"
        />
      )}
      {ec.teary && (
        <ellipse
          cx={54}
          cy={ec.rightY + 8}
          rx={1.5}
          ry={2.5}
          fill="#93c5fd"
          opacity="0.85"
        />
      )}

      <path
        d={mouthPath[mood]}
        fill={mood === "very-happy" ? "#fee2e2" : "none"}
        stroke="#555"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {mood === "very-happy" && (
        <path
          d="M 31 50 Q 40 58 49 50 L 49 52 Q 40 60 31 52 Z"
          fill="white"
          stroke="#ddd"
          strokeWidth="0.5"
        />
      )}

      {(mood === "happy" || mood === "very-happy") && (
        <>
          <ellipse
            cx={21}
            cy={42}
            rx={4}
            ry={2.5}
            fill="#fda4af"
            opacity="0.55"
          />
          <ellipse
            cx={59}
            cy={42}
            rx={4}
            ry={2.5}
            fill="#fda4af"
            opacity="0.55"
          />
        </>
      )}
    </svg>
  );
}

// ─── Confetti ────────────────────────────────────────────────────────────────────────────────

function ConfettiLayer({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p) => {
        const borderRadius =
          p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : "3px";
        const width = p.shape === "rect" ? p.size * 0.55 : p.size;
        const height = p.shape === "rect" ? p.size * 1.6 : p.size;
        return (
          <div
            key={p.id}
            className="confetti-fall"
            style={
              {
                position: "absolute",
                top: "-20px",
                left: `${p.left}%`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: p.color,
                borderRadius,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
                "--drift": `${p.drift}px`,
                "--rot": `${p.rotation}deg`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}

// ─── Fireworks ───────────────────────────────────────────────────────────────────────────────

const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function FireworksLayer({ bursts }: { bursts: FireworkBurst[] }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {bursts.map((b) => (
        <div
          key={b.id}
          className="firework-burst"
          style={
            {
              position: "absolute",
              left: `${b.x}%`,
              top: `${b.y}%`,
              animationDelay: `${b.delay}s`,
              "--fw-color": b.color,
            } as React.CSSProperties
          }
        >
          {SPARK_ANGLES.map((angle) => (
            <div
              key={`burst-${b.id}-spark-${angle}`}
              className="firework-spark"
              style={
                {
                  "--angle": `${angle}deg`,
                  "--fw-color": b.color,
                  animationDelay: `${b.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Mood Overlay ───────────────────────────────────────────────────────────────────────────

interface MoodOverlayProps {
  mood: Mood;
  onDismiss: () => void;
}

function MoodOverlay({ mood, onDismiss }: MoodOverlayProps) {
  const [confettiPieces] = useState(() =>
    mood.confetti ? makeConfetti() : [],
  );
  const [fireworkBursts] = useState(() =>
    mood.confetti ? makeFireworks() : [],
  );

  return (
    <motion.div
      data-ocid="mood.modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${mood.color} backdrop-blur-sm`}
      onClick={onDismiss}
    >
      {mood.confetti && (
        <>
          <ConfettiLayer pieces={confettiPieces} />
          <FireworksLayer bursts={fireworkBursts} />
        </>
      )}

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26, delay: 0.1 }}
        className="relative z-10 max-w-md w-full mx-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          animate={
            mood.confetti
              ? { rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.12, 1] }
              : { scale: [1, 1.06, 1] }
          }
          transition={{ duration: 1.2, repeat: 1, ease: "easeInOut" }}
          className="flex justify-center mb-5"
        >
          <BrainEmoji mood={mood.key} size={100} blink />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight"
        >
          {mood.overlayTitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="text-foreground/80 leading-relaxed text-sm md:text-base mb-6"
        >
          {mood.overlayBody}
        </motion.p>

        <motion.button
          type="button"
          data-ocid="mood.close_button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onDismiss}
          className="px-6 py-2.5 rounded-2xl font-semibold text-sm bg-foreground text-background shadow-md hover:shadow-lg transition-shadow"
        >
          {mood.confetti ? "Thanks! 💛" : "Close ✕"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main MoodCheckIn Component ──────────────────────────────────────────────────────────────────────

export default function MoodCheckIn() {
  const [selected, setSelected] = useState<MoodKey | null>(null);
  const [overlayMood, setOverlayMood] = useState<Mood | null>(null);
  const [checkedInToday, setCheckedInToday] = useState<MoodKey | null>(null);
  const [showChangePrompt, setShowChangePrompt] = useState(false);
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  useEffect(() => {
    const stored = localStorage.getItem(todayKey());
    if (stored) {
      setCheckedInToday(stored as MoodKey);
      setSelected(stored as MoodKey);
    }
  }, []);

  function handleSelect(mood: MoodKey) {
    setSelected(mood);
  }

  function handleConfirm() {
    if (!selected) return;
    const moodData = MOODS.find((m) => m.key === selected);
    if (!moodData) return;
    localStorage.setItem(todayKey(), selected);
    setCheckedInToday(selected);
    setShowChangePrompt(false);
    setOverlayMood(moodData);
    // Sync to backend if logged in via Internet Identity
    if (actor && identity) {
      const dateStr = new Date().toISOString().slice(0, 10);
      (actor as any).saveMoodEntry(dateStr, selected).catch(() => {});
    }
  }

  function handleDismissOverlay() {
    setOverlayMood(null);
  }

  const checkedInMoodData = checkedInToday
    ? MOODS.find((m) => m.key === checkedInToday)
    : null;

  return (
    <>
      {/* Panel */}
      <div
        className="rounded-2xl border border-border/40 shadow-sm"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.03 300 / 0.6) 0%, oklch(0.96 0.04 25 / 0.55) 50%, oklch(0.96 0.03 195 / 0.5) 100%)",
        }}
        data-ocid="mood.panel"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg" role="img" aria-label="brain">
              🧠
            </span>
            <h3 className="font-display text-base font-bold text-foreground">
              Daily Mood Check-In
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            How are you feeling right now?
          </p>
        </div>

        {checkedInToday && !showChangePrompt ? (
          /* Already checked in */
          <div className="px-5 pb-5">
            <div
              className="flex flex-col items-center gap-2 py-4 rounded-xl bg-white/60 border border-white/80"
              data-ocid="mood.success_state"
            >
              <div className="mood-wiggle">
                <BrainEmoji mood={checkedInToday} size={56} isSelected blink />
              </div>
              <div className="text-xs font-semibold text-foreground/70">
                You've checked in today ✓
              </div>
              <div className="text-sm font-bold text-foreground">
                {checkedInMoodData?.label}
              </div>
              {/* Update Mood button — dark peach, clearly visible */}
              <motion.button
                type="button"
                data-ocid="mood.edit_button"
                onClick={() => {
                  setShowChangePrompt(true);
                  setSelected(checkedInToday);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="mt-2 flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #e07a5f 0%, #c9614a 100%)",
                  boxShadow: "0 4px 12px rgba(224,122,95,0.45)",
                }}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Update Mood
              </motion.button>
            </div>
          </div>
        ) : (
          /* Mood selection — vertical stack */
          <div className="px-4 pb-5">
            <fieldset className="border-0 p-0 m-0">
              <legend className="sr-only">Select your mood</legend>
              <div className="flex flex-col gap-2 mb-4">
                {MOODS.map((mood, i) => {
                  const isSelected = selected === mood.key;
                  return (
                    <motion.button
                      type="button"
                      key={mood.key}
                      data-ocid={`mood.toggle.${i + 1}`}
                      onClick={() => handleSelect(mood.key)}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.97 }}
                      animate={
                        isSelected ? { scale: 1.03, x: 3 } : { scale: 1, x: 0 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      }}
                      className={`relative flex flex-row items-center gap-3 w-full px-3 py-2 rounded-xl border-2 transition-colors text-left ${
                        isSelected
                          ? `${mood.ringColor} bg-white/70`
                          : "border-transparent hover:bg-white/40"
                      }`}
                      style={
                        isSelected
                          ? { boxShadow: `0 0 14px 3px ${mood.glowColor}` }
                          : {}
                      }
                      aria-pressed={isSelected}
                      aria-label={mood.label}
                    >
                      <div
                        className={isSelected ? "mood-wiggle" : ""}
                        style={{ padding: "6px", flexShrink: 0 }}
                      >
                        <BrainEmoji
                          mood={mood.key}
                          size={48}
                          blink={isSelected}
                          isSelected={isSelected}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground/80 leading-tight">
                        {mood.label}
                      </span>
                      {isSelected && (
                        <span className="ml-auto text-base" aria-hidden="true">
                          ✓
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </fieldset>

            {/* Confirm button */}
            <AnimatePresence>
              {selected && (
                <motion.button
                  type="button"
                  data-ocid="mood.submit_button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleConfirm}
                  className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #e07a5f 0%, #c9614a 100%)",
                    boxShadow: "0 4px 14px rgba(224,122,95,0.4)",
                  }}
                >
                  {showChangePrompt ? "Update Mood ✨" : "Share My Mood ✨"}
                </motion.button>
              )}
            </AnimatePresence>

            {!selected && (
              <div className="text-center text-xs text-muted-foreground/70 pt-1">
                Tap a brain to tell us how you feel
              </div>
            )}
          </div>
        )}
      </div>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {overlayMood && (
          <MoodOverlay mood={overlayMood} onDismiss={handleDismissOverlay} />
        )}
      </AnimatePresence>
    </>
  );
}
