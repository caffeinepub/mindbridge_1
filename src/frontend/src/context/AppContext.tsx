import { type ReactNode, createContext, useContext, useState } from "react";
import type { DASS21Assessment } from "../backend.d";

export type UserRole = "student" | "teacher" | "parent" | null;

interface AssessmentResult {
  depression: { rawScore: number; severity: string };
  anxiety: { rawScore: number; severity: string };
  stress: { rawScore: number; severity: string };
  socialIsolation: { rawScore: number; risk: string };
  timestamp: Date;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  latestResult: AssessmentResult | null;
  setLatestResult: (result: AssessmentResult | null) => void;
  assessmentHistory: DASS21Assessment[];
  setAssessmentHistory: (history: DASS21Assessment[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [latestResult, setLatestResult] = useState<AssessmentResult | null>(
    null,
  );
  const [assessmentHistory, setAssessmentHistory] = useState<
    DASS21Assessment[]
  >([]);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        latestResult,
        setLatestResult,
        assessmentHistory,
        setAssessmentHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
