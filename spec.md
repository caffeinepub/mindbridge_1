# Lumi Arc

## Current State
- Teacher Dashboard renders the invite link and teacher banner only when `useProfile(identity)` returns a non-null value (Internet Identity profile)
- Teacher name/email are saved by ProfileModal into `lumi_arc_user_profile` via `useUserProfile()`, a completely different storage key from the II-based `useProfile`
- So the II-based `profile` is almost always null, the invite link section is never shown
- There is no mechanism for guardian/parent contact details to appear in the Teacher Dashboard

## Requested Changes (Diff)

### Add
- A persistent unique teacher code (TCH-XXXX) stored in localStorage under `lumi_teacher_code`, generated once on first visit, not tied to Internet Identity
- An invite link based on this code: `<origin>/?tc=TCH-XXXX`
- A `useTeacherStudents` hook managing a list of student-guardian contacts in localStorage (studentName, studentEmail, guardianName, guardianEmail, guardianPhone optional)
- A "My Students" section in Teacher Dashboard showing this contact list, with an "Add Student" button opening a form to add new student + guardian entry
- Invite link and teacher code always visible in Teacher Dashboard profile area (not gated on II profile)

### Modify
- `TeacherDashboard.tsx`: Read name/email from `useUserProfile()` not `useProfile(identity)`. Show invite link panel regardless of II profile. Replace `{profile && (...)}` gate with always-visible teacher banner.
- `TeacherDashboard.tsx`: Add "My Students" section with the contact list below the class overview

### Remove
- Dependency on `useProfile(identity)` for the invite link and teacher banner visibility

## Implementation Plan
1. Create `useTeacherCode` hook: generates/persists TCH-XXXX in localStorage, derives invite link
2. Create `useTeacherStudents` hook: CRUD for student-guardian contact list in localStorage
3. Update `TeacherDashboard.tsx` to use `useUserProfile()` for name/email, `useTeacherCode()` for invite link (always visible), add My Students section with guardian contact details
