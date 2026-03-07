import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Brain, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { useCreateAssessment } from "../hooks/useQueries";
import {
  calcAnxietyScore,
  calcDepressionScore,
  calcStressScore,
  getAnxietySeverity,
  getDepressionSeverity,
  getSocialIsolationRisk,
  getStressSeverity,
} from "../utils/scoring";

const DASS21_QUESTIONS = [
  "I found it hard to wind down",
  "I was aware of dryness of my mouth",
  "I couldn't seem to experience any positive feeling at all",
  "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
  "I found it difficult to work up the initiative to do things",
  "I tended to over-react to situations",
  "I experienced trembling (e.g., in the hands)",
  "I felt that I was using a lot of nervous energy",
  "I was worried about situations in which I might panic and make a fool of myself",
  "I felt that I had nothing to look forward to",
  "I found myself getting agitated",
  "I found it difficult to relax",
  "I felt down-hearted and blue",
  "I was intolerant of anything that kept me from getting on with what I was doing",
  "I felt I was close to panic",
  "I was unable to become enthusiastic about anything",
  "I felt I wasn't worth much as a person",
  "I felt that I was rather touchy",
  "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)",
  "I felt scared without any good reason",
  "I felt that life was meaningless",
];

const SOCIAL_ISOLATION_QUESTIONS = [
  "I spend most of my free time alone",
  "I avoid social gatherings or group activities",
  "I feel disconnected from people around me",
  "I rarely reach out to friends or family",
  "I prefer not to talk to anyone when I'm upset",
  "I feel like no one really understands me",
];

const LIKERT_OPTIONS = [
  { value: 0, label: "Did not apply to me at all" },
  { value: 1, label: "Applied to me to some degree" },
  { value: 2, label: "Applied to me to a considerable degree" },
  { value: 3, label: "Applied to me very much" },
];

const TOTAL_QUESTIONS =
  DASS21_QUESTIONS.length + SOCIAL_ISOLATION_QUESTIONS.length;

export default function AssessmentPage() {
  const navigate = useNavigate();
  const { setLatestResult } = useAppContext();
  const createAssessment = useCreateAssessment();

  const [dass21Answers, setDass21Answers] = useState<(number | null)[]>(
    Array(DASS21_QUESTIONS.length).fill(null),
  );
  const [socialAnswers, setSocialAnswers] = useState<(number | null)[]>(
    Array(SOCIAL_ISOLATION_QUESTIONS.length).fill(null),
  );

  const [phase, setPhase] = useState<"dass21" | "social">("dass21");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const isDass = phase === "dass21";
  const questions = isDass ? DASS21_QUESTIONS : SOCIAL_ISOLATION_QUESTIONS;
  const answers = isDass ? dass21Answers : socialAnswers;
  const setAnswers = isDass ? setDass21Answers : setSocialAnswers;
  const currentAnswer = answers[currentIdx];

  const completedDass = dass21Answers.filter((a) => a !== null).length;
  const completedSocial = socialAnswers.filter((a) => a !== null).length;
  const totalCompleted = completedDass + completedSocial;
  const progressPct = (totalCompleted / TOTAL_QUESTIONS) * 100;

  const dassOffset = isDass ? 0 : DASS21_QUESTIONS.length;
  const globalIdx = dassOffset + currentIdx;

  const handleSelect = (val: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIdx] = val;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentAnswer === null) return;
    if (currentIdx < questions.length - 1) {
      setDirection(1);
      setCurrentIdx((i) => i + 1);
    } else if (isDass) {
      // Move to social isolation
      setPhase("social");
      setCurrentIdx(0);
      setDirection(1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx((i) => i - 1);
    } else if (!isDass) {
      setPhase("dass21");
      setCurrentIdx(DASS21_QUESTIONS.length - 1);
      setDirection(-1);
    }
  };

  const handleSubmit = async () => {
    const dassAllAnswered = dass21Answers.every((a) => a !== null);
    const socialAllAnswered = socialAnswers.every((a) => a !== null);
    if (!dassAllAnswered || !socialAllAnswered) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const dassNums = dass21Answers as number[];
    const socialNums = socialAnswers as number[];

    const depressionScore = calcDepressionScore(dassNums);
    const anxietyScore = calcAnxietyScore(dassNums);
    const stressScore = calcStressScore(dassNums);
    const socialScore = socialNums.reduce((a, b) => a + b, 0);

    const depression = getDepressionSeverity(depressionScore);
    const anxiety = getAnxietySeverity(anxietyScore);
    const stress = getStressSeverity(stressScore);
    const socialIsolation = getSocialIsolationRisk(socialScore);

    setLatestResult({
      depression: { rawScore: depressionScore, severity: depression.severity },
      anxiety: { rawScore: anxietyScore, severity: anxiety.severity },
      stress: { rawScore: stressScore, severity: stress.severity },
      socialIsolation: { rawScore: socialScore, risk: socialIsolation.risk },
      timestamp: new Date(),
    });

    try {
      await createAssessment.mutateAsync({
        answers: dassNums.map(BigInt),
        socialIsolationAnswers: socialNums.map(BigInt),
      });
    } catch {
      // Continue even if backend call fails — we have local result
    }

    navigate({ to: "/results" });
  };

  const isLastQuestion =
    (isDass && currentIdx === DASS21_QUESTIONS.length - 1) ||
    (!isDass && currentIdx === SOCIAL_ISOLATION_QUESTIONS.length - 1);

  const isFirstQuestion = currentIdx === 0 && isDass;

  return (
    <div className="min-h-screen bg-background mesh-bg">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {isDass ? "DASS-21 Assessment" : "Social Connection Check"}
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isDass ? "Understanding Your Mind" : "Social Wellbeing"}
          </h1>
        </div>

        {/* Progress */}
        <div className="mb-6" data-ocid="assessment.loading_state">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>
              Question {globalIdx + 1} of {TOTAL_QUESTIONS}
            </span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <Progress value={progressPct} className="h-2 rounded-full" />
          <div className="flex gap-1 mt-2">
            <div
              className={cn(
                "flex-1 text-xs text-center py-0.5 rounded",
                isDass
                  ? "bg-primary/20 text-primary font-medium"
                  : "bg-muted text-muted-foreground",
              )}
            >
              DASS-21 ({completedDass}/{DASS21_QUESTIONS.length})
            </div>
            <div
              className={cn(
                "flex-1 text-xs text-center py-0.5 rounded",
                !isDass
                  ? "bg-primary/20 text-primary font-medium"
                  : "bg-muted text-muted-foreground",
              )}
            >
              Social ({completedSocial}/{SOCIAL_ISOLATION_QUESTIONS.length})
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${phase}-${currentIdx}`}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.25 }}
              className="glass-card rounded-3xl p-6 md:p-8 shadow-md"
            >
              <div className="mb-2 text-xs font-semibold text-primary uppercase tracking-wide">
                {isDass ? "In the past week..." : "About your social life..."}
              </div>
              <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-8 leading-snug">
                {questions[currentIdx]}
              </h2>

              <div className="space-y-3">
                {LIKERT_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                      currentAnswer === opt.value
                        ? "border-primary bg-primary/8 shadow-teal"
                        : "border-border/60 hover:border-border bg-card/80 hover:bg-muted/30",
                    )}
                    data-ocid={`assessment.option.${opt.value + 1}`}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all",
                        currentAnswer === opt.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {opt.value}
                    </div>
                    <span
                      className={cn(
                        "text-sm transition-colors",
                        currentAnswer === opt.value
                          ? "text-foreground font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isFirstQuestion}
            className="flex-1 h-12 rounded-xl"
            data-ocid="assessment.prev_button"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentAnswer === null || createAssessment.isPending}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground shadow-teal"
            data-ocid={
              isLastQuestion
                ? "assessment.submit_button"
                : "assessment.next_button"
            }
          >
            {createAssessment.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isLastQuestion ? (
              "Submit Assessment"
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Encouragement */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          There are no right or wrong answers. Answer honestly for the most
          helpful results.
        </p>
      </div>
    </div>
  );
}
