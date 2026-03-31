# Lumi Arc — Teacher Portal: Merge Manual Student Details + Progress

## Current State

In `TeacherDashboard.tsx`, when a teacher clicks a manually added student card in the Class Overview or My Students section, it opens `ManualStudentProfile`. This component only shows Student Details and Guardian/Parent Details cards. It has **no progress data** at all — no mood chart, no habit streaks, no DASS-21 results, no XP/badges.

The full progress view (`BackendStudentProfile`) only renders for backend-linked students (those who linked via invite). Manually added students are routed to the detail-only `ManualStudentProfile` instead.

This creates two problems:
1. The "progress" view for manually added students shows nothing useful (just contact fields)
2. When a `studentPrincipalId` is stored on a manually added student, the backend data for that student is never fetched or displayed

## Requested Changes (Diff)

### Add
- Progress data sections to `ManualStudentProfile`: mood history chart, habit streaks, XP/level, badges, DASS-21 summary, assessment history
- Backend data fetching inside `ManualStudentProfile` when `studentPrincipalId` is available (using `Principal.fromText(student.studentPrincipalId)`)
- "No progress data" info notice when `studentPrincipalId` is not provided (explaining the student needs to link via Principal ID first)
- Loading spinner while fetching backend data

### Modify
- `ManualStudentProfile`: expand it to include all the same progress sections that `BackendStudentProfile` has, placed below the existing Student Details and Guardian Details cards. Reuse the same rendering logic (mood bar chart, habit streak cards, XP banner, badges shelf, DASS-21 cards, assessment table)
- The student header banner should remain amber/manually-added styling
- Retain Student Details card and Guardian/Parent Details card exactly as they are now

### Remove
- Nothing removed — this is additive only

## Implementation Plan

1. In `ManualStudentProfile`, add state for `loading`, `extProfile`, `habitData`, `moodData`, and use `useGetStudentAssessments` hook — same as `BackendStudentProfile`
2. Add a `useEffect` that, if `student.studentPrincipalId` is non-empty, calls `Principal.fromText(student.studentPrincipalId)` and fetches `getStudentExtendedProfile`, `getHabitSummary`, `getMoodHistory` from the backend actor
3. After the Guardian Details card, render:
   a. If no `studentPrincipalId`: a blue info notice saying "No Principal ID linked — ask the student to share their Principal ID from the Student portal so you can view their progress here."
   b. If `studentPrincipalId` is set but loading: spinner
   c. If data loaded but all empty: same sky-blue "No activity data recorded yet" banner as in `BackendStudentProfile`
   d. If data loaded: full progress sections — DASS-21 score cards, assessment trends chart, weekly mood bar chart, habit streak cards, XP level banner, badges shelf, assessment history table
4. All progress rendering code should be extracted from `BackendStudentProfile` into shared helper components or inline — the exact same JSX can be duplicated/reused in `ManualStudentProfile`
5. Handle `Principal.fromText` errors gracefully (invalid ID shows a parsing error notice)
