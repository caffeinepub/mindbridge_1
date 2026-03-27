import { useState } from "react";

const STORAGE_KEY = "lumi_teacher_code";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TCH-${result}`;
}

function getOrCreateCode(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const code = generateCode();
  localStorage.setItem(STORAGE_KEY, code);
  return code;
}

export function useTeacherCode() {
  const [code] = useState<string>(getOrCreateCode);
  const inviteLink = `${window.location.origin}/?tc=${code}`;
  return { code, inviteLink };
}
