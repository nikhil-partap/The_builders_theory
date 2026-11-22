# RaktDoot: what only you can do

Claude sessions are doing the coding and deployment. These steps need you: your accounts, your sign-ins, your phone, your team. Tick them off as you go.

**Who is doing what right now**
- **App deploy session** ("HackBriven Serverpod project idea (fork)"): puts the backend and web app on Serverpod Cloud, then adds donor opt-out and the real Gnani caller behind a switch. The app lives in `C:\Users\nikhi\Desktop\raktdoot`.
- **Landing page session** ("Landing page production-ready"): local fonts, donor form connected to the backend, QR block, share image, smaller photos. Works in `site/`.
- **Main chat**: keeps track of both and tells you when your next step is due.

---

## 1. Do now: this unblocks deployment

- [ ] **Claim Serverpod Cloud credits** (30-day free trial): http://serverpod.dev/to/hackbriven-console
- [ ] **Create a project** in the Cloud Console. Name it `raktdoot` and **turn the database on**.
- [ ] **Sign in from the server folder.** The deploy session is ready and waiting for this. It opens your browser; you finish the sign-in.
  ```powershell
  cd C:\Users\nikhi\Desktop\raktdoot\raktdoot\raktdoot_server
  serverpod cloud auth login
  ```
  If `serverpod` isn't found, use `dart pub global run serverpod_cli:serverpod_cli cloud auth login` instead.
- [ ] **Tell the deploy session you're signed in** (in its own chat). It then launches, rebuilds, tests the live app and reports the URLs.
- [ ] **Join the hackathon Discord**: http://serverpod.dev/to/hackbriven-discord
  - Ask the organisers whether code written before the event is allowed. That decides whether this app can be used as it is.

## 2. Voice calls: needed for "the judge's phone rings"

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
  Then tell the deploy session. It redeploys with real calls. Bank calls only ever dial `demoBankNumber`, never a real blood bank.
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
- [ ] **Print or show the QR code** to the donor sign-up. Claude adds it to the deck's last slide once the live address exists.

## 5. Housekeeping

- [ ] **Delete the old app copy** `The builders theory\raktdoot` once the deploy session confirms everything works from `C:\Users\nikhi\Desktop\raktdoot`. It's an outdated snapshot, already left out of git.
- [ ] **Don't put secrets in git, prompts or code.** Keys go in with `serverpod cloud password set`.
- [ ] **After the event**, fill the feedback form: http://serverpod.dev/to/hackbriven-feedback
