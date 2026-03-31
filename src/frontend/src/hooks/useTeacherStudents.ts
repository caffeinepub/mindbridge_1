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

const OLD_STORAGE_KEY = "teacherManualStudents";
const STORAGE_KEY = "lumi_teacher_students";

function loadStudents(): TeacherStudentEntry[] {
  try {
    // Migrate from old storage key if present
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const newRaw = localStorage.getItem(STORAGE_KEY);
      if (!newRaw) {
        // Only migrate if new storage is empty
        localStorage.setItem(STORAGE_KEY, oldRaw);
      }
      localStorage.removeItem(OLD_STORAGE_KEY); // Always clear old key
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TeacherStudentEntry[]) : [];
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
    const newEntry: TeacherStudentEntry = {
      ...entry,
      id: `stu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    const updated = [...students, newEntry];
    saveStudents(updated);
    setStudents(updated);
  }

  function removeStudent(id: string) {
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
