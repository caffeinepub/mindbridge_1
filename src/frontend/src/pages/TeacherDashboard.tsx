import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Dumbbell,
  Flame,
  Moon,
  Pencil,
  Plus,
  Smile,
  Trash2,
  TreePine,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  ALL_BADGES,
  type MoodValue,
  type StudentRecord,
} from "../data/teacherSampleData";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Principal } from "@icp-sdk/core/principal";
import { Copy, Link2, Mail, RefreshCw, User } from "lucide-react";
import { Loader2, SmilePlus } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { DASS21Assessment } from "../backend.d";
import PinGate, { ChangePinDialog } from "../components/PinGate";
import { useAppContext } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { generateTeacherInviteLink } from "../hooks/useProfile";
import { useGetTeacherStudentsWithProfiles } from "../hooks/useQueries";
import { useGetStudentAssessments } from "../hooks/useQueries";
import {
  type TeacherStudentEntry,
  TeacherStudentsContext,
  useTeacherStudents,
  useTeacherStudentsProvider,
} from "../hooks/useTeacherStudents";
import { useUserProfile } from "../hooks/useUserProfile";
import {
  formatSeverityLabel,
  getSocialIsolationRisk,
  severityBgClass,
} from "../utils/scoring";

// ── Mood helpers ──────────────────────────────────────────────────────────────

const MOOD_CONFIG: Record<
  MoodValue,
  { label: string; color: string; bar: string; emoji: string }
> = {
  "Very Happy": {
    label: "Very Happy",
    color: "bg-teal-100 text-teal-700",
    bar: "bg-teal-400",
    emoji: "😄",
  },
  Happy: {
    label: "Happy",
    color: "bg-green-100 text-green-700",
    bar: "bg-green-400",
    emoji: "🙂",
  },
  Neutral: {
    label: "Neutral",
    color: "bg-amber-100 text-amber-700",
    bar: "bg-amber-400",
    emoji: "😐",
  },
  Sad: {
    label: "Sad",
    color: "bg-orange-100 text-orange-700",
    bar: "bg-orange-400",
    emoji: "😕",
  },
  "Very Sad": {
    label: "Very Sad",
    color: "bg-red-100 text-red-700",
    bar: "bg-red-400",
    emoji: "😢",
  },
};

const MOOD_SCORE: Record<MoodValue, number> = {
  "Very Happy": 5,
  Happy: 4,
  Neutral: 3,
  Sad: 2,
  "Very Sad": 1,
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  Normal: { label: "Normal", color: "bg-teal-100 text-teal-700" },
  Mild: { label: "Mild", color: "bg-amber-100 text-amber-700" },
  Moderate: { label: "Moderate", color: "bg-orange-100 text-orange-700" },
  Severe: { label: "Severe", color: "bg-red-100 text-red-700" },
  "Extremely Severe": {
    label: "Extremely Severe",
    color: "bg-red-200 text-red-800",
  },
};

function SeverityBadge({ severity }: { severity: string }) {
  const cfg = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.Normal;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.color}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Add Student Form ──────────────────────────────────────────────────────────

interface AddStudentFormProps {
  onAdd: (entry: Omit<TeacherStudentEntry, "id">) => void;
  onCancel: () => void;
}

function AddStudentForm({ onAdd, onCancel }: AddStudentFormProps) {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentFieldOfStudy, setStudentFieldOfStudy] = useState("");
  const [studentPrincipalId, setStudentPrincipalId] = useState("");
  const [guardianPrincipalId, setGuardianPrincipalId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!studentName.trim()) e.studentName = "Student name is required";
    if (!guardianName.trim()) e.guardianName = "Guardian name is required";
    if (!guardianEmail.trim()) e.guardianEmail = "Guardian email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(guardianEmail.trim()))
      e.guardianEmail = "Please enter a valid email";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAdd({
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || undefined,
      studentPhone: studentPhone.trim() || undefined,
      studentFieldOfStudy: studentFieldOfStudy.trim() || undefined,
      studentPrincipalId: studentPrincipalId.trim() || undefined,
      guardianName: guardianName.trim(),
      guardianEmail: guardianEmail.trim(),
      guardianPhone: guardianPhone.trim() || undefined,
      guardianPrincipalId: guardianPrincipalId.trim() || undefined,
    });
  }

  const inputCls =
    "w-full border border-teal-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400";

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onSubmit={handleSubmit}
      className="bg-teal-50 border border-teal-200 rounded-2xl p-5 space-y-4"
      data-ocid="teacher.add_student.panel"
    >
      <h4 className="font-semibold text-foreground text-sm">
        Add Student &amp; Guardian Details
      </h4>
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Student Name */}
        <div>
          <label
            htmlFor="add-student-name"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            id="add-student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            data-ocid="teacher.student_name.input"
            className={inputCls}
          />
          {errors.studentName && (
            <p
              className="text-xs text-red-500 mt-1"
              data-ocid="teacher.student_name.error_state"
            >
              {errors.studentName}
            </p>
          )}
        </div>
        {/* Student Email */}
        <div>
          <label
            htmlFor="add-student-email"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Email{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="add-student-email"
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="student@university.edu"
            data-ocid="teacher.student_email.input"
            className={inputCls}
          />
        </div>
        {/* Guardian Name */}
        <div>
          <label
            htmlFor="add-guardian-name"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian / Parent Name <span className="text-red-500">*</span>
          </label>
          <input
            id="add-guardian-name"
            type="text"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            placeholder="e.g. Meena Sharma"
            data-ocid="teacher.guardian_name.input"
            className={inputCls}
          />
          {errors.guardianName && (
            <p
              className="text-xs text-red-500 mt-1"
              data-ocid="teacher.guardian_name.error_state"
            >
              {errors.guardianName}
            </p>
          )}
        </div>
        {/* Guardian Email */}
        <div>
          <label
            htmlFor="add-guardian-email"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian Email <span className="text-red-500">*</span>
          </label>
          <input
            id="add-guardian-email"
            type="email"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
            placeholder="parent@email.com"
            data-ocid="teacher.guardian_email.input"
            className={inputCls}
          />
          {errors.guardianEmail && (
            <p
              className="text-xs text-red-500 mt-1"
              data-ocid="teacher.guardian_email.error_state"
            >
              {errors.guardianEmail}
            </p>
          )}
        </div>
        {/* Guardian Phone */}
        <div className="sm:col-span-2">
          <label
            htmlFor="add-guardian-phone"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian Phone{" "}
            <span className="text-muted-foreground">
              (optional — helps with direct contact)
            </span>
          </label>
          <input
            id="add-guardian-phone"
            type="tel"
            value={guardianPhone}
            onChange={(e) => setGuardianPhone(e.target.value)}
            placeholder="+91 98765 43210"
            data-ocid="teacher.guardian_phone.input"
            className={inputCls}
          />
        </div>
        {/* Student Phone */}
        <div>
          <label
            htmlFor="add-student-phone"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Phone (optional)
          </label>
          <input
            id="add-student-phone"
            type="tel"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            placeholder="+91 98765 43210"
            data-ocid="teacher.student_phone.input"
            className={inputCls}
          />
        </div>
        {/* Field of Study */}
        <div>
          <label
            htmlFor="add-student-fos"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Field of Study (optional)
          </label>
          <input
            id="add-student-fos"
            type="text"
            value={studentFieldOfStudy}
            onChange={(e) => setStudentFieldOfStudy(e.target.value)}
            placeholder="e.g. Computer Science"
            data-ocid="teacher.student_field.input"
            className={inputCls}
          />
        </div>
        {/* Student Principal ID */}
        <div>
          <label
            htmlFor="add-student-pid"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Principal ID (optional)
          </label>
          <input
            id="add-student-pid"
            type="text"
            value={studentPrincipalId}
            onChange={(e) => setStudentPrincipalId(e.target.value)}
            placeholder="Paste from student's profile page"
            data-ocid="teacher.student_principal.input"
            className={inputCls}
          />
        </div>
        {/* Parent Principal ID */}
        <div>
          <label
            htmlFor="add-parent-pid"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Parent/Guardian Principal ID (optional)
          </label>
          <input
            id="add-parent-pid"
            type="text"
            value={guardianPrincipalId}
            onChange={(e) => setGuardianPrincipalId(e.target.value)}
            placeholder="Paste from guardian's profile page"
            data-ocid="teacher.guardian_principal.input"
            className={inputCls}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          data-ocid="teacher.add_student.submit_button"
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Add Student
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-ocid="teacher.add_student.cancel_button"
          className="border border-teal-200 text-teal-700 hover:bg-teal-100 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

// ── Edit Student Form ────────────────────────────────────────────────────────

interface EditStudentFormProps {
  initial: TeacherStudentEntry;
  onSave: (entry: Omit<TeacherStudentEntry, "id">) => void;
  onCancel: () => void;
}

function EditStudentForm({ initial, onSave, onCancel }: EditStudentFormProps) {
  const [studentName, setStudentName] = useState(initial.studentName);
  const [studentEmail, setStudentEmail] = useState(initial.studentEmail ?? "");
  const [studentPhone, setStudentPhone] = useState(initial.studentPhone ?? "");
  const [studentFieldOfStudy, setStudentFieldOfStudy] = useState(
    initial.studentFieldOfStudy ?? "",
  );
  const [studentPrincipalId, setStudentPrincipalId] = useState(
    initial.studentPrincipalId ?? "",
  );
  const [guardianName, setGuardianName] = useState(initial.guardianName);
  const [guardianEmail, setGuardianEmail] = useState(initial.guardianEmail);
  const [guardianPhone, setGuardianPhone] = useState(
    initial.guardianPhone ?? "",
  );
  const [guardianPrincipalId, setGuardianPrincipalId] = useState(
    initial.guardianPrincipalId ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!studentName.trim()) e.studentName = "Student name is required";
    if (!guardianName.trim()) e.guardianName = "Guardian name is required";
    if (!guardianEmail.trim()) e.guardianEmail = "Guardian email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(guardianEmail.trim()))
      e.guardianEmail = "Please enter a valid email";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave({
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim() || undefined,
      studentPhone: studentPhone.trim() || undefined,
      studentFieldOfStudy: studentFieldOfStudy.trim() || undefined,
      studentPrincipalId: studentPrincipalId.trim() || undefined,
      guardianName: guardianName.trim(),
      guardianEmail: guardianEmail.trim(),
      guardianPhone: guardianPhone.trim() || undefined,
      guardianPrincipalId: guardianPrincipalId.trim() || undefined,
    });
  }

  const inputCls =
    "w-full border border-teal-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-400";

  return (
    <motion.form
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onSubmit={handleSubmit}
      className="bg-teal-50/60 rounded-xl p-4 space-y-3"
      data-ocid="teacher.edit_student.panel"
    >
      <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
        Edit Student Details
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="edit-student-name"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className={inputCls}
            id="edit-student-name"
            data-ocid="teacher.edit_student_name.input"
          />
          {errors.studentName && (
            <p className="text-xs text-red-500 mt-1">{errors.studentName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="edit-student-email"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Email
          </label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className={inputCls}
            id="edit-student-email"
            data-ocid="teacher.edit_student_email.input"
          />
        </div>
        <div>
          <label
            htmlFor="edit-student-phone"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Phone
          </label>
          <input
            type="tel"
            value={studentPhone}
            onChange={(e) => setStudentPhone(e.target.value)}
            className={inputCls}
            id="edit-student-phone"
            data-ocid="teacher.edit_student_phone.input"
          />
        </div>
        <div>
          <label
            htmlFor="edit-student-field"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Field of Study
          </label>
          <input
            type="text"
            value={studentFieldOfStudy}
            onChange={(e) => setStudentFieldOfStudy(e.target.value)}
            className={inputCls}
            id="edit-student-field"
            data-ocid="teacher.edit_student_field.input"
          />
        </div>
        <div>
          <label
            htmlFor="edit-student-principal"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Student Principal ID
          </label>
          <input
            type="text"
            value={studentPrincipalId}
            onChange={(e) => setStudentPrincipalId(e.target.value)}
            className={inputCls}
            id="edit-student-principal"
            data-ocid="teacher.edit_student_principal.input"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label
            htmlFor="edit-guardian-name"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            className={inputCls}
            id="edit-guardian-name"
            data-ocid="teacher.edit_guardian_name.input"
          />
          {errors.guardianName && (
            <p className="text-xs text-red-500 mt-1">{errors.guardianName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="edit-guardian-email"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
            className={inputCls}
            id="edit-guardian-email"
            data-ocid="teacher.edit_guardian_email.input"
          />
          {errors.guardianEmail && (
            <p className="text-xs text-red-500 mt-1">{errors.guardianEmail}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="edit-guardian-phone"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian Phone
          </label>
          <input
            type="tel"
            value={guardianPhone}
            onChange={(e) => setGuardianPhone(e.target.value)}
            className={inputCls}
            id="edit-guardian-phone"
            data-ocid="teacher.edit_guardian_phone.input"
          />
        </div>
        <div>
          <label
            htmlFor="edit-guardian-principal"
            className="block text-xs font-medium text-foreground mb-1"
          >
            Guardian Principal ID
          </label>
          <input
            type="text"
            value={guardianPrincipalId}
            onChange={(e) => setGuardianPrincipalId(e.target.value)}
            className={inputCls}
            id="edit-guardian-principal"
            data-ocid="teacher.edit_guardian_principal.input"
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          data-ocid="teacher.edit_student.save_button"
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          data-ocid="teacher.edit_student.cancel_button"
          className="border border-border text-sm font-medium px-4 py-2 rounded-xl hover:bg-muted/30 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

// ── My Students Section ───────────────────────────────────────────────────────

function MyStudentsSection({
  onSelectBackendStudent,
  onSelectManualStudent,
}: {
  onSelectBackendStudent?: (p: Principal, name: string, email: string) => void;
  onSelectManualStudent?: (s: TeacherStudentEntry) => void;
}) {
  const { data: backendStudents = [], isFetching } =
    useGetTeacherStudentsWithProfiles();
  const { students, addStudent, removeStudent, updateStudent } =
    useTeacherStudents();
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { actor } = useActor();

  async function handleUnlinkBackendStudent(principal: Principal) {
    if (!actor) return;
    try {
      await (actor as any).removeStudentLink(principal);
    } catch (_) {
      // ignore if method not available
    }
    queryClient.invalidateQueries({
      queryKey: ["teacherStudentsWithProfiles"],
    });
    toast.success(
      "Student unlinked. They will need to re-link to appear again.",
    );
  }

  function handleRefresh() {
    queryClient.invalidateQueries({
      queryKey: ["teacherStudentsWithProfiles"],
    });
    queryClient.invalidateQueries({ queryKey: ["teacherStudents"] });
  }

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            My Students
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Student and guardian contact directory
            {isFetching && (
              <span className="ml-2 text-teal-600 text-xs">Refreshing…</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            data-ocid="teacher.students.button"
            className="inline-flex items-center gap-1.5 border border-teal-200 text-teal-700 hover:bg-teal-50 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
            title="Refresh student list"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            data-ocid="teacher.add_student.button"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <AddStudentForm
            onAdd={(entry) => {
              addStudent(entry);
              setShowForm(false);
              toast.success(`${entry.studentName} added to your student list.`);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {/* Backend-linked students (via Principal ID invite link) */}
      {backendStudents.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-teal-700 mb-2 uppercase tracking-wide">
            Linked via Invite
          </p>
          <div className="space-y-3">
            {backendStudents.map(([principal, name, email], idx) => {
              const displayName = name || "Student";
              const displayEmail = email;
              const shortId = `${principal.toString().slice(0, 16)}…`;
              return (
                <div
                  key={principal.toString()}
                  data-ocid={`teacher.backend_student.item.${idx + 1}`}
                  className="bg-teal-50/70 border border-teal-200/60 rounded-2xl px-4 py-4 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-teal-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground">
                        {displayName}
                      </p>
                      {displayEmail && (
                        <p className="text-xs text-muted-foreground">
                          {displayEmail}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(principal.toString());
                        toast.success("Principal ID copied!");
                      }}
                      className="text-teal-500 hover:text-teal-700 transition-colors"
                      title="Copy Principal ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUnlinkBackendStudent(principal)}
                      data-ocid={`teacher.backend_student.delete_button.${idx + 1}`}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Unlink student"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono pl-11">
                    {shortId}
                  </p>
                  {onSelectBackendStudent && (
                    <div className="pl-11">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectBackendStudent(
                            principal,
                            displayName,
                            displayEmail || "",
                          )
                        }
                        data-ocid={`teacher.backend_student.view_button.${idx + 1}`}
                        className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        View Details →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {students.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="teacher.students.empty_state"
          className="flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed border-border/60 bg-muted/20 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-teal-400" />
          </div>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            No students added yet. Use the button above to add your mentee
            students and their guardian contact details.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3" data-ocid="teacher.students.list">
          {students.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ delay: idx * 0.04 }}
              data-ocid={`teacher.students.item.${idx + 1}`}
              className="bg-card border border-border/50 rounded-2xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Student info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-teal-700" />
                    </div>
                    <span className="font-semibold text-foreground text-sm truncate">
                      {s.studentName}
                    </span>
                  </div>
                  {s.studentEmail && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-9">
                      <Mail className="w-3 h-3" />
                      <a
                        href={`mailto:${s.studentEmail}`}
                        className="hover:text-foreground transition-colors"
                      >
                        {s.studentEmail}
                      </a>
                    </div>
                  )}
                  {s.studentPhone && (
                    <p className="text-xs text-muted-foreground ml-9">
                      📞 {s.studentPhone}
                    </p>
                  )}
                  {s.studentFieldOfStudy && (
                    <p className="text-xs text-muted-foreground ml-9">
                      📚 {s.studentFieldOfStudy}
                    </p>
                  )}
                  {s.studentPrincipalId && (
                    <p className="text-xs text-muted-foreground font-mono ml-9 truncate">
                      🪪 Student ID: {s.studentPrincipalId.slice(0, 20)}…
                    </p>
                  )}
                </div>

                {/* Guardian info */}
                <div className="flex-1 min-w-0 bg-teal-50/60 rounded-xl px-3 py-2">
                  <p className="text-xs font-semibold text-teal-700 mb-1">
                    Guardian / Parent
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {s.guardianName}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <Mail className="w-3 h-3" />
                    <a
                      href={`mailto:${s.guardianEmail}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {s.guardianEmail}
                    </a>
                  </div>
                  {s.guardianPhone && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      📞 {s.guardianPhone}
                    </p>
                  )}
                  {s.guardianPrincipalId && (
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                      🪪 {s.guardianPrincipalId.slice(0, 20)}…
                    </p>
                  )}
                </div>

                {/* Edit / Delete */}
                <div className="flex items-center gap-1 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setEditingStudentId(s.id)}
                    data-ocid={`teacher.students.edit_button.${idx + 1}`}
                    className="text-muted-foreground hover:text-teal-600 transition-colors p-1.5 rounded-lg hover:bg-teal-50"
                    title="Edit student"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      removeStudent(s.id);
                      toast.success("Student removed.");
                    }}
                    data-ocid={`teacher.students.delete_button.${idx + 1}`}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                    title="Remove student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {onSelectManualStudent && (
                <div className="mt-2 pt-2 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => onSelectManualStudent(s)}
                    data-ocid={`teacher.students.view_progress.${idx + 1}`}
                    className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Click to view student progress →
                  </button>
                </div>
              )}
              {/* Inline edit form */}
              {editingStudentId === s.id && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <EditStudentForm
                    initial={s}
                    onSave={(entry) => {
                      updateStudent(s.id, entry);
                      setEditingStudentId(null);
                      toast.success(`${entry.studentName}'s details updated.`);
                    }}
                    onCancel={() => setEditingStudentId(null)}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Backend Student Data Helpers ──────────────────────────────────────────────

const MOOD_LABELS_T: Record<number, string> = {
  1: "Very Sad",
  2: "Sad",
  3: "Okay",
  4: "Happy",
  5: "Very Happy",
};

const MOOD_STRING_TO_NUMBER_T: Record<string, number> = {
  "very-sad": 1,
  sad: 2,
  okay: 3,
  happy: 4,
  "very-happy": 5,
};

const MOOD_BAR_COLORS_T: Record<number, string> = {
  0: "oklch(0.88 0.01 195)",
  1: "oklch(0.55 0.14 260)",
  2: "oklch(0.62 0.13 230)",
  3: "oklch(0.65 0.14 195)",
  4: "oklch(0.62 0.16 170)",
  5: "oklch(0.58 0.18 155)",
};

const XP_LEVELS_T = [
  { min: 0, max: 49, label: "Seeker", emoji: "🌱" },
  { min: 50, max: 149, label: "Mindful", emoji: "🧘" },
  { min: 150, max: 299, label: "Balanced", emoji: "⚖️" },
  { min: 300, max: 499, label: "Radiant", emoji: "🌟" },
  {
    min: 500,
    max: Number.POSITIVE_INFINITY,
    label: "Wellness Champion",
    emoji: "🏆",
  },
];

function getXPLevelInfo(xp: number) {
  const idx = Math.max(
    0,
    XP_LEVELS_T.findIndex((l) => xp >= l.min && xp <= l.max),
  );
  const safeIdx = idx === -1 ? XP_LEVELS_T.length - 1 : idx;
  const current = XP_LEVELS_T[safeIdx];
  const next = XP_LEVELS_T[safeIdx + 1];
  const xpInLevel = xp - current.min;
  const levelRange = next ? next.min - current.min : 100;
  const xpProgress = next
    ? Math.min(100, Math.round((xpInLevel / levelRange) * 100))
    : 100;
  const xpToNextLevel = next ? next.min - xp : 0;
  return {
    levelLabel: `${current.emoji} ${current.label}`,
    xpProgress,
    xpToNextLevel,
  };
}

type PlainSevT = {
  level: string;
  description: string;
  color: string;
  bg: string;
};

function getDassPlainSeverityT(
  type: "depression" | "anxiety" | "stress",
  score: number,
): PlainSevT {
  if (type === "depression") {
    if (score < 10)
      return {
        level: "Normal",
        description: "Appears emotionally settled.",
        color: "text-teal-700",
        bg: "bg-teal-50 border-teal-200",
      };
    if (score < 14)
      return {
        level: "Mild",
        description: "Mild low mood at times — generally managing well.",
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
      };
    if (score < 21)
      return {
        level: "Moderate",
        description: "Some signs of low mood worth a gentle conversation.",
        color: "text-orange-700",
        bg: "bg-orange-50 border-orange-200",
      };
    if (score < 28)
      return {
        level: "Severe",
        description: "Notable depressive signs — consider additional support.",
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
      };
    return {
      level: "Extremely Severe",
      description:
        "Significant concern — professional support strongly recommended.",
      color: "text-red-800",
      bg: "bg-red-100 border-red-300",
    };
  }
  if (type === "anxiety") {
    if (score < 8)
      return {
        level: "Normal",
        description: "Anxiety is within a healthy, manageable range.",
        color: "text-teal-700",
        bg: "bg-teal-50 border-teal-200",
      };
    if (score < 10)
      return {
        level: "Mild",
        description: "Occasional worry present — normal for students.",
        color: "text-amber-700",
        bg: "bg-amber-50 border-amber-200",
      };
    if (score < 15)
      return {
        level: "Moderate",
        description: "Noticeable anxiety. Breathing exercises may help.",
        color: "text-orange-700",
        bg: "bg-orange-50 border-orange-200",
      };
    if (score < 20)
      return {
        level: "Severe",
        description: "High anxiety levels — a caring check-in is important.",
        color: "text-red-700",
        bg: "bg-red-50 border-red-200",
      };
    return {
      level: "Extremely Severe",
      description:
        "Intense anxiety — professional support strongly recommended.",
      color: "text-red-800",
      bg: "bg-red-100 border-red-300",
    };
  }
  if (score < 15)
    return {
      level: "Normal",
      description: "Stress levels appear healthy and manageable.",
      color: "text-teal-700",
      bg: "bg-teal-50 border-teal-200",
    };
  if (score < 19)
    return {
      level: "Mild",
      description: "Some everyday pressures — managing well.",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    };
  if (score < 26)
    return {
      level: "Moderate",
      description: "Moderate stress. Encourage breaks and sleep.",
      color: "text-orange-700",
      bg: "bg-orange-50 border-orange-200",
    };
  if (score < 34)
    return {
      level: "Severe",
      description:
        "High stress — consider reducing workload or seeking support.",
      color: "text-red-700",
      bg: "bg-red-50 border-red-200",
    };
  return {
    level: "Extremely Severe",
    description: "Very high stress — urgent support strongly recommended.",
    color: "text-red-800",
    bg: "bg-red-100 border-red-300",
  };
}

function getSocialScoreT(a: DASS21Assessment): number {
  const social = (a as unknown as { socialIsolationScore?: bigint })
    .socialIsolationScore;
  if (social !== undefined && social !== null) return Number(social);
  return 0;
}

function formatDateT(timestamp: bigint) {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function parseMoodHistory(
  moodStr: string,
): Array<{ day: string; mood: number }> {
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const moodMap: Record<string, number> = {};
  for (const entry of moodStr.split(";")) {
    const [date, mood] = entry.split("=");
    if (date && mood) moodMap[date] = MOOD_STRING_TO_NUMBER_T[mood] ?? 0;
  }
  const parsed: Array<{ day: string; mood: number }> = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    parsed.push({ day: DAY_NAMES[d.getDay()], mood: moodMap[key] ?? 0 });
  }
  return parsed;
}

const TEACHER_BADGES = [
  {
    id: "sleep_champion",
    emoji: "😴",
    name: "Sleep Champion",
    hint: "Log sleep 7 times",
  },
  {
    id: "early_riser",
    emoji: "🌅",
    name: "Early Riser",
    hint: "Rate sleep 5 stars, 3 times",
  },
  {
    id: "yoga_warrior",
    emoji: "🧘",
    name: "Yoga Warrior",
    hint: "Log yoga 5 times",
  },
  {
    id: "step_master",
    emoji: "👟",
    name: "Step Master",
    hint: "Log running/walking 10 times",
  },
  {
    id: "outdoor_explorer",
    emoji: "🌳",
    name: "Outdoor Explorer",
    hint: "Log outdoor games 5 times",
  },
  {
    id: "streak_starter",
    emoji: "🔥",
    name: "Streak Starter",
    hint: "3-day streak",
  },
  {
    id: "streak_legend",
    emoji: "⚡",
    name: "Streak Legend",
    hint: "7-day streak",
  },
  {
    id: "wellness_star",
    emoji: "⭐",
    name: "Wellness Star",
    hint: "Earn 30 XP",
  },
  { id: "radiant", emoji: "🌟", name: "Radiant", hint: "Reach 300 XP" },
  { id: "champion", emoji: "🏆", name: "Champion", hint: "Reach 500 XP" },
];

interface StudentExtProfile {
  name: string;
  fieldOfStudy?: string;
  wellnessGoal?: string;
}
interface HabitSummaryT {
  sleepStreak: bigint;
  exerciseStreak: bigint;
  outdoorStreak: bigint;
  xp: bigint;
}

function MoodTooltipT({
  active,
  payload,
  label,
}: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value;
  if (score === 0)
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-md text-xs">
        <div className="font-semibold">{label}</div>
        <div className="text-muted-foreground mt-0.5">No check-in recorded</div>
      </div>
    );
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-border/40 rounded-xl px-3 py-2 shadow-md text-xs">
      <div className="font-semibold">{label}</div>
      <div className="text-muted-foreground mt-0.5">
        {score} — {MOOD_LABELS_T[score]}
      </div>
    </div>
  );
}

// ── Backend Student Profile (Teacher View) ────────────────────────────────────

function BackendStudentProfile({
  principal,
  name,
  email,
  onBack,
}: {
  principal: Principal;
  name: string;
  email: string;
  onBack: () => void;
}) {
  const { actor } = useActor();
  const [loading, setLoading] = useState(true);
  const [extProfile, setExtProfile] = useState<StudentExtProfile | null>(null);
  const [habitData, setHabitData] = useState<HabitSummaryT | null>(null);
  const [moodData, setMoodData] = useState<
    Array<{ day: string; mood: number }>
  >([]);

  const { data: assessments } = useGetStudentAssessments(principal);

  useEffect(() => {
    if (!actor) return;
    setLoading(true);
    Promise.all([
      (actor as any).getStudentExtendedProfile(principal).catch(() => []),
      (actor as any).getHabitSummary(principal).catch(() => []),
      (actor as any).getMoodHistory(principal).catch(() => ""),
    ])
      .then(([profileOpt, habitOpt, moodStr]) => {
        const profileVal = Array.isArray(profileOpt)
          ? profileOpt[0]
          : profileOpt?.__kind__ === "Some"
            ? profileOpt.value
            : undefined;
        const habitVal = Array.isArray(habitOpt)
          ? habitOpt[0]
          : habitOpt?.__kind__ === "Some"
            ? habitOpt.value
            : undefined;
        if (profileVal) setExtProfile(profileVal);
        if (habitVal) setHabitData(habitVal);
        if (moodStr) setMoodData(parseMoodHistory(moodStr));
      })
      .finally(() => setLoading(false));
  }, [actor, principal]);

  const latest = assessments?.[assessments.length - 1];
  const chartData =
    assessments
      ?.slice()
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .map((a) => ({
        date: formatDateT(a.timestamp),
        Depression: Number(a.depression.rawScore),
        Anxiety: Number(a.anxiety.rawScore),
        Stress: Number(a.stress.rawScore),
      })) ?? [];

  const sleepStreak = habitData ? Number(habitData.sleepStreak) : 0;
  const exerciseStreak = habitData ? Number(habitData.exerciseStreak) : 0;
  const outdoorStreak = habitData ? Number(habitData.outdoorStreak) : 0;
  const totalXP = habitData ? Number(habitData.xp) : 0;
  const { levelLabel, xpProgress, xpToNextLevel } = getXPLevelInfo(totalXP);

  const earnedBadgeIds = new Set<string>();
  if (sleepStreak >= 7) earnedBadgeIds.add("sleep_champion");
  if (sleepStreak >= 3) earnedBadgeIds.add("streak_starter");
  if (sleepStreak >= 7) earnedBadgeIds.add("streak_legend");
  if (totalXP >= 30) earnedBadgeIds.add("wellness_star");
  if (totalXP >= 300) earnedBadgeIds.add("radiant");
  if (totalXP >= 500) earnedBadgeIds.add("champion");
  if (exerciseStreak >= 5) earnedBadgeIds.add("yoga_warrior");
  if (outdoorStreak >= 5) earnedBadgeIds.add("outdoor_explorer");

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        data-ocid="teacher.student_profile.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
        <span className="ml-3 text-muted-foreground">
          Loading student data…
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
      data-ocid="teacher.backend_student_profile.panel"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        data-ocid="teacher.backend_profile.back.button"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Class Overview
      </button>

      {/* No activity data yet banner */}
      {moodData.length === 0 &&
        !habitData &&
        (!assessments || assessments.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 text-sky-800"
            data-ocid="teacher.student_no_data.panel"
          >
            <SmilePlus className="w-5 h-5 flex-shrink-0 text-sky-500 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                No activity data recorded yet
              </p>
              <p className="text-xs mt-0.5 text-sky-700">
                The student's mood, habits, and assessment data will appear here
                once they start logging their daily activities. Ask the student
                to open their Lumi Arc portal and log their first mood check-in.
              </p>
            </div>
          </motion.div>
        )}

      {/* Student banner */}
      <div className="rounded-2xl bg-teal-50 border border-teal-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 text-2xl">
            🧑‍🎓
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {name || "Student"}
            </h2>
            {email && (
              <p className="text-sm text-muted-foreground mt-0.5">{email}</p>
            )}
            {extProfile?.fieldOfStudy && (
              <p className="text-sm text-teal-700 mt-1 font-medium">
                {extProfile.fieldOfStudy}
              </p>
            )}
            {extProfile?.wellnessGoal && (
              <p className="text-xs text-muted-foreground mt-0.5 italic">
                Goal: {extProfile.wellnessGoal}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
              <Zap className="w-3.5 h-3.5" /> {totalXP} XP
            </span>
          </div>
        </div>
      </div>

      {/* Summary score cards */}
      {latest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Depression",
              score: Number(latest.depression.rawScore),
              severity: latest.depression.severity,
            },
            {
              label: "Anxiety",
              score: Number(latest.anxiety.rawScore),
              severity: latest.anxiety.severity,
            },
            {
              label: "Stress",
              score: Number(latest.stress.rawScore),
              severity: latest.stress.severity,
            },
            {
              label: "Social Risk",
              score: getSocialScoreT(latest),
              severity: null,
              risk: getSocialIsolationRisk(getSocialScoreT(latest)).risk,
            },
          ].map((item, i) => (
            <Card
              key={item.label}
              className="rounded-2xl border-border/40 shadow-sm"
              data-ocid={`teacher.student_summary.item.${i + 1}`}
            >
              <CardContent className="p-4 text-center">
                <div className="font-display text-3xl font-bold mb-1">
                  {item.score}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {item.label}
                </div>
                {item.severity ? (
                  <Badge
                    className={`text-xs rounded-full ${severityBgClass(item.severity)}`}
                  >
                    {formatSeverityLabel(item.severity)}
                  </Badge>
                ) : (
                  <Badge
                    className={`text-xs rounded-full ${
                      item.risk === "low"
                        ? "bg-green-100 text-green-800"
                        : item.risk === "moderate"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.risk === "high"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.risk === "low"
                      ? "Low"
                      : item.risk === "moderate"
                        ? "Moderate"
                        : item.risk === "high"
                          ? "High"
                          : "Very High"}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      {/* DASS-21 plain language summary */}
      {latest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          data-ocid="teacher.dass_summary.card"
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                What the DASS-21 Scores Mean
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Plain-language guide to this student's latest results.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  type: "depression" as const,
                  label: "Depression",
                  score: Number(latest.depression.rawScore),
                },
                {
                  type: "anxiety" as const,
                  label: "Anxiety",
                  score: Number(latest.anxiety.rawScore),
                },
                {
                  type: "stress" as const,
                  label: "Stress",
                  score: Number(latest.stress.rawScore),
                },
              ].map(({ type, label, score }) => {
                const sev = getDassPlainSeverityT(type, score);
                return (
                  <div key={type} className={`rounded-xl border p-3 ${sev.bg}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                        {label}
                      </span>
                      <span className={`text-xs font-semibold ${sev.color}`}>
                        {sev.level}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${sev.color}`}>
                      {sev.description}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Assessment Trends line chart */}
      {chartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-500" />
                Assessment Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.9 0.02 180)"
                  />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 42]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid oklch(0.88 0.025 180)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="Depression"
                    stroke="oklch(0.55 0.18 25)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Anxiety"
                    stroke="oklch(0.58 0.18 55)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Stress"
                    stroke="oklch(0.42 0.09 195)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weekly Mood chart */}
      {moodData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          data-ocid="teacher.student_mood.panel"
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <SmilePlus className="w-4 h-4 text-teal-500" />
                Weekly Mood Check-Ins
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mood score: 1 = Very Sad · 2 = Sad · 3 = Okay · 4 = Happy · 5 =
                Very Happy
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={moodData}
                  barCategoryGap="28%"
                  margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="oklch(0.92 0.015 195)"
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<MoodTooltipT />}
                    cursor={{ fill: "oklch(0.96 0.02 195 / 0.5)" }}
                  />
                  <Bar dataKey="mood" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {moodData.map((entry) => (
                      <Cell
                        key={`mood-bar-${entry.day}`}
                        fill={
                          MOOD_BAR_COLORS_T[entry.mood] ?? MOOD_BAR_COLORS_T[0]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Habit Streaks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Daily Habit Streaks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: "🌙",
                  label: "Sleep Streak",
                  value: sleepStreak,
                  color: "from-indigo-100 to-violet-100 border-indigo-200",
                },
                {
                  icon: "💪",
                  label: "Exercise Streak",
                  value: exerciseStreak,
                  color: "from-orange-100 to-rose-100 border-orange-200",
                },
                {
                  icon: "🌳",
                  label: "Outdoor Streak",
                  value: outdoorStreak,
                  color: "from-emerald-100 to-teal-100 border-emerald-200",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-2xl border bg-gradient-to-br ${s.color} p-4 text-center shadow-sm`}
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-1">
                    {s.value > 0 && <span className="text-xl">🔥</span>}
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                    {s.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {s.value === 1 ? "day" : "days"}
                  </div>
                </div>
              ))}
            </div>

            {/* XP Level banner */}
            <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-bold text-foreground text-base">
                  {levelLabel}
                </span>
                <span className="text-sm font-semibold text-amber-700">
                  {totalXP} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-amber-100" />
              <div className="text-xs text-muted-foreground mt-1.5">
                {xpToNextLevel > 0
                  ? `${xpToNextLevel} XP to next level`
                  : "Max level reached! 🏆"}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center italic">
              Detailed day-by-day habit logs are visible only to the student.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges shelf */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
      >
        <Card className="rounded-2xl border-border/40 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base flex items-center gap-2">
              🏅 Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {TEACHER_BADGES.map((badge) => {
                const unlocked = earnedBadgeIds.has(badge.id);
                return (
                  <div
                    key={badge.id}
                    title={badge.hint}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
                      unlocked
                        ? "bg-amber-50 border border-amber-200 shadow-sm ring-1 ring-amber-300/50"
                        : "bg-muted/40 border border-border/30 opacity-50 grayscale"
                    }`}
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <span className="text-[10px] font-medium leading-tight text-foreground">
                      {badge.name}
                    </span>
                    {unlocked && (
                      <span className="text-[9px] text-amber-600 font-semibold">
                        Earned!
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assessment history table */}
      {assessments && assessments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <Card className="rounded-2xl border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                📅 Assessment History ({assessments.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table data-ocid="teacher.student_assessments.table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Depression</TableHead>
                      <TableHead>Anxiety</TableHead>
                      <TableHead>Stress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments
                      .slice()
                      .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
                      .map((a, i) => (
                        <TableRow
                          key={a.id.toString()}
                          data-ocid={`teacher.student_assessment.row.${i + 1}`}
                        >
                          <TableCell className="text-sm">
                            {formatDateT(a.timestamp)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs rounded-full ${severityBgClass(a.depression.severity)}`}
                            >
                              {Number(a.depression.rawScore)} —{" "}
                              {formatSeverityLabel(a.depression.severity)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs rounded-full ${severityBgClass(a.anxiety.severity)}`}
                            >
                              {Number(a.anxiety.rawScore)} —{" "}
                              {formatSeverityLabel(a.anxiety.severity)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs rounded-full ${severityBgClass(a.stress.severity)}`}
                            >
                              {Number(a.stress.rawScore)} —{" "}
                              {formatSeverityLabel(a.stress.severity)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {!latest && !loading && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="teacher.student_assessments.empty_state"
        >
          <p className="font-display text-lg font-semibold mb-1 text-foreground">
            No assessments yet
          </p>
          <p className="text-sm">
            This student has not completed any DASS-21 assessments.
          </p>
        </div>
      )}
      {!loading && !extProfile && moodData.length === 0 && !latest && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
          <p className="text-amber-800 font-medium">No wellness data yet</p>
          <p className="text-amber-700 text-sm mt-1">
            This student hasn't logged any mood check-ins, assessments, or
            habits yet. Ask them to use their dashboard.
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ── Class Overview ────────────────────────────────────────────────────────────

function ClassOverview({
  onSelectStudent: _onSelectStudent,
  onSelectBackendStudent,
  onSelectManualStudent,
}: {
  onSelectStudent: (s: StudentRecord) => void;
  onSelectBackendStudent: (p: Principal, name: string, email: string) => void;
  onSelectManualStudent: (s: TeacherStudentEntry) => void;
}) {
  const { data: backendStudents = [], isFetching } =
    useGetTeacherStudentsWithProfiles();
  const { students: manualStudents, removeStudent } = useTeacherStudents();
  const queryClient = useQueryClient();
  const { actor } = useActor();

  async function handleUnlinkBackendStudent(principal: Principal) {
    if (!actor) return;
    try {
      await (actor as any).removeStudentLink(principal);
    } catch (_) {
      // ignore if method not available
    }
    queryClient.invalidateQueries({
      queryKey: ["teacherStudentsWithProfiles"],
    });
    queryClient.invalidateQueries({ queryKey: ["teacherStudents"] });
    toast.success(
      "Student unlinked. They will need to re-link to appear again.",
    );
  }

  function handleRefresh() {
    queryClient.invalidateQueries({
      queryKey: ["teacherStudentsWithProfiles"],
    });
    queryClient.invalidateQueries({ queryKey: ["teacherStudents"] });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Class Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Mental wellness at a glance
            {isFetching && (
              <span className="ml-2 text-teal-600 text-xs">Refreshing…</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            data-ocid="teacher.overview.button"
            className="inline-flex items-center gap-1.5 border border-teal-200 text-teal-700 hover:bg-teal-50 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
            title="Refresh class overview"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium">
            <Users className="w-4 h-4" />
            Lumi Arc Teacher View
          </div>
        </div>
      </div>

      {/* Student cards or empty state */}
      {backendStudents.length === 0 && manualStudents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="teacher.empty_state"
          className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-border/60 bg-muted/20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center mb-5">
            <Users className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
            No students linked yet
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
            Share your invite link with your mentee students to get started.
            Once they sign up via your link, their wellness data will appear
            here. You can also manually add students using the My Students
            section below.
          </p>
        </motion.div>
      ) : (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          data-ocid="teacher.students_grid"
        >
          {backendStudents.map(([principal, name, email], idx) => (
            <div
              key={principal.toString()}
              data-ocid={`teacher.student_card.${idx + 1}`}
              className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-2 w-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-teal-700" />
                </div>
                <div className="min-w-0 flex-1">
                  {name ? (
                    <p className="font-semibold text-sm text-foreground">
                      {name}
                    </p>
                  ) : (
                    <p className="font-semibold text-sm text-muted-foreground italic">
                      Name not set
                    </p>
                  )}
                  {email && (
                    <p className="text-xs text-muted-foreground">{email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(principal.toString());
                    toast.success("Principal ID copied!");
                  }}
                  className="text-teal-500 hover:text-teal-700 transition-colors flex-shrink-0"
                  title="Copy Principal ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleUnlinkBackendStudent(principal)}
                  data-ocid={`teacher.student_card.delete_button.${idx + 1}`}
                  className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                  title="Remove student link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono pl-11">
                {principal.toString().slice(0, 16)}…
              </p>
              <button
                type="button"
                onClick={() =>
                  onSelectBackendStudent(
                    principal,
                    name || "Name not set",
                    email,
                  )
                }
                className="text-xs text-teal-600 font-medium pl-11 hover:underline cursor-pointer"
              >
                Click to view progress →
              </button>
            </div>
          ))}
          {manualStudents.map((s, idx) => (
            <button
              type="button"
              key={s.id}
              data-ocid={`teacher.manual_student_card.${backendStudents.length + idx + 1}`}
              onClick={() => onSelectManualStudent(s)}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 w-full text-left hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-amber-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {s.studentName}
                  </p>
                  {s.studentEmail && (
                    <p className="text-xs text-muted-foreground">
                      {s.studentEmail}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Manual
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStudent(s.id);
                      toast.success("Student removed.");
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                    title="Remove student"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {s.studentFieldOfStudy && (
                <p className="text-xs text-muted-foreground pl-11">
                  📚 {s.studentFieldOfStudy}
                </p>
              )}
              {s.guardianName && (
                <p className="text-xs text-muted-foreground pl-11">
                  👨‍👩‍👧 Guardian: {s.guardianName}
                </p>
              )}
              <p className="text-xs text-amber-600 font-medium pl-11">
                Click to view details →
              </p>
            </button>
          ))}
        </div>
      )}

      {/* My Students contact directory */}
      <MyStudentsSection
        onSelectBackendStudent={onSelectBackendStudent}
        onSelectManualStudent={onSelectManualStudent}
      />
    </div>
  );
}

// ── Manual Student Profile ───────────────────────────────────────────────────

function ManualStudentProfile({
  student,
  onBack,
}: {
  student: TeacherStudentEntry;
  onBack: () => void;
}) {
  const { actor } = useActor();
  const [loading, setLoading] = useState(true);
  const [extProfile, setExtProfile] = useState<StudentExtProfile | null>(null);
  const [habitData, setHabitData] = useState<HabitSummaryT | null>(null);
  const [moodData, setMoodData] = useState<
    Array<{ day: string; mood: number }>
  >([]);

  let principalObj: Principal | null = null;
  let principalParseError = false;
  if (student.studentPrincipalId) {
    try {
      principalObj = Principal.fromText(student.studentPrincipalId);
    } catch {
      principalParseError = true;
    }
  }

  const { data: assessments } = useGetStudentAssessments(principalObj);

  const pidStr = student.studentPrincipalId;
  useEffect(() => {
    if (!actor || !pidStr) {
      setLoading(false);
      return;
    }
    let p: Principal;
    try {
      p = Principal.fromText(pidStr);
    } catch {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      (actor as any).getStudentExtendedProfile(p).catch(() => []),
      (actor as any).getHabitSummary(p).catch(() => []),
      (actor as any).getMoodHistory(p).catch(() => ""),
    ])
      .then(([profileOpt, habitOpt, moodStr]) => {
        const profileVal = Array.isArray(profileOpt)
          ? profileOpt[0]
          : profileOpt?.__kind__ === "Some"
            ? profileOpt.value
            : undefined;
        const habitVal = Array.isArray(habitOpt)
          ? habitOpt[0]
          : habitOpt?.__kind__ === "Some"
            ? habitOpt.value
            : undefined;
        if (profileVal) setExtProfile(profileVal);
        if (habitVal) setHabitData(habitVal);
        if (moodStr) setMoodData(parseMoodHistory(moodStr));
      })
      .finally(() => setLoading(false));
  }, [actor, pidStr]);

  const latest = assessments?.[assessments.length - 1];
  const chartData =
    assessments
      ?.slice()
      .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      .map((a) => ({
        date: formatDateT(a.timestamp),
        Depression: Number(a.depression.rawScore),
        Anxiety: Number(a.anxiety.rawScore),
        Stress: Number(a.stress.rawScore),
      })) ?? [];

  const sleepStreak = habitData ? Number(habitData.sleepStreak) : 0;
  const exerciseStreak = habitData ? Number(habitData.exerciseStreak) : 0;
  const outdoorStreak = habitData ? Number(habitData.outdoorStreak) : 0;
  const totalXP = habitData ? Number(habitData.xp) : 0;
  const { levelLabel, xpProgress, xpToNextLevel } = getXPLevelInfo(totalXP);

  const earnedBadgeIds = new Set<string>();
  if (sleepStreak >= 7) earnedBadgeIds.add("sleep_champion");
  if (sleepStreak >= 3) earnedBadgeIds.add("streak_starter");
  if (sleepStreak >= 7) earnedBadgeIds.add("streak_legend");
  if (totalXP >= 30) earnedBadgeIds.add("wellness_star");
  if (totalXP >= 300) earnedBadgeIds.add("radiant");
  if (totalXP >= 500) earnedBadgeIds.add("champion");
  if (exerciseStreak >= 5) earnedBadgeIds.add("yoga_warrior");
  if (outdoorStreak >= 5) earnedBadgeIds.add("outdoor_explorer");

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
      data-ocid="teacher.manual_student_profile.panel"
    >
      <button
        type="button"
        onClick={onBack}
        data-ocid="teacher.manual_profile.back.button"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Class Overview
      </button>

      {/* Student header — amber for manually added */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-2xl">
            🧑‍🎓
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {student.studentName}
            </h2>
            {student.studentEmail && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {student.studentEmail}
              </p>
            )}
            {student.studentFieldOfStudy && (
              <p className="text-sm text-amber-700 font-medium mt-1">
                {student.studentFieldOfStudy}
              </p>
            )}
            {extProfile?.wellnessGoal && (
              <p className="text-xs text-muted-foreground mt-0.5 italic">
                Goal: {extProfile.wellnessGoal}
              </p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span className="inline-flex items-center text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Manually Added
            </span>
            {totalXP > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                <Zap className="w-3.5 h-3.5" /> {totalXP} XP
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Student Details */}
      <Card className="rounded-2xl border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Student Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Full Name", value: student.studentName },
            { label: "Email", value: student.studentEmail },
            { label: "Phone", value: student.studentPhone },
            { label: "Field of Study", value: student.studentFieldOfStudy },
            { label: "Principal ID", value: student.studentPrincipalId },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center gap-1"
            >
              <span className="text-sm font-medium text-muted-foreground w-32 shrink-0">
                {label}
              </span>
              <span className="text-sm font-mono break-all">
                {value || (
                  <span className="text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Guardian / Parent Details */}
      <Card className="rounded-2xl border-border/40">
        <CardHeader>
          <CardTitle className="text-base">Guardian / Parent Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Name", value: student.guardianName },
            { label: "Email", value: student.guardianEmail },
            { label: "Phone", value: student.guardianPhone },
            { label: "Relationship", value: student.guardianRelationship },
            { label: "Principal ID", value: student.guardianPrincipalId },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row sm:items-center gap-1"
            >
              <span className="text-sm font-medium text-muted-foreground w-32 shrink-0">
                {label}
              </span>
              <span className="text-sm font-mono break-all">
                {value || (
                  <span className="text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Progress Section ─────────────────────────────────────────── */}

      {/* No Principal ID notice */}
      {!student.studentPrincipalId && !principalParseError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 text-sky-800"
          data-ocid="teacher.manual_no_principal.panel"
        >
          <User className="w-5 h-5 flex-shrink-0 text-sky-500 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">No Principal ID linked</p>
            <p className="text-xs mt-0.5 text-sky-700">
              Ask the student to share their Principal ID from the Student
              portal (visible in their "Link Your Guardian" tab). Once you add
              it here, their progress data will appear automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* Principal ID parse error */}
      {principalParseError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-800"
          data-ocid="teacher.manual_principal_error.panel"
        >
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Invalid Principal ID</p>
            <p className="text-xs mt-0.5 text-red-700">
              The stored Principal ID "{student.studentPrincipalId}" could not
              be parsed. Please edit the student entry and correct it.
            </p>
          </div>
        </motion.div>
      )}

      {/* Loading progress data */}
      {principalObj && loading && (
        <div
          className="flex items-center justify-center py-12"
          data-ocid="teacher.manual_progress.loading_state"
        >
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span className="ml-3 text-muted-foreground text-sm">
            Loading student progress…
          </span>
        </div>
      )}

      {/* Progress content — only when principal is valid and not loading */}
      {principalObj && !loading && (
        <>
          {/* No activity data banner */}
          {moodData.length === 0 &&
            !habitData &&
            (!assessments || assessments.length === 0) && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 bg-sky-50 border border-sky-200 rounded-2xl px-5 py-4 text-sky-800"
                data-ocid="teacher.manual_student_no_data.panel"
              >
                <SmilePlus className="w-5 h-5 flex-shrink-0 text-sky-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">
                    No activity data recorded yet
                  </p>
                  <p className="text-xs mt-0.5 text-sky-700">
                    The student's mood, habits, and assessment data will appear
                    here once they start logging their daily activities. Ask the
                    student to open their Lumi Arc portal and log their first
                    mood check-in.
                  </p>
                </div>
              </motion.div>
            )}

          {/* DASS-21 summary score cards */}
          {latest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  label: "Depression",
                  score: Number(latest.depression.rawScore),
                  severity: latest.depression.severity,
                },
                {
                  label: "Anxiety",
                  score: Number(latest.anxiety.rawScore),
                  severity: latest.anxiety.severity,
                },
                {
                  label: "Stress",
                  score: Number(latest.stress.rawScore),
                  severity: latest.stress.severity,
                },
                {
                  label: "Social Risk",
                  score: getSocialScoreT(latest),
                  severity: null,
                  risk: getSocialIsolationRisk(getSocialScoreT(latest)).risk,
                },
              ].map((item, i) => (
                <Card
                  key={item.label}
                  className="rounded-2xl border-border/40 shadow-sm"
                  data-ocid={`teacher.manual_summary.item.${i + 1}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="font-display text-3xl font-bold mb-1">
                      {item.score}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {item.label}
                    </div>
                    {item.severity ? (
                      <Badge
                        className={`text-xs rounded-full ${severityBgClass(item.severity)}`}
                      >
                        {formatSeverityLabel(item.severity)}
                      </Badge>
                    ) : (
                      <Badge
                        className={`text-xs rounded-full ${
                          item.risk === "low"
                            ? "bg-green-100 text-green-800"
                            : item.risk === "moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.risk === "high"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.risk}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* DASS-21 plain language summary */}
          {latest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              data-ocid="teacher.manual_dass_summary.card"
            >
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    What the DASS-21 Scores Mean
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Plain-language guide to this student's latest results.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      type: "depression" as const,
                      label: "Depression",
                      score: Number(latest.depression.rawScore),
                    },
                    {
                      type: "anxiety" as const,
                      label: "Anxiety",
                      score: Number(latest.anxiety.rawScore),
                    },
                    {
                      type: "stress" as const,
                      label: "Stress",
                      score: Number(latest.stress.rawScore),
                    },
                  ].map(({ type, label, score }) => {
                    const sev = getDassPlainSeverityT(type, score);
                    return (
                      <div
                        key={type}
                        className={`rounded-xl border p-3 ${sev.bg}`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            {label}
                          </span>
                          <span
                            className={`text-xs font-semibold ${sev.color}`}
                          >
                            {sev.level}
                          </span>
                        </div>
                        <p className={`text-sm leading-relaxed ${sev.color}`}>
                          {sev.description}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Assessment Trends line chart */}
          {chartData.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Assessment Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="oklch(0.9 0.02 180)"
                      />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={[0, 42]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid oklch(0.88 0.025 180)",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="Depression"
                        stroke="oklch(0.55 0.18 25)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Anxiety"
                        stroke="oklch(0.58 0.18 55)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Stress"
                        stroke="oklch(0.42 0.09 195)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Weekly Mood bar chart */}
          {moodData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              data-ocid="teacher.manual_student_mood.panel"
            >
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <SmilePlus className="w-4 h-4 text-amber-500" />
                    Weekly Mood Check-Ins
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Mood score: 1 = Very Sad · 2 = Sad · 3 = Okay · 4 = Happy ·
                    5 = Very Happy
                  </p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={moodData}
                      barCategoryGap="28%"
                      margin={{ top: 4, right: 8, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="oklch(0.92 0.015 195)"
                      />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tick={{ fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        content={<MoodTooltipT />}
                        cursor={{ fill: "oklch(0.96 0.02 195 / 0.5)" }}
                      />
                      <Bar dataKey="mood" radius={[6, 6, 0, 0]} maxBarSize={48}>
                        {moodData.map((entry) => (
                          <Cell
                            key={`mood-bar-${entry.day}`}
                            fill={
                              MOOD_BAR_COLORS_T[entry.mood] ??
                              MOOD_BAR_COLORS_T[0]
                            }
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Daily Habit Streaks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Daily Habit Streaks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      icon: "🌙",
                      label: "Sleep Streak",
                      value: sleepStreak,
                      color: "from-indigo-100 to-violet-100 border-indigo-200",
                    },
                    {
                      icon: "💪",
                      label: "Exercise Streak",
                      value: exerciseStreak,
                      color: "from-orange-100 to-rose-100 border-orange-200",
                    },
                    {
                      icon: "🌳",
                      label: "Outdoor Streak",
                      value: outdoorStreak,
                      color: "from-emerald-100 to-teal-100 border-emerald-200",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-2xl border bg-gradient-to-br ${s.color} p-4 text-center shadow-sm`}
                    >
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <div className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-1">
                        {s.value > 0 && <span className="text-xl">🔥</span>}
                        {s.value}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                        {s.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.value === 1 ? "day" : "days"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* XP Level banner */}
                <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-foreground text-base">
                      {levelLabel}
                    </span>
                    <span className="text-sm font-semibold text-amber-700">
                      {totalXP} XP
                    </span>
                  </div>
                  <Progress value={xpProgress} className="h-2 bg-amber-100" />
                  <div className="text-xs text-muted-foreground mt-1.5">
                    {xpToNextLevel > 0
                      ? `${xpToNextLevel} XP to next level`
                      : "Max level reached! 🏆"}
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center italic">
                  Detailed day-by-day habit logs are visible only to the
                  student.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Badges shelf */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <Card className="rounded-2xl border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  🏅 Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {TEACHER_BADGES.map((badge) => {
                    const unlocked = earnedBadgeIds.has(badge.id);
                    return (
                      <div
                        key={badge.id}
                        title={badge.hint}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
                          unlocked
                            ? "bg-amber-50 border border-amber-200 shadow-sm ring-1 ring-amber-300/50"
                            : "bg-muted/40 border border-border/30 opacity-50 grayscale"
                        }`}
                      >
                        <span className="text-xl">{badge.emoji}</span>
                        <span className="text-[10px] font-medium leading-tight text-foreground">
                          {badge.name}
                        </span>
                        {unlocked && (
                          <span className="text-[9px] text-amber-600 font-semibold">
                            Earned!
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Assessment history table */}
          {assessments && assessments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <Card className="rounded-2xl border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    Assessment History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table data-ocid="teacher.manual_student_assessments.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Depression</TableHead>
                          <TableHead>Anxiety</TableHead>
                          <TableHead>Stress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assessments
                          .slice()
                          .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
                          .map((a, i) => (
                            <TableRow
                              key={a.id.toString()}
                              data-ocid={`teacher.manual_assessment.row.${i + 1}`}
                            >
                              <TableCell className="text-sm">
                                {formatDateT(a.timestamp)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs rounded-full ${severityBgClass(a.depression.severity)}`}
                                >
                                  {Number(a.depression.rawScore)} —{" "}
                                  {formatSeverityLabel(a.depression.severity)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs rounded-full ${severityBgClass(a.anxiety.severity)}`}
                                >
                                  {Number(a.anxiety.rawScore)} —{" "}
                                  {formatSeverityLabel(a.anxiety.severity)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs rounded-full ${severityBgClass(a.stress.severity)}`}
                                >
                                  {Number(a.stress.rawScore)} —{" "}
                                  {formatSeverityLabel(a.stress.severity)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!latest && (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="teacher.manual_student_assessments.empty_state"
            >
              <p className="font-display text-lg font-semibold mb-1 text-foreground">
                No assessments yet
              </p>
              <p className="text-sm">
                This student has not completed any DASS-21 assessments.
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ── Individual Student Profile ────────────────────────────────────────────────

function StudentProfile({
  student,
  onBack,
}: {
  student: StudentRecord;
  onBack: () => void;
}) {
  const moodBarHeight = (mood: MoodValue | null): number => {
    if (!mood) return 0;
    return (MOOD_SCORE[mood] / 5) * 100;
  };

  const moodBarColor = (mood: MoodValue | null): string => {
    if (!mood) return "bg-muted";
    return MOOD_CONFIG[mood].bar;
  };

  const dassColor = (score: number, max: number): string => {
    const pct = score / max;
    if (pct < 0.2) return "bg-teal-400";
    if (pct < 0.35) return "bg-amber-400";
    if (pct < 0.55) return "bg-orange-400";
    return "bg-red-500";
  };

  const mood30ChartColor = (mood: MoodValue | null): string => {
    if (!mood) return "#e5e7eb";
    const colors: Record<MoodValue, string> = {
      "Very Happy": "#2dd4bf",
      Happy: "#4ade80",
      Neutral: "#fbbf24",
      Sad: "#fb923c",
      "Very Sad": "#f87171",
    };
    return colors[mood];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        data-ocid="teacher.back.button"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Class Overview
      </button>

      {/* Student header */}
      <div
        className={`rounded-2xl p-6 ${
          student.isAtRisk
            ? "bg-red-50 border border-red-200"
            : "bg-teal-50 border border-teal-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-100 to-purple-100 flex items-center justify-center text-4xl shadow-md flex-shrink-0">
            {student.avatarEmoji}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {student.name}
              </h2>
              {student.isAtRisk && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Needs Attention
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {student.fieldOfStudy} · Age {student.age}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                <Zap className="w-3.5 h-3.5" /> {student.xpLevel} · {student.xp}{" "}
                XP
              </span>
              <SeverityBadge severity={student.dass21.severity} />
              <span className="text-sm text-muted-foreground self-center">
                Last active: {student.lastActive}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-col grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood 7 days */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
            <Smile className="w-5 h-5 text-amber-500" />
            Mood — Last 7 Days
          </h3>
          <div className="flex items-end gap-2 h-32">
            {student.moodHistory.map(({ day, mood }) => (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full flex items-end justify-center"
                  style={{ height: "96px" }}
                >
                  <div
                    className={`w-full rounded-t-lg transition-all ${moodBarColor(mood)}`}
                    style={{
                      height: `${moodBarHeight(mood)}%`,
                      minHeight: mood ? "4px" : "0",
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{day}</span>
                <span className="text-xs">
                  {mood ? MOOD_CONFIG[mood].emoji : "–"}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/40">
            {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
              <span
                key={key}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>

        {/* DASS-21 Scores */}
        <div className="bg-card border border-border/50 rounded-2xl p-6">
          <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            DASS-21 Scores
          </h3>
          <div className="space-y-5">
            {(
              [
                {
                  label: "Depression",
                  score: student.dass21.depression,
                  max: 42,
                },
                { label: "Anxiety", score: student.dass21.anxiety, max: 42 },
                { label: "Stress", score: student.dass21.stress, max: 42 },
              ] as Array<{ label: string; score: number; max: number }>
            ).map(({ label, score, max }) => {
              const pct = Math.min(100, (score / max) * 100);
              let sev = "Normal";
              if (label === "Depression") {
                sev =
                  score >= 28
                    ? "Extremely Severe"
                    : score >= 21
                      ? "Severe"
                      : score >= 14
                        ? "Moderate"
                        : score >= 10
                          ? "Mild"
                          : "Normal";
              } else if (label === "Anxiety") {
                sev =
                  score >= 20
                    ? "Extremely Severe"
                    : score >= 15
                      ? "Severe"
                      : score >= 10
                        ? "Moderate"
                        : score >= 8
                          ? "Mild"
                          : "Normal";
              } else {
                sev =
                  score >= 34
                    ? "Extremely Severe"
                    : score >= 26
                      ? "Severe"
                      : score >= 19
                        ? "Moderate"
                        : score >= 15
                          ? "Mild"
                          : "Normal";
              }
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{score}</span>
                      <SeverityBadge severity={sev} />
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${dassColor(score, max)}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood Trend — Last 30 Days */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border/50 rounded-2xl p-6"
        data-ocid="teacher.mood30.panel"
      >
        <h3 className="font-display text-lg font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          Mood Trend — Last 30 Days
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Each bar represents one day. Colour indicates mood; grey = no
          check-in.
        </p>
        <div className="flex items-end gap-0.5" style={{ height: "80px" }}>
          {student.moodHistory30.map(({ day, mood }) => (
            <div
              key={`mood30-${day}`}
              className="flex-1 relative group"
              style={{ height: "80px" }}
              title={mood ? `${day}: ${mood}` : `${day}: No check-in`}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-all"
                style={{
                  height: mood ? `${(MOOD_SCORE[mood] / 5) * 100}%` : "4px",
                  backgroundColor: mood30ChartColor(mood),
                  minHeight: "4px",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">Day 1</span>
          <span className="text-xs text-muted-foreground">Day 15</span>
          <span className="text-xs text-muted-foreground">Day 30</span>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border/40">
          {Object.entries(MOOD_CONFIG).map(([key, cfg]) => (
            <span
              key={key}
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.bar}`} />
              {cfg.label}
            </span>
          ))}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
            No check-in
          </span>
        </div>
      </motion.div>

      {/* Habit Streaks */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Habit Streaks
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Sleep",
              streak: student.sleepStreak,
              Icon: Moon,
              color: "bg-blue-50 border-blue-200 text-blue-700",
            },
            {
              label: "Exercise",
              streak: student.exerciseStreak,
              Icon: Dumbbell,
              color: "bg-green-50 border-green-200 text-green-700",
            },
            {
              label: "Outdoor",
              streak: student.outdoorStreak,
              Icon: TreePine,
              color: "bg-teal-50 border-teal-200 text-teal-700",
            },
          ].map(({ label, streak, Icon, color }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 text-center ${color}`}
            >
              <Icon className="w-5 h-5 mx-auto mb-2 opacity-70" />
              <div className="font-display text-2xl font-bold">
                {streak > 0 ? `🔥${streak}` : "—"}
              </div>
              <div className="text-xs font-medium mt-1 opacity-80">{label}</div>
              <div className="text-xs opacity-60">
                {streak === 1 ? "day" : "days"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          Badges Earned
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_BADGES.map((badge) => {
            const earned = student.badges.includes(badge);
            return (
              <span
                key={badge}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  earned
                    ? "bg-purple-100 border-purple-200 text-purple-700"
                    : "bg-muted border-border/40 text-muted-foreground line-through opacity-50"
                }`}
              >
                {earned ? "🏅 " : ""}
                {badge}
              </span>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {student.badges.length} / {ALL_BADGES.length} badges earned
        </p>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const teacherStudentsValue = useTeacherStudentsProvider();
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null,
  );
  const [selectedBackendStudent, setSelectedBackendStudent] = useState<{
    principal: Principal;
    name: string;
    email: string;
  } | null>(null);
  const [selectedManualStudent, setSelectedManualStudent] =
    useState<TeacherStudentEntry | null>(null);
  const { identity } = useInternetIdentity();
  const { profile: userProfile } = useUserProfile();
  const { actor } = useActor();
  const { setUserRole } = useAppContext();
  useEffect(() => {
    setUserRole("teacher");
  }, [setUserRole]);
  useEffect(() => {
    if (!actor || !identity) return;
    const name = userProfile?.name ?? "Teacher";
    const email = userProfile?.email ?? "";
    actor.createTeacherProfile(name, email).catch(() => {});
    const phone = (userProfile as any)?.phoneNumber ?? "";
    if (phone) {
      (actor as any).saveTeacherPhone(phone).catch(() => {});
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  }, [actor, identity, userProfile]);
  const inviteLink = identity
    ? generateTeacherInviteLink(identity)
    : `${window.location.origin}/?teacherInvite=`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard!");
    });
  };

  return (
    <TeacherStudentsContext.Provider value={teacherStudentsValue}>
      <PinGate userRole="teacher">
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-10 max-w-6xl">
            {/* Teacher Account Banner — always visible */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-teal-50 border border-teal-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {userProfile?.name || "Set your name in Profile"}
                  </p>
                  {userProfile?.email ? (
                    <div className="flex items-center gap-1 text-xs text-teal-700">
                      <Mail className="w-3 h-3" />
                      <a
                        href={`mailto:${userProfile.email}`}
                        className="hover:underline"
                      >
                        {userProfile.email}
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Add your email in Profile
                    </p>
                  )}
                </div>
              </div>

              {/* Invite Link + Principal ID */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-2">
                  {/* Principal ID — only if logged in via Internet Identity */}
                  {identity && (
                    <div className="flex items-center gap-2 bg-white border border-teal-100 rounded-xl px-3 py-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Your Principal ID:
                      </span>
                      <span className="text-xs font-mono text-teal-700 truncate max-w-[140px]">
                        {identity.getPrincipal().toString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            identity.getPrincipal().toString(),
                          );
                          toast.success("Principal ID copied!");
                        }}
                        className="ml-1 text-teal-500 hover:text-teal-700 transition-colors flex-shrink-0"
                        title="Copy Principal ID"
                        data-ocid="teacher.principal_id.button"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  {/* Invite Link — always visible */}
                  <div className="flex items-center gap-2 bg-white border border-teal-200 rounded-xl px-3 py-2">
                    <Link2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {inviteLink}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  data-ocid="teacher.invite_link.button"
                  className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-3 py-2 rounded-xl transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Invite Link
                </button>
              </div>
            </div>

            <ChangePinDialog userRole="teacher" />
            <AnimatePresence mode="wait">
              {selectedBackendStudent ? (
                <motion.div
                  key="backend-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <BackendStudentProfile
                    principal={selectedBackendStudent.principal}
                    name={selectedBackendStudent.name}
                    email={selectedBackendStudent.email}
                    onBack={() => setSelectedBackendStudent(null)}
                  />
                </motion.div>
              ) : selectedManualStudent ? (
                <motion.div
                  key="manual-profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ManualStudentProfile
                    student={selectedManualStudent}
                    onBack={() => setSelectedManualStudent(null)}
                  />
                </motion.div>
              ) : selectedStudent ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <StudentProfile
                    student={selectedStudent}
                    onBack={() => setSelectedStudent(null)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ClassOverview
                    onSelectStudent={setSelectedStudent}
                    onSelectBackendStudent={(p, n, e) =>
                      setSelectedBackendStudent({
                        principal: p,
                        name: n,
                        email: e,
                      })
                    }
                    onSelectManualStudent={setSelectedManualStudent}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PinGate>
    </TeacherStudentsContext.Provider>
  );
}
