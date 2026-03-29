import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@icp-sdk/core/principal";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  GraduationCap,
  Heart,
  Info,
  Link2,
  Loader2,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLinkGuardian } from "../hooks/useQueries";

export default function LinkGuardianPage() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const linkGuardian = useLinkGuardian();

  const [teacherId, setTeacherId] = useState("");
  const [parentId, setParentId] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [parentError, setParentError] = useState("");
  const [teacherLinked, setTeacherLinked] = useState(false);
  const [parentLinked, setParentLinked] = useState(false);
  const [bothLinked, setBothLinked] = useState(false);
  const [teacherPending, setTeacherPending] = useState(false);
  const [parentPending, setParentPending] = useState(false);
  const [copied, setCopied] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  const ensureStudentRegistered = async () => {
    try {
      let name = "";
      let email = "";
      try {
        const raw = localStorage.getItem("lumiProfile");
        if (raw) {
          const p = JSON.parse(raw);
          name = p.displayName || p.name || "";
        }
      } catch {
        /* ignore */
      }
      if (identity) {
        try {
          const profileRaw = localStorage.getItem(
            `lumiArcProfile_${identity.getPrincipal().toText()}`,
          );
          if (profileRaw) {
            const p = JSON.parse(profileRaw);
            name = name || p.name || "";
            email = p.email || "";
          }
        } catch {
          /* ignore */
        }
      }
      await actor?.createStudentProfile(name, email);
    } catch {
      /* may already exist */
    }
    // Also sync extended profile so teacher can see name/email
    try {
      if (actor) {
        let extName = "";
        let extEmail = "";
        let extAge = "";
        let extField = "";
        let extGoal = "";
        if (identity) {
          try {
            const profileRaw = localStorage.getItem(
              `lumiArcProfile_${identity.getPrincipal().toText()}`,
            );
            if (profileRaw) {
              const p = JSON.parse(profileRaw);
              extName = p.name || p.displayName || "";
              extEmail = p.email || "";
              extAge = p.age || "";
              extField = p.fieldOfStudy || "";
              extGoal = p.wellnessGoal || "";
            }
          } catch {
            /* ignore */
          }
        }
        if (!extName) {
          try {
            const raw = localStorage.getItem("lumiProfile");
            if (raw) {
              const p = JSON.parse(raw);
              extName = p.displayName || p.name || "";
            }
          } catch {
            /* ignore */
          }
        }
        await (actor as any).saveStudentExtendedProfile(
          extName,
          extEmail,
          extAge,
          extField,
          extGoal,
        );
      }
    } catch {
      /* ignore */
    }
  };

  const tryLinkBoth = async (tId: string, pId: string): Promise<boolean> => {
    try {
      const teacherPrincipal = Principal.fromText(tId.trim());
      const parentPrincipal = Principal.fromText(pId.trim());
      await ensureStudentRegistered();
      await linkGuardian.mutateAsync({
        teacherId: teacherPrincipal,
        parentId: parentPrincipal,
      });
      return true;
    } catch {
      return false;
    }
  };

  // Load stored IDs on mount and attempt silent re-link if both exist
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get("teacherInvite");
    let storedTeacher = localStorage.getItem("lumiLinkedTeacherId") ?? "";
    const storedParent = localStorage.getItem("lumiLinkedParentId") ?? "";

    if (invite) {
      try {
        const decoded = atob(invite);
        storedTeacher = decoded;
        setTeacherId(decoded);
        localStorage.setItem("lumiLinkedTeacherId", decoded);
        sessionStorage.removeItem("pendingTeacherInvite");
      } catch {
        // ignore invalid base64
        if (storedTeacher) setTeacherId(storedTeacher);
      }
    } else {
      if (storedTeacher) setTeacherId(storedTeacher);
      else {
        const pending = sessionStorage.getItem("pendingTeacherInvite");
        if (pending) setTeacherId(pending);
      }
    }

    if (storedParent) setParentId(storedParent);

    const teacherSaved = !!storedTeacher;
    const parentSaved = !!storedParent;

    if (teacherSaved) setTeacherLinked(true);
    if (parentSaved) setParentLinked(true);

    // Silently mark both linked on mount; backend re-sync happens on next submit
    if (teacherSaved && parentSaved) {
      setBothLinked(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = () => {
    if (myPrincipal) {
      navigator.clipboard.writeText(myPrincipal).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Principal ID copied!");
      });
    }
  };

  const handleLinkTeacher = async () => {
    setTeacherError("");
    const trimmed = teacherId.trim();
    if (!trimmed) {
      setTeacherError("Teacher Principal ID is required");
      return;
    }
    try {
      Principal.fromText(trimmed);
    } catch {
      setTeacherError("Invalid Principal ID format");
      return;
    }

    setTeacherPending(true);
    // Always save teacher ID immediately
    localStorage.setItem("lumiLinkedTeacherId", trimmed);
    setTeacherLinked(true);

    const storedParent = localStorage.getItem("lumiLinkedParentId");
    if (storedParent) {
      // Both IDs now available — call backend
      const ok = await tryLinkBoth(trimmed, storedParent);
      if (ok) {
        setBothLinked(true);
        toast.success(
          "Connected to teacher and parent! Your support network is set up. 🎉",
        );
      } else {
        toast.error(
          "Could not complete the backend link. Your IDs are saved — try again later.",
        );
      }
    } else {
      // Only teacher saved so far
      toast.info(
        "Teacher ID saved! Ask your parent to share their Principal ID and link them too to complete the connection.",
      );
    }
    setTeacherPending(false);
  };

  const handleLinkParent = async () => {
    setParentError("");
    const trimmed = parentId.trim();
    if (!trimmed) {
      setParentError("Parent Principal ID is required");
      return;
    }
    try {
      Principal.fromText(trimmed);
    } catch {
      setParentError("Invalid Principal ID format");
      return;
    }

    setParentPending(true);
    // Always save parent ID immediately
    localStorage.setItem("lumiLinkedParentId", trimmed);
    setParentLinked(true);

    const storedTeacher = localStorage.getItem("lumiLinkedTeacherId");
    if (storedTeacher) {
      // Both IDs now available — call backend
      const ok = await tryLinkBoth(storedTeacher, trimmed);
      if (ok) {
        setBothLinked(true);
        toast.success(
          "Connected to parent and teacher! Your support network is set up. 🎉",
        );
      } else {
        toast.error(
          "Could not complete the backend link. Your IDs are saved — try again later.",
        );
      }
    } else {
      // Only parent saved so far
      toast.info(
        "Parent ID saved! Ask your teacher to share their invite link and link them too to complete the connection.",
      );
    }
    setParentPending(false);
  };

  const onlyOneLinked =
    (teacherLinked && !parentLinked) || (!teacherLinked && parentLinked);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Link2 className="w-4 h-4" />
          Guardian Connection
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Link Your Guardian
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg">
          Connect your teacher and parent so they can track your mental
          wellbeing and provide timely support. You can link each one
          independently — no need to do both at once.
        </p>
      </motion.div>

      {/* Connection Complete Banner */}
      {bothLinked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex items-center gap-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-300 rounded-2xl px-5 py-4 text-teal-800"
          data-ocid="link-guardian.success_state"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0 text-teal-600" />
          <div>
            <p className="font-semibold text-sm">Connection Complete ✨</p>
            <p className="text-xs mt-0.5 text-teal-700">
              Your teacher and parent are both linked. They can now view your
              wellbeing dashboard and support you on your journey.
            </p>
          </div>
        </motion.div>
      )}

      {/* Partial Link Warning */}
      {onlyOneLinked && !bothLinked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-amber-800"
          data-ocid="link-guardian.partial_state"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-sm">Partial connection</p>
            <p className="text-xs mt-0.5 text-amber-700">
              {teacherLinked && !parentLinked
                ? "Teacher ID saved. Link your parent too to complete the connection."
                : "Parent ID saved. Link your teacher too to complete the connection."}
            </p>
          </div>
        </motion.div>
      )}

      {/* My Principal ID */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="rounded-2xl bg-gradient-to-br from-teal-50 to-sage-50 border-teal-200/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal-600" />
              Your Principal ID
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground mb-3">
              Share this ID with your teacher and parent so they can view your
              assessments.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white/70 border border-teal-200 rounded-lg px-3 py-2 text-xs font-mono truncate text-foreground">
                {myPrincipal || "Log in via Internet Identity to see your ID"}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!myPrincipal}
                className="rounded-lg h-9 border-teal-200 flex-shrink-0"
                data-ocid="guardian-link.copy_button"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="ml-1 text-xs">
                  {copied ? "Copied!" : "Copy"}
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex gap-3 bg-muted/60 rounded-xl p-4 mb-6 text-sm text-muted-foreground"
      >
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
        <p>
          Ask your teacher and parent to sign in to Lumi Arc, go to their
          profile section, and share their Principal ID with you. Link each one
          separately using the sections below.
        </p>
      </motion.div>

      <div className="flex flex-col gap-5">
        {/* Link to Teacher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                Link to Teacher
                {teacherLinked && (
                  <span className="ml-auto flex items-center gap-1 text-xs font-normal text-teal-600">
                    <CheckCircle className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Teacher&apos;s Principal ID
                </Label>
                <Input
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    if (teacherError) setTeacherError("");
                  }}
                  placeholder="e.g. abc12-def34-..."
                  className="h-11 rounded-xl"
                  data-ocid="link-guardian.teacher.input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your teacher can find their Principal ID in the Teacher
                  Dashboard profile section.
                </p>
                {teacherError && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="link-guardian.teacher_error"
                  >
                    {teacherError}
                  </p>
                )}
              </div>
              {teacherLinked && (
                <div
                  className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-sm text-teal-700"
                  data-ocid="link-guardian.teacher.success_state"
                >
                  <CheckCircle className="w-4 h-4" />
                  Teacher ID saved. You can update it by entering a new ID and
                  submitting.
                </div>
              )}
              <Button
                onClick={handleLinkTeacher}
                disabled={teacherPending}
                className="w-full h-11 rounded-xl bg-teal-600 hover:bg-teal-700 text-white"
                data-ocid="link-guardian.teacher.submit_button"
              >
                {teacherPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {teacherLinked ? "Update Teacher Link" : "Link to Teacher"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Link to Parent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Link to Parent / Guardian
                {parentLinked && (
                  <span className="ml-auto flex items-center gap-1 text-xs font-normal text-rose-600">
                    <CheckCircle className="w-3.5 h-3.5" /> Saved
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <Label className="text-sm font-medium mb-1.5 block">
                  Parent&apos;s Principal ID
                </Label>
                <Input
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);
                    if (parentError) setParentError("");
                  }}
                  placeholder="e.g. xyz89-ghi56-..."
                  className="h-11 rounded-xl"
                  data-ocid="link-guardian.parent.input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your parent/guardian can find their Principal ID in the
                  Guardian Dashboard profile section.
                </p>
                {parentError && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="link-guardian.parent_error"
                  >
                    {parentError}
                  </p>
                )}
              </div>
              {parentLinked && (
                <div
                  className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700"
                  data-ocid="link-guardian.parent.success_state"
                >
                  <CheckCircle className="w-4 h-4" />
                  Parent ID saved. You can update it by entering a new ID and
                  submitting.
                </div>
              )}
              <Button
                onClick={handleLinkParent}
                disabled={parentPending}
                className="w-full h-11 rounded-xl bg-rose-500 hover:bg-rose-600 text-white"
                data-ocid="link-guardian.parent.submit_button"
              >
                {parentPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    {parentLinked
                      ? "Update Parent Link"
                      : "Link to Parent / Guardian"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
