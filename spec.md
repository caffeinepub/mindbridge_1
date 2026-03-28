# Lumi Arc

## Current State

The app has Principal ID-based linking between students, teachers, and guardians via `linkStudentToTeacherAndParent`. However, after linking:
- The Guardian dashboard reads mood and habit data from the guardian's **own** browser localStorage (`lumi_arc_daily_logs`, `lumi_arc_mood_*`) — not the student's
- The Guardian dashboard requires the guardian to manually re-enter the student's Principal ID every session to load DASS-21 data
- The Teacher dashboard shows linked students' names/emails via backend `getTeacherStudents()` but no mood, habit, or profile details
- Student mood/habit/profile data is stored exclusively in localStorage on the student's device — it's never synced to the backend

## Requested Changes (Diff)

### Add
- Backend functions: `saveMoodEntry`, `getMoodHistory`, `saveHabitSummary`, `getHabitSummary`, `saveStudentExtendedProfile`, `getStudentExtendedProfile`, `getParentLinkedStudent`, `getTeacherStudentsWithProfiles`
- Student mood sync: whenever student logs mood, call `saveMoodEntry(date, moodValue)` on the backend
- Student habit sync: whenever student saves trackers, call `saveHabitSummary(sleepStreak, exerciseStreak, outdoorStreak, xp)` on the backend
- Student profile sync: whenever student completes profile setup, call `saveStudentExtendedProfile(...)` on the backend
- Guardian auto-load: on mount, call `getParentLinkedStudent()` to get the linked student's Principal ID automatically — no manual input needed
- Guardian dashboard uses backend mood/habit data for the linked student instead of reading from local storage
- Teacher dashboard uses `getTeacherStudentsWithProfiles()` to show linked students with field of study, wellness goal, habit streaks, and XP

### Modify
- `GuardianDashboard.tsx`: Replace manual student ID input with auto-load from backend; replace `useGuardianHabitData()` (which reads guardian's own localStorage) with backend data for the linked student; replace `getRealWeeklyMoodData()` with backend mood history for the linked student
- `TeacherDashboard.tsx` MyStudentsSection: Use `getTeacherStudentsWithProfiles()` to show richer student cards (field of study, wellness goal, habit streaks, XP)
- `MoodCheckIn.tsx` or `StudentDashboard.tsx`: After saving mood to localStorage, also call `actor.saveMoodEntry(date, mood)` if logged in via Internet Identity
- `DailyTrackers.tsx` or `useDailyTrackers.ts`: After saving habits to localStorage, also call `actor.saveHabitSummary(...)` if logged in via Internet Identity
- `ProfileSetupWizard.tsx` and `ProfileModal.tsx`: After saving profile to localStorage, also call `actor.saveStudentExtendedProfile(...)` if logged in via Internet Identity

### Remove
- Manual student Principal ID input form from Guardian dashboard (replaced by auto-load)

## Implementation Plan

1. Backend and `backend.d.ts` already updated with new functions
2. Add `useStudentDataSync` hook in frontend — wraps `saveMoodEntry`, `saveHabitSummary`, `saveStudentExtendedProfile` calls with error handling
3. Update `MoodCheckIn.tsx` to call `saveMoodEntry` after localStorage save
4. Update `useDailyTrackers.ts` (or `DailyTrackers.tsx`) to call `saveHabitSummary` after localStorage save
5. Update `ProfileSetupWizard.tsx` to call `saveStudentExtendedProfile` on completion
6. Update `GuardianDashboard.tsx`: auto-load student via `getParentLinkedStudent()`, fetch mood via `getMoodHistory()`, fetch habits via `getHabitSummary()`, show student profile details
7. Update `TeacherDashboard.tsx` MyStudentsSection: use `getTeacherStudentsWithProfiles()` for rich student cards
