# Lumi Arc

## Current State
- All dashboards (Student, Teacher, Guardian) are PIN-protected with Internet Identity login
- `LinkGuardianPage.tsx` lets students enter teacher + parent Principal IDs and calls `linkStudentToTeacherAndParent` on the backend
- **Bug**: This call always fails with "Could not link guardians" because `createStudentProfile` is never called on the backend -- the backend rejects the link call since the student has no backend profile
- Teacher invite link uses `useTeacherCode` (generates `TCH-XXXX` code), not the principal-based link from `useProfile.generateTeacherInviteLink`
- Teacher "My Students" section is manual localStorage-only list
- Backend has `linkStudentToTeacherAndParent(teacherId, parentId)` but no `getTeacherStudents()` query

## Requested Changes (Diff)

### Add
- Backend function `getTeacherStudents()` that returns `[(Principal, Text, Text)]` -- (studentPrincipal, name, email) for all students linked to this teacher via `studentLinks`
- `useGetTeacherStudents` hook in `useQueries.ts`
- Auto-register student in backend (`createStudentProfile`) before calling `linkStudentToTeacherAndParent` in `LinkGuardianPage.tsx`
- Pre-fill teacher Principal ID field in `LinkGuardianPage.tsx` if URL has `?teacherInvite=<base64>` param
- Real linked student list in TeacherDashboard from backend (alongside/replacing manual list)

### Modify
- `TeacherDashboard.tsx`: change invite link from `TCH-XXXX` code to principal-based `?teacherInvite=<base64>` link (consistent with what LinkGuardianPage reads)
- `LinkGuardianPage.tsx`: fix the guardian linking error by ensuring student backend profile exists first
- `declarations/backend.did.d.ts`, `declarations/backend.did.js`, `backend.d.ts`, `backend.ts`: add `getTeacherStudents` function
- `main.mo`: add `getTeacherStudents` query function

### Remove
- Nothing

## Implementation Plan
1. Update `main.mo` to add `getTeacherStudents() : async [(Principal, Text, Text)]` query
2. Update declaration files and backend.ts to include the new function
3. Fix `LinkGuardianPage.tsx`: on submit, call `createStudentProfile` (with localStorage name/email) before calling `linkStudentToTeacherAndParent`; read `?teacherInvite` URL param and pre-fill teacher field
4. Update `TeacherDashboard.tsx`: switch invite link to use `generateTeacherInviteLink` from `useProfile`; add backend query for real linked students using `useGetTeacherStudents`
5. Add `useGetTeacherStudents` to `hooks/useQueries.ts`
