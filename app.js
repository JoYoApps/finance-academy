/* Business & Finance Academy app. Data: window.CURRICULUM, window.WEEKS (weekNN.js + weekNNx.js), window.PRACTICE. */
const C = window.CURRICULUM, P = window.PRACTICE || {};
const WEEKS = (window.WEEKS || []).sort((a, b) => (a.month - b.month) || (a.week - b.week));
const app = document.getElementById('app');
const DAY = 86400000;
const store = {
  get(k, d){ try{ const v = localStorage.getItem('bfa:' + k); return v ? JSON.parse(v) : d }catch(e){ return d } },
  set(k, v){ try{ localStorage.setItem('bfa:' + k, JSON.stringify(v)) }catch(e){} }
};
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
    <a class="day quizrow" href="#quiz${w.week}"><span class="no">Wknd</span><span class="t">Week ${w.week} quiz<span>${w.quiz.mc.length} multiple choice · ${w.quiz.written.length} written${answered ? ` · ${answered} answered` : ''}</span></span><span class="tick ${answered >= w.quiz.mc.length ? 'on' : ''}">✓</span></a>
  </div>`;
}

function today(){
  const nl = nextLesson(), w = (nl && findWeek(nl.week)) || latest();
  setBrand(w);
  const built = nl && findWeek(nl.week);
  const due = dueConcepts(), help = struggling(), st = streak();
  const done = store.get('done', {}), doneCount = Object.keys(done).length;
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
    <section class="review"><div><span class="eyebrow">Spaced review</span><h3>${due.length ? `${due.length} concept${due.length > 1 ? 's' : ''} due for review` : 'Nothing due right now'}</h3><p class="note">${due.length ? 'Short, fresh questions on things you have learned, timed so they stick.' : 'Concepts come back for review just before you would forget them. Practise anything any time.'}</p></div><a class="btn ${due.length ? 'primary' : ''}" href="#practice">${due.length ? 'Start review' : 'Practise'}</a></section>
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
  cur = {w: wn, day: n, i: Math.max(0, Math.min(i || 0, d.slides.length - 1))};
  const s = d.slides[cur.i], last = cur.i === d.slides.length - 1, key = wid(w) + 'd' + n;
  const audioEl = document.getElementById('aud');
  if (!(keep && audioEl && audioEl.dataset.key === key)) {
    app.innerHTML = `
      <div class="lesson-head"><span class="eyebrow">Week ${w.week} · Day ${d.n}</span><a href="#week${w.week}" class="back">← All lessons</a><h1>${esc(d.title)}</h1></div>
      <audio id="aud" data-key="${key}" controls preload="none" src="${audioSrc(d.audio)}"></audio>
      <p class="note" id="audnote" style="margin:0">Audio lecture. Listen alongside the slides, or on its own on the go.</p>
      <div id="slidebox"></div><div id="checkbox"></div>`;
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
function buildCheck(cb, w, d, key){
  const ids = (d.concepts || []).filter(id => CONCEPTS[id]);
  const done = store.get('done', {});
  cb.innerHTML = `<h2>Check your understanding</h2><p class="lede">Three questions on today's concepts. Your answers update your mastery and review schedule. Get stuck and you will be shown another way to think about it.</p><div id="chk"></div>
    <div class="concept-links">${ids.map(id => `<a class="chip s-${status(id)}" href="#c-${id}">${esc(CONCEPTS[id].name)}</a>`).join('')}</div>
    <div class="pager"><button class="primary" id="fin">${done[key] ? 'Completed ✓' : 'Mark lesson complete'}</button></div>
    ${d.n < w.days.length ? `<p style="text-align:right"><a href="#${wid(w)}d${d.n + 1}">Day ${d.n + 1}: ${esc(w.days[d.n].title)} →</a></p>` : `<p style="text-align:right"><a href="#quiz${w.week}">Take the Week ${w.week} quiz →</a></p>`}`;
  if (ids.length) session(cb.querySelector('#chk'), i => genQ(ids[i % ids.length]), 3, 'Lesson check');
  cb.querySelector('#fin').onclick = e => { const dn = store.get('done', {}); dn[key] = todayKey(); store.set('done', dn); logActivity(); e.target.textContent = 'Completed ✓'; };
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
  app.innerHTML = `
    <div class="lesson-head"><span class="eyebrow">Concept · Week ${c.week} · Day ${c.day}</span><a class="back" href="#practice">← All concepts</a><h1>${esc(c.name)}</h1></div>
    <div class="mrow">${meter(id)}<span class="pill s-${s}">${STATUS_LABEL[s]}</span>${m ? `<span class="note">${m.hist.filter(x => x).length} of last ${m.hist.length} correct</span>` : ''}</div>
    <div class="tabs" role="tablist"><button role="tab" aria-selected="true" data-t="explain">Another way to see it</button><button role="tab" data-t="example">Worked example</button></div>
    <section class="slide" id="cpanel">${wrapTables(c.explain)}</section>
    <p class="note">Want the original lesson? <a href="#w${pad(c.week)}d${c.day}">Week ${c.week}, Day ${c.day} slides →</a></p>
    <h2>Practise</h2><p class="lede">Fresh questions every time${(c.gens || []).length ? ', with new numbers' : ''}. Keep going until this shows as Strong.</p><div id="cprac"></div>`;
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
  app.innerHTML = `
    <p class="eyebrow" style="margin-top:28px">Month ${w.month} · Week ${w.week}</p><h1>Week ${w.week} quiz</h1>
    <p class="lede">Part A: ${w.quiz.mc.length} multiple-choice questions, marked as you go. Part B: ${w.quiz.written.length} written questions. Write your answer, then compare it with the model answer. Aim for 80% on Part A before moving on.</p>
    <div class="score" id="score">${score()}</div>
    <h2>Part A · Multiple choice</h2><div id="mcq"></div>
    <h2>Part B · Written</h2>
    ${w.quiz.written.map((q, i) => `<div class="q"><span class="qn">B${i + 1}</span><p class="qt">${esc(q.q)}</p>
      <label class="note" for="w${i}">Your answer (saved on this device)</label><textarea id="w${i}" data-i="${i}">${esc(drafts[i] || '')}</textarea>
      <details style="margin-top:8px"><summary>Show model answer</summary><div class="model">${esc(q.a)}</div></details></div>`).join('')}
    <p class="seg" style="margin-top:24px"><button id="copyw">Copy my answers for marking</button><button id="reset">Clear my answers</button></p>
    <p class="note" id="copynote">Paste your copied answers into the project thread and Claude will mark them and adjust your course.</p>`;
  const ans = store.get(K, {}), mcq = document.getElementById('mcq');
  w.quiz.mc.forEach((q, i) => {
    const el = document.createElement('div'); mcq.appendChild(el);
    renderQ(el, q, 'A' + (i + 1), (ok, j) => { const a = store.get(K, {}); a[i] = j; store.set(K, a); record(q.c, ok); document.getElementById('score').textContent = score(); }, {picked: ans[i]});
  });
  app.querySelectorAll('textarea').forEach(t => t.oninput = () => { const d = store.get(KW, {}); d[t.dataset.i] = t.value; store.set(KW, d); });
  document.getElementById('reset').onclick = () => { store.set(K, {}); store.set(KW, {}); quiz(wn); };
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
        <p class="note">Month-end exam: ${fmtDate(dates[ALL_LESSONS.indexOf(ls[ls.length - 1])])} or after.</p></div></details>` }).join('')}
    <h2>How you are assessed</h2>
    <div class="grid2">
      <div class="panel"><b>Daily</b>Three-question check at the end of each lesson, plus spaced review.</div>
      <div class="panel"><b>Weekly quiz</b>15 multiple choice (pass 80%) and 4 to 5 written answers, marked by Claude.</div>
      <div class="panel"><b>Month exam</b>40 multiple choice (40%), 4 short answer (30%), one case study (30%). 90 minutes, pass 70%, distinction 85%.</div>
    </div>
    <h2>Use it on your phone and computer</h2>
    <p class="lede">Progress is saved on each device. To carry it across, copy your progress code here and paste it on the other device.</p>
    <div class="seg"><button id="exp">Copy progress code</button><button id="imp">Paste a progress code</button></div>
    <div id="impbox" hidden><textarea id="impcode" placeholder="Paste your progress code here"></textarea><p class="seg"><button class="primary" id="impgo">Load progress</button></p></div>
    <p class="note" id="bnote"></p>`;
  document.getElementById('psave').onclick = () => {
    const days = [...app.querySelectorAll('.daypick input:checked')].map(x => +x.value);
    store.set('plan', {start: document.getElementById('pstart').value || todayKey(), days: days.length ? days : [1, 2, 3, 4, 5]}); planView();
  };
  document.getElementById('exp').onclick = () => {
    const all = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('bfa:')) all[k] = localStorage.getItem(k); } } catch (e) {}
    copyText('BFA1:' + btoa(unescape(encodeURIComponent(JSON.stringify(all)))), document.getElementById('bnote'), 'Progress code copied. Paste it on your other device under Plan → Paste a progress code.');
  };
  document.getElementById('imp').onclick = () => { document.getElementById('impbox').hidden = false; };
  document.getElementById('impgo').onclick = () => {
    const note = document.getElementById('bnote');
    try { const raw = document.getElementById('impcode').value.trim().replace(/^BFA1:/, ''); const all = JSON.parse(decodeURIComponent(escape(atob(raw))));
      Object.keys(all).forEach(k => { if (k.startsWith('bfa:')) localStorage.setItem(k, all[k]); }); note.textContent = 'Progress loaded.'; setTimeout(planView, 600);
    } catch (e) { note.textContent = 'That code could not be read. Copy the whole code, starting with BFA1:, and try again.'; }
  };
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

/* ---------- routing ---------- */
function route(){
  const h = decodeURIComponent((location.hash || '#home').slice(1));
  let m;
  const tab = /^(w\d+d\d+|week\d+|quiz\d*|home)$/.test(h) || h === '' ? 'home' : /^c-/.test(h) ? 'practice' : /^tool-/.test(h) ? 'tools' : h;
  document.querySelectorAll('.mainnav a').forEach(a => { if (a.dataset.v === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if ((m = h.match(/^w(\d+)d(\d+)$/))) lesson(+m[1], +m[2], 0);
  else if ((m = h.match(/^week(\d+)$/))) weekView(+m[1]);
  else if ((m = h.match(/^quiz(\d*)$/))) quiz(m[1] ? +m[1] : latest().week);
  else if ((m = h.match(/^c-(.+)$/))) conceptView(m[1]);
  else if (/^tool-/.test(h)) { toolsView(); const el = document.getElementById(h); if (el) { setTimeout(() => el.scrollIntoView(), 0); return; } }
  else if (h === 'plan' || h === 'map' || h === 'exams') planView();
  else if (h === 'practice') practice();
  else if (h === 'tools') toolsView();
  else if (h === 'glossary') glossaryView();
  else today();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', route);
route();

const net = document.getElementById('net');
function netState(){ if (net) net.hidden = navigator.onLine; }
window.addEventListener('online', netState); window.addEventListener('offline', netState); netState();
