# Lumi Arc

## Current State

Fully functional university mental wellness app with:
- Internet Identity authentication (existing)
- Student, Teacher, Guardian dashboards (PIN-protected for Teacher/Guardian)
- All features: mood check-in (5 animated emojis), habit trackers, DASS-21, 50 Pastime games, 10 wellness games, 100 Mindful Kitchen dishes, 100 curated resources (books, articles, podcasts, speeches), rewards/XP/badges, 365 wellness tips, onboarding flow
- Data stored in localStorage
- DASS-21 citation on home page
- Consent screens present

## Requested Changes (Diff)

### Add
- **Role-based profile setup flow**: After Internet Identity login, if no profile exists in localStorage, show a one-time setup wizard:
  1. Role selection screen: Student / Teacher / Guardian/Parent
  2. Profile form: name, email (for Teacher: "official university email"), and for Guardian: phone (optional with note "Adding your phone number helps the teacher reach you if needed")
  3. Consent screen appropriate to role (shown once, stored in localStorage):
     - Student: "I choose to show up for myself, one day at a time. By entering this space, I commit to nurturing my emotional well-being and welcome the support of my parent and mentor teacher on this journey."
     - Guardian: "I believe in being present for my child's inner world. By joining this platform, I agree to gently support their mental wellness journey and stay connected with their growth."
     - Teacher: Warm professional message about supporting student wellness
  4. For Guardian role only: enter student code (e.g. STU-XXXX) to link to their child
- **Student code**: Auto-generate a short alphanumeric code (e.g. STU-4829) for each student, derived from their principal (use first 4 chars of principal as hex → uppercase → "STU-XXXX" format). Displayed on student's profile/dashboard so they can share with guardian.
- **Teacher invite link**: Generate a shareable invite URL with teacher's principal encoded as a query param (e.g. `?teacherInvite=<principalBase64>`). Display this link in Teacher Dashboard. When a student visits the app via this link, they are automatically linked to that teacher after profile setup.
- **Email visibility cross-roles**:
  - Student's dashboard shows their linked teacher's name and email (with mailto link)
  - Guardian's dashboard shows their child's linked teacher's name and email (with mailto link)
  - Teacher's "My Students" section shows each student's guardian's name, email, and phone (if provided)
- **Role-based routing**: After profile setup (or if profile exists), route directly to the appropriate dashboard based on stored role, bypassing PIN gates

### Modify
- **LandingPage role cards**: Update the role card buttons to trigger the Internet Identity login flow (if not logged in), then route to profile setup or existing dashboard based on role
- **Remove PIN gates**: Replace the PIN-based access control for Teacher and Guardian dashboards with the role-based profile system. If a user has a Teacher or Guardian profile stored, they can access the dashboard directly.
- **Profile data**: Store all profile data (name, email, role, student code, teacher link, guardian link, consent status, guardian phone) in localStorage under key `lumiArcProfile_<principalId>`

### Remove
- PIN gate components for Teacher/Guardian (replaced by profile-based role authentication)

## Implementation Plan

1. Create `useProfile` hook that:
   - Reads/writes profile from localStorage keyed by principal ID
   - Returns `{ profile, saveProfile, hasProfile, isFirstTime }`
   - Profile shape: `{ name, email, role, consentGiven, studentCode, linkedTeacherId, linkedTeacherEmail, linkedTeacherName, linkedStudentCode, guardianPhone, guardianName, guardianEmail }`

2. Create `ProfileSetupWizard` component with steps:
   - Step 1: Role selection (3 cards)
   - Step 2: Profile form (fields vary by role)
   - Step 3: Consent acceptance
   - Step 4 (Guardian only): Enter student code
   - On complete: save profile to localStorage, navigate to dashboard

3. Update `App.tsx`: After Internet Identity login, check for existing profile. If none, show `ProfileSetupWizard`. If profile exists, route to role-appropriate dashboard.

4. Update Teacher Dashboard:
   - Remove PIN gate, check for teacher profile role instead
   - Show teacher's email prominently in their profile section
   - Generate and display invite link (URL with teacherInvite param)
   - In "My Students" section, show guardian info (name, email, phone) alongside each student

5. Update Student Dashboard:
   - Show auto-generated student code (STU-XXXX) in profile section
   - Show linked teacher's name and email (from localStorage after setup)

6. Update Guardian Dashboard:
   - Remove PIN gate, check for guardian profile role instead
   - Show linked teacher's name and email with mailto link

7. Update LandingPage role card buttons to trigger login → profile setup flow

8. Handle invite link on app load: check URL for `teacherInvite` param, store in sessionStorage, use during student profile setup to auto-link
