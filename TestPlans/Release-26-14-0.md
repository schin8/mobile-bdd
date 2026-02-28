# Release 26.14.0 — UAT Test Execution

**Version:** 1.0
**Date:** 2026-02-27
**Environment:** Non-Production (Staging / QA)
**Prepared by:** QA Team

---

## General Prerequisites

| Item | Details |
|------|---------|
| **Environments** | Staging, Production |
| **Staging URL** | https://stage.intelycare.com/ (redirects to https://stage.intelycare.com/jobs/) |
| **Test Email** | Use [Mailinator](https://www.mailinator.com) when a real email address is required |
| **Magic Code** | Use the agreed-upon static verification code (magic code) — available in Staging only |
| **Devices / Browsers** | Android (Chrome), iOS (Safari) |

---

## Test Cases

### UAT-TC-01: Login / Sign Up

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-01 |
| **Module** | Authentication |
| **Objective** | Verify a new or existing user can sign up or log in using an email address |
| **Note** | The login and sign-up flows share the same form — the user enters an email and is directed to the Verify Code screen. Email is the only required field. All other profile information is provided later under My Profile. |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to https://stage.intelycare.com/, click hamburger click "Nursing Jobs" | . Page loads and redirects to https://stage.intelycare.com/jobs/ | ✅ | Updated  Step                   |
| 2 | Click the "Login/Sign Up" link | Login/Sign Up form is displayed with an email field | ✅ | |
| 3 | Enter a valid email address (new or existing) and click "Continue." | User is redirected to the Verify Code screen | ✅ | |
| 4 | Enter an invalid email format (e.g., "testuser", "test@") and click "Continue." | A validation error is displayed (e.g., "Enter a valid email address") | ✅ | Should "Continue" not have focus? |
| 5 | Leave the email field empty and click "Continue." | A validation error (email is required) is displayed an pressing Continue is not possible. | ✅ | |

---

### UAT-TC-02: Verify Code

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-02 |
| **Module** | Authentication — Code Verification |
| **Objective** | Verify that the verification code flow works correctly |
| **Precondition** | User has entered a valid email in UAT-TC-01 and is on the Verify Code screen |

#### UAT-TC-02.1: Invalid Code

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | On the Verify Code screen, enter a non-numeric value (e.g., "abcdef", "123abc") | Verify button remains disabled | ✅ | iOS - numeric keypad only |
| 2 | Enter fewer digits than required. | Verify button remains disabled | ✅ | |
| 3 | Enter an incorrect numeric code (any value except the magic number) and submit. | Error message is displayed (e.g., "Failed to verify code. Please try again.") | ✅ | |
| 4 | ~~Enter an expired code (if applicable) and submit~~ | ~~Error message indicates code has expired~~ | NA | NA |
| 5 | ~~Exceed maximum invalid attempts (if rate-limited)~~ | ~~Account is temporarily locked or appropriate message is shown~~ | NA | NA |

#### UAT-TC-02.2: Valid Code

##### UAT-TC-02.2.a: Existing User

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | On the Verify Code screen, enter the **magic code** (Staging) or the real code from Mailinator/email (Production) and submit | Code is accepted; user is authenticated and redirected to the Home page | ✅ | |
| 2 | Verify the user's email is displayed on the profile button | Profile button shows the authenticated user's email address | NA | Mobile device do not show this info |
| 3 | Verify session is established | User remains logged in on subsequent page navigations | ✅ | |

##### UAT-TC-02.2.b: New User

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | On the Verify Code screen, enter the **magic code** (Staging) or the real code from Mailinator/email (Production) and submit | Code is accepted; "Create Your Account" dialog is displayed | ✅ | |
| 2 | Verify the dialog contains required fields: First Name, Last Name, Phone Number, Zip Code, Disciplines, and optional Specialty | All fields are present; "Create Account" button is disabled | ✅ | |
| 3 | Leave one or more required fields empty | "Create Account" button remains disabled | ✅ | |
| 4 | Fill in all required fields (First Name, Last Name, Phone Number, Zip Code, Disciplines) | "Create Account" button becomes enabled | ✅ | |
| 5 | Click "Create Account" | Account is created; user is authenticated and redirected to the Home page | ✅ | |
| 6 | Verify the user's email is displayed on the profile button | Profile button shows the authenticated user's email address | NA | Invalid test |
| 7 | Verify session is established | User remains logged in on subsequent page navigations | ❌ | session is not established, I must log again |

---

### UAT-TC-03: Resend Code

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-03 |
| **Module** | Authentication — Resend Verification Code |
| **Objective** | Verify that a user can request a new verification code |
| **Precondition** | User has entered a valid email in UAT-TC-01 and is on the Verify Code screen |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | On the Verify Code screen, click the "Resend code" link. | Toast message is displayed: "A verification code has been re-sent to your email address. Please allow 60 seconds for delivery." | ✅ | |
| 2 | Wait for the toast to auto-dismiss. | Toast disappears after a few seconds | ✅ | |
| 3 | Enter the **magic code** (Staging) or newly received code from Mailinator/email (Production).✅ | Code is accepted; user is authenticated | ✅ | |
| 4 | ~~Click "Resend Code" multiple times in rapid succession~~ | ~~Rate-limiting or cooldown message is displayed~~ | NA | NA |

---

### UAT-TC-04: My Profile — Resume Upload

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-04 |
| **Module** | Profile — Resume Upload |
| **Objective** | Verify resume upload functionality with file type and size validations |
| **Precondition** | User is logged in |

#### UAT-TC-04.1: Resume Upload — File Size < 10 MB

##### UAT-TC-04.1.a: Valid File Type

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click the hamburger menu icon | Opens new screen | ✅ | |
| 2 | Click "My Profile" menu item. | Profile page is displayed with the resume upload section     | ✅         | "Upload your resume to enhance your profile visibility." |
| 3 | Click "Add Resume" button | File picker dialog opens | ✅ | |
| 4 | Select a valid file type (e.g., `.pdf`, `.doc`, `.docx`) under 10 MB | File is selected | ✅ | |
| 5 | Confirm / submit upload | Resume is uploaded successfully; profile displays "Current Resume: " followed by the uploaded file name | ✅ | |

##### UAT-TC-04.1.b: Invalid File Type

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click the hamburger menu icon | Menu drawer/overlay opens | ✅ | |
| 2 | Click "My Profile" menu item | Profile page is displayed | ✅ | |
| 3 | Attempt to upload an invalid file type (e.g., `.exe`, `.png`, `.zip`) under 10 MB | Error message is displayed (e.g., "Unsupported file type") or you should not be able to select | ✅ | Cannot select invalid type |
| 4 | Verify no file is saved to the profile | Resume section remains unchanged | ✅ | |

#### UAT-TC-04.2: Resume Upload — File Size >= 10 MB

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click the hamburger menu icon | Menu drawer/overlay opens | ✅ | |
| 2 | Click "My Profile" menu item | Profile page is displayed | ✅ | |
| 3 | Attempt to upload a valid file type that is >= 10 MB | Error message is displayed (e.g., "File size exceeds the 10MB limit.") | ✅ | |
| 4 | Verify no file is saved to the profile | Resume section remains unchanged | ✅ | |

---

### UAT-TC-05: Home Page — Job Search

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-05 |
| **Module** | Home Page — Job Search |
| **Objective** | Verify job search, filters, and job application |
| **Precondition** | User is logged in |

#### UAT-TC-05.1: Apply Job Search Filters

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to Home Page | Filter bar with "Begin Your Search Here" is visible | ✅ | |
| 2 | Tap on the filter bar or the search button. | Search modal opens with fields: Role, Keywords, Location, "Only remote jobs" checkbox, and Apply / Reset buttons | ✅ | |
| 3 | Fill in one or more fields (e.g., Role, Keywords, Location) and/or check "Only remote jobs". | Fields accept input | ✅ | |
| 4 | Click "Apply". | Modal closes; results are filtered using the provided criteria; only matching jobs are displayed | ✅ | |

#### UAT-TC-05.2: Reset Job Filters

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Tap on the filter bar or search button to open the search modal. | Search modal opens with previously applied filter values populated | ✅ | |
| 2 | Click "Reset". | All fields are cleared (Role, Keywords, Location, "Only remote jobs" checkbox) | ❌ | The cleared data seems to be applied after this step |
|      | Click "Apply" (with cleared filters). | Modal closes; full, unfiltered job results are displayed. | ❌ | never got to this point |

#### UAT-TC-05.3: Apply for Job

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | From search results, select a job listing | Job detail page is displayed | | |
| 2 | Click the "Apply Now" or "Easy Apply" button | Application flow is initiated (form, confirmation, or redirect) | | |
| 3 | Complete application and submit | Success message is displayed; job appears in "My Applications" | | |

---

### UAT-TC-06: Home Page — Carousel — Browse Opportunities by Nursing Role

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-06 |
| **Module** | Home Page — Role Carousel |
| **Objective** | Verify the nursing role carousel functions correctly |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to the Home Page | Carousel section "Browse opportunities by nursing role" is visible | | |
| 2 | Scroll/swipe through the carousel | Carousel navigates smoothly between role cards | | |
| 3 | Click on a nursing role card | User is navigated to a filtered job listing for that role | | |
| 4 | Verify carousel position indicator | Dash-style indicator is displayed: a long dash represents the current position, short dashes represent other positions; indicator updates as user scrolls | | |

---

### UAT-TC-07: Home Page — Featured Employers Carousel & View All

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-07 |
| **Module** | Home Page — Featured Employers |
| **Objective** | Verify the Featured Employers carousel and "View All" link work correctly |

#### UAT-TC-07.1: Featured Employers Carousel

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to the Home Page | "Featured Employers" carousel section is visible | | |
| 2 | Scroll/swipe through the carousel | Carousel navigates smoothly between employer cards | | |
| 3 | Click on an employer card | User is navigated to that employer's detail page or filtered job results | | |
| 4 | Verify carousel position indicator | Dash-style indicator is displayed: a long dash represents the current position, short dashes represent other positions; indicator updates as user scrolls | | |

#### UAT-TC-07.2: View All Healthcare Employers

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to the Home Page | "Featured Employers" section is visible with a "View All Healthcare Employers" link | | |
| 2 | Click "View All Healthcare Employers" | Full list/page of healthcare employers is displayed | | |
| 3 | Click on an individual employer | Employer detail page or filtered job results are shown | | |

---

### UAT-TC-08: Home Page — Browse Latest Nursing & Nursing Support Jobs

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-08 |
| **Module** | Home Page — Latest Jobs |
| **Objective** | Verify the latest jobs section displays and links correctly |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to the Home Page | "Latest Nursing & Nursing Support Jobs" section is visible | | |
| 2 | Verify job listings are displayed | Job cards show title, employer, location, and key details | | |
| 3 | Click on a job listing | Job detail page is displayed | | |
| 4 | Click "Browse All Jobs" / "View More" (if present) | Full job listing page is displayed | | |

---

### UAT-TC-09: Footer Text Links

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-09 |
| **Module** | Footer |
| **Objective** | Verify all footer text links navigate correctly |
| **Note** | In the Pre-Production/Stage environment, only step 1 may be valid |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Scroll to the page footer | Footer is visible; currently displays "test" placeholder text | | |
| 2 | If links are present, click each text link in the footer | Each link navigates to the correct destination page | NA | Footer currently has no links; re-test when real content is added |
| 3 | Verify no broken links (404 errors) | All pages load successfully | NA | Footer currently has no links; re-test when real content is added |
| 4 | Verify external links open in a new tab (if applicable) | External links open in new tab/window | NA | Footer currently has no links; re-test when real content is added |

---

### UAT-TC-10: Home Page — Chat Box

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-10 |
| **Module** | Home Page — Chat Box |
| **Objective** | Verify the chat box widget opens and functions |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to the Home Page | Chat box icon/widget is visible | | |
| 2 | Click the chat box icon | Chat window opens | | |
| 3 | Type a message and send | Message is sent; a response or acknowledgment is received | | |
| 4 | Close the chat window | Chat window closes; icon returns to default state | | |

---

### UAT-TC-11: Jobs — Share Jobs Through Social Media

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-11 |
| **Module** | Jobs — Social Media Sharing |
| **Objective** | Verify job sharing via social media icons |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to a job detail page | Social media share icons are visible | | |
| 2 | Click the Facebook share icon | Facebook share dialog opens with job details pre-populated | | |
| 3 | Click the Twitter/X share icon | Twitter/X share dialog opens with job details pre-populated | | |
| 4 | Click the LinkedIn share icon | LinkedIn share dialog opens with job details pre-populated | | |
| 5 | Click any other share icons present (e.g., email, copy link) | Corresponding share action is triggered | | |

---

### UAT-TC-12: Jobs — Apply via "Apply Now" Button

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-12 |
| **Module** | Jobs — Apply Now |
| **Objective** | Verify the "Apply Now" button initiates the application process |
| **Note** | This test case overlaps significantly with UAT-TC-05.3 (Apply for Job). Step 4 (verify in "My Applications") is the only addition. Consider folding UAT-TC-12 into UAT-TC-05.3 in a future revision if appropriate. |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to a job detail page | "Apply Now" button is visible | | |
| 2 | Click "Apply Now" | Application flow is initiated | | |
| 3 | Complete all required fields and submit | Application is submitted successfully; confirmation is displayed | | |
| 4 | Verify the job appears in "My Applications" | Applied job is listed with correct status | | |

---

### UAT-TC-13: Hamburger Menu — Job Search

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-13 |
| **Module** | Navigation — Hamburger Menu |
| **Objective** | Verify Job Search is accessible from the hamburger menu |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click the hamburger menu icon | Menu drawer/overlay opens | | |
| 2 | Click "Job Search" menu item | User is navigated to the Job Search page | | |
| 3 | Verify Job Search page loads correctly | Filter bar with "Begin Your Search Here" is displayed | | |

---

### UAT-TC-14: Hamburger Menu — My Applications

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-14 |
| **Module** | Navigation — Hamburger Menu |
| **Objective** | Verify My Applications is accessible from the hamburger menu |
| **Precondition** | User has applied to at least one job |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click the hamburger menu icon | Menu drawer/overlay opens | | |
| 2 | Click "My Applications" menu item | User is navigated to the My Applications page | | |
| 3 | Verify previously applied jobs are listed | Applied jobs appear with correct status (e.g., Submitted, Under Review) | | |

---

### UAT-TC-15: Log Out

| Field | Details |
|-------|---------|
| **ID** | UAT-TC-15 |
| **Module** | Authentication — Log Out |
| **Objective** | Verify a user can successfully log out |
| **Precondition** | User is logged in |

| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click the logout option (via hamburger menu or profile menu) | User is logged out and redirected to the Home / Log In page | | |
| 2 | Attempt to navigate to a protected page (e.g., My Profile) | User is redirected to the Log In page | | |
| 3 | Press the browser back button after logout | User is NOT returned to an authenticated state | | |

---

## Test Execution Summary

| Metric | Count |
|--------|-------|
| **Total Test Cases** | 15 (22 including sub-cases) |
| **Total Test Steps** | ~88 (~6 currently NA) |
| **Passed** | |
| **Failed** | |
| **Blocked** | |
| **Not Executed** | |

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead | | | |
| Product Owner | | | |
| Project Manager | | | |
