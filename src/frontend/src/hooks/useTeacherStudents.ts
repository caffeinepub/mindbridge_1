import { createContext, useContext, useState } from "react";

export interface TeacherStudentEntry {
  id: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  studentFieldOfStudy?: string;
  studentPrincipalId?: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  guardianPrincipalId?: string;
}

// Legacy key — always cleared on load
const OLD_STORAGE_KEY = "teacherManualStudents";
const STORAGE_KEY = "lumi_teacher_students";

/** Generate a stable unique id for a student entry. */
function makeId(): string {
  return `stu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Normalize a raw parsed entry: ensure it always has a valid string `id`.
 * Old entries migrated from `teacherManualStudents` may be missing the field.
 */
function normalize(raw: unknown): TeacherStudentEntry {
  const e = raw as Record<string, unknown>;
  return {
    id: typeof e.id === "string" && e.id.length > 0 ? e.id : makeId(),
    studentName: typeof e.studentName === "string" ? e.studentName : "Student",
    studentEmail:
      typeof e.studentEmail === "string" ? e.studentEmail : undefined,
    studentPhone:
      typeof e.studentPhone === "string" ? e.studentPhone : undefined,
    studentFieldOfStudy:
      typeof e.studentFieldOfStudy === "string"
        ? e.studentFieldOfStudy
        : undefined,
    studentPrincipalId:
      typeof e.studentPrincipalId === "string"
        ? e.studentPrincipalId
        : undefined,
    guardianName:
      typeof e.guardianName === "string" ? e.guardianName : "Guardian",
    guardianEmail: typeof e.guardianEmail === "string" ? e.guardianEmail : "",
    guardianPhone:
      typeof e.guardianPhone === "string" ? e.guardianPhone : undefined,
    guardianRelationship:
      typeof e.guardianRelationship === "string"
        ? e.guardianRelationship
        : undefined,
    guardianPrincipalId:
      typeof e.guardianPrincipalId === "string"
        ? e.guardianPrincipalId
        : undefined,
  };
}

function loadStudents(): TeacherStudentEntry[] {
  try {
    // Always clear the old key — entries in it are superseded by the current key
    // or were already migrated in a prior session.
    localStorage.removeItem(OLD_STORAGE_KEY);

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];

    // Normalize each entry to ensure it has a valid ID.
    const normalized = parsed.map(normalize);

    // If any entry was missing an id, save the fixed list back immediately.
    const hadMissingIds = parsed.some(
      (e) =>
        typeof (e as Record<string, unknown>).id !== "string" ||
        (e as Record<string, unknown>).id === "",
    );
    if (hadMissingIds) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch {
    return [];
  }
}

function saveStudents(students: TeacherStudentEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export interface TeacherStudentsContextValue {
  students: TeacherStudentEntry[];
  addStudent: (entry: Omit<TeacherStudentEntry, "id">) => void;
  removeStudent: (id: string) => void;
  updateStudent: (id: string, entry: Omit<TeacherStudentEntry, "id">) => void;
}

export const TeacherStudentsContext =
  createContext<TeacherStudentsContextValue | null>(null);

export function useTeacherStudentsProvider(): TeacherStudentsContextValue {
  const [students, setStudents] = useState<TeacherStudentEntry[]>(loadStudents);

  function addStudent(entry: Omit<TeacherStudentEntry, "id">) {
    const newEntry: TeacherStudentEntry = { ...entry, id: makeId() };
    const updated = [...students, newEntry];
    saveStudents(updated);
    setStudents(updated);
  }

  function removeStudent(id: string) {
    if (!id) return; // Guard against undefined / empty ids
    const updated = students.filter((s) => s.id !== id);
    saveStudents(updated);
    setStudents(updated);
  }

  function updateStudent(id: string, entry: Omit<TeacherStudentEntry, "id">) {
    const updated = students.map((s) => (s.id === id ? { ...entry, id } : s));
    saveStudents(updated);
    setStudents(updated);
  }

  return { students, addStudent, removeStudent, updateStudent };
}

export function useTeacherStudents(): TeacherStudentsContextValue {
  const ctx = useContext(TeacherStudentsContext);
  if (!ctx) {
    throw new Error(
      "useTeacherStudents must be used within TeacherStudentsContext.Provider",
    );
  }
  return ctx;
}
