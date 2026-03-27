import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Fingerprint,
  GraduationCap,
  Heart,
  Shield,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const LOGO_SRC = "/assets/generated/lumi-arc-logo-transparent.dim_400x400.png";

type Role = "student" | "teacher" | "guardian";

const roleConfig: Record<
  Role,
  {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    gradient: string;
    cardBg: string;
    btnClass: string;
    accentColor: string;
    consentText: string;
    dashboardPath: string;
  }
> = {
  student: {
    title: "Student Portal",
    subtitle: "Your personal wellness sanctuary",
    icon: GraduationCap,
    gradient: "from-teal-50 via-cyan-50 to-emerald-50",
    cardBg: "bg-white/80 border-teal-200",
    btnClass:
      "bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-200",
    accentColor: "text-teal-700",
    consentText:
      "I choose to show up for myself, one day at a time. By entering this space, I commit to nurturing my emotional well-being and welcome the support of my parent and mentor teacher on this journey.",
    dashboardPath: "/dashboard",
  },
  teacher: {
    title: "Teacher Portal",
    subtitle: "Guide and support your mentee students",
    icon: Users,
    gradient: "from-sage-50 via-green-50 to-emerald-50",
    cardBg: "bg-white/80 border-sage-200",
    btnClass:
      "bg-sage-600 hover:bg-sage-700 text-white shadow-lg shadow-green-200",
    accentColor: "text-sage-700",
    consentText:
      "I am here to guide and support the students in my care. By entering this space, I commit to using this platform responsibly to foster the emotional wellness of my mentees.",
    dashboardPath: "/teacher-dashboard",
  },
  guardian: {
    title: "Guardian Portal",
    subtitle: "Stay close to your child's inner world",
    icon: Heart,
    gradient: "from-rose-50 via-pink-50 to-fuchsia-50",
    cardBg: "bg-white/80 border-rose-200",
    btnClass:
      "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200",
    accentColor: "text-rose-700",
    consentText:
      "I believe in being present for my child's inner world. By joining this platform, I agree to gently support their mental wellness journey and stay connected with their growth.",
    dashboardPath: "/guardian-dashboard",
  },
};

export default function RoleLoginPage() {
  const { role } = useParams({ strict: false }) as { role: string };
  const navigate = useNavigate();
  const { setUserRole } = useAppContext();
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const [phase, setPhase] = useState<"login" | "consent">("login");

  const safeRole = (role in roleConfig ? role : "student") as Role;
  const userRoleMapped = (
    safeRole === "guardian" ? "parent" : safeRole
  ) as import("../context/AppContext").UserRole;
  const config = roleConfig[safeRole];
  const consentKey = `lumiArc_consent_${safeRole}`;

  useEffect(() => {
    if (!identity) return;
    const principal = identity.getPrincipal();
    if (principal.isAnonymous()) return;

    const consentGiven = localStorage.getItem(consentKey) === "true";
    if (consentGiven) {
      setUserRole(userRoleMapped);
      navigate({ to: config.dashboardPath });
    } else {
      setPhase("consent");
    }
  }, [
    identity,
    consentKey,
    config.dashboardPath,
    navigate,
    userRoleMapped,
    setUserRole,
  ]);

  const handleAcceptConsent = () => {
    localStorage.setItem(consentKey, "true");
    setUserRole(userRoleMapped);
    navigate({ to: config.dashboardPath });
  };

  const Icon = config.icon;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-white/30 blur-3xl" />
      </div>

      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate({ to: "/" })}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        data-ocid="rolelogin.back_button"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </button>

      <AnimatePresence mode="wait">
        {phase === "login" ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`w-full max-w-sm backdrop-blur-sm rounded-3xl border shadow-xl p-8 ${config.cardBg}`}
          >
            {/* Logo + Role Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <img
                  src={LOGO_SRC}
                  alt="Lumi Arc"
                  className="w-20 h-20 object-contain drop-shadow"
                />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-border/40">
                  <Icon className={`w-4 h-4 ${config.accentColor}`} />
                </div>
              </div>
              <h1
                className={`font-display text-2xl font-bold ${config.accentColor}`}
              >
                {config.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                {config.subtitle}
              </p>
            </div>

            {/* Login button */}
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className={`w-full h-12 rounded-xl font-semibold text-base mb-4 ${config.btnClass}`}
              data-ocid="rolelogin.primary_button"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5" />
                  Login with Internet Identity
                </span>
              )}
            </Button>

            {/* Info note */}
            <div className="flex items-start gap-2.5 bg-muted/50 rounded-xl p-3">
              <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lumi Arc uses{" "}
                <span className="font-medium text-foreground">
                  Internet Identity
                </span>{" "}
                — a secure, password-free login. Use Face ID, fingerprint, or a
                passkey on your device.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="consent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`w-full max-w-md backdrop-blur-sm rounded-3xl border shadow-xl p-8 ${config.cardBg}`}
          >
            <div className="flex flex-col items-center mb-6">
              <img
                src={LOGO_SRC}
                alt="Lumi Arc"
                className="w-16 h-16 object-contain mb-3"
              />
              <h2
                className={`font-display text-xl font-bold ${config.accentColor}`}
              >
                A moment before you begin
              </h2>
            </div>

            {/* Consent quote */}
            <div className="bg-muted/40 rounded-2xl p-5 mb-6 border border-border/30">
              <div className={`text-2xl mb-3 ${config.accentColor}`}>“</div>
              <p className="text-foreground leading-relaxed italic text-sm">
                {config.consentText}
              </p>
              <div className={`text-2xl text-right mt-2 ${config.accentColor}`}>
                ”
              </div>
            </div>

            <Button
              onClick={handleAcceptConsent}
              className={`w-full h-12 rounded-xl font-semibold text-base ${config.btnClass}`}
              data-ocid="rolelogin.confirm_button"
            >
              <CheckCircle className="w-5 h-5 mr-2" />I Accept &amp; Continue
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              This consent is saved on this device. You won’t be asked again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
