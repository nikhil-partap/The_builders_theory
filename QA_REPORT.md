# RaktDoot live QA report

Reviewed 22 Nov 2026, read-only, in Chrome. I placed no calls and submitted no real phone numbers.

- **Landing page:** https://raktdoot.serverpod.space/
- **App:** https://raktdoot.serverpod.space/app/, covering Find blood, My requests, a request link, donor sign-up, Manage donor, About and the Desk.

**What I could not cover**
- **Phone width (390px):** Chrome would not shrink the window below desktop size, so I didn't check the live site on a phone layout. Run this check next, in device mode.
- **Request status page with a real request:** I'd have had to submit a request, which places calls, so I didn't. I only saw its error state.

---

## P0: fix before anyone uses it

### 1. Contact links go to a placeholder address
- **Page:** `privacy.html` and `terms.html`, every "Write to us" and "Contact us" link.
- **Screenshot:** The privacy page's Contact us section. "write to us" is underlined and links to `mailto:privacy@example.com`.
- **Problem:** There is no real way to opt out, delete data or report misuse. That breaks the opt-out and DPDP promises the policy makes.
- **Fix:** Use a real monitored inbox, for example `privacy@raktdoot.in`, on every contact link. Add a WhatsApp or phone line too. Check that the "Partner with us" form (which opens an email app) doesn't also point to `example.com`.

### 2. Anyone can stop calls or delete data for any number
- **Page:** `/app/#/manage`
- **Screenshot:** The Manage donor screen with one "Mobile number" field, a "Last donation date" picker, a "Stop all calls" button and a "Delete my data" link. There's no verification step.
- **Problem:** Typing someone else's number lets you remove them, or change their last donation date.
- **Fix:** Send a one-time code by SMS or call to that number before any change. After that, show the donor's own details (group, area, opted-in status).

### 3. Donor sign-up never checks the number belongs to the person
- **Page:** `/app/#/donor`
- **Screenshot:** The sign-up form: Name, Blood group, Area, Mobile number, a consent tickbox and "Sign up as a donor". There is no code step.
- **Problem:** The terms say "sign up with your own mobile number", but nothing enforces it. Someone could sign up strangers to receive AI calls.
- **Fix:** Confirm the number with a one-time code, or a confirmation call, before activating the donor.

### 4. "Track a request" lands on Find blood instead of a lookup
- **Page:** Landing nav, hero and footer "Track a request", all pointing to `/app/#/r/`.
- **Screenshot:** You click Track a request and get the Find blood form, with no lookup field.
- **Problem:** A family on another phone, or one that cleared the browser, has no way to find their request.
- **Fix:** Make `/app/#/r/` a lookup page with a "Request link or code" field. Optionally add lookup by the phone number given with the request, verified with a code.

### 5. The About page contradicts the landing page
- **Page:** `/app/#/about`
- **Screenshot:** About RaktDoot reads "built for The Builder's Theory 1.0 hackathon" and "Pilot status: Bank calls go to our team, not to real blood banks… Blood bank names shown are examples."
- **Problem:** The landing page presents a real service that holds real blood. The app then says nothing is real, which destroys trust either way. It's leftover prototype wording.
- **Fix:** Pick one truth:
  - If it's a pilot, say so clearly on the landing page and the Find blood screen, before someone relies on it.
  - If it's live, remove the hackathon and pilot text.

### 6. The app is almost invisible to screen readers
- **Page:** The whole Flutter app (`/app/`).
- **Screenshot:** The accessibility tree for Find blood lists only one element, the "Search hospital or area" box. The blood group chips, component chips, units stepper, Find blood button and nav are all missing.
- **Problem:** Blind and low-vision users, and keyboard and switch users, can't make a request. It also fails basic accessibility audits.
- **Fix:** Turn on Flutter web semantics at startup (`SemanticsBinding.instance.ensureSemantics()`). Give every chip, button and stepper a `Semantics` label. Then test with NVDA or TalkBack and keyboard only.

---

## P1: obvious gaps for this kind of product

### 7. Hospital search has no suggestions and the wrong error
- **Page:** `/app/#/`, the Hospital field.
- **Screenshot:** After an empty submit, the field turns red with the error "Search hospital or area", the same words as the placeholder. Typing "AIIMS" shows no dropdown, and the red error stays while you type.
- **Fix:**
  - Show matching hospitals as you type, with area and city.
  - Make the error useful: "Pick the hospital where the patient is."
  - Clear the error as soon as the field has text.

### 8. No contact number for the family on the request form
- **Page:** `/app/#/`
- **Screenshot:** The form has blood group, component, units and hospital, then Find blood. There's no phone field. The privacy policy says "A phone number, if you give one, so we can tell you where the blood is held."
- **Problem:** If the family closes the tab, nobody can tell them where the blood is held.
- **Fix:** Add an optional "Your phone number, for an SMS when blood is held" field with a short note on why. Send the request link by SMS.

### 9. Emergency notice is missing in the app
- **Page:** `/app/#/`
- **Screenshot:** The Find blood screen has no 112 / 108 line. It only appears in the landing page FAQ and the terms.
- **Fix:** Add a small line under the title: "In a medical emergency, call 112 or 108 first." Make 112 and 108 tappable `tel:` links.

### 10. Donor form only flags one error at a time and comes pre-filled
- **Page:** `/app/#/donor`
- **Screenshot:** An empty submit only marks Name ("Write your name."). Blood group, mobile and the consent box are not flagged. The Area field already holds the value "Sector 14, Gurugram".
- **Fix:**
  - Check every field on submit and move focus to the first error.
  - Make "Sector 14, Gurugram" a placeholder, not a value, so a donor can't sign up with that area by accident.

### 11. Donor sign-up skips eligibility basics
- **Page:** `/app/#/donor`
- **Screenshot:** There are no fields for age, last donation date or weight. Last donation date only exists on Manage donor.
- **Problem:** The 18+ rule and the 3-month gap are promised but not collected.
- **Fix:** Add an "I am 18 or older" check, an optional last donation date, and a short eligibility note (weight, recent illness) with a link.

### 12. A bad request link is a dead end
- **Page:** `/app/#/r/<unknown>`
- **Screenshot:** A full-height empty grey card with one red line: "There is no request at this link."
- **Fix:** Show a short message with a reason (wrong or expired link; requests are kept 90 days) and two buttons: "Find blood" and "Look up a request". Shrink the empty card.

### 13. Desk sign-in uses one shared passcode with no help
- **Page:** `/app/#/desk`, also linked publicly from About.
- **Screenshot:** "Hospital desk" with a single "Desk passcode" field and Sign in. There's no hospital name, user, "forgot passcode" or contact.
- **Problem:** A shared passcode can't be revoked per hospital or tied to a person.
- **Fix:**
  - Give each hospital its own account and staff logins.
  - Add a "Need access? Contact us" link and rate-limit wrong attempts.
  - Take the Desk link off the public About page.

### 14. My requests only knows this browser
- **Page:** `/app/#/mine`
- **Screenshot:** "My requests" with a grey box reading "No requests from this device yet." and a Find blood button. The nav label says "My request", singular.
- **Fix:** Match the nav label and heading ("My requests"). In the empty state, add "Have a request link? Open it here" (see item 4).

### 15. The 404 page is bare
- **Page:** Any unknown URL, for example `/nope-404`.
- **Screenshot:** A black page with tiny white "Not Found" text in the corner.
- **Fix:** Add a branded 404 with the logo, "Page not found", and Find blood and Home links.

---

## P2: polish

### 16. Wrong label in the families list
- **Page:** Landing, "For families" list.
- **Screenshot:** "Every bank within 25 km" has the label "One request" on its right. Every other row's label matches its row ("₹0", "On hold", "Live", "Capped").
- **Fix:** Change the label to "25 km" or "Nearest first".

### 17. App tab title is generic
- **Page:** `/app/`
- **Screenshot:** The tab reads "RaktDoot" on every screen. It briefly showed "RaktDoot · Find blood" during load.
- **Fix:** Set a per-route title, for example "Find blood · RaktDoot" or "Request status · RaktDoot".

### 18. Landing deep link to `/app/#/` drops the hash
- **Page:** `/app/`
- **Screenshot:** After load, the address bar shows `/app/` without the route.
- **Fix:** Keep the URL in sync with the screen, so links people share or bookmark reopen the same screen.

### 19. No language switch on the landing page
- **Page:** Landing.
- **Screenshot:** The app has a "हिंदी" toggle in its nav; the landing page has none.
- **Fix:** Add the same Hindi toggle to the landing page, which Hindi-first families land on first.

### 20. Footer has no support contact
- **Page:** Landing footer.
- **Screenshot:** The footer has Get blood, Give blood, Partners and RaktDoot links, sources and photo credits, but no email, phone or WhatsApp.
- **Fix:** Add a support line, the same one as in item 1.

---

## Top 10, in order
1. Contact links go to `privacy@example.com`.
2. Manage donor changes or deletes any number with no code check.
3. Donor sign-up doesn't verify the number.
4. "Track a request" opens Find blood instead of a lookup.
5. The About page's hackathon and pilot text contradicts the landing page.
6. The Flutter app has no screen-reader semantics.
7. Hospital search has no suggestions and a useless error.
8. No family phone number on the request form.
9. No 112 / 108 emergency line in the app.
10. The donor form flags one error at a time and has a pre-filled demo area.
