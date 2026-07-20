# Client Dashboard Functionality

## Overview
The client dashboard has been updated to use real backend data for several key sections.

## What is now functional
- `app/dashboard/page.tsx`
  - Loads client data from `/api/applications`, `/api/documents`, and `/api/messages`.
  - Displays active application count, pending document count, message count, and latest application.
- `app/dashboard/notifications/page.tsx`
  - Replaced the static support tickets page with a real notifications page.
  - Uses `/api/notifications` and `/api/notifications/mark-read`.
  - Supports refresh, mark-all-as-read, and individual notification marking.
- `lib/api/profile.ts`
  - Updated to use `/api/profile` instead of admin-only `/api/admin/profile`.
- `horizon-backend/routes/api.php`
  - Added authenticated `/api/profile` GET and PUT, plus POST fallback.
  - Ensures client-side profile edit and notifications use shared auth routes.

## Remaining limitations / notes
- `app/dashboard/purchases/page.tsx` remains static and does not yet fetch real purchase history.
- `app/dashboard/profile/page.tsx` still contains mostly UI-only tabs for notification preferences, security, and privacy.
- `app/dashboard/get-started` still follows the existing form flow and can be extended further.

## Files changed
- `horizon backend/routes/api.php`
- `horizon frontend/lib/api/profile.ts`
- `horizon frontend/app/dashboard/page.tsx`
- `horizon frontend/app/dashboard/notifications/page.tsx`

## Recommendation
If you want the dashboard to be fully completed, next steps are:
1. Add a real purchase history endpoint and wire `app/dashboard/purchases/page.tsx`.
2. Expand `app/dashboard/profile/page.tsx` to load and submit user settings.
3. Add dashboard summary counts from API rather than static labels.
4. Add notification count to the client header bell, if not already present.
