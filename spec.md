# Lumi Arc

## Current State
The app has a full homepage (LandingPage.tsx) with role cards for Student, Teacher, and Guardian. Clicking a role card navigates directly to the respective dashboard. Teacher and Guardian dashboards are PIN-protected via PinGate component. All data is stored in browser local storage. Consent screens exist but are only shown as part of onboarding flow, not tied to login.

## Requested Changes (Diff)

### Add
- Internet Identity authentication integrated after role selection: when a user clicks Student, Teacher, or Guardian portal button, they are redirected to an Internet Identity login screen first
- After successful login, first-time users see the consent form before entering their dashboard
- Consent form for Students: warm affirming statement about joining for emotional wellbeing
- Consent form for Guardians: warm affirming statement about supporting their child's mental health
- Teacher consent: simple acknowledgement screen
- Store consent acceptance in backend (per user principal) so it only shows once
- Role stored in backend linked to the user's Internet Identity principal

### Modify
- Role card buttons on LandingPage now trigger login flow instead of direct navigation
- After login + consent, users land on their respective dashboard (Student → /dashboard, Teacher → /teacher-dashboard, Guardian → /guardian-dashboard)
- Teacher and Guardian dashboards retain PIN gate on top of the Internet Identity login

### Remove
- Direct unprotected navigation to dashboards from landing page

## Implementation Plan
1. Use authorization component to enable Internet Identity login
2. Create a LoginFlow component that wraps each portal entry: checks auth → if not logged in, show II login → if logged in but no consent, show consent screen → if consented, navigate to dashboard
3. Create RoleLoginPage component that accepts role as param and handles the full flow
4. Add route /login/:role to the router
5. Update LandingPage role card buttons to navigate to /login/student, /login/teacher, /login/guardian
6. Store consent state per principal in backend
7. After consent, store role in backend/local and redirect to appropriate dashboard
8. Keep homepage (LandingPage.tsx) completely unchanged in appearance
