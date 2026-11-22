# RaktDoot: build plan and checklist

**Done so far:**
- the research
- the 8-slide pitch deck (`RaktDoot_Pitch.pptx`)
- the landing page (`site/`), which runs fully offline at http://localhost:5173

**Already installed on this laptop:** Flutter 3.50.1, Dart 3.14.0, Git, Docker, and the Serverpod CLI 4.1.2.

**Built:** the first working app is in `raktdoot/`. See `raktdoot/AGENTS.md` for how it's put together and how to run it. Calls are simulated until Gnani access arrives.

The goal for the day: judges scan a QR code, sign up as donors, we raise a blood request, the blood bank says no, and **a judge's phone rings** with the AI asking them to donate.

---

## 0. Before the hackathon

- [ ] **Read the hackathon rules on pre-written code.** This decides how much of section 2 we can build before the day.
- [x] **Install the Serverpod CLI:** `dart pub global activate serverpod_cli`, then check it with `serverpod version`. If `serverpod` isn't found, add `%LOCALAPPDATA%\Pub\Cache\bin` to PATH.
- [ ] **Install the Serverpod Cloud CLI (`scloud`)** as the build guide says, and create the Serverpod Cloud account.
- [ ] **Get Gnani access.**
  - Ask for an Inya API key.
  - Ask them to register our outbound calling number. Their trigger-call API needs the account manager to do this.
  - Ask whether call results can come back to us by webhook.
- [ ] **Line up a backup voice provider** in case Gnani is slow to reply: Sarvam, Bolna, or an Exotel or Twilio trial.
- [ ] **Validate the problem.** Call 20 blood banks listed on e-RaktKosh and fill in `validation-calls.csv`.
  - The result becomes one real number for slide 2: "only X of 20 listings matched what the bank told us."
  - Call script (honest, no fake patient): *"Hi, we're students checking how accurate the e-RaktKosh stock listings are. Could you tell me roughly how many units of A positive red cells you have right now? If a hospital called for a patient, could you hold a unit for an hour?"*
- [ ] **Talk to 2 or 3 people who lived this:** a family that hunted for blood, or a hospital blood-desk staffer. One real quote powers the "why we built it" moment.
- [ ] **Collect seed data.** Get 10 to 15 real blood banks in the demo city from e-RaktKosh: name, area, phone, location, listed stock and last update.
- [ ] **Update the deck:**
  - team name and members on slide 1
  - the validation number on slide 2
  - a QR code for the live demo on the last slide

## 1. Architecture: decide before coding

**Flow:**
1. The Flutter app sends a request to Serverpod.
2. Serverpod ranks nearby banks by distance and how fresh their listing is.
3. It queues the calls and Gnani makes them.
4. Gnani sends each call result back to Serverpod, and an LLM turns the transcript into `hasStock`, `units` and `holdUntil`.
5. Serverpod streams every update to the app.
6. When a bank holds the units, the family gets the go-card. If no bank has stock, the donor calls start.

**Data models** (Serverpod `.spy.yaml`):

| Model | Key fields |
|---|---|
| `BloodBank` | name, area, lat, lng, phone, listedUnits, listedAt |
| `BloodRequest` | hospital, group, component, units, status, createdAt |
| `CallAttempt` | requestId, bankId or donorId, status, transcript, units, holdUntil, startedAt |
| `Donor` | name, group, lat, lng, phone (server only), lastDonatedAt, consentAt, lastCalledAt |

**Endpoints:** `RequestEndpoint.create`, `RequestEndpoint.watch` (streaming), `DonorEndpoint.register`, `DonorEndpoint.optOut`, and a webhook route for Gnani call results.

**Decide:**
- [x] For the demo, calls go one after another. Parallel calling is pitched, not built.
- [ ] Call results come back by webhook or by polling. This depends on Gnani's answer.
- [ ] The Hindi agent prompt, plus the exact fields the LLM must return.
- [x] Every call comes from our number, and donor phone numbers never reach the app. Phone fields are server only.

## 2. Build the MVP (on the day, or earlier if the rules allow)

**Backend**
- [x] `serverpod create raktdoot`. This creates the server, client and Flutter app.
- [x] Models, a database migration, and seed data for the banks. The seed data is made-up Gurugram banks for now; swap in real e-RaktKosh listings.
- [x] `RequestEndpoint.create` with the ranking.
- [ ] Trigger the Gnani call, receive the webhook, and turn the result into fields. Plug it into `voice_caller.dart`; `SimulatedCaller` stands in for now.
- [x] `RequestEndpoint.watch`, which streams call updates to the app.
- [x] Donor fallback: opted-in donors within 10 km, stopping once enough have said yes. They're called one at a time for the demo.
- [x] Tell the other banks they're no longer needed once one is holding units. For the demo, logging this is enough.

**Flutter app** (also built for the web, so judges need no install)
- [x] Request screen: blood-group pills, units and hospital. Reuse the landing page look (Epilogue type, navy and red).
- [x] Live call screen: the streamed call log with the Hindi transcript.
- [x] Go-card screen: address, papers to bring, fee and the time the units are held until.
- [x] Donor sign-up screen with the consent tick box. This is where the judges' QR code points.

**Deploy**
- [ ] Move the project to a short folder such as `C:\dev\raktdoot`. The current folder's long path breaks Windows builds, and this folder is deleted along with the Claude session.
- [ ] Put the backend and the Flutter web app on Serverpod Cloud.
- [ ] Make the QR code that points to the donor sign-up.

## 3. Landing page changes

- [ ] Connect the donor form to `DonorEndpoint.register`. Today it saves nothing.
- [ ] Add a "Try it on your phone" QR block once the web app is live.
- [ ] Optional: a live mode in the demo that streams a real request instead of the simulation.
- [ ] Convert the 3 photos to WebP in two sizes. They're 1.1 MB of JPEG now.
- [ ] Add a share image (`og:image`) and a favicon file.
- [ ] Swap the stand-in photos for our own shots of a real blood bank or donor, if we can take them.

## 4. Demo script (3 minutes)

1. **Slides 1 to 3, 60 s:** the problem, the "28 lakh units" number, the solution.
2. **Judges scan the QR, 30 s:** they sign up as donors and tick consent. Ask one judge for their blood group.
3. **Live run, 60 s:**
   - Raise a request for that judge's group at the venue's nearest hospital.
   - Bank 1, a teammate's phone, answers the AI and says no stock.
   - The donor fallback starts and **the judge's phone rings**.
   - The judge presses 1 and the screen turns green.
4. **Business model and rollout, 30 s.**

**Backups:**
- a screen recording of a clean run
- a teammate as the donor if no judge signs up
- the landing page demo if the network fails, since it runs offline

## 5. Rules and risks

- [ ] The AI says it's an AI in its first sentence.
- [ ] Donors are only called after ticking consent, and pressing 9 stops all calls.
- [ ] The agent never asks for money or handles payments.
- [ ] Made-up banks and data are labelled as a demo, never shown as real.
- [ ] During the demo, call only teammates and judges who opted in. This keeps us within TRAI's automated-call rules.
