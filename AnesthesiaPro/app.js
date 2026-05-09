/* AnesthesiaPro — single-file vanilla JS app
   Calculations sourced per spec (Holiday-Segar 4-2-1, Devine, Mosteller, ARDSNet, etc.) */

// ─────────── Translations ───────────
const T = {
  pt: {
    tagline:"Precisão na palma da mão",
    patient_data:"Dados do Paciente", new_patient:"Novo",
    weight_label:"Peso (kg)", height_label:"Altura (cm)", sex_label:"Sexo", age_label:"Idade (anos)",
    male:"Masculino", female:"Feminino",
    invalid_weight:"Peso fora do range (0.5–300 kg)", invalid_height:"Altura fora do range (30–250 cm)",
    bmi_under:"Baixo peso", bmi_normal:"Eutrófico", bmi_over:"Sobrepeso",
    bmi_o1:"Obesidade I", bmi_o2:"Obesidade II", bmi_o3:"Obesidade III",
    ideal_weight:"Peso ideal", adj_weight:"Peso ajustado", bsa:"SC",
    timer_idle:"Inativo", timer_running:"Em andamento", timer_paused:"Pausado",
    start:"Iniciar", pause:"Pausar", reset:"Zerar",
    ev_start:"Início", ev_induction:"Indução", ev_intub:"Intubação", ev_incision:"Incisão",
    ev_endsurg:"Fim cirurgia", ev_extub:"Extubação", ev_endcase:"Fim caso",
    tab_volemia:"Volemia", tab_drugs:"Drogas", tab_ventilation:"Ventilação",
    tab_pediatrics:"Pediatria", tab_pump:"Bomba", tab_techniques:"Técnicas",
    tab_blocks:"Bloqueios",
    fasting_hours:"Jejum (h)", hct_initial:"Hct inicial (%)", hct_target:"Hct alvo (%)",
    rate_421:"Taxa manutenção (4-2-1)", deficit_jejum:"Déficit de jejum",
    hour1:"1ª hora", hour23:"2ª e 3ª hora", ebv:"Volume sanguíneo (EBV)", abl:"Perda máxima permitida (ABL)",
    rec_safe:"Cristaloide (1:1 a 1:3 da perda) ou coloide (1:1). Manter perfusão tecidual e diurese > 0.5 ml/kg/h.",
    rec_transfuse:"Considerar hemotransfusão. Solicitar tipagem e prova cruzada.",
    drugs_hint:"Doses calculadas pelo peso indicado",
    cat_induction:"Indução", cat_opioid:"Opioides", cat_nmb:"Bloqueadores neuromusculares",
    cat_reversal:"Reversão BNM", cat_anti:"Antieméticos", cat_analg:"Analgésicos",
    cat_adjunct:"Adjuvantes", cat_vaso:"Vasopressores",
    w_real:"real", w_ideal:"ideal", w_adj:"ajustado", w_fixed:"dose fixa",
    rr_label:"FR (irpm)", peep_label:"PEEP (cmH₂O)", fio2_label:"FiO₂ (%)",
    pbw:"Peso Predito (PBW)", vt_protective:"VC Protetivo (6 ml/kg)", vt_inter:"VC Intermediário (7 ml/kg)",
    vt_max:"VC Máximo (8 ml/kg)", min_vol:"Volume-minuto",
    material_recommended:"Material recomendado", vent_targets:"Metas ventilatórias",
    tot:"TOT", blade:"Lâmina",
    target_pplato:"Pplatô", target_dp:"Driving Pressure", target_spo2:"SpO₂", target_etco2:"EtCO₂", target_peep:"PEEP",
    ped_hint:"Idade do paciente é usada", ped_emerg:"Emergência Pediátrica", ped_routine:"Drogas rotineiras",
    est_weight:"Peso estimado (Broselow)", maint_iv:"Manutenção EV", tot_cuffed:"TOT com cuff",
    tot_uncuffed:"TOT sem cuff", fixation:"Profundidade de fixação",
    drug:"Droga", desired_dose:"Dose desejada", unit:"Unidade", concentration:"Concentração (mcg/ml)",
    pump_rate:"Taxa da bomba", pump_mcgmin:"mcg/min", pump_mgh:"mg/h", pump_24h:"mg/24h",
    dilution_recipe:"Diluição padrão",
    pump_high:"Fluxo elevado — confirme concentração e dose.",
    pump_vhigh:"Fluxo muito elevado — risco de sobrecarga. Revise diluição.",
    pump_nora_high:"Dose elevada de noradrenalina — considerar segundo vasopressor.",
    anesthetic:"Anestésico", with_epi:"Com epinefrina", yes:"Sim", no:"Não",
    block_select:"Bloqueio", volume_ml:"Volume (ml)", concentration_pct:"Concentração (%)",
    add_dose:"Registrar bloqueio", dose_tracker:"Dose acumulada", clear:"Limpar",
    last_protocol:"LAST — Resgate Lipídico",
    last_text:"Em caso de intoxicação por anestésico local:",
    last_bolus:"Intralipid 20% — bolus", last_infusion:"Intralipid 20% — infusão (30–60 min)",
    last_max:"Dose máxima de Intralipid",
    no_doses:"Nenhum bloqueio registrado neste caso.",
    accumulated:"acumulado", max_dose:"máx",
    over_75:"Atenção: > 75% da dose máxima.",
    over_90:"CRÍTICO: > 90% da dose máxima — não administrar.",
    emergency_mode:"Modo Emergência", install:"Instalar",
    install_prompt:"Instalar AnesthesiaPro para uso offline",
    disclaimer:"Ferramenta de apoio à decisão clínica. Não substitui o julgamento médico. Confira sempre antes de administrar.",
    copied:"Copiado!", copy:"Copiar", confirm_new:"Limpar dados do paciente?",
    confirm_clear:"Limpar todos os bloqueios registrados?",
    pcr_timer:"Timer PCR", pcr_start:"Iniciar", pcr_stop:"Parar",
    pcr_label:"Próxima adrenalina em",
    er_pcr:"PCR / ACLS", er_anaph:"Anafilaxia", er_mh:"Hipertermia Maligna",
    er_last:"LAST", er_bronc:"Broncoespasmo Severo",
    er_no_halog:"PARAR halogenados imediatamente",
    er_avoid_last:"NÃO USAR: lidocaína, vasopressina, bloq. cálcio, betabloqueadores",
    new_version:"Nova versão disponível — recarregue para atualizar"
  },
  en: {
    tagline:"Precision at your fingertips",
    patient_data:"Patient Data", new_patient:"New",
    weight_label:"Weight (kg)", height_label:"Height (cm)", sex_label:"Sex", age_label:"Age (years)",
    male:"Male", female:"Female",
    invalid_weight:"Weight out of range (0.5–300 kg)", invalid_height:"Height out of range (30–250 cm)",
    bmi_under:"Underweight", bmi_normal:"Normal", bmi_over:"Overweight",
    bmi_o1:"Obesity I", bmi_o2:"Obesity II", bmi_o3:"Obesity III",
    ideal_weight:"Ideal weight", adj_weight:"Adjusted weight", bsa:"BSA",
    timer_idle:"Idle", timer_running:"Running", timer_paused:"Paused",
    start:"Start", pause:"Pause", reset:"Reset",
    ev_start:"Start", ev_induction:"Induction", ev_intub:"Intubation", ev_incision:"Incision",
    ev_endsurg:"End surgery", ev_extub:"Extubation", ev_endcase:"End case",
    tab_volemia:"Fluids", tab_drugs:"Drugs", tab_ventilation:"Ventilation",
    tab_pediatrics:"Pediatrics", tab_pump:"Infusion", tab_techniques:"Techniques",
    tab_blocks:"Blocks",
    fasting_hours:"Fasting (h)", hct_initial:"Initial Hct (%)", hct_target:"Target Hct (%)",
    rate_421:"Maintenance rate (4-2-1)", deficit_jejum:"Fasting deficit",
    hour1:"Hour 1", hour23:"Hours 2 & 3", ebv:"Estimated blood volume", abl:"Allowable blood loss (ABL)",
    rec_safe:"Crystalloid (1:1 to 1:3 of loss) or colloid (1:1). Maintain perfusion and urine output > 0.5 ml/kg/h.",
    rec_transfuse:"Consider transfusion. Order type & crossmatch.",
    drugs_hint:"Doses computed by indicated weight",
    cat_induction:"Induction", cat_opioid:"Opioids", cat_nmb:"Neuromuscular blockers",
    cat_reversal:"NMB reversal", cat_anti:"Antiemetics", cat_analg:"Analgesics",
    cat_adjunct:"Adjuncts", cat_vaso:"Vasopressors",
    w_real:"actual", w_ideal:"ideal", w_adj:"adjusted", w_fixed:"fixed",
    rr_label:"RR (bpm)", peep_label:"PEEP (cmH₂O)", fio2_label:"FiO₂ (%)",
    pbw:"Predicted Body Weight", vt_protective:"Vt Protective (6 ml/kg)", vt_inter:"Vt Intermediate (7 ml/kg)",
    vt_max:"Vt Max (8 ml/kg)", min_vol:"Minute volume",
    material_recommended:"Recommended equipment", vent_targets:"Ventilation targets",
    tot:"ETT", blade:"Blade",
    target_pplato:"Pplat", target_dp:"Driving Pressure", target_spo2:"SpO₂", target_etco2:"EtCO₂", target_peep:"PEEP",
    ped_hint:"Patient age is used", ped_emerg:"Pediatric Emergency", ped_routine:"Routine drugs",
    est_weight:"Estimated weight (Broselow)", maint_iv:"IV maintenance", tot_cuffed:"Cuffed ETT",
    tot_uncuffed:"Uncuffed ETT", fixation:"Fixation depth",
    drug:"Drug", desired_dose:"Desired dose", unit:"Unit", concentration:"Concentration (mcg/ml)",
    pump_rate:"Pump rate", pump_mcgmin:"mcg/min", pump_mgh:"mg/h", pump_24h:"mg/24h",
    dilution_recipe:"Standard dilution",
    pump_high:"High rate — verify concentration and dose.",
    pump_vhigh:"Very high rate — overload risk. Review dilution.",
    pump_nora_high:"High norepinephrine dose — consider second vasopressor.",
    anesthetic:"Anesthetic", with_epi:"With epinephrine", yes:"Yes", no:"No",
    block_select:"Block", volume_ml:"Volume (ml)", concentration_pct:"Concentration (%)",
    add_dose:"Register block", dose_tracker:"Cumulative dose", clear:"Clear",
    last_protocol:"LAST — Lipid Rescue",
    last_text:"In local anesthetic systemic toxicity:",
    last_bolus:"Intralipid 20% — bolus", last_infusion:"Intralipid 20% — infusion (30–60 min)",
    last_max:"Intralipid max dose",
    no_doses:"No blocks registered for this case.",
    accumulated:"accumulated", max_dose:"max",
    over_75:"Caution: > 75% of max dose.",
    over_90:"CRITICAL: > 90% of max dose — do not administer.",
    emergency_mode:"Emergency Mode", install:"Install",
    install_prompt:"Install AnesthesiaPro for offline use",
    disclaimer:"Clinical decision support tool. Does not replace medical judgment. Always verify before administering.",
    copied:"Copied!", copy:"Copy", confirm_new:"Clear patient data?",
    confirm_clear:"Clear all registered blocks?",
    pcr_timer:"Code timer", pcr_start:"Start", pcr_stop:"Stop",
    pcr_label:"Next epinephrine in",
    er_pcr:"Cardiac Arrest / ACLS", er_anaph:"Anaphylaxis", er_mh:"Malignant Hyperthermia",
    er_last:"LAST", er_bronc:"Severe Bronchospasm",
    er_no_halog:"STOP volatile agents immediately",
    er_avoid_last:"DO NOT USE: lidocaine, vasopressin, calcium blockers, beta-blockers",
    new_version:"New version available — reload to update"
  },
  es: {
    tagline:"Precisión en la palma de tu mano",
    patient_data:"Datos del Paciente", new_patient:"Nuevo",
    weight_label:"Peso (kg)", height_label:"Altura (cm)", sex_label:"Sexo", age_label:"Edad (años)",
    male:"Masculino", female:"Femenino",
    invalid_weight:"Peso fuera de rango (0.5–300 kg)", invalid_height:"Altura fuera de rango (30–250 cm)",
    bmi_under:"Bajo peso", bmi_normal:"Normal", bmi_over:"Sobrepeso",
    bmi_o1:"Obesidad I", bmi_o2:"Obesidad II", bmi_o3:"Obesidad III",
    ideal_weight:"Peso ideal", adj_weight:"Peso ajustado", bsa:"SC",
    timer_idle:"Inactivo", timer_running:"En curso", timer_paused:"Pausado",
    start:"Iniciar", pause:"Pausar", reset:"Reiniciar",
    ev_start:"Inicio", ev_induction:"Inducción", ev_intub:"Intubación", ev_incision:"Incisión",
    ev_endsurg:"Fin cirugía", ev_extub:"Extubación", ev_endcase:"Fin caso",
    tab_volemia:"Volemia", tab_drugs:"Fármacos", tab_ventilation:"Ventilación",
    tab_pediatrics:"Pediatría", tab_pump:"Bomba", tab_techniques:"Técnicas",
    tab_blocks:"Bloqueos",
    fasting_hours:"Ayuno (h)", hct_initial:"Hct inicial (%)", hct_target:"Hct objetivo (%)",
    rate_421:"Tasa mantenimiento (4-2-1)", deficit_jejum:"Déficit de ayuno",
    hour1:"1ª hora", hour23:"2ª y 3ª hora", ebv:"Volumen sanguíneo", abl:"Pérdida máxima permitida",
    rec_safe:"Cristaloide (1:1 a 1:3 de la pérdida) o coloide (1:1). Mantener perfusión y diuresis > 0.5 ml/kg/h.",
    rec_transfuse:"Considerar transfusión. Solicitar tipificación y pruebas cruzadas.",
    drugs_hint:"Dosis según peso indicado",
    cat_induction:"Inducción", cat_opioid:"Opioides", cat_nmb:"Bloqueadores neuromusculares",
    cat_reversal:"Reversión BNM", cat_anti:"Antieméticos", cat_analg:"Analgésicos",
    cat_adjunct:"Adyuvantes", cat_vaso:"Vasopresores",
    w_real:"real", w_ideal:"ideal", w_adj:"ajustado", w_fixed:"fija",
    rr_label:"FR (rpm)", peep_label:"PEEP (cmH₂O)", fio2_label:"FiO₂ (%)",
    pbw:"Peso Predicho", vt_protective:"Vt Protector (6 ml/kg)", vt_inter:"Vt Intermedio (7 ml/kg)",
    vt_max:"Vt Máximo (8 ml/kg)", min_vol:"Volumen-minuto",
    material_recommended:"Material recomendado", vent_targets:"Metas ventilatorias",
    tot:"TET", blade:"Hoja",
    target_pplato:"Pplat", target_dp:"Driving Pressure", target_spo2:"SpO₂", target_etco2:"EtCO₂", target_peep:"PEEP",
    ped_hint:"Edad del paciente se utiliza", ped_emerg:"Emergencia Pediátrica", ped_routine:"Fármacos rutinarios",
    est_weight:"Peso estimado (Broselow)", maint_iv:"Mantenimiento EV", tot_cuffed:"TET con cuff",
    tot_uncuffed:"TET sin cuff", fixation:"Profundidad fijación",
    drug:"Fármaco", desired_dose:"Dosis deseada", unit:"Unidad", concentration:"Concentración (mcg/ml)",
    pump_rate:"Tasa bomba", pump_mcgmin:"mcg/min", pump_mgh:"mg/h", pump_24h:"mg/24h",
    dilution_recipe:"Dilución estándar",
    pump_high:"Flujo elevado — confirme concentración y dosis.",
    pump_vhigh:"Flujo muy elevado — riesgo de sobrecarga.",
    pump_nora_high:"Dosis elevada de noradrenalina — considerar segundo vasopresor.",
    anesthetic:"Anestésico", with_epi:"Con epinefrina", yes:"Sí", no:"No",
    block_select:"Bloqueo", volume_ml:"Volumen (ml)", concentration_pct:"Concentración (%)",
    add_dose:"Registrar bloqueo", dose_tracker:"Dosis acumulada", clear:"Limpiar",
    last_protocol:"LAST — Rescate Lipídico",
    last_text:"En toxicidad sistémica por anestésico local:",
    last_bolus:"Intralipid 20% — bolo", last_infusion:"Intralipid 20% — infusión (30–60 min)",
    last_max:"Dosis máxima Intralipid",
    no_doses:"Ningún bloqueo registrado.",
    accumulated:"acumulado", max_dose:"máx",
    over_75:"Atención: > 75% de la dosis máxima.",
    over_90:"CRÍTICO: > 90% — no administrar.",
    emergency_mode:"Modo Emergencia", install:"Instalar",
    install_prompt:"Instalar AnesthesiaPro para uso sin conexión",
    disclaimer:"Herramienta de apoyo a la decisión clínica. No sustituye el juicio médico. Verifique siempre antes de administrar.",
    copied:"¡Copiado!", copy:"Copiar", confirm_new:"¿Limpiar datos del paciente?",
    confirm_clear:"¿Limpiar todos los bloqueos?",
    pcr_timer:"Timer PCR", pcr_start:"Iniciar", pcr_stop:"Detener",
    pcr_label:"Próxima adrenalina en",
    er_pcr:"PCR / ACLS", er_anaph:"Anafilaxia", er_mh:"Hipertermia Maligna",
    er_last:"LAST", er_bronc:"Broncoespasmo Severo",
    er_no_halog:"DETENER halogenados de inmediato",
    er_avoid_last:"NO USAR: lidocaína, vasopresina, bloq. calcio, betabloqueadores",
    new_version:"Nueva versión disponible — recargue para actualizar"
  }
};

let lang = localStorage.getItem('apr_lang') || (navigator.language || 'pt').slice(0,2);
if(!T[lang]) lang = 'pt';
const t = (k) => (T[lang] && T[lang][k]) || T.pt[k] || k;

// ─────────── Patient state ───────────
const state = {
  weight: 70, height: 172, sex: 'm', age: 35,
  fastHrs: 8, hctI: 40, hctT: 30,
  rr: 12, peep: 5, fio2: 50,
  pumpDrug: 'noradr', pumpDose: 0.05, pumpUnit: 'mcg/kg/min', pumpConc: 64,
  blockAnesth: 'bupi', blockEpi: 0, blockType: 'epidural_lumbar', blockVol: 20, blockConc: 0.5,
  registeredDoses: [],
  timer: { running:false, startedAt:null, accum:0, events:[] }
};

// ─────────── Derived patient calcs ───────────
function idealWeight(h, sex){
  if(!h) return null;
  return (sex==='m' ? 50 : 45.5) + 0.91 * (h - 152.4);
}
function adjWeight(real, h, sex){
  const iw = idealWeight(h,sex);
  if(iw==null) return null;
  return iw + 0.4 * (real - iw);
}
function bmi(w,h){ if(!w||!h) return null; return w/((h/100)**2); }
function bsa(w,h){ if(!w||!h) return null; return Math.sqrt(w*h/3600); }
function bmiClass(b){
  if(b<18.5) return {k:'bmi_under', tone:'b-warn'};
  if(b<25) return {k:'bmi_normal', tone:'b-ok'};
  if(b<30) return {k:'bmi_over', tone:'b-warn'};
  if(b<35) return {k:'bmi_o1', tone:'b-danger'};
  if(b<40) return {k:'bmi_o2', tone:'b-danger'};
  return {k:'bmi_o3', tone:'b-danger'};
}
const r1 = (n) => Math.round(n*10)/10;
const r0 = (n) => Math.round(n);
const fmt = (n, d=1) => {
  if(n==null||isNaN(n)) return '—';
  return n.toLocaleString(lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR', {minimumFractionDigits:d, maximumFractionDigits:d});
};

// ─────────── Tabs config ───────────
const TABS = [
  { id:'volemia', icon:'💧', svg:'<path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z"/>' },
  { id:'drugs', icon:'💊', svg:'<rect x="3" y="9" width="18" height="6" rx="3"/><path d="M12 9v6"/>' },
  { id:'ventilation', icon:'🫁', svg:'<path d="M12 4v16M6 8c0 6 0 10 6 12M18 8c0 6 0 10-6 12"/>' },
  { id:'pediatrics', icon:'👶', svg:'<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2"/>' },
  { id:'pump', icon:'⚗️', svg:'<rect x="6" y="3" width="12" height="6" rx="1"/><path d="M9 9l-3 12h12L15 9"/>' },
  { id:'techniques', icon:'📋', svg:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/>' },
  { id:'blocks', icon:'🧊', svg:'<path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13"/>' }
];

function renderTabs(){
  const track = document.getElementById('tabsTrack');
  track.innerHTML = TABS.map((tb,i)=>`
    <button class="tab ${i===0?'active':''}" data-tab="${tb.id}" role="tab">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${tb.svg}</svg>
      <span data-i18n="tab_${tb.id}">${t('tab_'+tb.id)}</span>
    </button>`).join('');
  track.querySelectorAll('.tab').forEach(b=>{
    b.addEventListener('click', ()=>switchTab(b.dataset.tab));
  });
}
function switchTab(id){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active', b.dataset.tab===id));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.dataset.panel===id));
  // scroll active tab into view
  const active = document.querySelector('.tab.active');
  if(active && active.scrollIntoView){
    active.parentElement.scrollTo({left:active.offsetLeft - 12, behavior:'smooth'});
  }
}

// ─────────── i18n apply ───────────
function applyI18n(){
  document.documentElement.lang = lang==='pt'?'pt-BR':lang==='en'?'en':'es';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k = el.getAttribute('data-i18n');
    if(T[lang][k]) el.textContent = T[lang][k];
  });
}

// ─────────── Patient UI ───────────
function patientBadges(){
  const w = state.weight, h = state.height;
  const iw = idealWeight(h,state.sex), aw = adjWeight(w,h,state.sex);
  const b = bmi(w,h), s = bsa(w,h);
  const cls = b ? bmiClass(b) : null;
  const c = document.getElementById('patientBadges');
  c.innerHTML = '';
  if(iw){ c.insertAdjacentHTML('beforeend',`<span class="badge b-info">${t('ideal_weight')}: ${fmt(iw,1)} kg</span>`); }
  if(aw){ c.insertAdjacentHTML('beforeend',`<span class="badge b-info">${t('adj_weight')}: ${fmt(aw,1)} kg</span>`); }
  if(b){ c.insertAdjacentHTML('beforeend',`<span class="badge ${cls.tone}">IMC ${fmt(b,1)} · ${t(cls.k)}</span>`); }
  if(s){ c.insertAdjacentHTML('beforeend',`<span class="badge">${t('bsa')}: ${fmt(s,2)} m²</span>`); }
}

// ─────────── Volemia ───────────
function rate421(w){
  if(w<=10) return 4*w;
  if(w<=20) return 40 + 2*(w-10);
  return 60 + 1*(w-20);
}
function ebvFor(w, sex, age){
  if(age!=null && age<14) return 80*w;
  return (sex==='m' ? 70 : 65) * w;
}
function renderVolemia(){
  const w = state.weight, fast = state.fastHrs, hi = state.hctI, ht = state.hctT;
  const rate = rate421(w);
  const deficit = rate * fast;
  const h1 = deficit*0.5 + rate;
  const h23 = deficit*0.25 + rate;
  const ebv = ebvFor(w, state.sex, state.age);
  const abl = hi>0 ? ebv * (hi-ht) / hi : 0;
  let formula421;
  if(w<=10) formula421 = `4 × ${fmt(w,1)}`;
  else if(w<=20) formula421 = `4×10 + 2×${fmt(w-10,1)}`;
  else formula421 = `4×10 + 2×10 + 1×${fmt(w-20,1)}`;

  const out = [
    {label:t('rate_421'), val:fmt(rate,1), unit:'ml/h', f:formula421+` = ${fmt(rate,1)} ml/h`, cls:'is-primary'},
    {label:t('deficit_jejum'), val:fmt(deficit,0), unit:'ml', f:`${fmt(rate,1)} × ${fast} h = ${fmt(deficit,0)} ml`},
    {label:t('hour1'), val:fmt(h1,0), unit:'ml', f:`50% × ${fmt(deficit,0)} + ${fmt(rate,1)} = ${fmt(h1,0)} ml`},
    {label:t('hour23'), val:fmt(h23,0), unit:'ml', f:`25% × ${fmt(deficit,0)} + ${fmt(rate,1)} = ${fmt(h23,0)} ml`},
    {label:t('ebv'), val:fmt(ebv,0), unit:'ml', f:`${state.age<14?'80':(state.sex==='m'?'70':'65')} ml/kg × ${fmt(w,1)} kg`},
    {label:t('abl'), val:fmt(abl,0), unit:'ml', f:`${fmt(ebv,0)} × (${hi}-${ht})/${hi} = ${fmt(abl,0)} ml`, cls:'is-warn'}
  ];
  document.getElementById('volResults').innerHTML = out.map(resultCard).join('');
  document.getElementById('volRecommendation').innerHTML = `<div class="alert is-success">${alertSvg('check')}<div><strong>Recomendação</strong>${t('rec_safe')}<br><br><em>${t('rec_transfuse')}</em></div></div>`;
}

// ─────────── Drug catalog ───────────
const DRUGS = [
  {cat:'cat_induction', name:'Propofol (indução)', br:'Diprivan', min:1.5, max:2.5, unit:'mg', wt:'adj', perKg:true},
  {cat:'cat_induction', name:'Propofol TIVA', br:'', min:100, max:200, unit:'mcg', wt:'adj', perKg:true, perMin:true},
  {cat:'cat_induction', name:'Cetamina (indução)', br:'Ketamin', min:1, max:2, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_induction', name:'Cetamina (analgesia)', br:'', min:0.1, max:0.5, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_induction', name:'Etomidato', br:'Hypnomidate', min:0.2, max:0.3, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_induction', name:'Midazolam', br:'Dormonid', min:0.02, max:0.05, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_opioid', name:'Fentanil', br:'Fentanest', min:2, max:5, unit:'mcg', wt:'real', perKg:true},
  {cat:'cat_opioid', name:'Sufentanil', br:'Fastfen', min:0.2, max:0.5, unit:'mcg', wt:'real', perKg:true},
  {cat:'cat_opioid', name:'Alfentanil', br:'Rapifen', min:10, max:25, unit:'mcg', wt:'real', perKg:true},
  {cat:'cat_opioid', name:'Remifentanil (bolus)', br:'Ultiva', min:0.5, max:1, unit:'mcg', wt:'real', perKg:true},
  {cat:'cat_nmb', name:'Rocurônio (intubação)', br:'Esmeron', min:0.6, max:1.2, unit:'mg', wt:'ideal', perKg:true},
  {cat:'cat_nmb', name:'Succinilcolina', br:'Quelicin', min:1, max:1.5, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_nmb', name:'Atracúrio', br:'Tracrium', min:0.4, max:0.5, unit:'mg', wt:'ideal', perKg:true},
  {cat:'cat_nmb', name:'Cisatracúrio', br:'Nimbium', min:0.1, max:0.15, unit:'mg', wt:'ideal', perKg:true},
  {cat:'cat_reversal', name:'Neostigmina', br:'Prostigmine', min:0.04, max:0.07, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_reversal', name:'Sugamadex (moderado)', br:'Bridion', min:2, max:2, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_reversal', name:'Sugamadex (profundo)', br:'Bridion', min:4, max:4, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_reversal', name:'Sugamadex (imediato)', br:'Bridion', min:16, max:16, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_anti', name:'Dexametasona', br:'Decadron', min:4, max:8, unit:'mg', wt:'fixed'},
  {cat:'cat_anti', name:'Ondansetrona', br:'Zofran', min:4, max:8, unit:'mg', wt:'fixed'},
  {cat:'cat_analg', name:'Dipirona', br:'Novalgina', min:15, max:25, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_analg', name:'Cetoprofeno', br:'Profenid', min:100, max:100, unit:'mg', wt:'fixed'},
  {cat:'cat_analg', name:'Tenoxicam', br:'Tilatil', min:20, max:40, unit:'mg', wt:'fixed'},
  {cat:'cat_adjunct', name:'Lidocaína IV', br:'Xylestesin', min:1, max:1.5, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_adjunct', name:'Clonidina', br:'Atensina', min:1, max:2, unit:'mcg', wt:'real', perKg:true},
  {cat:'cat_adjunct', name:'Dexmedetomidina (ataque)', br:'Precedex', min:0.5, max:1, unit:'mcg', wt:'real', perKg:true},
  {cat:'cat_adjunct', name:'Atropina', br:'', min:0.01, max:0.02, unit:'mg', wt:'real', perKg:true},
  {cat:'cat_vaso', name:'Efedrina (bolus)', br:'Efedrin', min:5, max:10, unit:'mg', wt:'fixed'},
  {cat:'cat_vaso', name:'Fenilefrina (bolus)', br:'', min:50, max:100, unit:'mcg', wt:'fixed'},
  {cat:'cat_vaso', name:'Metaraminol (bolus)', br:'', min:0.5, max:2, unit:'mg', wt:'fixed'}
];
function renderDrugs(){
  const w = state.weight, h = state.height, sex = state.sex;
  const wReal = w, wIdeal = idealWeight(h,sex), wAdj = adjWeight(w,h,sex);
  const groups = {};
  DRUGS.forEach(d=>{ (groups[d.cat]=groups[d.cat]||[]).push(d); });
  const html = Object.entries(groups).map(([cat,list])=>{
    const items = list.map(d=>{
      const W = d.wt==='real'?wReal : d.wt==='ideal'?wIdeal : d.wt==='adj'?wAdj : 1;
      let lo, hi, unit, formula, decimals=1;
      if(d.wt==='fixed'){
        lo = d.min; hi = d.max; unit = d.unit + (d.perMin?'/min':'');
        formula = `${t('w_fixed')}`;
      } else {
        lo = d.min*W; hi = d.max*W;
        unit = d.unit + (d.perMin?'/min':'');
        decimals = (unit.startsWith('mcg'))?0:1;
        formula = `${d.min}–${d.max} ${d.unit}/kg${d.perMin?'/min':''} × ${fmt(W,1)} kg (${t('w_'+d.wt)})`;
      }
      const valStr = lo===hi ? fmt(lo,decimals) : `${fmt(lo,decimals)}–${fmt(hi,decimals)}`;
      const copy = `${d.name}: ${valStr} ${unit} (${formula})`;
      return `<div class="drug">
        <button class="copy-btn" data-copy="${escapeAttr(copy)}" aria-label="Copiar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button>
        <div class="drug-name">${d.name}${d.br?` <small>(${d.br})</small>`:''}</div>
        <div class="drug-result"><span class="num">${valStr}</span><span class="unit">${unit}</span></div>
        <div class="drug-meta">${formula}</div>
      </div>`;
    }).join('');
    return `<div class="drug-group"><div class="drug-group-title">${t(cat)}</div><div class="drug-list">${items}</div></div>`;
  }).join('');
  document.getElementById('drugList').innerHTML = html;
  bindCopy(document.getElementById('drugList'));
}

// ─────────── Ventilation ───────────
function renderVentilation(){
  const h = state.height, sex = state.sex, rr = state.rr;
  const pbw = idealWeight(h,sex);
  const vt6=pbw*6, vt7=pbw*7, vt8=pbw*8;
  const mv6=vt6*rr/1000, mv7=vt7*rr/1000, mv8=vt8*rr/1000;
  const out = [
    {label:t('pbw'), val:fmt(pbw,1), unit:'kg', f:`(${sex==='m'?'50':'45.5'} + 0.91 × (${h} − 152.4))`, cls:'is-primary'},
    {label:t('vt_protective'), val:fmt(vt6,0), unit:'ml', f:`6 × ${fmt(pbw,1)} = ${fmt(vt6,0)} ml · MV ${fmt(mv6,1)} L/min`, cls:'is-success'},
    {label:t('vt_inter'), val:fmt(vt7,0), unit:'ml', f:`7 × ${fmt(pbw,1)} = ${fmt(vt7,0)} ml · MV ${fmt(mv7,1)} L/min`},
    {label:t('vt_max'), val:fmt(vt8,0), unit:'ml', f:`8 × ${fmt(pbw,1)} = ${fmt(vt8,0)} ml · MV ${fmt(mv8,1)} L/min`, cls:'is-warn'}
  ];
  document.getElementById('ventResults').innerHTML = out.map(resultCard).join('');

  document.getElementById('ventMaterial').innerHTML = `
    <div class="stack">
      <div class="row"><strong style="width:120px">${t('tot')}:</strong> <span>${sex==='m'?'7.5–8.0':'7.0–7.5'} mm</span></div>
      <div class="row"><strong style="width:120px">${t('blade')}:</strong> <span>Macintosh 3 ${sex==='m'?'ou 4':''}</span></div>
    </div>`;
  document.getElementById('ventTargets').innerHTML = `
    <div class="grid-2" style="gap:8px">
      <div class="alert is-success"><div><strong>${t('target_pplato')}</strong>< 30 cmH₂O</div></div>
      <div class="alert is-success"><div><strong>${t('target_dp')}</strong>< 15 cmH₂O</div></div>
      <div class="alert is-success"><div><strong>${t('target_spo2')}</strong>> 94%</div></div>
      <div class="alert is-success"><div><strong>${t('target_etco2')}</strong>35–45 mmHg</div></div>
      <div class="alert is-success"><div><strong>${t('target_peep')}</strong>≥ 5 cmH₂O · FiO₂ atual ${state.fio2}%</div></div>
    </div>`;
}

// ─────────── Pediatrics ───────────
function renderPediatrics(){
  const age = Math.max(0,state.age||0);
  const realW = state.weight;
  const estW = age>=10 ? realW : (age+4)*2;
  const w = realW || estW;
  const ebv = age<1 ? 85*w : (age<3 ? 80*w : 75*w);
  const maint = rate421(w);
  const totU = (age/4)+4, totC = (age/4)+3.5;
  const fix = totU*3;
  const blade = age<2?'Miller 1':age<6?'Macintosh 2':age<12?'Macintosh 2–3':'Macintosh 3';

  document.getElementById('pedSummary').innerHTML = `
    <div class="badges" style="margin:0;border:0;padding:0">
      <span class="badge b-info">${t('age_label')}: ${age} ${age===1?'ano':'anos'}</span>
      <span class="badge b-info">${t('est_weight')}: ${fmt(estW,1)} kg</span>
      ${realW?`<span class="badge">Peso real: ${fmt(realW,1)} kg</span>`:''}
    </div>`;

  const out = [
    {label:t('ebv'), val:fmt(ebv,0), unit:'ml', f:`${age<1?85:age<3?80:75} ml/kg × ${fmt(w,1)} kg`, cls:'is-primary'},
    {label:t('maint_iv'), val:fmt(maint,1), unit:'ml/h', f:'Regra 4-2-1'},
    {label:t('tot_uncuffed'), val:fmt(totU,1), unit:'mm', f:`(${age}/4) + 4`},
    {label:t('tot_cuffed'), val:fmt(totC,1), unit:'mm', f:`(${age}/4) + 3.5`},
    {label:t('fixation'), val:fmt(fix,1), unit:'cm', f:`Ø TOT × 3`},
    {label:t('blade'), val:blade, unit:'', f:`Idade ${age} anos`}
  ];
  document.getElementById('pedResults').innerHTML = out.map(resultCard).join('');

  // Emergency
  const adr = w*0.01, adrMl = w*0.1;
  const atrop = Math.max(0.1, Math.min(0.5, w*0.02));
  const amio = w*5;
  const desf = w*2;
  const glic = w*0.5;
  document.getElementById('pedEmerg').innerHTML = `
    <div class="stack" style="gap:6px">
      <div class="dose-row"><span><strong>Adrenalina PCR</strong> · 10 mcg/kg</span><span style="font-family:var(--font-mono);font-weight:700;color:var(--accent-danger)">${fmt(adr,2)} mg <small style="font-weight:400">(${fmt(adrMl,1)} ml 1:10.000)</small></span></div>
      <div class="dose-row"><span><strong>Atropina</strong> · 0.02 mg/kg (mín 0.1 / máx 0.5)</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(atrop,2)} mg</span></div>
      <div class="dose-row"><span><strong>Amiodarona</strong> · 5 mg/kg</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(amio,1)} mg</span></div>
      <div class="dose-row"><span><strong>Desfibrilação</strong> · 2 J/kg → 4 J/kg</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(desf,0)} J → ${fmt(desf*2,0)} J</span></div>
      <div class="dose-row"><span><strong>Glicose</strong> · SG 10% 5 ml/kg (0.5 g/kg)</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(glic,1)} g · ${fmt(w*5,0)} ml SG10%</span></div>
    </div>`;

  // Routine
  const routine = [
    {n:'Propofol', min:2, max:3, u:'mg'},
    {n:'Cetamina', min:1, max:2, u:'mg'},
    {n:'Succinilcolina', min:age<5?2:1.5, max:age<5?2:1.5, u:'mg'},
    {n:'Rocurônio', min:0.6, max:1.2, u:'mg'},
    {n:'Fentanil', min:1, max:3, u:'mcg'},
    {n:'Lidocaína (máx s/ epi)', min:4.5, max:4.5, u:'mg'}
  ];
  document.getElementById('pedRoutine').innerHTML = `<div class="drug-list">${routine.map(d=>{
    const lo=d.min*w, hi=d.max*w, dec=d.u==='mcg'?0:1;
    const v = lo===hi?fmt(lo,dec):`${fmt(lo,dec)}–${fmt(hi,dec)}`;
    return `<div class="drug"><div class="drug-name">${d.n}</div><div class="drug-result"><span class="num">${v}</span><span class="unit">${d.u}</span></div><div class="drug-meta">${d.min}${d.min===d.max?'':'–'+d.max} ${d.u}/kg × ${fmt(w,1)} kg</div></div>`;
  }).join('')}</div>`;
}

// ─────────── Pump ───────────
const PUMP_PRESETS = [
  {id:'noradr', name:'Noradrenalina', dilution:'4 amp (4mg) + 234 ml SG5% → 250 ml', conc:64, dose:0.05, unit:'mcg/kg/min'},
  {id:'dopa', name:'Dopamina', dilution:'5 amp (50mg) + 200 ml SG5% → 250 ml', conc:1000, dose:5, unit:'mcg/kg/min'},
  {id:'dobu', name:'Dobutamina', dilution:'1 amp (250mg) + 230 ml SG5% → 250 ml', conc:1000, dose:5, unit:'mcg/kg/min'},
  {id:'remi', name:'Remifentanil', dilution:'5 mg + 100 ml SF → 50 mcg/ml', conc:50, dose:0.1, unit:'mcg/kg/min'},
  {id:'dexm', name:'Dexmedetomidina', dilution:'200 mcg + 48 ml SF → 4 mcg/ml', conc:4, dose:0.4, unit:'mcg/kg/h'},
  {id:'prop', name:'Propofol TIVA', dilution:'Propofol 1% (10 mg/ml)', conc:10000, dose:100, unit:'mcg/kg/min'},
  {id:'keta', name:'Cetamina infusão', dilution:'500 mg + 500 ml SF → 1 mg/ml', conc:1000, dose:0.1, unit:'mg/kg/h'},
  {id:'lido', name:'Lidocaína infusão', dilution:'1 g + 250 ml SF → 4 mg/ml', conc:4000, dose:1, unit:'mg/kg/h'},
  {id:'nipri', name:'Nitroprussiato', dilution:'1 amp (50mg) + 248 ml SG5%', conc:200, dose:0.5, unit:'mcg/kg/min'}
];
function fillPumpDropdown(){
  const sel = document.getElementById('pumpDrug');
  sel.innerHTML = PUMP_PRESETS.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  sel.value = state.pumpDrug;
}
function applyPumpPreset(id){
  const p = PUMP_PRESETS.find(x=>x.id===id);
  if(!p) return;
  state.pumpDrug = id;
  state.pumpDose = p.dose;
  state.pumpUnit = p.unit;
  state.pumpConc = p.conc;
  document.getElementById('pumpDose').value = p.dose;
  document.getElementById('pumpUnit').value = p.unit;
  document.getElementById('pumpConc').value = p.conc;
}
function renderPump(){
  const w = state.weight, dose = +state.pumpDose, unit = state.pumpUnit, conc = +state.pumpConc;
  const preset = PUMP_PRESETS.find(p=>p.id===state.pumpDrug);
  let mcgmin;
  switch(unit){
    case 'mcg/kg/min': mcgmin = dose*w; break;
    case 'mcg/kg/h': mcgmin = dose*w/60; break;
    case 'mg/kg/h': mcgmin = dose*w*1000/60; break;
    case 'mcg/min': mcgmin = dose; break;
    case 'mg/h': mcgmin = dose*1000/60; break;
  }
  const mlh = conc>0 ? mcgmin*60/conc : 0;
  const mgh = mcgmin*60/1000;
  const mg24 = mgh*24;

  document.getElementById('pumpDilution').innerHTML = preset
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><div><strong>${t('dilution_recipe')}:</strong> ${preset.dilution}</div>` : '';

  const cmd = `${preset?preset.name:'—'} ${dose} ${unit} → ${fmt(mlh,1)} ml/h (${conc} mcg/ml)`;
  const out = [
    {label:t('pump_rate'), val:fmt(mlh,1), unit:'ml/h', f:`(${fmt(mcgmin,2)} mcg/min × 60) ÷ ${conc} mcg/ml`, cls:'is-primary'},
    {label:t('pump_mcgmin'), val:fmt(mcgmin,2), unit:'mcg/min', f:'Conversão padronizada'},
    {label:t('pump_mgh'), val:fmt(mgh,2), unit:'mg/h', f:`mcg/min × 60 ÷ 1000`},
    {label:t('pump_24h'), val:fmt(mg24,1), unit:'mg/24h', f:`mg/h × 24`}
  ];
  document.getElementById('pumpResults').innerHTML = out.map(resultCard).join('');

  // Alerts
  const alerts = [];
  if(mlh > 150) alerts.push({lvl:'is-danger', msg:t('pump_vhigh')});
  else if(mlh > 80) alerts.push({lvl:'is-warn', msg:t('pump_high')});
  if(state.pumpDrug==='noradr' && unit==='mcg/kg/min' && dose>1)
    alerts.push({lvl:'is-danger', msg:t('pump_nora_high')});
  document.getElementById('pumpAlerts').innerHTML = alerts.map(a=>
    `<div class="alert ${a.lvl}">${alertSvg(a.lvl==='is-danger'?'alert':'warn')}<div><strong>⚠</strong>${a.msg}</div></div>`
  ).join('');
}

// ─────────── Techniques (static reference) ───────────
const TECH = [
  {title:'Raquianestesia (Bloqueio Subaracnóideo)', body:`
    <p><strong>Bupivacaína 0.5% hiperbárica</strong></p>
    <ul><li>T10: 10–12.5 mg</li><li>T6: 12.5–15 mg</li><li>L1–L2: 7.5–10 mg</li></ul>
    <p><strong>Ropivacaína 0.5% isobárica</strong> · indicação para cirurgia de membros inferiores e abdome inferior.</p>
    <p><strong>Lidocaína 5% hiperbárica</strong> · duração 45–60 min; risco de TNS.</p>
    <p><strong>Adjuvantes intratecais</strong></p>
    <ul>
      <li>Fentanil 10–25 mcg · início rápido, duração 2–4 h</li>
      <li>Morfina 80–100 mcg · analgesia 18–24 h, risco de prurido e depressão respiratória tardia</li>
      <li>Dexmedetomidina 5–10 mcg · prolonga bloqueio motor e sensitivo</li>
      <li>Clonidina 30–75 mcg · sinergia analgésica, hipotensão</li>
    </ul>`},
  {title:'Raquianestesia + Sedação', body:`
    <ul>
      <li><strong>Propofol</strong> infusão contínua, alvo Ramsay 2–3, Ce 1–2 mcg/ml</li>
      <li><strong>Dexmedetomidina</strong>: ataque 0.5–1 mcg/kg em 10 min + manutenção 0.2–0.7 mcg/kg/h</li>
      <li><strong>Midazolam</strong> titulado: 0.5–1 mg a cada 2–3 min (início 2–3 min)</li>
    </ul>`},
  {title:'Anestesia Geral — Sequência de Indução', body:`
    <ul>
      <li><strong>Pré-oxigenação</strong> · 3–5 min FiO₂ 100% ou 8 capacidades vitais</li>
      <li><strong>Pré-medicação</strong> · Midazolam 1–2 mg + Fentanil 50–100 mcg ou Sufentanil 5–10 mcg</li>
      <li><strong>Indução</strong> · Propofol 1.5–2.5 mg/kg <em>ou</em> Etomidato 0.2–0.3 mg/kg (instabilidade) <em>ou</em> Cetamina 1–2 mg/kg (broncoespasmo/choque)</li>
      <li><strong>BNM</strong> · Rocurônio 0.6 mg/kg (normal) ou 1.2 mg/kg (sequência rápida) ou Succinilcolina 1–1.5 mg/kg</li>
      <li><strong>Confirmação</strong> · capnografia, ausculta bilateral, expansão torácica</li>
    </ul>`},
  {title:'Manutenção TIVA', body:`
    <ul>
      <li>Propofol 100–200 mcg/kg/min</li>
      <li>Remifentanil 0.1–0.5 mcg/kg/min</li>
      <li>BIS alvo: 40–60</li>
    </ul>`},
  {title:'Anestesia Geral Balanceada (AG + Inalatória)', body:`
    <ul>
      <li><strong>Sevoflurano</strong> · MAC adulto 2%, MAC awake 0.7%, redução 6%/década após 40 anos</li>
      <li><strong>Desflurano</strong> · MAC 6%, irritante para vias aéreas (não usar para indução inalatória)</li>
      <li><strong>Isoflurano</strong> · MAC 1.15%, menos utilizado</li>
      <li>Todos reduzem MAC com opioide concomitante</li>
    </ul>`},
  {title:'Reversão do BNM', body:`
    <ul>
      <li><strong>Sugamadex</strong>: 2 mg/kg (TOF ≥ 2) · 4 mg/kg (PTC ≥ 1) · 16 mg/kg (imediata pós-rocurônio)</li>
      <li><strong>Neostigmina</strong>: 0.04–0.07 mg/kg + Atropina 0.01–0.02 mg/kg (apenas se TOF ≥ 2)</li>
    </ul>`}
];
function renderTechniques(){
  document.getElementById('techList').innerHTML = TECH.map((it,i)=>`
    <div class="accordion-item ${i===0?'open':''}">
      <button class="accordion-head" type="button">
        <span>${it.title}</span>
        <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="accordion-body">${it.body}</div>
    </div>`).join('');
  document.querySelectorAll('#techList .accordion-head').forEach(b=>{
    b.addEventListener('click', ()=>b.parentElement.classList.toggle('open'));
  });
}

// ─────────── Blocks ───────────
const ANESTH = {
  lido: {name:'Lidocaína', maxNoEpi:4.5, maxEpi:7, capNoEpi:300, capEpi:500},
  bupi: {name:'Bupivacaína', maxNoEpi:2.5, maxEpi:3, capNoEpi:175, capEpi:225},
  ropi: {name:'Ropivacaína', maxNoEpi:3, maxEpi:3.5, capNoEpi:300, capEpi:350},
  levo: {name:'Levobupivacaína', maxNoEpi:2.5, maxEpi:3, capNoEpi:175, capEpi:225}
};
const BLOCKS = [
  {id:'epidural_lumbar', name:'Peridural lombar', vol:20, conc:0.5},
  {id:'epidural_thoracic', name:'Peridural torácica', vol:12, conc:0.375},
  {id:'brachial_inter', name:'Plexo braquial interescalênico', vol:20, conc:0.5},
  {id:'brachial_supra', name:'Plexo braquial supraclavicular', vol:25, conc:0.5},
  {id:'brachial_infra', name:'Plexo braquial infraclavicular', vol:30, conc:0.5},
  {id:'brachial_axil', name:'Plexo braquial axilar', vol:35, conc:0.5},
  {id:'tap', name:'TAP', vol:25, conc:0.375},
  {id:'ql', name:'Quadrado lombar (QL)', vol:25, conc:0.375},
  {id:'femoral', name:'Femoral', vol:20, conc:0.5},
  {id:'sciatic_pop', name:'Ciático poplíteo', vol:25, conc:0.5},
  {id:'sciatic_sub', name:'Ciático subglúteo', vol:25, conc:0.5},
  {id:'adductor', name:'Canal adutor', vol:18, conc:0.375},
  {id:'pecs', name:'PECS I + II', vol:30, conc:0.375},
  {id:'serratus', name:'Serrátil anterior', vol:25, conc:0.25},
  {id:'esp', name:'Erector spinae (ESP)', vol:25, conc:0.375}
];
function fillBlockDropdown(){
  const sel = document.getElementById('blockType');
  sel.innerHTML = BLOCKS.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
  sel.value = state.blockType;
}
function applyBlockPreset(id){
  const b = BLOCKS.find(x=>x.id===id);
  if(!b) return;
  state.blockType = id;
  state.blockVol = b.vol;
  state.blockConc = b.conc;
  document.getElementById('blockVol').value = b.vol;
  document.getElementById('blockConc').value = b.conc;
}
function blockMaxMg(){
  const a = ANESTH[state.blockAnesth];
  const perKg = state.blockEpi ? a.maxEpi : a.maxNoEpi;
  const cap = state.blockEpi ? a.capEpi : a.capNoEpi;
  return Math.min(perKg*state.weight, cap);
}
function renderBlocks(){
  // current dose (volume × concentration% × 10 → mg)
  const curMg = state.blockVol * state.blockConc * 10;
  const accum = state.registeredDoses.filter(d=>d.anesth===state.blockAnesth).reduce((s,d)=>s+d.mg,0);
  const max = blockMaxMg();
  const total = accum + curMg;
  const pct = max>0 ? (total/max)*100 : 0;
  let toneCls = '', warn = '';
  if(pct >= 90){ toneCls='danger'; warn = `<div class="alert is-danger" style="margin-top:8px">${alertSvg('alert')}<div><strong>⚠</strong>${t('over_90')}</div></div>`; }
  else if(pct >= 75){ toneCls='warn'; warn = `<div class="alert is-warn" style="margin-top:8px">${alertSvg('warn')}<div><strong>⚠</strong>${t('over_75')}</div></div>`; }

  const a = ANESTH[state.blockAnesth];
  const list = state.registeredDoses.length===0
    ? `<div class="small muted" style="text-align:center;padding:10px 0">${t('no_doses')}</div>`
    : state.registeredDoses.map((d,i)=>`
        <div class="dose-row">
          <span><strong>${ANESTH[d.anesth].name}</strong> · ${d.block} · ${fmt(d.vol,1)} ml × ${d.conc}% = <strong>${fmt(d.mg,1)} mg</strong></span>
          <button data-rm="${i}" aria-label="Remover">×</button>
        </div>`).join('');

  document.getElementById('blockTracker').innerHTML = `
    <div class="row" style="justify-content:space-between;font-size:13px;margin-bottom:6px">
      <span><strong>${a.name}</strong> · ${state.blockEpi?'+ epi':'sem epi'}</span>
      <span style="font-family:var(--font-mono)">${fmt(total,1)} / ${fmt(max,0)} mg <span class="muted">(${fmt(pct,0)}%)</span></span>
    </div>
    <div class="progress-track"><div class="progress-fill ${toneCls}" style="width:${Math.min(100,pct)}%"></div></div>
    <div class="small muted" style="margin-top:8px">Bloqueio atual: <strong>${fmt(curMg,1)} mg</strong> (${fmt(state.blockVol,1)} ml × ${state.blockConc}% × 10)</div>
    ${warn}
    <hr class="sep">
    ${list}`;
  document.querySelectorAll('#blockTracker [data-rm]').forEach(b=>{
    b.addEventListener('click', ()=>{
      state.registeredDoses.splice(+b.dataset.rm,1);
      saveState(); renderBlocks();
    });
  });

  // LAST card
  const w = state.weight;
  const bolus = w*1.5, inf = w*0.25, mx = w*12;
  document.getElementById('lastBox').innerHTML = `
    <div class="small">${t('last_text')}</div>
    <div class="stack" style="margin-top:8px;gap:6px">
      <div class="dose-row"><span><strong>${t('last_bolus')}</strong> · 1.5 ml/kg em 1 min</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(bolus,1)} ml</span></div>
      <div class="dose-row"><span><strong>${t('last_infusion')}</strong> · 0.25 ml/kg/min</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(inf,1)} ml/min</span></div>
      <div class="dose-row"><span><strong>${t('last_max')}</strong> · 12 ml/kg</span><span style="font-family:var(--font-mono);font-weight:700">${fmt(mx,0)} ml</span></div>
    </div>`;
}

// ─────────── Result card helper ───────────
function resultCard(o){
  const copyText = `${o.label}: ${o.val}${o.unit?' '+o.unit:''} (${o.f||''})`;
  return `<div class="result ${o.cls||''}">
    <button class="copy-btn" data-copy="${escapeAttr(copyText)}" aria-label="Copiar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button>
    <div class="result-label">${o.label}</div>
    <div class="result-value"><span class="result-number">${o.val}</span>${o.unit?`<span class="result-unit">${o.unit}</span>`:''}</div>
    ${o.f?`<div class="result-formula">${o.f}</div>`:''}
  </div>`;
}
function escapeAttr(s){ return String(s).replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function alertSvg(kind){
  const path = kind==='alert'
    ? '<path d="M10.3 3.86l-7.28 13a2 2 0 0 0 1.74 3h14.56a2 2 0 0 0 1.74-3l-7.28-13a2 2 0 0 0-3.48 0z"/><path d="M12 9v4M12 17h.01"/>'
    : kind==='check' ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>'
    : '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

// ─────────── Copy ───────────
function bindCopy(root){
  root.querySelectorAll('.copy-btn').forEach(b=>{
    b.addEventListener('click', async ()=>{
      const text = b.getAttribute('data-copy');
      try { await navigator.clipboard.writeText(text); }
      catch(e){
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try{ document.execCommand('copy'); }catch{}
        ta.remove();
      }
      b.classList.add('copied');
      const orig = b.innerHTML;
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-9"/></svg>';
      showToast(t('copied'));
      setTimeout(()=>{ b.classList.remove('copied'); b.innerHTML = orig; }, 1500);
    });
  });
}
function showToast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>el.classList.remove('show'), 1800);
}

// ─────────── Surgical timer ───────────
const TIMER_EVENTS = ['ev_start','ev_induction','ev_intub','ev_incision','ev_endsurg','ev_extub','ev_endcase'];
function timerNow(){
  if(!state.timer.running) return state.timer.accum;
  return state.timer.accum + (Date.now() - state.timer.startedAt);
}
function fmtMs(ms){
  const s = Math.floor(ms/1000);
  const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), ss = s%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
}
function renderTimerStatic(){
  document.getElementById('timerEvents').innerHTML = TIMER_EVENTS.map(k=>{
    const fired = state.timer.events.find(e=>e.k===k);
    return `<button data-ev="${k}" ${fired?'disabled':''}><span class="dot"></span>${t(k)}${fired?' ✓':''}</button>`;
  }).join('');
  document.querySelectorAll('#timerEvents [data-ev]').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(!state.timer.running && state.timer.accum===0){ toggleTimer(); }
      state.timer.events.push({k:b.dataset.ev, ms:timerNow(), at:Date.now()});
      saveState(); renderTimerStatic(); renderTimerLog();
    });
  });
}
function renderTimerLog(){
  document.getElementById('timerLog').innerHTML = state.timer.events.map(e=>
    `<div class="timer-log-row"><span class="ev">${t(e.k)}</span><span class="ts">${fmtMs(e.ms)}</span></div>`
  ).reverse().slice(0,8).join('');
}
function tickTimer(){
  document.getElementById('timerClock').textContent = fmtMs(timerNow());
}
function toggleTimer(){
  if(state.timer.running){
    state.timer.accum += Date.now() - state.timer.startedAt;
    state.timer.running = false; state.timer.startedAt = null;
  } else {
    state.timer.running = true; state.timer.startedAt = Date.now();
  }
  document.getElementById('timerToggle').querySelector('span').textContent = state.timer.running ? t('pause') : t('start');
  document.getElementById('timerState').textContent = state.timer.running ? t('timer_running') : (state.timer.accum>0 ? t('timer_paused') : t('timer_idle'));
  document.getElementById('timerClock').classList.toggle('running', state.timer.running);
  saveState();
}
function resetTimer(){
  state.timer = { running:false, startedAt:null, accum:0, events:[] };
  document.getElementById('timerClock').textContent = '00:00:00';
  document.getElementById('timerClock').classList.remove('running');
  document.getElementById('timerState').textContent = t('timer_idle');
  document.getElementById('timerToggle').querySelector('span').textContent = t('start');
  renderTimerStatic(); renderTimerLog(); saveState();
}

// ─────────── Emergency overlay ───────────
let pcrInterval = null, pcrSecs = 0, pcrRunning = false;
function buildEmergencyContent(){
  const w = state.weight;
  const isPed = state.age < 18;
  const epPCR = isPed ? `${fmt(w*0.01,2)} mg (${fmt(w*0.1,1)} ml 1:10.000)` : '1 mg IV';
  const adIM  = isPed ? `${fmt(w*0.01,2)} mg IM` : '0.3–0.5 mg IM';
  const cards = [
    {key:'er_pcr', open:true, body:`
      <div class="er-dose crit"><span class="er-label">Adrenalina (3–5 min)</span><span class="er-val">${epPCR}</span></div>
      <div class="er-dose"><span class="er-label">Amiodarona — 1ª/2ª</span><span class="er-val">${isPed?fmt(w*5,1)+' / '+fmt(w*5,1)+' mg':'300 / 150 mg'}</span></div>
      <div class="er-dose"><span class="er-label">Desfibrilação</span><span class="er-val">${isPed?fmt(w*2,0)+' J → '+fmt(w*4,0)+' J':'200 J bifásico'}</span></div>
      <div class="er-pcr-timer">
        <div>
          <div class="clk" id="pcrClk">00:00</div>
          <div style="font-size:11px;color:rgba(255,255,255,.6);text-transform:uppercase;letter-spacing:.05em" data-i18n="pcr_label">${t('pcr_label')}</div>
        </div>
        <button id="pcrBtn" type="button">${t('pcr_start')}</button>
      </div>`},
    {key:'er_anaph', body:`
      <div class="er-dose crit"><span class="er-label">Adrenalina IM</span><span class="er-val">${adIM}</span></div>
      <div class="er-dose"><span class="er-label">Adrenalina IV (titulada)</span><span class="er-val">10–100 mcg bolus</span></div>
      <div class="er-dose"><span class="er-label">SF 0.9% bolus</span><span class="er-val">${fmt(w*20,0)} ml (20 ml/kg)</span></div>
      <div class="er-dose"><span class="er-label">Hidrocortisona</span><span class="er-val">200 mg IV</span></div>
      <div class="er-dose"><span class="er-label">Difenidramina</span><span class="er-val">50 mg IV</span></div>
      <div class="er-dose"><span class="er-label">Ranitidina</span><span class="er-val">50 mg IV</span></div>
      <div class="er-dose"><span class="er-label">Salbutamol NBZ</span><span class="er-val">2.5–5 mg</span></div>`},
    {key:'er_mh', body:`
      <div class="er-note"><strong>${t('er_no_halog')}</strong></div>
      <div class="er-dose crit"><span class="er-label">Dantrolene (até 10 mg/kg)</span><span class="er-val">${fmt(w*2.5,1)} mg</span></div>
      <div class="er-dose"><span class="er-label">Bicarbonato (se pH < 7.2)</span><span class="er-val">${fmt(w*1,0)}–${fmt(w*2,0)} mEq</span></div>
      <div class="er-dose"><span class="er-label">Resfriamento ativo</span><span class="er-val">SF gelado, gelo</span></div>
      <div class="er-dose"><span class="er-label">Monitorar</span><span class="er-val">K⁺, gaso, CK, mioglobina</span></div>`},
    {key:'er_last', body:`
      <div class="er-dose crit"><span class="er-label">Intralipid 20% bolus (1 min)</span><span class="er-val">${fmt(w*1.5,1)} ml</span></div>
      <div class="er-dose"><span class="er-label">Infusão (30–60 min)</span><span class="er-val">${fmt(w*0.25,1)} ml/min</span></div>
      <div class="er-dose"><span class="er-label">Dose máx total</span><span class="er-val">${fmt(w*12,0)} ml</span></div>
      <div class="er-note"><strong>${t('er_avoid_last')}</strong></div>`},
    {key:'er_bronc', body:`
      <div class="er-dose"><span class="er-label">Aprofundar anestesia</span><span class="er-val">Sevo / Propofol / Cetamina</span></div>
      <div class="er-dose"><span class="er-label">Salbutamol</span><span class="er-val">4–8 puffs ou 2.5–5 mg NBZ</span></div>
      <div class="er-dose crit"><span class="er-label">Adrenalina IV titulada</span><span class="er-val">10–100 mcg</span></div>
      <div class="er-dose"><span class="er-label">Sulfato de magnésio</span><span class="er-val">2 g IV em 20 min</span></div>
      <div class="er-dose"><span class="er-label">Aminofilina (refratário)</span><span class="er-val">${fmt(w*5.5,0)} mg em 20 min</span></div>
      <div class="er-dose"><span class="er-label">Hidrocortisona</span><span class="er-val">200 mg IV</span></div>`}
  ];
  document.getElementById('emergencyContent').innerHTML = cards.map((c,i)=>`
    <div class="er-card ${c.open?'open':''}">
      <button class="er-card-head" type="button"><span>${t(c.key)}</span>
        <svg class="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="er-card-body">${c.body}</div>
    </div>`).join('');
  document.querySelectorAll('.er-card-head').forEach(b=>{
    b.addEventListener('click', ()=>b.parentElement.classList.toggle('open'));
  });
  // PCR timer
  const pcrBtn = document.getElementById('pcrBtn');
  if(pcrBtn){
    pcrBtn.addEventListener('click', ()=>{
      pcrRunning = !pcrRunning;
      pcrBtn.textContent = pcrRunning ? t('pcr_stop') : t('pcr_start');
      if(pcrRunning){
        pcrSecs = 0;
        pcrInterval = setInterval(()=>{
          pcrSecs++;
          const clk = document.getElementById('pcrClk');
          if(clk){
            const m = Math.floor(pcrSecs/60), s = pcrSecs%60;
            clk.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            // alert at 3 min
            if(pcrSecs%180===0){ navigator.vibrate?.([200,100,200]); showToast('💉 Adrenalina'); }
          }
        }, 1000);
      } else {
        clearInterval(pcrInterval);
      }
    });
  }
}
function openEmergency(){
  buildEmergencyContent();
  document.getElementById('emergencyOverlay').classList.add('open');
}
function closeEmergency(){
  document.getElementById('emergencyOverlay').classList.remove('open');
  if(pcrInterval){ clearInterval(pcrInterval); pcrRunning=false; pcrSecs=0; }
}

// ─────────── Persistence ───────────
function saveState(){
  try {
    localStorage.setItem('apr_state', JSON.stringify({
      lang, theme: document.documentElement.dataset.theme,
      weight: state.weight, height: state.height, sex: state.sex, age: state.age,
      registeredDoses: state.registeredDoses,
      timer: state.timer
    }));
  } catch {}
}
function loadState(){
  try {
    const s = JSON.parse(localStorage.getItem('apr_state')||'{}');
    if(s.weight) state.weight = s.weight;
    if(s.height) state.height = s.height;
    if(s.sex) state.sex = s.sex;
    if(s.age!=null) state.age = s.age;
    if(s.registeredDoses) state.registeredDoses = s.registeredDoses;
    if(s.timer) state.timer = s.timer;
    if(s.theme) document.documentElement.dataset.theme = s.theme;
  } catch {}
}

// ─────────── Render all ───────────
function renderAll(){
  patientBadges();
  renderVolemia();
  renderDrugs();
  renderVentilation();
  renderPediatrics();
  renderPump();
  renderBlocks();
  bindCopy(document);
}

// ─────────── Init ───────────
function bindNumber(id, key, validate){
  const el = document.getElementById(id);
  if(!el) return;
  el.value = state[key];
  el.addEventListener('input', ()=>{
    const v = parseFloat(el.value);
    const ok = !isNaN(v) && (!validate || validate(v));
    el.classList.toggle('invalid', el.value!=='' && !ok);
    if(ok){ state[key] = v; saveState(); renderAll(); }
  });
}
function bindSegmented(id, cb){
  document.getElementById(id).querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=>{
      b.parentElement.querySelectorAll('button').forEach(x=>x.classList.toggle('active', x===b));
      cb(b.dataset.val);
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadState();
  applyI18n();
  renderTabs();

  // restore patient inputs
  document.getElementById('weight').value = state.weight;
  document.getElementById('height').value = state.height;
  document.getElementById('age').value = state.age;
  document.querySelectorAll('#sexSeg button').forEach(b=>b.classList.toggle('active', b.dataset.val===state.sex));

  // bind numbers
  bindNumber('weight','weight', v=>v>=0.5&&v<=300);
  bindNumber('height','height', v=>v>=30&&v<=250);
  bindNumber('age','age', v=>v>=0&&v<=120);
  bindNumber('fastHrs','fastHrs');
  bindNumber('hctI','hctI'); bindNumber('hctT','hctT');
  bindNumber('rr','rr'); bindNumber('peep','peep'); bindNumber('fio2','fio2');
  bindNumber('pumpDose','pumpDose'); bindNumber('pumpConc','pumpConc');
  bindNumber('blockVol','blockVol'); bindNumber('blockConc','blockConc');

  bindSegmented('sexSeg', v=>{ state.sex=v; saveState(); renderAll(); });
  bindSegmented('epiSeg', v=>{ state.blockEpi=+v; renderBlocks(); });

  document.getElementById('pumpUnit').addEventListener('change', e=>{ state.pumpUnit=e.target.value; renderPump(); });
  fillPumpDropdown();
  document.getElementById('pumpDrug').addEventListener('change', e=>{ applyPumpPreset(e.target.value); renderPump(); });

  document.getElementById('blockAnesth').addEventListener('change', e=>{ state.blockAnesth=e.target.value; renderBlocks(); });
  fillBlockDropdown();
  document.getElementById('blockType').addEventListener('change', e=>{ applyBlockPreset(e.target.value); renderBlocks(); });
  document.getElementById('addDose').addEventListener('click', ()=>{
    const block = BLOCKS.find(b=>b.id===state.blockType);
    state.registeredDoses.push({
      anesth: state.blockAnesth, block: block.name,
      vol: state.blockVol, conc: state.blockConc,
      mg: state.blockVol * state.blockConc * 10
    });
    saveState(); renderBlocks();
    showToast(t('add_dose')+' ✓');
  });
  document.getElementById('clearDoses').addEventListener('click', ()=>{
    if(confirm(t('confirm_clear'))){ state.registeredDoses = []; saveState(); renderBlocks(); }
  });

  // New patient
  document.getElementById('newPatient').addEventListener('click', ()=>{
    if(confirm(t('confirm_new'))){
      state.weight=70; state.height=172; state.sex='m'; state.age=35;
      state.registeredDoses = [];
      ['weight','height','age'].forEach(k=>document.getElementById(k).value=state[k]);
      document.querySelectorAll('#sexSeg button').forEach(b=>b.classList.toggle('active', b.dataset.val==='m'));
      saveState(); renderAll();
    }
  });

  // Theme
  const initTheme = localStorage.getItem('apr_theme') || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.dataset.theme = initTheme;
  document.querySelector('meta[name="theme-color"]').content = initTheme==='dark'?'#0F1117':'#0066CC';
  document.getElementById('themeToggle').addEventListener('click', ()=>{
    const cur = document.documentElement.dataset.theme;
    const next = cur==='dark'?'light':'dark';
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]').content = next==='dark'?'#0F1117':'#0066CC';
    localStorage.setItem('apr_theme', next);
  });

  // Lang
  document.querySelectorAll('.lang-pill button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===lang);
    b.addEventListener('click', ()=>{
      lang = b.dataset.lang;
      localStorage.setItem('apr_lang', lang);
      document.querySelectorAll('.lang-pill button').forEach(x=>x.classList.toggle('active', x===b));
      applyI18n();
      renderAll();
      renderTimerStatic();
      // refresh selects that have JS-rendered text
      const cur = document.querySelector('.tab.active')?.dataset.tab;
      if(cur==='techniques') renderTechniques();
    });
  });

  // Renders
  renderAll();
  renderTechniques();
  renderTimerStatic(); renderTimerLog();
  document.getElementById('timerClock').textContent = fmtMs(timerNow());
  if(state.timer.running) document.getElementById('timerClock').classList.add('running');
  document.getElementById('timerState').textContent = state.timer.running ? t('timer_running') : (state.timer.accum>0 ? t('timer_paused') : t('timer_idle'));
  document.getElementById('timerToggle').querySelector('span').textContent = state.timer.running ? t('pause') : t('start');
  setInterval(tickTimer, 1000);

  document.getElementById('timerToggle').addEventListener('click', toggleTimer);
  document.getElementById('timerReset').addEventListener('click', resetTimer);

  // Emergency
  document.getElementById('fabEmerg').addEventListener('click', openEmergency);
  document.getElementById('closeEmerg').addEventListener('click', closeEmergency);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeEmergency(); });

  // Disclaimer collapse
  const disc = document.getElementById('disclaimer');
  if(localStorage.getItem('apr_disc')==='1') disc.classList.add('collapsed');
  document.getElementById('discToggle').addEventListener('click', ()=>{
    disc.classList.toggle('collapsed');
    localStorage.setItem('apr_disc', disc.classList.contains('collapsed')?'1':'0');
  });

  // PWA install banner
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e)=>{
    e.preventDefault(); deferredPrompt = e;
    if(!localStorage.getItem('apr_install_dismissed')){
      setTimeout(()=>document.getElementById('installBanner').classList.add('show'), 30000);
    }
  });
  document.getElementById('installBtn').addEventListener('click', async ()=>{
    if(deferredPrompt){
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
    }
    document.getElementById('installBanner').classList.remove('show');
  });
  document.getElementById('installDismiss').addEventListener('click', ()=>{
    document.getElementById('installBanner').classList.remove('show');
    localStorage.setItem('apr_install_dismissed','1');
  });

  // Service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
});
