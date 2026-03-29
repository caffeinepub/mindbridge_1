import { useState } from "react";

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

const STORAGE_KEY = "lumi_teacher_students";

function loadStudents(): TeacherStudentEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TeacherStudentEntry[]) : [];
  } catch {
    return [];
  }
}

function saveStudents(students: TeacherStudentEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export function useTeacherStudents() {
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

  return { students, addStudent, removeStudent };
}
