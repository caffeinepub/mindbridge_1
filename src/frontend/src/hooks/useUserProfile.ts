import { useEffect, useState } from "react";

export interface UserProfile {
  name?: string;
  age?: string;
  email?: string;
  fieldOfStudy?: string;
  goal?: string;
  avatar?: string;
}

const STORAGE_KEY = "lumi_arc_user_profile";

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : {};
  } catch {
    return {};
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setProfile(loadProfile());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function saveProfile(p: UserProfile) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  }

  return { profile, saveProfile };
}
