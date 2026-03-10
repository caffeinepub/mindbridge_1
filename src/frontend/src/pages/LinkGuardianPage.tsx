import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Principal } from "@icp-sdk/core/principal";
import {
  CheckCircle,
  Copy,
  GraduationCap,
  Heart,
  Info,
  Link2,
  Loader2,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLinkGuardian } from "../hooks/useQueries";

export default function LinkGuardianPage() {
  const { identity } = useInternetIdentity();
  const linkGuardian = useLinkGuardian();

  const [teacherId, setTeacherId] = useState("");
  const [parentId, setParentId] = useState("");
  const [errors, setErrors] = useState<{ teacher?: string; parent?: string }>(
    {},
  );
  const [linked, setLinked] = useState(false);
  const [copied, setCopied] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString() ?? "";

  const handleCopy = () => {
    if (myPrincipal) {
      navigator.clipboard.writeText(myPrincipal).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Principal ID copied!");
      });
    }
  };

  const validate = () => {
    const errs: { teacher?: string; parent?: string } = {};
    if (!teacherId.trim()) {
      errs.teacher = "Teacher Principal ID is required";
    } else {
      try {
        Principal.fromText(teacherId.trim());
      } catch {
        errs.teacher = "Invalid Principal ID format";
      }
    }
    if (!parentId.trim()) {
      errs.parent = "Parent Principal ID is required";
    } else {
      try {
        Principal.fromText(parentId.trim());
      } catch {
        errs.parent = "Invalid Principal ID format";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await linkGuardian.mutateAsync({
        teacherId: Principal.fromText(teacherId.trim()),
        parentId: Principal.fromText(parentId.trim()),
      });
      setLinked(true);
      toast.success("Guardians linked successfully!");
    } catch {
      toast.error(
        "Could not link guardians. Please check the Principal IDs and try again.",
      );
    }
  };

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
          wellbeing and provide timely support. You stay in control.
        </p>
      </motion.div>

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
                {myPrincipal || "Loading..."}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
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
          Ask your teacher and parent to sign in to Lumi Arc, create a profile,
          and share their Principal ID with you. Then enter their IDs below.
        </p>
      </motion.div>

      {/* Link Form */}
      {!linked ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {/* Teacher */}
              <div>
                <Label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sage-600" />
                  Teacher's Principal ID
                </Label>
                <Input
                  value={teacherId}
                  onChange={(e) => {
                    setTeacherId(e.target.value);
                    if (errors.teacher)
                      setErrors((p) => ({ ...p, teacher: undefined }));
                  }}
                  placeholder="e.g. abc12-def34-..."
                  className="h-11 rounded-xl"
                  data-ocid="link-guardian.teacher.input"
                />
                {errors.teacher && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="link-guardian.teacher_error"
                  >
                    {errors.teacher}
                  </p>
                )}
              </div>

              {/* Parent */}
              <div>
                <Label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Parent's Principal ID
                </Label>
                <Input
                  value={parentId}
                  onChange={(e) => {
                    setParentId(e.target.value);
                    if (errors.parent)
                      setErrors((p) => ({ ...p, parent: undefined }));
                  }}
                  placeholder="e.g. xyz89-ghi56-..."
                  className="h-11 rounded-xl"
                  data-ocid="link-guardian.parent.input"
                />
                {errors.parent && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="link-guardian.parent_error"
                  >
                    {errors.parent}
                  </p>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={linkGuardian.isPending}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground shadow-teal mt-2"
                data-ocid="link-guardian.submit_button"
              >
                {linkGuardian.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Linking...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Link Guardians
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center shadow-md"
          data-ocid="link-guardian.success_state"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-7 h-7 text-teal-600" />
          </motion.div>
          <h2 className="font-display text-2xl font-bold mb-2">
            Guardians Linked!
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Your teacher and parent can now view your mental health assessment
            history. You're not alone in this journey.
          </p>
        </motion.div>
      )}
    </div>
  );
}
