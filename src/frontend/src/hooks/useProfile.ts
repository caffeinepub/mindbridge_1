import type { Identity } from "@icp-sdk/core/agent";
import { useCallback, useEffect, useState } from "react";

export type UserRole = "student" | "teacher" | "guardian";

export interface LumiProfile {
  name: string;
  email: string;
  role: UserRole;
  consentGiven: boolean;
  // Student fields
  studentCode?: string;
  linkedTeacherId?: string;
  linkedTeacherName?: string;
  linkedTeacherEmail?: string;
  // Guardian fields
  guardianPhone?: string;
  linkedStudentCode?: string;
  linkedStudentName?: string;
  linkedStudentEmail?: string;
  linkedTeacherNameForGuardian?: string;
  linkedTeacherEmailForGuardian?: string;
}

function profileKey(principalId: string) {
  return `lumiArcProfile_${principalId}`;
}

export function generateStudentCode(identity: Identity): string {
  const raw = identity
    .getPrincipal()
    .toText()
    .replace(/-/g, "")
    .substring(0, 4)
    .toUpperCase();
  return `STU-${raw}`;
}

export function generateTeacherInviteLink(identity: Identity): string {
  const encoded = btoa(identity.getPrincipal().toText());
  return `${window.location.origin}/?teacherInvite=${encoded}`;
}

export function useProfile(identity: Identity | undefined) {
  const principalId = identity?.getPrincipal().toText();

  const loadProfile = useCallback((): LumiProfile | null => {
    if (!principalId) return null;
    try {
      const raw = localStorage.getItem(profileKey(principalId));
      return raw ? (JSON.parse(raw) as LumiProfile) : null;
    } catch {
      return null;
    }
  }, [principalId]);

  const [profile, setProfile] = useState<LumiProfile | null>(loadProfile);

  useEffect(() => {
    setProfile(loadProfile());
  }, [loadProfile]);

  const saveProfile = useCallback(
    (p: LumiProfile) => {
      if (!principalId) return;
      localStorage.setItem(profileKey(principalId), JSON.stringify(p));
      setProfile(p);
    },
    [principalId],
  );

  const clearProfile = useCallback(() => {
    if (!principalId) return;
    localStorage.removeItem(profileKey(principalId));
    setProfile(null);
  }, [principalId]);

  return {
    profile,
    saveProfile,
    hasProfile: profile !== null,
    clearProfile,
  };
}
