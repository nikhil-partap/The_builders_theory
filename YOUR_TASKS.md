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
- [ ] **Sign in from the app folder** when the deploy session asks. It opens your browser; you finish the sign-in.
  ```powershell
  cd C:\Users\nikhi\Desktop\raktdoot
  serverpod cloud auth login
  ```
- [ ] **Join the hackathon Discord**: http://serverpod.dev/to/hackbriven-discord
  - Ask the organisers whether code written before the event is allowed. That decides whether this app can be used as it is.

## 2. Voice calls: needed for "the judge's phone rings"

- [ ] **Open Gnani with the hackathon link** and sign up: https://app.gnani.ai/voice?utm_source=hackbriven&utm_medium=hackathon&utm_campaign=hackathon_nov2026
- [ ] **Ask Gnani for three things:**
  1. an Inya API key
  2. your outbound calling number registered (their trigger-call API needs their account manager for this)
  3. whether call results can be sent to our server automatically (a webhook)
- [ ] **When you get the key, store it yourself.** Never paste it into a chat or a file.
  ```powershell
  serverpod cloud password set gnaniApiKey
  ```
  Then tell the deploy session it's set. It redeploys and switches from simulated to real calls.
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
- [ ] **Print or show the QR code** to the donor sign-up. Claude adds it to the deck's last slide once the live address exists.

## 5. Housekeeping

- [ ] **Delete the old app copy** `The builders theory\raktdoot` once the deploy session confirms everything works from `C:\Users\nikhi\Desktop\raktdoot`. It's an outdated snapshot, already left out of git.
- [ ] **Don't put secrets in git, prompts or code.** Keys go in with `serverpod cloud password set`.
- [ ] **After the event**, fill the feedback form: http://serverpod.dev/to/hackbriven-feedback
