import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  Brain,
  CheckCircle,
  ChefHat,
  GraduationCap,
  Heart,
  Loader2,
  Moon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateParentProfile,
  useCreateStudentProfile,
  useCreateTeacherProfile,
} from "../hooks/useQueries";

type Role = "student" | "teacher" | "parent";

const roles = [
  {
    value: "student" as Role,
    label: "Student",
    icon: GraduationCap,
    description:
      "Track my own mental wellness and access personalized resources",
    color: "border-teal-400 bg-teal-50 text-teal-700",
    selectedBg: "bg-teal-100",
  },
  {
    value: "teacher" as Role,
    label: "Teacher",
    icon: BookOpen,
    description: "Monitor student wellbeing and track progress over time",
    color: "border-sage-400 bg-sage-50 text-sage-600",
    selectedBg: "bg-sage-100",
  },
  {
    value: "parent" as Role,
    label: "Parent",
    icon: Heart,
    description: "Stay informed about my child's mental health journey",
    color: "border-rose-400 bg-rose-50 text-rose-700",
    selectedBg: "bg-rose-100",
  },
];

const walkthroughSteps = [
  {
    icon: Brain,
    emoji: "🧠",
    title: "Your Dashboard",
    description:
      "Check in with your mood every day using our animated brain emoji selector. Receive a fresh wellness tip each morning and track how you feel over time.",
    color: "from-teal-100 to-cyan-100 border-teal-200",
    iconBg: "bg-teal-100 text-teal-600",
  },
  {
    icon: Moon,
    emoji: "🌙",
    title: "Daily Habits",
    description:
      "Log your sleep quality, exercise sessions, and outdoor activities every day. Earn XP, unlock badges, and build streaks to stay motivated.",
    color: "from-indigo-100 to-purple-100 border-indigo-200",
    iconBg: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: Activity,
    emoji: "🌱",
    title: "Explore & Grow",
    description:
      "Browse 100 wellness resources, 50 therapeutic activities and games, and 58 Mindful Kitchen recipes crafted for student wellbeing. Your journey starts now.",
    color: "from-rose-100 to-orange-100 border-rose-200",
    iconBg: "bg-rose-100 text-rose-600",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { setUserRole } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [walkthroughStep, setWalkthroughStep] = useState(0); // 0 = not started
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const createStudent = useCreateStudentProfile();
  const createTeacher = useCreateTeacherProfile();
  const createParent = useCreateParentProfile();

  const isSubmitting =
    createStudent.isPending ||
    createTeacher.isPending ||
    createParent.isPending;

  const validateForm = () => {
    const errs: { name?: string; email?: string } = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedRole || !validateForm()) return;

    try {
      if (selectedRole === "student") {
        await createStudent.mutateAsync({ name, email });
      } else if (selectedRole === "teacher") {
        await createTeacher.mutateAsync({ name, email });
      } else {
        await createParent.mutateAsync({ name, email });
      }
      setUserRole(selectedRole);
      setStep(3);
      if (selectedRole === "student") {
        // Show walkthrough for students
        setTimeout(() => setWalkthroughStep(1), 1200);
      } else {
        setTimeout(() => {
          navigate({ to: "/guardian-dashboard" });
        }, 1500);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleWalkthroughNext = () => {
    if (walkthroughStep < walkthroughSteps.length) {
      setWalkthroughStep((prev) => prev + 1);
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  if (!identity) {
    return null;
  }

  const showWalkthrough =
    step === 3 && walkthroughStep > 0 && selectedRole === "student";
  const currentWalkStep =
    walkthroughStep > 0 ? walkthroughSteps[walkthroughStep - 1] : null;

  return (
    <div className="min-h-screen bg-background mesh-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Welcome to Lumi Arc
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s set up your profile in just a few steps
          </p>
        </motion.div>

        {/* Progress - only shown during steps 1 & 2 */}
        {!showWalkthrough && (
          <div className="flex items-center gap-2 mb-8 px-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    step >= s ? "bg-primary" : "bg-muted",
                  )}
                />
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Choose Role */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-8 shadow-md"
            >
              <h2 className="font-display text-xl font-semibold mb-2">
                I am a...
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Choose the role that best describes you
              </p>

              <div className="space-y-3" data-ocid="onboarding.role.select">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const selected = selectedRole === role.value;
                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                        selected
                          ? `border-primary ${role.selectedBg}`
                          : "border-border/60 hover:border-border bg-card/80",
                      )}
                      data-ocid={`onboarding.${role.value}.button`}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          selected ? role.color : "bg-muted",
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {role.label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {role.description}
                        </div>
                      </div>
                      {selected && (
                        <CheckCircle className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => selectedRole && setStep(2)}
                disabled={!selectedRole}
                className="w-full mt-6 h-12 rounded-xl bg-primary text-primary-foreground shadow-teal"
                data-ocid="onboarding.next_button"
              >
                Continue
              </Button>
            </motion.div>
          )}

          {/* Step 2: Profile Info */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card rounded-3xl p-8 shadow-md"
            >
              <h2 className="font-display text-xl font-semibold mb-2">
                Your profile
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                This helps personalize your experience
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder="Enter your full name"
                    className="mt-1.5 h-11 rounded-xl"
                    data-ocid="onboarding.name.input"
                  />
                  {errors.name && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="onboarding.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((p) => ({ ...p, email: undefined }));
                    }}
                    placeholder="Enter your email"
                    className="mt-1.5 h-11 rounded-xl"
                    data-ocid="onboarding.email.input"
                  />
                  {errors.email && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="onboarding.email_error"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 rounded-xl"
                  data-ocid="onboarding.back_button"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground shadow-teal"
                  data-ocid="onboarding.submit_button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating profile...
                    </>
                  ) : (
                    "Create Profile"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success / Walkthrough */}
          {step === 3 && !showWalkthrough && (
            <motion.div
              key="step3-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 shadow-md text-center"
              data-ocid="onboarding.success_state"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </motion.div>
              <h2 className="font-display text-2xl font-bold mb-2">
                Welcome, {name}!
              </h2>
              <p className="text-muted-foreground">
                {selectedRole === "student"
                  ? "Your profile is ready. Preparing your journey..."
                  : "Your profile is ready. Redirecting you now..."}
              </p>
            </motion.div>
          )}

          {/* Walkthrough for students */}
          {showWalkthrough && currentWalkStep && (
            <motion.div
              key={`walkthrough-${walkthroughStep}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="glass-card rounded-3xl p-8 shadow-md"
              data-ocid="onboarding.walkthrough.panel"
            >
              {/* Step indicators */}
              <div className="flex items-center gap-2 mb-6">
                {walkthroughSteps.map((ws, i) => (
                  <div
                    key={ws.title}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-300",
                      i + 1 <= walkthroughStep ? "bg-primary" : "bg-muted",
                    )}
                  />
                ))}
              </div>

              <div
                className={`rounded-2xl bg-gradient-to-br ${currentWalkStep.color} border p-6 mb-6`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${currentWalkStep.iconBg}`}
                >
                  <span className="text-3xl">{currentWalkStep.emoji}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {currentWalkStep.title}
                </h3>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {currentWalkStep.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Step {walkthroughStep} of {walkthroughSteps.length}
                </span>
                <Button
                  onClick={handleWalkthroughNext}
                  className="h-11 px-6 rounded-xl bg-primary text-primary-foreground shadow-teal"
                  data-ocid={
                    walkthroughStep < walkthroughSteps.length
                      ? "onboarding.walkthrough.next_button"
                      : "onboarding.walkthrough.done_button"
                  }
                >
                  {walkthroughStep < walkthroughSteps.length
                    ? "Next →"
                    : "Let's Go! 🚀"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
