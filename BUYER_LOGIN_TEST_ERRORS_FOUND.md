# Buyer Login Flow - Comprehensive Bug Report

**Test Credentials:** testbuyer@vengrow.com / Test@123  
**Date:** Testing completed  
**Scope:** Entire buyer functionality flow after login

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately)

### 1. **Dashboard Page - Wrong API Endpoint**
   - **Location:** `/client/src/pages/buyer/DashboardPage.tsx`
   - **Issue:** Uses `/api/buyer/stats` endpoint which doesn't exist
   - **Impact:** Dashboard stats fail to load, shows default values
   - **Line:** 90
   - **Fix Required:** Change to `/api/me/dashboard` which exists in routes.ts

### 2. **Dashboard Page - Hardcoded Sample Properties**
   - **Location:** `/client/src/pages/buyer/DashboardPage.tsx`
   - **Issue:** "Recommended For You" section shows hardcoded sample properties instead of fetching from API
   - **Impact:** Users see fake/dummy properties instead of real recommendations
   - **Lines:** 93-98, 250-254
   - **Fix Required:** Fetch recommended properties from API (likely `/api/me/recommendations` or similar)

### 3. **Dashboard Page - Hardcoded Saved Searches**
   - **Location:** `/client/src/pages/buyer/DashboardPage.tsx`
   - **Issue:** Saved Searches section shows hardcoded data (3BHK in Mumbai, Villa in Pune, Plot in Bangalore)
   - **Impact:** Users see fake searches instead of their actual saved searches
   - **Lines:** 196-231
   - **Fix Required:** Use `stats?.savedSearches` or fetch from `/api/me/saved-searches` API

### 4. **Dashboard Page - Hardcoded Recently Viewed**
   - **Location:** `/client/src/pages/buyer/DashboardPage.tsx`
   - **Issue:** Recently Viewed section shows hardcoded properties instead of real viewing history
   - **Impact:** Users see fake recently viewed properties
   - **Lines:** 274-309
   - **Fix Required:** Fetch from `/api/me/recently-viewed` or similar API endpoint

### 5. **Property Detail Page - Hardcoded Property Data**
   - **Location:** `/client/src/pages/buyer/PropertyDetailPage.tsx`
   - **Issue:** Entire property object is hardcoded, no API integration
   - **Impact:** Page doesn't display actual property data, always shows same fake property
   - **Lines:** 27-74
   - **Fix Required:** Fetch property data using `useParams` and `/api/properties/:id` endpoint

### 6. **Property Detail Page - Favorite Button Not Functional**
   - **Location:** `/client/src/pages/buyer/PropertyDetailPage.tsx`
   - **Issue:** Favorite button only toggles local state, doesn't call API to save/remove favorite
   - **Impact:** Favorites are not persisted, lost on page refresh
   - **Lines:** 25, 90-99
   - **Fix Required:** Add API call to `/api/favorites` POST/DELETE endpoint

### 7. **Property Detail Page - Share Button Not Functional**
   - **Location:** `/client/src/pages/buyer/PropertyDetailPage.tsx`
   - **Issue:** Share button has no onClick handler
   - **Impact:** Share functionality doesn't work
   - **Line:** 100-103
   - **Fix Required:** Add onClick handler to implement Web Share API or copy link functionality

### 8. **Schedule Visit Page - Hardcoded Property Data**
   - **Location:** `/client/src/pages/buyer/ScheduleVisitPage.tsx`
   - **Issue:** Property data is hardcoded, no API integration
   - **Impact:** Page doesn't show actual property being scheduled
   - **Lines:** 24-29
   - **Fix Required:** Fetch property data from URL params using `/api/properties/:id`

### 9. **Schedule Visit Page - Form Submission Not Functional**
   - **Location:** `/client/src/pages/buyer/ScheduleVisitPage.tsx`
   - **Issue:** Form has no onSubmit handler, submit button doesn't exist or doesn't work
   - **Impact:** Users cannot schedule visits
   - **Lines:** 66 (form tag)
   - **Fix Required:** Add onSubmit handler and API call to `/api/appointments` POST endpoint

### 10. **Profile Page - Hardcoded Form Data**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** Form shows hardcoded data instead of fetching user profile from API
   - **Impact:** Users see wrong profile information
   - **Lines:** 14-20
   - **Fix Required:** Fetch user data from `/api/auth/me` and populate form

### 11. **Profile Page - Save Function Not Functional**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** `handleSave` only logs to console, doesn't save to API
   - **Impact:** Profile changes are not saved
   - **Lines:** 22-25
   - **Fix Required:** Add API call to `/api/auth/me` PATCH endpoint to update profile

### 12. **Profile Page - Change Password Button Not Functional**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** Change Password button has no onClick handler
   - **Impact:** Users cannot change password
   - **Line:** 206
   - **Fix Required:** Add onClick handler to open password change dialog/form

### 13. **Profile Page - Delete Account Button Not Functional**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** Delete Account button has no onClick handler
   - **Impact:** Users cannot delete their account
   - **Line:** 217
   - **Fix Required:** Add onClick handler with confirmation dialog and API call

---

## 🟠 HIGH PRIORITY ISSUES (Fix Soon)

### 14. **Settings Page - No API Integration**
   - **Location:** `/client/src/pages/buyer/SettingsPage.tsx`
   - **Issue:** All notification switches only update local state, don't save to API
   - **Impact:** Settings changes are lost on page refresh
   - **Lines:** 18-24, 67, 84, 101, 116, 126, 136, 164
   - **Fix Required:** Add API calls to save notification preferences to backend

### 15. **Favorites Page - Share List Button Not Functional**
   - **Location:** `/client/src/pages/buyer/FavoritesPage.tsx`
   - **Issue:** Share List button has no onClick handler
   - **Impact:** Users cannot share their favorites list
   - **Line:** 111-114
   - **Fix Required:** Add onClick handler to implement share functionality

### 16. **BuyerDashboardPage - Missing API Integration for Stats**
   - **Location:** `/client/src/pages/buyer/BuyerDashboardPage.tsx`
   - **Issue:** Uses `/api/me/dashboard` but may not return all expected fields
   - **Impact:** Some stats may show incorrect values
   - **Line:** 49
   - **Fix Required:** Verify API response structure matches frontend expectations

### 17. **Inquiries Page - Reply Button Route**
   - **Location:** `/client/src/pages/buyer/InquiriesPage.tsx`
   - **Issue:** Reply button links to `/buyer/chat?inquiry=${inquiry.id}` - need to verify route exists
   - **Line:** 205
   - **Fix Required:** Verify chat page exists or update route

### 18. **Saved Searches Page - View Results Link**
   - **Location:** `/client/src/pages/buyer/SavedSearchesPage.tsx`
   - **Issue:** Links to `/listings?${params}` but should verify route matches
   - **Line:** 197
   - **Fix Required:** Verify route exists or use correct route

---

## 🟡 MEDIUM PRIORITY ISSUES

### 19. **Dashboard Page - Quick Search Links**
   - **Location:** `/client/src/pages/buyer/DashboardPage.tsx`
   - **Issue:** Quick search buttons link to `/buy`, `/rent`, `/new-projects`, `/map-search` - need to verify routes exist
   - **Lines:** 155, 161, 167, 173
   - **Fix Required:** Verify all routes exist or update to correct routes

### 20. **Property Detail Page - Report Button Not Functional**
   - **Location:** `/client/src/pages/buyer/PropertyDetailPage.tsx`
   - **Issue:** Report button has no onClick handler
   - **Line:** 115-117
   - **Fix Required:** Add onClick handler to open report dialog/form

### 21. **Schedule Visit Page - Back Link Uses Wrong Component**
   - **Location:** `/client/src/pages/buyer/ScheduleVisitPage.tsx`
   - **Issue:** Uses `<a>` tag instead of `Link` component from wouter
   - **Line:** 50
   - **Fix Required:** Replace with proper `Link` component

### 22. **Profile Page - Photo Upload Not Functional**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** Change Photo button has no onClick handler
   - **Line:** 58-61
   - **Fix Required:** Add onClick handler to open file picker and upload to API

### 23. **Profile Page - Remove Photo Not Functional**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** Remove Photo button has no onClick handler
   - **Line:** 73-76
   - **Fix Required:** Add onClick handler to remove photo via API

### 24. **Notifications Page - Notification Click Navigation**
   - **Location:** `/client/src/pages/buyer/NotificationsPage.tsx`
   - **Issue:** Notification cards don't navigate to related content when clicked
   - **Impact:** Users can't click notifications to view related property/inquiry
   - **Fix Required:** Add onClick handler to navigate based on notification type

---

## 🔵 LOW PRIORITY ISSUES (Nice to Have)

### 25. **Dashboard Page - Stats Cards Default Values**
   - **Location:** `/client/src/pages/buyer/DashboardPage.tsx`
   - **Issue:** Stats show default values (8, 3, 2, 5) when API fails
   - **Lines:** 121, 127, 133, 139
   - **Fix Required:** Better error handling and loading states

### 26. **BuyerDashboardPage - Empty State Handling**
   - **Location:** `/client/src/pages/buyer/BuyerDashboardPage.tsx`
   - **Issue:** Some sections may not handle empty states gracefully
   - **Fix Required:** Ensure all sections have proper empty states

### 27. **Property Detail Page - Missing Property Images**
   - **Location:** `/client/src/pages/buyer/PropertyDetailPage.tsx`
   - **Issue:** Image gallery shows placeholder, no actual images loaded
   - **Line:** 82-85
   - **Fix Required:** Fetch and display property images from API

### 28. **Schedule Visit Page - Time Slots Hardcoded**
   - **Location:** `/client/src/pages/buyer/ScheduleVisitPage.tsx`
   - **Issue:** Time slots are hardcoded instead of fetched from seller availability
   - **Lines:** 31-40
   - **Fix Required:** Fetch available time slots from API based on seller/date

### 29. **Settings Page - Dark Mode Not Functional**
   - **Location:** `/client/src/pages/buyer/SettingsPage.tsx`
   - **Issue:** Dark mode switch doesn't actually change theme
   - **Line:** 164
   - **Fix Required:** Implement theme switching functionality

### 30. **Profile Page - Email/Phone Verification Status**
   - **Location:** `/client/src/pages/buyer/ProfilePage.tsx`
   - **Issue:** Shows "verified" status but doesn't check actual verification status
   - **Lines:** 121, 139
   - **Fix Required:** Check actual verification status from user object

---

## 📋 SUMMARY

**Total Issues Found:** 30
- **Critical:** 13 issues
- **High Priority:** 5 issues  
- **Medium Priority:** 6 issues
- **Low Priority:** 6 issues

**Key Problem Areas:**
1. Hardcoded data in Dashboard (properties, searches, recently viewed)
2. Missing API integration (Profile, Settings, Property Detail, Schedule Visit)
3. Non-functional buttons (Share, Favorite, Report, Change Password, Delete Account)
4. Wrong API endpoints (`/api/buyer/stats` doesn't exist)
5. Forms without submission handlers
6. Missing onClick handlers on multiple buttons

**Recommended Fix Order:**
1. Fix Dashboard API endpoint and hardcoded data (Critical #1-4)
2. Add API integration to Property Detail page (Critical #5-7)
3. Fix Schedule Visit form submission (Critical #8-9)
4. Fix Profile page API integration (Critical #10-13)
5. Fix Settings page API integration (High #14)
6. Add missing onClick handlers (High #15, Medium #20-23)
7. Verify and fix routes (High #17-18, Medium #19)
8. Improve UX features (Low priority items)

---

## 🧪 TESTING NOTES

**Login Flow:** ✅ Should work correctly  
**Navigation:** ⚠️ Some links may lead to non-existent pages  
**Data Loading:** ❌ Dashboard shows hardcoded data instead of real data  
**Button Functionality:** ❌ Multiple buttons don't work (Share, Favorite, Save, etc.)  
**API Integration:** ❌ Many pages lack API integration  
**Form Submissions:** ❌ Forms don't submit data to backend
