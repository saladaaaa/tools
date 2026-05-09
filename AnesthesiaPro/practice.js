/* AnesthesiaPro — Practice (Fase 1)
   - Arquivo de casos no localStorage
   - Dashboard "Minha Prática"
   - Wrapped do mês (Canvas → share/download)
   Sem login, sem backend, sem dependências externas. */

(function(){
  'use strict';

  // ─── Storage ───────────────────────────────────────────────────────────────
  const KEY_CASES   = 'apr_cases';
  const KEY_CURRENT = 'apr_current_case';
  const KEY_PROC    = 'apr_current_proc';

  function loadCases(){ try{ return JSON.parse(localStorage.getItem(KEY_CASES)||'[]'); }catch{ return []; } }
  function saveCases(arr){ try{ localStorage.setItem(KEY_CASES, JSON.stringify(arr.slice(0,2000))); }catch{} }
  function loadCurrent(){ try{ return JSON.parse(localStorage.getItem(KEY_CURRENT)||'null'); }catch{ return null; } }
  function saveCurrent(c){ try{ if(c) localStorage.setItem(KEY_CURRENT, JSON.stringify(c)); else localStorage.removeItem(KEY_CURRENT); }catch{} }

  let currentCase = loadCurrent() || { drugs:[] };
  function ensureCurrent(){ if(!currentCase) currentCase = { drugs:[] }; return currentCase; }

  // ─── i18n shim (uses app.js' globals if present) ───────────────────────────
  function tr(k){ return (typeof t==='function') ? t(k) : k; }
  function L(){ return (typeof lang==='string' && lang) || 'pt'; }
  function tArr(k){
    try{
      const dict = (typeof T==='object' && T && T[L()]) ? T[L()] : null;
      if(dict && Array.isArray(dict[k])) return dict[k];
      if(T && T.pt && Array.isArray(T.pt[k])) return T.pt[k];
    }catch{}
    return [];
  }
  function localeCode(){ const l=L(); return l==='en'?'en-US':l==='es'?'es-ES':'pt-BR'; }
  function toast(msg){ if(typeof showToast==='function') showToast(msg); }

  // ─── Drug name helpers ─────────────────────────────────────────────────────
  // Strip parentheticals so "Propofol (indução)" and "Propofol TIVA" don't
  // mismatch with same active ingredient. Keep root word for grouping.
  function drugRoot(name){
    if(!name) return '';
    return String(name).replace(/\s*\([^)]*\)\s*/g,' ').replace(/\s+/g,' ').trim();
  }

  // ─── Drug log button (delegated) ───────────────────────────────────────────
  function logDrugAdmin(name){
    ensureCurrent();
    currentCase.drugs.push({ name, at: Date.now() });
    saveCurrent(currentCase);
  }
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-log]');
    if(!btn) return;
    e.stopPropagation();
    logDrugAdmin(btn.dataset.log);
    btn.classList.add('logged');
    toast('💉 ' + btn.dataset.log);
    setTimeout(()=>btn.classList.remove('logged'), 1200);
  });

  // ─── Procedure input (persists across reloads while case is open) ──────────
  function bindProcInput(){
    const inp = document.getElementById('procInput');
    if(!inp) return;
    const stored = localStorage.getItem(KEY_PROC) || (currentCase && currentCase.procedure) || '';
    if(stored) inp.value = stored;
    if(currentCase) currentCase.procedure = stored;
    inp.addEventListener('input', ()=>{
      ensureCurrent();
      currentCase.procedure = inp.value.trim();
      try{ localStorage.setItem(KEY_PROC, currentCase.procedure); }catch{}
      saveCurrent(currentCase);
    });
  }

  // ─── Archive a finished case ───────────────────────────────────────────────
  function archiveCurrentCase(){
    const timer = (typeof state==='object' && state && state.timer) ? state.timer : null;
    if(!timer) return null;
    const dur = (timer.accum||0) + (timer.running ? Date.now()-timer.startedAt : 0);
    const events = Array.isArray(timer.events) ? timer.events.slice() : [];
    const cur = ensureCurrent();
    if(dur < 60000 && events.length<2 && cur.drugs.length===0){
      // Too thin to count as a case
      return null;
    }
    const c = {
      id: 'c_' + Date.now(),
      at: Date.now(),
      durationMs: dur,
      events,
      drugs: (cur.drugs||[]).map(d=>({ name: d.name, at: d.at })),
      blocks: Array.isArray(state.registeredDoses) ? state.registeredDoses.slice() : [],
      procedure: (cur.procedure||'').trim(),
      patient: { weight: state.weight, height: state.height, sex: state.sex, age: state.age }
    };
    const all = loadCases();
    all.unshift(c);
    saveCases(all);
    // Reset the in-progress case
    currentCase = { drugs: [] };
    saveCurrent(null);
    try{ localStorage.removeItem(KEY_PROC); }catch{}
    const inp = document.getElementById('procInput'); if(inp) inp.value = '';
    toast(tr('case_saved'));
    // Reset the timer (keeps UX coherent: case is done, clock back to 00:00)
    if(typeof resetTimer==='function'){ resetTimer(); }
    // Refresh dashboard if visible
    renderPractice();
    return c;
  }

  // ─── Filter cases ──────────────────────────────────────────────────────────
  let activeRange = 'month'; // 'month' | 'all'
  function filterCases(){
    const all = loadCases();
    if(activeRange==='all'){
      const cutoff = Date.now() - 365*86400000;
      return all.filter(c=> c.at >= cutoff);
    }
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    return all.filter(c=>{
      const d = new Date(c.at); return d.getFullYear()===y && d.getMonth()===m;
    });
  }

  // ─── Stats ─────────────────────────────────────────────────────────────────
  function calcStats(cases){
    const total = cases.length;
    const totalMs = cases.reduce((s,c)=>s+(c.durationMs||0),0);
    const hours = totalMs/3600000;
    const avgMin = total>0 ? (totalMs/total)/60000 : 0;

    const procCount = {};
    cases.forEach(c=>{
      const k = (c.procedure||'').trim();
      const key = k || '__none__';
      procCount[key] = (procCount[key]||0)+1;
    });

    const drugCount = {};
    cases.forEach(c=>{
      const seen = new Set();
      (c.drugs||[]).forEach(d=>{
        const k = drugRoot(d.name);
        // count uses-per-case (not per-bolus): more meaningful for "favorita"
        if(seen.has(k)) return;
        seen.add(k);
        drugCount[k] = (drugCount[k]||0)+1;
      });
    });

    const dow = [0,0,0,0,0,0,0];
    cases.forEach(c=>{ dow[ new Date(c.at).getDay() ]++; });

    return { total, hours, avgMin, totalMs, procCount, drugCount, dow };
  }

  function topEntries(obj, n){
    return Object.entries(obj)
      .filter(([k])=>k!=='__none__')
      .sort((a,b)=>b[1]-a[1])
      .slice(0,n);
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  function fmtNum(n, dec){
    if(n==null||isNaN(n)) return '0';
    const opts = { minimumFractionDigits: dec||0, maximumFractionDigits: dec||0 };
    return Number(n).toLocaleString(localeCode(), opts);
  }
  function fmtDuration(ms){
    const m = Math.round(ms/60000);
    if(m<60) return m + ' ' + tr('min_short');
    const h = Math.floor(m/60), mm = m%60;
    return h+'h ' + (mm?String(mm).padStart(2,'0'):'00');
  }
  function fmtDate(at){
    const d = new Date(at);
    const day = String(d.getDate()).padStart(2,'0');
    const mon = tArr('month_short')[d.getMonth()] || '';
    const hh = String(d.getHours()).padStart(2,'0');
    const mi = String(d.getMinutes()).padStart(2,'0');
    return `${day} ${mon} · ${hh}:${mi}`;
  }
  function escapeHtml(s){ return String(s).replace(/[&<>"]/g, ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch])); }

  function renderPractice(){
    const all = loadCases();
    const empty = document.getElementById('practiceEmpty');
    const content = document.getElementById('practiceContent');
    if(!empty || !content) return;
    if(all.length===0){
      empty.style.display = '';
      content.style.display = 'none';
      return;
    }
    empty.style.display = 'none';
    content.style.display = '';

    const cases = filterCases();
    const s = calcStats(cases);

    document.getElementById('statCases').textContent = fmtNum(s.total);
    document.getElementById('statHours').textContent = fmtNum(s.hours, s.hours<10?1:0);
    document.getElementById('statAvg').textContent = fmtNum(s.avgMin, 0);

    // Procedures
    const procEl = document.getElementById('procDist');
    const procTop = topEntries(s.procCount, 6);
    const noneCount = s.procCount['__none__']||0;
    const max = procTop.length ? procTop[0][1] : 1;
    if(procTop.length===0 && noneCount===0){
      procEl.innerHTML = `<p class="small muted">—</p>`;
    } else {
      procEl.innerHTML = procTop.map(([k,v])=>`
        <div class="bar-row">
          <span class="bar-label">${escapeHtml(k)}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${(v/max*100).toFixed(0)}%"></span></span>
          <span class="bar-count">${v}</span>
        </div>`).join('') + (noneCount>0 ? `
        <div class="bar-row">
          <span class="bar-label" style="color:var(--text-muted);font-style:italic">${tr('practice_no_proc')}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${(noneCount/max*100).toFixed(0)}%;background:var(--text-muted)"></span></span>
          <span class="bar-count">${noneCount}</span>
        </div>` : '');
    }

    // Drugs
    const drugEl = document.getElementById('drugDist');
    const drugTop = topEntries(s.drugCount, 8);
    const dMax = drugTop.length ? drugTop[0][1] : 1;
    if(drugTop.length===0){
      drugEl.innerHTML = `<p class="small muted">${tr('no_drug_logged')}</p>`;
    } else {
      drugEl.innerHTML = drugTop.map(([k,v])=>`
        <div class="bar-row">
          <span class="bar-label">${escapeHtml(k)}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${(v/dMax*100).toFixed(0)}%;background:var(--accent-info)"></span></span>
          <span class="bar-count">${v}</span>
        </div>`).join('');
    }

    // Day of week
    const dowEl = document.getElementById('dowChart');
    const dowMax = Math.max(1, ...s.dow);
    const lbls = [tr('dow_sun'),tr('dow_mon'),tr('dow_tue'),tr('dow_wed'),tr('dow_thu'),tr('dow_fri'),tr('dow_sat')];
    dowEl.innerHTML = `<div class="dow-chart">${s.dow.map((v,i)=>{
      const pct = (v/dowMax)*100;
      return `<div class="dow-col">
        <div class="dow-bar-wrap"><div class="dow-bar ${v===0?'empty':''}" style="height:${v===0?2:pct}%">${v>0?`<span class="dow-val">${v}</span>`:''}</div></div>
        <div class="dow-lbl">${lbls[i]}</div>
      </div>`;
    }).join('')}</div>`;

    // Recent cases (always show recent regardless of filter; cap 10)
    const recent = all.slice(0,10);
    const list = document.getElementById('casesList');
    list.innerHTML = recent.map(c=>{
      const proc = (c.procedure||'').trim();
      const drugs = (c.drugs||[]).length;
      const meta = `${fmtDate(c.at)} · ${drugs} ${drugs===1?'droga':'drogas'}`;
      return `<div class="case-row">
        <div class="case-info">
          <div class="case-proc ${proc?'':'empty'}">${proc?escapeHtml(proc):tr('practice_no_proc')}</div>
          <div class="case-meta">${meta}</div>
        </div>
        <div class="case-dur">${fmtDuration(c.durationMs||0)}</div>
        <button class="case-del" data-del="${c.id}" aria-label="${tr('delete_case')}" title="${tr('delete_case')}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>`;
    }).join('');
  }

  // Delete case
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-del]');
    if(!btn) return;
    if(!confirm(tr('confirm_delete_case'))) return;
    const id = btn.dataset.del;
    const all = loadCases().filter(c=>c.id!==id);
    saveCases(all);
    renderPractice();
  });

  // ─── Wrapped Stories ───────────────────────────────────────────────────────
  function getWrappedData(){
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const cases = loadCases().filter(c=>{ const d=new Date(c.at); return d.getFullYear()===y && d.getMonth()===m; });
    const s = calcStats(cases);
    const monthName = (tArr('month_full')[m]||'');
    const procTop = topEntries(s.procCount, 5);
    const drugTop = topEntries(s.drugCount, 5);
    let bIdx=0,bVal=-1; s.dow.forEach((v,i)=>{ if(v>bVal){ bVal=v; bIdx=i; } });
    const dowFull=[['Domingo','Sunday','Domingo'],['Segunda-feira','Monday','Lunes'],['Terça-feira','Tuesday','Martes'],['Quarta-feira','Wednesday','Miércoles'],['Quinta-feira','Thursday','Jueves'],['Sexta-feira','Friday','Viernes'],['Sábado','Saturday','Sábado']];
    const li = L()==='en'?1: L()==='es'?2:0;
    return { y, m, monthName, s, procTop, drugTop, busiestLbl: bVal>0?dowFull[bIdx][li]:'—', busiestVal:bVal };
  }

  function buildSlides(d){
    const month = d.monthName, slides=[];
    slides.push({ theme:'theme-intro', stars:true, fg:'#fff', content:`
      <div class="story-kicker">AnesthesiaPro · Wrapped</div>
      <h1 class="story-headline">${month} foi seu mês <em>cirúrgico</em>.</h1>
      <p class="story-sub">Vamos olhar o que aconteceu na sua sala.</p>` });
    slides.push({ theme:'theme-cases', barsTop:'#1DB954', barsBot:'#1DB954', fg:'#fff', content:`
      <div class="story-kicker">você conduziu</div>
      <div class="story-bignum">${d.s.total}</div>
      <p class="story-sub" style="margin-top:8px"><strong>${d.s.total===1?'procedimento':'procedimentos'}</strong> em ${month.toLowerCase()}.</p>` });
    const hours = fmtNum(d.s.hours, d.s.hours<10?1:0);
    slides.push({ theme:'theme-hours', zigTop:'#1A1A1A', zigBot:'#1A1A1A', fg:'#0a0a0a', content:`
      <div class="story-kicker">tempo em sala</div>
      <div class="story-bignum small">${hours}<span style="font-size:.45em">h</span></div>
      <p class="story-sub">Equivalente a <strong>${(d.s.hours/8).toFixed(1)} jornadas</strong> de 8 horas. Suas mãos não pararam.</p>` });
    if(d.procTop.length){
      const rows = d.procTop.map((p,i)=>`<div class="story-rank-row"><div class="story-rank-num">${i+1}<sup>º</sup></div><div class="story-rank-name">${escapeHtml(p[0])}</div><div class="story-rank-meta">×${p[1]}</div></div>`).join('');
      slides.push({ theme:'theme-procs', zigTop:'#1DB954', zigBot:'#1DB954', fg:'#0a0a0a', content:`
        <div class="story-kicker">procedimentos do mês</div>
        <h2 class="story-headline" style="font-size:32px;margin-bottom:18px">Top do mapa cirúrgico</h2>
        <div class="story-rank">${rows}</div>` });
    }
    if(d.drugTop.length){
      const rows = d.drugTop.map((p,i)=>`<div class="story-rank-row"><div class="story-rank-num">${i+1}<sup>º</sup></div><div class="story-rank-name">${escapeHtml(p[0])}</div><div class="story-rank-meta">×${p[1]}</div></div>`).join('');
      slides.push({ theme:'theme-drugs', barsTop:'#3D3DFF', barsBot:'#3D3DFF', fg:'#0a0a0a', content:`
        <div class="story-kicker">do seu carrinho</div>
        <h2 class="story-headline" style="font-size:32px;margin-bottom:18px">Suas drogas favoritas</h2>
        <div class="story-rank">${rows}</div>` });
    } else {
      slides.push({ theme:'theme-drugs', barsTop:'#3D3DFF', barsBot:'#3D3DFF', fg:'#0a0a0a', content:`
        <div class="story-kicker">do seu carrinho</div>
        <h2 class="story-headline" style="font-size:30px">Sem drogas registradas neste mês.</h2>
        <p class="story-sub">Toque no <strong>+</strong> dos cards de droga durante o caso para ver o ranking aqui.</p>` });
    }
    if(d.busiestVal>0){
      slides.push({ theme:'theme-day', fan:'#FF2D6E', fg:'#fff', content:`
        <div class="story-kicker">seu dia mais cheio</div>
        <h2 class="story-headline" style="font-size:48px"><em>${d.busiestLbl}</em></h2>
        <p class="story-sub">Foram <strong>${d.busiestVal} ${d.busiestVal===1?'caso':'casos'}</strong> só nesse dia da semana. Plantão fixo, né?</p>` });
    }
    const procFav = d.procTop[0]?d.procTop[0][0]:'—', drugFav = d.drugTop[0]?d.drugTop[0][0]:'—';
    slides.push({ theme:'theme-recap', isRecap:true, fg:'#fff', content:`
      <div class="story-recap-card">
        <div class="rc-head">AnesthesiaPro · Wrapped</div>
        <div class="rc-month">${month} ${d.y}</div>
        <div class="rc-grid">
          <div class="rc-stat"><div class="rc-num">${d.s.total}</div><div class="rc-lbl">procedimentos</div></div>
          <div class="rc-stat"><div class="rc-num">${hours}<span style="font-size:.6em">h</span></div><div class="rc-lbl">em sala</div></div>
        </div>
        <div class="rc-row"><div class="rc-lbl">Procedimento favorito</div><strong>${escapeHtml(procFav)}</strong></div>
        <div class="rc-row"><div class="rc-lbl">Droga campeã</div><strong>${escapeHtml(drugFav)}</strong></div>
        <div class="rc-row"><div class="rc-lbl">Dia mais cheio</div><strong>${escapeHtml(d.busiestLbl)}</strong></div>
        <div class="rc-foot"><span>anesthesiapro</span><span>#wrapped</span></div>
      </div>` });
    return slides;
  }

  function decoBars(col, top){
    let p=''; for(let i=0;i<14;i++){ const h=30+Math.abs(Math.sin((i+(top?0:3))*1.2))*120; const x=i*30; const y=top?0:200-h; p+=`<rect x="${x}" y="${y}" width="22" height="${h}" fill="${col}"/>`; }
    return `<svg viewBox="0 0 420 200" preserveAspectRatio="none">${p}</svg>`;
  }
  function decoZig(col, top){
    const d = top
      ? 'M0,0 L400,0 L400,60 L375,90 L350,55 L325,90 L300,55 L275,90 L250,55 L225,90 L200,55 L175,90 L150,55 L125,90 L100,55 L75,90 L50,55 L25,90 L0,55 Z'
      : 'M0,120 L400,120 L400,60 L375,30 L350,65 L325,30 L300,65 L275,30 L250,65 L225,30 L200,65 L175,30 L150,65 L125,30 L100,65 L75,30 L50,65 L25,30 L0,65 Z';
    return `<svg viewBox="0 0 400 120" preserveAspectRatio="none"><path d="${d}" fill="${col}"/></svg>`;
  }
  function decoFan(col){
    return `<svg viewBox="0 0 400 200" preserveAspectRatio="none"><path d="M0,0 L400,0 L400,140 C300,80 250,200 200,120 C150,40 100,180 0,100 Z" fill="${col}" opacity=".95"/><path d="M0,0 L300,0 L260,90 C220,40 180,110 140,60 C90,30 40,80 0,40 Z" fill="${col}" opacity=".5"/></svg>`;
  }
  function decoStars(){
    let p=''; for(let i=0;i<60;i++){ const x=(Math.random()*400)|0, y=(Math.random()*300)|0, r=(Math.random()*1.4+.3).toFixed(1); p+=`<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.5)"/>`; }
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="none">${p}</svg>`;
  }
  function decoGlow(){
    return `<svg viewBox="0 0 400 300" preserveAspectRatio="none"><defs><radialGradient id="gI" cx=".5" cy=".2" r=".8"><stop offset="0" stop-color="#7B3FE4"/><stop offset=".5" stop-color="#13B5C9" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><rect width="400" height="300" fill="url(#gI)"/></svg>`;
  }

  let storyIdx=0, storySlides=[], storyTimer=null, storyPaused=false;
  const STORY_DUR = 5500, STORY_RECAP_DUR = 9000;

  function renderStories(){
    const stage = document.getElementById('storiesStage');
    const prog  = document.getElementById('storiesProgress');
    stage.innerHTML = storySlides.map((sl,i)=>{
      let top='', bot='';
      if(sl.theme==='theme-intro'){ top = decoGlow(); }
      if(sl.theme==='theme-cases'){ top = decoBars(sl.barsTop,true); bot = decoBars(sl.barsBot,false); }
      if(sl.theme==='theme-hours'){ top = decoZig(sl.zigTop,true);   bot = decoZig(sl.zigBot,false); }
      if(sl.theme==='theme-procs'){ top = decoZig(sl.zigTop,true);   bot = decoZig(sl.zigBot,false); }
      if(sl.theme==='theme-drugs'){ top = decoBars(sl.barsTop,true); bot = decoBars(sl.barsBot,false); }
      if(sl.theme==='theme-day')  { top = decoFan(sl.fan); }
      const stars = sl.stars ? `<div style="position:absolute;inset:0;pointer-events:none;opacity:.6">${decoStars()}</div>` : '';
      return `<div class="story-slide ${sl.theme}" data-i="${i}">${stars}${top?`<div class="deco-top">${top}</div>`:''}${bot?`<div class="deco-bot">${bot}</div>`:''}<div class="body">${sl.content}</div></div>`;
    }).join('');
    prog.innerHTML = storySlides.map(()=>'<div class="pbar"><span class="pfill"></span></div>').join('');
  }

  function showSlide(i){
    if(i<0) i=0;
    if(i>=storySlides.length){ closeWrapped(); return; }
    storyIdx = i;
    document.querySelectorAll('#storiesStage .story-slide').forEach((el,j)=>el.classList.toggle('active', j===i));
    const bars = document.querySelectorAll('#storiesProgress .pbar');
    bars.forEach((b,j)=>{
      b.classList.remove('done');
      const fill = b.querySelector('.pfill');
      fill.style.transition = 'none';
      if(j<i){ b.classList.add('done'); fill.style.width='100%'; }
      else { fill.style.width='0%'; }
    });
    const cur = bars[i] && bars[i].querySelector('.pfill');
    if(cur){
      const dur = storySlides[i].isRecap ? STORY_RECAP_DUR : STORY_DUR;
      requestAnimationFrame(()=>{ cur.style.transition = `width ${dur}ms linear`; cur.style.width='100%'; });
    }
    clearTimeout(storyTimer);
    if(!storyPaused){
      const dur = storySlides[i].isRecap ? STORY_RECAP_DUR : STORY_DUR;
      storyTimer = setTimeout(()=>showSlide(i+1), dur);
    }
  }

  function openWrapped(){
    storySlides = buildSlides(getWrappedData());
    storyIdx=0; storyPaused=false;
    renderStories();
    document.getElementById('wrappedOverlay').classList.add('open');
    showSlide(0);
  }
  function closeWrapped(){
    clearTimeout(storyTimer);
    document.getElementById('wrappedOverlay').classList.remove('open');
  }

  function ellipsizeFit(ctx, text, maxWidth){
    if(!text) return '';
    if(ctx.measureText(text).width<=maxWidth) return text;
    let lo=0,hi=text.length,best='';
    while(lo<=hi){ const mid=(lo+hi)>>1, cand=text.slice(0,mid).trimEnd()+'…'; if(ctx.measureText(cand).width<=maxWidth){ best=cand; lo=mid+1; } else { hi=mid-1; } }
    return best||'…';
  }
  function wrapText(ctx, text, maxWidth){
    const words=String(text).split(/\s+/), lines=[]; let cur='';
    words.forEach(w=>{ const tt=cur?cur+' '+w:w; if(ctx.measureText(tt).width<=maxWidth) cur=tt; else { if(cur) lines.push(cur); cur=w; } });
    if(cur) lines.push(cur); return lines;
  }
  function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }

  function drawSlide(canvas, slide, data){
    const W=1080,H=1920; canvas.width=W; canvas.height=H;
    const ctx = canvas.getContext('2d');
    if(slide.theme==='theme-recap'){ const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0066CC'); g.addColorStop(1,'#13B5C9'); ctx.fillStyle=g; }
    else if(slide.theme==='theme-intro') ctx.fillStyle='#03060f';
    else if(slide.theme==='theme-cases') ctx.fillStyle='#000';
    else if(slide.theme==='theme-hours') ctx.fillStyle='#FFE15A';
    else if(slide.theme==='theme-procs') ctx.fillStyle='#FF2D2D';
    else if(slide.theme==='theme-drugs') ctx.fillStyle='#FFE15A';
    else if(slide.theme==='theme-day')   ctx.fillStyle='#0a0a0a';
    else ctx.fillStyle='#000';
    ctx.fillRect(0,0,W,H);

    if(slide.theme==='theme-intro'){
      const g=ctx.createRadialGradient(W*.5,H*.18,60,W*.5,H*.18,W*.9);
      g.addColorStop(0,'rgba(123,63,228,.7)'); g.addColorStop(.4,'rgba(19,181,201,.3)'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      ctx.fillStyle='rgba(255,255,255,.55)';
      for(let i=0;i<160;i++){ ctx.beginPath(); ctx.arc(Math.random()*W,Math.random()*H,Math.random()*3+.5,0,Math.PI*2); ctx.fill(); }
    } else if(slide.theme==='theme-cases'){
      ctx.fillStyle='#1DB954';
      for(let i=0;i<14;i++){ const h=80+Math.abs(Math.sin(i*1.3))*320; ctx.fillRect(i*80,0,60,h); }
      for(let i=0;i<14;i++){ const h=80+Math.abs(Math.sin((i+3)*1.1))*320; ctx.fillRect(i*80,H-h,60,h); }
    } else if(slide.theme==='theme-hours'||slide.theme==='theme-procs'||slide.theme==='theme-drugs'){
      const col = slide.theme==='theme-hours'?'#1A1A1A':(slide.theme==='theme-procs'?'#1DB954':'#3D3DFF');
      ctx.fillStyle=col;
      const seg=W/16, baseT=260, ampT=80;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W,0); ctx.lineTo(W,baseT);
      for(let i=16;i>=0;i--) ctx.lineTo(i*seg, baseT-(i%2?ampT:0));
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0,H); ctx.lineTo(W,H); ctx.lineTo(W,H-baseT);
      for(let i=16;i>=0;i--) ctx.lineTo(i*seg, H-baseT+(i%2?ampT:0));
      ctx.closePath(); ctx.fill();
    } else if(slide.theme==='theme-day'){
      ctx.fillStyle='#FF2D6E'; ctx.globalAlpha=.85;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(W,0); ctx.lineTo(W,520);
      ctx.bezierCurveTo(W*.7,300,W*.55,700,W*.5,420);
      ctx.bezierCurveTo(W*.45,200,W*.2,580,0,400);
      ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
    }

    const fg = slide.fg || '#fff';
    ctx.fillStyle=fg; ctx.globalAlpha=.9;
    ctx.save(); ctx.translate(80,140); ctx.rotate(Math.PI/4); ctx.fillRect(-22,-22,44,44); ctx.restore();
    ctx.font='700 32px -apple-system,"Segoe UI",Roboto,sans-serif';
    ctx.textBaseline='middle'; ctx.textAlign='left';
    ctx.fillText('AnesthesiaPro', 150, 140);
    ctx.globalAlpha=1; ctx.textBaseline='alphabetic';

    const PADX=90;
    if(slide.theme==='theme-intro'){
      ctx.globalAlpha=.75; ctx.font='700 30px -apple-system,sans-serif'; ctx.fillText('ANESTHESIAPRO · WRAPPED', PADX, 1080);
      ctx.globalAlpha=1; ctx.font='800 116px Georgia,serif';
      ctx.fillText(`${data.monthName} foi seu`, PADX, 1230);
      ctx.fillText('mês cirúrgico.', PADX, 1360);
      ctx.globalAlpha=.9; ctx.font='500 38px -apple-system,sans-serif';
      ctx.fillText('Vamos olhar o que aconteceu na sua sala.', PADX, 1450);
    } else if(slide.theme==='theme-cases'){
      ctx.globalAlpha=.75; ctx.font='700 30px -apple-system,sans-serif'; ctx.fillText('VOCÊ CONDUZIU', PADX, 800);
      ctx.globalAlpha=1; ctx.font='900 480px -apple-system,sans-serif';
      ctx.fillText(String(data.s.total), PADX, 1240);
      ctx.font='700 56px -apple-system,sans-serif';
      ctx.fillText(`${data.s.total===1?'procedimento':'procedimentos'} em ${data.monthName.toLowerCase()}.`, PADX, 1340);
    } else if(slide.theme==='theme-hours'){
      ctx.globalAlpha=.65; ctx.font='700 30px -apple-system,sans-serif'; ctx.fillText('TEMPO EM SALA', PADX, 720);
      ctx.globalAlpha=1; ctx.font='900 380px -apple-system,sans-serif';
      ctx.fillText(fmtNum(data.s.hours, data.s.hours<10?1:0)+'h', PADX, 1100);
      ctx.font='500 42px -apple-system,sans-serif';
      ctx.fillText(`Equivalente a ${(data.s.hours/8).toFixed(1)} jornadas`, PADX, 1180);
      ctx.fillText('de 8 horas. Suas mãos não pararam.', PADX, 1240);
    } else if(slide.theme==='theme-procs' || slide.theme==='theme-drugs'){
      const items = slide.theme==='theme-procs' ? data.procTop : data.drugTop;
      ctx.globalAlpha=.65; ctx.font='700 30px -apple-system,sans-serif';
      ctx.fillText(slide.theme==='theme-procs'?'PROCEDIMENTOS DO MÊS':'DO SEU CARRINHO', PADX, 600);
      ctx.globalAlpha=1; ctx.font='800 64px Georgia,serif';
      ctx.fillText(slide.theme==='theme-procs'?'Top do mapa cirúrgico':'Suas drogas favoritas', PADX, 700);
      let y=880;
      if(items.length===0){ ctx.font='500 40px -apple-system,sans-serif'; ctx.fillText('Sem registros neste mês.', PADX, y); }
      items.forEach((it,i)=>{
        ctx.font='900 92px -apple-system,sans-serif'; ctx.fillText(`${i+1}º`, PADX, y);
        ctx.font='700 56px -apple-system,sans-serif';
        ctx.fillText(ellipsizeFit(ctx,it[0],W-PADX*2-200), PADX+170, y-12);
        ctx.font='700 36px -apple-system,sans-serif'; ctx.globalAlpha=.55;
        ctx.fillText('×'+it[1], PADX+170, y+34); ctx.globalAlpha=1;
        y += 130;
      });
    } else if(slide.theme==='theme-day'){
      ctx.globalAlpha=.65; ctx.font='700 30px -apple-system,sans-serif'; ctx.fillText('SEU DIA MAIS CHEIO', PADX, 1080);
      ctx.globalAlpha=1; ctx.font='800 124px Georgia,serif'; ctx.fillStyle='#FF2D6E';
      ctx.fillText(data.busiestLbl, PADX, 1240);
      ctx.fillStyle=fg; ctx.font='500 42px -apple-system,sans-serif';
      const lines = wrapText(ctx, `Foram ${data.busiestVal} ${data.busiestVal===1?'caso':'casos'} só nesse dia. Plantão fixo, né?`, W-PADX*2);
      lines.forEach((ln,i)=>ctx.fillText(ln, PADX, 1340+i*60));
    } else if(slide.theme==='theme-recap'){
      const cardX=PADX, cardY=380, cardW=W-PADX*2, cardH=1180;
      ctx.fillStyle='rgba(0,0,0,.85)'; roundRect(ctx,cardX,cardY,cardW,cardH,36); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.globalAlpha=.55; ctx.font='700 26px -apple-system,sans-serif'; ctx.fillText('ANESTHESIAPRO · WRAPPED', cardX+50, cardY+80);
      ctx.globalAlpha=1; ctx.font='800 72px Georgia,serif'; ctx.fillText(`${data.monthName} ${data.y}`, cardX+50, cardY+170);
      const gridY=cardY+260;
      ctx.font='900 100px -apple-system,sans-serif';
      ctx.fillText(String(data.s.total), cardX+50, gridY+90);
      ctx.fillText(fmtNum(data.s.hours, data.s.hours<10?1:0)+'h', cardX+cardW/2+30, gridY+90);
      ctx.globalAlpha=.55; ctx.font='700 24px -apple-system,sans-serif';
      ctx.fillText('PROCEDIMENTOS', cardX+50, gridY+130);
      ctx.fillText('EM SALA', cardX+cardW/2+30, gridY+130);
      ctx.globalAlpha=1;
      const rows=[['PROCEDIMENTO FAVORITO',data.procTop[0]?data.procTop[0][0]:'—'],['DROGA CAMPEÃ',data.drugTop[0]?data.drugTop[0][0]:'—'],['DIA MAIS CHEIO',data.busiestLbl]];
      let ry=gridY+260;
      rows.forEach(([lbl,val])=>{
        ctx.globalAlpha=.55; ctx.font='700 24px -apple-system,sans-serif'; ctx.fillText(lbl, cardX+50, ry);
        ctx.globalAlpha=1; ctx.font='800 52px -apple-system,sans-serif';
        ctx.fillText(ellipsizeFit(ctx,val||'—',cardW-100), cardX+50, ry+62);
        ry += 150;
      });
      ctx.globalAlpha=.55; ctx.font='700 22px -apple-system,sans-serif';
      ctx.fillText('ANESTHESIAPRO', cardX+50, cardY+cardH-50);
      ctx.textAlign='right'; ctx.fillText('#WRAPPED', cardX+cardW-50, cardY+cardH-50);
      ctx.globalAlpha=1;
    }
  }

  function canvasToBlob(cv){ return new Promise(res=>cv.toBlob(b=>res(b),'image/png')); }
  function downloadBlob(blob, filename){
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  async function shareWrapped(){
    const data = getWrappedData();
    const slide = storySlides[storyIdx] || storySlides[storySlides.length-1];
    const cv = document.createElement('canvas'); drawSlide(cv, slide, data);
    const blob = await canvasToBlob(cv);
    if(!blob){ toast('Erro ao gerar imagem'); return; }
    const fn = `anesthesia-wrapped-${new Date().toISOString().slice(0,7)}-${storyIdx+1}.png`;
    const file = new File([blob], fn, { type:'image/png' });
    if(navigator.canShare && navigator.canShare({ files:[file] })){
      try{ await navigator.share({ files:[file], title:'AnesthesiaPro Wrapped', text:'Minha prática anestesiológica' }); return; }
      catch(err){}
    }
    downloadBlob(blob, fn);
  }
  async function downloadWrapped(){
    const data = getWrappedData();
    const slide = storySlides[storyIdx] || storySlides[storySlides.length-1];
    const cv = document.createElement('canvas'); drawSlide(cv, slide, data);
    const blob = await canvasToBlob(cv);
    if(!blob){ toast('Erro ao gerar imagem'); return; }
    downloadBlob(blob, `anesthesia-wrapped-${new Date().toISOString().slice(0,7)}.png`);
  }

  // ─── Public API ────────────────────────────────────────────────────────────
  window.PracticeArchive = archiveCurrentCase;
  window.PracticeRender  = renderPractice;
  window.PracticeLogDrug = logDrugAdmin;

  // ─── Init ──────────────────────────────────────────────────────────────────
  function init(){
    bindProcInput();

    document.querySelectorAll('#practiceFilter button').forEach(b=>{
      b.addEventListener('click', ()=>{
        activeRange = b.dataset.range;
        document.querySelectorAll('#practiceFilter button').forEach(x=>x.classList.toggle('active', x===b));
        renderPractice();
      });
    });

    const openBtn = document.getElementById('openWrapped');
    if(openBtn) openBtn.addEventListener('click', openWrapped);
    const closeBtn = document.getElementById('wrappedClose');
    if(closeBtn) closeBtn.addEventListener('click', closeWrapped);
    const shareBtn = document.getElementById('wrappedShare');
    if(shareBtn) shareBtn.addEventListener('click', shareWrapped);
    const tapL = document.getElementById('storyTapLeft');
    const tapR = document.getElementById('storyTapRight');
    if(tapL) tapL.addEventListener('click', ()=>showSlide(storyIdx-1));
    if(tapR) tapR.addEventListener('click', ()=>showSlide(storyIdx+1));
    const pauseBtn = document.getElementById('storyPause');
    if(pauseBtn){
      pauseBtn.addEventListener('click', ()=>{
        storyPaused = !storyPaused;
        if(storyPaused){
          clearTimeout(storyTimer);
          const fill = document.querySelectorAll('#storiesProgress .pbar .pfill')[storyIdx];
          if(fill){ const w = getComputedStyle(fill).width; fill.style.transition='none'; fill.style.width=w; }
          pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
        } else {
          showSlide(storyIdx);
          pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="6" width="3.5" height="12" rx="1"/><rect x="13.5" y="6" width="3.5" height="12" rx="1"/></svg>';
        }
      });
    }
    document.addEventListener('keydown', (e)=>{
      if(!document.getElementById('wrappedOverlay').classList.contains('open')) return;
      if(e.key==='Escape') closeWrapped();
      else if(e.key==='ArrowRight') showSlide(storyIdx+1);
      else if(e.key==='ArrowLeft')  showSlide(storyIdx-1);
    });

    // Hook into "Zerar" — discards the in-progress case
    const reset = document.getElementById('timerReset');
    if(reset){
      reset.addEventListener('click', ()=>{
        // Original handler runs first (clears timer state)
        currentCase = { drugs: [] };
        saveCurrent(null);
        try{ localStorage.removeItem(KEY_PROC); }catch{}
        const inp = document.getElementById('procInput'); if(inp) inp.value='';
      });
    }

    renderPractice();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
