/* Business & Finance Academy app. Data: window.CURRICULUM, window.WEEKS (weekNN.js + weekNNx.js), window.PRACTICE. */
const C = window.CURRICULUM, P = window.PRACTICE || {};
const WEEKS = (window.WEEKS || []).sort((a, b) => (a.month - b.month) || (a.week - b.week));
const app = document.getElementById('app');
const DAY = 86400000;
/* Progress lives in memory and is mirrored to this browser's localStorage when the browser allows it.
   Inside the claude.ai Artifact it is also saved to the course's database (collection "progress", one
   document per viewer id) so it survives the browser forgetting it, follows the viewer between devices,
   and can be read back by Claude to confirm saves landed. A chip in the header always shows which applies. */
const MEM = {};
const LS_OK = (() => { try { localStorage.setItem('bfa:_probe', '1'); const ok = localStorage.getItem('bfa:_probe') === '1'; localStorage.removeItem('bfa:_probe'); return ok; } catch (e) { return false; } })();
if (LS_OK) { try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('bfa:')) MEM[k] = localStorage.getItem(k); } } catch (e) {} }
const IN_CLAUDE = !!(window.claude && window.claude.use);
const ARTIFACT_URL = 'https://claude.ai/artifact/VTpuB4VXYwYqdsqkd4nWHn';
const cloud = {db: null, doc: null, id: null, timer: null, state: IN_CLAUDE ? 'connecting' : 'off', savedAt: 0, why: ''};
const store = {
  get(k, d){ const v = MEM['bfa:' + k]; try { return v ? JSON.parse(v) : d } catch (e) { return d } },
  set(k, v){ MEM['bfa:' + k] = JSON.stringify(v); MEM['bfa:_t'] = String(Date.now());
    if (LS_OK) { try { localStorage.setItem('bfa:' + k, MEM['bfa:' + k]); localStorage.setItem('bfa:_t', MEM['bfa:_t']); } catch (e) {} }
    cloudSave(); showSave(); },
  all(){ return Object.assign({}, MEM) },
  load(all){ Object.keys(all).forEach(k => { if (k.startsWith('bfa:')) { MEM[k] = all[k]; if (LS_OK) { try { localStorage.setItem(k, all[k]) } catch (e) {} } } }); }
};
function viewInfo(){ let framed = true; try { framed = window.top !== window.self; } catch (e) {} return {framed, ls: LS_OK, w: window.innerWidth, ua: navigator.userAgent.slice(0, 120)}; }
function cloudSave(){
  if (!cloud.doc) return;
  clearTimeout(cloud.timer);
  cloud.state = 'saving'; showSave();
  cloud.timer = setTimeout(() => {
    cloud.doc.set({t: +MEM['bfa:_t'] || Date.now(), data: JSON.stringify(MEM), view: viewInfo()})
      .then(() => { cloud.state = 'on'; cloud.savedAt = Date.now(); showSave(); },
            e => { cloud.state = 'err'; cloud.why = (e && e.code) || 'error'; showSave(); });
  }, 800);
}
/* where progress is going right now, in plain words */
function saveState(){
  const s = cloud.state;
  if (s === 'on') return {ok: true, short: 'Saved to your account', long: 'Your progress is saved to your Claude account. It will be here next time, on any device where you open this course on claude.ai.'};
  if (s === 'saving') return {ok: true, short: 'Saving…', long: 'Saving your progress to your Claude account…'};
  if (s === 'connecting') return {ok: true, short: 'Connecting…', long: 'Connecting to your Claude account to load your progress…'};
  if (s === 'err') return {ok: false, short: 'Not saved: tap for help', long: `Saving to your Claude account failed (${cloud.why}). ${LS_OK ? 'Your progress is still kept in this browser for now.' : 'This view cannot keep progress in the browser either, so copy your progress code below before closing.'} Try reloading the page.`};
  if (s === 'nocloud') return {ok: LS_OK, short: LS_OK ? 'Saved in this browser only' : 'Not saved here: tap for help', long: `This view of the course could not reach your Claude account (${cloud.why}). ${LS_OK ? 'Progress is saved in this browser only.' : 'This browser view also blocks storage, so progress will be lost when you close it.'} Open the course from claude.ai (${ARTIFACT_URL}) while signed in, and allow storage if asked.`};
  return LS_OK ? {ok: true, short: 'Saved on this device', long: 'Progress is saved in this browser on this device. Each copy of the course (the claude.ai version, the web app, the offline file) and each browser keeps its own. For one record that follows you everywhere, use the claude.ai version: ' + ARTIFACT_URL}
    : {ok: false, short: 'Not saved: tap for help', long: 'This browser is blocking storage (private browsing, or site data turned off), so progress will be lost when you close it. Use the claude.ai version for saving that follows you: ' + ARTIFACT_URL};
}
function showSave(){
  const st = saveState(); let chip = document.getElementById('savechip');
  if (!chip) { const wrap = document.querySelector('header.bar .wrap'); if (!wrap) return; chip = document.createElement('a'); chip.id = 'savechip'; chip.href = '#plan'; chip.setAttribute('aria-live', 'polite'); wrap.appendChild(chip); }
  chip.className = 'savechip ' + (st.ok ? 'ok' : 'bad'); chip.textContent = (st.ok ? '● ' : '▲ ') + st.short;
  const el = document.getElementById('syncnote'); if (el) el.textContent = st.long;
}
function syncText(){ return saveState().long; }
/* Merge two saved progress maps key by key so no device can wipe another's progress.
   Lists such as lessons done and quiz answers are unioned; on a clash the more recent entry wins. */
function mergeProgress(local, remote, remoteNewer){
  const out = Object.assign({}, local);
  const parse = v => { try { return JSON.parse(v) } catch (e) { return v } };
  const isObj = x => x && typeof x === 'object' && !Array.isArray(x);
  Object.keys(remote).forEach(k => {
    if (!k.startsWith('bfa:')) return;
    if (!(k in local)) { out[k] = remote[k]; return; }
    if (k === 'bfa:_t') { out[k] = String(Math.max(+local[k] || 0, +remote[k] || 0)); return; }
    const a = parse(local[k]), b = parse(remote[k]);
    if (isObj(a) && isObj(b)) {
      const m = Object.assign({}, remoteNewer ? a : b, remoteNewer ? b : a);
      Object.keys(a).forEach(x => { if (!(x in b)) m[x] = a[x]; });
      Object.keys(b).forEach(x => {
        if (!(x in a)) { m[x] = b[x]; return; }
        const p = a[x], q = b[x];
        if (isObj(p) && isObj(q) && (p.last || q.last)) m[x] = (+q.last || 0) >= (+p.last || 0) ? q : p;   // mastery: latest answer wins
        else if (typeof p === 'number' && typeof q === 'number' && k === 'bfa:activity') m[x] = Math.max(p, q);
      });
      out[k] = JSON.stringify(m);
    } else out[k] = remoteNewer ? remote[k] : local[k];
  });
  return out;
}
async function cloudInit(){
  showSave();
  if (!IN_CLAUDE) return;
  try {
    const [db, user] = await Promise.all([claude.use('db'), claude.use('user')]);
    if (!db || !user) { cloud.state = 'nocloud'; cloud.why = !db && !user ? 'no account access in this view' : !db ? 'no database in this view' : 'no sign-in in this view'; return showSave(); }
    const id = await user.id();
    if (!id) { cloud.state = 'nocloud'; cloud.why = 'not signed in'; return showSave(); }
    cloud.db = db; cloud.id = id;
    const doc = db.collection('progress').doc(id);
    let snap = await doc.get(), remote = snap.exists ? snap.data() : null;
    if (!remote) { const old = await db.collection('data/users/' + id).doc('progress').get().catch(() => null); if (old && old.exists) remote = old.data(); }
    cloud.doc = doc;
    if (remote && remote.data) {
      // keep a dated copy of what the account held before this device touches it, then merge, never replace
      db.collection('backups').doc(id + '_' + todayKey().replace(/-/g, '')).set({t: Date.now(), from: remote.t || 0, data: remote.data}).catch(() => {});
      const before = JSON.stringify(MEM);
      store.load(mergeProgress(MEM, JSON.parse(remote.data), (+remote.t || 0) > (+MEM['bfa:_t'] || 0)));
      if (JSON.stringify(MEM) !== before) route();
    }
    cloudSave();
    askInit();
  } catch (e) { cloud.state = 'err'; cloud.why = (e && e.code) || (e && e.message) || 'error'; showSave(); }
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pad = n => String(n).padStart(2, '0');
const wid = w => 'w' + pad(w.week);
const findWeek = n => WEEKS.find(w => w.week === n);
const latest = () => WEEKS[WEEKS.length - 1];
const monthOf = w => C.months.find(m => m.n === w.month);
const wrapTables = html => html.replace(/<table>/g,'<div class="tbl"><table>').replace(/<\/table>/g,'</table></div>');
const audioSrc = path => (window.AUDIO && window.AUDIO[path]) || path;
const todayKey = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(x => x[1]);
const money = (n, dp = 0) => (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-AU', {minimumFractionDigits: dp, maximumFractionDigits: dp});

/* ---------- concepts and mastery ---------- */
const CONCEPTS = {};
WEEKS.forEach(w => (w.concepts || []).forEach(c => { CONCEPTS[c.id] = Object.assign({week: w.week}, c); }));
const INTERVALS = [0, 1, 2, 4, 8, 16, 32];
function mastery(){ return store.get('mastery', {}) }
function logActivity(){ const a = store.get('activity', {}); const k = todayKey(); a[k] = (a[k] || 0) + 1; store.set('activity', a); }
function record(cid, ok){
  if (!cid || !CONCEPTS[cid]) return;
  const all = mastery(), m = all[cid] || {box: 0, hist: [], due: 0};
  m.hist = m.hist.concat(ok ? 1 : 0).slice(-8);
  m.box = ok ? Math.min(m.box + 1, 6) : Math.floor(m.box / 2);
  m.due = ok ? Date.now() + INTERVALS[m.box] * DAY : Date.now();
  m.last = Date.now();
  all[cid] = m; store.set('mastery', all); logActivity();
}
function status(cid){
  const m = mastery()[cid];
  if (!m || !m.hist.length) return 'new';
  const last3 = m.hist.slice(-3), wrong = last3.filter(x => !x).length;
  if (m.hist.length >= 2 && wrong >= 2) return 'struggling';
  if (m.box >= 3 && m.hist.slice(-2).every(x => x)) return 'strong';
  return 'learning';
}
const STATUS_LABEL = {new: 'Not started', learning: 'Learning', strong: 'Strong', struggling: 'Needs help'};
function level(cid){ const m = mastery()[cid]; return m ? Math.round(Math.min(m.box, 5) / 5 * 100) : 0 }
function meter(cid){ const s = status(cid); return `<span class="meter s-${s}" title="${STATUS_LABEL[s]}"><i style="width:${Math.max(level(cid), s === 'new' ? 0 : 6)}%"></i></span>` }
function dueConcepts(){
  const all = mastery(), now = Date.now();
  return Object.keys(CONCEPTS).filter(id => all[id] && all[id].due <= now)
    .sort((a, b) => (status(b) === 'struggling') - (status(a) === 'struggling') || all[a].due - all[b].due);
}
function struggling(){ return Object.keys(CONCEPTS).filter(id => status(id) === 'struggling') }
const lastPool = {};
function genQ(cid){
  const c = CONCEPTS[cid]; if (!c) return null;
  const sources = (c.gens || []).filter(g => P[g]).map(g => ({g})).concat((c.pool || []).map((q, i) => ({i})));
  if (!sources.length) return null;
  let s, tries = 0;
  do { s = sources[Math.floor(Math.random() * sources.length)]; tries++; } while (sources.length > 1 && s.i !== undefined && s.i === lastPool[cid] && tries < 6);
  if (s.g) return Object.assign(P[s.g](), {c: cid});
  lastPool[cid] = s.i;
  const q = c.pool[s.i], order = shuffle(q.o.map((_, i) => i));
  return {q: q.q, o: order.map(i => q.o[i]), a: order.indexOf(q.a), e: q.e, c: cid};
}

/* one multiple-choice question; onAnswer(ok) after a pick */
function renderQ(el, q, label, onAnswer, opts = {}){
  el.innerHTML = `<div class="q"><span class="qn">${esc(label)}${q.c && CONCEPTS[q.c] ? ` · <a href="#c-${q.c}">${esc(CONCEPTS[q.c].name)}</a>` : ''}</span><p class="qt">${esc(q.q)}</p>
    <div class="opts">${q.o.map((o, j) => `<button class="opt" data-j="${j}">${String.fromCharCode(65 + j)}. ${esc(o)}</button>`).join('')}</div>
    <div class="expl" hidden></div></div>`;
  const paint = picked => {
    el.querySelectorAll('.opt').forEach(b => { const j = +b.dataset.j; b.classList.toggle('right', j === q.a); b.classList.toggle('wrong', j === picked && j !== q.a); b.disabled = true; });
    const ex = el.querySelector('.expl'); ex.hidden = false;
    const ok = picked === q.a;
    ex.innerHTML = `<b class="${ok ? 'ok' : 'no'}">${ok ? 'Correct.' : 'Not quite.'}</b> ${esc(q.e)}` +
      (!ok && q.c && CONCEPTS[q.c] && !opts.noHelp ? ` <a class="help" href="#c-${q.c}">See it explained another way →</a>` : '');
  };
  if (opts.picked !== undefined) { paint(opts.picked); return; }
  el.querySelectorAll('.opt').forEach(b => b.onclick = () => { const j = +b.dataset.j; paint(j); onAnswer && onAnswer(j === q.a, j); });
}

/* a run of generated questions with adaptive extra help */
function session(el, pickNext, total, title, done){
  let n = 0, right = 0, wrongStreak = {};
  const box = document.createElement('div'); el.appendChild(box);
  function next(){
    if (n >= total) {
      box.innerHTML = `<div class="panel result"><h3>${right} of ${total} correct</h3><p class="note">${right === total ? 'Excellent. These concepts move further out in your review schedule.' : right >= total * .7 ? 'Good work. Anything you missed comes back sooner in your reviews.' : 'These concepts are flagged for extra help. Work through the explanations below, then practise again.'}</p>
        ${struggling().length ? `<div class="chips">${struggling().map(id => `<a class="chip s-struggling" href="#c-${id}">${esc(CONCEPTS[id].name)}</a>`).join('')}</div>` : ''}
        <p><button class="primary" id="again">Another ${total} questions</button></p></div>`;
      box.querySelector('#again').onclick = () => { n = 0; right = 0; next(); };
      done && done(right);
      return;
    }
    const q = pickNext(n);
    if (!q) { box.innerHTML = '<p class="note">No questions available yet.</p>'; return; }
    box.innerHTML = `<div class="prog"><span>${title} · question ${n + 1} of ${total}</span><span>${right} correct</span></div><div class="qbox"></div><div class="extra"></div><p class="nextrow"><button class="primary" id="nq" hidden>Next question →</button></p>`;
    renderQ(box.querySelector('.qbox'), q, 'Q' + (n + 1), ok => {
      record(q.c, ok); if (ok) right++;
      wrongStreak[q.c] = ok ? 0 : (wrongStreak[q.c] || 0) + 1;
      if (!ok && (wrongStreak[q.c] >= 2 || status(q.c) === 'struggling')) {
        const c = CONCEPTS[q.c];
        box.querySelector('.extra').innerHTML = `<div class="assist"><span class="eyebrow">Let's look at this another way</span><h3>${esc(c.name)}</h3>${wrapTables(c.explain)}<details><summary>Worked example</summary>${wrapTables(c.example)}</details></div>`;
      }
      n++; const b = box.querySelector('#nq'); b.hidden = false; b.onclick = next; b.focus({preventScroll: true});
    });
  }
  next();
}

/* ---------- lesson schedule (planner) ---------- */
const ALL_LESSONS = [];
C.months.forEach(m => m.weeks.forEach((w, wi) => w.days.forEach((d, di) => ALL_LESSONS.push({month: m.n, week: (m.n - 1) * 4 + wi + 1, day: di + 1, title: d, weekTitle: w.title}))));
const lessonKey = l => 'w' + pad(l.week) + 'd' + l.day;
function plan(){ return Object.assign({start: todayKey(), days: [1, 2, 3, 4, 5]}, store.get('plan', {})) }
function scheduleDates(count){
  const p = plan(), out = [];
  const d = new Date(p.start + 'T00:00:00');
  while (out.length < count) { if (p.days.includes(d.getDay())) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
  return out;
}
function streak(){
  const a = store.get('activity', {}); let s = 0; const d = new Date();
  if (!a[todayKey(d)]) d.setDate(d.getDate() - 1);
  while (a[todayKey(d)]) { s++; d.setDate(d.getDate() - 1); }
  return s;
}
function nextLesson(){
  const done = store.get('done', {});
  return ALL_LESSONS.find(l => !done[lessonKey(l)]);
}
const fmtDate = d => d.toLocaleDateString('en-AU', {weekday: 'short', day: 'numeric', month: 'short'});

/* ---------- views ---------- */
function setBrand(w){ const m = w && monthOf(w); document.getElementById('brandsub').textContent = m ? `Month ${w.month} · ${m.title}` : 'Your finance degree, one day at a time'; }

function weekList(w){
  const done = store.get('done', {}), qs = store.get('quiz-' + wid(w), {}), answered = Object.keys(qs).length;
  return `<div class="days">
    ${w.days.map(d => { const k = wid(w) + 'd' + d.n; return `<a class="day" href="#${k}"><span class="no">Day ${d.n}</span><span class="t">${esc(d.title)}<span>${d.slides.length} slides · audio lecture · practice</span></span><span class="tick ${done[k] ? 'on' : ''}" aria-label="${done[k] ? 'Completed' : 'Not completed'}">✓</span></a>` }).join('')}
    ${(w.bites || []).length ? `<a class="day" href="#extras"><span class="no">Extra</span><span class="t">Knowledge bites<span>${w.bites.length} short extras with quick questions · ${w.bites.filter((b, i) => store.get('bites', {})[wid(w) + 'b' + (i + 1)]).length} read</span></span><span></span></a>` : ''}
    <a class="day quizrow" href="#quiz${w.week}"><span class="no">Wknd</span><span class="t">Week ${w.week} quiz<span>${w.quiz.mc.length} multiple choice · ${w.quiz.written.length} written${answered ? ` · ${answered} answered` : ''}</span></span><span class="tick ${answered >= w.quiz.mc.length ? 'on' : ''}">✓</span></a>
  </div>`;
}

function today(){
  const nl = nextLesson(), w = (nl && findWeek(nl.week)) || latest();
  setBrand(w);
  const built = nl && findWeek(nl.week);
  const due = dueConcepts(), help = struggling(), st = streak();
  const done = store.get('done', {}), doneCount = Object.keys(done).length;
  const xm = nextExamDue(), bod = biteOfDay();
  const hour = new Date().getHours(), hi = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">${hi}, Mitch</p>
    <h1>Today</h1>
    <div class="stats">
      <div><b>${st}</b><span>day streak</span></div>
      <div><b>${doneCount}</b><span>of ${ALL_LESSONS.length} lessons</span></div>
      <div><b>${Object.keys(CONCEPTS).filter(id => status(id) === 'strong').length}</b><span>concepts strong</span></div>
    </div>
    ${nl ? `<a class="hero" href="${built ? '#' + lessonKey(nl) : '#plan'}"><span class="eyebrow">Next lesson · Month ${nl.month} · Week ${nl.week} · Day ${nl.day}</span><h2>${esc(nl.title)}</h2><span class="note">${built ? 'Slides, a ten-minute audio lecture and practice questions' : 'This week is being written. It arrives on Saturday.'}</span><span class="go">${built ? 'Start →' : 'See plan →'}</span></a>` : ''}
    ${help.length ? `<section class="helpbox"><span class="eyebrow">Extra help</span><h3>You're finding ${help.length === 1 ? 'this concept' : 'these concepts'} tricky</h3><p class="note">Each one has a different explanation, a worked example and fresh practice questions.</p><div class="chips">${help.map(id => `<a class="chip s-struggling" href="#c-${id}">${esc(CONCEPTS[id].name)} →</a>`).join('')}</div></section>` : ''}
    ${xm ? `<a class="hero exam" href="#exam-${xm.id}"><span class="eyebrow">${EXAM_KIND[xm.kind]} ready</span><h2>${esc(xm.title)}</h2><span class="note">You have finished every lesson it covers. Sit it to lock in what you have learned.</span><span class="go">Go to exam →</span></a>` : ''}
    <section class="review"><div><span class="eyebrow">Spaced review</span><h3>${due.length ? `${due.length} concept${due.length > 1 ? 's' : ''} due for review` : 'Nothing due right now'}</h3><p class="note">${due.length ? 'Short, fresh questions on things you have learned, timed so they stick.' : 'Concepts come back for review just before you would forget them. Practise anything any time.'}</p></div><a class="btn ${due.length ? 'primary' : ''}" href="#practice">${due.length ? 'Start review' : 'Practise'}</a></section>
    ${bod ? `<section class="review bitecard"><div><span class="eyebrow">Today's knowledge bite · ${esc(bod.tag || 'Extra')}</span><h3>${esc(bod.t)}</h3><p class="note">A one-minute extra beyond the lessons, with a question at the end.</p></div><a class="btn" href="#extras">Read it</a></section>` : ''}
    <h2>Week ${w.week}: ${esc(w.title)}</h2>
    ${weekList(w)}
    ${WEEKS.length > 1 ? `<h2>Other weeks</h2><div class="days">${WEEKS.filter(x => x !== w).map(x => `<a class="day" href="#week${x.week}"><span class="no">Wk ${x.week}</span><span class="t">${esc(x.title)}<span>Month ${x.month}</span></span><span></span></a>`).join('')}</div>` : ''}`;
}

function weekView(n){
  const w = findWeek(n) || latest(); setBrand(w);
  app.innerHTML = `<p class="eyebrow" style="margin-top:28px">Month ${w.month} · Week ${w.week}</p><h1>${esc(w.title)}</h1><p class="lede">Five short lessons, Monday to Friday, each with slides, an audio lecture and practice. Finish with the quiz on the weekend.</p>${weekList(w)}`;
}

let cur = {w: 1, day: 1, i: 0};
function lesson(wn, n, i, keep){
  const w = findWeek(wn); if (!w) return today();
  const d = w.days.find(x => x.n === n); if (!d) return weekView(wn);
  setBrand(w);
  const key = wid(w) + 'd' + n, pos = store.get('pos', {});
  if (i == null) i = pos[key] || 0;
  cur = {w: wn, day: n, i: Math.max(0, Math.min(i, d.slides.length - 1))};
  const s = d.slides[cur.i], last = cur.i === d.slides.length - 1;
  CTX = {w, label: `Week ${w.week}, Day ${d.n}: ${d.title} (slide ${cur.i + 1}, "${s.h}")`, text: `Lesson: ${d.title}\nCurrent slide: ${s.h}\n${plain(s.b)}\n\nOther slides in this lesson: ${d.slides.map(x => x.h).join('; ')}`};
  if (pos[key] !== cur.i) { pos[key] = cur.i; store.set('pos', pos); }
  if (last) markDone(key);
  const audioEl = document.getElementById('aud');
  if (!(keep && audioEl && audioEl.dataset.key === key)) {
    app.innerHTML = `
      <div class="lesson-head"><span class="eyebrow">Week ${w.week} · Day ${d.n}</span><a href="#week${w.week}" class="back">← All lessons</a><h1>${esc(d.title)}</h1></div>
      <audio id="aud" data-key="${key}" controls preload="none" src="${audioSrc(d.audio)}"></audio>
      <p class="note" id="audnote" style="margin:0">Audio lecture. Listen alongside the slides, or on its own on the go.</p>
      <div id="slidebox"></div>${askLink()}<div id="checkbox"></div>`;
    document.getElementById('aud').addEventListener('error', () => { document.getElementById('audnote').textContent = 'This audio lecture is not available yet. Check back shortly.'; });
  }
  const sy = window.scrollY;
  document.getElementById('slidebox').innerHTML = `
    <section class="slide" id="slide" aria-live="polite"><span class="eyebrow">${esc(s.k)}</span><h2>${esc(s.h)}</h2>${wrapTables(s.b)}</section>
    <div class="dots">${d.slides.map((_, j) => `<i class="${j <= cur.i ? 'on' : ''}"></i>`).join('')}</div>
    <div class="pager"><button id="prev" ${cur.i === 0 ? 'disabled' : ''}>← Back</button><span class="count">${cur.i + 1} / ${d.slides.length}</span>
      ${last ? `<button class="primary" id="tocheck">Check your understanding ↓</button>` : `<button class="primary" id="next">Next →</button>`}</div>`;
  const cb = document.getElementById('checkbox');
  if (last && !cb.dataset.built) { cb.dataset.built = '1'; buildCheck(cb, w, d, key); }
  if (!last) { cb.innerHTML = ''; delete cb.dataset.built; }
  if (keep) window.scrollTo(0, sy);
  const go = k => lesson(wn, n, cur.i + k, true);
  document.getElementById('prev').onclick = () => go(-1);
  const nx = document.getElementById('next'); if (nx) nx.onclick = () => go(1);
  const tc = document.getElementById('tocheck'); if (tc) tc.onclick = () => cb.scrollIntoView({behavior: 'smooth'});
  const sl = document.getElementById('slide'); let x0 = null;
  sl.addEventListener('touchstart', e => { x0 = e.touches[0].clientX }, {passive: true});
  sl.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) { if (dx < 0 && cur.i < d.slides.length - 1) go(1); if (dx > 0 && cur.i > 0) go(-1); } });
}
function markDone(key){ const dn = store.get('done', {}); if (dn[key]) return; dn[key] = todayKey(); store.set('done', dn); logActivity(); }
function buildCheck(cb, w, d, key){
  const ids = (d.concepts || []).filter(id => CONCEPTS[id]);
  const done = store.get('done', {});
  cb.innerHTML = `<h2>Check your understanding</h2><p class="lede">Three questions on today's concepts. Your answers update your mastery and review schedule. Get stuck and you will be shown another way to think about it.</p><div id="chk"></div>
    <div class="concept-links">${ids.map(id => `<a class="chip s-${status(id)}" href="#c-${id}">${esc(CONCEPTS[id].name)}</a>`).join('')}</div>
    <div class="pager"><button class="primary" id="fin">${done[key] ? 'Completed ✓' : 'Mark lesson complete'}</button></div>
    ${d.n < w.days.length ? `<p style="text-align:right"><a href="#${wid(w)}d${d.n + 1}">Day ${d.n + 1}: ${esc(w.days[d.n].title)} →</a></p>` : `<p style="text-align:right"><a href="#quiz${w.week}">Take the Week ${w.week} quiz →</a></p>`}`;
  if (ids.length) session(cb.querySelector('#chk'), i => genQ(ids[i % ids.length]), 3, 'Lesson check');
  cb.querySelector('#fin').onclick = e => { markDone(key); e.target.textContent = 'Completed ✓'; };
}
document.addEventListener('keydown', e => {
  if (!/^#w\d+d\d+$/.test(location.hash) || /TEXTAREA|INPUT/.test(e.target.tagName)) return;
  const d = findWeek(cur.w).days.find(x => x.n === cur.day);
  if (e.key === 'ArrowRight' && cur.i < d.slides.length - 1) lesson(cur.w, cur.day, cur.i + 1, true);
  if (e.key === 'ArrowLeft' && cur.i > 0) lesson(cur.w, cur.day, cur.i - 1, true);
});

function conceptView(id){
  const c = CONCEPTS[id]; if (!c) return practice();
  const w = findWeek(c.week); setBrand(w);
  const s = status(id), m = mastery()[id];
  CTX = {w, label: `Concept: ${c.name}`, text: `Concept: ${c.name}\n${plain(c.explain)}\nWorked example:\n${plain(c.example)}`};
  app.innerHTML = `
    <div class="lesson-head"><span class="eyebrow">Concept · Week ${c.week} · Day ${c.day}</span><a class="back" href="#practice">← All concepts</a><h1>${esc(c.name)}</h1></div>
    <div class="mrow">${meter(id)}<span class="pill s-${s}">${STATUS_LABEL[s]}</span>${m ? `<span class="note">${m.hist.filter(x => x).length} of last ${m.hist.length} correct</span>` : ''}</div>
    <div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-t="explain">Another way to see it</button><button role="tab" data-t="example">Worked example</button></div>
    <section class="slide" id="cpanel">${wrapTables(c.explain)}</section>
    <p class="note">Want the original lesson? <a href="#w${pad(c.week)}d${c.day}">Week ${c.week}, Day ${c.day} slides →</a></p>
    ${askLink()}<h2>Practise</h2><p class="lede">Fresh questions every time${(c.gens || []).length ? ', with new numbers' : ''}. Keep going until this shows as Strong.</p><div id="cprac"></div>`;
  app.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
    app.querySelectorAll('.tabs button').forEach(x => x.setAttribute('aria-selected', x === b));
    document.getElementById('cpanel').innerHTML = wrapTables(b.dataset.t === 'explain' ? c.explain : c.example);
  });
  session(document.getElementById('cprac'), () => genQ(id), 5, 'Practice', () => { const mr = app.querySelector('.mrow'); if (mr) { const s2 = status(id); mr.querySelector('.meter').outerHTML = meter(id); const p = mr.querySelector('.pill'); p.className = 'pill s-' + s2; p.textContent = STATUS_LABEL[s2]; } });
}

function practice(){
  setBrand(latest());
  const due = dueConcepts(), help = struggling();
  const learned = Object.keys(CONCEPTS).filter(id => mastery()[id]);
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Practice and review</p><h1>Practice</h1>
    <p class="lede">Every answer you give, in lessons, quizzes and here, updates how well you know each concept. Weak concepts come back sooner and get extra help. Strong ones come back less often.</p>
    <div class="seg"><button class="primary" id="rev">${due.length ? `Review ${due.length} due` : 'Review (nothing due)'}</button><button id="mix">Mixed practice</button>${help.length ? `<button id="weak">Work on weak spots</button>` : ''}</div>
    <div id="sess"></div>
    <h2>Concepts</h2>
    ${WEEKS.map(w => `<h3 class="wkh">Week ${w.week}: ${esc(w.title)}</h3><div class="clist">${(w.concepts || []).map(c => { const s = status(c.id); return `<a class="crow" href="#c-${c.id}"><span class="t">${esc(c.name)}<span>Day ${c.day} · ${STATUS_LABEL[s]}${due.includes(c.id) ? ' · due' : ''}</span></span>${meter(c.id)}</a>` }).join('')}</div>`).join('')}`;
  const start = (ids, title) => { const box = document.getElementById('sess'); box.innerHTML = ''; const order = shuffle(ids); session(box, i => genQ(order[i % order.length]), Math.min(10, Math.max(5, order.length)), title, () => {}); box.scrollIntoView({behavior: 'smooth'}); };
  document.getElementById('rev').onclick = () => start(due.length ? due : (learned.length ? learned : Object.keys(CONCEPTS)), 'Review');
  document.getElementById('mix').onclick = () => start(Object.keys(CONCEPTS), 'Mixed practice');
  const wk = document.getElementById('weak'); if (wk) wk.onclick = () => start(help, 'Weak spots');
}

function quiz(wn){
  const w = findWeek(wn) || latest(); setBrand(w);
  const K = 'quiz-' + wid(w), KW = 'quizw-' + wid(w);
  const score = () => { const a = store.get(K, {}); const k = Object.keys(a); return `${k.filter(i => a[i] === w.quiz.mc[i].a).length} correct of ${k.length} answered · ${w.quiz.mc.length} questions`; };
  const drafts = store.get(KW, {});
  CTX = {w, label: `Week ${w.week} quiz`, text: `Week ${w.week} quiz on ${w.title}. Topics: ${w.days.map(d => d.title).join('; ')}`};
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Month ${w.month} · Week ${w.week}</p><h1>Week ${w.week} quiz</h1>
    <p class="lede">Part A: ${w.quiz.mc.length} multiple-choice questions, marked as you go. Part B: ${w.quiz.written.length} written questions. Write your answer, then compare it with the model answer. Aim for 80% on Part A before moving on.</p>
    <div class="score" id="score">${score()}</div>
    <h2>Part A · Multiple choice</h2><div id="mcq"></div>
    <h2>Part B · Written</h2>
    ${w.quiz.written.map((q, i) => `<div class="q"><span class="qn">B${i + 1}</span><p class="qt">${esc(q.q)}</p>
      <label class="note" for="w${i}">Your answer (saved on this device)</label><textarea id="w${i}" data-i="${i}">${esc(drafts[i] || '')}</textarea>
      ${IN_CLAUDE ? `<p class="seg" style="margin-top:8px"><button class="fb" data-i="${i}">Mark my answer</button></p><div class="answer" id="fb${i}" hidden></div>` : ''}
      <details style="margin-top:8px"><summary>Show model answer</summary><div class="model">${esc(q.a)}</div></details></div>`).join('')}
    <p class="seg" style="margin-top:24px"><button id="copyw">Copy my answers for marking</button><button id="reset">Clear my answers</button></p>
    <p class="note" id="copynote">${IN_CLAUDE ? 'Tap Mark my answer under each written question for instant marking.' : 'Paste your copied answers into the project thread and Claude will mark them and adjust your course.'}</p>`;
  const ans = store.get(K, {}), mcq = document.getElementById('mcq');
  w.quiz.mc.forEach((q, i) => {
    const el = document.createElement('div'); mcq.appendChild(el);
    renderQ(el, q, 'A' + (i + 1), (ok, j) => { const a = store.get(K, {}); a[i] = j; store.set(K, a); record(q.c, ok); document.getElementById('score').textContent = score(); }, {picked: ans[i]});
  });
  app.querySelectorAll('textarea').forEach(t => t.oninput = () => { const d = store.get(KW, {}); d[t.dataset.i] = t.value; store.set(KW, d); });
  document.getElementById('reset').onclick = () => { store.set(K, {}); store.set(KW, {}); quiz(wn); };
  app.querySelectorAll('button.fb').forEach(b => b.onclick = () => {
    const i = +b.dataset.i, mine = (document.getElementById('w' + i).value || '').trim(), out = document.getElementById('fb' + i);
    out.hidden = false;
    if (!mine) { out.textContent = 'Write your answer in the box first, then tap Mark my answer.'; return; }
    if (!ask.ready) { out.textContent = 'Still connecting to Claude. Try again in a moment.'; return; }
    const fbs = store.get('fb-' + wid(w), {});
    askClaude(`${TUTOR}\n\nMark Mitch's answer to this Week ${w.week} quiz question out of 5, like a fair but encouraging lecturer. Start with "Mark: N/5". Then say in a few short lines what he got right, what is missing or wrong (fix any calculation), and one tip to improve. Under 200 words.\n\nQuestion:\n${w.quiz.written[i].q}\n\nModel answer (for you, the marker):\n${w.quiz.written[i].a}\n\nMitch's answer:\n${mine}`, out,
      text => { fbs[i] = {t: Date.now(), text}; store.set('fb-' + wid(w), fbs); const m = text.match(/Mark:\s*(\d)/); if (m) { const sc = store.get('wscore', {}); sc[wid(w) + 'B' + (i + 1)] = +m[1]; store.set('wscore', sc); } });
  });
  { const fbs = store.get('fb-' + wid(w), {}); Object.keys(fbs).forEach(i => { const o = document.getElementById('fb' + i); if (o) { o.hidden = false; o.textContent = fbs[i].text; } }); }
  document.getElementById('copyw').onclick = () => {
    const d = store.get(KW, {}), a = store.get(K, {});
    const mc = Object.keys(a).filter(i => a[i] === w.quiz.mc[i].a).length;
    const weak = struggling().map(id => CONCEPTS[id].name);
    const txt = `Week ${w.week} quiz. Part A: ${mc}/${w.quiz.mc.length}.${weak.length ? ' Struggling with: ' + weak.join(', ') + '.' : ''}\n\n` + w.quiz.written.map((q, i) => `B${i + 1}. ${d[i] || '(no answer)'}`).join('\n\n');
    copyText(txt, document.getElementById('copynote'), 'Copied. Paste it into the project thread.');
  };
}
function copyText(txt, note, okMsg){
  const fallback = () => { const ta = document.createElement('textarea'); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); note.textContent = okMsg } catch (e) { note.textContent = 'Copy failed. Select the text and copy it manually.' } ta.remove(); };
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(() => { note.textContent = okMsg }, fallback); else fallback();
}

function planView(){
  setBrand(latest());
  const p = plan(), done = store.get('done', {}), dates = scheduleDates(ALL_LESSONS.length);
  const idx = ALL_LESSONS.findIndex(l => !done[lessonKey(l)]), t0 = new Date(todayKey() + 'T00:00:00');
  const expected = dates.filter(d => d <= t0).length, doneCount = Object.keys(done).length, diff = doneCount - expected;
  const builtWeeks = new Set(WEEKS.map(w => w.week));
  const upcoming = ALL_LESSONS.map((l, i) => ({l, d: dates[i]})).slice(Math.max(0, idx), Math.max(0, idx) + 10);
  const lastDate = dates[dates.length - 1];
  const dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Course planner</p><h1>Your plan</h1>
    <p class="lede">${ALL_LESSONS.length} lessons in ${C.months.length} subjects, covering every core course of the UNSW Master of Applied Finance. At your pace you finish the core course on <b>${lastDate.toLocaleDateString('en-AU', {day: 'numeric', month: 'long', year: 'numeric'})}</b>. After that, new advanced modules keep arriving every week.</p>
    <div class="stats">
      <div><b>${doneCount}</b><span>lessons done</span></div>
      <div><b class="${diff < 0 ? 'behind' : ''}">${diff === 0 ? 'On track' : diff > 0 ? '+' + diff : diff}</b><span>${diff === 0 ? 'with your plan' : diff > 0 ? 'lessons ahead' : 'lessons behind'}</span></div>
      <div><b>${streak()}</b><span>day streak</span></div>
    </div>
    <details class="panel setup"><summary><b>Change your schedule</b></summary>
      <div class="form"><label for="pstart">Start date</label><input type="date" id="pstart" value="${p.start}">
      <span class="lbl">Study days</span><div class="daypick">${[1, 2, 3, 4, 5, 6, 0].map(d => `<label><input type="checkbox" value="${d}" ${p.days.includes(d) ? 'checked' : ''}> ${dn[d]}</label>`).join('')}</div>
      <button class="primary" id="psave">Save schedule</button></div></details>
    <h2>Coming up</h2>
    <div class="days">${upcoming.map(({l, d}) => { const b = builtWeeks.has(l.week); return `<a class="day" href="${b ? '#' + lessonKey(l) : '#plan'}"><span class="no">${fmtDate(d)}</span><span class="t">${esc(l.title)}<span>Month ${l.month} · Week ${l.week} · Day ${l.day}${b ? '' : ' · being written'}</span></span><span class="tick ${done[lessonKey(l)] ? 'on' : ''}">✓</span></a>` }).join('')}</div>
    <h2>Course map</h2>
    <p class="lede">${esc(C.rhythm)} Standards assumed: ${esc(C.jurisdiction)}.</p>
    ${C.months.map(m => { const ls = ALL_LESSONS.filter(l => l.month === m.n), dc = ls.filter(l => done[lessonKey(l)]).length, first = dates[ALL_LESSONS.indexOf(ls[0])];
      return `<details class="month" ${idx >= 0 && ALL_LESSONS[idx].month === m.n ? 'open' : ''}>
      <summary><span class="mn">M${pad(m.n)}</span><span><h3>${esc(m.title)}</h3><p class="goal">${esc(m.goal)}</p><span class="mbar"><i style="width:${dc / ls.length * 100}%"></i></span><span class="note">${dc}/${ls.length} lessons · starts ${fmtDate(first)}</span></span></summary>
      <div class="body"><p class="src">Draws on: ${esc(m.draws_on)}</p>${(m.unsw || []).length ? `<p class="unsw">UNSW Applied Finance: ${esc(m.unsw.join(' · '))}</p>` : ''}
        ${m.weeks.map((w, i) => { const n = (m.n - 1) * 4 + i + 1; return `<div class="wk"><b>${builtWeeks.has(n) ? `<a href="#week${n}">Week ${n}: ${esc(w.title)}</a>` : `Week ${n}: ${esc(w.title)}`}</b><ol>${w.days.map(d => `<li>${esc(d)}</li>`).join('')}</ol></div>` }).join('')}
        <p class="note"><a href="#exam-m${pad(m.n)}">Month ${m.n} exam</a>: ${fmtDate(dates[ALL_LESSONS.indexOf(ls[ls.length - 1])])} or after.${TERMS.some(t => t.months[t.months.length - 1] === m.n) ? ` Then the <a href="#exam-t${TERMS.find(t => t.months[t.months.length - 1] === m.n).n}">Term ${TERMS.find(t => t.months[t.months.length - 1] === m.n).n} exam</a>.` : ''}</p></div></details>` }).join('')}
    <h2>How you are assessed</h2>
    <div class="grid2">
      <div class="panel"><b>Daily</b>Three-question check at the end of each lesson, plus spaced review.</div>
      <div class="panel"><b>Weekly quiz</b>15 multiple choice (pass 80%) and 4 to 5 written answers, marked by Claude.</div>
      <div class="panel"><b>Month exam</b>40 multiple choice (40%), 4 short answer (30%), one case study (30%). 90 minutes, pass 70%, distinction 85%.</div>
      <div class="panel"><b>Term exam</b>Every three or four months, a cumulative exam on the whole term. 60 multiple choice, 4 short answer, one case study. 2 hours.</div>
      <div class="panel"><b>Final exam</b>The whole course: 80 multiple choice, 6 short answer, one case study. 3 hours.</div>
      <div class="panel"><b>Knowledge bites</b>Optional extras each week with quick quizzes. They feed your spaced review.</div>
    </div>
    <p><a class="btn primary" href="#exams">See all exams</a></p>
    <h2>Use it on your phone and computer</h2>
    <p class="lede" id="syncnote">${syncText()}</p><p class="note">To move progress between copies or devices, copy your progress code here and paste it in the other one.</p>
    <div class="seg"><button id="exp">Copy progress code</button><button id="imp">Paste a progress code</button></div>
    <div id="impbox" hidden><textarea id="impcode" placeholder="Paste your progress code here"></textarea><p class="seg"><button class="primary" id="impgo">Load progress</button></p></div>
    <p class="note" id="bnote"></p>`;
  document.getElementById('psave').onclick = () => {
    const days = [...app.querySelectorAll('.daypick input:checked')].map(x => +x.value);
    store.set('plan', {start: document.getElementById('pstart').value || todayKey(), days: days.length ? days : [1, 2, 3, 4, 5]}); planView();
  };
  document.getElementById('exp').onclick = () => {
    const all = store.all();
    copyText('BFA1:' + btoa(unescape(encodeURIComponent(JSON.stringify(all)))), document.getElementById('bnote'), 'Progress code copied. Paste it on your other device under Plan → Paste a progress code.');
  };
  document.getElementById('imp').onclick = () => { document.getElementById('impbox').hidden = false; };
  document.getElementById('impgo').onclick = () => {
    const note = document.getElementById('bnote');
    try { const raw = document.getElementById('impcode').value.trim().replace(/^BFA1:/, ''); const all = JSON.parse(decodeURIComponent(escape(atob(raw))));
      store.load(mergeProgress(MEM, all, true)); store.set('imported', todayKey()); note.textContent = 'Progress loaded.'; setTimeout(planView, 600);
    } catch (e) { note.textContent = 'That code could not be read. Copy the whole code, starting with BFA1:, and try again.'; }
  };
}

/* ---------- extras: knowledge bites and quick quizzes ---------- */
// weekNNb.js adds w.bites = [{t, tag, b (html), src, q: {q, o, a, e, c?}}]: short extra learning beyond the lessons.
const BITES = [];
WEEKS.forEach(w => (w.bites || []).forEach((b, i) => BITES.push(Object.assign({week: w.week, month: w.month, id: wid(w) + 'b' + (i + 1)}, b))));
function currentWeekNo(){ const nl = nextLesson(); return nl ? nl.week : latest().week; }
function biteOfDay(){
  const upto = Math.max(currentWeekNo(), WEEKS[0] ? WEEKS[0].week : 1), pool = BITES.filter(b => b.week <= upto);
  if (!pool.length) return null;
  const k = todayKey(), cur = store.get('bod', {});
  if (cur.d === k && BITES.find(b => b.id === cur.id)) return BITES.find(b => b.id === cur.id);
  const seen = store.get('bites', {}), fresh = pool.filter(b => !seen[b.id]);
  const pick = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
  store.set('bod', {d: k, id: pick.id});
  return pick;
}
function markBite(id){ const s = store.get('bites', {}); if (!s[id]) { s[id] = todayKey(); store.set('bites', s); } }
function biteCard(b, open){
  const seen = store.get('bites', {})[b.id];
  return `<article class="bite" id="${b.id}"><span class="eyebrow">${esc(b.tag || 'Knowledge bite')} · Week ${b.week}</span><h3>${esc(b.t)}</h3>${wrapTables(b.b)}
    ${b.src ? `<p class="src">Source: ${esc(b.src)}</p>` : ''}
    ${b.q ? `<details ${open ? 'open' : ''}><summary>Test yourself</summary><div class="bq" data-id="${b.id}"></div></details>` : ''}
    ${seen ? '' : `<p><button class="mk" data-id="${b.id}">Got it</button></p>`}</article>`;
}
function wireBites(root){
  root.querySelectorAll('.bq').forEach(el => { const b = BITES.find(x => x.id === el.dataset.id); const q = biteQ(b);
    renderQ(el, q, 'Bite', ok => { if (q.c) record(q.c, ok); biteResult(b.id, ok); markBite(b.id); }); });
  root.querySelectorAll('.mk').forEach(x => x.onclick = () => { markBite(x.dataset.id); x.parentNode.innerHTML = '<span class="note">Saved to your bites ✓</span>'; });
}
function biteQ(b){ const order = shuffle(b.q.o.map((_, i) => i)); return {q: b.q.q, o: order.map(i => b.q.o[i]), a: order.indexOf(b.q.a), e: b.q.e, c: b.q.c}; }
function biteResult(id, ok){ const r = store.get('biteq', {}); r[id] = (r[id] || []).concat(ok ? 1 : 0).slice(-4); store.set('biteq', r); logActivity(); }
function extrasView(){
  setBrand(latest());
  const upto = currentWeekNo(), b = biteOfDay(), seen = store.get('bites', {}), r = store.get('biteq', {});
  const avail = BITES.filter(x => x.week <= Math.max(upto, WEEKS[0].week));
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Extra learning</p><h1>Knowledge bites</h1>
    <p class="lede">Short extras that go beyond the lessons: real Australian examples, myths, pro tips and the rules behind the numbers. Each takes a minute or two and ends with a question. New bites arrive with every week of the course.</p>
    <div class="stats"><div><b>${Object.keys(seen).length}</b><span>of ${BITES.length} bites read</span></div><div><b>${Object.values(r).filter(h => h[h.length - 1]).length}</b><span>bite questions right</span></div><div><b>${streak()}</b><span>day streak</span></div></div>
    ${b ? `<h2>Today's bite</h2>${biteCard(b, false)}` : ''}
    <section class="review"><div><span class="eyebrow">Two-minute quiz</span><h3>Five quick questions</h3><p class="note">Mixed bite questions from the weeks you have reached, with the ones you got wrong first.</p></div><button class="primary" id="bquiz">Start quick quiz</button></section>
    <div id="bsess"></div>
    <h2>All bites</h2>
    ${WEEKS.filter(w => (w.bites || []).length).map(w => `<details class="month"><summary><span class="mn">W${pad(w.week)}</span><span><h3>${esc(w.title)}</h3><span class="note">${w.bites.length} bites · ${BITES.filter(x => x.week === w.week && seen[x.id]).length} read${w.week > upto ? ' · ahead of where you are' : ''}</span></span></summary>
      <div class="body bites">${BITES.filter(x => x.week === w.week).map(x => biteCard(x, false)).join('')}</div></details>`).join('')}`;
  wireBites(app);
  document.getElementById('bquiz').onclick = () => {
    const withQ = avail.filter(x => x.q), wrongFirst = shuffle(withQ).sort((p, q) => ((r[p.id] || [1]).slice(-1)[0]) - ((r[q.id] || [1]).slice(-1)[0]));
    const pick = wrongFirst.slice(0, 5), box = document.getElementById('bsess'); box.innerHTML = '';
    if (!pick.length) { box.innerHTML = '<p class="note">No bite questions yet.</p>'; return; }
    session(box, i => { const q = biteQ(pick[i % pick.length]); q.bid = pick[i % pick.length].id; return q; }, Math.min(5, pick.length), 'Quick quiz');
    box.scrollIntoView({behavior: 'smooth'});
  };
}

/* ---------- exams: month, term and final ---------- */
// Assessment ladder: lesson checks → weekly quiz → month exam → term exam (every few months, cumulative) → final exam.
// examMM.js / examT1.js etc. push hand-written papers into window.EXAMS = [{id, mc:[{q,o,a,e,c}], short:[{q,a,marks}], case:{title, brief, parts:[{q,a,marks}]}}].
// Without a hand-written paper, the exam is assembled from the course's question banks for the weeks it covers.
const PAPERS = {}; (window.EXAMS || []).forEach(x => { PAPERS[x.id] = x; });
const TERMS = C.terms || [{n: 1, title: 'Foundations', months: [1, 2, 3]}, {n: 2, title: 'The Economy and the Firm', months: [4, 5, 6]}, {n: 3, title: 'Corporate Finance, Valuation and Law', months: [7, 8, 9]},
  {n: 4, title: 'Governance, Investing and Property', months: [10, 11, 12]}, {n: 5, title: 'Valuation, Credit and Risk', months: [13, 14, 15]}, {n: 6, title: 'Global, Private Markets and Capstone', months: [16, 17, 18, 19]}];
const weeksOfMonths = ms => ALL_LESSONS.filter(l => ms.includes(l.month)).map(l => l.week).filter((v, i, a) => a.indexOf(v) === i);
function examList(){
  const out = [];
  C.months.forEach(m => {
    out.push({id: 'm' + pad(m.n), kind: 'month', title: `Month ${m.n} exam: ${m.title}`, months: [m.n], mcN: 40, shortN: 4, minutes: 90});
    const t = TERMS.find(t => t.months[t.months.length - 1] === m.n);
    if (t) out.push({id: 't' + t.n, kind: 'term', title: `Term ${t.n} exam: ${t.title}`, months: t.months, mcN: 60, shortN: 4, minutes: 120});
  });
  out.push({id: 'final', kind: 'final', title: 'Final exam: the whole course', months: C.months.map(m => m.n), mcN: 80, shortN: 6, minutes: 180});
  out.forEach(x => { x.weeks = weeksOfMonths(x.months); x.lessons = ALL_LESSONS.filter(l => x.months.includes(l.month)); });
  return out;
}
const EXAM_KIND = {month: 'Month exam', term: 'Term exam (cumulative)', final: 'Final exam'};
function examState(x){
  const done = store.get('done', {}), left = x.lessons.filter(l => !done[lessonKey(l)]).length;
  const built = x.weeks.every(n => findWeek(n)), att = store.get('exam-' + x.id, []), best = att.reduce((b, a) => Math.max(b, a.total || 0), -1);
  return {left, built, att, best, passed: best >= 70, ready: built && left === 0};
}
function examBank(x){
  // MC items from every concept pool, generator and weekly quiz in the weeks covered, spread evenly across weeks
  const byWeek = x.weeks.filter(findWeek).map(n => {
    const w = findWeek(n), items = [];
    (w.concepts || []).forEach(c => { (c.pool || []).forEach(q => items.push(Object.assign({c: c.id}, q))); (c.gens || []).filter(g => P[g]).forEach(g => items.push({gen: g, c: c.id})); });
    w.quiz.mc.forEach(q => items.push(q));
    return shuffle(items);
  });
  return byWeek;
}
function makeMC(item){
  if (item.gen) return Object.assign(P[item.gen](), {c: item.c});
  const order = shuffle(item.o.map((_, i) => i));
  return {q: item.q, o: order.map(i => item.o[i]), a: order.indexOf(item.a), e: item.e, c: item.c};
}
function buildPaper(x){
  const hand = PAPERS[x.id], paper = {mc: [], short: [], case: null, hand: !!hand};
  const seenQ = new Set(), add = it => { const k = it.gen ? it.gen + Math.random() : it.q; if (seenQ.has(k)) return false; seenQ.add(k); paper.mc.push(makeMC(it)); return true; };
  if (hand && hand.mc) shuffle(hand.mc).slice(0, x.mcN).forEach(add);
  // term and final exams also draw on the hand-written month papers they cover
  if (x.kind !== 'month') shuffle([].concat(...x.months.map(m => (PAPERS['m' + pad(m)] || {}).mc || []))).slice(0, Math.round(x.mcN / 2)).forEach(it => paper.mc.length < x.mcN && add(it));
  const banks = examBank(x); let guard = 0;
  while (paper.mc.length < x.mcN && banks.some(b => b.length) && guard++ < 5000) banks.forEach(b => { if (paper.mc.length < x.mcN && b.length) add(b.pop()); });
  paper.mc = shuffle(paper.mc);
  const written = [].concat(...x.weeks.filter(findWeek).map(n => findWeek(n).quiz.written.map(q => ({q: q.q, a: q.a, marks: 5}))));
  const monthShorts = x.kind === 'month' ? [] : [].concat(...x.months.map(m => (PAPERS['m' + pad(m)] || {}).short || []));
  paper.short = (hand && hand.short ? hand.short.slice() : []).concat(shuffle(monthShorts), shuffle(written)).slice(0, x.shortN).map(q => ({q: q.q, a: q.a, marks: q.marks || 5}));
  const cs = (hand && hand.case) || (x.kind !== 'month' && shuffle(x.months.map(m => (PAPERS['m' + pad(m)] || {}).case).filter(Boolean))[0]);
  paper.case = cs || (written.length ? {title: 'Case study', brief: 'Answer in full sentences, showing any working.', parts: [written.sort((p, q) => q.q.length - p.q.length)[0]].map(q => ({q: q.q, a: q.a, marks: 10}))} : null);
  return paper;
}
function examsView(){
  setBrand(latest());
  const list = examList(), next = list.find(x => !examState(x).passed);
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Assessment</p><h1>Exams</h1>
    <p class="lede">Exams lock in what you have learned. Each month ends with an exam on that month. Every term (three or four months) has a cumulative exam that brings back everything since the last one, and the course ends with a final exam. You need 70% to pass and 85% for a distinction. If you miss, review the concepts it flags and sit a fresh paper a day or two later.</p>
    <div class="grid2">
      <div class="panel"><b>Month exam</b>40 multiple choice (40%), 4 short answer (30%), one case study (30%). 90 minutes.</div>
      <div class="panel"><b>Term exam</b>Cumulative over the term. 60 multiple choice (40%), 4 short answer (30%), one case study (30%). 2 hours.</div>
      <div class="panel"><b>Final exam</b>The whole course. 80 multiple choice (40%), 6 short answer (30%), one case study (30%). 3 hours.</div>
    </div>
    <h2>Your exams</h2>
    <div class="days">${list.map(x => { const s = examState(x);
      const note = s.passed ? `Passed · best ${s.best}%${s.best >= 85 ? ' · distinction' : ''}` : s.att.length ? `Best ${s.best}% · ${s.att.length} attempt${s.att.length > 1 ? 's' : ''} · not yet passed` : s.ready ? 'Ready to sit' : !s.built ? 'Unlocks when its lessons are written and finished' : `Unlocks after ${s.left} more lesson${s.left > 1 ? 's' : ''}`;
      return `<a class="day ${x.kind !== 'month' ? 'quizrow' : ''}" href="#exam-${x.id}"><span class="no">${x.kind === 'month' ? 'M' + pad(x.months[0]) : x.kind === 'term' ? 'T' + x.id.slice(1) : 'FIN'}</span><span class="t">${esc(x.title)}<span>${note}</span></span><span class="tick ${s.passed ? 'on' : ''}">✓</span></a>`; }).join('')}</div>
    ${next ? `<p class="note">Next up: <a href="#exam-${next.id}">${esc(next.title)}</a>.</p>` : ''}`;
}
let examTimer = null;
function examView(id){
  clearInterval(examTimer);
  const x = examList().find(e => e.id === id); if (!x) return examsView();
  setBrand(latest());
  const s = examState(x), K = 'examcur-' + x.id, cur = store.get(K, null);
  if (cur && !cur.submitted) return examSit(x, cur);
  if (cur && cur.submitted) return examMark(x, cur);
  app.innerHTML = `
    <div class="lesson-head"><span class="eyebrow">${EXAM_KIND[x.kind]}</span><a class="back" href="#exams">← All exams</a><h1>${esc(x.title)}</h1></div>
    <p class="lede">Covers Weeks ${x.weeks[0]} to ${x.weeks[x.weeks.length - 1]}. ${x.mcN} multiple choice (40%), ${x.shortN} short answer (30%), one case study (30%). ${x.minutes} minutes. Pass 70%, distinction 85%.</p>
    <div class="panel"><b>Exam conditions</b><p>Sit it in one go, without notes. A calculator and the Toolkit calculators are fine. Multiple choice is marked when you submit, not as you go. Then you mark your written answers against the model answers, or copy them to Claude for marking.</p></div>
    ${!s.built ? `<p class="note">Some weeks in this exam are not written yet. You can sit a practice paper on what exists now, but it will not count until the rest arrives.</p>` : s.left ? `<p class="note">You have ${s.left} lesson${s.left > 1 ? 's' : ''} in this ${x.kind === 'month' ? 'month' : 'period'} still to finish. Sitting it early is allowed but the exam works best after the lessons and quizzes.</p>` : ''}
    ${s.att.length ? `<h2>Past attempts</h2><div class="tbl"><table class="plain"><tr><th>Date</th><th>Multiple choice</th><th>Written</th><th>Total</th></tr>${s.att.map(a => `<tr><td>${esc(a.date)}</td><td class="num">${a.mc}%</td><td class="num">${a.written == null ? 'not marked' : a.written + '%'}</td><td class="num"><b>${a.total == null ? '–' : a.total + '%'}</b>${a.total >= 85 ? ' D' : a.total >= 70 ? ' P' : ''}</td></tr>`).join('')}</table></div>` : ''}
    <p class="seg" style="margin-top:20px"><button class="primary" id="xstart">${s.att.length ? 'Sit a fresh paper' : 'Start the exam'}</button></p>`;
  document.getElementById('xstart').onclick = () => { const p = buildPaper(x); if (!p.mc.length) { alertNote('No questions are available for this exam yet.'); return; } store.set(K, {paper: p, start: Date.now(), mc: {}, w: {}, early: !s.ready}); examView(id); };
}
function alertNote(t){ const n = document.createElement('p'); n.className = 'note'; n.textContent = t; app.appendChild(n); }
function examSit(x, cur){
  const K = 'examcur-' + x.id, p = cur.paper;
  const wq = p.short.map((q, i) => ({k: 's' + i, label: 'B' + (i + 1), q: q.q, marks: q.marks})).concat(p.case ? p.case.parts.map((q, i) => ({k: 'c' + i, label: 'C' + (i + 1), q: q.q, marks: q.marks})) : []);
  app.innerHTML = `
    <div class="lesson-head"><span class="eyebrow">${EXAM_KIND[x.kind]} · in progress</span><h1>${esc(x.title)}</h1></div>
    <div class="score" id="xclock"></div>
    <h2>Section A · Multiple choice (40%)</h2><div id="xmc"></div>
    <h2>Section B · Short answer (30%)</h2>
    ${wq.filter(q => q.k[0] === 's').map(q => `<div class="q"><span class="qn">${q.label} · ${q.marks} marks</span><p class="qt">${esc(q.q)}</p><textarea data-k="${q.k}">${esc(cur.w[q.k] || '')}</textarea></div>`).join('')}
    ${p.case ? `<h2>Section C · Case study (30%)</h2><div class="panel"><b>${esc(p.case.title || 'Case study')}</b>${p.case.brief ? wrapTables(/^</.test(p.case.brief) ? p.case.brief : '<p>' + esc(p.case.brief) + '</p>') : ''}</div>
      ${wq.filter(q => q.k[0] === 'c').map(q => `<div class="q"><span class="qn">${q.label} · ${q.marks} marks</span><p class="qt">${esc(q.q)}</p><textarea data-k="${q.k}">${esc(cur.w[q.k] || '')}</textarea></div>`).join('')}` : ''}
    <p class="seg" style="margin-top:24px"><button class="primary" id="xsub">Submit exam</button><button id="xquit">Abandon this paper</button></p><p class="note" id="xnote">Your answers save as you go, so you can close the app and come back.</p>`;
  const box = document.getElementById('xmc');
  p.mc.forEach((q, i) => {
    const el = document.createElement('div'); el.className = 'q';
    el.innerHTML = `<span class="qn">A${i + 1}</span><p class="qt">${esc(q.q)}</p><div class="opts">${q.o.map((o, j) => `<button class="opt ${cur.mc[i] === j ? 'sel' : ''}" data-j="${j}" aria-pressed="${cur.mc[i] === j}">${String.fromCharCode(65 + j)}. ${esc(o)}</button>`).join('')}</div>`;
    el.querySelectorAll('.opt').forEach(b => b.onclick = () => { const c = store.get(K, cur); c.mc[i] = +b.dataset.j; store.set(K, c); cur = c;
      el.querySelectorAll('.opt').forEach(o => { const on = o === b; o.classList.toggle('sel', on); o.setAttribute('aria-pressed', on); }); tick(); });
    box.appendChild(el);
  });
  app.querySelectorAll('textarea').forEach(t => t.oninput = () => { const c = store.get(K, cur); c.w[t.dataset.k] = t.value; store.set(K, c); cur = c; });
  const clock = document.getElementById('xclock');
  function tick(){
    const left = cur.start + x.minutes * 60000 - Date.now(), answered = Object.keys(cur.mc).length;
    const mm = Math.max(0, Math.floor(left / 60000)), ss = Math.max(0, Math.floor(left / 1000) % 60);
    clock.textContent = left > 0 ? `${mm}:${pad(ss)} left · ${answered} of ${p.mc.length} answered` : `Time is up · ${answered} of ${p.mc.length} answered · submit when ready`;
    clock.classList.toggle('late', left <= 0);
  }
  tick(); examTimer = setInterval(() => { if (!document.getElementById('xclock')) return clearInterval(examTimer); tick(); }, 1000);
  document.getElementById('xsub').onclick = () => {
    const blank = p.mc.length - Object.keys(cur.mc).length, n = document.getElementById('xnote'), b = document.getElementById('xsub');
    if (blank && !b.dataset.sure) { b.dataset.sure = 1; b.textContent = 'Submit anyway'; n.textContent = `${blank} multiple-choice question${blank > 1 ? 's are' : ' is'} unanswered. Unanswered questions score zero.`; return; }
    clearInterval(examTimer);
    const c = store.get(K, cur); c.submitted = Date.now();
    p.mc.forEach((q, i) => record(q.c, c.mc[i] === q.a));
    store.set(K, c); examView(x.id);
  };
  document.getElementById('xquit').onclick = e => { if (!e.target.dataset.sure) { e.target.dataset.sure = 1; e.target.textContent = 'Tap again to abandon'; return; } clearInterval(examTimer); store.set(K, null); examView(x.id); };
}
function examMark(x, cur){
  const K = 'examcur-' + x.id, p = cur.paper;
  const right = p.mc.filter((q, i) => cur.mc[i] === q.a).length, mcPct = Math.round(right / p.mc.length * 100);
  const items = p.short.map((q, i) => Object.assign({k: 's' + i, label: 'B' + (i + 1), sec: 'short'}, q)).concat(p.case ? p.case.parts.map((q, i) => Object.assign({k: 'c' + i, label: 'C' + (i + 1), sec: 'case'}, q)) : []);
  const marks = cur.marks || {};
  const missed = [...new Set(p.mc.filter((q, i) => cur.mc[i] !== q.a && q.c && CONCEPTS[q.c]).map(q => q.c))];
  app.innerHTML = `
    <div class="lesson-head"><span class="eyebrow">${EXAM_KIND[x.kind]} · marking</span><a class="back" href="#exams">← All exams</a><h1>${esc(x.title)}</h1></div>
    <div class="stats"><div><b>${mcPct}%</b><span>multiple choice (${right}/${p.mc.length})</span></div><div><b id="wpct">–</b><span>written</span></div><div><b id="tot">–</b><span>total</span></div></div>
    ${missed.length ? `<section class="helpbox"><span class="eyebrow">Review before your next attempt</span><h3>Concepts you missed</h3><div class="chips">${missed.map(id => `<a class="chip s-struggling" href="#c-${id}">${esc(CONCEPTS[id].name)} →</a>`).join('')}</div></section>` : ''}
    <h2>Mark your written answers</h2><p class="lede">Compare each answer with the model answer and give yourself the marks it deserves. Be strict: full marks only if you covered the key points. Or copy everything to Claude for marking.</p>
    ${items.map(q => `<div class="q"><span class="qn">${q.label} · ${q.marks} marks</span><p class="qt">${esc(q.q)}</p><div class="panel"><b>Your answer</b><p>${esc(cur.w[q.k] || '(no answer)')}</p></div><details open><summary>Model answer</summary><div class="model">${esc(q.a)}</div></details>
      <label class="note">Your mark <select data-k="${q.k}">${['', ...Array.from({length: q.marks + 1}, (_, i) => i)].map(v => `<option value="${v}" ${String(marks[q.k]) === String(v) && v !== '' ? 'selected' : ''}>${v === '' ? 'choose' : v + ' / ' + q.marks}</option>`).join('')}</select></label></div>`).join('')}
    <h2>Multiple-choice answers</h2><details><summary>Show all ${p.mc.length} questions with answers</summary><div id="xrev"></div></details>
    <p class="seg" style="margin-top:24px"><button class="primary" id="xsave">Save result</button><button id="xcopy">Copy for Claude to mark</button></p><p class="note" id="xnote"></p>`;
  const rev = document.getElementById('xrev');
  p.mc.forEach((q, i) => { const el = document.createElement('div'); rev.appendChild(el); renderQ(el, q, 'A' + (i + 1), null, {picked: cur.mc[i] === undefined ? -1 : cur.mc[i], noHelp: false}); });
  const calc = () => {
    const sec = s => items.filter(q => q.sec === s), got = s => sec(s).reduce((t, q) => t + (+marks[q.k] || 0), 0), max = s => sec(s).reduce((t, q) => t + q.marks, 0);
    const all = items.every(q => marks[q.k] !== undefined && marks[q.k] !== '');
    const sp = max('short') ? got('short') / max('short') : 0, cp = max('case') ? got('case') / max('case') : sp;
    const wp = Math.round((sp * 30 + cp * 30) / 60 * 100), total = Math.round(mcPct * .4 + sp * 30 + cp * 30);
    document.getElementById('wpct').textContent = all ? wp + '%' : '–'; document.getElementById('tot').textContent = all ? total + '%' : '–';
    return all ? {wp, total} : null;
  };
  app.querySelectorAll('select[data-k]').forEach(sl => sl.onchange = () => { marks[sl.dataset.k] = sl.value === '' ? undefined : +sl.value; const c = store.get(K, cur); c.marks = marks; store.set(K, c); calc(); });
  calc();
  document.getElementById('xsave').onclick = () => {
    const r = calc(), n = document.getElementById('xnote');
    const att = store.get('exam-' + x.id, []);
    att.push({date: todayKey(), mc: mcPct, written: r ? r.wp : null, total: r ? r.total : null, early: !!cur.early});
    store.set('exam-' + x.id, att); store.set(K, null); logActivity();
    app.innerHTML = `<div class="lesson-head"><span class="eyebrow">${EXAM_KIND[x.kind]}</span><a class="back" href="#exams">← All exams</a><h1>${esc(x.title)}</h1></div>
      <section class="panel result"><h2>${r ? (r.total >= 85 ? `Distinction: ${r.total}%` : r.total >= 70 ? `Passed: ${r.total}%` : `${r.total}%: not yet a pass`) : `Multiple choice ${mcPct}%`}</h2>
      <p>${!r ? 'Your written answers are not marked yet, so this attempt has no total. Paste them to Claude to have them marked.' : r.total >= 70 ? 'Well done. What you got wrong comes back in your spaced review, so it sticks.' : 'Work through the concepts flagged below, redo the weekly quizzes for the weak weeks, then sit a fresh paper in a day or two.'}</p>
      ${missed.length ? `<div class="chips">${missed.map(id => `<a class="chip s-struggling" href="#c-${id}">${esc(CONCEPTS[id].name)}</a>`).join('')}</div>` : ''}
      <p><a class="btn" href="#exams">Back to exams</a></p></section>`;
  };
  document.getElementById('xcopy').onclick = () => {
    const txt = `${x.title}. Multiple choice: ${right}/${p.mc.length} (${mcPct}%).${missed.length ? ' Missed concepts: ' + missed.map(id => CONCEPTS[id].name).join(', ') + '.' : ''}\n\n` + items.map(q => `${q.label} (${q.marks} marks). ${q.q}\nMy answer: ${cur.w[q.k] || '(no answer)'}`).join('\n\n');
    copyText(txt, document.getElementById('xnote'), 'Copied. Paste it into the project thread and Claude will mark it.');
  };
}
function nextExamDue(){
  return examList().find(x => { const s = examState(x); return s.ready && !s.passed; });
}

/* ---------- tools ---------- */
function toolsView(){
  setBrand(latest());
  const t = store.get('tools', {});
  const v = (k, d) => t[k] !== undefined ? t[k] : d;
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Calculators and worksheets</p><h1>Toolkit</h1>
    <p class="lede">The tools a finance professional reaches for, built around what you have learned. Use them on real offers and your own numbers. More tools are added as the course covers them.</p>
    <nav class="toolnav"><a href="#tool-be">Break-even</a><a href="#tool-tvm">Time value</a><a href="#tool-loan">Loan repayments</a><a href="#tool-cap">Property value</a><a href="#tool-deal">Deal worksheet</a></nav>

    <section class="tool" id="tool-be"><h2>Break-even calculator</h2>
      <div class="inputs"><label>Price per unit<input type="number" inputmode="decimal" id="be-p" value="${v('be-p', 5)}"></label><label>Variable cost per unit<input type="number" inputmode="decimal" id="be-v" value="${v('be-v', 1.5)}"></label><label>Fixed costs (period)<input type="number" inputmode="decimal" id="be-f" value="${v('be-f', 7000)}"></label><label>Target profit<input type="number" inputmode="decimal" id="be-t" value="${v('be-t', 2000)}"></label></div>
      <div class="out" id="be-out"></div><div id="be-chart" class="chart"></div></section>

    <section class="tool" id="tool-tvm"><h2>Time value of money</h2>
      <div class="inputs"><label>Amount<input type="number" inputmode="decimal" id="tv-a" value="${v('tv-a', 10000)}"></label><label>Rate % a year<input type="number" inputmode="decimal" id="tv-r" value="${v('tv-r', 5)}"></label><label>Years<input type="number" inputmode="numeric" id="tv-n" value="${v('tv-n', 10)}"></label><label>Mode<select id="tv-m"><option value="fv">Grow it (future value)</option><option value="pv" ${v('tv-m') === 'pv' ? 'selected' : ''}>Discount it (present value)</option></select></label></div>
      <div class="out" id="tv-out"></div></section>

    <section class="tool" id="tool-loan"><h2>Loan repayments</h2>
      <div class="inputs"><label>Loan amount<input type="number" inputmode="decimal" id="ln-a" value="${v('ln-a', 600000)}"></label><label>Interest rate %<input type="number" inputmode="decimal" id="ln-r" value="${v('ln-r', 6.2)}"></label><label>Term (years)<input type="number" inputmode="numeric" id="ln-n" value="${v('ln-n', 30)}"></label><label>Repayments<select id="ln-f"><option value="12">Monthly</option><option value="26" ${v('ln-f') === '26' ? 'selected' : ''}>Fortnightly</option><option value="52" ${v('ln-f') === '52' ? 'selected' : ''}>Weekly</option></select></label></div>
      <div class="out" id="ln-out"></div><p class="note">Principal and interest. Covered in depth in Week 3 (Money Maths in Practice).</p></section>

    <section class="tool" id="tool-cap"><h2>Property value from income</h2>
      <div class="inputs"><label>Gross rent a year<input type="number" inputmode="decimal" id="cp-g" value="${v('cp-g', 140000)}"></label><label>Non-recoverable outgoings a year<input type="number" inputmode="decimal" id="cp-o" value="${v('cp-o', 25000)}"></label><label>Cap rate %<input type="number" inputmode="decimal" id="cp-r" value="${v('cp-r', 6)}"></label></div>
      <div class="out" id="cp-out"></div><div class="tbl" id="cp-sens"></div><p class="note">The full capitalisation method, with vacancy, incentives and capex adjustments, comes in Month 11.</p></section>

    <section class="tool" id="tool-deal"><h2>Deal worksheet: the six questions</h2>
      <p class="note">Saved on this device. Work through it for any offer, then paste it into the project thread for a second opinion.</p>
      <div class="inputs"><label>You invest now<input type="number" inputmode="decimal" id="dl-i" value="${v('dl-i', 50000)}"></label><label>You get back (total)<input type="number" inputmode="decimal" id="dl-b" value="${v('dl-b', 65000)}"></label><label>After (years)<input type="number" inputmode="decimal" id="dl-n" value="${v('dl-n', 2)}"></label><label>Your required return %<input type="number" inputmode="decimal" id="dl-q" value="${v('dl-q', 20)}"></label></div>
      <div class="out" id="dl-out"></div>
      ${['What exactly am I giving and getting, and when?', 'What are those cash flows worth today?', 'How certain are they, and what protects me?', 'Does the return beat what I should demand?', 'What are the alternatives?', 'What could go badly wrong, and could I survive it?'].map((q, i) => `<label class="wq">${i + 1}. ${q}<textarea id="dq${i}">${esc(v('dq' + i, ''))}</textarea></label>`).join('')}
      <p class="seg"><button id="dl-copy">Copy worksheet</button></p><p class="note" id="dl-note"></p></section>`;
  const num = id => parseFloat(document.getElementById(id).value) || 0;
  const save = () => { const s = {}; app.querySelectorAll('.tool input, .tool select, .tool textarea').forEach(e => { s[e.id] = e.value }); store.set('tools', s); };
  const row = (k, val, strong) => `<div><span>${k}</span><b class="${strong ? 'big' : ''}">${val}</b></div>`;
  function be(){
    const p = num('be-p'), vc = num('be-v'), f = num('be-f'), tp = num('be-t'), c = p - vc, out = document.getElementById('be-out');
    if (c <= 0) { out.innerHTML = '<p class="no">Price must be higher than variable cost, or every sale loses money.</p>'; document.getElementById('be-chart').innerHTML = ''; return; }
    const u = f / c;
    out.innerHTML = row('Contribution per unit', money(c, 2)) + row('Contribution margin', (c / p * 100).toFixed(1) + '%') + row('Break-even units', Math.ceil(u).toLocaleString('en-AU'), 1) + row('Break-even revenue', money(u * p)) + row(`Units for ${money(tp)} profit`, Math.ceil((f + tp) / c).toLocaleString('en-AU'));
    // cost-volume-profit chart
    const W = 600, H = 260, L = 64, B = 34, maxU = Math.ceil(u * 2), maxY = maxU * p, x = q => L + q / maxU * (W - L - 12), y = val => H - B - val / maxY * (H - B - 12);
    const ticks = [0, .25, .5, .75, 1].map(f2 => f2 * maxY);
    document.getElementById('be-chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Break-even chart">
      ${ticks.map(tk => `<line x1="${L}" x2="${W - 12}" y1="${y(tk)}" y2="${y(tk)}" class="grid"/><text x="${L - 6}" y="${y(tk) + 4}" text-anchor="end" class="ax">${tk >= 1e6 ? '$' + (tk / 1e6).toFixed(1) + 'm' : '$' + Math.round(tk / 1000) + 'k'}</text>`).join('')}
      <polygon points="${x(u)},${y(u * p)} ${x(maxU)},${y(maxU * p)} ${x(maxU)},${y(f + vc * maxU)}" class="profit"/>
      <polygon points="${x(0)},${y(0)} ${x(u)},${y(u * p)} ${x(0)},${y(f)}" class="loss"/>
      <line x1="${x(0)}" y1="${y(f)}" x2="${x(maxU)}" y2="${y(f)}" class="fixed"/>
      <line x1="${x(0)}" y1="${y(f)}" x2="${x(maxU)}" y2="${y(f + vc * maxU)}" class="cost"/>
      <line x1="${x(0)}" y1="${y(0)}" x2="${x(maxU)}" y2="${y(maxU * p)}" class="rev"/>
      <circle cx="${x(u)}" cy="${y(u * p)}" r="5" class="bep"/>
      <text x="${x(u)}" y="${y(u * p) - 12}" text-anchor="middle" class="lab">Break-even ${Math.ceil(u).toLocaleString('en-AU')}</text>
      <text x="${x(maxU) - 4}" y="${y(maxU * p) + 16}" text-anchor="end" class="lab rev-t">Revenue</text>
      <text x="${x(maxU) - 4}" y="${y(f + vc * maxU) + 16}" text-anchor="end" class="lab cost-t">Total cost</text>
      <text x="${x(maxU) - 4}" y="${y(f) - 6}" text-anchor="end" class="ax">Fixed costs</text>
      <text x="${L}" y="${H - 8}" class="ax">0</text><text x="${W - 12}" y="${H - 8}" text-anchor="end" class="ax">${maxU.toLocaleString('en-AU')} units</text>
    </svg>`;
  }
  function tvm(){
    const a = num('tv-a'), r = num('tv-r') / 100, n = Math.round(num('tv-n')), m = document.getElementById('tv-m').value, f = (1 + r) ** n;
    const res = m === 'fv' ? a * f : a / f;
    document.getElementById('tv-out').innerHTML = row(m === 'fv' ? `Worth in ${n} years` : 'Worth today', money(res), 1) + row('Growth factor (1 + r)^n', f.toFixed(4)) + (m === 'fv' ? row('Of which interest', money(res - a)) + row('Simple interest would give', money(a * (1 + r * n))) : row('Discount', money(a - res))) + (r > 0 ? row('Rule of 72 doubling time', (72 / (r * 100)).toFixed(1) + ' years') : '');
  }
  function loan(){
    const a = num('ln-a'), fq = +document.getElementById('ln-f').value, i = num('ln-r') / 100 / fq, n = Math.round(num('ln-n') * fq);
    const pmt = i ? a * i / (1 - (1 + i) ** -n) : a / n;
    const lbl = {12: 'Monthly', 26: 'Fortnightly', 52: 'Weekly'}[fq];
    const firstInt = a * i;
    document.getElementById('ln-out').innerHTML = row(lbl + ' repayment', money(pmt, 2), 1) + row('Total repaid', money(pmt * n)) + row('Total interest', money(pmt * n - a)) + row('Interest in first repayment', money(firstInt, 2) + ` (${pmt ? Math.round(firstInt / pmt * 100) : 0}%)`);
  }
  function cap(){
    const g = num('cp-g'), o = num('cp-o'), r = num('cp-r'), ni = g - o;
    document.getElementById('cp-out').innerHTML = row('Net income', money(ni)) + row('Value', r > 0 ? money(ni / (r / 100)) : '—', 1);
    if (r > 0) document.getElementById('cp-sens').innerHTML = `<table class="plain"><tr><th>Cap rate</th><th class="num">Value</th><th class="num">Change</th></tr>${[-1, -.5, -.25, 0, .25, .5, 1].map(dd => { const cr = r + dd; if (cr <= 0) return ''; const val = ni / (cr / 100), base = ni / (r / 100); return `<tr class="${dd === 0 ? 'cur' : ''}"><td>${cr.toFixed(2)}%</td><td class="num">${money(val)}</td><td class="num">${dd === 0 ? '—' : (val >= base ? '+' : '−') + money(Math.abs(val - base)).slice(1)}</td></tr>` }).join('')}</table>`;
  }
  function deal(){
    const i = num('dl-i'), b = num('dl-b'), n = num('dl-n'), q = num('dl-q');
    if (i <= 0 || n <= 0) { document.getElementById('dl-out').innerHTML = ''; return; }
    const irr = ((b / i) ** (1 / n) - 1) * 100, pv = b / (1 + q / 100) ** n;
    document.getElementById('dl-out').innerHTML = row('Annual compound return', irr.toFixed(1) + '%', 1) + row(`Worth today at your ${q}%`, money(pv)) + row('Verdict on numbers alone', pv >= i ? '<span class="ok">Meets your required return</span>' : `<span class="no">Falls short by ${money(i - pv)}</span>`);
  }
  const all = () => { be(); tvm(); loan(); cap(); deal(); };
  app.querySelectorAll('.tool input, .tool select, .tool textarea').forEach(e => e.addEventListener('input', () => { all(); save(); }));
  document.getElementById('dl-copy').onclick = () => {
    const i = num('dl-i'), b = num('dl-b'), n = num('dl-n');
    const txt = `Deal worksheet: invest ${money(i)}, get back ${money(b)} after ${n} years (${(((b / i) ** (1 / n) - 1) * 100).toFixed(1)}% a year). Required return ${num('dl-q')}%.\n\n` + [0, 1, 2, 3, 4, 5].map(k => `${k + 1}. ${document.getElementById('dq' + k).value || '(blank)'}`).join('\n');
    copyText(txt, document.getElementById('dl-note'), 'Copied. Paste it into the project thread for a second opinion.');
  };
  all();
}

function glossaryView(){
  setBrand(latest());
  const terms = [].concat(...WEEKS.map(w => w.glossary || [])).sort((a, b) => a.t.localeCompare(b.t));
  app.innerHTML = `<p class="eyebrow" style="margin-top:28px">${terms.length} terms so far</p><h1>Glossary</h1>
    <p class="lede">Every term from the course, in plain English. It grows each week.</p>
    <label for="gq" class="note">Search</label><input id="gq" type="search" placeholder="e.g. cap rate, equity, EBITDA" autocomplete="off">
    <dl class="gloss" id="gl"></dl>`;
  const draw = q => { const s = q.trim().toLowerCase(); document.getElementById('gl').innerHTML = terms.filter(t => !s || t.t.toLowerCase().includes(s) || t.d.toLowerCase().includes(s)).map(t => `<div><dt>${esc(t.t)}</dt><dd>${esc(t.d)} <span class="note">Week ${t.week}</span></dd></div>`).join('') || '<p class="note">No matching terms yet.</p>'; };
  document.getElementById('gq').oninput = e => draw(e.target.value); draw('');
}

/* ---------- ask Claude (claude.ai version only, through the `sample` capability) ---------- */
let CTX = null; // what Mitch is looking at, sent with each question because Claude has no memory between asks
const ask = {fn: null, ready: false, list: []};
const plain = html => String(html || '').replace(/<\/(p|li|tr|dd|dt|h\d)>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/[ \t]+/g, ' ').replace(/\n\s*/g, '\n').trim();
const TUTOR = `You are a friendly, expert university finance lecturer tutoring Mitch, an adult learner in Australia working through a self-paced business and finance course aligned to the UNSW Master of Applied Finance. Use Australian terms, rules and examples throughout: AASB accounting standards, ATO tax rules, ASIC and the Corporations Act, API and IVS valuation standards, Australian dollars and GST. Where a figure depends on current rates or thresholds, give it as general information and say where to check it (ATO, ASIC, RBA). This is education, not personal financial advice: if he asks what he personally should do, explain the considerations instead. Write plain text: short paragraphs, simple "- " bullet lists when useful, and show your working for any numbers. No headings, no tables, no markdown symbols like ** or #.`;
async function askInit(){
  try { const f = await claude.use('sample'); if (f) { ask.fn = f; ask.ready = true; } } catch (e) {}
  if (cloud.db) { try { const q = await cloud.db.collection('questions').orderBy('t', 'desc').limit(100).get(); ask.list = q.docs.map(d => d.data()).filter(x => x && x.uid === cloud.id); } catch (e) {} }
  if (location.hash === '#ask') askView();
}
function askErr(e){
  const c = e && e.code;
  return c === 'not_granted' ? 'Asking Claude is switched off for this page. Open the page menu, choose Permissions, and allow it.'
    : c === 'rate_limited' ? 'Too many questions in a short time. Wait a minute and ask again.'
    : c === 'cancelled' ? 'Stopped.'
    : 'Claude could not answer just now. Please try again.';
}
async function askClaude(prompt, out, onDone){
  const ctl = new AbortController();
  out.textContent = 'Thinking…';
  try { const r = await ask.fn(prompt, {cache: false, signal: ctl.signal, onText: ({text}) => { out.textContent = text; }}); out.textContent = r.text; onDone && onDone(r.text); }
  catch (e) { out.textContent = (e && e.text ? e.text + '\n\n' : '') + askErr(e); }
  return ctl;
}
function askView(){
  setBrand(CTX && CTX.w ? CTX.w : latest());
  if (!IN_CLAUDE) {
    app.innerHTML = `<p class="eyebrow" style="margin-top:28px">Ask Claude</p><h1>Ask a question</h1>
      <p class="lede">Asking Claude works in the claude.ai version of the course, where Claude can answer you right here and keep your questions for later.</p>
      <p><a class="btn" href="${ARTIFACT_URL}" target="_blank" rel="noopener">Open the claude.ai version</a></p>`;
    return;
  }
  app.innerHTML = `<p class="eyebrow" style="margin-top:28px">Ask Claude</p><h1>Ask a question</h1>
    <p class="lede">Ask anything about the course, a term, a calculation or a real offer you are looking at. Answers use Australian rules and examples.</p>
    ${CTX ? `<label class="note askctx"><input type="checkbox" id="usectx" checked> About what I was just looking at: <b>${esc(CTX.label)}</b></label>` : ''}
    <textarea id="askq" placeholder="e.g. Why does dividing by 1.1 take GST out, but taking 10% off doesn't?"></textarea>
    <p class="seg"><button class="primary" id="askgo">Ask</button><button id="askstop" hidden>Stop</button></p>
    <p class="note" id="asknote">${ask.ready ? 'The first time you ask, a box will pop up asking you to allow this page to use Claude. Choose Allow.' : 'Connecting to Claude…'}</p>
    <div class="answer" id="askout" hidden></div>
    <h2>Your questions</h2><div id="asklist"></div>`;
  const drawList = () => { document.getElementById('asklist').innerHTML = ask.list.length ? ask.list.map((x, i) => `<details class="qa"><summary>${esc(x.q)}<span class="note"> · ${new Date(x.t).toLocaleDateString('en-AU', {day: 'numeric', month: 'short'})}${x.about ? ' · ' + esc(x.about) : ''}</span></summary><div class="answer">${esc(x.a)}</div></details>`).join('') : `<p class="note">${cloud.db ? 'Questions you ask are kept here.' : 'Questions you ask appear here while this page is open.'}</p>`; };
  drawList();
  const go = document.getElementById('askgo'), stop = document.getElementById('askstop'), out = document.getElementById('askout'), q = document.getElementById('askq'), note = document.getElementById('asknote');
  go.disabled = !ask.ready;
  let ctl = null;
  go.onclick = async () => {
    const text = q.value.trim(); if (!text) { q.focus(); return; }
    const useCtx = CTX && document.getElementById('usectx') && document.getElementById('usectx').checked;
    const prompt = `${TUTOR}\n\n${useCtx ? `What Mitch is studying right now (${CTX.label}):\n${CTX.text.slice(0, 2500)}\n\n` : ''}Mitch's question:\n${text}\n\nAnswer in about 250 words or fewer unless he asks for more detail.`;
    out.hidden = false; go.disabled = true; stop.hidden = false; note.textContent = '';
    ctl = new AbortController(); stop.onclick = () => ctl.abort();
    out.textContent = 'Thinking…';
    try {
      const r = await ask.fn(prompt, {cache: false, signal: ctl.signal, onText: ({text: t}) => { out.textContent = t; }});
      out.textContent = r.text;
      const row = {q: text, a: r.text, t: Date.now(), about: useCtx ? CTX.label : '', uid: cloud.id || ''};
      ask.list.unshift(row); drawList(); q.value = '';
      if (cloud.db) cloud.db.collection('questions').add(row).catch(() => { note.textContent = 'Answered, but it could not be kept in your question list.'; });
      go.disabled = false;
    } catch (e) { out.textContent = (e && e.text ? e.text + '\n\n' : '') + askErr(e); go.disabled = !!(e && e.code === 'not_granted'); }
    stop.hidden = true;
  };
}
/* a small "Ask about this" link for lessons, concepts and quizzes */
const askLink = () => IN_CLAUDE ? `<p class="asklink"><a href="#ask">💬 Ask Claude about this</a></p>` : '';

/* ---------- routing ---------- */
function route(){
  const h = decodeURIComponent((location.hash || '#home').slice(1));
  let m;
  const tab = /^(w\d+d\d+|week\d+|quiz\d*|home)$/.test(h) || h === '' ? 'home' : /^c-/.test(h) ? 'practice' : /^tool-/.test(h) ? 'tools' : /^exam/.test(h) ? 'plan' : h;
  document.querySelectorAll('.mainnav a').forEach(a => { if (a.dataset.v === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if ((m = h.match(/^w(\d+)d(\d+)$/))) lesson(+m[1], +m[2]);
  else if ((m = h.match(/^week(\d+)$/))) weekView(+m[1]);
  else if ((m = h.match(/^quiz(\d*)$/))) quiz(m[1] ? +m[1] : latest().week);
  else if ((m = h.match(/^c-(.+)$/))) conceptView(m[1]);
  else if (/^tool-/.test(h)) { toolsView(); const el = document.getElementById(h); if (el) { setTimeout(() => el.scrollIntoView(), 0); return; } }
  else if ((m = h.match(/^exam-(.+)$/))) examView(m[1]);
  else if (h === 'exams') examsView();
  else if (h === 'extras') extrasView();
  else if (h === 'plan' || h === 'map') planView();
  else if (h === 'practice') practice();
  else if (h === 'tools') toolsView();
  else if (h === 'glossary') glossaryView();
  else if (h === 'ask') askView();
  else today();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', () => { clearInterval(examTimer); route(); });
route();
cloudInit();

const net = document.getElementById('net');
function netState(){ if (net) net.hidden = navigator.onLine; }
window.addEventListener('online', netState); window.addEventListener('offline', netState); netState();

/* ---------- pocket calculator ----------
   A floating button opens a small calculator over whatever page is showing. It sits outside #app,
   so opening or closing it never re-renders the page or touches answers. "Put in answer" types the
   result into the last answer box tapped. Percent works like a desk calculator: 200 + 10% = 220. */
(function pocketCalc(){
  const fab = document.createElement('button');
  fab.className = 'calcfab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Open calculator');
  fab.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg>';
  const sheet = document.createElement('div');
  sheet.className = 'calcsheet'; sheet.hidden = true; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-label', 'Calculator');
  const KEYS = [['C', 'clear'], ['(', '('], [')', ')'], ['xʸ', '^'], ['⌫', 'back'],
    ['7', '7'], ['8', '8'], ['9', '9'], ['÷', '÷'], ['%', '%'],
    ['4', '4'], ['5', '5'], ['6', '6'], ['×', '×'], ['Ans', 'ans'],
    ['1', '1'], ['2', '2'], ['3', '3'], ['−', '−'], ['+', '+'],
    ['0', '0', 'w2'], ['.', '.'], ['=', 'eq', 'w2 eq']];
  sheet.innerHTML = `<div class="calchead"><b>Calculator</b>
      <button type="button" class="calcuse" hidden>Put in answer</button>
      <button type="button" class="calcx" aria-label="Close calculator">✕</button></div>
    <div class="calcdisp"><div class="calchist" aria-live="polite"></div><div class="calcexpr">0</div><div class="calcres"></div></div>
    <div class="calckeys">${KEYS.map(([t, k, c]) => `<button type="button" data-k="${k}" class="${c || ''}${/[0-9.]/.test(k) ? ' cnum' : ''}">${t}</button>`).join('')}</div>`;
  document.body.append(fab, sheet);
  const $ = s => sheet.querySelector(s);
  let expr = '', ans = 0, hist = [], target = null, justDone = false;

  // safe evaluator (no eval): + − × ÷ ^ ( ) % and decimals
  function evaluate(src){
    const t = src.replace(/Ans/g, '(' + ans + ')').match(/\d*\.?\d+(?:e[+-]?\d+)?|[-+−×÷*/^()%]/g) || [];
    let i = 0;
    const peek = () => t[i], next = () => t[i++];
    const isAdd = s => s === '+' || s === '−' || s === '-';
    function expr_(){
      let v = term().v;
      while (isAdd(peek())){
        const op = next(), r = term();
        const rv = r.pct ? v * r.v : r.v;   // 200 + 10% means 200 + 10% of 200
        v = op === '+' ? v + rv : v - rv;
      }
      return v;
    }
    function term(){
      let f = power(), v = f.v, pct = f.pct, n = 0;
      while (['×', '÷', '*', '/'].includes(peek()) || peek() === '(' || /^[\d.]/.test(peek() || '')){
        const op = ['×', '÷', '*', '/'].includes(peek()) ? next() : '×';   // 2(3) means 2 × 3
        const r = power(); v = op === '÷' || op === '/' ? v / r.v : v * r.v; pct = false; n++;
      }
      return {v, pct: pct && !n};
    }
    function power(){
      const b = unary();
      if (peek() === '^'){ next(); const e = power(); return {v: Math.pow(b.v, e.v), pct: false}; }
      return b;
    }
    function unary(){
      if (isAdd(peek())){ const s = next(); const u = unary(); return {v: s === '+' ? u.v : -u.v, pct: u.pct}; }
      let v;
      if (peek() === '('){ next(); v = expr_(); if (peek() === ')') next(); }   // missing ")" closes itself
      else { const n = next(); if (n === undefined || isNaN(n)) throw 0; v = +n; }
      let pct = false;
      while (peek() === '%'){ next(); v /= 100; pct = true; }
      return {v, pct};
    }
    if (!t.length) return null;
    const v = expr_();
    if (i < t.length || !isFinite(v)) throw 0;
    return v;
  }
  const tidy = v => +v.toPrecision(12);
  const show = v => tidy(v).toLocaleString('en-AU', {maximumFractionDigits: 10});
  function paint(){
    $('.calcexpr').textContent = expr || '0';
    let r = '';
    try { const v = evaluate(expr); if (v !== null && !justDone) r = '= ' + show(v); } catch (e) { r = ''; }
    $('.calcres').textContent = r;
    $('.calchist').innerHTML = hist.map(h => `<span>${h}</span>`).join('');
    $('.calcuse').hidden = !target || !document.body.contains(target);
  }
  function press(k){
    const ops = '+−×÷^';
    if (k === 'clear'){ expr = ''; justDone = false; }
    else if (k === 'back'){ expr = justDone ? '' : expr.replace(/(Ans|.)$/, ''); justDone = false; }
    else if (k === 'eq'){
      try { const v = evaluate(expr); if (v === null) return; hist = hist.concat(`${expr} = ${show(v)}`).slice(-3); ans = tidy(v); expr = String(ans); justDone = true; }
      catch (e) { $('.calcres').textContent = 'Check the sum'; return; }
    }
    else {
      const tok = k === 'ans' ? 'Ans' : k;
      if (justDone && !ops.includes(tok) && tok !== '%') expr = '';   // a new number starts a new sum
      justDone = false;
      if (ops.includes(tok) && ops.includes(expr.slice(-1)) && !(tok === '−' && expr.slice(-1) !== '−')) expr = expr.slice(0, -1);
      expr += tok;
    }
    paint();
  }
  function open(){ sheet.hidden = false; fab.hidden = true; paint(); $('.calcx').focus({preventScroll: true}); }
  function close(){ sheet.hidden = true; fab.hidden = false; }
  fab.onclick = open;
  $('.calcx').onclick = close;
  $('.calckeys').onclick = e => { const b = e.target.closest('button'); if (b) press(b.dataset.k); };
  // remember the last answer box used, so the result can be put into it
  document.addEventListener('focusin', e => {
    const el = e.target;
    if (sheet.contains(el)) return;
    if (el.matches('textarea, input:not([type=checkbox]):not([type=radio]):not([type=date]):not([type=button]):not([type=submit])')) { target = el; if (!sheet.hidden) paint(); }
  });
  $('.calcuse').onclick = () => {
    if (!target || !document.body.contains(target)) return;
    let v; try { v = evaluate(expr); } catch (e) { v = null; }
    const s = String(tidy(v === null ? ans : v));
    if (target.type === 'number' || target.tagName !== 'TEXTAREA') target.value = target.tagName === 'TEXTAREA' ? target.value + s : s;
    else { const a = target.selectionStart ?? target.value.length, b = target.selectionEnd ?? a; target.value = target.value.slice(0, a) + s + target.value.slice(b); }
    target.dispatchEvent(new Event('input', {bubbles: true})); target.dispatchEvent(new Event('change', {bubbles: true}));
    close(); target.focus({preventScroll: true});
  };
  // typing on a keyboard works too while the calculator is open
  document.addEventListener('keydown', e => {
    if (sheet.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.matches && e.target.matches('input, textarea, select')) return;
    const map = {'*': '×', 'x': '×', '/': '÷', '-': '−', 'Enter': 'eq', '=': 'eq', 'Backspace': 'back', 'Delete': 'clear', 'Escape': 'esc'};
    const k = map[e.key] || (/^[0-9.+()%^]$/.test(e.key) ? e.key : null);
    if (!k) return;
    e.preventDefault();
    if (k === 'esc') close(); else press(k);
  });
})();
