import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Identity } from "@icp-sdk/core/agent";
import { GraduationCap, Heart, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  type LumiProfile,
  type UserRole,
  generateStudentCode,
} from "../hooks/useProfile";

const LOGO_SRC = "/assets/generated/lumi-arc-logo-transparent.dim_400x400.png";

const CONSENT_TEXT: Record<UserRole, string> = {
  student:
    "I choose to show up for myself, one day at a time. By entering this space, I commit to nurturing my emotional well-being and welcome the support of my parent and mentor teacher on this journey.",
  guardian:
    "I believe in being present for my child's inner world. By joining this platform, I agree to gently support their mental wellness journey and stay connected with their growth.",
  teacher:
    "I am here to support the minds that are growing under my guidance. By joining this platform, I commit to staying connected with my students' wellness and being a steady presence in their journey.",
};

interface Props {
  identity: Identity;
  onComplete: (profile: LumiProfile) => void;
}

const fadeSlide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: 0.3 },
};

export default function ProfileSetupWizard({ identity, onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check for teacher invite on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get("teacherInvite");
    if (invite) {
      try {
        const decoded = atob(invite);
        sessionStorage.setItem("pendingTeacherInvite", decoded);
      } catch {
        // ignore malformed
      }
    }
  }, []);

  const totalSteps = role === "guardian" ? 4 : 3;

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep(2);
  };

  const validateProfile = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Display name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      errs.email = "Please enter a valid email address.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileNext = () => {
    if (validateProfile()) {
      setConsentChecked(false);
      setStep(3);
    }
  };

  const handleConsentNext = () => {
    if (!consentChecked) return;
    if (role === "guardian") {
      setStep(4);
    } else {
      finalise();
    }
  };

  const finalise = () => {
    if (!role) return;
    const pendingTeacher = sessionStorage.getItem("pendingTeacherInvite");
    const generatedStudentCode =
      role === "student" ? generateStudentCode(identity) : undefined;

    const profile: LumiProfile = {
      name: name.trim(),
      email: email.trim(),
      role,
      consentGiven: true,
      ...(role === "student" && {
        studentCode: generatedStudentCode,
        ...(pendingTeacher && { linkedTeacherId: pendingTeacher }),
      }),
      ...(role === "guardian" && {
        guardianPhone: phone.trim() || undefined,
        linkedStudentCode: studentCode.trim() || undefined,
      }),
    };

    if (role === "student" && pendingTeacher) {
      sessionStorage.removeItem("pendingTeacherInvite");
    }

    onComplete(profile);
  };

  const handleGuardianLink = () => {
    finalise();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border/50 rounded-3xl shadow-2xl max-w-md w-full p-8"
      >
        {/* Logo + Progress */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <img
            src={LOGO_SRC}
            alt="Lumi Arc"
            className="w-14 h-14 object-contain"
          />
          <h1 className="font-display text-2xl font-bold text-foreground">
            Welcome to Lumi Arc
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            {["a", "b", "c", "d"].slice(0, totalSteps).map((dot, i) => (
              <div
                key={dot}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i < step - 1
                    ? "w-6 bg-primary"
                    : i === step - 1
                      ? "w-8 bg-primary"
                      : "w-4 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div key="step1" {...fadeSlide}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Who are you?
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Select your role to set up your personalised experience.
              </p>
              <div className="space-y-3" data-ocid="wizard.role.panel">
                {(
                  [
                    {
                      role: "student" as UserRole,
                      icon: GraduationCap,
                      label: "Student",
                      desc: "Track your wellness, mood, and habits.",
                      colors: "border-teal-200 hover:bg-teal-50 text-teal-700",
                    },
                    {
                      role: "teacher" as UserRole,
                      icon: Users,
                      label: "Teacher / Mentor",
                      desc: "Monitor your students' wellbeing.",
                      colors: "border-sage-200 hover:bg-sage-50 text-sage-700",
                    },
                    {
                      role: "guardian" as UserRole,
                      icon: Heart,
                      label: "Parent / Guardian",
                      desc: "Stay connected with your child's journey.",
                      colors: "border-rose-200 hover:bg-rose-50 text-rose-700",
                    },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => handleRoleSelect(item.role)}
                      data-ocid={`wizard.${item.role}.button`}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${item.colors}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Profile Form */}
          {step === 2 && role && (
            <motion.div key="step2" {...fadeSlide}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Your profile
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Tell us a little about yourself.
              </p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="wizard-name">Display Name</Label>
                  <Input
                    id="wizard-name"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    data-ocid="wizard.name.input"
                  />
                  {errors.name && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="wizard.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wizard-email">
                    {role === "teacher"
                      ? "Official University Email"
                      : "Email Address"}
                  </Label>
                  <Input
                    id="wizard-email"
                    type="email"
                    placeholder={
                      role === "teacher"
                        ? "name@university.edu"
                        : "you@email.com"
                    }
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    data-ocid="wizard.email.input"
                  />
                  {errors.email && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="wizard.email_error"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                {role === "guardian" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="wizard-phone">
                      Phone Number{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="wizard-phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      data-ocid="wizard.phone.input"
                    />
                    <p className="text-xs text-muted-foreground">
                      Adding your phone number helps the teacher reach you if
                      needed.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  data-ocid="wizard.back.button"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleProfileNext}
                  data-ocid="wizard.profile.submit_button"
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Consent */}
          {step === 3 && role && (
            <motion.div key="step3" {...fadeSlide}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                A moment of intention
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Please read and accept the following before continuing.
              </p>
              <div className="bg-muted/40 border border-border/50 rounded-2xl p-5 text-sm text-foreground leading-relaxed italic mb-5">
                &ldquo;{CONSENT_TEXT[role]}&rdquo;
              </div>
              <div
                className="flex items-start gap-3"
                data-ocid="wizard.consent.panel"
              >
                <Checkbox
                  id="consent-check"
                  checked={consentChecked}
                  onCheckedChange={(v) => setConsentChecked(!!v)}
                  data-ocid="wizard.consent.checkbox"
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent-check"
                  className="text-sm cursor-pointer leading-snug"
                >
                  I understand and agree to the above statement
                </Label>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  data-ocid="wizard.consent.back_button"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleConsentNext}
                  disabled={!consentChecked}
                  data-ocid="wizard.consent.submit_button"
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  {role === "guardian" ? "Continue" : "Get Started"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Guardian — link to student */}
          {step === 4 && role === "guardian" && (
            <motion.div key="step4" {...fadeSlide}>
              <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                Connect to your child
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                Enter your child&apos;s student code to link your account. You
                can also do this later.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="student-code">
                  Student Code{" "}
                  <span className="text-muted-foreground font-normal">
                    (e.g. STU-A3F2)
                  </span>
                </Label>
                <Input
                  id="student-code"
                  placeholder="STU-XXXX"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
                  data-ocid="wizard.student_code.input"
                />
                <p className="text-xs text-muted-foreground">
                  Your child can find their student code on their dashboard.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  data-ocid="wizard.link.back_button"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleGuardianLink}
                  data-ocid="wizard.link.submit_button"
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  {studentCode.trim() ? "Link & Get Started" : "Skip for Now"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
