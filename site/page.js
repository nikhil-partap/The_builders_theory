// RaktDoot page script: links into the app, the sample call, the partner form and the donor QR.
import HI from './hi.js';

// ---- where things live: edit these, every link on the page follows ----
// SITE_URL: the public origin this site is served from (no trailing slash). The donor QR, read by a phone, uses it.
const SITE_URL = 'https://raktdoot.serverpod.space';
// Routes into the Flutter app, served under /app/ on the same origin.
const ROUTES = {
  findBlood: '/app/#/',   // start a blood request
  donor: '/app/#/donor',  // donor sign-up
  track: '/app/#/r/',     // a request's status page
};
// The "Partner with us" form writes to the site's one contact address, set in contact.js (CONTACT_EMAIL).
const PARTNER_EMAIL = window.RAKTDOOT_CONTACT || '';

// The sample call below uses example banks, donors and voices; it calls nobody and sends nothing.
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

const COMP_HI = 'रेड सेल्स';
const state = { group: 'A+', units: 2 };
const abo = (g) => g.replace(/[+-]/, '');
const isNeg = (g) => g.endsWith('-');
const pretty = (g) => g.replace('-', '−');
const hiGroup = (g) => `${abo(g)} ${isNeg(g) ? 'नेगेटिव' : 'पॉज़िटिव'}`;
const unitWord = (n) => (n === 1 ? 'unit' : 'units');
const hospital = () => $('#hospital').value.trim() || 'District Hospital';
const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

// the phone's clock in the hero
const clock = $('[data-clock]');
if (clock) clock.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

const calls = $('#calls');
const donorsRun = $('#donorsRun');
const gocard = $('#gocard');
const body = $('#logBody');
const log = $('#log');
const findBtn = $('#findBtn');
let runId = 0;

function banks() {
  const neg = isNeg(state.group);
  return [
    { name: 'Sanjeevani Blood Centre', km: '3.1 km', note: neg ? 'Portal: 1 unit · updated 12 days ago' : 'Portal: 4 units · updated 9 days ago', stale: true },
    { name: 'Arogya Blood Centre', km: '5.4 km', note: neg ? 'Portal: 1 unit · updated 2 days ago' : 'Portal: 2 units · updated today', stale: false },
    { name: 'Sector 22 Charitable Blood Bank', km: '8.9 km', note: neg ? 'Portal: 1 unit · updated 6 days ago' : 'Portal: 6 units · updated 3 days ago', stale: true },
  ];
}

function row(b) {
  const li = document.createElement('li');
  li.className = 'rd-call';
  li.dataset.state = 'queued';
  li.innerHTML = '<div class="rd-call__top"><span></span><span class="rd-call__km"></span></div><div class="rd-call__note"></div><div class="rd-call__status"><i aria-hidden="true"></i><span>Queued</span></div><div class="rd-talk"></div>';
  const [name, km] = $$('.rd-call__top span', li);
  name.textContent = b.name; km.textContent = b.km;
  const note = $('.rd-call__note', li);
  note.textContent = b.note;
  if (b.stale) note.classList.add('is-stale');
  return li;
}

function setState(text, run) {
  $('#logState').textContent = text;
  log.dataset.run = run || '';
}

function reset() {
  runId += 1;
  calls.innerHTML = '';
  banks().forEach((b) => calls.appendChild(row(b)));
  donorsRun.hidden = true; donorsRun.innerHTML = '';
  gocard.hidden = true; gocard.innerHTML = '';
  $('#logTitle').textContent = `${pretty(state.group)} red cells · ${state.units} ${unitWord(state.units)}`;
  setState('Ready');
  findBtn.disabled = false;
  findBtn.textContent = 'Play the call';
}

const sleep = (ms, id) => new Promise((res, rej) => setTimeout(() => (id === runId ? res() : rej(new Error('cancelled'))), ms * (reduce.matches ? 0.5 : 1)));
const announce = (t) => { $('#announce').textContent = t; };

function follow(el) {
  if (body.scrollHeight <= body.clientHeight) return;
  const top = body.scrollTop + el.getBoundingClientRect().top - body.getBoundingClientRect().top - 12;
  body.scrollTo({ top, behavior: reduce.matches ? 'auto' : 'smooth' });
}

async function say(talk, who, hi, en, id, wait = 1100) {
  const typing = document.createElement('p');
  typing.className = `rd-say rd-say--${who} rd-say--typing`;
  typing.setAttribute('aria-hidden', 'true');
  typing.innerHTML = '<b></b><b></b><b></b>';
  talk.appendChild(typing);
  follow(typing);
  await sleep(wait, id);
  const p = document.createElement('p');
  p.className = `rd-say rd-say--${who}`;
  const h = document.createElement('span'); h.lang = 'hi'; h.textContent = hi;
  const g = document.createElement('span'); g.className = 'rd-gloss'; g.textContent = en;
  p.append(h, g);
  typing.replaceWith(p);
  follow(p);
}

function status(li, st, text) {
  li.dataset.state = st;
  $('.rd-call__status span', li).textContent = text;
}

async function run() {
  reset();
  const id = runId;
  const g = state.group; const n = state.units; const hosp = hospital();
  const rows = $$('.rd-call', calls);
  const ask = [
    `नमस्ते, मैं रक्तदूत की AI सहायक हूँ। ${hosp} में एक मरीज़ के लिए ${hiGroup(g)} ${COMP_HI} के ${n} यूनिट चाहिए। क्या आपके पास हैं?`,
    `Hi, I'm RaktDoot's AI assistant. A patient at ${hosp} needs ${n} ${unitWord(n)} of ${pretty(g)} red cells. Do you have them?`,
  ];
  const held = new Date(Date.now() + 45 * 60000);
  findBtn.disabled = true;
  findBtn.textContent = 'Calling…';
  setState('Calling', 'on');
  announce('Sample call started.');

  try {
    await sleep(400, id);
    status(rows[0], 'calling', 'Calling');
    const t1 = $('.rd-talk', rows[0]);
    await say(t1, 'agent', ask[0], ask[1], id, 1200);
    await say(t1, 'them', `अभी ${hiGroup(g)} नहीं है। कल शाम तक आ सकता है।`, `No ${pretty(g)} right now. Maybe tomorrow evening.`, id, 1200);
    await sleep(600, id);
    t1.innerHTML = '';
    status(rows[0], 'no', `No stock · the listing was out of date · ${fmt(new Date())}`);

    if (!isNeg(g)) {
      status(rows[1], 'calling', 'Calling');
      const t2 = $('.rd-talk', rows[1]);
      await say(t2, 'agent', ask[0], ask[1], id, 1000);
      await say(t2, 'them', `हाँ, ${n} यूनिट हैं। डॉक्टर का फ़ॉर्म और सैंपल लेकर आइए।`, `Yes, we have ${n}. Bring the doctor's form and the sample.`, id, 1200);
      await say(t2, 'agent', 'क्या आप इन्हें 45 मिनट के लिए होल्ड कर सकते हैं?', 'Could you hold them for 45 minutes?', id, 900);
      await say(t2, 'them', `ठीक है, ${fmt(held)} तक होल्ड कर दिया।`, `Okay, held until ${fmt(held)}.`, id, 1000);
      await sleep(600, id);
      t2.innerHTML = '';
      status(rows[1], 'held', `Holding ${n} ${unitWord(n)} until ${fmt(held)}`);
      status(rows[2], 'released', 'Not needed · told the bank');
      gocard.innerHTML = '<h3>Go to Arogya Blood Centre</h3><dl><dt>On hold</dt><dd></dd><dt>Distance</dt><dd></dd><dt>Bring</dt><dd>The request form signed by the doctor, and the patient\'s blood sample.</dd><dt>Fee</dt><dd>Processing fee only, at most ₹1,550 a unit.</dd></dl>';
      const dd = $$('dd', gocard);
      dd[0].textContent = `${n} ${unitWord(n)} of ${pretty(g)} red cells until ${fmt(held)}`;
      dd[1].textContent = `5.4 km from ${hosp}`;
      gocard.hidden = false;
      setState('Found in two calls', 'done');
      announce(`Units on hold at Arogya Blood Centre until ${fmt(held)}.`);
      follow(gocard);
    } else {
      for (const r of [rows[1], rows[2]]) {
        status(r, 'calling', 'Calling');
        const t = $('.rd-talk', r);
        await say(t, 'agent', ask[0], ask[1], id, 800);
        await say(t, 'them', `माफ़ कीजिए, ${hiGroup(g)} अभी नहीं है।`, `Sorry, no ${pretty(g)} right now.`, id, 900);
        await sleep(400, id);
        t.innerHTML = '';
        status(r, 'no', `No stock · ${fmt(new Date())}`);
      }
      setState('Calling donors', 'on');
      announce('No bank has stock. Calling donors.');
      donorsRun.innerHTML = '<p class="rd-donor-head">No bank nearby has it. Donors within 10 km, numbers hidden:</p><ol class="rd-donor-list"></ol>';
      donorsRun.hidden = false;
      const ol = $('ol', donorsRun);
      const ds = [['Donor 1', '2.4 km', 'Last gave 7 months ago'], ['Donor 2', '4.0 km', 'Last gave 5 months ago'], ['Donor 3', '6.3 km', 'Last gave a year ago']]
        .map(([name, km, note]) => { const li = row({ name, km, note, stale: false }); ol.appendChild(li); return li; });
      follow(donorsRun);
      const arrive = new Date(Date.now() + 35 * 60000);
      status(ds[0], 'calling', 'Ringing');
      await sleep(1500, id);
      status(ds[0], 'no', 'No answer · not called again today');
      const need = Math.min(n, 2);
      let yes = 0;
      for (const d of [ds[1], ds[2]]) {
        if (yes >= need) { status(d, 'released', 'Not needed'); continue; }
        status(d, 'calling', 'Calling');
        const t = $('.rd-talk', d);
        await say(t, 'agent', `नमस्ते, मैं रक्तदूत की AI सहायक हूँ। पास के एक मरीज़ को ${hiGroup(g)} खून चाहिए। क्या आप आज रक्तदान कर सकते हैं? हाँ के लिए 1 दबाइए।`,
          `Hi, I'm RaktDoot's AI assistant. A patient nearby needs ${pretty(g)} blood. Can you donate today? Press 1 for yes.`, id, 1100);
        await say(t, 'them', `1 · हाँ, ${fmt(arrive)} तक पहुँच जाऊँगा।`, `1 · Yes, I'll be there by ${fmt(arrive)}.`, id, 1100);
        await sleep(450, id);
        t.innerHTML = '';
        yes += 1;
        status(d, 'held', `Coming · at Arogya Blood Centre by ${fmt(arrive)}`);
      }
      gocard.innerHTML = '<h3>Donors are on the way</h3><dl><dt>Donors</dt><dd></dd><dt>Next</dt><dd>Donated blood is tested before it is issued, which takes a few hours. The bank calls you when it is ready.</dd></dl>';
      $('dd', gocard).textContent = `${yes} confirmed, at Arogya Blood Centre by ${fmt(arrive)}`;
      gocard.hidden = false;
      setState(`${yes} donors coming`, 'done');
      announce(`${yes} donors confirmed.`);
      follow(gocard);
    }
    findBtn.disabled = false;
    findBtn.textContent = 'Play it again';
  } catch { /* a newer run replaced this one */ }
}

$$('#groups input').forEach((r) => r.addEventListener('change', () => { state.group = r.value; reset(); }));
function setUnits(n) {
  state.units = Math.min(6, Math.max(1, n));
  $('#units').textContent = state.units;
  $('#unitsDown').disabled = state.units === 1;
  $('#unitsUp').disabled = state.units === 6;
  reset();
}
$('#unitsDown').addEventListener('click', () => setUnits(state.units - 1));
$('#unitsUp').addEventListener('click', () => setUnits(state.units + 1));
$('#hospital').addEventListener('input', () => {
  if ($('#hospital').value.trim()) { $('#hospital').removeAttribute('aria-invalid'); $('#hospital-err').hidden = true; }
});
$('#request').addEventListener('submit', (e) => {
  e.preventDefault();
  const h = $('#hospital');
  if (!h.value.trim()) { h.setAttribute('aria-invalid', 'true'); $('#hospital-err').hidden = false; h.focus(); return; }
  if (window.matchMedia('(max-width: 1023px)').matches) log.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
  run();
});
setUnits(2);

// ---- links into the app: one place to change them (ROUTES above) ----
$$('a[data-route]').forEach((a) => { if (ROUTES[a.dataset.route]) a.setAttribute('href', ROUTES[a.dataset.route]); });

// ---- partner form: checked here, then opens the visitor's email app with the message filled in ----
const pTests = {
  pName: (v) => v.trim().length > 1,
  pOrg: (v) => v.trim().length > 1,
  pKind: (v) => v !== '',
  pContact: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || /^(?:\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')),
};
function mark(id, ok) {
  const el = $(`#${id}`); const err = $(`#${id}-err`);
  if (ok) { el.removeAttribute('aria-invalid'); err.hidden = true; } else { el.setAttribute('aria-invalid', 'true'); err.hidden = false; }
  return ok;
}
Object.keys(pTests).forEach((id) => {
  const el = $(`#${id}`);
  el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => { if (el.getAttribute('aria-invalid')) mark(id, pTests[id](el.value)); });
});
$('#partnerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const done = $('#partnerDone');
  let first = null;
  Object.entries(pTests).forEach(([id, t]) => { if (!mark(id, t($(`#${id}`).value)) && !first) first = id; });
  if (first) { done.hidden = true; $(`#${first}`).focus(); return; }
  const v = (id) => $(`#${id}`).value.trim();
  const subject = `Partnering with RaktDoot: ${v('pOrg')}`;
  const details = [`Name: ${v('pName')}`, `Organisation: ${v('pOrg')}`, `We are: ${v('pKind')}`];
  if (v('pCity')) details.push(`City: ${v('pCity')}`);
  details.push(`Contact: ${v('pContact')}`);
  const body = `${details.join('\n')}\n\n${v('pMsg') || 'We would like to talk about using RaktDoot.'}`;
  window.location.href = `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  done.textContent = `Your email app should open with the message ready to send. If nothing opened, write to ${PARTNER_EMAIL}.`;
  done.hidden = false;
});

// ---- the donor QR: opens the app's sign-up on a phone, drawn here (assets/qrcode.js, no CDN) ----
function drawQr() {
  const box = $('#qr');
  if (!box) return;
  if (typeof window.qrcode !== 'function') { box.closest('.rd-qr-mini').hidden = true; return; }
  const qr = window.qrcode(0, 'M');
  qr.addData(SITE_URL + ROUTES.donor);
  qr.make();
  const n = qr.getModuleCount();
  let d = '';
  for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
  box.innerHTML = `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" aria-hidden="true"><path fill="#1f2b4d" d="${d}"/></svg>`;
}
drawQr();

// ---- Hindi / English: swaps every [data-i18n] element's content; remembers the choice in this browser ----
const LANG_KEY = 'raktdoot-lang';
const EN_TITLE = document.title;
const english = new Map();
const langBtn = $('#langBtn');
function setLang(lang) {
  const hi = lang === 'hi';
  $$('[data-i18n]').forEach((el) => {
    if (!english.has(el)) english.set(el, el.innerHTML);
    const v = hi ? HI[el.dataset.i18n] : english.get(el);
    if (v != null && el.innerHTML !== v) el.innerHTML = v;
  });
  document.documentElement.lang = hi ? 'hi' : 'en-IN';
  document.title = hi ? HI['meta.title'] : EN_TITLE;
  langBtn.textContent = hi ? 'English' : 'हिंदी';
  langBtn.lang = hi ? 'en' : 'hi';
  langBtn.setAttribute('aria-label', hi ? 'Read in English' : 'हिंदी में पढ़ें');
  try { localStorage.setItem(LANG_KEY, hi ? 'hi' : 'en'); } catch { /* storage blocked: the choice lasts this visit */ }
}
langBtn.addEventListener('click', () => setLang(document.documentElement.lang === 'hi' ? 'en' : 'hi'));
let startLang = new URLSearchParams(location.search).get('lang');
if (!startLang) { try { startLang = localStorage.getItem(LANG_KEY); } catch { startLang = null; } }
if (startLang === 'hi') setLang('hi');
