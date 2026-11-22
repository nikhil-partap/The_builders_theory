# RaktDoot: what only you can do

Claude sessions do the coding and deployment. These steps need you: your accounts, your keys, your phone, your team. Tick them off as you go.

**Already done:**
- the app on Serverpod Cloud
- the Sarvam calling agent and phone number
- the Sarvam caller in the code, hardened
- the landing page connected to the live API

**Live now** (calls are still simulated until step 1 is finished):
- Web app: https://raktdoot.serverpod.space/
- Donor sign-up (the QR target): https://raktdoot.serverpod.space/#/donor
- API: https://raktdoot.api.serverpod.space/
- Logs and metrics: https://raktdoot.insights.serverpod.space/

The app's code is in `C:\Users\nikhi\Desktop\raktdoot` (local git only).

---

## 1. Turn on real AI calls (top priority)

The deploy session couldn't set Cloud passwords because its permissions blocked it, so you run these. Use the exact commands it gives you in its chat. Open a terminal in the server folder:

```powershell
cd C:\Users\nikhi\Desktop\raktdoot\raktdoot\raktdoot_server
```

- [ ] **Create a workspace API key** at https://indus.sarvam.ai/samvaad/settings/api-key. None exists yet.
- [ ] **Set each password** with `serverpod cloud password set NAME`, typing the value when asked. Never paste the API key into a chat or a file. The deploy session already read the non-secret values from your dashboard:

  | Name | Value |
  |---|---|
  | `sarvamApiKey` | the key you just created (secret) |
  | `sarvamOrgId` | `01a20193-5b6a-704c-84bc-bc7f07b793c1` |
  | `sarvamWorkspaceId` | `01a20193-5b71-7a82-9c04-b0b976790ff1` |
  | `sarvamAppId` | `Conversatio-d82f8dfb-3fe6` |
  | `sarvamAppVersion` | `2` |
  | `sarvamConnectionId` | `62993e64-c3-61ecb57c-6c04` |
  | `sarvamAgentNumber` | `+917965861220` |
  | `callbackToken` | any long random string you make up (secret) |
  | `demoBankNumber` | the teammate who plays the blood bank, 10 digits |
  | `donorCooldownMinutes` | optional: e.g. `5` while rehearsing, so teammates aren't locked out for 7 days. Remove it before demo day. |
  | `voiceProvider` | `sarvam` (**set this last**) |
- [ ] **Deploy:** `serverpod cloud deploy`. If any password is missing, the app quietly stays on simulated calls.
- [ ] **Tell the deploy session it's done.** It runs one live test with you: the "bank" teammate says no stock, then the "donor" teammate's phone rings and says yes.

## 2. Before the hackathon

- [ ] **Ask the organisers on Discord** (http://serverpod.dev/to/hackbriven-discord) whether code written before the event is allowed.
- [ ] **Claim Adaption credits** (the guide says it's mandatory): https://adaptionlabs.ai/app/auth/referral?ref=hackbriven-hackathon
- [ ] **Team name and members**: tell Claude and they go on slide 1 of the deck.
- [ ] **20 validation calls**: call blood banks listed on e-RaktKosh and fill in `validation-calls.csv`. The result becomes slide 2's real number: "only X of 20 listings matched".
  - Script (honest, no fake patient): "Hi, we're students checking how accurate e-RaktKosh stock listings are. Roughly how many units of A positive red cells do you have now? Could you hold a unit for an hour if a hospital called?"
- [ ] **Talk to 2 or 3 people who have searched for blood.** One real quote for the "why we built it" moment.

## 3. Going public

- [ ] **Put the landing page online** (your call, since it makes the site public): GitHub repo Settings, Pages, deploy from `main` with the `/site` folder. Then tell Claude the address, so the share-card links can be made absolute.
- [ ] **Approve a short privacy page.** The app collects phone numbers, so Claude can write a plain one-page privacy notice. You review it before it goes live.
- [ ] **Watch your Sarvam credits.** The number is ₹59 a month, and calls cost credits. Top up before demo day if you're low.

## 4. Demo day

- [ ] **Two teammates with phones:** one plays "blood bank 1" (says no stock), one plays the backup donor if no judge signs up.
- [ ] **Only call people who opted in:** teammates and judges who ticked consent. Never let the agent call a real blood bank. This keeps us within TRAI's automated-call rules.
- [ ] **Mind the 7-day donor cooldown:** a number used as a donor can't be called again for a week. For rehearsals, set `donorCooldownMinutes` (see step 1), then remove it before demo day.
- [ ] **Rehearse once end to end** and screen-record a clean run as a backup.
- [ ] **QR code** for https://raktdoot.serverpod.space/#/donor: ask Claude to add it to the deck's last slide, and print it.

## 5. Housekeeping

- [ ] **Delete the old app copy** `The builders theory\raktdoot`. It's an outdated snapshot, not in git; the real app is in `C:\Users\nikhi\Desktop\raktdoot`.
- [ ] **After the event**, fill the feedback form: http://serverpod.dev/to/hackbriven-feedback

_Gnani is no longer needed. Gnani Agents rejects personal emails, so Sarvam replaced it. The Gnani caller is still in the code as a fallback._
