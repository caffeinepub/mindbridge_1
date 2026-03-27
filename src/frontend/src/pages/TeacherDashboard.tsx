import {
  AlertTriangle,
  ArrowLeft,
  Dumbbell,
  Flame,
  Moon,
  Plus,
  Smile,
  Trash2,
  TreePine,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  ALL_BADGES,
  type MoodValue,
  type StudentRecord,
} from "../data/teacherSampleData";

import { Copy, Link2, Mail, User } from "lucide-react";
import { toast } from "sonner";
import PinGate, { ChangePinDialog } from "../components/PinGate";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useTeacherCode } from "../hooks/useTeacherCode";
import {
  type TeacherStudentEntry,
  useTeacherStudents,
} from "../hooks/useTeacherStudents";
import { useUserProfile } from "../hooks/useUserProfile";

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
      guardianName: guardianName.trim(),
      guardianEmail: guardianEmail.trim(),
      guardianPhone: guardianPhone.trim() || undefined,
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

// ── My Students Section ───────────────────────────────────────────────────────

function MyStudentsSection() {
  const { students, addStudent, removeStudent } = useTeacherStudents();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            My Students
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Student and guardian contact directory
          </p>
        </div>
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
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    removeStudent(s.id);
                    toast.success("Student removed.");
                  }}
                  data-ocid={`teacher.students.delete_button.${idx + 1}`}
                  className="self-start sm:self-center text-muted-foreground hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  title="Remove student"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Class Overview ────────────────────────────────────────────────────────────

function ClassOverview({
  onSelectStudent: _onSelectStudent,
}: {
  onSelectStudent: (s: StudentRecord) => void;
}) {
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
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-3 py-1.5 rounded-full text-sm font-medium">
          <Users className="w-4 h-4" />
          Lumi Arc Teacher View
        </div>
      </div>

      {/* Empty state */}
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
          Share your invite link with your mentee students to get started. Once
          they sign up via your link, their wellness data will appear here.
        </p>
      </motion.div>

      {/* My Students contact directory */}
      <MyStudentsSection />
    </div>
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
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(
    null,
  );
  const { identity } = useInternetIdentity();
  const { profile: userProfile } = useUserProfile();
  const { inviteLink } = useTeacherCode();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      toast.success("Invite link copied to clipboard!");
    });
  };

  return (
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
            {selectedStudent ? (
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
                <ClassOverview onSelectStudent={setSelectedStudent} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PinGate>
  );
}
