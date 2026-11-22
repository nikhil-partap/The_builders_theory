# RaktDoot: what only you can do

Claude sessions are doing the coding and deployment. These steps need you: your accounts, your sign-ins, your phone, your team. Tick them off as you go.

**It's live on Serverpod Cloud** (simulated calls until Gnani is set up):
- Web app: https://raktdoot.serverpod.space/
- Donor sign-up (the QR target): https://raktdoot.serverpod.space/#/donor
- API: https://raktdoot.api.serverpod.space/
- Server logs and metrics: https://raktdoot.insights.serverpod.space/

The app's code lives in `C:\Users\nikhi\Desktop\raktdoot` (local git only). The landing page in `site/` now sends donor sign-ups to the live API, and its QR code opens the live donor page.

---

## 1. Deployment

- [x] Cloud account, project with database, sign-in, launch. The deploy session tested a live request through to "Blood on hold".
- [ ] **Join the hackathon Discord**: http://serverpod.dev/to/hackbriven-discord
  - Ask the organisers whether code written before the event is allowed. That decides whether this app can be used as it is.

## 2. Voice calls: needed for "the judge's phone rings"

**We switched to Sarvam.** Gnani Agents rejects personal email addresses and this account has 0 credits for it. The RaktDoot calling agent is already built and committed (version 2) in your Sarvam dashboard (indus.sarvam.ai, Voice Agents, Agents, "RaktDoot"). The deploy session is adding a `SarvamCaller` to the app. The Gnani steps below are kept only as a fallback.

- [ ] **Rent a Sarvam phone number**: Phone numbers, then Rent from Sarvam, then Get started. ₹59 a month at the launch price, plus about ₹0.2 per 30 seconds of calls, from your Sarvam credits.
  - Sarvam first asks for identity verification: choose **Individual** and verify with PAN or Aadhaar. The account owner (Ashmeet Kaur) has to do this; Claude can't enter ID numbers.
  - After renting, note the connection id and the number (in +91 format): they become `sarvamConnectionId` and `sarvamAgentNumber`.
- [ ] **Create a workspace API key** in Sarvam's settings, and note your org id and workspace id (shown with the API key).
- [ ] **Store them yourself** from `C:\Users\nikhi\Desktop\raktdoot\raktdoot\raktdoot_server`, one `serverpod cloud password set NAME` each. The names:
  - `sarvamApiKey`, `sarvamOrgId`, `sarvamWorkspaceId`
  - `sarvamAppId` = `Conversatio-d82f8dfb-3fe6`
  - `sarvamAppVersion` = `2`
  - `sarvamConnectionId` (from the rented number)
  - `sarvamAgentNumber` (the rented number in +91 format)
  - `callbackToken` (any long random string you make up)
  - `demoBankNumber` (the teammate who plays the blood bank)
  - finally `voiceProvider` = `sarvam`

  Then run `serverpod cloud deploy`. If any one is missing, the app quietly keeps using simulated calls.
- [ ] **Test-call yourself first** with the agent's Test agent button in the Sarvam dashboard.

**Gnani fallback (only if Sarvam doesn't work out):**

- [ ] **Open Gnani with the hackathon link** and sign up: https://app.gnani.ai/voice?utm_source=hackbriven&utm_medium=hackathon&utm_campaign=hackathon_nov2026
- [ ] **Ask Gnani for three things:**
  1. an Inya API key
  2. your outbound calling number registered (their trigger-call API needs their account manager for this)
  3. whether call results can be sent to our server automatically (a webhook)
- [ ] **Confirm the trigger-call field names with Gnani.** The code currently guesses `agent_id`, `phone_number`, `variables`, `callback_url` and `metadata`.
- [ ] **Once you have access, store each value yourself** from the server folder. Never paste them into a chat or a file. Run this once per name, entering the value when asked:
  ```powershell
  serverpod cloud password set gnaniApiKey
  ```
  The names are `gnaniApiKey`, `gnaniTriggerUrl`, `gnaniAgentId`, `gnaniCallbackToken` (any long random string you make up), and `demoBankNumber` (the teammate's phone that plays the blood bank). Last, set `voiceProvider` to `gnani`. Until all of these are set, the app keeps using simulated calls.
  Then redeploy from the same folder with `serverpod cloud deploy` (or ask the deploy session to). Bank calls only ever dial `demoBankNumber`, never a real blood bank.
- [ ] **Point Gnani's end-of-call webhook at us**, in the Gnani agent settings:
  `https://raktdoot.serverpod.space/gnani/callback?token=<your gnaniCallbackToken>&call=<the call id we send in metadata.call_id>`
  - It must send JSON with `outcome`, `units`, `hold_minutes`, `arrive_minutes` and `transcript` (a list of `{speaker, hindi, english}`).
- [ ] **Backup if Gnani is slow:** make a Twilio or Exotel trial account and verify your own phone number. Tell the deploy session which one you picked.
- [ ] **Claim Adaption credits** (mandatory per the guide): https://adaptionlabs.ai/app/auth/referral?ref=hackbriven-hackathon

## 3. The pitch: needs you, not code

- [ ] **Team name and members**: tell Claude and they go on slide 1.
- [ ] **20 validation calls**: call blood banks listed on e-RaktKosh and fill in `validation-calls.csv`.
  - The result becomes slide 2's real number: "only X of 20 listings matched".
  - Script (honest, no fake patient): "Hi, we're students checking how accurate e-RaktKosh stock listings are. Roughly how many units of A positive red cells do you have now? Could you hold a unit for an hour if a hospital called?"
- [ ] **Talk to 2 or 3 people who have searched for blood** (a family member, a hospital blood-desk worker). One real quote for the "why we built it" moment.

## 4. Demo day setup

- [ ] **Two phones:** one teammate plays "blood bank 1" (answers the AI and says no stock), one plays the donor if no judge signs up.
- [ ] **Only call people who opted in:** teammates and judges who ticked consent. Never let the agent call a real blood bank. This keeps us within TRAI's automated-call rules.
- [ ] **After deployment, rehearse once end to end** and screen-record a clean run as backup.
  - Careful: the live server waits 7 days before calling the same donor again. Rehearsing with a teammate as donor on the live server blocks them for a week, so keep separate donor numbers for rehearsal and the real demo, or ask the deploy session to reset the cooldown before demo day.
- [ ] **Print or show the QR code** for https://raktdoot.serverpod.space/#/donor. The landing page already shows it; ask Claude to add it to the deck's last slide.
- [ ] **Host the landing page** if you want it online too. It's static, so GitHub Pages works: repo Settings, Pages, deploy from `main` with the `/site` folder. That makes the site public; it's your call.

## 5. Housekeeping

- [ ] **Delete the old app copy** `The builders theory\raktdoot` once the deploy session confirms everything works from `C:\Users\nikhi\Desktop\raktdoot`. It's an outdated snapshot, already left out of git.
- [ ] **Don't put secrets in git, prompts or code.** Keys go in with `serverpod cloud password set`.
- [ ] **After the event**, fill the feedback form: http://serverpod.dev/to/hackbriven-feedback
