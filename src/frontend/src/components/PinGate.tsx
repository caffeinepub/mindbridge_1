import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Lock, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  teacher: { pin: "lumiArc_teacherPin", session: "lumiArc_teacherUnlocked" },
  guardian: { pin: "lumiArc_guardianPin", session: "lumiArc_guardianUnlocked" },
  student: { pin: "lumiArc_studentPin", session: "lumiArc_studentUnlocked" },
} as const;

const DEFAULT_PINS = {
  teacher: "2468",
  guardian: "1357",
  student: "1234",
} as const;

type UserRole = "teacher" | "guardian" | "student";

function getStoredPin(userRole: UserRole): string {
  return (
    localStorage.getItem(STORAGE_KEYS[userRole].pin) ?? DEFAULT_PINS[userRole]
  );
}

function isSessionUnlocked(userRole: UserRole): boolean {
  return sessionStorage.getItem(STORAGE_KEYS[userRole].session) === "true";
}

function setSessionUnlocked(userRole: UserRole): void {
  sessionStorage.setItem(STORAGE_KEYS[userRole].session, "true");
}

function getRoleLabel(userRole: UserRole): string {
  if (userRole === "teacher") return "Teacher";
  if (userRole === "guardian") return "Guardian";
  return "Student";
}

// ── ChangePinDialog ──────────────────────────────────────────────────────────

export function ChangePinDialog({ userRole }: { userRole: UserRole }) {
  const [open, setOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const accent =
    userRole === "teacher"
      ? "text-teal-600"
      : userRole === "guardian"
        ? "text-rose-600"
        : "text-violet-600";

  const btnClass =
    userRole === "teacher"
      ? "bg-teal-600 hover:bg-teal-700 text-white"
      : userRole === "guardian"
        ? "bg-rose-500 hover:bg-rose-600 text-white"
        : "bg-violet-600 hover:bg-violet-700 text-white";

  const handleSave = useCallback(() => {
    const stored = getStoredPin(userRole);
    if (currentPin !== stored) {
      setError("Current PIN is incorrect.");
      return;
    }
    if (newPin.length < 4) {
      setError("New PIN must be 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setError("New PINs do not match.");
      return;
    }
    localStorage.setItem(STORAGE_KEYS[userRole].pin, newPin);
    toast.success("PIN updated successfully!");
    setOpen(false);
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setError("");
  }, [userRole, currentPin, newPin, confirmPin]);

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) {
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          data-ocid="pin_gate.change_pin_button"
        >
          <Lock className="w-3.5 h-3.5" />
          Change PIN
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${accent}`}>
            <Lock className="w-4 h-4" />
            Change {getRoleLabel(userRole)} PIN
          </DialogTitle>
          <DialogDescription>
            Enter your current PIN, then choose a new 4-digit PIN.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current PIN</Label>
            <InputOTP
              maxLength={4}
              value={currentPin}
              onChange={setCurrentPin}
              pattern={REGEXP_ONLY_DIGITS}
              data-ocid="pin_gate.current_pin_input"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">New PIN</Label>
            <InputOTP
              maxLength={4}
              value={newPin}
              onChange={setNewPin}
              pattern={REGEXP_ONLY_DIGITS}
              data-ocid="pin_gate.new_pin_input"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Confirm New PIN</Label>
            <InputOTP
              maxLength={4}
              value={confirmPin}
              onChange={setConfirmPin}
              pattern={REGEXP_ONLY_DIGITS}
              data-ocid="pin_gate.confirm_pin_input"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive font-medium"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            data-ocid="pin_gate.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              currentPin.length < 4 ||
              newPin.length < 4 ||
              confirmPin.length < 4
            }
            data-ocid="pin_gate.save_pin_button"
            className={btnClass}
          >
            Save PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── PinGate ──────────────────────────────────────────────────────────────────

export default function PinGate({
  userRole,
  children,
}: {
  userRole: UserRole;
  children: React.ReactNode;
}) {
  const [unlocked, setUnlocked] = useState(() => isSessionUnlocked(userRole));
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const shakeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const accentBg =
    userRole === "teacher"
      ? "bg-teal-600 hover:bg-teal-700"
      : userRole === "guardian"
        ? "bg-rose-500 hover:bg-rose-600"
        : "bg-violet-600 hover:bg-violet-700";

  const accentText =
    userRole === "teacher"
      ? "text-teal-600"
      : userRole === "guardian"
        ? "text-rose-500"
        : "text-violet-600";

  const accentBorder =
    userRole === "teacher"
      ? "border-teal-300"
      : userRole === "guardian"
        ? "border-rose-300"
        : "border-violet-300";

  const blob1 =
    userRole === "teacher"
      ? "bg-teal-300"
      : userRole === "guardian"
        ? "bg-rose-300"
        : "bg-violet-300";

  const blob2 =
    userRole === "teacher"
      ? "bg-cyan-200"
      : userRole === "guardian"
        ? "bg-pink-200"
        : "bg-purple-200";

  const iconBg =
    userRole === "teacher"
      ? "bg-teal-50"
      : userRole === "guardian"
        ? "bg-rose-50"
        : "bg-violet-50";

  const handleUnlock = useCallback(() => {
    const stored = getStoredPin(userRole);
    if (pin === stored) {
      setSessionUnlocked(userRole);
      setUnlocked(true);
    } else {
      setError("Incorrect PIN. Try again.");
      setPin("");
      setShake(true);
      if (shakeTimeout.current) clearTimeout(shakeTimeout.current);
      shakeTimeout.current = setTimeout(() => setShake(false), 600);
    }
  }, [pin, userRole]);

  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Soft background blobs */}
      <div
        className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${blob1}`}
        style={{ transform: "translate(-30%, -30%)" }}
      />
      <div
        className={`absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${blob2}`}
        style={{ transform: "translate(30%, 30%)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`relative z-10 bg-card border ${accentBorder} rounded-2xl shadow-xl max-w-sm w-full p-8 flex flex-col items-center gap-6`}
      >
        {/* Logo + icon */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/assets/generated/lumi-arc-logo-transparent.dim_400x400.png"
            alt="Lumi Arc"
            className="w-16 h-16 object-contain"
          />
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}
          >
            <ShieldCheck className={`w-6 h-6 ${accentText}`} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {getRoleLabel(userRole)} Access
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter your PIN to continue
          </p>
        </div>

        {/* OTP Input */}
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
          data-ocid="pin_gate.input"
        >
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(val) => {
              setPin(val);
              setError("");
            }}
            onComplete={handleUnlock}
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
            </InputOTPGroup>
          </InputOTP>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-destructive font-medium text-center -mt-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          onClick={handleUnlock}
          disabled={pin.length < 4}
          className={`w-full ${accentBg} text-white font-semibold rounded-xl py-2.5`}
          data-ocid="pin_gate.submit_button"
        >
          Unlock
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          First time? Default PIN:{" "}
          <span className="font-mono font-semibold">
            {DEFAULT_PINS[userRole]}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
