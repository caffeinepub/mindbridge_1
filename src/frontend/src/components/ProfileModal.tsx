import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useUserProfile";

const AVATARS = [
  { id: "sun", emoji: "🌻", label: "Sunflower" },
  { id: "moon", emoji: "🌙", label: "Moon" },
  { id: "star", emoji: "⭐", label: "Star" },
  { id: "leaf", emoji: "🍃", label: "Leaf" },
  { id: "butterfly", emoji: "🦋", label: "Butterfly" },
  { id: "owl", emoji: "🦉", label: "Owl" },
  { id: "fox", emoji: "🦊", label: "Fox" },
  { id: "panda", emoji: "🐼", label: "Panda" },
  { id: "cat", emoji: "🐱", label: "Cat" },
  { id: "bunny", emoji: "🐰", label: "Bunny" },
  { id: "frog", emoji: "🐸", label: "Frog" },
  { id: "penguin", emoji: "🐧", label: "Penguin" },
  { id: "lotus", emoji: "🪷", label: "Lotus" },
  { id: "rainbow", emoji: "🌈", label: "Rainbow" },
  { id: "fire", emoji: "🔥", label: "Spark" },
  { id: "gem", emoji: "💎", label: "Gem" },
];

const STUDENT_WELLNESS_GOALS = [
  "I want to feel less stressed during exams",
  "I want to manage my anxiety better",
  "I want to sleep more peacefully",
  "I want to feel more confident",
  "I want to build stronger friendships",
  "I want to be kinder to myself",
  "I want to stay more focused in studies",
  "I want to feel happier every day",
];

const TEACHER_WELLNESS_GOALS = [
  "I want to support my students' emotional well-being",
  "I want to build stronger mentor-mentee relationships",
  "I want to recognize signs of stress in my students",
  "I want to create a more supportive classroom environment",
  "I want to manage my own work-life balance better",
  "I want to foster resilience in the students I mentor",
  "I want to stay emotionally available for my mentees",
  "I want to grow as a compassionate educator",
];

const GUARDIAN_WELLNESS_GOALS = [
  "I want to stay closely connected to my child's emotional world",
  "I want to be a calming presence during my child's stressful times",
  "I want to understand and support my child's mental well-being",
  "I want to help my child build emotional resilience",
  "I want to have more open, meaningful conversations with my child",
  "I want to recognize when my child needs extra support",
  "I want to be a mindful and present parent",
  "I want to model healthy emotional habits for my child",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
  const { profile, saveProfile } = useUserProfile();
  const { userRole } = useAppContext();
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [goal, setGoal] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0].id);
  const [saved, setSaved] = useState(false);
  const [relationship, setRelationship] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (open) {
      setName(profile.name ?? "");
      setAge(profile.age ?? "");
      setEmail(profile.email ?? "");
      setFieldOfStudy(profile.fieldOfStudy ?? "");
      setGoal(profile.goal ?? "");
      setAvatar(profile.avatar ?? AVATARS[0].id);
      setRelationship((profile as any).relationship ?? "");
      setPhoneNumber((profile as any).phoneNumber ?? "");
      setSaved(false);
    }
  }, [open, profile]);

  function handleSave() {
    saveProfile({
      name,
      age,
      email,
      fieldOfStudy,
      goal,
      avatar,
      relationship,
      phoneNumber,
    } as any);
    // Sync to backend if student and logged in via II
    if (actor && identity && userRole === "student") {
      (actor as any)
        .saveStudentExtendedProfile(
          name.trim(),
          email.trim(),
          age.trim(),
          fieldOfStudy.trim(),
          goal.trim(),
        )
        .catch(() => {});
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  }

  const isGuardian = userRole === "parent";
  const isTeacher = userRole === "teacher";

  const wellnessGoals = isTeacher
    ? TEACHER_WELLNESS_GOALS
    : isGuardian
      ? GUARDIAN_WELLNESS_GOALS
      : STUDENT_WELLNESS_GOALS;

  const selectedAvatarEmoji =
    AVATARS.find((a) => a.id === avatar)?.emoji ?? "🌻";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={onClose}
          data-ocid="profile.modal"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-peach-100 to-rose-100 flex items-center justify-center text-2xl">
                  {selectedAvatarEmoji}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground">
                    My Profile
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Personalise your Lumi Arc experience
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="profile.close_button"
                  onClick={onClose}
                  className="ml-auto w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5">
              {/* Avatar picker */}
              <div>
                <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">
                  Choose Your Avatar
                </p>
                <div className="grid grid-cols-8 gap-1.5">
                  {AVATARS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      data-ocid="profile.avatar.toggle"
                      aria-label={a.label}
                      onClick={() => setAvatar(a.id)}
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all border-2",
                        avatar === a.id
                          ? "border-[#e07a5f] bg-[#fdf0ec] scale-110 shadow-md"
                          : "border-transparent hover:border-border/60 hover:bg-muted/40",
                      )}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5 block"
                >
                  Display Name
                </label>
                <Input
                  id="profile-name"
                  data-ocid="profile.name.input"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl border-border/60 focus:border-[#e07a5f] focus:ring-[#e07a5f]/20"
                  maxLength={40}
                />
              </div>

              {/* Age (students/teachers) OR Relationship with Child (guardians) */}
              {isGuardian ? (
                <div>
                  <label
                    htmlFor="profile-relationship"
                    className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5 block"
                  >
                    Relationship with Child
                  </label>
                  <Input
                    id="profile-relationship"
                    data-ocid="profile.relationship.input"
                    placeholder="e.g. Mother, Father, Grandparent, Uncle..."
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="rounded-xl border-border/60"
                    maxLength={40}
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="profile-age"
                    className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5 block"
                  >
                    Age
                  </label>
                  <Input
                    id="profile-age"
                    data-ocid="profile.age.input"
                    placeholder="e.g. 20"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="rounded-xl border-border/60"
                    maxLength={3}
                    type="number"
                    min={16}
                    max={40}
                  />
                </div>
              )}

              {/* Email (universal label) */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5 block"
                >
                  Email
                </label>
                <Input
                  id="profile-email"
                  data-ocid="profile.email.input"
                  placeholder={
                    isGuardian ? "your@email.com" : "your@university.edu"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-border/60"
                  maxLength={80}
                  type="email"
                />
              </div>

              {/* Field of Study (students/teachers) OR Phone Number (guardians) */}
              {isGuardian ? (
                <div>
                  <label
                    htmlFor="profile-phone"
                    className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5 block"
                  >
                    Phone Number
                  </label>
                  <Input
                    id="profile-phone"
                    data-ocid="profile.phone.input"
                    placeholder="e.g. +91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded-xl border-border/60"
                    maxLength={20}
                    type="tel"
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="profile-field"
                    className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-1.5 block"
                  >
                    Field of Study
                  </label>
                  <Input
                    id="profile-field"
                    data-ocid="profile.field_of_study.input"
                    placeholder="e.g. Computer Science, Psychology, Commerce..."
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="rounded-xl border-border/60"
                    maxLength={60}
                  />
                </div>
              )}

              {/* Wellness goal */}
              <div>
                <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide mb-2">
                  My Wellness Goal
                </p>
                <div className="flex flex-col gap-1.5">
                  {wellnessGoals.map((g) => (
                    <button
                      key={g}
                      type="button"
                      data-ocid="profile.goal.toggle"
                      onClick={() => setGoal(g)}
                      className={cn(
                        "text-left text-xs px-3 py-2 rounded-xl border transition-all",
                        goal === g
                          ? "border-[#e07a5f] bg-[#fdf0ec] text-[#c0513a] font-semibold"
                          : "border-border/40 hover:border-border/70 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <motion.div animate={saved ? { scale: [1, 1.04, 1] } : {}}>
                <Button
                  type="button"
                  data-ocid="profile.save_button"
                  onClick={handleSave}
                  className="w-full h-11 rounded-xl font-semibold text-sm"
                  style={{
                    background: saved
                      ? "#4ade80"
                      : "linear-gradient(135deg, #e07a5f 0%, #d4614a 100%)",
                    color: "white",
                    boxShadow: "0 4px 14px rgba(224,122,95,0.35)",
                  }}
                >
                  {saved ? "Saved! ✓" : "Save Profile"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
