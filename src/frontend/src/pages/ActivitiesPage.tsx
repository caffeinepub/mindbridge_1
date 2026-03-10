import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { LanguageActivity } from "../backend.d";
import { SAMPLE_ACTIVITIES } from "../data/sampleData";
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
};

type ActivityType = keyof typeof activityConfig;
type FilterTab = ActivityType | "all";

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
  const displayTitle = cleanTitle(activity.title);

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
                  <span className="text-xs text-muted-foreground">
                    Level {difficultyLevel}
                  </span>
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
                {/* Remove the GAME: prefix from the prompt display */}
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
                        isGame
                          ? "Share your experience playing this game..."
                          : typeKey === "affirmation"
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
                      disabled={submitResponse.isPending || !response.trim()}
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl p-4"
                    data-ocid={`activities.success_state.${index + 1}`}
                  >
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-teal-800">
                        Well done!
                      </p>
                      <p className="text-xs text-teal-700">
                        Your reflection has been saved. Taking time to reflect
                        is a powerful act of self-care.
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function ActivitiesPage() {
  const { data: backendActivities, isLoading } = useGetAllActivities();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const activities =
    backendActivities && backendActivities.length > 0
      ? backendActivities
      : SAMPLE_ACTIVITIES;

  const categorised = {
    journaling: activities.filter(
      (a) =>
        !isGameActivity(a) &&
        (a.activityType as unknown as string) === "journaling",
    ),
    word_association: activities.filter(
      (a) =>
        !isGameActivity(a) &&
        (a.activityType as unknown as string) === "word_association",
    ),
    affirmation: activities.filter(
      (a) =>
        !isGameActivity(a) &&
        (a.activityType as unknown as string) === "affirmation",
    ),
    game: activities.filter((a) => isGameActivity(a)),
  };

  const counts: Record<FilterTab, number> = {
    all: activities.length,
    journaling: categorised.journaling.length,
    word_association: categorised.word_association.length,
    affirmation: categorised.affirmation.length,
    game: categorised.game.length,
  };

  const filtered =
    activeTab === "all"
      ? activities
      : activeTab === "game"
        ? categorised.game
        : activeTab === "word_association"
          ? categorised.word_association
          : activeTab === "affirmation"
            ? categorised.affirmation
            : categorised.journaling;

  const tabs: FilterTab[] = [
    "all",
    "journaling",
    "affirmation",
    "word_association",
    "game",
  ];

  const tabLabels: Record<FilterTab, string> = {
    all: "All",
    journaling: "Journaling",
    affirmation: "Affirmations",
    word_association: "Word Play",
    game: "Games",
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Activity className="w-4 h-4" />
          Wellness Activities
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Activities & Games
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Engage with therapeutic language exercises and fun mental wellness
          games to build emotional resilience, self-awareness, and a sense of
          inner calm.
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {(
          ["journaling", "affirmation", "word_association", "game"] as const
        ).map((type) => {
          const cfg = activityConfig[type];
          const Icon = cfg.icon;
          return (
            <div
              key={type}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.color}`}
            >
              <Icon className="w-3 h-3" />
              {cfg.label}: {counts[type]}
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="mb-6 overflow-x-auto">
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

      {/* Loading */}
      {isLoading && (
        <div
          className="flex items-center justify-center py-16"
          data-ocid="activities.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading activities...
          </span>
        </div>
      )}

      {/* Activities list */}
      {!isLoading && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div
              className="text-center py-16"
              data-ocid="activities.empty_state"
            >
              <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="font-display text-lg font-semibold mb-1">
                No activities available
              </h3>
              <p className="text-muted-foreground text-sm">
                Check back soon for new activities.
              </p>
            </div>
          ) : (
            filtered.map((activity, i) => (
              <ActivityCard
                key={activity.id.toString()}
                activity={activity}
                index={i}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
