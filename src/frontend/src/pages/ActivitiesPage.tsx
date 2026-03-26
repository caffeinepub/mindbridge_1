import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  CheckCircle,
  ChevronDown,
  Gamepad2,
  Heart,
  Loader2,
  PenLine,
  Puzzle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { LanguageActivity } from "../backend.d";
import { WellnessGameRenderer } from "../components/WellnessGames";
import { triggerConfetti } from "../components/confettiUtils";
import { PASTIME_GAMES, SAMPLE_ACTIVITIES } from "../data/sampleData";
import {
  useGetAllActivities,
  useSubmitActivityResponse,
} from "../hooks/useQueries";

// Detect if an activity is a game by checking the [GAME] prefix in the title
function isGameActivity(activity: LanguageActivity): boolean {
  return activity.title.startsWith("[GAME]");
}

function cleanTitle(title: string): string {
  return title.replace(/^\[GAME\]\s*/, "");
}

const activityConfig = {
  journaling: {
    label: "Journaling",
    icon: PenLine,
    color: "bg-amber-100 text-amber-700",
    description: "Reflective writing to process emotions and thoughts",
  },
  word_association: {
    label: "Word Association",
    icon: Brain,
    color: "bg-purple-100 text-purple-700",
    description: "Connect words to explore emotions and meanings",
  },
  affirmation: {
    label: "Affirmation",
    icon: Heart,
    color: "bg-rose-100 text-rose-700",
    description: "Positive statements to build self-compassion",
  },
  game: {
    label: "Game",
    icon: Gamepad2,
    color: "bg-green-100 text-green-700",
    description: "Fun, interactive games for mental wellness",
  },
  pastime: {
    label: "Pastime",
    icon: Puzzle,
    color: "bg-teal-100 text-teal-700",
    description: "Fun puzzles and games to spark curiosity and joy",
  },
};

type ActivityType = keyof typeof activityConfig;
type FilterTab = ActivityType | "pastime" | "all";
type DifficultyFilter = "all" | "1" | "2" | "3";

// ── Pastime puzzle parsing ────────────────────────────────────────────────
interface PuzzleItem {
  number: number;
  question: string;
  answer: string;
}

interface ParsedPastime {
  intro: string;
  items: PuzzleItem[];
  rawQuestion: string;
}

function parsePastimePrompt(prompt: string): ParsedPastime {
  // Split on ✅ Answers marker
  const answerSplit = prompt.split(/\u2705\s*Answers[:\s]*/i);
  const questionPart = answerSplit[0] ?? prompt;
  const answerPart = answerSplit[1] ?? "";

  // Extract intro (text before numbered items)
  const introMatch = questionPart.match(/^([^\d]*?)(?=\s*\d+[.)\s])/s);
  const intro = introMatch ? introMatch[1].trim() : "";

  // Extract numbered question items: "1. SOMETHING → ?" or "1. SOMETHING = ?"
  const questionMatches = [
    ...questionPart.matchAll(/(?:^|\n)\s*(\d+)[.)\s]+([^\n]+)/g),
  ];

  // Extract numbered answers from answer section
  // Answers can be: "1. ANSWER  2. ANSWER" or "1-ANSWER  2-ANSWER" or "1. ANSWER\n2. ANSWER"
  const answerMap: Record<number, string> = {};
  const answerMatches = [
    ...answerPart.matchAll(
      /(?:^|[\n\s])(\d+)[-.)\s]+([A-Z][^\n\d]{0,60}?)(?=\s{2,}|\s*\d+[-.)\s]|$)/gm,
    ),
  ];
  for (const m of answerMatches) {
    const num = Number(m[1]);
    const ans = m[2]
      .trim()
      .replace(/[()]/g, "")
      .split(/\s+→\s+/)[0]
      .trim();
    if (ans && ans.length > 0 && ans.length < 60) {
      answerMap[num] = ans;
    }
  }

  // Build items
  const items: PuzzleItem[] = [];
  for (const qm of questionMatches) {
    const num = Number(qm[1]);
    let q = qm[2].trim();
    // Remove trailing "→ ?" or "= ?"
    q = q.replace(/\s*[→=]\s*\?\s*$/, "").trim();
    const ans = answerMap[num] ?? "";
    if (q.length > 0) {
      items.push({ number: num, question: q, answer: ans });
    }
  }

  return { intro, items, rawQuestion: questionPart };
}

// ── Interactive Pastime Card ───────────────────────────────────────────────
function PastimeCard({
  activity,
  index,
}: { activity: LanguageActivity; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, boolean>>({});

  const parsed = parsePastimePrompt(activity.prompt);
  const hasItems = parsed.items.length > 0;

  const difficultyLevel = Number(activity.difficultyLevel);
  const difficultyLabel: Record<number, { label: string; color: string }> = {
    1: { label: "Easy", color: "bg-teal-100 text-teal-700" },
    2: { label: "Medium", color: "bg-amber-100 text-amber-700" },
    3: { label: "Hard", color: "bg-rose-100 text-rose-700" },
  };
  const diff = difficultyLabel[difficultyLevel] ?? {
    label: `Level ${difficultyLevel}`,
    color: "bg-muted text-muted-foreground",
  };

  const checkAnswers = () => {
    const res: Record<number, boolean> = {};
    let correct = 0;
    for (const item of parsed.items) {
      const userAns = (inputs[item.number] ?? "").trim().toLowerCase();
      const correctAns = item.answer.trim().toLowerCase();
      // Accept if the correct answer contains the user input or matches
      const isCorrect =
        correctAns.length > 0 &&
        (userAns === correctAns ||
          correctAns.includes(userAns) ||
          userAns.includes(correctAns.split(/\s+/)[0] ?? ""));
      res[item.number] = isCorrect;
      if (isCorrect) correct++;
    }
    setResults(res);
    setChecked(true);
    if (correct > 0) triggerConfetti();
  };

  const reset = () => {
    setInputs({});
    setChecked(false);
    setResults({});
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const total = parsed.items.length;

  const summaryMsg =
    correctCount === total
      ? `🎉 Perfect score! ${total}/${total} correct! You're amazing!`
      : correctCount >= Math.ceil(total * 0.7)
        ? `✨ Great job! ${correctCount}/${total} correct! Keep it up!`
        : correctCount > 0
          ? `💪 You got ${correctCount}/${total}! Every attempt makes you smarter!`
          : "🌱 Keep going! Each attempt is a step forward. Try again!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      data-ocid={`pastime.item.${index + 1}`}
    >
      <Card className="rounded-2xl border-teal-200/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-gradient-to-br from-teal-50/30 to-background">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-100 text-teal-700">
                <Puzzle className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="font-display text-sm font-semibold leading-snug">
                  {activity.title}
                </CardTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className="rounded-full text-xs bg-teal-100 text-teal-700">
                    Pastime
                  </Badge>
                  <Badge className={`rounded-full text-xs ${diff.color}`}>
                    {diff.label}
                  </Badge>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
              data-ocid={`pastime.toggle.${index + 1}`}
            >
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  expanded ? "rotate-180" : "",
                )}
              />
            </button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 px-5 pb-5">
                {hasItems ? (
                  <div className="space-y-4">
                    {/* Intro */}
                    {parsed.intro && (
                      <div className="bg-muted/40 rounded-xl p-3">
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {parsed.intro}
                        </p>
                      </div>
                    )}

                    {/* Question items with inputs */}
                    <div className="space-y-3">
                      {parsed.items.map((item) => {
                        const isCorrect = results[item.number];
                        const wasChecked = checked;
                        return (
                          <div key={item.number} className="space-y-1.5">
                            <p className="text-sm text-foreground">
                              <span className="font-semibold text-teal-600 mr-1">
                                {item.number}.
                              </span>
                              {item.question}
                            </p>
                            <div className="flex items-center gap-2">
                              <Input
                                value={inputs[item.number] ?? ""}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    [item.number]: e.target.value,
                                  }))
                                }
                                placeholder="Your answer..."
                                className={cn(
                                  "rounded-xl text-sm flex-1 transition-all",
                                  wasChecked && isCorrect
                                    ? "bg-green-100 border-green-400 text-green-800"
                                    : wasChecked && !isCorrect
                                      ? "bg-indigo-100 border-indigo-400 text-indigo-800"
                                      : "",
                                )}
                                disabled={wasChecked}
                                data-ocid={`pastime.input.${index + 1}`}
                              />
                              {wasChecked && (
                                <span
                                  className={cn(
                                    "text-xs font-medium px-2 py-1 rounded-lg whitespace-nowrap",
                                    isCorrect
                                      ? "bg-green-100 text-green-700"
                                      : "bg-indigo-100 text-indigo-700",
                                  )}
                                >
                                  {isCorrect
                                    ? "✓ Correct!"
                                    : `→ ${item.answer}`}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary after check */}
                    {checked && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "rounded-xl p-3 text-sm font-medium text-center",
                          correctCount === total
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : correctCount > 0
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-muted text-muted-foreground border border-border",
                        )}
                        data-ocid={`pastime.result.${index + 1}`}
                      >
                        {summaryMsg}
                      </motion.div>
                    )}

                    {/* Action buttons */}
                    {!checked ? (
                      <Button
                        onClick={checkAnswers}
                        className="w-full h-10 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm"
                        data-ocid={`pastime.check.button.${index + 1}`}
                      >
                        Show Answers
                      </Button>
                    ) : (
                      <Button
                        onClick={reset}
                        variant="outline"
                        className="w-full h-10 rounded-xl text-sm"
                        data-ocid={`pastime.retry.button.${index + 1}`}
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                ) : (
                  // Fallback: show full prompt with textarea
                  <div className="space-y-3">
                    <div className="bg-muted/40 rounded-xl p-4">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {activity.prompt}
                      </p>
                    </div>
                    <Textarea
                      placeholder="Write your notes here..."
                      className="min-h-[100px] rounded-xl resize-none text-sm"
                      data-ocid={`pastime.textarea.${index + 1}`}
                    />
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── Activity Card ─────────────────────────────────────────────────────────
function ActivityCard({
  activity,
  index,
}: { activity: LanguageActivity; index: number }) {
  const isGame = isGameActivity(activity);
  const typeKey = isGame
    ? "game"
    : (activity.activityType as unknown as string);
  const config =
    activityConfig[typeKey as ActivityType] ?? activityConfig.journaling;
  const Icon = config.icon;

  const [expanded, setExpanded] = useState(false);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitResponse = useSubmitActivityResponse();
  const displayTitle = cleanTitle(activity.title);
  const gameTitle = displayTitle;

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast.error("Please write something before submitting.");
      return;
    }
    try {
      await submitResponse.mutateAsync({
        activityId: activity.id,
        response: response.trim(),
      });
      setSubmitted(true);
      toast.success("Response saved! Great work reflecting today.");
    } catch {
      toast.error("Could not save your response. Please try again.");
    }
  };

  const difficultyLevel = Number(activity.difficultyLevel);
  const difficultyLabel: Record<number, { label: string; color: string }> = {
    1: { label: "Level 1 — Gentle", color: "bg-teal-100 text-teal-700" },
    2: { label: "Level 2 — Moderate", color: "bg-amber-100 text-amber-700" },
    3: { label: "Level 3 — Deep", color: "bg-rose-100 text-rose-700" },
  };
  const diff = difficultyLabel[difficultyLevel] ?? {
    label: `Level ${difficultyLevel}`,
    color: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      data-ocid={`activities.item.${index + 1}`}
    >
      <Card className="rounded-2xl border-border/40 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="font-display text-sm font-semibold leading-snug">
                  {displayTitle}
                </CardTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className={`rounded-full text-xs ${config.color}`}>
                    {config.label}
                  </Badge>
                  <Badge className={`rounded-full text-xs ${diff.color}`}>
                    {diff.label}
                  </Badge>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={expanded ? "Collapse" : "Expand"}
              data-ocid={`activities.toggle.${index + 1}`}
            >
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform duration-200",
                  expanded ? "rotate-180" : "",
                )}
              />
            </button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0 px-5 pb-5">
                {isGame ? (
                  // Interactive wellness game
                  <WellnessGameRenderer title={gameTitle} />
                ) : (
                  <>
                    <div className="bg-muted/40 rounded-xl p-4 mb-4">
                      <p className="text-sm text-foreground leading-relaxed">
                        {activity.prompt.replace(/^GAME:\s*/, "")}
                      </p>
                    </div>

                    {!submitted ? (
                      <div className="space-y-3">
                        <Textarea
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder={
                            typeKey === "affirmation"
                              ? "Write how this affirmation makes you feel..."
                              : typeKey === "word_association"
                                ? "Write your word associations here..."
                                : "Begin writing here — there's no right or wrong..."
                          }
                          className="min-h-[120px] rounded-xl resize-none text-sm"
                          data-ocid={`activities.textarea.${index + 1}`}
                        />
                        <Button
                          onClick={handleSubmit}
                          disabled={
                            submitResponse.isPending || !response.trim()
                          }
                          className="w-full h-10 rounded-xl bg-primary text-primary-foreground shadow-teal text-sm"
                          data-ocid={`activities.submit_button.${index + 1}`}
                        >
                          {submitResponse.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Submit Response"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-4">
                        <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-teal-800">
                            Response submitted!
                          </p>
                          <p className="text-xs text-teal-600">
                            Your reflection has been saved.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ActivitiesPage() {
  const { data: backendActivities, isLoading } = useGetAllActivities();

  const allActivities: LanguageActivity[] = [
    ...SAMPLE_ACTIVITIES,
    ...PASTIME_GAMES,
    ...(backendActivities ?? []),
  ] as LanguageActivity[];

  const tabs: FilterTab[] = [
    "all",
    "journaling",
    "affirmation",
    "word_association",
    "game",
    "pastime",
  ];
  const tabLabels: Record<FilterTab, string> = {
    all: "All",
    journaling: "Journaling",
    affirmation: "Affirmations",
    word_association: "Word Play",
    game: "Games",
    pastime: "Pastime",
  };

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  const difficultyButtons = [
    {
      value: "all" as DifficultyFilter,
      label: "All Levels",
      color: "bg-muted text-muted-foreground border-border",
      activeColor: "bg-foreground text-background border-foreground",
    },
    {
      value: "1" as DifficultyFilter,
      label: "Easy",
      color: "bg-teal-50 text-teal-600 border-teal-200",
      activeColor: "bg-teal-500 text-white border-teal-500",
    },
    {
      value: "2" as DifficultyFilter,
      label: "Medium",
      color: "bg-amber-50 text-amber-600 border-amber-200",
      activeColor: "bg-amber-500 text-white border-amber-500",
    },
    {
      value: "3" as DifficultyFilter,
      label: "Hard",
      color: "bg-rose-50 text-rose-600 border-rose-200",
      activeColor: "bg-rose-500 text-white border-rose-500",
    },
  ];

  const isPastime = (a: LanguageActivity) =>
    PASTIME_GAMES.some((g) => g.id === a.id);

  const filtered = allActivities.filter((activity) => {
    const isGame = isGameActivity(activity);
    const typeKey = isGame
      ? "game"
      : (activity.activityType as unknown as string);
    const actIsPastime = isPastime(activity);

    const tabMatch =
      activeTab === "all" ||
      (activeTab === "pastime" && actIsPastime) ||
      (activeTab !== "pastime" && !actIsPastime && typeKey === activeTab) ||
      (activeTab === "game" && isGame && !actIsPastime);

    const diffMatch =
      difficultyFilter === "all" ||
      String(activity.difficultyLevel) === difficultyFilter;

    return tabMatch && diffMatch;
  });

  const counts: Record<FilterTab, number> = {
    all: allActivities.length,
    journaling: allActivities.filter(
      (a) => (a.activityType as unknown as string) === "journaling",
    ).length,
    affirmation: allActivities.filter(
      (a) => (a.activityType as unknown as string) === "affirmation",
    ).length,
    word_association: allActivities.filter(
      (a) =>
        (a.activityType as unknown as string) === "word_association" &&
        !isGameActivity(a) &&
        !isPastime(a),
    ).length,
    game: allActivities.filter((a) => isGameActivity(a) && !isPastime(a))
      .length,
    pastime: PASTIME_GAMES.length,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">
          Activities
        </h1>
        <p className="text-muted-foreground text-sm">
          Explore journaling, affirmations, games, and pastime puzzles to
          support your wellbeing.
        </p>
      </div>

      {/* Category tabs */}
      <div className="mb-4 overflow-x-auto pb-1">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        >
          <TabsList className="h-10 rounded-xl bg-muted p-1 flex gap-1 w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-lg text-xs px-3"
                data-ocid={`activities.${tab}.tab`}
              >
                {tabLabels[tab]}
                {counts[tab] > 0 && (
                  <span className="ml-1 text-xs opacity-60">
                    ({counts[tab]})
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Difficulty filter pills */}
      <div
        className="flex flex-wrap gap-2 mb-6"
        data-ocid="activities.difficulty.panel"
      >
        {difficultyButtons.map((btn) => (
          <button
            key={btn.value}
            type="button"
            onClick={() => setDifficultyFilter(btn.value)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              difficultyFilter === btn.value ? btn.activeColor : btn.color,
            )}
            data-ocid={`activities.level${btn.value === "all" ? "_all" : btn.value}.toggle`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="activities.loading_state"
        >
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="ml-3 text-muted-foreground text-sm">
            Loading activities...
          </span>
        </div>
      )}

      {/* Activities list */}
      {!isLoading && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="activities.empty_state"
            >
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-display text-base font-semibold mb-1 text-foreground">
                No activities found
              </p>
              <p className="text-sm mb-4">
                Try changing the category or difficulty filter.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveTab("all");
                  setDifficultyFilter("all");
                }}
                size="sm"
                className="rounded-xl"
                data-ocid="activities.clear_filter.button"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            filtered.map((activity, i) =>
              isPastime(activity) ? (
                <PastimeCard
                  key={activity.id.toString()}
                  activity={activity}
                  index={i}
                />
              ) : (
                <ActivityCard
                  key={activity.id.toString()}
                  activity={activity}
                  index={i}
                />
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}
