# Lumi Arc

## Current State
The Guardian Dashboard displays DASS-21 assessment trends and a weekly mood chart (currently seeded/illustrative data). The Daily Habits tracker (DailyTrackers.tsx) stores sleep, exercise, and outdoor logs, plus streak, XP, and badge data in localStorage under key `lumi_arc_daily_logs`. The Guardian Dashboard has no awareness of this habits data.

## Requested Changes (Diff)

### Add
- A new "Daily Habits" section in the Guardian Dashboard that reads directly from `lumi_arc_daily_logs` localStorage and displays:
  - Three streak cards: Sleep streak, Exercise streak, Outdoor streak (consecutive days each has been logged)
  - A weekly activity summary bar chart showing how many habit categories (0-3) the student logged each of the last 7 days
  - XP level badge showing the student's current level label (Seeker, Mindful, Balanced, Radiant, Wellness Champion) and total XP
  - Badge shelf showing all 10 collectible badges (locked/unlocked) just like on the student dashboard

### Modify
- Guardian Dashboard: Replace the illustrative mood chart disclaimer text with the real habit data section above (keep the mood chart but also add the habits section below it)
- The weekly mood chart can remain as-is (still seeded by principal) since mood data is not in localStorage

### Remove
- Nothing removed

## Implementation Plan
1. Create a `useGuardianHabitData.ts` hook that reads `lumi_arc_daily_logs` from localStorage and returns: sleepStreak, exerciseStreak, outdoorStreak, totalXP, levelLabel, unlockedBadges, and weeklyActivityData (last 7 days, each with a count of habits logged that day 0-3)
2. Update `GuardianDashboard.tsx` to import and use the new hook, rendering:
   - A streak summary row with 3 cards (sleep/exercise/outdoor streaks)
   - A weekly habits bar chart (0-3 activities per day over the last 7 days)
   - XP level pill
   - Badge shelf (same visual style as DailyTrackers BadgeShelf)
3. Place the new section between the mood chart and the assessment history table
