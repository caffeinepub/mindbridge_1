# Lumi Arc

## Current State
Version 29 introduced Internet Identity (II) authentication as the primary login method. All routes are wrapped in `AuthGuarded` which shows a `LoginPrompt` (II login) if no identity. A `ProfileSetupWizard` overlay forces role selection and profile setup after II login. The `LandingPage` role-card buttons trigger II login instead of navigating directly.

## Requested Changes (Diff)

### Add
- Email field in `ProfileModal` (as a simple optional text input stored in local profile, no authentication purpose)

### Modify
- `App.tsx`: Remove `AuthGuarded` wrapper from all routes. Remove `useInternetIdentity`, `useProfile`, `ProfileSetupWizard`, `LoginPrompt`, and `ProfileReadyBanner`. All routes render their components directly.
- `LandingPage.tsx`: Remove all Internet Identity hooks. Role card buttons navigate directly to their respective paths (/dashboard, /teacher-dashboard, /guardian-dashboard) using `useNavigate`. No login gating.
- `ProfileModal.tsx`: Add an optional Email field so students can store their university email in their profile.

### Remove
- All Internet Identity authentication flows from the app shell (LoginPrompt, ProfileSetupWizard, AuthGuarded)
- II-related imports and hooks from LandingPage and App

## Implementation Plan
1. Update `App.tsx` - strip all auth logic, render routes directly
2. Update `LandingPage.tsx` - role cards navigate directly with `useNavigate`, no II
3. Update `ProfileModal.tsx` - add email field
4. Validate build passes

Note: TeacherDashboard and GuardianDashboard keep their existing PinGate protection (PIN 2468 and 1357). StudentDashboard uses localStorage profile. No backend changes needed.
