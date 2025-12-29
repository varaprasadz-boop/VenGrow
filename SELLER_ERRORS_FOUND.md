# Seller Functionality Errors and Bugs Report

## Summary
This document lists all errors, bugs, and missing functionality found during comprehensive testing of seller pages and features. Issues are categorized by severity and type.

---

## 🔴 CRITICAL ISSUES (High Priority)

### 1. **DashboardPage.tsx - Missing API Endpoint `/api/seller/stats`**
   - **Location**: `client/src/pages/seller/DashboardPage.tsx` (line 59)
   - **Issue**: Component queries `/api/seller/stats` endpoint which doesn't exist in `server/routes.ts`
   - **Impact**: Dashboard page will fail to load statistics, showing error state
   - **Fix Required**: Create `GET /api/seller/stats` endpoint or update component to use existing endpoints

### 2. **PropertyPhotosPage.tsx - Missing onClick Handlers**
   - **Location**: `client/src/pages/seller/PropertyPhotosPage.tsx`
   - **Issues**:
     - Line 28: "Upload Photos" button (`data-testid="button-upload"`) has no `onClick` handler
     - Line 46: "Browse Files" button has no `onClick` handler
     - Lines 67-100: Photo action buttons (Up, Down, View, Delete) have no `onClick` handlers
   - **Impact**: Users cannot upload, reorder, view, or delete photos
   - **Fix Required**: Implement handlers for all photo management actions

### 3. **PropertyBoostPage.tsx - Missing onClick Handlers**
   - **Location**: `client/src/pages/seller/PropertyBoostPage.tsx`
   - **Issues**:
     - Lines 105-111: "Boost Now" buttons (`data-testid="button-boost-{plan.id}"`) have no `onClick` handlers
   - **Impact**: Users cannot purchase boost plans for their properties
   - **Fix Required**: Implement boost purchase functionality with API integration

### 4. **PropertyPromotionPage.tsx - Missing onClick Handlers**
   - **Location**: `client/src/pages/seller/PropertyPromotionPage.tsx`
   - **Issues**:
     - Lines 156-162: "Get Started" buttons (`data-testid="button-select-{index}"`) have no `onClick` handlers
   - **Impact**: Users cannot select and purchase promotion packages
   - **Fix Required**: Implement promotion package selection and purchase flow

### 5. **AnalyticsDashboardPage.tsx - Missing onClick Handlers**
   - **Location**: `client/src/pages/seller/AnalyticsDashboardPage.tsx`
   - **Issues**:
     - Line 95: "Date Range" button (`data-testid="button-date-range"`) has no `onClick` handler
     - Line 99: "Export" button (`data-testid="button-export"`) has no `onClick` handler
   - **Impact**: Users cannot filter analytics by date range or export data
   - **Fix Required**: Implement date range picker dialog and export functionality

### 6. **EarningsPage.tsx - Missing onClick Handler**
   - **Location**: `client/src/pages/seller/EarningsPage.tsx`
   - **Issues**:
     - Line 77: "Withdraw Funds" button (`data-testid="button-withdraw"`) has no `onClick` handler
   - **Impact**: Users cannot initiate fund withdrawals
   - **Fix Required**: Implement withdrawal flow (navigate to withdraw page or open dialog)

### 7. **WithdrawFundsPage.tsx - Missing onClick Handler and Hardcoded Data**
   - **Location**: `client/src/pages/seller/WithdrawFundsPage.tsx`
   - **Issues**:
     - Line 16: `availableBalance` is hardcoded to `45000` instead of fetching from API
     - Line 124: "Withdraw Funds" button (`data-testid="button-withdraw"`) has no `onClick` handler
     - Lines 54-66: Bank account selection is hardcoded instead of fetching from user profile
   - **Impact**: Users cannot withdraw funds, and balance/bank accounts are not dynamic
   - **Fix Required**: Fetch balance from API, implement withdrawal mutation, fetch bank accounts from user profile

### 8. **PropertySEOPage.tsx - Missing onClick Handler**
   - **Location**: `client/src/pages/seller/PropertySEOPage.tsx`
   - **Issues**:
     - Line 90: "Save SEO Settings" button (`data-testid="button-save"`) has no `onClick` handler
     - Lines 31, 42, 54: Form inputs use `defaultValue` instead of controlled state
   - **Impact**: Users cannot save SEO settings for properties
   - **Fix Required**: Implement form state management and save mutation

### 9. **PropertyRenewalPage.tsx - Missing onClick Handlers and Hardcoded Data**
   - **Location**: `client/src/pages/seller/PropertyRenewalPage.tsx`
   - **Issues**:
     - Lines 8-15: Listing data is hardcoded instead of fetching from API
     - Lines 94-99: "Select" buttons (`data-testid="button-renew-{index}"`) have no `onClick` handlers
   - **Impact**: Users cannot renew listings, and data is static
   - **Fix Required**: Fetch property data from API, implement renewal purchase flow

### 10. **PropertyExpiryPage.tsx - Missing onClick Handlers and Hardcoded Data**
   - **Location**: `client/src/pages/seller/PropertyExpiryPage.tsx`
   - **Issues**:
     - Lines 8-36: Property data is hardcoded instead of fetching from API
     - Line 96-100: "Renew" buttons (`data-testid="button-renew-{property.id}"`) have no `onClick` handlers
     - Line 120: "Renew All" button has no `onClick` handler
   - **Impact**: Users cannot renew expiring/expired properties, and data is static
   - **Fix Required**: Fetch properties from API, implement renewal flow

### 11. **PropertySoldPage.tsx - Missing onClick Handlers**
   - **Location**: `client/src/pages/seller/PropertySoldPage.tsx`
   - **Issues**:
     - Line 70: "Download Report" button has no `onClick` handler
     - Line 73: "List Another Property" button (`data-testid="button-list-another"`) has no `onClick` handler
   - **Impact**: Users cannot download reports or navigate to create new listing
   - **Fix Required**: Implement report download and navigation to create property page

### 12. **VerificationCenterPage.tsx - Hardcoded Data**
   - **Location**: `client/src/pages/seller/VerificationCenterPage.tsx`
   - **Issues**:
     - Lines 8-38: Verification data is hardcoded instead of fetching from API
   - **Impact**: Verification status is not dynamic and doesn't reflect actual user verification state
   - **Fix Required**: Fetch verification data from API endpoint

### 13. **DocumentVerificationPage.tsx - Missing onClick Handler and Hardcoded Data**
   - **Location**: `client/src/pages/seller/DocumentVerificationPage.tsx`
   - **Issues**:
     - Lines 8-35: Document data is hardcoded instead of fetching from API
     - Line 77: "Upload Document" button (`data-testid="button-upload"`) has no `onClick` handler
   - **Impact**: Users cannot upload documents, and document list is static
   - **Fix Required**: Fetch documents from API, implement document upload functionality

---

## 🟡 MEDIUM PRIORITY ISSUES

### 14. **MessagesPage.tsx - Hardcoded Data and Missing Functionality**
   - **Location**: `client/src/pages/seller/MessagesPage.tsx`
   - **Issues**:
     - Lines 12-37: Conversations are hardcoded
     - Lines 39-58: Messages are hardcoded
     - Line 78: Search input has no `onChange` handler (only `data-testid`)
     - Line 130: Send button has no `onClick` handler
   - **Impact**: Messaging functionality is non-functional
   - **Fix Required**: Fetch conversations/messages from API, implement send message functionality

### 15. **PropertyPhotosPage.tsx - Hardcoded Photo Data**
   - **Location**: `client/src/pages/seller/PropertyPhotosPage.tsx`
   - **Issues**:
     - Lines 7-14: Photos array is hardcoded
     - Line 25: Property title/location is hardcoded
   - **Impact**: Photo management doesn't reflect actual property photos
   - **Fix Required**: Fetch property photos from API, use property ID from route params

### 16. **PropertyBoostPage.tsx - Hardcoded Property Data**
   - **Location**: `client/src/pages/seller/PropertyBoostPage.tsx`
   - **Issues**:
     - Lines 8-14: Property data is hardcoded
   - **Impact**: Boost page doesn't show actual property stats
   - **Fix Required**: Fetch property data from API using property ID from route

### 17. **PropertyPromotionPage.tsx - Hardcoded Data**
   - **Location**: `client/src/pages/seller/PropertyPromotionPage.tsx`
   - **Issues**:
     - Lines 8-48: Promotion packages are hardcoded
     - Lines 50-60: Active promotions are hardcoded
   - **Impact**: Promotion packages and active promotions are not dynamic
   - **Fix Required**: Fetch promotion packages and active promotions from API

### 18. **AnalyticsDashboardPage.tsx - Unused API Query**
   - **Location**: `client/src/pages/seller/AnalyticsDashboardPage.tsx`
   - **Issues**:
     - Line 26-28: Queries `/api/me/dashboard` but doesn't use `dashboardStats` data
     - Component calculates stats from properties array instead
   - **Impact**: Unnecessary API call, potential inconsistency
   - **Fix Required**: Either use `dashboardStats` data or remove the query

---

## 🟢 LOW PRIORITY ISSUES (Enhancements)

### 19. **PropertySEOPage.tsx - Hardcoded SEO Score**
   - **Location**: `client/src/pages/seller/PropertySEOPage.tsx`
   - **Issues**:
     - Line 64: SEO score is hardcoded to `85`
   - **Impact**: SEO score doesn't reflect actual property optimization
   - **Fix Required**: Calculate SEO score based on actual property data

### 20. **PropertySoldPage.tsx - Hardcoded Sold Data**
   - **Location**: `client/src/pages/seller/PropertySoldPage.tsx`
   - **Issues**:
     - Lines 8-17: Sold property details are hardcoded
   - **Impact**: Page doesn't show actual sold property data
   - **Fix Required**: Fetch sold property data from API using property ID

### 21. **EarningsPage.tsx - Missing Withdrawal API Integration**
   - **Location**: `client/src/pages/seller/EarningsPage.tsx`
   - **Issues**:
     - Withdrawal functionality should navigate to `/seller/withdraw` or open a dialog
   - **Impact**: Incomplete user flow
   - **Fix Required**: Add navigation or dialog for withdrawal

---

## 📋 MISSING API ENDPOINTS

The following API endpoints are referenced but don't exist in `server/routes.ts`:

1. `GET /api/seller/stats` - Used by `DashboardPage.tsx`
2. `POST /api/properties/:id/boost` - For property boost purchases
3. `POST /api/properties/:id/promote` - For property promotion purchases
4. `POST /api/properties/:id/renew` - For property renewal
5. `GET /api/properties/:id/photos` - For fetching property photos
6. `POST /api/properties/:id/photos` - For uploading property photos
7. `DELETE /api/properties/:id/photos/:photoId` - For deleting photos
8. `PATCH /api/properties/:id/photos/reorder` - For reordering photos
9. `PATCH /api/properties/:id/seo` - For updating SEO settings
10. `GET /api/me/verifications` - For fetching verification status
11. `POST /api/me/documents` - For uploading documents
12. `GET /api/me/documents` - For fetching documents
13. `GET /api/me/conversations` - For fetching conversations
14. `GET /api/conversations/:id/messages` - For fetching messages
15. `POST /api/conversations/:id/messages` - For sending messages
16. `GET /api/me/balance` - For fetching available balance
17. `GET /api/me/bank-accounts` - For fetching bank accounts
18. `POST /api/withdrawals` - For creating withdrawal requests

---

## 🔧 SUMMARY BY CATEGORY

### Missing onClick Handlers: 15+ buttons
### Hardcoded Data: 10+ pages
### Missing API Endpoints: 18 endpoints
### Missing Functionality: Photo upload, boost purchase, promotion purchase, renewal, withdrawal, SEO save, document upload, messaging

---

## 📝 NOTES

- Many pages have proper structure but lack backend integration
- Several pages use hardcoded data that should come from API
- Button handlers are missing across multiple pages
- Some pages need route parameter handling (property ID, etc.)
- Error handling and loading states are generally good where implemented

---

**Total Issues Found: 21+**
**Critical Issues: 13**
**Medium Priority: 5**
**Low Priority: 3**
