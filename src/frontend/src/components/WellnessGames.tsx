import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  RotateCcw,
  Star,
  Timer,
  Wind,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { triggerConfetti } from "./confettiUtils";

// ── Emotion Charades ────────────────────────────────────────────────────────
const EMOTIONS = [
  "Surprised",
  "Anxious",
  "Proud",
  "Disgusted",
  "Elated",
  "Nervous",
  "Content",
  "Confused",
  "Grateful",
  "Hopeful",
  "Frustrated",
  "Curious",
  "Peaceful",
  "Overwhelmed",
  "Joyful",
  "Shy",
  "Excited",
  "Melancholy",
  "Determined",
  "Serene",
];

export function EmotionCharades() {
  const [idx, setIdx] = useState(0);
  const [acted, setActed] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const emotion = EMOTIONS[idx];
  const total = EMOTIONS.length;

  const handleActed = () => {
    setActed((prev) => [...prev, emotion]);
    if (idx + 1 >= total) setDone(true);
    else setIdx((i) => i + 1);
  };
  const handleSkip = () => {
    setSkipped((prev) => [...prev, emotion]);
    if (idx + 1 >= total) setDone(true);
    else setIdx((i) => i + 1);
  };
  const restart = () => {
    setIdx(0);
    setActed([]);
    setSkipped([]);
    setDone(false);
  };

  if (done) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-5xl">🎭</div>
        <h3 className="font-semibold text-lg text-foreground">
          Round Complete!
        </h3>
        <p className="text-muted-foreground">
          You acted out {acted.length} emotion{acted.length !== 1 ? "s" : ""}{" "}
          and skipped {skipped.length}.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {acted.map((e) => (
            <span
              key={e}
              className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium"
            >
              ✓ {e}
            </span>
          ))}
        </div>
        <Button
          onClick={restart}
          className="rounded-xl bg-primary text-primary-foreground"
          data-ocid="charades.restart.button"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Play Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>
          Card {idx + 1} of {total}
        </span>
        <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
          Acted: {acted.length}
        </span>
      </div>
      <motion.div
        key={idx}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200 rounded-2xl p-10 text-center shadow-sm"
      >
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Act this out!
        </p>
        <p className="text-4xl font-bold text-foreground font-display">
          {emotion}
        </p>
      </motion.div>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleSkip}
          className="flex-1 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
          data-ocid="charades.skip.button"
        >
          <ChevronRight className="w-4 h-4 mr-1" /> Skip
        </Button>
        <Button
          onClick={handleActed}
          className="flex-1 rounded-xl bg-teal-500 hover:bg-teal-600 text-white"
          data-ocid="charades.acted.button"
        >
          <CheckCircle className="w-4 h-4 mr-1" /> Acted Out ✓
        </Button>
      </div>
    </div>
  );
}

// ── Mindful Jenga ────────────────────────────────────────────────────────────
const JENGA_PROMPTS = [
  "Name 3 things you can touch right now",
  "Take 5 slow deep breaths together",
  "Say one kind thing about yourself",
  "Name one thing making you anxious this week",
  "Share one thing you're proud of",
  "Describe your ideal peaceful place",
  "Name 3 sounds you can hear right now",
  "Share a skill you want to develop",
  "Tell one thing that made you smile today",
  "What would you do if you had no fear?",
  "Name someone you're grateful for and why",
  "Describe a challenge you overcame",
  "What does 'home' feel like to you?",
  "Share one thing you'd tell your younger self",
  "Name a small joy you experienced recently",
  "What emotion are you carrying right now?",
  "Describe a moment you felt truly free",
  "What's one boundary you wish you'd set?",
  "Share your favourite coping skill",
  "Name 2 things you love about your life",
  "What song matches your current mood?",
  "Describe a time you helped someone",
  "What's one habit you want to build?",
  "Name something that always calms you",
  "What does strength mean to you?",
  "Share one dream you haven't told anyone",
  "Name 3 values most important to you",
  "What do you wish people understood about you?",
  "Share a lesson that changed you",
  "What does rest look like for you?",
];

export function MindfulJenga() {
  const rows = 10;
  const cols = 3;
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);

  const totalBlocks = rows * cols;

  const handleBlock = (i: number) => {
    if (removed.has(i)) return;
    setActive(i);
  };

  const removeBlock = () => {
    if (active === null) return;
    setRemoved((prev) => new Set([...prev, active]));
    setActive(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click a block to reveal its mindfulness prompt, then remove it!
      </p>

      {/* Tower */}
      <div className="flex flex-col-reverse gap-1 max-w-xs mx-auto">
        {Array.from({ length: rows * cols }, (_, blockId) => blockId)
          .reduce<number[][]>((acc, blockId) => {
            const rowIdx = Math.floor(blockId / cols);
            if (!acc[rowIdx]) acc[rowIdx] = [];
            acc[rowIdx].push(blockId);
            return acc;
          }, [])
          .map((rowBlocks) => (
            <div
              key={`row-${rowBlocks[0]}`}
              className="flex gap-1 justify-center"
            >
              {rowBlocks.map((blockId) => {
                const isRemoved = removed.has(blockId);
                return (
                  <motion.button
                    key={`block-${blockId}`}
                    type="button"
                    onClick={() => handleBlock(blockId)}
                    disabled={isRemoved}
                    whileHover={{ scale: isRemoved ? 1 : 1.05 }}
                    className={cn(
                      "w-16 h-7 rounded text-xs font-medium transition-all border",
                      isRemoved
                        ? "opacity-0 pointer-events-none"
                        : "bg-amber-100 border-amber-300 hover:bg-amber-200 cursor-pointer text-amber-800",
                    )}
                    data-ocid={`jenga.block.${blockId + 1}`}
                  >
                    {!isRemoved && "▬"}
                  </motion.button>
                );
              })}
            </div>
          ))}
      </div>

      {/* Prompt Modal */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3"
          >
            <p className="text-xs text-amber-600 uppercase tracking-wider">
              Your Prompt
            </p>
            <p className="text-sm font-medium text-foreground">
              {JENGA_PROMPTS[active % JENGA_PROMPTS.length]}
            </p>
            <Button
              onClick={removeBlock}
              className="rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-900"
              data-ocid="jenga.remove.button"
            >
              Remove Block
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-center text-muted-foreground">
        Blocks removed: {removed.size} / {totalBlocks}
      </p>
    </div>
  );
}

// ── Feelings Bingo ────────────────────────────────────────────────────────────
const BINGO_EMOTIONS = [
  "Happy",
  "Calm",
  "Anxious",
  "Proud",
  "Tired",
  "Curious",
  "Frustrated",
  "Hopeful",
  "Nervous",
  "Grateful",
  "Excited",
  "Peaceful",
  "FREE",
  "Confused",
  "Loved",
  "Determined",
  "Overwhelmed",
  "Content",
  "Joyful",
  "Shy",
  "Bored",
  "Inspired",
  "Worried",
  "Surprised",
  "Hopeless",
];

function checkBingo(marked: Set<number>): boolean {
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ];
  return lines.some((line) => line.every((i) => marked.has(i)));
}

export function FeelingsBingo() {
  const [marked, setMarked] = useState<Set<number>>(new Set([12]));
  const [bingo, setBingo] = useState(false);

  const toggle = (i: number) => {
    if (i === 12) return; // FREE space
    const next = new Set(marked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setMarked(next);
    if (checkBingo(next)) {
      setBingo(true);
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Click emotions you've felt today or this week. Get 5 in a row to win!
      </p>
      <div className="grid grid-cols-5 gap-1.5">
        {BINGO_EMOTIONS.map((em, emIdx) => (
          <button
            key={em}
            type="button"
            onClick={() => toggle(emIdx)}
            className={cn(
              "py-2 px-1 rounded-lg text-xs font-medium border transition-all text-center leading-tight",
              emIdx === 12
                ? "bg-amber-400 border-amber-500 text-amber-900 font-bold"
                : marked.has(emIdx)
                  ? "bg-teal-400 border-teal-500 text-white"
                  : "bg-muted border-border text-muted-foreground hover:bg-accent",
            )}
            data-ocid={`bingo.cell.${emIdx + 1}`}
          >
            {em}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {bingo && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-teal-50 border border-teal-300 rounded-2xl p-4 text-center"
          >
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-semibold text-teal-700">
              BINGO! Amazing self-awareness!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Worry Monster ────────────────────────────────────────────────────────────
export function WorryMonster() {
  const [worry, setWorry] = useState("");
  const [eaten, setEaten] = useState<string[]>([]);
  const [munching, setMunching] = useState(false);

  const feed = () => {
    if (!worry.trim()) return;
    setMunching(true);
    setTimeout(() => {
      setEaten((prev) => [...prev, worry.trim()]);
      setWorry("");
      setMunching(false);
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Monster Art */}
      <motion.div
        animate={munching ? { scale: [1, 1.15, 0.95, 1.1, 1] } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-32 h-32">
          {/* Body */}
          <div className="w-32 h-28 rounded-3xl bg-gradient-to-b from-green-300 to-green-500 flex flex-col items-center justify-center shadow-lg">
            {/* Eyes */}
            <div className="flex gap-5 mb-2">
              <motion.div
                animate={munching ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-4 h-4 bg-green-900 rounded-full" />
              </motion.div>
              <motion.div
                animate={munching ? { scaleY: [1, 0.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="w-7 h-7 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-4 h-4 bg-green-900 rounded-full" />
              </motion.div>
            </div>
            {/* Mouth */}
            <motion.div
              animate={munching ? { scaleY: [1, 2.5, 1] } : {}}
              transition={{ duration: 0.6 }}
              className="w-16 h-6 bg-green-900 rounded-full overflow-hidden flex items-center justify-center"
            >
              {munching && <span className="text-xs text-white">😋</span>}
            </motion.div>
          </div>
          {/* Horns */}
          <div className="absolute -top-3 left-5 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-green-600" />
          <div className="absolute -top-3 right-5 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-green-600" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {munching
            ? "Nom nom nom! Yummy worry! 😊"
            : `${eaten.length > 0 ? `I've eaten ${eaten.length} ${eaten.length === 1 ? "worry" : "worries"} for you!` : "Feed me your worries!"}`}
        </p>
      </motion.div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={worry}
          onChange={(e) => setWorry(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && feed()}
          placeholder="Type a worry here..."
          className="rounded-xl flex-1"
          data-ocid="worry.input"
        />
        <Button
          onClick={feed}
          disabled={!worry.trim() || munching}
          className="rounded-xl bg-green-500 hover:bg-green-600 text-white whitespace-nowrap"
          data-ocid="worry.feed.button"
        >
          Feed Monster!
        </Button>
      </div>

      {/* Eaten list */}
      {eaten.length > 0 && (
        <div className="bg-green-50 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-green-700 mb-2">
            Worries eaten ({eaten.length}):
          </p>
          {eaten.map((w) => (
            <motion.p
              key={w}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-green-600 line-through"
            >
              ✓ {w}
            </motion.p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Positive Memory Pictionary ───────────────────────────────────────────────
const MEMORY_PROMPTS = [
  "A day you felt genuinely proud",
  "A place that always makes you happy",
  "A moment with your favourite person",
  "A meal that felt like love",
  "A day in nature that calmed you",
  "A childhood memory that warms you",
  "A time you laughed so hard it hurt",
  "Your ideal peaceful morning",
  "A moment of unexpected kindness",
  "A time you surprised yourself",
];

export function PositiveMemoryPictionary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#5b8fa8");
  const [size, setSize] = useState(4);
  const [eraser, setEraser] = useState(false);
  const [promptIdx, setPromptIdx] = useState(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = eraser ? "#fafafa" : color;
    ctx.lineWidth = eraser ? 20 : size;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && canvasRef.current)
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const nextPrompt = () => {
    setPromptIdx((i) => (i + 1) % MEMORY_PROMPTS.length);
    clearCanvas();
  };

  const COLORS = [
    "#e05252",
    "#e07b52",
    "#d4b84a",
    "#5b8fa8",
    "#5a8c6e",
    "#7b5ea8",
    "#333",
  ];

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
        <p className="text-xs text-amber-600 mb-1 uppercase tracking-wide">
          Draw this memory
        </p>
        <p className="text-sm font-semibold text-foreground">
          {MEMORY_PROMPTS[promptIdx]}
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setColor(c);
              setEraser(false);
            }}
            className={cn(
              "w-7 h-7 rounded-full border-2 transition-all",
              color === c && !eraser
                ? "border-foreground scale-110"
                : "border-transparent",
            )}
            style={{ backgroundColor: c }}
          />
        ))}
        <button
          type="button"
          onClick={() => setEraser(!eraser)}
          className={cn(
            "px-3 py-1 rounded-lg text-xs border",
            eraser
              ? "bg-foreground text-background"
              : "bg-muted text-foreground",
          )}
          data-ocid="pictionary.eraser.toggle"
        >
          Eraser
        </button>
        <input
          type="range"
          min={2}
          max={16}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-20"
        />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={360}
        height={220}
        className="w-full rounded-xl border border-border bg-[#fafafa] cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
        data-ocid="pictionary.canvas_target"
      />

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={clearCanvas}
          className="flex-1 rounded-xl"
          data-ocid="pictionary.clear.button"
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Clear
        </Button>
        <Button
          onClick={nextPrompt}
          className="flex-1 rounded-xl bg-primary text-primary-foreground"
          data-ocid="pictionary.next.button"
        >
          <ChevronRight className="w-4 h-4 mr-1" /> New Prompt
        </Button>
      </div>
    </div>
  );
}

// ── Gratitude Scavenger Hunt ─────────────────────────────────────────────────
const GRATITUDE_ITEMS = [
  "Something that made you smile today",
  "A person you're grateful for",
  "Something beautiful you saw",
  "A skill you have that helps you",
  "A challenge you overcame recently",
  "Food that nourished you today",
  "A memory that warms your heart",
  "Something in nature you appreciate",
  "A lesson you learned recently",
  "A small joy you noticed today",
];

export function GratitudeScavengerHunt() {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [celebrated, setCelebrated] = useState(false);

  const toggle = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setChecked(next);
    if (next.size === GRATITUDE_ITEMS.length && !celebrated) {
      setCelebrated(true);
      triggerConfetti();
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Check off each item and optionally add a note. Complete all 10 for a
        celebration! ({checked.size}/10)
      </p>
      {GRATITUDE_ITEMS.map((item, iIdx) => (
        <div key={item} className="space-y-1">
          <button
            type="button"
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all w-full text-left",
              checked.has(iIdx)
                ? "bg-teal-50 border-teal-300"
                : "bg-muted/30 border-border hover:bg-muted/60",
            )}
            onClick={() => toggle(iIdx)}
            data-ocid={`gratitude.checkbox.${iIdx + 1}`}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all",
                checked.has(iIdx)
                  ? "bg-teal-500 border-teal-500"
                  : "border-muted-foreground",
              )}
            >
              {checked.has(iIdx) && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <p
              className={cn(
                "text-sm",
                checked.has(iIdx) ? "text-teal-700" : "text-foreground",
              )}
            >
              {item}
            </p>
          </button>
          {checked.has(iIdx) && (
            <Input
              value={notes[iIdx] ?? ""}
              onChange={(e) =>
                setNotes((n) => ({ ...n, [iIdx]: e.target.value }))
              }
              placeholder="Add a note (optional)..."
              className="rounded-xl text-xs ml-8"
              onClick={(e) => e.stopPropagation()}
              data-ocid={`gratitude.input.${iIdx + 1}`}
            />
          )}
        </div>
      ))}
      <AnimatePresence>
        {celebrated && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-teal-50 border border-teal-300 rounded-2xl p-5 text-center"
          >
            <p className="text-3xl mb-2">🌟</p>
            <p className="font-semibold text-teal-700 text-lg">
              Gratitude Completed!
            </p>
            <p className="text-sm text-teal-600">
              You noticed 10 beautiful things in your life. That's wisdom.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Story Cubes ──────────────────────────────────────────────────────────────
const DIE_FACES: string[][] = [
  ["🌟", "💫", "🔥", "🌊", "🌪️", "⚡"],
  ["💔", "❤️", "💙", "💛", "💚", "🖤"],
  ["🤝", "👋", "🙏", "✋", "👏", "🫂"],
  ["🎭", "🎪", "🎨", "🎵", "🎬", "🎯"],
  ["🌈", "🌸", "🍃", "🌺", "🌻", "🌙"],
  ["🌿", "🌱", "🍀", "🌾", "🌵", "🌲"],
];

export function StoryCubes() {
  const [rolled, setRolled] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [story, setStory] = useState("");
  const [rolling, setRolling] = useState(false);
  const [saved, setSaved] = useState(false);

  const roll = () => {
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setRolled(
        DIE_FACES.map((faces) => Math.floor(Math.random() * faces.length)),
      );
      count++;
      if (count > 8) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Roll the dice, then write a short story using all 6 symbols!
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        {DIE_FACES.map((faces, dieNum) => (
          <motion.div
            key={faces[0]}
            animate={rolling ? { rotate: [0, 15, -15, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="w-14 h-14 bg-white border-2 border-border rounded-xl flex items-center justify-center text-2xl shadow-sm"
            data-ocid={`storycubes.die.${dieNum + 1}`}
          >
            {faces[rolled[dieNum]]}
          </motion.div>
        ))}
      </div>
      <Button
        onClick={roll}
        disabled={rolling}
        className="w-full rounded-xl bg-primary text-primary-foreground"
        data-ocid="storycubes.roll.button"
      >
        🎲 Roll Dice
      </Button>
      <Textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="Write your story using all 6 symbols above..."
        className="min-h-[120px] rounded-xl resize-none text-sm"
        data-ocid="storycubes.editor"
      />
      {story.trim() && (
        <Button
          onClick={() => {
            setSaved(true);
            triggerConfetti();
          }}
          variant="outline"
          className="w-full rounded-xl"
          data-ocid="storycubes.save.button"
        >
          <Heart className="w-4 h-4 mr-2 text-rose-500" /> Save My Story
        </Button>
      )}
      {saved && (
        <p className="text-center text-sm text-teal-600 font-medium">
          ✨ Story saved! Your imagination is a gift.
        </p>
      )}
    </div>
  );
}

// ── Affirmation Toss (Spinning Wheel) ────────────────────────────────────────
const AFFIRMATIONS = [
  "I am enough",
  "I am worthy of love",
  "I am capable",
  "I am growing every day",
  "I am resilient",
  "I am not alone",
  "I deserve peace",
  "I am proud of myself",
  "I trust my journey",
  "I am full of potential",
  "I am kind to myself",
  "I attract good energy",
];

export function AffirmationToss() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const extra = 1440 + Math.floor(Math.random() * 360);
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const idx =
        Math.floor(((360 - (newRot % 360)) / 360) * AFFIRMATIONS.length) %
        AFFIRMATIONS.length;
      setCurrent(AFFIRMATIONS[idx]);
      setSpinning(false);
    }, 2500);
  };

  const segSize = 360 / AFFIRMATIONS.length;
  const colors = [
    "#fde68a",
    "#bbf7d0",
    "#bfdbfe",
    "#fecaca",
    "#c7d2fe",
    "#fde68a",
    "#bbf7d0",
    "#bfdbfe",
    "#fecaca",
    "#c7d2fe",
    "#fde68a",
    "#bbf7d0",
  ];

  return (
    <div className="space-y-5">
      <div className="relative mx-auto" style={{ width: 240, height: 240 }}>
        {/* Wheel */}
        <motion.svg
          width={240}
          height={240}
          style={{ transformOrigin: "center" }}
          animate={{ rotate: rotation }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          role="img"
          aria-label="Affirmation spinning wheel"
        >
          <title>Affirmation spinning wheel</title>
          {AFFIRMATIONS.map((aff, aIdx) => {
            const startAngle = (aIdx * segSize - 90) * (Math.PI / 180);
            const endAngle = ((aIdx + 1) * segSize - 90) * (Math.PI / 180);
            const r = 110;
            const cx = 120;
            const cy = 120;
            const x1 = cx + r * Math.cos(startAngle);
            const y1 = cy + r * Math.sin(startAngle);
            const x2 = cx + r * Math.cos(endAngle);
            const y2 = cy + r * Math.sin(endAngle);
            const midAngle = ((aIdx + 0.5) * segSize - 90) * (Math.PI / 180);
            const tx = cx + r * 0.65 * Math.cos(midAngle);
            const ty = cy + r * 0.65 * Math.sin(midAngle);
            return (
              <g key={aff}>
                <path
                  d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                  fill={colors[aIdx]}
                  stroke="white"
                  strokeWidth={2}
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={7}
                  fill="#374151"
                  transform={`rotate(${(aIdx + 0.5) * segSize}, ${tx}, ${ty})`}
                >
                  {aff.length > 12 ? `${aff.substring(0, 11)}…` : aff}
                </text>
              </g>
            );
          })}
          <circle
            cx={120}
            cy={120}
            r={18}
            fill="white"
            stroke="#d1d5db"
            strokeWidth={2}
          />
        </motion.svg>
        {/* Pointer */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[18px] border-l-transparent border-r-transparent border-t-rose-500" />
      </div>

      <Button
        onClick={spin}
        disabled={spinning}
        className="w-full rounded-xl bg-rose-400 hover:bg-rose-500 text-white"
        data-ocid="affirmation.spin.button"
      >
        {spinning ? "Spinning..." : "🌀 Spin!"}
      </Button>

      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-200 rounded-2xl p-5 text-center"
          >
            <p className="text-xl font-bold text-foreground font-display">
              "{current}"
            </p>
            <button
              type="button"
              onClick={() => setSaved((s) => [...s, current])}
              className="mt-3 text-xs text-rose-500 underline"
              data-ocid="affirmation.save.button"
            >
              ♡ Save this affirmation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {saved.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Saved affirmations:
          </p>
          {saved.map((s) => (
            <p
              key={s}
              className="text-xs text-rose-600 bg-rose-50 rounded-lg px-3 py-1.5"
            >
              ♡ {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mindful Breathing Relay ──────────────────────────────────────────────────
type Phase = { name: string; duration: number; instruction: string };
const PHASES: Phase[] = [
  {
    name: "Inhale",
    duration: 4,
    instruction: "Breathe in slowly through your nose",
  },
  { name: "Hold", duration: 4, instruction: "Hold gently" },
  {
    name: "Exhale",
    duration: 6,
    instruction: "Breathe out slowly through your mouth",
  },
  { name: "Rest", duration: 2, instruction: "Rest and prepare" },
];
const TOTAL_CYCLE = PHASES.reduce((a, p) => a + p.duration, 0);

export function MindfulBreathingRelay() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [rounds, setRounds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cyclePos = elapsed % TOTAL_CYCLE;
  let acc = 0;
  let currentPhase = PHASES[0];
  let phaseElapsed = 0;
  for (const phase of PHASES) {
    if (cyclePos < acc + phase.duration) {
      currentPhase = phase;
      phaseElapsed = cyclePos - acc;
      break;
    }
    acc += phase.duration;
  }
  const phaseProgress = (phaseElapsed / currentPhase.duration) * 100;

  const circleScale =
    currentPhase.name === "Inhale"
      ? 0.6 + 0.4 * (phaseElapsed / currentPhase.duration)
      : currentPhase.name === "Exhale"
        ? 1 - 0.4 * (phaseElapsed / currentPhase.duration)
        : currentPhase.name === "Hold"
          ? 1
          : 0.6;

  const start = useCallback(() => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next % TOTAL_CYCLE === 0) setRounds((r) => r + 1);
        return next;
      });
    }, 1000);
  }, []);

  const pause = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = () => {
    pause();
    setElapsed(0);
    setRounds(0);
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const phaseColors: Record<string, string> = {
    Inhale: "from-sky-300 to-blue-400",
    Hold: "from-teal-300 to-teal-500",
    Exhale: "from-violet-300 to-purple-400",
    Rest: "from-amber-200 to-amber-300",
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Animated Circle */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 200, height: 200 }}
      >
        <motion.div
          animate={{ scale: circleScale }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseColors[currentPhase.name] ?? "from-sky-300 to-blue-400"} opacity-70`}
        />
        <div className="relative text-center z-10">
          <p className="text-xl font-bold text-white drop-shadow">
            {currentPhase.name}
          </p>
          <p className="text-3xl font-bold text-white drop-shadow">
            {currentPhase.duration - phaseElapsed}
          </p>
          <Wind className="w-5 h-5 text-white/80 mx-auto mt-1" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-sm text-muted-foreground">
          {currentPhase.instruction}
        </p>
        <p className="text-xs text-muted-foreground">
          Rounds completed: {rounds}
        </p>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${phaseProgress}%` }}
        />
      </div>

      <div className="flex gap-3 w-full">
        <Button
          onClick={running ? pause : start}
          className="flex-1 rounded-xl bg-primary text-primary-foreground"
          data-ocid="breathing.start.button"
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </Button>
        <Button
          variant="outline"
          onClick={reset}
          className="rounded-xl"
          data-ocid="breathing.reset.button"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// ── Compliment Jar Sprint ────────────────────────────────────────────────────
const CARD_COLORS = [
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-teal-100 border-teal-300 text-teal-800",
  "bg-rose-100 border-rose-300 text-rose-800",
  "bg-violet-100 border-violet-300 text-violet-800",
  "bg-sky-100 border-sky-300 text-sky-800",
  "bg-green-100 border-green-300 text-green-800",
];

const SUGGESTIONS = [
  "I am a good listener",
  "I work hard even when it's tough",
  "I am creative",
  "I care deeply about others",
  "I keep going when things are hard",
];

export function ComplimentJarSprint() {
  const DURATION = 120;
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [input, setInput] = useState("");
  const [compliments, setCompliments] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setStarted(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setFinished(true);
          compliments.length === 0 ? SUGGESTIONS : compliments;
          if (compliments.length === 0) setCompliments(SUGGESTIONS);
          triggerConfetti();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const addCompliment = () => {
    if (!input.trim()) return;
    setCompliments((c) => [...c, input.trim()]);
    setInput("");
  };

  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    },
    [],
  );

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      {!started ? (
        <div className="text-center space-y-3">
          <p className="text-4xl">🫙</p>
          <p className="text-sm text-muted-foreground">
            You have 2 minutes to fill your compliment jar with kind things
            about yourself. Ready?
          </p>
          <Button
            onClick={start}
            className="rounded-xl bg-primary text-primary-foreground"
            data-ocid="jar.start.button"
          >
            <Timer className="w-4 h-4 mr-2" /> Start 2-Minute Sprint!
          </Button>
        </div>
      ) : (
        <>
          {/* Timer */}
          <div
            className={cn(
              "text-center text-3xl font-bold font-mono",
              timeLeft <= 20 ? "text-rose-500" : "text-foreground",
            )}
            data-ocid="jar.timer.panel"
          >
            {mins}:{secs}
          </div>

          {/* Input */}
          {!finished && (
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCompliment()}
                placeholder="Type a self-compliment and press Enter..."
                className="flex-1 rounded-xl"
                autoFocus
                data-ocid="jar.input"
              />
              <Button
                onClick={addCompliment}
                className="rounded-xl"
                data-ocid="jar.add.button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Jar */}
          <div className="border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-2xl p-4 min-h-[100px]">
            <p className="text-xs text-center text-amber-600 mb-3 font-semibold">
              🫙 Your Compliment Jar ({compliments.length})
            </p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {compliments.map((c, cIdx) => (
                  <motion.div
                    key={`cp-${c.substring(0, 20)}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "px-3 py-1.5 rounded-xl border text-xs font-medium",
                      CARD_COLORS[cIdx % CARD_COLORS.length],
                    )}
                  >
                    ♡ {c}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {finished && (
            <div className="bg-teal-50 border border-teal-300 rounded-2xl p-4 text-center">
              <p className="text-xl font-bold text-teal-700">🌟 Time's Up!</p>
              <p className="text-sm text-teal-600">
                You wrote {compliments.length} beautiful things about yourself.
                Read them whenever you need a reminder.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Game Dispatcher ──────────────────────────────────────────────────────────
type GameMap = {
  [key: string]: React.ComponentType;
};

const GAME_COMPONENTS: GameMap = {
  "Emotion Charades": EmotionCharades,
  "Mindful Jenga": MindfulJenga,
  "Feelings Bingo": FeelingsBingo,
  "The Worry Monster Game": WorryMonster,
  "Positive Memory Pictionary": PositiveMemoryPictionary,
  "Gratitude Scavenger Hunt": GratitudeScavengerHunt,
  "Story Cubes Emotional Narrative": StoryCubes,
  "Affirmation Toss": AffirmationToss,
  "Mindful Breathing Relay": MindfulBreathingRelay,
  "The Compliment Jar Sprint": ComplimentJarSprint,
};

export function WellnessGameRenderer({ title }: { title: string }) {
  const GameComponent = GAME_COMPONENTS[title];
  if (!GameComponent) {
    return (
      <p className="text-sm text-muted-foreground">Game not found: {title}</p>
    );
  }
  return <GameComponent />;
}
