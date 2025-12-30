# Home Page and Filter Functionality - Bug Report
**Tested as:** Guest User (Not Logged In)  
**Date:** Current  
**Priority Levels:** Critical, High, Medium, Low

---

## 🔴 CRITICAL ISSUES (Must Fix Immediately)

### 1. Hero Section Search Button Does Nothing
**Location:** `client/src/components/HeroSection.tsx`  
**Issue:** The search button (`button-hero-search`) calls `handleSearch()` which only calls `onSearch?.()` callback, but `onSearch` prop is never passed from `HomePage.tsx`, so clicking search does nothing.  
**Impact:** Users cannot search for properties from the home page hero section.  
**Steps to Reproduce:**
1. Go to home page
2. Enter location, select property type, budget
3. Click "Search" button
4. Nothing happens

**Expected:** Should navigate to `/listings` with appropriate query parameters  
**Actual:** No action occurs

---

### 2. Filter Sidebar "Apply Filters" Button Doesn't Update URL or Trigger API Call
**Location:** `client/src/pages/ListingsPage.tsx` + `client/src/components/FilterSidebar.tsx`  
**Issue:** Filters are applied only client-side. No API call is made with filter parameters, and URL doesn't update. All filtering happens in memory after fetching all properties.  
**Impact:** 
- Poor performance (loads all properties then filters client-side)
- Filters don't persist in URL (can't share filtered results)
- No server-side filtering optimization

**Steps to Reproduce:**
1. Go to `/listings`
2. Apply filters (price range, BHK, location, etc.)
3. Click "Apply Filters"
4. Check network tab - no new API call
5. Check URL - no query parameters added

**Expected:** 
- API call to `/api/properties` with filter query parameters
- URL updates with filter parameters
- Server-side filtering

**Actual:** 
- Only client-side filtering
- No URL update
- No API call

---

### 3. ListingsFilterHeader Filter Chips Are Hardcoded and Non-Functional
**Location:** `client/src/components/ListingsFilterHeader.tsx`  
**Issue:** All filter chips display hardcoded values and don't reflect actual applied filters. Clear buttons only `console.log` and don't actually clear filters.  
**Impact:** Users see incorrect filter state, cannot interact with filters from header chips.

**Steps to Reproduce:**
1. Go to `/listings`
2. Notice filter chips show "Mumbai", "₹50L - ₹2Cr", etc.
3. Apply different filters from sidebar
4. Header chips don't update
5. Click clear button (X) on any chip
6. Check console - only logs, doesn't clear filter

**Expected:** 
- Filter chips reflect actual applied filters
- Clear buttons remove filters
- Chips update when filters change

**Actual:** 
- Hardcoded values
- Non-functional clear buttons
- No synchronization with actual filters

---

### 4. Pagination Is Hardcoded and Non-Functional
**Location:** `client/src/pages/ListingsPage.tsx` (lines 380-388)  
**Issue:** Pagination buttons are hardcoded with "1", "2", "3" and don't actually paginate. Previous/Next buttons are disabled.  
**Impact:** Users cannot navigate through multiple pages of results.

**Steps to Reproduce:**
1. Go to `/listings`
2. Scroll to bottom
3. See pagination: "Previous [1] 2 3 Next"
4. Click any page number or Next
5. Nothing happens

**Expected:** 
- Pagination should work
- Should make API calls with `offset` parameter
- Should update URL with page parameter

**Actual:** 
- Hardcoded, non-functional buttons
- No pagination logic

---

## 🟠 HIGH PRIORITY ISSUES

### 5. Price Preset Selector Doesn't Update Slider
**Location:** `client/src/components/FilterSidebar.tsx` (lines 461-472)  
**Issue:** The price preset dropdown (`select-price-preset`) has `defaultValue="all"` but no `onValueChange` handler. Selecting a preset doesn't update the price range slider.  
**Impact:** Users cannot quickly select common price ranges.

**Steps to Reproduce:**
1. Open filter sidebar
2. Expand "Price Range" accordion
3. Select a preset (e.g., "50L - 1 Cr")
4. Slider doesn't update

**Expected:** Slider updates to match selected preset  
**Actual:** Slider remains unchanged

---

### 6. Hero Section Transaction Type Tabs Don't Navigate
**Location:** `client/src/components/HeroSection.tsx` (lines 141-173)  
**Issue:** Clicking "Buy", "Lease", or "Rent" tabs only updates local state. Doesn't navigate to `/buy`, `/lease`, or `/rent` pages.  
**Impact:** Users expect navigation but only see UI change.

**Steps to Reproduce:**
1. Go to home page
2. Click "Lease" or "Rent" tab
3. URL doesn't change
4. Page doesn't navigate

**Expected:** Should navigate to `/lease` or `/rent` with appropriate filters  
**Actual:** Only updates local state

---

### 7. Budget Filter in Hero Section Doesn't Map to Price Ranges
**Location:** `client/src/components/HeroSection.tsx`  
**Issue:** Budget dropdown values like "under-25l", "25l-50l" don't map to actual price ranges when searching. The `budget` value is passed but never used.  
**Impact:** Budget selection has no effect on search results.

**Steps to Reproduce:**
1. Select a budget range in hero section
2. Search for properties
3. Budget filter is ignored

**Expected:** Budget should filter properties by price range  
**Actual:** Budget value is ignored

---

### 8. Save Search Button Shows for Guest Users
**Location:** `client/src/components/FilterSidebar.tsx` (lines 604-656)  
**Issue:** "Save Search" button is conditionally rendered only if `user` exists, but the button is still visible in the UI structure. When clicked by guest, it should show login prompt or be hidden.  
**Impact:** Confusing UX for guest users.

**Steps to Reproduce:**
1. Go to `/listings` as guest (not logged in)
2. Scroll to bottom of filter sidebar
3. See "Save Search" button
4. Click it
5. Dialog opens but requires login (should show login prompt first)

**Expected:** 
- Button should be hidden for guests, OR
- Should redirect to login with return URL

**Actual:** Dialog opens but fails silently if not logged in

---

## 🟡 MEDIUM PRIORITY ISSUES

### 9. Home Page Falls Back to Hardcoded Sample Properties
**Location:** `client/src/pages/HomePage.tsx` (lines 188, 216)  
**Issue:** If API returns empty array, component falls back to `sampleFeaturedProperties` and `sampleNewProperties`. This masks API failures and shows fake data.  
**Impact:** Users see fake properties when API fails.

**Steps to Reproduce:**
1. Disable API or make it return empty array
2. Go to home page
3. See sample properties displayed

**Expected:** Should show "No properties available" message  
**Actual:** Shows hardcoded sample properties

---

### 10. Filter Sidebar City Sync Issue with Header City Selector
**Location:** `client/src/components/FilterSidebar.tsx` (lines 74-79)  
**Issue:** `useEffect` syncs header city to filter sidebar city, but this can cause conflicts. If user selects city in header, it auto-updates filter sidebar, but if user then changes filter sidebar city, it might conflict.  
**Impact:** Confusing filter state management.

**Steps to Reproduce:**
1. Select city in header
2. Filter sidebar city auto-updates
3. Change city in filter sidebar
4. Header city and filter sidebar city might be out of sync

**Expected:** Clear precedence rules for city selection  
**Actual:** Potential conflicts

---

### 11. Property Age Filter Logic May Be Incorrect
**Location:** `client/src/pages/ListingsPage.tsx` (lines 210-220)  
**Issue:** Property age filter checks `ageOfProperty` but the logic for "new" (age === 0 or undefined) might not match all new construction properties. Also, `ageOfProperty` is stored as string but parsed as integer.  
**Impact:** Some new properties might not show when "new" is selected.

**Steps to Reproduce:**
1. Apply "New Construction" filter
2. Some new properties might be missing

**Expected:** All new/under-construction properties should show  
**Actual:** Logic might exclude some properties

---

### 12. BHK Filter Format Mismatch
**Location:** `client/src/components/FilterSidebar.tsx` vs `client/src/pages/ListingsPage.tsx`  
**Issue:** Filter sidebar uses "1 BHK", "2 BHK", "3 BHK", "4+ BHK" but filter logic expects "1", "2", "3", "5+" format.  
**Impact:** BHK filter might not work correctly.

**Steps to Reproduce:**
1. Select "2 BHK" in filter sidebar
2. Apply filters
3. Check if 2 BHK properties show

**Expected:** Should filter correctly  
**Actual:** Format mismatch might cause issues

---

### 13. Seller Type Filter Uses "Corporate" But Data Uses "Builder"
**Location:** `client/src/components/FilterSidebar.tsx` (line 501) vs `client/src/pages/ListingsPage.tsx`  
**Issue:** Filter sidebar has "Corporate" option but property data uses "Builder" as sellerType. Filter logic checks for exact match.  
**Impact:** "Corporate" filter won't match "Builder" properties.

**Steps to Reproduce:**
1. Select "Corporate" seller type
2. Apply filters
3. Builder properties don't show

**Expected:** "Corporate" should match "Builder" properties  
**Actual:** No match due to string mismatch

---

### 14. Locality Filter Uses Text Input But No Autocomplete
**Location:** `client/src/components/FilterSidebar.tsx` (lines 432-437)  
**Issue:** Locality is a free-text input with no autocomplete or suggestions. Users might misspell or use different formats.  
**Impact:** Poor UX, potential filtering errors.

**Steps to Reproduce:**
1. Select a city
2. Try to enter locality
3. No suggestions appear
4. Must type exact locality name

**Expected:** Autocomplete with locality suggestions  
**Actual:** Free text input only

---

## 🔵 LOW PRIORITY ISSUES

### 15. Map View May Not Work Without API Key
**Location:** `client/src/pages/ListingsPage.tsx` (line 352)  
**Issue:** `PropertyMapView` component is used but might require Google Maps API key. If not configured, map won't display.  
**Impact:** Map view feature broken for guests.

**Steps to Reproduce:**
1. Go to `/listings`
2. Click map view icon
3. Map might not load

**Expected:** Map should load or show error message  
**Actual:** Might fail silently

---

### 16. No Loading State for Filter Application
**Location:** `client/src/pages/ListingsPage.tsx`  
**Issue:** When filters are applied, there's no loading indicator. If filtering is slow (client-side), users don't know something is happening.  
**Impact:** Poor UX during filter application.

**Steps to Reproduce:**
1. Apply multiple filters
2. Click "Apply Filters"
3. No loading indicator
4. Results update after delay

**Expected:** Loading spinner or skeleton  
**Actual:** No feedback

---

### 17. Filter Count Badge Doesn't Update
**Location:** `client/src/components/FilterSidebar.tsx` (lines 260-269, 277-279)  
**Issue:** Active filters count badge shows count but doesn't update when filters are cleared or changed without applying.  
**Impact:** Badge shows incorrect count.

**Steps to Reproduce:**
1. Select multiple filters
2. Badge shows count
3. Clear a filter (but don't apply)
4. Badge still shows old count

**Expected:** Badge should update immediately  
**Actual:** Only updates after "Apply Filters"

---

### 18. No "Clear All Filters" Confirmation
**Location:** `client/src/components/FilterSidebar.tsx` (line 284)  
**Issue:** "Clear All" button immediately clears all filters without confirmation. If user accidentally clicks, all filter work is lost.  
**Impact:** Accidental data loss.

**Steps to Reproduce:**
1. Apply multiple filters
2. Accidentally click "Clear All"
3. All filters cleared immediately

**Expected:** Confirmation dialog for "Clear All"  
**Actual:** Immediate clear

---

### 19. Mobile Filter Sheet Doesn't Show Applied Filters
**Location:** `client/src/pages/ListingsPage.tsx` (lines 323-340)  
**Issue:** Mobile filter sheet opens but doesn't show which filters are currently applied. User must remember what they selected.  
**Impact:** Poor mobile UX.

**Steps to Reproduce:**
1. Apply filters on desktop
2. Switch to mobile view
3. Open filter sheet
4. Can't see which filters are active

**Expected:** Filter sheet should show active filters  
**Actual:** Shows default state

---

### 20. No Error Handling for API Failures
**Location:** `client/src/pages/HomePage.tsx`, `client/src/pages/ListingsPage.tsx`  
**Issue:** If API calls fail, components fall back to empty arrays or sample data without showing error message to user.  
**Impact:** Users don't know when something goes wrong.

**Steps to Reproduce:**
1. Disable API endpoint
2. Go to home page or listings
3. No error message shown
4. Shows empty state or sample data

**Expected:** Error message or retry button  
**Actual:** Silent failure

---

## Summary

**Total Issues Found:** 20
- **Critical:** 4
- **High:** 4
- **Medium:** 6
- **Low:** 6

**Key Problems:**
1. Hero search doesn't work
2. Filters are client-side only (no API integration)
3. Filter chips are hardcoded and non-functional
4. Pagination is non-functional
5. Multiple filter format mismatches
6. Poor error handling and loading states

**Recommendations:**
1. Implement proper API integration for filters
2. Add URL parameter support for filters
3. Fix hero section search navigation
4. Implement functional pagination
5. Fix filter format mismatches
6. Add proper error handling and loading states
7. Make filter chips functional and dynamic
