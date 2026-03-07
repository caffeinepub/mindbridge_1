# MindBridge

## Current State
- Full-stack mental health assessment app with DASS-21 questionnaire, social isolation scoring, student dashboard, guardian dashboard, resources library, and language activities.
- Resources page shows books, articles, podcasts, and wellness activities.
- No food/nutrition section exists.

## Requested Changes (Diff)

### Add
- A new "Mindful Kitchen" page (`/mindful-kitchen`) with Indian vegetarian dishes curated for mental well-being (reducing stress, anxiety, depression).
- Dishes must focus on greens and nutrient-dense ingredients with documented mood-boosting properties.
- Each dish should include: dish name, key mental-health benefit, ingredients list, step-by-step cooking method, and a "No Fire Needed" badge where applicable.
- At least 6-8 dishes total, with 2-3 explicitly no-fire/raw dishes.
- A nav link "Mindful Kitchen" accessible from the main navigation Layout.
- Route added to App.tsx and guarded with AuthGuarded.

### Modify
- `Layout.tsx` (or wherever the nav links live) -- add a Mindful Kitchen nav link.
- `App.tsx` -- register the new route.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/data/dishesData.ts` with 7-8 dish objects (static data, no backend needed).
2. Create `src/frontend/src/pages/MindfulKitchenPage.tsx` rendering dish cards with expandable cooking steps and badges.
3. Add route `/mindful-kitchen` in `App.tsx`.
4. Add nav link in `Layout.tsx`.
5. Validate (typecheck, lint, build).
