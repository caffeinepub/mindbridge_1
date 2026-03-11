# Lumi Arc

## Current State
Lumi Arc is a university student mental health platform with Student Dashboard, Guardian Dashboard, DASS-21 Assessment, Resources, Activities, and Mindful Kitchen. The app has no Teacher Dashboard. The landing page links directly to the student flow. The draft has expired and needs to be redeployed.

## Requested Changes (Diff)

### Add
- **TeacherDashboard page** (`/teacher-dashboard`) with two views:
  1. **Class Overview** (default): Cards for each student showing name, avatar, latest mood emoji, DASS-21 risk level (color-coded badge), current streak, XP level, and a quick "At Risk" indicator if DASS-21 scores are elevated. Summary stats at the top: total students, average mood, number at risk, class average XP.
  2. **Individual Student Profile** (click any student card): Full detail view showing that student's mood history chart (7-day), DASS-21 trend, habit streaks (sleep, exercise, outdoor), XP + badges, and a back button to return to class overview.
- **Landing page role selector**: Add three role cards below the hero section — Student, Teacher, Parent/Guardian — so users can navigate to the appropriate area. Teacher card links to `/teacher-dashboard`; Student card links to `/dashboard`; Guardian card links to `/guardian-dashboard`.
- Sample student data: 12 mock students with varied moods, DASS-21 scores, streaks, and XP levels for the teacher view.

### Modify
- `App.tsx`: Add `/teacher-dashboard` route.
- `LandingPage.tsx`: Add role selector section with three cards.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/data/teacherSampleData.ts` with 12 mock students (name, avatar emoji, mood, DASS-21 scores, streaks, XP, badges, 7-day mood history).
2. Create `src/frontend/src/pages/TeacherDashboard.tsx` with class overview grid and individual student drill-down view (state-driven, no routing needed).
3. Update `App.tsx` to add the `/teacher-dashboard` route (no auth guard needed for now).
4. Update `LandingPage.tsx` to add a role selector section with three cards (Student, Teacher, Guardian).
