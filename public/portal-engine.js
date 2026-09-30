
/* ============================================================
   SV DIGITAL OPS HUB — single-file app
   Persistence: window.storage (shared=true for org data)
   ============================================================ */

const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
  projects: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/></svg>`,
  team: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6"/><circle cx="17" cy="8" r="2.5"/><path d="M16 14.2c2.9.5 5 2.6 5 5.8"/></svg>`,
  clients: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6"/></svg>`,
  commercials: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><circle cx="7" cy="14.5" r="1"/></svg>`,
  revenue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 20V4M3 20h18"/><path d="M7 16l4-5 3 3 5-7"/></svg>`,
  credentials: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l2.5 2.5M14 9l2 2"/></svg>`,
  pipeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h16M4 12h10M4 18h6"/><circle cx="19" cy="12" r="2"/><circle cx="15" cy="18" r="2"/></svg>`,
  marketing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10v4a1 1 0 0 0 1 1h2l1 4h2l-1-4h1l9 4V6l-9 4H6a1 1 0 0 0-1 1Z"/><path d="M19 9.5a3 3 0 0 1 0 5"/></svg>`,
  maintenance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 1 5.4-5.4L15 12l-3-3 2.7-2.7Z"/></svg>`,
  portfolio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0-1 14a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`,
};

const NAV_ITEMS = [
  {id:'dashboard', label:'Dashboard', icon:'dashboard'},
  {id:'projects', label:'Projects', icon:'projects'},
  {id:'pipeline', label:'Pipeline', icon:'pipeline'},
  {id:'marketing', label:'Marketing Clients', icon:'marketing'},
  {id:'maintenance', label:'Maintenance Clients', icon:'maintenance'},
  {id:'portfolio', label:'Portfolio', icon:'portfolio'},
  {id:'team', label:'Team', icon:'team'},
  {id:'credentials', label:'Credentials', icon:'credentials'},
  {id:'revenue', label:'Revenue', icon:'revenue'},
  {id:'commercials', label:'Commercials', icon:'commercials'},
];

const PHASES = ['Discovery','Planning','Design','Development','QA & Testing','Launch','Support & Maintenance'];

// Standard task template per phase — generic enough for any industry/tech stack.
const PHASE_TASK_TEMPLATES = {
  'Discovery': [
    'Kickoff call with client stakeholders',
    'Gather requirements & existing assets',
    'Define scope, goals, and success metrics',
    'Competitive / benchmark review',
  ],
  'Planning': [
    'Define project timeline & milestones',
    'Confirm team assignments',
    'Finalize sitemap / feature list',
    'Sign-off on scope and commercials',
  ],
  'Design': [
    'Wireframes / low-fidelity concepts',
    'Visual design & brand application',
    'Client design review round 1',
    'Final design sign-off',
  ],
  'Development': [
    'Environment & repo setup',
    'Core build (frontend/backend as applicable)',
    'CMS / integrations / third-party APIs',
    'Internal dev review',
  ],
  'QA & Testing': [
    'Functional QA pass',
    'Cross-device / cross-browser testing',
    'Performance & accessibility check',
    'Bug fixes from QA round',
  ],
  'Launch': [
    'Pre-launch checklist & backups',
    'Deploy to production',
    'Post-launch smoke test',
    'Client walkthrough & handoff',
  ],
  'Support & Maintenance': [
    'Monitor post-launch stability',
    'Address client feedback / tickets',
    'Scheduled maintenance check-in',
  ],
};

let STATE = {
  team: [], projects: [], commercials: [], revenue: [],
  pipeline: [], portfolio: [], marketing: [], maintenance: [],
  currentUser: {name:'SV Digital Team', role:'Admin'},
  activeView: 'dashboard',
  revenuePeriod: 'monthly',
  pwVisible: {},
  search: {},
  filters: {},
  dragTask: null,
  columnVisibility: {},
  revenueTargets: {},
};

function uid(prefix){ return prefix + '_' + Math.random().toString(36).slice(2,9); }

/* ---------------- DEFAULT DATA ---------------- */
function defaultTeam(){
  return [
    {id:uid('tm'), name:'Ritika', title:'Remote Project Manager', email:'ritika@svdigital.ae', projects:['MizMiz Website Revamp','Abu Dhabi Athletics Club']},
    {id:uid('tm'), name:'Shoaib', title:'Project Manager', email:'shoaib@svdigital.ae', projects:['MizMiz Website Revamp']},
    {id:uid('tm'), name:'Jayesh', title:'Developer', email:'jayesh@svdigital.ae', projects:[]},
    {id:uid('tm'), name:'Sonali', title:'UI/UX Designer', email:'sonali@svdigital.ae', projects:['MizMiz Website Revamp','Abu Dhabi Athletics Club']},
    {id:uid('tm'), name:'Vignesh', title:'Developer', email:'vignesh@svdigital.ae', projects:['MizMiz Website Revamp']},
    {id:uid('tm'), name:'Irfan', title:'Senior Developer', email:'irfan@svdigital.ae', projects:['MizMiz Website Revamp','Abu Dhabi Athletics Club']},
    {id:uid('tm'), name:'Sajith', title:'Developer / QA', email:'sajith@svdigital.ae', projects:['Abu Dhabi Athletics Club']},
    {id:uid('tm'), name:'Abdul', title:'Manager', email:'abdul@svdigital.ae', projects:[]},
    {id:uid('tm'), name:'Yousf', title:'Team Member', email:'yousf@svdigital.ae', projects:[]},
  ];
}
function buildPhaseTasks(phase, doneUpTo){
  const template = PHASE_TASK_TEMPLATES[phase] || [];
  return template.map(text=>({id:uid('tk'), text, done:false, owner:'', phase, auto:true}));
}
function defaultProjects(){
  const p1Tasks = [];
  ['Discovery','Planning','Design'].forEach(ph=>{
    PHASE_TASK_TEMPLATES[ph].forEach(t=>p1Tasks.push({id:uid('tk'), text:t, done:true, owner:'', phase:ph, auto:true}));
  });
  PHASE_TASK_TEMPLATES['Development'].forEach((t,i)=>p1Tasks.push({id:uid('tk'), text:t, done:i<2, owner: i===0?'Irfan':i===1?'Sonali':'', phase:'Development', auto:true}));
  p1Tasks.push({id:uid('tk'), text:'Add Arabic RTL support for listings module (change request)', done:false, owner:'Vignesh', phase:'Development', auto:false});

  const p2Tasks = [];
  ['Discovery','Planning'].forEach(ph=>{
    PHASE_TASK_TEMPLATES[ph].forEach(t=>p2Tasks.push({id:uid('tk'), text:t, done:true, owner:'', phase:ph, auto:true}));
  });
  PHASE_TASK_TEMPLATES['Design'].forEach((t,i)=>p2Tasks.push({id:uid('tk'), text:t, done:i<1, owner: i===0?'Sonali':'', phase:'Design', auto:true}));

  return [
    {
      id:uid('pj'), name:'MizMiz Website Revamp',
      client:'Quantum Matrix Technologies Co. LLC', industry:'Real Estate / PropTech', region:'Abu Dhabi, UAE',
      clientContacts:['client-lead@quantummatrix.ae'], techStack:'WordPress, PHP, MySQL, React',
      phase:'Development', status:'On Track', health:'green', delayedBy:'None',
      startDate:'2026-02-02', endDate:'2026-06-05', deliveryDate:'2026-06-05', team:['Shoaib','Irfan','Vignesh','Sonali'],
      tasks:p1Tasks,
      notes:'18-week engagement, currently in the development phase. Client requested added Arabic RTL support for the listings module — scoped as a change request pending sign-off.',
      resources:[
        {id:uid('rs'), label:'Figma design file', url:'https://figma.com/file/mizmiz-revamp'},
        {id:uid('rs'), label:'Content sheet (Google Docs)', url:'https://docs.google.com/mizmiz-content'},
      ],
      credentials:[
        {id:uid('cr'), platform:'WordPress Admin', loginUrl:'https://mizmiz.ae/wp-admin', username:'admin_mizmiz', password:'Mzm!2026Secure', notes:'Live site admin'},
        {id:uid('cr'), platform:'GitHub Repository', loginUrl:'https://github.com/svdigital/mizmiz-revamp', username:'sv-digital-bot', password:'ghp_use2FAkey', notes:'Use 2FA key on request'},
      ],
    },
    {
      id:uid('pj'), name:'Abu Dhabi Athletics Club',
      client:'Abu Dhabi Athletics Club', industry:'Sports & Lifestyle', region:'Abu Dhabi, UAE',
      clientContacts:['admin@adathletics.ae'], techStack:'Webflow, HTML/CSS/JS',
      phase:'Design', status:'At Risk', health:'amber', delayedBy:'Client',
      startDate:'2026-04-14', endDate:'2026-07-30', deliveryDate:'2026-08-10', team:['Irfan','Sonali','Sajith'],
      tasks:p2Tasks,
      notes:'Pending color theme conversion on the source template. Timeline slipping slightly due to late brand asset delivery from the client.',
      resources:[
        {id:uid('rs'), label:'Brand assets (client drive)', url:'https://drive.google.com/adac-brand-assets'},
      ],
      credentials:[
        {id:uid('cr'), platform:'Hosting (cPanel)', loginUrl:'https://cpanel.adathletics.ae:2083', username:'adac_admin', password:'Adac#Host2026', notes:''},
      ],
    },
  ];
}
function defaultCommercials(){
  return [
    {projectId:null, project:'MizMiz Website Revamp', budget:145000, currency:'AED', invoiced:87000, invoiceDate:'2026-03-10', paid:72000, cost:61000, marginPct:58},
    {projectId:null, project:'Abu Dhabi Athletics Club', budget:62000, currency:'AED', invoiced:18000, invoiceDate:'2026-04-20', paid:18000, cost:11000, marginPct:39},
  ];
}
function defaultRevenue(){
  return [
    {
      id:uid('rv'), account:'Quantum Matrix Technologies Co. LLC', project:'MizMiz Website Revamp',
      date:'2026-02-02', currency:'AED', totalValue:145000,
      tiers:[
        {id:uid('tr'), label:'Advance', pct:50, raised:72500, raisedFlag:true, raisedDate:'2026-02-05', status:'Collected', remarks:'Received on kickoff, Feb 2026.'},
        {id:uid('tr'), label:'Mid-delivery', pct:30, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:'Due on development sign-off.'},
        {id:uid('tr'), label:'Final', pct:20, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:'Due on go-live.'},
      ]
    },
    {
      id:uid('rv'), account:'Abu Dhabi Athletics Club', project:'Abu Dhabi Athletics Club',
      date:'2026-04-14', currency:'AED', totalValue:62000,
      tiers:[
        {id:uid('tr'), label:'Advance', pct:50, raised:18000, raisedFlag:true, raisedDate:'2026-04-18', status:'Partial', remarks:'Partial advance received.'},
        {id:uid('tr'), label:'Mid-delivery', pct:30, raised:0, raisedFlag:false, raisedDate:'', status:'Delayed', remarks:'Client delayed sign-off.'},
        {id:uid('tr'), label:'Final', pct:20, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
      ]
    },
  ];
}

function defaultPipeline(){
  return [
    {
      id:uid('pl'), clientName:'Falcon Retail Group', proposalLink:'https://drive.google.com/falcon-proposal',
      liveSite:'', budgetQuoted:38000, industry:'Retail', projectType:'New Website Design',
      mockupShared:true, designUrl:'https://figma.com/file/falcon-mockup',
      status:'Proposal Sent', remarks:'Awaiting feedback from marketing lead.', date:'2026-06-20'
    },
    {
      id:uid('pl'), clientName:'Bluewave Logistics', proposalLink:'https://drive.google.com/bluewave-proposal',
      liveSite:'https://bluewavelogistics.com', budgetQuoted:52000, industry:'Logistics', projectType:'Website Revamp',
      mockupShared:false, designUrl:'',
      status:'In Discussion', remarks:'Client comparing with another agency.', date:'2026-07-02'
    },
  ];
}
function defaultPortfolio(){
  return [
    {
      id:uid('pf'), project:'MizMiz Website Revamp', link:'https://mizmiz.ae', techStack:'WordPress, PHP, React',
      industry:'Real Estate', notes:'Strong case study for CMS + custom listings work.'
    },
    {
      id:uid('pf'), project:'Personal PM Portfolio Site', link:'https://ritika-portfolio.example.com', techStack:'HTML, GSAP, Canvas API',
      industry:'Personal Brand', notes:'Cinematic dark theme, dashboard simulation.'
    },
  ];
}
function defaultMarketing(){
  return [
    {id:uid('mk'), clientName:'Sony World KSA', project:'SEO & SERP Reporting', link:'', status:'Active'},
    {id:uid('mk'), clientName:'JustLogin Singapore', project:'SEO & SERP Reporting', link:'', status:'Active'},
  ];
}
function defaultMaintenance(){
  return [
    {id:uid('mt'), project:'MizMiz Website Revamp', link:'https://mizmiz.ae', status:'Active', reportLink:''},
  ];
}


function normalizeProject(p){
  p.team = Array.isArray(p.team) ? p.team : [];
  p.tasks = Array.isArray(p.tasks) ? p.tasks : [];
  p.resources = Array.isArray(p.resources) ? p.resources : [];
  p.credentials = Array.isArray(p.credentials) ? p.credentials : [];
  p.clientContacts = Array.isArray(p.clientContacts) ? p.clientContacts : [];
  p.files = Array.isArray(p.files) ? p.files : [];
  p.name = p.name || 'Untitled project';
  p.phase = p.phase || (typeof PHASES !== 'undefined' ? PHASES[0] : '');
  p.status = p.status || 'On Track';
  return p;
}

async function loadData(){
  const keys = ['team','projects','commercials','revenue','pipeline','portfolio','marketing','maintenance'];
  const defaults = {team:defaultTeam, projects:defaultProjects, commercials:defaultCommercials, revenue:defaultRevenue,
    pipeline:defaultPipeline, portfolio:defaultPortfolio, marketing:defaultMarketing, maintenance:defaultMaintenance};
  for(const k of keys){
    try{
      const res = await window.storage.get('svops:'+k, true);
      const parsed = res ? JSON.parse(res.value) : null;
      // Guard against malformed/legacy rows coming back from MySQL.
      STATE[k] = Array.isArray(parsed) ? parsed : defaults[k]();
      if(!res || !Array.isArray(parsed)) await saveData(k);
    }catch(e){
      STATE[k] = defaults[k]();
      await saveData(k);
    }
  }
  STATE.projects = STATE.projects.map(normalizeProject);
  try{
    const res = await window.storage.get('svops:revenueTargets', true);
    const parsed = res ? JSON.parse(res.value) : null;
    STATE.revenueTargets = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  }catch(e){ STATE.revenueTargets = {}; }
}

async function saveRevenueTargets(){
  try{ await window.storage.set('svops:revenueTargets', JSON.stringify(STATE.revenueTargets), true); }catch(e){}
}
let SV_OFFLINE_WARNED = false;
async function saveData(key, logInfo){
  try{
    const res = await window.storage.set('svops:'+key, JSON.stringify(STATE[key]), true);
    if(res && res.error){
      if(!SV_OFFLINE_WARNED && typeof svToast==='function'){
        SV_OFFLINE_WARNED = true;
        svToast('Server unreachable — saved locally and will sync on next sign-in.', 'error');
      }
    } else {
      SV_OFFLINE_WARNED = false;
    }
    try {
      if (window.SVApi && typeof window.SVApi.recordActivity === 'function') {
        const action = (logInfo && logInfo.action) || 'save';
        const target = (logInfo && logInfo.target) || key;
        const detail = (logInfo && logInfo.detail) || `Updated ${String(key).replace(/^svops:/, '')}`;
        await window.SVApi.recordActivity(action, target, detail);
      }
    } catch (e) {
      // Intentionally ignore logging failures so saving still succeeds.
    }
    return res;
  }catch(e){
    console.error('save failed', key, e);
    if(typeof svToast==='function') svToast('Could not save ' + key + ': ' + (e && e.message ? e.message : e), 'error');
    throw e;
  }
}

/* ---------------- SIDEBAR / NAV ---------------- */
function renderSidebar(){
  const nav = document.getElementById('sb-nav');
  const RESTRICTED = ['commercials','revenue','credentials'];
  const role = (window.SV_USER && window.SV_USER.role) || 'member';
  const visibleNav = NAV_ITEMS.filter(n=> role==='admin' || !RESTRICTED.includes(n.id));
  nav.innerHTML = visibleNav.map(n=>`
    <div class="sb-item ${STATE.activeView===n.id?'active':''}" onclick="setView('${n.id}')">
      ${ICONS[n.icon]}
      <div class="sb-tooltip">${n.label}</div>
    </div>
  `).join('');
}

const VIEW_META = {
  dashboard: {title:'Dashboard', sub:'Overview across all active engagements'},
  projects: {title:'Projects', sub:'Every engagement, client, phase, and health status'},
  pipeline: {title:'Pipeline', sub:'Proposals sent and prospective projects'},
  marketing: {title:'Marketing Clients', sub:'Ongoing marketing / SEO retainers'},
  maintenance: {title:'Maintenance Clients', sub:'Sites under ongoing maintenance'},
  portfolio: {title:'Portfolio', sub:'Showcase-ready projects and case studies'},
  team: {title:'Team', sub:'People and their project assignments'},
  credentials: {title:'Credentials', sub:'All platform access across every project'},
  revenue: {title:'Revenue', sub:'Accounts, payment tiers, and collection status'},
  commercials: {title:'Commercials', sub:'Budgets, invoicing, and margin'},
};

const RENDERERS = {}; // populated after all render functions are defined

function setView(id){
  const RESTRICTED = ['commercials','revenue','credentials'];
  const role = (window.SV_USER && window.SV_USER.role) || 'member';
  if(RESTRICTED.includes(id) && role!=='admin'){ id = 'dashboard'; }
  STATE.activeView = id;
  document.getElementById('view-title').textContent = VIEW_META[id].title;
  document.getElementById('view-sub').textContent = VIEW_META[id].sub;
  renderSidebar();
  renderModule(id);
}

/* ---------------- SEARCH & FILTER BAR ---------------- */
function searchFilterBar(module, filterDefs, extraHtml){
  filterDefs = filterDefs || [];
  const searchVal = STATE.search[module] || '';
  return `
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap;">
      <div style="position:relative;flex:1;min-width:200px;max-width:320px;">
        <input type="text" placeholder="Search ${module}..." value="${searchVal.replace(/"/g,'&quot;')}"
          oninput="STATE.search['${module}']=this.value; renderModule('${module}');"
          style="width:100%;padding-left:32px;">
        <span style="position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--text-low);pointer-events:none;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        </span>
      </div>
      ${filterDefs.map(f=>`
        <select onchange="STATE.filters['${module}_${f.key}']=this.value; renderModule('${module}');" style="font-size:12px;">
          <option value="">${f.label}: All</option>
          ${f.options.map(o=>`<option value="${o}" ${STATE.filters[module+'_'+f.key]===o?'selected':''}>${o}</option>`).join('')}
        </select>
      `).join('')}
      ${extraHtml||''}
      <button class="btn-ghost" onclick="svExportCsv('${module}')" style="font-size:12px;">⬇ Export CSV</button>
    </div>
  `;
}
function renderModule(id){
  if(RENDERERS[id]) RENDERERS[id]();
}
function matchesSearch(text, module){
  const q = (STATE.search[module]||'').toLowerCase().trim();
  if(!q) return true;
  return String(text).toLowerCase().includes(q);
}

/* ---------------- COLUMN VISIBILITY ---------------- */
function colVisible(module, key){
  if(!STATE.columnVisibility[module]) return true;
  return STATE.columnVisibility[module][key] !== false;
}
function columnsButton(module, columns){
  return `<button class="btn-ghost" onclick="openColumnPicker('${module}', ${JSON.stringify(columns).replace(/"/g,'&quot;')})" style="font-size:12px;">⚙ Columns</button>`;
}
function openColumnPicker(module, columns){
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  if(!STATE.columnVisibility[module]) STATE.columnVisibility[module] = {};
  const vis = STATE.columnVisibility[module];
  modal.innerHTML = `
    <h3>Choose columns to show</h3>
    <div style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;">
      ${columns.map(col=>`
        <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;">
          <input type="checkbox" ${vis[col.key]!==false?'checked':''} onchange="toggleColumn('${module}','${col.key}', this.checked)">
          ${col.label}
        </label>
      `).join('')}
    </div>
    <div class="actions"><button class="btn-primary" onclick="closeFormModal()">Done</button></div>
  `;
  overlay.classList.add('active');
}
function toggleColumn(module, key, checked){
  if(!STATE.columnVisibility[module]) STATE.columnVisibility[module] = {};
  STATE.columnVisibility[module][key] = checked;
  renderModule(module);
}

/* ---------------- CHART HELPERS ---------------- */
function svgBarChart(data, opts={}){
  const width = opts.width||560, height = opts.height||170;
  const max = opts.maxValue || Math.max(...data.map(d=>d.value), 1);
  const chartH = height-30;
  const barWidth = width/data.length;
  const gap = Math.min(barWidth*0.32, 22);
  let bars = data.map((d,i)=>{
    const h = d.value>0 ? Math.max((d.value/max)*chartH, 3) : 0;
    const x = i*barWidth+gap/2;
    const y = chartH-h;
    const w = barWidth-gap;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" style="fill:${d.color||'var(--brass)'}"/>
            <text x="${x+w/2}" y="${chartH+18}" text-anchor="middle" font-size="10" style="fill:var(--text-low);font-family:Inter">${d.label}</text>
            ${opts.showValue!==false ? `<text x="${x+w/2}" y="${y-6}" text-anchor="middle" font-size="10" style="fill:var(--text-mid);font-family:'JetBrains Mono'">${opts.valueFmt?opts.valueFmt(d.value):d.value}</text>`:''}`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="xMidYMid meet">${bars}</svg>`;
}
function svgTargetChart(data, opts={}){
  // data: [{label, raised, target}] — bar colored green if target met, red if not, gray if no target set
  const width = opts.width||560, height=opts.height||190;
  const max = Math.max(...data.map(d=>Math.max(d.raised||0, d.target||0)), 1);
  const chartH = height-32;
  const groupWidth = width/data.length;
  const barW = groupWidth*0.46;
  const bars = data.map((d,i)=>{
    const gx = i*groupWidth;
    const h = d.raised>0 ? Math.max((d.raised/max)*chartH, 3) : 0;
    const x = gx + (groupWidth-barW)/2;
    const hasTarget = d.target && d.target>0;
    const achieved = hasTarget ? d.raised>=d.target : null;
    const color = !hasTarget ? 'var(--brass)' : achieved ? 'var(--green)' : 'var(--red)';
    let targetLine = '';
    if(hasTarget){
      const ty = chartH - (d.target/max)*chartH;
      targetLine = `<line x1="${gx+4}" y1="${ty}" x2="${gx+groupWidth-4}" y2="${ty}" stroke="var(--text-mid)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    }
    return `<rect x="${x}" y="${chartH-h}" width="${barW}" height="${h}" rx="3" style="fill:${color}"/>
            ${targetLine}
            <text x="${gx+groupWidth/2}" y="${chartH+18}" text-anchor="middle" font-size="10" style="fill:var(--text-low);font-family:Inter">${d.label}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="xMidYMid meet">${bars}</svg>`;
}
function svgGroupedBarChart(data, opts={}){
  // data: [{label, a, b}] compares two series (e.g. total vs raised)
  const width = opts.width||560, height=opts.height||180;
  const max = opts.maxValue || Math.max(...data.map(d=>Math.max(d.a,d.b)), 1);
  const chartH = height-32;
  const groupWidth = width/data.length;
  const barW = (groupWidth*0.62)/2;
  const pad = groupWidth*0.19;
  let bars = data.map((d,i)=>{
    const gx = i*groupWidth;
    const ha = d.a>0?Math.max((d.a/max)*chartH,3):0;
    const hb = d.b>0?Math.max((d.b/max)*chartH,3):0;
    const xa = gx+pad;
    const xb = xa+barW+3;
    return `<rect x="${xa}" y="${chartH-ha}" width="${barW}" height="${ha}" rx="2.5" style="fill:var(--brass)"/>
            <rect x="${xb}" y="${chartH-hb}" width="${barW}" height="${hb}" rx="2.5" style="fill:var(--teal)"/>
            <text x="${gx+groupWidth/2}" y="${chartH+18}" text-anchor="middle" font-size="10" style="fill:var(--text-low);font-family:Inter">${d.label}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" preserveAspectRatio="xMidYMid meet">${bars}</svg>`;
}
function svgDonut(segments, opts={}){
  // segments: [{value,color,label}]
  const size = opts.size||150, stroke=opts.stroke||18;
  const r = (size-stroke)/2, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  const total = segments.reduce((s,d)=>s+d.value,0)||1;
  let offset=0;
  const circles = segments.map(seg=>{
    const frac = seg.value/total;
    const dash = frac*circ;
    const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke:${seg.color}" stroke-width="${stroke}" stroke-dasharray="${dash} ${circ-dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
    offset += dash;
    return el;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${circles}<text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="18" font-weight="700" style="fill:var(--text-hi);font-family:Sora">${total}</text></svg>`;
}
function periodKey(dateStr, period){
  const d = dateStr ? new Date(dateStr) : new Date();
  const y = d.getFullYear();
  if(period==='annual') return String(y);
  if(period==='quarterly') return 'Q'+(Math.floor(d.getMonth()/3)+1)+' '+String(y).slice(2);
  return d.toLocaleString('en-US',{month:'short'})+" '"+String(y).slice(2);
}
function revenueAggregates(period){
  const map = {};
  STATE.revenue.forEach(rv=>{
    const key = periodKey(rv.date, period);
    const raised = rv.tiers.reduce((s,t)=>s+Number(t.raised||0),0);
    if(!map[key]) map[key] = {key, total:0, raised:0, sortDate:new Date(rv.date||Date.now())};
    map[key].total += Number(rv.totalValue||0);
    map[key].raised += raised;
  });
  return Object.values(map).sort((a,b)=>a.sortDate-b.sortDate);
}
const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function parseMonthKey(key){
  const m = String(key).match(/^([A-Za-z]{3}) '(\d{2})$/);
  if(!m) return new Date(0);
  const monthIdx = MONTH_ABBR.indexOf(m[1]);
  return new Date(2000+parseInt(m[2],10), monthIdx, 1);
}
function monthKeysForRange(monthsBack, monthsForward){
  const keys = [];
  const now = new Date();
  for(let i=monthsBack; i>=-monthsForward; i--){
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    keys.push(MONTH_ABBR[d.getMonth()]+" '"+String(d.getFullYear()).slice(2));
  }
  return keys;
}
function getMonthlyChartData(){
  // Always include a trailing 6-month window (+1 month ahead for planning), plus any month
  // that already has revenue logged or a target set — so targets always show up, even for
  // months without revenue entries yet.
  const raisedMap = {};
  revenueAggregates('monthly').forEach(a=>{ raisedMap[a.key] = a.raised; });
  const keys = new Set(monthKeysForRange(5,1));
  Object.keys(raisedMap).forEach(k=>keys.add(k));
  Object.keys(STATE.revenueTargets).forEach(k=>keys.add(k));
  return [...keys]
    .map(k=>({key:k, raised:raisedMap[k]||0, target:STATE.revenueTargets[k]||0, sortDate:parseMonthKey(k)}))
    .sort((a,b)=>a.sortDate-b.sortDate);
}


function renderDashboard(){
  const c = document.getElementById('content');
  const activeProjects = STATE.projects.length;
  const atRisk = STATE.projects.filter(p=>p.health!=='green').length;
  const teamCount = STATE.team.length;
  const clientCount = new Set(STATE.projects.map(p=>p.client)).size;

  const healthCounts = {'On Track':0,'At Risk':0,'Delayed':0,'Completed':0};
  STATE.projects.forEach(p=>{ if(healthCounts[p.status]!==undefined) healthCounts[p.status]++; });
  const healthColors = {'On Track':'var(--green)','At Risk':'var(--amber)','Delayed':'var(--red)','Completed':'var(--teal)'};
  const donutSegs = Object.entries(healthCounts).filter(([k,v])=>v>0).map(([k,v])=>({value:v,color:healthColors[k],label:k}));

  const phaseCounts = {};
  PHASES.forEach(ph=>phaseCounts[ph]=0);
  STATE.projects.forEach(p=>{ if(phaseCounts[p.phase]!==undefined) phaseCounts[p.phase]++; });
  const phaseData = PHASES.map(ph=>({label:ph.split(' ')[0], value:phaseCounts[ph], color:'var(--brass)'}));

  const revAgg = revenueAggregates('monthly').slice(-6);

  c.innerHTML = `
    <div class="grid-cards">
      <div class="stat-card" style="cursor:pointer;" onclick="setView('projects')"><div class="num">${activeProjects}</div><div class="label">Active Projects</div></div>
      <div class="stat-card" style="cursor:pointer;" onclick="STATE.filters['projects_status']='At Risk'; setView('projects');"><div class="num" style="color:${atRisk?'var(--amber)':'var(--green)'}">${atRisk}</div><div class="label">Needs Attention</div></div>
      <div class="stat-card" style="cursor:pointer;" onclick="setView('team')"><div class="num">${teamCount}</div><div class="label">Team Members</div></div>
      <div class="stat-card" style="cursor:pointer;" onclick="setView('projects')"><div class="num">${clientCount}</div><div class="label">Client Accounts</div></div>
    </div>

    <div class="section-head"><h2>Portfolio at a Glance</h2></div>
    <div style="display:grid;grid-template-columns:1.1fr 1.3fr 1.6fr;gap:14px;margin-bottom:28px;">
      <div class="panel" style="padding:20px;display:flex;flex-direction:column;align-items:center;cursor:pointer;" onclick="setView('projects')">
        <div style="font-size:12px;color:var(--text-low);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px;align-self:flex-start;">Project Status</div>
        ${donutSegs.length ? svgDonut(donutSegs) : `<div style="color:var(--text-low);font-size:12px;padding:30px 0;">No projects yet</div>`}
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;justify-content:center;">
          ${Object.entries(healthCounts).filter(([k,v])=>v>0).map(([k,v])=>`<span style="font-size:11px;color:var(--text-mid);display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;border-radius:50%;background:${healthColors[k]};display:inline-block;"></span>${k} (${v})</span>`).join('')}
        </div>
      </div>
      <div class="panel" style="padding:20px;cursor:pointer;" onclick="setView('projects')">
        <div style="font-size:12px;color:var(--text-low);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Projects by Phase</div>
        ${svgBarChart(phaseData, {height:170, showValue:true})}
      </div>
      <div class="panel" style="padding:20px;cursor:pointer;" onclick="setView('revenue')">
        <div style="font-size:12px;color:var(--text-low);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;display:flex;justify-content:space-between;">
          <span>Revenue: Total Value vs Raised (last 6 months)</span>
          <span style="display:flex;gap:12px;font-size:10.5px;"><span style="color:var(--brass);">● Total</span><span style="color:var(--teal);">● Raised</span></span>
        </div>
        ${revAgg.length ? svgGroupedBarChart(revAgg.map(r=>({label:r.key, a:r.total, b:r.raised})), {height:170}) : `<div style="color:var(--text-low);font-size:12px;padding:30px 0;">No revenue logged yet</div>`}
      </div>
    </div>

    <div class="section-head"><h2>Project Health</h2></div>
    <div class="panel">
      <table>
        <thead><tr><th>Project</th><th>Client</th><th>Phase</th><th>Status</th><th>Progress</th></tr></thead>
        <tbody>
          ${STATE.projects.map(p=>`
            <tr onclick="openDrilldown('${p.id}')">
              <td class="name-cell">${p.name}</td>
              <td>${p.client}</td>
              <td>${p.phase}</td>
              <td>${statusBadge(p.status, p.health)}</td>
              <td>${phaseTrack(phaseIndexOf(p.phase), PHASES.length)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
function statusBadge(status, health){
  return `<span class="badge ${health}">${status}</span>`;
}
function phaseIndexOf(phase){
  const i = PHASES.indexOf(phase);
  return i<0 ? 0 : i;
}
function phaseTrack(idx, total){
  let segs = '';
  for(let i=0;i<total;i++){
    segs += `<div class="phase-seg ${i<idx?'done':i===idx?'current':''}"></div>`;
  }
  return `<div class="phase-track">${segs}</div>`;
}
function projectPhaseProgress(p){
  // Recompute phase automatically: find the earliest phase (in PHASES order) that isn't fully complete.
  for(const ph of PHASES){
    const phaseTasks = p.tasks.filter(t=>t.phase===ph);
    if(phaseTasks.length===0) continue;
    const allDone = phaseTasks.every(t=>t.done);
    if(!allDone) return ph;
  }
  // if every phase's tasks are done, we're at the last phase with tasks, or Launch if none
  const withTasks = PHASES.filter(ph=>p.tasks.some(t=>t.phase===ph));
  return withTasks.length ? withTasks[withTasks.length-1] : p.phase;
}
function recalcProjectPhase(p){
  const newPhase = projectPhaseProgress(p);
  if(newPhase && newPhase!==p.phase){
    p.phase = newPhase;
  }
}

/* ---------------- PROJECTS (merged with Clients) ---------------- */
function renderProjects(){
  const c = document.getElementById('content');
  const statusFilter = STATE.filters['projects_status']||'';
  const phaseFilter = STATE.filters['projects_phase']||'';
  const industryFilter = STATE.filters['projects_industry']||'';
  const techFilter = STATE.filters['projects_tech']||'';
  const teamFilter = STATE.filters['projects_teammate']||'';
  let list = STATE.projects.filter(p=>{
    const text = `${p.name} ${p.client} ${p.industry||''} ${p.region||''} ${p.techStack||''}`;
    if(!matchesSearch(text, 'projects')) return false;
    if(statusFilter && p.status!==statusFilter) return false;
    if(phaseFilter && p.phase!==phaseFilter) return false;
    if(industryFilter && p.industry!==industryFilter) return false;
    if(techFilter && !(p.techStack||'').toLowerCase().includes(techFilter.toLowerCase())) return false;
    if(teamFilter && !p.team.includes(teamFilter)) return false;
    return true;
  });
  const industries = [...new Set(STATE.projects.map(p=>p.industry).filter(Boolean))];
  const techs = [...new Set(STATE.projects.flatMap(p=>(p.techStack||'').split(',').map(s=>s.trim()).filter(Boolean)))];
  const PCOLS = [
    {key:'client', label:'Client'}, {key:'phase', label:'Phase'}, {key:'status', label:'Status'},
    {key:'delay', label:'Delay Source'}, {key:'delivery', label:'Delivery Date'}, {key:'progress', label:'Progress'}, {key:'team', label:'Team'},
  ];
  const cv = (k)=>colVisible('projects', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>All Projects</h2>
      <button class="btn-primary" onclick="openProjectForm()">+ New Project</button>
    </div>
    ${searchFilterBar('projects', [
      {key:'status', label:'Status', options:['On Track','At Risk','Delayed','Completed']},
      {key:'phase', label:'Phase', options:PHASES},
      {key:'industry', label:'Industry', options:industries},
      {key:'tech', label:'Tech Stack', options:techs},
      {key:'teammate', label:'Teammate', options:STATE.team.map(t=>t.name)},
    ], columnsButton('projects', PCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Project</th>
          ${cv('client')?'<th>Client</th>':''}
          ${cv('phase')?'<th>Phase</th>':''}
          ${cv('status')?'<th>Status</th>':''}
          ${cv('delay')?'<th>Delay Source</th>':''}
          ${cv('delivery')?'<th>Delivery Date</th>':''}
          ${cv('progress')?'<th>Progress</th>':''}
          ${cv('team')?'<th>Team</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(p=>`
            <tr>
              <td class="name-cell" onclick="openDrilldown('${p.id}')">${p.name}</td>
              ${cv('client')?`<td onclick="openDrilldown('${p.id}')">${p.client}</td>`:''}
              ${cv('phase')?`<td onclick="openDrilldown('${p.id}')">${p.phase}</td>`:''}
              ${cv('status')?`<td onclick="openDrilldown('${p.id}')">${statusBadge(p.status, p.health)}</td>`:''}
              ${cv('delay')?`<td onclick="openDrilldown('${p.id}')">${p.status==='On Track'||p.status==='Completed' ? '—' : `<span class="badge ${p.delayedBy==='Client'?'amber':p.delayedBy==='Team'?'red':''}">${p.delayedBy||'None'}</span>`}</td>`:''}
              ${cv('delivery')?`<td onclick="openDrilldown('${p.id}')">${p.deliveryDate||'—'}</td>`:''}
              ${cv('progress')?`<td onclick="openDrilldown('${p.id}')">${phaseTrack(phaseIndexOf(p.phase), PHASES.length)}</td>`:''}
              ${cv('team')?`<td onclick="openDrilldown('${p.id}')">${(p.team||[]).length} people</td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit project" onclick="event.stopPropagation();editProject('${p.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Delete project" onclick="event.stopPropagation();deleteProject('${p.id}')">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="9"><div class="empty-state"><div class="em-title">No projects match</div>Try a different search or filter.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function deleteProject(id){
  if(!confirm('Remove this project? This cannot be undone.')) return;
  const p = STATE.projects.find(x=>x.id===id);
  if(p){
    STATE.team.forEach(tm=>{ tm.projects = tm.projects.filter(pr=>pr!==p.name); });
    saveData('team');
  }
  STATE.projects = STATE.projects.filter(p=>p.id!==id);
  saveData('projects');
  renderProjects();
}
function openProjectForm(){
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  modal.innerHTML = `
    <h3>New Project</h3>
    <div class="login-field"><label>Project name</label><input id="np-name" type="text"></div>
    <div class="login-field"><label>Client name</label><input id="np-client" type="text" placeholder="e.g. Acme Corp"></div>
    <div class="login-field"><label>Industry</label><input id="np-industry" type="text" placeholder="e.g. Real Estate"></div>
    <div class="login-field"><label>Region</label><input id="np-region" type="text" placeholder="e.g. Dubai, UAE"></div>
    <div class="login-field"><label>Tech stack</label><input id="np-tech" type="text" placeholder="e.g. WordPress, React"></div>
    <div class="login-field"><label>Client contact email(s)</label><input id="np-contact" type="text" placeholder="comma-separated emails"></div>
    <div class="login-field"><label>Start date</label><input id="np-start" type="date"></div>
    <div class="login-field"><label>End date</label><input id="np-end" type="date"></div>
    <div class="login-field"><label>Delivery date</label><input id="np-delivery" type="date"></div>
    <div class="actions">
      <button class="btn-ghost" onclick="closeFormModal()">Cancel</button>
      <button class="btn-primary" onclick="submitNewProject()">Create project</button>
    </div>
  `;
  overlay.classList.add('active');
}
function submitNewProject(){
  const name = document.getElementById('np-name').value.trim();
  if(!name){ svToast('Give the project a name.','error'); return; }
  const client = document.getElementById('np-client').value.trim() || 'Unassigned';
  const industry = document.getElementById('np-industry').value.trim();
  const region = document.getElementById('np-region').value.trim();
  const techStack = document.getElementById('np-tech').value.trim();
  const clientContacts = document.getElementById('np-contact').value.trim().split(',').map(s=>s.trim()).filter(Boolean);
  const start = document.getElementById('np-start').value || new Date().toISOString().slice(0,10);
  const end = document.getElementById('np-end').value || '';
  const deliveryDate = document.getElementById('np-delivery').value || '';
  STATE.projects.push({
    id:uid('pj'), name, client, industry, region, techStack, clientContacts,
    phase:'Discovery', status:'On Track', health:'green', delayedBy:'None',
    startDate:start, endDate:end, deliveryDate, team:[],
    tasks: buildPhaseTasks('Discovery'),
    notes:'', resources:[], credentials:[]
  });
  saveData('projects');
  closeFormModal();
  renderProjects();
}
function closeFormModal(){ document.getElementById('form-modal-overlay').classList.remove('active'); }

/* ---------------- DRILLDOWN ---------------- */
function openDrilldown(projectId){
  const p = STATE.projects.find(x=>x.id===projectId);
  if(!p) return;
  if(!p.clientContacts) p.clientContacts = p.clientContact ? [p.clientContact] : [];
  recalcProjectPhase(p);
  const panel = document.getElementById('drilldown-panel');
  const showDelay = p.status==='At Risk' || p.status==='Delayed';
  panel.innerHTML = `
    <div class="dd-head">
      <button class="dd-close" onclick="closeDrilldown()">${ICONS.close}</button>
      <div class="dd-title" contenteditable="true" onblur="updateProjectField('${p.id}','name',this.textContent)">${p.name}</div>
      <div class="dd-client">${p.client}${p.industry?' · '+p.industry:''}${p.region?' · '+p.region:''}</div>
    </div>
    <div class="dd-body">
      <div class="dd-block-title"><span>Client Details</span></div>
      <div class="dd-row">
        <div class="dd-field"><label>Client name</label><input type="text" value="${p.client}" onblur="updateProjectField('${p.id}','client',this.value)"></div>
        <div class="dd-field"><label>Industry</label><input type="text" value="${p.industry||''}" onblur="updateProjectField('${p.id}','industry',this.value)"></div>
        <div class="dd-field"><label>Region</label><input type="text" value="${p.region||''}" onblur="updateProjectField('${p.id}','region',this.value)"></div>
      </div>
      <div class="dd-row">
        <div class="dd-field"><label>Tech stack</label><input type="text" value="${p.techStack||''}" placeholder="e.g. WordPress, React, Node" onblur="updateProjectField('${p.id}','techStack',this.value)"></div>
      </div>
      <div class="dd-block-title" style="margin-top:0;"><span>Client contact email(s)</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
        ${p.clientContacts.map((em,i)=>`<span class="badge teal">${em} <span style="cursor:pointer;margin-left:4px;" onclick="removeClientContact('${p.id}', ${i})">✕</span></span>`).join('') || `<span style="color:var(--text-low);font-size:12.5px;">No contacts added yet.</span>`}
      </div>
      <div style="display:flex;gap:8px;">
        <input type="email" id="new-contact-${p.id}" placeholder="add an email" style="flex:1;" onkeydown="if(event.key==='Enter'){addClientContact('${p.id}', this.value); this.value='';}">
        <button class="btn-ghost" onclick="const el=document.getElementById('new-contact-${p.id}'); addClientContact('${p.id}', el.value); el.value='';">Add</button>
      </div>

      <div class="dd-block-title"><span>Project Status</span></div>
      <div class="dd-row">
        <div class="dd-field"><label>Status</label>
          <select onchange="updateProjectField('${p.id}','status',this.value); syncHealthFromStatus('${p.id}', this.value)">
            <option ${p.status==='On Track'?'selected':''}>On Track</option>
            <option ${p.status==='At Risk'?'selected':''}>At Risk</option>
            <option ${p.status==='Delayed'?'selected':''}>Delayed</option>
            <option ${p.status==='Completed'?'selected':''}>Completed</option>
          </select>
        </div>
        <div class="dd-field"><label>Phase (auto-updates as tasks complete)</label>
          <select onchange="updateProjectField('${p.id}','phase',this.value)">
            ${PHASES.map(ph=>`<option ${p.phase===ph?'selected':''}>${ph}</option>`).join('')}
          </select>
        </div>
        ${showDelay ? `
        <div class="dd-field"><label>Delay caused by</label>
          <select onchange="updateProjectField('${p.id}','delayedBy',this.value)">
            <option ${p.delayedBy==='None'?'selected':''}>None</option>
            <option ${p.delayedBy==='Team'?'selected':''}>Team</option>
            <option ${p.delayedBy==='Client'?'selected':''}>Client</option>
          </select>
        </div>` : ''}
      </div>
      <div class="dd-row">
        <div class="dd-field"><label>Start date</label><input type="date" value="${p.startDate||''}" onblur="updateProjectField('${p.id}','startDate',this.value)"></div>
        <div class="dd-field"><label>End date</label><input type="date" value="${p.endDate||''}" onblur="updateProjectField('${p.id}','endDate',this.value)"></div>
        <div class="dd-field"><label>Delivery date</label><input type="date" value="${p.deliveryDate||''}" onblur="updateProjectField('${p.id}','deliveryDate',this.value)"></div>
      </div>

      ${phaseTrack(phaseIndexOf(p.phase), PHASES.length)}

      <div class="dd-block-title">
        <span>Tasks by Phase · drag ⠿ to reorder within a phase</span>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:10px;">
        <select id="new-task-phase-${p.id}" style="font-size:12px;">
          ${PHASES.map(ph=>`<option ${p.phase===ph?'selected':''}>${ph}</option>`).join('')}
        </select>
        <input type="text" id="new-task-text-${p.id}" placeholder="New task description" style="flex:1;" onkeydown="if(event.key==='Enter'){addTaskToPhase('${p.id}');}">
        <button class="btn-ghost" onclick="addTaskToPhase('${p.id}')">+ Add task</button>
      </div>
      <div id="dd-tasks">
        ${PHASES.map(ph=>{
          const phaseTasks = p.tasks.filter(t=>t.phase===ph);
          if(phaseTasks.length===0) return '';
          return `
            <div style="margin-bottom:14px;">
              <div style="font-size:11.5px;font-weight:600;color:${p.phase===ph?'var(--brass)':'var(--text-mid)'};margin-bottom:4px;">${ph}${p.phase===ph?' · current':''}</div>
              <div data-phase-list="${ph}" ondragover="event.preventDefault()" ondrop="onTaskDrop(event,'${p.id}','${ph}')">
              ${phaseTasks.map(t=>`
                <div class="task-row" draggable="true" data-task-id="${t.id}" ondragstart="onTaskDragStart(event,'${t.id}')">
                  <span style="cursor:grab;color:var(--text-low);font-size:14px;">⠿</span>
                  <input type="checkbox" ${t.done?'checked':''} onchange="toggleTask('${p.id}','${t.id}', this.checked)">
                  <div class="task-text ${t.done?'done':''}" contenteditable="true" onblur="updateTaskText('${p.id}','${t.id}', this.textContent)">${t.text}</div>
                  <select onchange="assignTask('${p.id}','${t.id}', this.value)" style="font-size:11px;padding:3px 8px;border-radius:12px;background:var(--bg-inset);border:1px solid var(--border);">
                    <option value="" ${!t.owner?'selected':''}>Unassigned</option>
                    ${STATE.team.map(tm=>`<option value="${tm.name}" ${t.owner===tm.name?'selected':''}>${tm.name}</option>`).join('')}
                  </select>
                  <button class="icon-btn btn-danger" onclick="deleteTask('${p.id}','${t.id}')">${ICONS.trash}</button>
                </div>
              `).join('')}
              </div>
            </div>
          `;
        }).join('') || `<div style="color:var(--text-low);font-size:12.5px;padding:8px 0;">No tasks logged yet.</div>`}
      </div>

      <div class="dd-block-title"><span>Team</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
        ${p.team.map(t=>`<span class="badge teal">${t} <span style="cursor:pointer;margin-left:4px;" onclick="removeProjectTeamMember('${p.id}','${t.replace(/'/g,"\\'")}')">✕</span></span>`).join('') || `<span style="color:var(--text-low);font-size:12.5px;">Unassigned</span>`}
      </div>
      <select onchange="if(this.value){addProjectTeamMember('${p.id}', this.value); this.value='';}" style="font-size:12px;">
        <option value="">+ Assign team member</option>
        ${STATE.team.filter(tm=>!p.team.includes(tm.name)).map(tm=>`<option value="${tm.name}">${tm.name}</option>`).join('')}
      </select>

      <div class="dd-block-title"><span>Resources · links, files, docs</span></div>
      <div id="dd-resources">
        ${(p.resources||[]).map(r=>`
          <div class="task-row">
            <div class="task-text" contenteditable="true" onblur="updateResourceField('${p.id}','${r.id}','label',this.textContent)" style="flex:0 0 40%;">${r.label}</div>
            <div class="task-text" contenteditable="true" onblur="updateResourceField('${p.id}','${r.id}','url',this.textContent)" style="color:var(--teal);">${r.url}</div>
            <a class="icon-btn" href="${r.url}" target="_blank" rel="noopener" title="Open link">${ICONS.eye}</a>
            <button class="icon-btn" title="Edit resource" onclick="editResource('${p.id}','${r.id}')">${ICONS.edit}</button>
            <button class="icon-btn btn-danger" title="Remove resource" onclick="deleteResource('${p.id}','${r.id}')">${ICONS.trash}</button>
          </div>
        `).join('') || `<div style="color:var(--text-low);font-size:12.5px;padding:4px 0;">No resources added yet.</div>`}
      </div>
      <button class="add-row-btn" onclick="addResource('${p.id}')">+ Add link / file / doc</button>

      <div class="dd-block-title"><span>Attachments &middot; uploaded files (server storage)</span></div>
      <div id="dd-files">
        ${(p.files||[]).map(f=>`
          <div class="task-row">
            <div class="task-text" style="flex:0 0 45%;">${f.name}</div>
            <div style="font-size:11px;color:var(--text-low);flex:0 0 90px;">${(f.size/1024).toFixed(0)} KB</div>
            <a class="task-text" href="${f.url}" target="_blank" rel="noopener" style="color:var(--teal);text-decoration:none;">Download</a>
            <button class="icon-btn btn-danger" onclick="deleteProjectFile('${p.id}','${f.id}')">${ICONS.trash}</button>
          </div>
        `).join('') || `<div style="color:var(--text-low);font-size:12.5px;padding:4px 0;">No files uploaded yet.</div>`}
      </div>
      <label class="add-row-btn" style="display:inline-block;">
        + Upload file
        <input type="file" style="display:none;" onchange="uploadProjectFile('${p.id}', this)">
      </label>
      <div id="dd-upload-status" style="font-size:11.5px;color:var(--text-low);margin-top:6px;"></div>

      <div class="dd-block-title" style="margin-top:26px;"><span>Credentials for this project</span></div>
      <div class="panel" style="margin-bottom:8px;">
        <table>
          <thead><tr><th>Platform</th><th>Login URL</th><th>Username</th><th>Password</th><th>Notes</th><th></th></tr></thead>
          <tbody>
            ${(p.credentials||[]).map(cr=>`
              <tr>
                <td class="name-cell" contenteditable="true" onblur="updateCredField('${p.id}','${cr.id}','platform',this.textContent)">${cr.platform}</td>
                <td contenteditable="true" onblur="updateCredField('${p.id}','${cr.id}','loginUrl',this.textContent)" style="color:var(--teal);">${cr.loginUrl}</td>
                <td contenteditable="true" onblur="updateCredField('${p.id}','${cr.id}','username',this.textContent)" style="font-family:var(--font-mono);">${cr.username}</td>
                <td>
                  <span style="font-family:var(--font-mono);">${STATE.pwVisible[cr.id] ? cr.password : '••••••••'}</span>
                  <button class="icon-btn" style="width:22px;height:22px;" title="Show / hide" onclick="togglePwVisible('${cr.id}'); openDrilldown('${p.id}')">${ICONS.eye}</button>
                  <button class="icon-btn" style="width:22px;height:22px;" title="Copy password" onclick="copyProjectCredential('${p.id}','${cr.id}')">${ICONS.copy}</button>
                </td>
                <td contenteditable="true" onblur="updateCredField('${p.id}','${cr.id}','notes',this.textContent)">${cr.notes||''}</td>
                <td style="white-space:nowrap;">
                  <button class="icon-btn" title="Edit credential" onclick="editProjectCredential('${p.id}','${cr.id}')">${ICONS.edit}</button>
                  <button class="icon-btn btn-danger" title="Remove credential" onclick="deleteCredential('${p.id}','${cr.id}')">${ICONS.trash}</button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="6" style="color:var(--text-low);">No credentials added yet.</td></tr>`}
          </tbody>
        </table>
      </div>
      <button class="add-row-btn" onclick="addCredential('${p.id}')">+ Add credential</button>

      <div class="dd-block-title" style="margin-top:26px;"><span>Notes</span></div>
      <textarea class="notes-area" onblur="updateProjectField('${p.id}','notes',this.value)">${p.notes||''}</textarea>
    </div>
  `;
  document.getElementById('drilldown-overlay').classList.add('active');
}
function addClientContact(pid, email){
  email = (email||'').trim();
  if(!email) return;
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p.clientContacts) p.clientContacts = [];
  p.clientContacts.push(email);
  saveData('projects');
  openDrilldown(pid);
}
function removeClientContact(pid, idx){
  const p = STATE.projects.find(x=>x.id===pid);
  p.clientContacts.splice(idx,1);
  saveData('projects');
  openDrilldown(pid);
}
function addTaskToPhase(pid){
  const p = STATE.projects.find(x=>x.id===pid);
  const phaseSel = document.getElementById('new-task-phase-'+pid);
  const textInput = document.getElementById('new-task-text-'+pid);
  const text = textInput.value.trim();
  if(!text) return;
  p.tasks.push({id:uid('tk'), text, done:false, owner:'', phase:phaseSel.value, auto:false});
  recalcProjectPhase(p);
  saveData('projects');
  openDrilldown(pid);
}
function onTaskDragStart(ev, taskId){
  STATE.dragTask = taskId;
  ev.dataTransfer.effectAllowed = 'move';
}
function onTaskDrop(ev, pid, phase){
  ev.preventDefault();
  const draggedId = STATE.dragTask;
  if(!draggedId) return;
  const p = STATE.projects.find(x=>x.id===pid);
  const dragged = p.tasks.find(t=>t.id===draggedId);
  if(!dragged || dragged.phase!==phase) { STATE.dragTask=null; return; } // only reorder within same phase
  // determine drop target by nearest task row under cursor
  const listEl = ev.currentTarget;
  const rows = [...listEl.querySelectorAll('[data-task-id]')];
  let targetId = null;
  for(const row of rows){
    const rect = row.getBoundingClientRect();
    if(ev.clientY < rect.top + rect.height/2){ targetId = row.getAttribute('data-task-id'); break; }
  }
  const phaseTasks = p.tasks.filter(t=>t.phase===phase);
  const others = p.tasks.filter(t=>t.phase!==phase);
  const withoutDragged = phaseTasks.filter(t=>t.id!==draggedId);
  let insertAt = withoutDragged.length;
  if(targetId){
    insertAt = withoutDragged.findIndex(t=>t.id===targetId);
    if(insertAt<0) insertAt = withoutDragged.length;
  }
  withoutDragged.splice(insertAt, 0, dragged);
  p.tasks = [...others.filter(t=>PHASES.indexOf(t.phase)<PHASES.indexOf(phase)), ...withoutDragged, ...others.filter(t=>PHASES.indexOf(t.phase)>PHASES.indexOf(phase))];
  STATE.dragTask = null;
  saveData('projects');
  openDrilldown(pid);
}
function closeDrilldown(){ document.getElementById('drilldown-overlay').classList.remove('active'); refreshCurrentView(); }
function refreshCurrentView(){ setView(STATE.activeView); }

function updateProjectField(id, field, value, isNumber){
  const p = STATE.projects.find(x=>x.id===id);
  if(!p) return;
  if(field==='name' && value!==p.name){
    const oldName = p.name;
    const newName = value;
    STATE.team.forEach(tm=>{ tm.projects = tm.projects.map(pr=>pr===oldName?newName:pr); });
    saveData('team');
    STATE.revenue.forEach(rv=>{ if(rv.project===oldName) rv.project = newName; });
    saveData('revenue');
    STATE.commercials.forEach(cm=>{ if(cm.project===oldName) cm.project = newName; });
    saveData('commercials');
  }
  p[field] = isNumber ? Number(value) : value;
  saveData('projects');
}
function syncHealthFromStatus(id, status){
  const p = STATE.projects.find(x=>x.id===id);
  if(!p) return;
  p.health = status==='On Track' ? 'green' : status==='Completed' ? 'teal' : status==='At Risk' ? 'amber' : 'red';
  if(status==='On Track' || status==='Completed') p.delayedBy = 'None';
  saveData('projects');
  openDrilldown(id);
}
function addTask(id){
  const p = STATE.projects.find(x=>x.id===id);
  p.tasks.push({id:uid('tk'), text:'New task', done:false, owner:'', phase:p.phase, auto:false});
  saveData('projects');
  openDrilldown(id);
}
function toggleTask(pid, tid, val){
  const p = STATE.projects.find(x=>x.id===pid);
  const t = p.tasks.find(x=>x.id===tid);
  t.done = val;
  recalcProjectPhase(p);
  saveData('projects');
  openDrilldown(pid);
}
function updateTaskText(pid, tid, text){
  const p = STATE.projects.find(x=>x.id===pid);
  const t = p.tasks.find(x=>x.id===tid);
  t.text = text;
  saveData('projects');
}
function assignTask(pid, tid, owner){
  const p = STATE.projects.find(x=>x.id===pid);
  const t = p.tasks.find(x=>x.id===tid);
  t.owner = owner;
  saveData('projects');
}
function deleteTask(pid, tid){
  const p = STATE.projects.find(x=>x.id===pid);
  p.tasks = p.tasks.filter(x=>x.id!==tid);
  recalcProjectPhase(p);
  saveData('projects');
  openDrilldown(pid);
}
function addProjectTeamMember(pid, name){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p.team.includes(name)) p.team.push(name);
  const tm = STATE.team.find(t=>t.name===name);
  if(tm && !tm.projects.includes(p.name)){ tm.projects.push(p.name); saveData('team'); }
  saveData('projects');
  openDrilldown(pid);
}
function removeProjectTeamMember(pid, name){
  const p = STATE.projects.find(x=>x.id===pid);
  p.team = p.team.filter(t=>t!==name);
  const tm = STATE.team.find(t=>t.name===name);
  if(tm){ tm.projects = tm.projects.filter(pr=>pr!==p.name); saveData('team'); }
  saveData('projects');
  openDrilldown(pid);
}
function addResource(pid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p.resources) p.resources = [];
  p.resources.push({id:uid('rs'), label:'New resource', url:'https://'});
  saveData('projects');
  openDrilldown(pid);
}
function updateResourceField(pid, rid, field, value){
  const p = STATE.projects.find(x=>x.id===pid);
  const r = p.resources.find(x=>x.id===rid);
  r[field] = value;
  saveData('projects');
}
function deleteResource(pid, rid){
  const p = STATE.projects.find(x=>x.id===pid);
  p.resources = p.resources.filter(x=>x.id!==rid);
  saveData('projects');
  openDrilldown(pid);
}
function addCredential(pid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p.credentials) p.credentials = [];
  p.credentials.push({id:uid('cr'), platform:'New platform', loginUrl:'', username:'', password:'', notes:''});
  saveData('projects');
  openDrilldown(pid);
}
function updateCredField(pid, cid, field, value){
  const p = STATE.projects.find(x=>x.id===pid);
  const cr = p.credentials.find(x=>x.id===cid);
  cr[field] = value;
  saveData('projects');
}
function deleteCredential(pid, cid){
  const p = STATE.projects.find(x=>x.id===pid);
  p.credentials = p.credentials.filter(x=>x.id!==cid);
  saveData('projects');
  openDrilldown(pid);
}
function togglePwVisible(id){
  STATE.pwVisible[id] = !STATE.pwVisible[id];
}

/* ---------------- TEAM ---------------- */
function renderTeam(){
  const c = document.getElementById('content');
  let list = STATE.team.filter(t=>matchesSearch(`${t.name} ${t.title} ${t.email}`, 'team'));
  const TCOLS = [{key:'title', label:'Title'}, {key:'email', label:'Email'}, {key:'projects', label:'Projects'}];
  const cv = (k)=>colVisible('team', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>Team</h2>
      <button class="btn-primary" onclick="addTeamMember()">+ Add member</button>
    </div>
    ${searchFilterBar('team', [], columnsButton('team', TCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Name</th>
          ${cv('title')?'<th>Title</th>':''}
          ${cv('email')?'<th>Email</th>':''}
          ${cv('projects')?'<th>Projects</th>':''}
          <th></th><th></th>
        </tr></thead>
        <tbody>
          ${list.map(t=>`
            <tr>
              <td class="name-cell" contenteditable="true" onblur="updateTeamField('${t.id}','name',this.textContent)">${t.name}</td>
              ${cv('title')?`<td contenteditable="true" onblur="updateTeamField('${t.id}','title',this.textContent)">${t.title}</td>`:''}
              ${cv('email')?`<td contenteditable="true" onblur="updateTeamField('${t.id}','email',this.textContent)">${t.email}</td>`:''}
              ${cv('projects')?`<td>${t.projects.join(', ') || '—'}</td>`:''}
              <td><button class="icon-btn" title="View" onclick="openTeamDrilldown('${t.id}')">${ICONS.eye}</button></td>
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit member" onclick="editTeamMember('${t.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove member" onclick="deleteTeamMember('${t.id}')">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="6"><div class="empty-state">No matches.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function updateTeamField(id, field, value){
  const t = STATE.team.find(x=>x.id===id);
  t[field] = value;
  saveData('team');
}
function addTeamMember(){
  STATE.team.push({id:uid('tm'), name:'New Team Member', title:'Title', email:'name@svdigital.ae', projects:[]});
  saveData('team');
  renderTeam();
}
function deleteTeamMember(id){
  if(!confirm('Remove this team member?')) return;
  STATE.team = STATE.team.filter(x=>x.id!==id);
  saveData('team');
  renderTeam();
}
function openTeamDrilldown(id){
  const t = STATE.team.find(x=>x.id===id);
  if(!t) return;
  const assignedTasks = [];
  STATE.projects.forEach(p=>{ p.tasks.forEach(tk=>{ if(tk.owner===t.name) assignedTasks.push({...tk, project:p.name, projectId:p.id}); }); });
  const panel = document.getElementById('drilldown-panel');
  panel.innerHTML = `
    <div class="dd-head">
      <button class="dd-close" onclick="closeDrilldown()">${ICONS.close}</button>
      <div class="dd-title" contenteditable="true" onblur="updateTeamField('${t.id}','name',this.textContent)">${t.name}</div>
      <div class="dd-client">${t.title}</div>
    </div>
    <div class="dd-body">
      <div class="dd-row">
        <div class="dd-field"><label>Email</label><input type="text" value="${t.email}" onblur="updateTeamField('${t.id}','email',this.value)"></div>
        <div class="dd-field"><label>Title</label><input type="text" value="${t.title}" onblur="updateTeamField('${t.id}','title',this.value)"></div>
      </div>
      <div class="dd-block-title"><span>Assigned Projects</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
        ${t.projects.map(p=>`<span class="badge teal">${p}</span>`).join('') || `<span style="color:var(--text-low);font-size:12.5px;">None yet</span>`}
      </div>
      <div class="dd-block-title"><span>Tasks Assigned to ${t.name.split(' ')[0]}</span></div>
      ${assignedTasks.length ? assignedTasks.map(tk=>`
        <div class="task-row">
          <input type="checkbox" ${tk.done?'checked':''} onchange="toggleTask('${tk.projectId}','${tk.id}', this.checked); openTeamDrilldown('${t.id}')">
          <div class="task-text ${tk.done?'done':''}">${tk.text}</div>
          <span class="task-owner">${tk.project}</span>
        </div>
      `).join('') : `<div style="color:var(--text-low);font-size:12.5px;padding:8px 0;">No tasks assigned yet.</div>`}
    </div>
  `;
  document.getElementById('drilldown-overlay').classList.add('active');
}

/* ---------------- REVENUE ---------------- */
function tierAmount(total, pct){ return Math.round(total*pct/100); }
function revenueTotals(rv){
  const total = Number(rv.totalValue||0);
  const raised = rv.tiers.reduce((s,t)=>s+Number(t.raised||0),0);
  return {total, raised, pending: total-raised, pct: total? Math.round((raised/total)*100):0};
}
function renderRevenue(){
  const c = document.getElementById('content');
  const period = STATE.revenuePeriod;
  const agg = revenueAggregates(period);
  const grandTotal = STATE.revenue.reduce((s,rv)=>s+Number(rv.totalValue||0),0);
  const grandRaised = STATE.revenue.reduce((s,rv)=>s+revenueTotals(rv).raised,0);
  const grandPending = grandTotal - grandRaised;
  const collectionPct = grandTotal ? Math.round((grandRaised/grandTotal)*100) : 0;

  const statusFilter = STATE.filters['revenue_status']||'';
  let list = STATE.revenue.filter(rv=>{
    if(!matchesSearch(`${rv.account} ${rv.project}`, 'revenue')) return false;
    if(statusFilter){
      const hasStatus = rv.tiers.some(t=>t.status===statusFilter);
      if(!hasStatus) return false;
    }
    return true;
  });

  const RCOLS = [{key:'project', label:'Project'}, {key:'total', label:'Total Value'}, {key:'raised', label:'Raised'}, {key:'pending', label:'Pending'}, {key:'status', label:'Status'}];
  const cv = (k)=>colVisible('revenue', k);

  const aggWithTarget = period==='monthly' ? getMonthlyChartData().map(d=>({label:d.key, raised:d.raised, target:d.target})) : [];

  c.innerHTML = `
    <div class="grid-cards">
      <div class="stat-card"><div class="num">AED ${grandTotal.toLocaleString()}</div><div class="label">Total Contract Value</div></div>
      <div class="stat-card"><div class="num" style="color:var(--green)">AED ${grandRaised.toLocaleString()}</div><div class="label">Total Raised</div></div>
      <div class="stat-card"><div class="num" style="color:var(--amber)">AED ${grandPending.toLocaleString()}</div><div class="label">Pending Collection</div></div>
      <div class="stat-card"><div class="num">${collectionPct}%</div><div class="label">Collection Rate</div></div>
    </div>

    <div class="section-head">
      <h2>Collections by Period</h2>
      <div style="display:flex;gap:6px;">
        ${['monthly','quarterly','annual'].map(p=>`<button class="btn-ghost" style="${STATE.revenuePeriod===p?'background:var(--brass);color:#1A1408;border-color:var(--brass);':''}" onclick="STATE.revenuePeriod='${p}'; renderRevenue();">${p[0].toUpperCase()+p.slice(1)}</button>`).join('')}
        ${period==='monthly' ? `<button class="btn-ghost" onclick="openTargetsForm()">🎯 Set Targets</button>` : ''}
      </div>
    </div>
    <div class="panel" style="padding:20px;margin-bottom:22px;">
      ${period==='monthly'
        ? (aggWithTarget.length ? svgTargetChart(aggWithTarget, {height:190}) : `<div class="empty-state">No revenue logged for this period yet.</div>`)
        : (agg.length ? svgGroupedBarChart(agg.map(a=>({label:a.key, a:a.total, b:a.raised})), {height:190}) : `<div class="empty-state">No revenue logged for this period yet.</div>`)
      }
      <div style="display:flex;gap:16px;margin-top:6px;font-size:11px;color:var(--text-mid);">
        ${period==='monthly'
          ? `<span style="color:var(--green);">● Target met</span><span style="color:var(--red);">● Below target</span><span style="color:var(--brass);">● No target set</span><span>┄ Target line</span>`
          : `<span style="color:var(--brass);">● Total Value</span><span style="color:var(--teal);">● Raised</span>`
        }
      </div>
    </div>

    <div class="section-head">
      <h2>Accounts</h2>
      <button class="btn-primary" onclick="openRevenueForm()">+ Add account</button>
    </div>
    ${searchFilterBar('revenue', [{key:'status', label:'Tier status', options:['Pending','Partial','Collected','Delayed']}], columnsButton('revenue', RCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Account</th>
          ${cv('project')?'<th>Project</th>':''}
          ${cv('total')?'<th>Total Value</th>':''}
          ${cv('raised')?'<th>Raised</th>':''}
          ${cv('pending')?'<th>Pending</th>':''}
          ${cv('status')?'<th>Status</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(rv=>{
            const t = revenueTotals(rv);
            const statusCls = t.pct>=100?'green':t.pct>0?'amber':'red';
            const statusLabel = t.pct>=100?'Fully Collected':t.pct>0?'Partially Collected':'Awaiting Payment';
            return `<tr onclick="openRevenueDrilldown('${rv.id}')">
              <td class="name-cell">${rv.account}</td>
              ${cv('project')?`<td>${rv.project||'—'}</td>`:''}
              ${cv('total')?`<td>AED ${t.total.toLocaleString()}</td>`:''}
              ${cv('raised')?`<td>AED ${t.raised.toLocaleString()}</td>`:''}
              ${cv('pending')?`<td>AED ${t.pending.toLocaleString()}</td>`:''}
              ${cv('status')?`<td><span class="badge ${statusCls}">${statusLabel} · ${t.pct}%</span></td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit account" onclick="event.stopPropagation();editRevenue('${rv.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove account" onclick="event.stopPropagation();deleteRevenue('${rv.id}')">${ICONS.trash}</button>
              </td>
            </tr>`;
          }).join('') || `<tr><td colspan="6"><div class="empty-state"><div class="em-title">No accounts match</div>Adjust your search or filter.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function openTargetsForm(){
  const monthData = getMonthlyChartData();
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  modal.innerHTML = `
    <h3>Monthly Revenue Targets</h3>
    <p style="color:var(--text-low);font-size:12px;margin-bottom:14px;">Set a target for each month. The chart updates live — green means the target was hit, red means it fell short.</p>
    <div style="display:flex;flex-direction:column;gap:10px;max-height:340px;overflow-y:auto;">
      ${monthData.map(a=>`
        <div style="display:flex;align-items:center;gap:10px;">
          <label style="flex:1;font-size:13px;">${a.key}${a.raised?` <span style="color:var(--text-low);font-size:11px;">(AED ${a.raised.toLocaleString()} raised)</span>`:''}</label>
          <input type="number" id="target-input-${a.key.replace(/[^a-zA-Z0-9]/g,'')}" style="width:140px;" placeholder="Target AED" value="${STATE.revenueTargets[a.key]||''}"
            oninput="updateRevenueTarget('${a.key}', this.value)"
            onblur="updateRevenueTarget('${a.key}', this.value)">
        </div>
      `).join('')}
    </div>
    <div class="actions"><button class="btn-primary" onclick="closeFormModal()">Done</button></div>
  `;
  overlay.classList.add('active');
  renderRevenue();
}
function updateRevenueTarget(key, value){
  const num = Number(value)||0;
  if(num<=0){ delete STATE.revenueTargets[key]; } else { STATE.revenueTargets[key] = num; }
  saveRevenueTargets();
  renderRevenue();
}
function openRevenueForm(){
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  modal.innerHTML = `
    <h3>Add Revenue Account</h3>
    <div class="login-field"><label>Account / Client</label>
      <select id="nr-account">${[...new Set(STATE.projects.map(p=>p.client))].map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
    </div>
    <div class="login-field"><label>Linked project</label>
      <select id="nr-project"><option value="">None</option>${STATE.projects.map(p=>`<option value="${p.name}">${p.name}</option>`).join('')}</select>
    </div>
    <div class="login-field"><label>Total contract value (AED)</label><input id="nr-total" type="number" placeholder="e.g. 100000"></div>
    <div class="login-field"><label>Date</label><input id="nr-date" type="date"></div>
    <div class="actions">
      <button class="btn-ghost" onclick="closeFormModal()">Cancel</button>
      <button class="btn-primary" onclick="submitNewRevenue()">Add account</button>
    </div>
  `;
  overlay.classList.add('active');
}
function submitNewRevenue(){
  const account = document.getElementById('nr-account').value;
  if(!account){ svToast('Add a client project first.'); return; }
  const project = document.getElementById('nr-project').value;
  const totalValue = Number(document.getElementById('nr-total').value)||0;
  const date = document.getElementById('nr-date').value || new Date().toISOString().slice(0,10);
  STATE.revenue.push({
    id:uid('rv'), account, project, date, currency:'AED', totalValue,
    tiers:[
      {id:uid('tr'), label:'Advance', pct:50, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
      {id:uid('tr'), label:'Mid-delivery', pct:30, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
      {id:uid('tr'), label:'Final', pct:20, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
    ]
  });
  saveData('revenue');
  closeFormModal();
  renderRevenue();
}
function openRevenueDrilldown(id){
  const rv = STATE.revenue.find(x=>x.id===id);
  if(!rv) return;
  const t = revenueTotals(rv);
  const panel = document.getElementById('drilldown-panel');
  panel.innerHTML = `
    <div class="dd-head">
      <button class="dd-close" onclick="closeDrilldown()">${ICONS.close}</button>
      <div class="dd-title" contenteditable="true" onblur="updateRevenueField('${rv.id}','account',this.textContent)">${rv.account}</div>
      <div class="dd-client">${rv.project||'No project linked'}</div>
    </div>
    <div class="dd-body">
      <div class="dd-row">
        <div class="dd-field"><label>Total contract value (AED)</label>
          <input type="number" value="${rv.totalValue}" onblur="updateRevenueField('${rv.id}','totalValue',Number(this.value)||0, true)">
        </div>
        <div class="dd-field"><label>Date</label>
          <input type="date" value="${rv.date||''}" onblur="updateRevenueField('${rv.id}','date',this.value)">
        </div>
      </div>
      <div class="grid-cards" style="grid-template-columns:repeat(3,1fr);margin-bottom:18px;">
        <div class="stat-card" style="padding:14px;"><div class="num" style="font-size:18px;">AED ${t.total.toLocaleString()}</div><div class="label">Total</div></div>
        <div class="stat-card" style="padding:14px;"><div class="num" style="font-size:18px;color:var(--green)">AED ${t.raised.toLocaleString()}</div><div class="label">Raised (${t.pct}%)</div></div>
        <div class="stat-card" style="padding:14px;"><div class="num" style="font-size:18px;color:var(--amber)">AED ${t.pending.toLocaleString()}</div><div class="label">Pending</div></div>
      </div>

      <div class="dd-block-title">
        <span>Payment Tiers · formula-driven</span>
        <button class="add-row-btn" onclick="addRevenueTier('${rv.id}')">+ Add tier</button>
      </div>
      <div class="panel" style="margin-bottom:16px;">
        <table>
          <thead><tr><th>Tier</th><th>% of Total</th><th>Expected</th><th>Raised?</th><th>Date Raised</th><th>Amount Raised</th><th>Status</th><th>Remarks</th><th></th></tr></thead>
          <tbody>
            ${rv.tiers.map(tier=>{
              const amt = tierAmount(rv.totalValue, tier.pct);
              return `<tr>
                <td class="name-cell" contenteditable="true" onblur="updateTierField('${rv.id}','${tier.id}','label',this.textContent)">${tier.label}</td>
                <td contenteditable="true" onblur="updateTierField('${rv.id}','${tier.id}','pct',this.textContent,true)">${tier.pct}%</td>
                <td style="color:var(--text-hi);font-family:'JetBrains Mono';">AED ${amt.toLocaleString()}</td>
                <td><input type="checkbox" ${tier.raisedFlag?'checked':''} onchange="updateTierRaisedFlag('${rv.id}','${tier.id}', this.checked)"></td>
                <td><input type="date" value="${tier.raisedDate||''}" onchange="updateTierField('${rv.id}','${tier.id}','raisedDate',this.value)" style="font-size:12px;"></td>
                <td contenteditable="true" onblur="updateTierField('${rv.id}','${tier.id}','raised',this.textContent,true)">AED ${Number(tier.raised||0).toLocaleString()}</td>
                <td>
                  <select onchange="updateTierField('${rv.id}','${tier.id}','status',this.value)">
                    ${['Pending','Partial','Collected','Delayed'].map(s=>`<option ${tier.status===s?'selected':''}>${s}</option>`).join('')}
                  </select>
                </td>
                <td contenteditable="true" onblur="updateTierField('${rv.id}','${tier.id}','remarks',this.textContent)">${tier.remarks||''}</td>
                <td style="white-space:nowrap;">
                  <button class="icon-btn" title="Edit tier" onclick="editRevenueTier('${rv.id}','${tier.id}')">${ICONS.edit}</button>
                  <button class="icon-btn btn-danger" title="Remove tier" onclick="deleteRevenueTier('${rv.id}','${tier.id}')">${ICONS.trash}</button>
                </td>
              </tr>`;
            }).join('') || `<tr><td colspan="9" style="color:var(--text-low);">No payment tiers yet — add one to start tracking collections.</td></tr>`}
          </tbody>
        </table>
      </div>
      <div style="color:var(--text-low);font-size:11.5px;">Expected = % of total contract value. Status and "Raised?" are set manually — use them to reflect real collection state (e.g. Delayed even if not yet raised).</div>
    </div>
  `;
  document.getElementById('drilldown-overlay').classList.add('active');
}
function updateRevenueField(id, field, value, isNumber){
  const rv = STATE.revenue.find(x=>x.id===id);
  rv[field] = isNumber ? Number(value) : value;
  saveData('revenue');
  if(field==='totalValue'){
    const com = findCommercialForProject(rv.project);
    if(com){ com.budget = rv.totalValue; saveData('commercials'); }
  }
}
function updateTierField(rvId, tierId, field, value, isNumber){
  const rv = STATE.revenue.find(x=>x.id===rvId);
  const tier = rv.tiers.find(x=>x.id===tierId);
  if(isNumber){
    const num = Number(String(value).replace(/[^0-9.]/g,''));
    tier[field] = isNaN(num) ? 0 : num;
  } else {
    tier[field] = value;
  }
  saveData('revenue');
  openRevenueDrilldown(rvId);
}
function updateTierRaisedFlag(rvId, tierId, checked){
  const rv = STATE.revenue.find(x=>x.id===rvId);
  const tier = rv.tiers.find(x=>x.id===tierId);
  tier.raisedFlag = checked;
  if(checked && !tier.raisedDate) tier.raisedDate = new Date().toISOString().slice(0,10);
  saveData('revenue');
  openRevenueDrilldown(rvId);
}
function addRevenueTier(rvId){
  const rv = STATE.revenue.find(x=>x.id===rvId);
  rv.tiers.push({id:uid('tr'), label:'New Tier', pct:0, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''});
  saveData('revenue');
  openRevenueDrilldown(rvId);
}
function deleteRevenueTier(rvId, tierId){
  const rv = STATE.revenue.find(x=>x.id===rvId);
  rv.tiers = rv.tiers.filter(x=>x.id!==tierId);
  saveData('revenue');
  openRevenueDrilldown(rvId);
}

/* ---------------- COMMERCIALS ---------------- */
function findRevenueForProject(projectName){
  return STATE.revenue.find(r=>r.project===projectName);
}
function findCommercialForProject(projectName){
  return STATE.commercials.find(c=>c.project===projectName);
}
function getSyncedPaidForProject(projectName){
  const rv = findRevenueForProject(projectName);
  return rv ? revenueTotals(rv).raised : 0;
}
function renderCommercials(){
  const c = document.getElementById('content');
  let list = STATE.commercials.filter((row,i)=>matchesSearch(row.project, 'commercials'));
  const COCOLS = [{key:'budget', label:'Budget'}, {key:'invoiced', label:'Invoiced'}, {key:'invoiceDate', label:'Invoice Date'}, {key:'paid', label:'Paid'}, {key:'cost', label:'Cost'}, {key:'margin', label:'Margin'}];
  const cv = (k)=>colVisible('commercials', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>Commercials</h2>
      <button class="btn-primary" onclick="addCommercial()">+ Add record</button>
    </div>
    ${searchFilterBar('commercials', [], columnsButton('commercials', COCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Project</th>
          ${cv('budget')?'<th>Budget</th>':''}
          ${cv('invoiced')?'<th>Invoiced</th>':''}
          ${cv('invoiceDate')?'<th>Invoice Date</th>':''}
          ${cv('paid')?'<th>Paid (synced from Revenue)</th>':''}
          ${cv('cost')?'<th>Cost</th>':''}
          ${cv('margin')?'<th>Margin</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map((row)=>{
            const i = STATE.commercials.indexOf(row);
            const syncedPaid = getSyncedPaidForProject(row.project);
            return `<tr>
              <td class="name-cell">${row.project}</td>
              ${cv('budget')?`<td contenteditable="true" onblur="updateCommercialField(${i},'budget',this.textContent)">${fmtMoney(row.budget, row.currency)}</td>`:''}
              ${cv('invoiced')?`<td contenteditable="true" onblur="updateCommercialField(${i},'invoiced',this.textContent)">${fmtMoney(row.invoiced, row.currency)}</td>`:''}
              ${cv('invoiceDate')?`<td><input type="date" value="${row.invoiceDate||''}" onchange="updateCommercialDate(${i}, this.value)" style="font-size:12.5px;"></td>`:''}
              ${cv('paid')?`<td>${fmtMoney(syncedPaid, row.currency)}</td>`:''}
              ${cv('cost')?`<td contenteditable="true" onblur="updateCommercialField(${i},'cost',this.textContent)">${fmtMoney(row.cost, row.currency)}</td>`:''}
              ${cv('margin')?`<td>${marginCell(row)}</td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit record" onclick="editCommercial(${i})">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove record" onclick="deleteCommercial(${i})">${ICONS.trash}</button>
              </td>
            </tr>`;
          }).join('') || `<tr><td colspan="8"><div class="empty-state"><div class="em-title">No commercial records</div>Add one to track budget, invoicing and margin.</div></td></tr>`}
        </tbody>
      </table>
    </div>
    <div style="color:var(--text-low);font-size:11.5px;">Budget stays in sync with the matching Revenue account's total contract value — edit either one, both update. Paid is always pulled live from Revenue's raised amount.</div>
  `;
}
function updateCommercialDate(i, value){
  STATE.commercials[i].invoiceDate = value;
  saveData('commercials');
}
function fmtMoney(n, currency){ return `${currency||'AED'} ${Number(n).toLocaleString()}`; }
function marginCell(row){
  const pct = row.budget ? Math.round(((row.budget - row.cost)/row.budget)*100) : 0;
  const cls = pct>=50?'margin-good':pct>=30?'margin-mid':'margin-bad';
  return `<span class="${cls}">${pct}%</span>`;
}
function updateCommercialField(i, field, value){
  const num = Number(String(value).replace(/[^0-9.]/g,''));
  STATE.commercials[i][field] = isNaN(num) ? 0 : num;
  saveData('commercials');
  if(field==='budget'){
    const rv = findRevenueForProject(STATE.commercials[i].project);
    if(rv){ rv.totalValue = STATE.commercials[i].budget; saveData('revenue'); }
  }
  renderCommercials();
}

/* ---------------- CREDENTIALS (standalone, sourced from all projects) ---------------- */
function renderCredentials(){
  const c = document.getElementById('content');
  const projectFilter = STATE.filters['credentials_project']||'';
  let rows = [];
  STATE.projects.forEach(p=>{
    (p.credentials||[]).forEach(cr=>rows.push({...cr, projectId:p.id, projectName:p.name}));
  });
  rows = rows.filter(cr=>{
    if(!matchesSearch(`${cr.projectName} ${cr.platform} ${cr.username} ${cr.loginUrl}`, 'credentials')) return false;
    if(projectFilter && cr.projectName!==projectFilter) return false;
    return true;
  });
  const projectNames = [...new Set(STATE.projects.map(p=>p.name))];
  const CCOLS = [{key:'platform', label:'Platform'}, {key:'loginUrl', label:'Login URL'}, {key:'username', label:'Username'}, {key:'password', label:'Password'}, {key:'notes', label:'Notes'}];
  const cv = (k)=>colVisible('credentials', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>All Credentials</h2>
      <button class="btn-primary" onclick="openStandaloneCredentialForm()">+ Add credential</button>
    </div>
    ${searchFilterBar('credentials', [{key:'project', label:'Project', options:projectNames}], columnsButton('credentials', CCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Project</th>
          ${cv('platform')?'<th>Platform</th>':''}
          ${cv('loginUrl')?'<th>Login URL</th>':''}
          ${cv('username')?'<th>Username</th>':''}
          ${cv('password')?'<th>Password</th>':''}
          ${cv('notes')?'<th>Notes</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${rows.map(cr=>`
            <tr>
              <td class="name-cell" style="cursor:pointer;" onclick="openDrilldown('${cr.projectId}')">${cr.projectName}</td>
              ${cv('platform')?`<td contenteditable="true" onblur="updateCredField('${cr.projectId}','${cr.id}','platform',this.textContent)">${cr.platform}</td>`:''}
              ${cv('loginUrl')?`<td contenteditable="true" onblur="updateCredField('${cr.projectId}','${cr.id}','loginUrl',this.textContent)" style="color:var(--teal);">${cr.loginUrl}</td>`:''}
              ${cv('username')?`<td contenteditable="true" onblur="updateCredField('${cr.projectId}','${cr.id}','username',this.textContent)" style="font-family:var(--font-mono);">${cr.username}</td>`:''}
              ${cv('password')?`<td>
                <span style="font-family:var(--font-mono);">${STATE.pwVisible[cr.id] ? cr.password : '••••••••'}</span>
                <button class="icon-btn" style="width:22px;height:22px;" title="Show / hide" onclick="togglePwVisible('${cr.id}'); renderCredentials();">${ICONS.eye}</button>
                <button class="icon-btn" style="width:22px;height:22px;" title="Copy password" onclick="copyToClipboard('${String(cr.password||'').replace(/'/g,"\\'")}','Password')">${ICONS.copy}</button>
              </td>`:''}
              ${cv('notes')?`<td contenteditable="true" onblur="updateCredField('${cr.projectId}','${cr.id}','notes',this.textContent)">${cr.notes||''}</td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit credential" onclick="editCredential('${cr.projectId}','${cr.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove credential" onclick="deleteCredential('${cr.projectId}','${cr.id}'); renderCredentials();">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="7"><div class="empty-state"><div class="em-title">No credentials logged yet</div>Add credentials from within a project's page — they'll show up here automatically.</div></td></tr>`}
        </tbody>
      </table>
    </div>
    <div style="color:var(--text-low);font-size:11.5px;">This is a live view of every credential logged inside each project. Add or remove them here or from the project's own page — both stay in sync.</div>
  `;
}
function openStandaloneCredentialForm(){
  if(STATE.projects.length===0){ svToast('Add a project first — credentials must belong to a project.'); return; }
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  modal.innerHTML = `
    <h3>Add Credential</h3>
    <div class="login-field"><label>Project</label>
      <select id="nc2-project">${STATE.projects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}</select>
    </div>
    <div class="login-field"><label>Platform</label><input id="nc2-platform" type="text" placeholder="e.g. WordPress Admin, Hosting, DNS"></div>
    <div class="login-field"><label>Login URL</label><input id="nc2-url" type="text" placeholder="https://..."></div>
    <div class="login-field"><label>Username</label><input id="nc2-username" type="text"></div>
    <div class="login-field"><label>Password</label><input id="nc2-password" type="text"></div>
    <div class="login-field"><label>Notes</label><input id="nc2-notes" type="text"></div>
    <div class="actions">
      <button class="btn-ghost" onclick="closeFormModal()">Cancel</button>
      <button class="btn-primary" onclick="submitStandaloneCredential()">Add credential</button>
    </div>
  `;
  overlay.classList.add('active');
}
function submitStandaloneCredential(){
  const pid = document.getElementById('nc2-project').value;
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p) return;
  if(!p.credentials) p.credentials = [];
  p.credentials.push({
    id:uid('cr'),
    platform: document.getElementById('nc2-platform').value.trim() || 'Platform',
    loginUrl: document.getElementById('nc2-url').value.trim(),
    username: document.getElementById('nc2-username').value.trim(),
    password: document.getElementById('nc2-password').value.trim(),
    notes: document.getElementById('nc2-notes').value.trim(),
  });
  saveData('projects');
  closeFormModal();
  renderCredentials();
}

/* ---------------- PIPELINE ---------------- */
function renderPipeline(){
  const c = document.getElementById('content');
  const statusFilter = STATE.filters['pipeline_status']||'';
  let list = STATE.pipeline.filter(row=>{
    if(!matchesSearch(`${row.clientName} ${row.industry} ${row.projectType}`, 'pipeline')) return false;
    if(statusFilter && row.status!==statusFilter) return false;
    return true;
  });
  const statuses = ['Proposal Sent','In Discussion','Negotiation','Won','Lost','On Hold'];
  const PLCOLS = [
    {key:'industry', label:'Industry'}, {key:'type', label:'Project Type'}, {key:'proposal', label:'Proposal'},
    {key:'live', label:'Live Site'}, {key:'budget', label:'Budget Quoted'}, {key:'mockup', label:'Mockup'},
    {key:'status', label:'Status'}, {key:'remarks', label:'Remarks'}, {key:'date', label:'Date'},
  ];
  const cv = (k)=>colVisible('pipeline', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>Pipeline</h2>
      <button class="btn-primary" onclick="openPipelineForm()">+ Add prospect</button>
    </div>
    ${searchFilterBar('pipeline', [{key:'status', label:'Status', options:statuses}], columnsButton('pipeline', PLCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Client</th>
          ${cv('industry')?'<th>Industry</th>':''}
          ${cv('type')?'<th>Project Type</th>':''}
          ${cv('proposal')?'<th>Proposal</th>':''}
          ${cv('live')?'<th>Live Site</th>':''}
          ${cv('budget')?'<th>Budget Quoted</th>':''}
          ${cv('mockup')?'<th>Mockup</th>':''}
          ${cv('status')?'<th>Status</th>':''}
          ${cv('remarks')?'<th>Remarks</th>':''}
          ${cv('date')?'<th>Date</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(row=>`
            <tr>
              <td class="name-cell" contenteditable="true" onblur="updatePipelineField('${row.id}','clientName',this.textContent)">${row.clientName}</td>
              ${cv('industry')?`<td contenteditable="true" onblur="updatePipelineField('${row.id}','industry',this.textContent)">${row.industry}</td>`:''}
              ${cv('type')?`<td>
                <select onchange="updatePipelineProjectType('${row.id}', this.value)">
                  ${['New Website Design','Website Development','Website Revamp','Other'].map(t=>`<option ${row.projectType===t?'selected':''}>${t}</option>`).join('')}
                </select>
                ${row.projectType==='Other' ? `<input type="text" placeholder="Specify..." value="${row.projectTypeOther||''}" style="font-size:11.5px;margin-top:4px;width:100%;" onblur="updatePipelineField('${row.id}','projectTypeOther',this.value)">` : ''}
              </td>`:''}
              ${cv('proposal')?`<td contenteditable="true" onblur="updatePipelineField('${row.id}','proposalLink',this.textContent)" style="color:var(--teal);max-width:160px;">${row.proposalLink||''}</td>`:''}
              ${cv('live')?`<td contenteditable="true" onblur="updatePipelineField('${row.id}','liveSite',this.textContent)" style="color:var(--teal);max-width:140px;">${row.liveSite||''}</td>`:''}
              ${cv('budget')?`<td contenteditable="true" onblur="updatePipelineField('${row.id}','budgetQuoted',this.textContent,true)">AED ${Number(row.budgetQuoted||0).toLocaleString()}</td>`:''}
              ${cv('mockup')?`<td>
                <div style="display:flex;align-items:center;gap:6px;">
                  <input type="checkbox" ${row.mockupShared?'checked':''} onchange="updatePipelineMockup('${row.id}', this.checked)">
                  ${row.mockupShared ? `<span contenteditable="true" onblur="updatePipelineField('${row.id}','designUrl',this.textContent)" style="color:var(--teal);font-size:11.5px;">${row.designUrl||'add url'}</span>` : ''}
                </div>
              </td>`:''}
              ${cv('status')?`<td>
                <select onchange="updatePipelineField('${row.id}','status',this.value)">
                  ${statuses.map(s=>`<option ${row.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </td>`:''}
              ${cv('remarks')?`<td contenteditable="true" onblur="updatePipelineField('${row.id}','remarks',this.textContent)" style="max-width:180px;">${row.remarks||''}</td>`:''}
              ${cv('date')?`<td><input type="date" value="${row.date||''}" onchange="updatePipelineField('${row.id}','date',this.value)" style="font-size:12px;"></td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit entry" onclick="editPipeline('${row.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove entry" onclick="deletePipeline('${row.id}')">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="11"><div class="empty-state"><div class="em-title">No prospects yet</div>Add one to start tracking your pipeline.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function updatePipelineProjectType(id, value){
  const row = STATE.pipeline.find(x=>x.id===id);
  row.projectType = value;
  saveData('pipeline');
  renderPipeline();
}
function openPipelineForm(){
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  modal.innerHTML = `
    <h3>Add Prospect</h3>
    <div class="login-field"><label>Client name</label><input id="npl-client" type="text"></div>
    <div class="login-field"><label>Industry</label><input id="npl-industry" type="text"></div>
    <div class="login-field"><label>Project type</label>
      <select id="npl-type"><option>New Website Design</option><option>Website Development</option><option>Website Revamp</option><option>Other</option></select>
    </div>
    <div class="login-field"><label>Budget quoted (AED)</label><input id="npl-budget" type="number"></div>
    <div class="login-field"><label>Proposal link</label><input id="npl-proposal" type="text" placeholder="https://..."></div>
    <div class="login-field"><label>Date</label><input id="npl-date" type="date"></div>
    <div class="actions">
      <button class="btn-ghost" onclick="closeFormModal()">Cancel</button>
      <button class="btn-primary" onclick="submitNewPipeline()">Add prospect</button>
    </div>
  `;
  overlay.classList.add('active');
}
function submitNewPipeline(){
  const clientName = document.getElementById('npl-client').value.trim();
  if(!clientName){ svToast('Give the prospect a client name.'); return; }
  STATE.pipeline.push({
    id:uid('pl'), clientName,
    industry: document.getElementById('npl-industry').value.trim(),
    projectType: document.getElementById('npl-type').value,
    budgetQuoted: Number(document.getElementById('npl-budget').value)||0,
    proposalLink: document.getElementById('npl-proposal').value.trim(),
    liveSite:'', mockupShared:false, designUrl:'',
    status:'Proposal Sent', remarks:'',
    date: document.getElementById('npl-date').value || new Date().toISOString().slice(0,10),
  });
  saveData('pipeline');
  closeFormModal();
  renderPipeline();
}
function updatePipelineField(id, field, value, isNumber){
  const row = STATE.pipeline.find(x=>x.id===id);
  if(isNumber){
    const num = Number(String(value).replace(/[^0-9.]/g,''));
    row[field] = isNaN(num)?0:num;
  } else { row[field] = value; }
  saveData('pipeline');
}
function updatePipelineMockup(id, checked){
  const row = STATE.pipeline.find(x=>x.id===id);
  row.mockupShared = checked;
  saveData('pipeline');
  renderPipeline();
}
function deletePipeline(id){
  if(!confirm('Remove this prospect?')) return;
  STATE.pipeline = STATE.pipeline.filter(x=>x.id!==id);
  saveData('pipeline');
  renderPipeline();
}

/* ---------------- PORTFOLIO ---------------- */
function renderPortfolio(){
  const c = document.getElementById('content');
  const industryFilter = STATE.filters['portfolio_industry']||'';
  const techFilter = STATE.filters['portfolio_tech']||'';
  let list = STATE.portfolio.filter(row=>{
    if(!matchesSearch(`${row.project} ${row.techStack} ${row.industry}`, 'portfolio')) return false;
    if(industryFilter && row.industry!==industryFilter) return false;
    if(techFilter && !(row.techStack||'').toLowerCase().includes(techFilter.toLowerCase())) return false;
    return true;
  });
  const industries = [...new Set(STATE.portfolio.map(row=>row.industry).filter(Boolean))];
  const techs = [...new Set(STATE.portfolio.flatMap(row=>(row.techStack||'').split(',').map(s=>s.trim()).filter(Boolean)))];
  const PFCOLS = [{key:'link', label:'Link'}, {key:'tech', label:'Tech Stack'}, {key:'industry', label:'Industry'}, {key:'notes', label:'Notes'}];
  const cv = (k)=>colVisible('portfolio', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>Portfolio</h2>
      <button class="btn-primary" onclick="addPortfolioItem()">+ Add project</button>
    </div>
    ${searchFilterBar('portfolio', [
      {key:'industry', label:'Industry', options:industries},
      {key:'tech', label:'Tech Stack', options:techs},
    ], columnsButton('portfolio', PFCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Project</th>
          ${cv('link')?'<th>Link</th>':''}
          ${cv('tech')?'<th>Tech Stack</th>':''}
          ${cv('industry')?'<th>Industry</th>':''}
          ${cv('notes')?'<th>Notes</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(row=>`
            <tr>
              <td class="name-cell" contenteditable="true" onblur="updatePortfolioField('${row.id}','project',this.textContent)">${row.project}</td>
              ${cv('link')?`<td contenteditable="true" onblur="updatePortfolioField('${row.id}','link',this.textContent)" style="color:var(--teal);">${row.link}</td>`:''}
              ${cv('tech')?`<td contenteditable="true" onblur="updatePortfolioField('${row.id}','techStack',this.textContent)">${row.techStack}</td>`:''}
              ${cv('industry')?`<td contenteditable="true" onblur="updatePortfolioField('${row.id}','industry',this.textContent)">${row.industry}</td>`:''}
              ${cv('notes')?`<td contenteditable="true" onblur="updatePortfolioField('${row.id}','notes',this.textContent)" style="max-width:220px;">${row.notes||''}</td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit item" onclick="editPortfolioItem('${row.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove item" onclick="deletePortfolioItem('${row.id}')">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="6"><div class="empty-state">No portfolio items match.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function addPortfolioItem(){
  STATE.portfolio.push({id:uid('pf'), project:'New Project', link:'', techStack:'', industry:'', notes:''});
  saveData('portfolio');
  renderPortfolio();
}
function updatePortfolioField(id, field, value){
  const row = STATE.portfolio.find(x=>x.id===id);
  row[field] = value;
  saveData('portfolio');
}
function deletePortfolioItem(id){
  if(!confirm('Remove this portfolio item?')) return;
  STATE.portfolio = STATE.portfolio.filter(x=>x.id!==id);
  saveData('portfolio');
  renderPortfolio();
}

/* ---------------- MARKETING CLIENTS ---------------- */
function renderMarketing(){
  const c = document.getElementById('content');
  const statusFilter = STATE.filters['marketing_status']||'';
  let list = STATE.marketing.filter(row=>{
    if(!matchesSearch(`${row.clientName} ${row.project}`, 'marketing')) return false;
    if(statusFilter && row.status!==statusFilter) return false;
    return true;
  });
  const statuses = ['Active','Paused','Completed','Churned'];
  const MKCOLS = [{key:'project', label:'Project'}, {key:'link', label:'Project Link'}, {key:'status', label:'Status'}];
  const cv = (k)=>colVisible('marketing', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>Marketing Clients</h2>
      <button class="btn-primary" onclick="addMarketingClient()">+ Add client</button>
    </div>
    ${searchFilterBar('marketing', [{key:'status', label:'Status', options:statuses}], columnsButton('marketing', MKCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Client Name</th>
          ${cv('project')?'<th>Project</th>':''}
          ${cv('link')?'<th>Project Link</th>':''}
          ${cv('status')?'<th>Status</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(row=>`
            <tr>
              <td class="name-cell" contenteditable="true" onblur="updateMarketingField('${row.id}','clientName',this.textContent)">${row.clientName}</td>
              ${cv('project')?`<td contenteditable="true" onblur="updateMarketingField('${row.id}','project',this.textContent)">${row.project}</td>`:''}
              ${cv('link')?`<td contenteditable="true" onblur="updateMarketingField('${row.id}','link',this.textContent)" style="color:var(--teal);">${row.link||''}</td>`:''}
              ${cv('status')?`<td>
                <select onchange="updateMarketingField('${row.id}','status',this.value)">
                  ${statuses.map(s=>`<option ${row.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit client" onclick="editMarketingClient('${row.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove client" onclick="deleteMarketingClient('${row.id}')">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="5"><div class="empty-state">No marketing clients yet.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function addMarketingClient(){
  STATE.marketing.push({id:uid('mk'), clientName:'New Client', project:'', link:'', status:'Active'});
  saveData('marketing');
  renderMarketing();
}
function updateMarketingField(id, field, value){
  const row = STATE.marketing.find(x=>x.id===id);
  row[field] = value;
  saveData('marketing');
}
function deleteMarketingClient(id){
  if(!confirm('Remove this marketing client?')) return;
  STATE.marketing = STATE.marketing.filter(x=>x.id!==id);
  saveData('marketing');
  renderMarketing();
}

/* ---------------- MAINTENANCE CLIENTS ---------------- */
function renderMaintenance(){
  const c = document.getElementById('content');
  const statusFilter = STATE.filters['maintenance_status']||'';
  let list = STATE.maintenance.filter(row=>{
    if(!matchesSearch(row.project, 'maintenance')) return false;
    if(statusFilter && row.status!==statusFilter) return false;
    return true;
  });
  const statuses = ['Active','Paused','Completed','Churned'];
  const MTCOLS = [{key:'link', label:'Link'}, {key:'status', label:'Status'}, {key:'report', label:'Monthly Report Link'}];
  const cv = (k)=>colVisible('maintenance', k);
  c.innerHTML = `
    <div class="section-head">
      <h2>Maintenance Clients</h2>
      <button class="btn-primary" onclick="addMaintenanceClient()">+ Add client</button>
    </div>
    ${searchFilterBar('maintenance', [{key:'status', label:'Status', options:statuses}], columnsButton('maintenance', MTCOLS))}
    <div class="panel">
      <table>
        <thead><tr>
          <th>Project</th>
          ${cv('link')?'<th>Link</th>':''}
          ${cv('status')?'<th>Status</th>':''}
          ${cv('report')?'<th>Monthly Report Link</th>':''}
          <th></th>
        </tr></thead>
        <tbody>
          ${list.map(row=>`
            <tr>
              <td class="name-cell" contenteditable="true" onblur="updateMaintenanceField('${row.id}','project',this.textContent)">${row.project}</td>
              ${cv('link')?`<td contenteditable="true" onblur="updateMaintenanceField('${row.id}','link',this.textContent)" style="color:var(--teal);">${row.link||''}</td>`:''}
              ${cv('status')?`<td>
                <select onchange="updateMaintenanceField('${row.id}','status',this.value)">
                  ${statuses.map(s=>`<option ${row.status===s?'selected':''}>${s}</option>`).join('')}
                </select>
              </td>`:''}
              ${cv('report')?`<td contenteditable="true" onblur="updateMaintenanceField('${row.id}','reportLink',this.textContent)" style="color:var(--teal);">${row.reportLink||''}</td>`:''}
              <td style="white-space:nowrap;">
                <button class="icon-btn" title="Edit client" onclick="editMaintenanceClient('${row.id}')">${ICONS.edit}</button>
                <button class="icon-btn btn-danger" title="Remove client" onclick="deleteMaintenanceClient('${row.id}')">${ICONS.trash}</button>
              </td>
            </tr>
          `).join('') || `<tr><td colspan="5"><div class="empty-state">No maintenance clients yet.</div></td></tr>`}
        </tbody>
      </table>
    </div>
  `;
}
function addMaintenanceClient(){
  STATE.maintenance.push({id:uid('mt'), project:'New Project', link:'', status:'Active', reportLink:''});
  saveData('maintenance');
  renderMaintenance();
}
function updateMaintenanceField(id, field, value){
  const row = STATE.maintenance.find(x=>x.id===id);
  row[field] = value;
  saveData('maintenance');
}
function deleteMaintenanceClient(id){
  if(!confirm('Remove this maintenance client?')) return;
  STATE.maintenance = STATE.maintenance.filter(x=>x.id!==id);
  saveData('maintenance');
  renderMaintenance();
}

/* Populate renderer registry now that all render functions exist */
Object.assign(RENDERERS, {
  dashboard: renderDashboard, projects: renderProjects, pipeline: renderPipeline,
  marketing: renderMarketing, maintenance: renderMaintenance, portfolio: renderPortfolio,
  team: renderTeam, credentials: renderCredentials, revenue: renderRevenue, commercials: renderCommercials,
});

/* ---------------- THEME ---------------- */
function toggleTheme(){
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme')==='light';
  const next = isLight ? 'dark' : 'light';
  html.setAttribute('data-theme', next==='light' ? 'light' : '');
  document.getElementById('theme-toggle-btn').textContent = next==='light' ? '☀️ Light' : '🌙 Dark';
  try{ window.storage.set('svops:theme', next, false); }catch(e){}
}
async function loadTheme(){
  try{
    const res = await window.storage.get('svops:theme', false);
    if(res && res.value==='light'){
      document.documentElement.setAttribute('data-theme','light');
      document.getElementById('theme-toggle-btn').textContent = '☀️ Light';
    }
  }catch(e){}
}

/* ---------------- INIT ---------------- */
async function init(){
  await loadData();
  await loadTheme();
  STATE.projects.forEach(p=>recalcProjectPhase(p));
  renderSidebar();
  setView('dashboard');
}
init();


/* ---------------- FILE UPLOADS (server / cPanel) ---------------- */
async function uploadProjectFile(pid, input){
  const file = input.files && input.files[0];
  if(!file) return;
  const status = document.getElementById('dd-upload-status');
  if(status) status.textContent = 'Uploading ' + file.name + '...';
  try{
    const meta = await window.SVApi.upload(file, pid);
    const p = STATE.projects.find(x=>x.id===pid);
    if(!p) return;
    if(!p.files) p.files = [];
    p.files.push({
      id: meta.id,
      name: meta.name || meta.original_name || file.name,
      size: meta.size != null ? meta.size : (meta.size_bytes != null ? meta.size_bytes : file.size),
      url: meta.url || window.SVApi.fileUrl(meta),
      local: !!meta.local,
    });

    await saveData('projects');
    if(status) status.textContent = 'Uploaded.';
    openDrilldown(pid);
  }catch(e){
    if(status) status.textContent = 'Upload failed: ' + (e && e.message ? e.message : e);
  }
  input.value = '';
}
async function deleteProjectFile(pid, fid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p || !p.files) return;
  const f = p.files.find(x=>x.id===fid);
  p.files = p.files.filter(x=>x.id!==fid);
  await saveData('projects');
  try{ if(f) await window.SVApi.deleteFile(f.id); }catch(e){}
  openDrilldown(pid);
}

/* ============================================================
   MODULE IMPROVEMENTS — shared forms, validation, toasts,
   cross-module sync and the missing CRUD actions.
   ============================================================ */

/* ---------------- TOASTS / SAVE FEEDBACK ---------------- */
function svToast(message, kind){
  let host = document.getElementById('sv-toasts');
  if(!host){
    host = document.createElement('div');
    host.id = 'sv-toasts';
    document.body.appendChild(host);
  }
  const el = document.createElement('div');
  el.className = 'sv-toast ' + (kind||'ok');
  el.textContent = message;
  host.appendChild(el);
  setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(), 300); }, kind==='error' ? 5200 : 2200);
}

/* ---------------- GENERIC ENTITY FORM ---------------- */
let SV_FORM = null;

function svEscape(v){ return String(v==null?'':v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function svRenderField(f){
  const id = 'svf-' + f.key;
  const val = f.value==null ? '' : f.value;
  let control;
  if(f.type==='select'){
    control = `<select id="${id}">${(f.options||[]).map(o=>{
      const ov = typeof o==='object' ? o.value : o;
      const ol = typeof o==='object' ? o.label : o;
      return `<option value="${svEscape(ov)}" ${String(val)===String(ov)?'selected':''}>${svEscape(ol)}</option>`;
    }).join('')}</select>`;
  } else if(f.type==='textarea'){
    control = `<textarea id="${id}" rows="3" placeholder="${svEscape(f.placeholder||'')}">${svEscape(val)}</textarea>`;
  } else if(f.type==='checkbox'){
    control = `<input id="${id}" type="checkbox" ${val?'checked':''} style="width:auto;">`;
  } else {
    const t = f.type==='number' ? 'number' : f.type==='date' ? 'date' : 'text';
    control = `<input id="${id}" type="${t}" value="${svEscape(val)}" placeholder="${svEscape(f.placeholder||'')}">`;
  }
  return `<div class="login-field">
    <label for="${id}">${svEscape(f.label)}${f.required?' <span style="color:#e2685f;">*</span>':''}</label>
    ${control}
    <div class="sv-field-error" id="${id}-err"></div>
  </div>`;
}

function openEntityForm(cfg){
  SV_FORM = cfg;
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  const deleteKey = cfg.onDelete ? `__sv_delete_${Math.random().toString(36).slice(2)}` : '';
  if (cfg.onDelete) window[deleteKey] = cfg.onDelete;
  modal.innerHTML = `
    <h3>${svEscape(cfg.title)}</h3>
    ${cfg.hint ? `<div style="color:var(--text-low);font-size:11.5px;margin:-10px 0 14px;">${svEscape(cfg.hint)}</div>` : ''}
    <div class="sv-form-error" id="svf-form-err"></div>
    <div class="sv-form-body">${(cfg.fields||[]).map(svRenderField).join('')}</div>
    <div class="actions">
      ${cfg.onDelete ? `<button class="btn-ghost btn-danger" type="button" onclick="window['${deleteKey}']?.();">Delete</button>` : ''}
      <button class="btn-ghost" type="button" onclick="closeFormModal()">Cancel</button>
      <button class="btn-primary" type="button" onclick="submitEntityForm()">${svEscape(cfg.submitLabel||'Save')}</button>
    </div>
  `;
  overlay.classList.add('active');
  const first = modal.querySelector('input,select,textarea');
  if(first) setTimeout(()=>first.focus(), 30);
  modal.onkeydown = (ev)=>{
    if(ev.key==='Enter' && ev.target.tagName!=='TEXTAREA'){ ev.preventDefault(); submitEntityForm(); }
    if(ev.key==='Escape') closeFormModal();
  };
}

const SV_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function svValidateField(f, raw){
  if(f.type==='checkbox') return {value: !!raw};
  let value = typeof raw==='string' ? raw.trim() : raw;
  if(f.required && (value==='' || value==null)) return {error: f.label + ' is required'};
  if(value==='' || value==null) return {value: f.type==='number' ? 0 : ''};
  if(f.type==='email'){
    const bad = String(value).split(',').map(s=>s.trim()).filter(Boolean).filter(s=>!SV_EMAIL_RE.test(s));
    if(bad.length) return {error: 'Enter a valid email address'};
  }
  if(f.type==='url'){
    if(!/^https?:\/\/\S+\.\S+/i.test(value)) return {error: 'Enter a full URL starting with http:// or https://'};
  }
  if(f.type==='number'){
    const n = Number(String(value).replace(/[^0-9.\-]/g,''));
    if(isNaN(n)) return {error: f.label + ' must be a number'};
    if(f.min!=null && n<f.min) return {error: f.label + ' must be at least ' + f.min};
    return {value: n};
  }
  if(f.maxLength && String(value).length > f.maxLength) return {error: f.label + ' is too long'};
  return {value};
}

function submitEntityForm(){
  if(!SV_FORM) return;
  const values = {};
  let firstError = null;
  (SV_FORM.fields||[]).forEach(f=>{
    const el = document.getElementById('svf-' + f.key);
    const errEl = document.getElementById('svf-' + f.key + '-err');
    if(errEl) errEl.textContent = '';
    if(!el) return;
    const raw = f.type==='checkbox' ? el.checked : el.value;
    const res = svValidateField(f, raw);
    if(res.error){
      if(errEl) errEl.textContent = res.error;
      if(el.classList) el.classList.add('sv-invalid');
      if(!firstError){ firstError = el; }
      return;
    }
    if(el.classList) el.classList.remove('sv-invalid');
    values[f.key] = res.value;
  });
  if(firstError){ firstError.focus(); return; }
  const banner = document.getElementById('svf-form-err');
  if(banner) banner.textContent = '';
  const extra = SV_FORM.validate ? SV_FORM.validate(values) : null;
  if(extra){
    if(banner) banner.textContent = extra;
    svToast(extra, 'error');
    return;
  }
  const done = SV_FORM.onSubmit(values);
  Promise.resolve(done).then(()=>{
    closeFormModal();
    if(SV_FORM && SV_FORM.successMessage) svToast(SV_FORM.successMessage);
    SV_FORM = null;
  }).catch(err=>{
    svToast((err && err.message) || 'Could not save', 'error');
  });
}

function summarizeFieldChanges(beforeObj, afterObj){
  const before = beforeObj && typeof beforeObj === 'object' ? beforeObj : {};
  const after = afterObj && typeof afterObj === 'object' ? afterObj : {};
  const keys = Array.from(new Set([...Object.keys(before), ...Object.keys(after)])).filter(key => key !== 'id');
  const diffs = [];
  for(const key of keys){
    const prev = before[key];
    const next = after[key];
    const same = JSON.stringify(prev) === JSON.stringify(next);
    if(!same){
      const prevText = Array.isArray(prev) ? prev.join(', ') : (prev === null || prev === undefined ? 'empty' : String(prev));
      const nextText = Array.isArray(next) ? next.join(', ') : (next === null || next === undefined ? 'empty' : String(next));
      diffs.push(`${key}: "${prevText}" → "${nextText}"`);
    }
  }
  return diffs.slice(0, 5).join('; ');
}

/* ---------------- SAVE WITH FEEDBACK ---------------- */
async function svSave(keys, message, detailOverride){
  const list = Array.isArray(keys) ? keys : [keys];
  const detailText = detailOverride || message || null;
  for(const k of list){
    const action = (typeof message === 'string' && /removed|delete|deleted/i.test(message)) ? 'delete'
      : (typeof message === 'string' && /added|created|new/i.test(message)) ? 'create'
      : 'update';
    await saveData(k, {
      action: action,
      target: k,
      detail: detailText || `Updated ${String(k).replace(/^svops:/, '')}`,
    });
  }
  if(message) svToast(message);
}

/* ---------------- CROSS-MODULE SYNC HELPERS ---------------- */
function ensureCommercialFor(projectName, budget, currency){
  if(!projectName) return;
  const existing = STATE.commercials.find(c=>c.project===projectName);
  if(existing) return existing;
  const row = {project:projectName, budget:Number(budget||0), invoiced:0, invoiceDate:'', paid:0, cost:0, currency:currency||'AED'};
  STATE.commercials.push(row);
  return row;
}
function ensureRevenueFor(projectName, totalValue, currency){
  if(!projectName) return;
  const existing = STATE.revenue.find(r=>r.project===projectName || r.account===projectName);
  if(existing) return existing;
  const total = Number(totalValue||0);
  const row = {
    id: uid('rv'), project: projectName, account: projectName, client: projectName,
    currency: currency||'AED', totalValue: total, status: 'Active',
    date: new Date().toISOString().slice(0,10),
    tiers: [
      {id:uid('tr'), label:'Advance', pct:50, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
      {id:uid('tr'), label:'Mid-delivery', pct:30, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
      {id:uid('tr'), label:'Final', pct:20, raised:0, raisedFlag:false, raisedDate:'', status:'Pending', remarks:''},
    ],
  };
  STATE.revenue.push(row);
  return row;
}
function renameProjectEverywhere(oldName, newName){
  if(!oldName || !newName || oldName===newName) return;
  STATE.team.forEach(tm=>{ tm.projects = (tm.projects||[]).map(p=>p===oldName?newName:p); });
  STATE.commercials.forEach(c=>{ if(c.project===oldName) c.project = newName; });
  STATE.revenue.forEach(r=>{
    if(r.project===oldName) r.project = newName;
    if(r.account===oldName) r.account = newName;
  });
  STATE.portfolio.forEach(p=>{ if(p.project===oldName) p.project = newName; });
  STATE.maintenance.forEach(m=>{ if(m.project===oldName) m.project = newName; });
  STATE.marketing.forEach(m=>{ if(m.project===oldName) m.project = newName; });
}
function removeProjectLinks(name){
  if(!name) return;
  STATE.commercials = STATE.commercials.filter(c=>c.project!==name);
  STATE.revenue = STATE.revenue.filter(r=>r.project!==name && r.account!==name);
}

/* ---------------- PROJECTS: create + edit + delete ---------------- */
function openProjectForm(project){
  const editing = !!project;
  openEntityForm({
    title: editing ? 'Edit Project' : 'New Project',
    submitLabel: editing ? 'Save changes' : 'Create project',
    successMessage: editing ? 'Project updated' : 'Project created',
    fields: [
      {key:'name', label:'Project name', required:true, value:editing?project.name:'', maxLength:120},
      {key:'client', label:'Client name', required:true, placeholder:'e.g. Acme Corp', value:editing?project.client:''},
      {key:'industry', label:'Industry', placeholder:'e.g. Real Estate', value:editing?project.industry:''},
      {key:'region', label:'Region', placeholder:'e.g. Dubai, UAE', value:editing?project.region:''},
      {key:'techStack', label:'Tech stack', placeholder:'e.g. WordPress, React', value:editing?project.techStack:''},
      {key:'contacts', label:'Client contact email(s)', type:'email', placeholder:'comma-separated emails',
        value: editing ? (project.clientContacts||[]).join(', ') : ''},
      {key:'phase', label:'Phase', type:'select', options:PHASES, value:editing?project.phase:PHASES[0]},
      {key:'status', label:'Status', type:'select', options:['On Track','At Risk','Delayed','Completed'], value:editing?project.status:'On Track'},
      {key:'delayedBy', label:'Delay source', type:'select', options:['None','Client','Team','Third party'], value:editing?(project.delayedBy||'None'):'None'},
      {key:'startDate', label:'Start date', type:'date', value:editing?project.startDate:new Date().toISOString().slice(0,10)},
      {key:'endDate', label:'End date', type:'date', value:editing?project.endDate:''},
      {key:'deliveryDate', label:'Delivery date', type:'date', value:editing?project.deliveryDate:''},
      {key:'budget', label:'Contract value', type:'number', min:0, value: editing ? (STATE.commercials.find(c=>c.project===project.name)||{}).budget || 0 : 0},
    ],
    validate: (v)=>{
      if(v.startDate && v.endDate && v.endDate < v.startDate) return 'End date cannot be before the start date.';
      const clash = STATE.projects.find(p=>p.name.toLowerCase()===String(v.name).toLowerCase() && (!editing || p.id!==project.id));
      if(clash) return 'A project with that name already exists.';
      return null;
    },
    onSubmit: async (v)=>{
      const contacts = String(v.contacts||'').split(',').map(s=>s.trim()).filter(Boolean);
      if(editing){
        const before = JSON.parse(JSON.stringify(project));
        const oldName = project.name;
        renameProjectEverywhere(oldName, v.name);
        Object.assign(project, {
          name:v.name, client:v.client, industry:v.industry, region:v.region, techStack:v.techStack,
          clientContacts:contacts, phase:v.phase, status:v.status, delayedBy:v.delayedBy,
          startDate:v.startDate, endDate:v.endDate, deliveryDate:v.deliveryDate,
        });
        project.health = v.status==='Delayed' ? 'red' : v.status==='At Risk' ? 'amber' : 'green';
        const com = ensureCommercialFor(project.name, v.budget, 'AED');
        if(com){ com.budget = Number(v.budget||0); }
        const rv = STATE.revenue.find(r=>r.project===project.name || r.account===project.name);
        if(rv) rv.totalValue = Number(v.budget||0);
        const detail = summarizeFieldChanges(before, project) || 'Updated project fields';
        await svSave(['projects','team','commercials','revenue'], 'Project updated', `Updated project ${v.name}: ${detail}`);
      } else {
        const p = normalizeProject({
          id:uid('pj'), name:v.name, client:v.client, industry:v.industry, region:v.region,
          techStack:v.techStack, clientContacts:contacts, phase:v.phase, status:v.status,
          health: v.status==='Delayed' ? 'red' : v.status==='At Risk' ? 'amber' : 'green',
          delayedBy:v.delayedBy, startDate:v.startDate, endDate:v.endDate, deliveryDate:v.deliveryDate,
          team:[], tasks:buildPhaseTasks(v.phase), notes:'', resources:[], credentials:[], files:[],
        });
        STATE.projects.push(p);
        ensureCommercialFor(p.name, v.budget, 'AED');
        ensureRevenueFor(p.name, v.budget, 'AED');
        await svSave(['projects','commercials','revenue'], 'Project created', `Created project ${v.name}`);
      }
      renderModule(STATE.activeView);
    },
  });
}
function editProject(id){
  const p = STATE.projects.find(x=>x.id===id);
  if(p) openProjectForm(p);
}
function deleteProject(id){
  const p = STATE.projects.find(x=>x.id===id);
  if(!p) return;
  if(!confirm(`Remove "${p.name}"? Its commercial and revenue records are removed too. This cannot be undone.`)) return;
  STATE.team.forEach(tm=>{ tm.projects = (tm.projects||[]).filter(pr=>pr!==p.name); });
  removeProjectLinks(p.name);
  STATE.projects = STATE.projects.filter(x=>x.id!==id);
  svSave(['projects','team','commercials','revenue'], 'Project removed');
  renderModule(STATE.activeView);
}

/* ---------------- TEAM ---------------- */
function openTeamForm(member){
  const editing = !!member;
  openEntityForm({
    title: editing ? 'Edit Team Member' : 'Add Team Member',
    submitLabel: editing ? 'Save changes' : 'Add member',
    successMessage: editing ? 'Team member updated' : 'Team member added',
    fields: [
      {key:'name', label:'Full name', required:true, value:editing?member.name:''},
      {key:'title', label:'Title / role', required:true, placeholder:'e.g. Web Developer', value:editing?member.title:''},
      {key:'email', label:'Email', type:'email', required:true, placeholder:'name@svdigital.ae', value:editing?member.email:''},
      {key:'projects', label:'Assigned projects', type:'select',
        options:[{value:'',label:'— none —'}].concat(STATE.projects.map(p=>p.name)),
        value: editing ? (member.projects||[])[0] || '' : ''},
    ],
    validate: (v)=>{
      const clash = STATE.team.find(t=>t.email.toLowerCase()===String(v.email).toLowerCase() && (!editing || t.id!==member.id));
      return clash ? 'Another team member already uses that email.' : null;
    },
    onSubmit: async (v)=>{
      if(editing){
        const before = JSON.parse(JSON.stringify(member));
        member.name = v.name; member.title = v.title; member.email = v.email;
        if(v.projects && !(member.projects||[]).includes(v.projects)){
          member.projects = (member.projects||[]).concat([v.projects]);
        }
        const detail = summarizeFieldChanges(before, member) || 'Updated team member fields';
        await svSave('team', 'Team member updated', `Updated team member ${v.name}: ${detail}`);
      } else {
        STATE.team.push({id:uid('tm'), name:v.name, title:v.title, email:v.email, projects: v.projects?[v.projects]:[]});
        await svSave('team', 'Team member added', `Added team member ${v.name}`);
      }
      renderTeam();
    },
  });
}
function addTeamMember(){ openTeamForm(null); }
function editTeamMember(id){
  const t = STATE.team.find(x=>x.id===id);
  if(t) openTeamForm(t);
}
function deleteTeamMember(id){
  const t = STATE.team.find(x=>x.id===id);
  if(!t) return;
  if(!confirm(`Remove ${t.name} from the team? Their task assignments are cleared.`)) return;
  STATE.projects.forEach(p=>{
    p.team = (p.team||[]).filter(n=>n!==t.name);
    (p.tasks||[]).forEach(tk=>{ if(tk.owner===t.name) tk.owner = ''; });
  });
  STATE.team = STATE.team.filter(x=>x.id!==id);
  svSave(['team','projects'], 'Team member removed');
  renderTeam();
}

/* ---------------- PORTFOLIO ---------------- */
function openPortfolioForm(item){
  const editing = !!item;
  openEntityForm({
    title: editing ? 'Edit Portfolio Item' : 'Add Portfolio Item',
    submitLabel: editing ? 'Save changes' : 'Add item',
    successMessage: editing ? 'Portfolio item updated' : 'Portfolio item added',
    fields: [
      {key:'project', label:'Project', required:true, value:editing?item.project:''},
      {key:'link', label:'Live link', type:'url', placeholder:'https://...', value:editing?item.link:''},
      {key:'techStack', label:'Tech stack', placeholder:'e.g. WordPress, Elementor', value:editing?item.techStack:''},
      {key:'industry', label:'Industry', value:editing?item.industry:''},
      {key:'notes', label:'Notes', type:'textarea', value:editing?item.notes:''},
    ],
    onSubmit: async (v)=>{
      if(editing){
        const before = JSON.parse(JSON.stringify(item));
        Object.assign(item, v);
        const detail = summarizeFieldChanges(before, item) || 'Updated portfolio item fields';
        await svSave('portfolio', 'Portfolio item updated', `Updated portfolio entry ${v.project || 'item'}: ${detail}`);
      } else {
        STATE.portfolio.push(Object.assign({id:uid('pf')}, v));
        await svSave('portfolio', 'Portfolio item added', `Added portfolio item ${v.project || 'new item'}`);
      }
      renderPortfolio();
    },
  });
}
function addPortfolioItem(){ openPortfolioForm(null); }
function editPortfolioItem(id){
  const row = STATE.portfolio.find(x=>x.id===id);
  if(row) openPortfolioForm(row);
}
function deletePortfolioItem(id){
  if(!confirm('Remove this portfolio item?')) return;
  STATE.portfolio = STATE.portfolio.filter(x=>x.id!==id);
  svSave('portfolio', 'Portfolio item removed');
  renderPortfolio();
}

/* ---------------- MARKETING CLIENTS ---------------- */
function openMarketingForm(row){
  const editing = !!row;
  openEntityForm({
    title: editing ? 'Edit Marketing Client' : 'Add Marketing Client',
    submitLabel: editing ? 'Save changes' : 'Add client',
    successMessage: editing ? 'Marketing client updated' : 'Marketing client added',
    fields: [
      {key:'clientName', label:'Client name', required:true, value:editing?row.clientName:''},
      {key:'project', label:'Project', value:editing?row.project:''},
      {key:'link', label:'Project link', type:'url', placeholder:'https://...', value:editing?row.link:''},
      {key:'status', label:'Status', type:'select', options:['Active','Paused','Completed','Churned'], value:editing?row.status:'Active'},
    ],
    onSubmit: async (v)=>{
      if(editing){
        const before = JSON.parse(JSON.stringify(row));
        Object.assign(row, v);
        const detail = summarizeFieldChanges(before, row) || 'Updated marketing fields';
        await svSave('marketing', 'Marketing client updated', `Updated marketing client ${v.clientName}: ${detail}`);
      } else {
        STATE.marketing.push(Object.assign({id:uid('mk')}, v));
        await svSave('marketing', 'Marketing client added', `Added marketing client ${v.clientName}`);
      }
      renderMarketing();
    },
  });
}
function addMarketingClient(){ openMarketingForm(null); }
function editMarketingClient(id){
  const row = STATE.marketing.find(x=>x.id===id);
  if(row) openMarketingForm(row);
}
function deleteMarketingClient(id){
  if(!confirm('Remove this marketing client?')) return;
  STATE.marketing = STATE.marketing.filter(x=>x.id!==id);
  svSave('marketing', 'Marketing client removed');
  renderMarketing();
}

/* ---------------- MAINTENANCE CLIENTS ---------------- */
function openMaintenanceForm(row){
  const editing = !!row;
  openEntityForm({
    title: editing ? 'Edit Maintenance Client' : 'Add Maintenance Client',
    submitLabel: editing ? 'Save changes' : 'Add client',
    successMessage: editing ? 'Maintenance client updated' : 'Maintenance client added',
    fields: [
      {key:'project', label:'Project', required:true, value:editing?row.project:''},
      {key:'link', label:'Site link', type:'url', placeholder:'https://...', value:editing?row.link:''},
      {key:'status', label:'Status', type:'select', options:['Active','Paused','Completed','Churned'], value:editing?row.status:'Active'},
      {key:'reportLink', label:'Monthly report link', type:'url', placeholder:'https://...', value:editing?row.reportLink:''},
    ],
    onSubmit: async (v)=>{
      if(editing){
        const before = JSON.parse(JSON.stringify(row));
        Object.assign(row, v);
        const detail = summarizeFieldChanges(before, row) || 'Updated maintenance fields';
        await svSave('maintenance', 'Maintenance client updated', `Updated maintenance client ${v.project}: ${detail}`);
      } else {
        STATE.maintenance.push(Object.assign({id:uid('mt')}, v));
        await svSave('maintenance', 'Maintenance client added', `Added maintenance client ${v.project}`);
      }
      renderMaintenance();
    },
  });
}
function addMaintenanceClient(){ openMaintenanceForm(null); }
function editMaintenanceClient(id){
  const row = STATE.maintenance.find(x=>x.id===id);
  if(row) openMaintenanceForm(row);
}
function deleteMaintenanceClient(id){
  if(!confirm('Remove this maintenance client?')) return;
  STATE.maintenance = STATE.maintenance.filter(x=>x.id!==id);
  svSave('maintenance', 'Maintenance client removed');
  renderMaintenance();
}

/* ---------------- COMMERCIALS ---------------- */
function openCommercialForm(index){
  const editing = index!=null && index>=0;
  const row = editing ? STATE.commercials[index] : null;
  const used = STATE.commercials.map(c=>c.project);
  const available = STATE.projects.map(p=>p.name).filter(n=>!used.includes(n));
  if(!editing && !available.length){
    svToast('Every project already has a commercial record.', 'error');
    return;
  }
  openEntityForm({
    title: editing ? 'Edit Commercial' : 'Add Commercial Record',
    submitLabel: editing ? 'Save changes' : 'Add record',
    successMessage: editing ? 'Commercial updated' : 'Commercial record added',
    hint: 'Budget stays in sync with the matching Revenue account. Paid is pulled live from Revenue.',
    fields: [
      editing
        ? {key:'project', label:'Project', required:true, value:row.project}
        : {key:'project', label:'Project', type:'select', required:true, options:available, value:available[0]},
      {key:'currency', label:'Currency', type:'select', options:['AED','USD','EUR','GBP','INR'], value:editing?(row.currency||'AED'):'AED'},
      {key:'budget', label:'Budget', type:'number', min:0, value:editing?row.budget:0},
      {key:'invoiced', label:'Invoiced', type:'number', min:0, value:editing?row.invoiced:0},
      {key:'invoiceDate', label:'Invoice date', type:'date', value:editing?(row.invoiceDate||''):''},
      {key:'cost', label:'Cost', type:'number', min:0, value:editing?row.cost:0},
    ],
    validate: (v)=>{
      if(Number(v.invoiced) > Number(v.budget)) return 'Invoiced cannot exceed the budget.';
      if(Number(v.cost) > Number(v.budget)) return 'Cost exceeds the budget — margin would be negative. Adjust the budget first.';
      return null;
    },
    onSubmit: async (v)=>{
      if(editing){
        const before = JSON.parse(JSON.stringify(row));
        const oldName = row.project;
        Object.assign(row, v);
        if(oldName!==v.project) renameProjectEverywhere(oldName, v.project);
        const detail = summarizeFieldChanges(before, row) || 'Updated commercial fields';
        await svSave(['commercials','revenue'], 'Commercial updated', `Updated commercial record for ${v.project}: ${detail}`);
      } else {
        STATE.commercials.push(Object.assign({paid:0}, v));
        ensureRevenueFor(v.project, v.budget, v.currency);
        await svSave(['commercials','revenue'], 'Commercial record added', `Added commercial record for ${v.project}`);
      }
      const rv = findRevenueForProject(v.project);
      if(rv){ rv.totalValue = Number(v.budget||0); rv.currency = v.currency; }
      renderCommercials();
    },
  });
}
function addCommercial(){ openCommercialForm(null); }
function editCommercial(i){ openCommercialForm(i); }
function deleteCommercial(i){
  const row = STATE.commercials[i];
  if(!row) return;
  if(!confirm(`Remove the commercial record for "${row.project}"?`)) return;
  STATE.commercials.splice(i,1);
  svSave('commercials', 'Commercial record removed');
  renderCommercials();
}

/* ---------------- PIPELINE ---------------- */
function openPipelineForm(row){
  const editing = !!row;
  const statuses = ['Proposal Sent','In Discussion','Negotiation','Won','Lost','On Hold'];
  const types = ['New Website Design','Website Development','Website Revamp','Other'];
  openEntityForm({
    title: editing ? 'Edit Pipeline Entry' : 'New Pipeline Entry',
    submitLabel: editing ? 'Save changes' : 'Add to pipeline',
    successMessage: editing ? 'Pipeline entry updated' : 'Added to pipeline',
    hint: 'Marking an entry as Won creates the project, commercial and revenue records automatically.',
    fields: [
      {key:'clientName', label:'Client name', required:true, value:editing?row.clientName:''},
      {key:'industry', label:'Industry', value:editing?row.industry:''},
      {key:'projectType', label:'Project type', type:'select', options:types, value:editing?row.projectType:types[0]},
      {key:'projectTypeOther', label:'If other, specify', value:editing?(row.projectTypeOther||''):''},
      {key:'budgetQuoted', label:'Budget quoted (AED)', type:'number', min:0, value:editing?(row.budgetQuoted||0):0},
      {key:'proposalLink', label:'Proposal link', type:'url', placeholder:'https://...', value:editing?(row.proposalLink||''):''},
      {key:'liveSite', label:'Current live site', type:'url', placeholder:'https://...', value:editing?(row.liveSite||''):''},
      {key:'mockupShared', label:'Mockup shared', type:'checkbox', value:editing?!!row.mockupShared:false},
      {key:'designUrl', label:'Design / mockup URL', type:'url', placeholder:'https://...', value:editing?(row.designUrl||''):''},
      {key:'status', label:'Status', type:'select', options:statuses, value:editing?row.status:'Proposal Sent'},
      {key:'date', label:'Date', type:'date', value:editing?(row.date||''):new Date().toISOString().slice(0,10)},
      {key:'remarks', label:'Remarks', type:'textarea', value:editing?(row.remarks||''):''},
    ],
    validate: (v)=>{
      if(v.projectType==='Other' && !v.projectTypeOther) return 'Specify the project type.';
      if(v.mockupShared && !v.designUrl) return 'Add the mockup URL, or untick "Mockup shared".';
      return null;
    },
    onDelete: editing ? () => {
      deletePipeline(row.id);
      closeFormModal();
      SV_FORM = null;
    } : null,
    onSubmit: async (v)=>{
      const wasWon = editing && row.status==='Won';
      let entry = row;
      if(editing){
        const before = JSON.parse(JSON.stringify(row));
        Object.assign(entry, v);
        const detail = summarizeFieldChanges(before, entry) || 'Updated pipeline fields';
        await svSave('pipeline', 'Pipeline entry updated', `Updated pipeline entry ${v.clientName}: ${detail}`);
      } else {
        entry = Object.assign({id:uid('pl')}, v); STATE.pipeline.push(entry);
        await svSave('pipeline', 'Pipeline entry added', `Added pipeline entry ${v.clientName}`);
      }
      if(v.status==='Won' && !wasWon){
        const label = v.projectType==='Other' ? v.projectTypeOther : v.projectType;
        const name = v.clientName + ' \u2014 ' + label;
        if(!STATE.projects.some(p=>p.name===name)){
          STATE.projects.push(normalizeProject({
            id:uid('pj'), name, client:v.clientName, industry:v.industry, region:'', techStack:'',
            clientContacts:[], phase:PHASES[0], status:'On Track', health:'green', delayedBy:'None',
            startDate:new Date().toISOString().slice(0,10), endDate:'', deliveryDate:'',
            team:[], tasks:buildPhaseTasks(PHASES[0]), notes:v.remarks||'', resources:[], credentials:[], files:[],
          }));
          ensureCommercialFor(name, v.budgetQuoted, 'AED');
          ensureRevenueFor(name, v.budgetQuoted, 'AED');
          svToast('Deal won \u2014 project, commercial and revenue records created');
        }
        await svSave(['pipeline','projects','commercials','revenue'], 'Pipeline won', `Pipeline won for ${v.clientName}`);
      }
      renderPipeline();
    },
  });
}
function editPipeline(id){
  const row = STATE.pipeline.find(x=>x.id===id);
  if(row) openPipelineForm(row);
}
function deletePipeline(id){
  if(!confirm('Remove this pipeline entry?')) return;
  STATE.pipeline = STATE.pipeline.filter(x=>x.id!==id);
  svSave('pipeline', 'Pipeline entry removed');
  renderPipeline();
}

/* ---------------- CREDENTIALS ---------------- */
function openStandaloneCredentialForm(existing){
  if(STATE.projects.length===0){ svToast('Add a project first — credentials belong to a project.', 'error'); return; }
  const editing = !!existing;
  openEntityForm({
    title: editing ? 'Edit Credential' : 'Add Credential',
    submitLabel: editing ? 'Save changes' : 'Add credential',
    successMessage: editing ? 'Credential updated' : 'Credential added',
    fields: [
      {key:'projectId', label:'Project', type:'select', required:true,
        options: STATE.projects.map(p=>({value:p.id, label:p.name})),
        value: editing ? existing.projectId : STATE.projects[0].id},
      {key:'platform', label:'Platform', required:true, placeholder:'e.g. WordPress Admin, Hosting, DNS', value:editing?existing.cred.platform:''},
      {key:'loginUrl', label:'Login URL', type:'url', placeholder:'https://...', value:editing?existing.cred.loginUrl:''},
      {key:'username', label:'Username', required:true, value:editing?existing.cred.username:''},
      {key:'password', label:'Password', required:true, value:editing?existing.cred.password:''},
      {key:'notes', label:'Notes', type:'textarea', value:editing?(existing.cred.notes||''):''},
    ],
    onSubmit: async (v)=>{
      const target = STATE.projects.find(p=>p.id===v.projectId);
      if(!target) throw new Error('Pick a project');
      if(!Array.isArray(target.credentials)) target.credentials = [];
      if(editing){
        const src = STATE.projects.find(p=>p.id===existing.projectId);
        const before = JSON.parse(JSON.stringify(existing.cred));
        if(src) src.credentials = (src.credentials||[]).filter(c=>c.id!==existing.cred.id);
        const nextCred = {id:existing.cred.id, platform:v.platform, loginUrl:v.loginUrl, username:v.username, password:v.password, notes:v.notes};
        target.credentials.push(nextCred);
        const detail = summarizeFieldChanges(before, nextCred) || 'Updated credential fields';
        await svSave('projects', 'Credential updated', `Updated credential for ${target.name}: ${detail}`);
      } else {
        const cred = {id:uid('cr'), platform:v.platform, loginUrl:v.loginUrl, username:v.username, password:v.password, notes:v.notes};
        target.credentials.push(cred);
        await svSave('projects', 'Credential added', `Added credential for ${target.name}: ${v.platform}`);
      }
      renderCredentials();
    },
  });
}
function editCredential(projectId, credId){
  const p = STATE.projects.find(x=>x.id===projectId);
  const cred = p && (p.credentials||[]).find(c=>c.id===credId);
  if(cred) openStandaloneCredentialForm({projectId, cred});
}
function copyToClipboard(text, label){
  const done = ()=>svToast((label||'Value') + ' copied');
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(()=>svToast('Could not copy', 'error'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); done(); }catch(e){ svToast('Could not copy', 'error'); }
    ta.remove();
  }
}

/* ---------------- REVENUE ---------------- */
function openRevenueForm(rv){
  const editing = !!rv;
  const used = STATE.revenue.map(r=>r.project||r.account);
  const projectOptions = STATE.projects.map(p=>p.name).filter(n=>editing || !used.includes(n));
  openEntityForm({
    title: editing ? 'Edit Revenue Account' : 'New Revenue Account',
    submitLabel: editing ? 'Save changes' : 'Create account',
    successMessage: editing ? 'Revenue account updated' : 'Revenue account created',
    fields: [
      editing
        ? {key:'project', label:'Account / project', required:true, value:rv.project||rv.account}
        : {key:'project', label:'Account / project', type:'select', required:true,
           options: projectOptions.length ? projectOptions : ['— no unlinked project —'], value: projectOptions[0]||''},
      {key:'client', label:'Client', value: editing ? (rv.client||'') : ''},
      {key:'currency', label:'Currency', type:'select', options:['AED','USD','EUR','GBP','INR'], value: editing ? (rv.currency||'AED') : 'AED'},
      {key:'totalValue', label:'Total contract value', type:'number', required:true, min:0, value: editing ? rv.totalValue : 0},
      {key:'status', label:'Status', type:'select', options:['Active','Completed','On Hold','Cancelled'], value: editing ? (rv.status||'Active') : 'Active'},
    ],
    validate: (v)=>{
      if(!editing && STATE.revenue.some(r=>(r.project||r.account)===v.project)) return 'That project already has a revenue account.';
      return null;
    },
    onSubmit: async (v)=>{
      if(editing){
        const before = JSON.parse(JSON.stringify(rv));
        const oldName = rv.project||rv.account;
        rv.project = v.project; rv.account = v.project; rv.client = v.client;
        rv.currency = v.currency; rv.totalValue = Number(v.totalValue); rv.status = v.status;
        if(oldName!==v.project) renameProjectEverywhere(oldName, v.project);
        const detail = summarizeFieldChanges(before, rv) || 'Updated revenue fields';
        await svSave(['revenue','commercials'], 'Revenue updated', `Updated revenue account ${v.project}: ${detail}`);
      } else {
        const created = ensureRevenueFor(v.project, v.totalValue, v.currency);
        if(created){ created.client = v.client || v.project; created.status = v.status; }
        await svSave(['revenue','commercials'], 'Revenue account added', `Added revenue account ${v.project}`);
      }
      const com = STATE.commercials.find(c=>c.project===v.project);
      if(com){ com.budget = Number(v.totalValue); com.currency = v.currency; }
      renderRevenue();
    },
  });
}
function editRevenue(id){
  const rv = STATE.revenue.find(x=>x.id===id);
  if(rv) openRevenueForm(rv);
}
function deleteRevenue(id){
  const rv = STATE.revenue.find(x=>x.id===id);
  if(!rv) return;
  if(!confirm(`Remove the revenue account for "${rv.project||rv.account}"?`)) return;
  STATE.revenue = STATE.revenue.filter(x=>x.id!==id);
  svSave('revenue', 'Revenue account removed');
  renderRevenue();
}

/* ---------------- DRILLDOWN SUB-FORMS (resources, credentials, tiers, contacts) ---------------- */

function openResourceForm(pid, rid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p) return;
  if(!p.resources) p.resources = [];
  const existing = rid ? p.resources.find(r=>r.id===rid) : null;
  openEntityForm({
    title: existing ? 'Edit Resource' : 'Add Resource',
    hint: 'Links to designs, drives, docs or staging environments for this project.',
    submitLabel: existing ? 'Save changes' : 'Add resource',
    fields: [
      {key:'label', label:'Label', required:true, placeholder:'e.g. Figma designs', value: existing?existing.label:''},
      {key:'url', label:'URL', type:'url', required:true, placeholder:'https://…', value: existing?existing.url:''},
    ],
    onSubmit: async (v)=>{
      if(existing){
        const before = JSON.parse(JSON.stringify(existing));
        existing.label = v.label; existing.url = v.url;
        const detail = summarizeFieldChanges(before, existing) || 'Updated resource fields';
        await svSave('projects', 'Resource updated', `Updated resource ${v.label}: ${detail}`);
      } else {
        p.resources.push({id:uid('rs'), label:v.label, url:v.url});
        await svSave('projects', 'Resource added', `Added resource ${v.label}`);
      }
      openDrilldown(pid);
    },
  });
}
function addResource(pid){ openResourceForm(pid, null); }
function editResource(pid, rid){ openResourceForm(pid, rid); }
function deleteResource(pid, rid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p) return;
  if(!confirm('Remove this resource?')) return;
  p.resources = (p.resources||[]).filter(x=>x.id!==rid);
  svSave('projects', 'Resource removed');
  openDrilldown(pid);
}

function openProjectCredentialForm(pid, cid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p) return;
  if(!p.credentials) p.credentials = [];
  const existing = cid ? p.credentials.find(c=>c.id===cid) : null;
  openEntityForm({
    title: existing ? 'Edit Credential' : 'Add Credential',
    hint: 'Stored against ' + p.name + '. Visible to admins and members with access.',
    submitLabel: existing ? 'Save changes' : 'Add credential',
    fields: [
      {key:'platform', label:'Platform', required:true, placeholder:'e.g. cPanel, WordPress, GoDaddy', value: existing?existing.platform:''},
      {key:'loginUrl', label:'Login URL', placeholder:'https://…', value: existing?existing.loginUrl:''},
      {key:'username', label:'Username / email', required:true, value: existing?existing.username:''},
      {key:'password', label:'Password', required:true, value: existing?existing.password:''},
      {key:'notes', label:'Notes', type:'textarea', placeholder:'2FA owner, recovery email, expiry…', value: existing?existing.notes:''},
    ],
    validate: (v)=>{
      if(v.loginUrl && !/^https?:\/\/\S+\.\S+/i.test(v.loginUrl)) return 'Login URL must start with http:// or https://';
      const clash = (p.credentials||[]).find(c=>c.platform.toLowerCase()===String(v.platform).toLowerCase() && c.username===v.username && (!existing || c.id!==existing.id));
      return clash ? 'That platform/username pair already exists for this project.' : null;
    },
    onSubmit: async (v)=>{
      if(existing){
        const before = JSON.parse(JSON.stringify(existing));
        Object.assign(existing, v);
        const detail = summarizeFieldChanges(before, existing) || 'Updated credential fields';
        await svSave('projects', 'Credential updated', `Updated credential ${v.platform}: ${detail}`);
      } else {
        p.credentials.push({id:uid('cr'), ...v});
        await svSave('projects', 'Credential added', `Added credential ${v.platform}`);
      }
      openDrilldown(pid);
    },
  });
}
function addCredential(pid){ openProjectCredentialForm(pid, null); }
function editProjectCredential(pid, cid){ openProjectCredentialForm(pid, cid); }
function deleteCredential(pid, cid){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p) return;
  if(!confirm('Remove this credential?')) return;
  p.credentials = (p.credentials||[]).filter(x=>x.id!==cid);
  svSave('projects', 'Credential removed');
  openDrilldown(pid);
}
function copyProjectCredential(pid, cid){
  const p = STATE.projects.find(x=>x.id===pid);
  const cr = p && (p.credentials||[]).find(c=>c.id===cid);
  if(!cr) return;
  const done = ()=>svToast('Password copied to clipboard');
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(cr.password||'').then(done, ()=>svToast('Could not copy password','error'));
  } else {
    svToast('Clipboard unavailable in this browser','error');
  }
}

function openRevenueTierForm(rvId, tierId){
  const rv = STATE.revenue.find(x=>x.id===rvId);
  if(!rv) return;
  if(!rv.tiers) rv.tiers = [];
  const existing = tierId ? rv.tiers.find(t=>t.id===tierId) : null;
  const otherPct = rv.tiers.filter(t=>!existing || t.id!==existing.id).reduce((s,t)=>s+Number(t.pct||0),0);
  openEntityForm({
    title: existing ? 'Edit Payment Tier' : 'Add Payment Tier',
    hint: `Existing tiers cover ${otherPct}% of the contract value.`,
    submitLabel: existing ? 'Save changes' : 'Add tier',
    fields: [
      {key:'label', label:'Tier name', required:true, placeholder:'e.g. Advance', value: existing?existing.label:''},
      {key:'pct', label:'% of total', type:'number', required:true, min:0, value: existing?existing.pct:Math.max(0, 100-otherPct)},
      {key:'raised', label:'Amount raised (AED)', type:'number', min:0, value: existing?existing.raised:0},
      {key:'raisedDate', label:'Date raised', type:'date', value: existing?existing.raisedDate:''},
      {key:'status', label:'Status', type:'select', options:['Pending','Partial','Collected','Delayed'], value: existing?existing.status:'Pending'},
      {key:'raisedFlag', label:'Invoice raised', type:'checkbox', value: existing?!!existing.raisedFlag:false},
      {key:'remarks', label:'Remarks', type:'textarea', value: existing?existing.remarks:''},
    ],
    validate: (v)=>{
      if(v.pct > 100) return 'A tier cannot exceed 100%.';
      if(otherPct + Number(v.pct) > 100) return `Tiers would total ${otherPct + Number(v.pct)}% — keep the total at or below 100%.`;
      const expected = Math.round(Number(rv.totalValue||0) * Number(v.pct) / 100);
      if(Number(v.raised) > expected && expected > 0) return `Amount raised cannot exceed the expected AED ${expected.toLocaleString()} for this tier.`;
      return null;
    },
    onSubmit: async (v)=>{
      if(existing){
        const before = JSON.parse(JSON.stringify(existing));
        Object.assign(existing, v);
        const detail = summarizeFieldChanges(before, existing) || 'Updated payment tier fields';
        await svSave('revenue', 'Tier updated', `Updated payment tier ${v.label}: ${detail}`);
      } else {
        rv.tiers.push({id:uid('tr'), ...v});
        await svSave('revenue', 'Tier added', `Added payment tier ${v.label}`);
      }
      openRevenueDrilldown(rvId);
    },
  });
}
function addRevenueTier(rvId){ openRevenueTierForm(rvId, null); }
function editRevenueTier(rvId, tierId){ openRevenueTierForm(rvId, tierId); }
function deleteRevenueTier(rvId, tierId){
  const rv = STATE.revenue.find(x=>x.id===rvId);
  if(!rv) return;
  if(!confirm('Remove this payment tier?')) return;
  rv.tiers = (rv.tiers||[]).filter(x=>x.id!==tierId);
  svSave('revenue', 'Tier removed');
  openRevenueDrilldown(rvId);
}

function addClientContact(pid, email){
  const p = STATE.projects.find(x=>x.id===pid);
  if(!p) return;
  email = String(email||'').trim();
  if(!email){ svToast('Enter an email address first','error'); return; }
  if(!SV_EMAIL_RE.test(email)){ svToast('That does not look like a valid email','error'); return; }
  if(!p.clientContacts) p.clientContacts = [];
  if(p.clientContacts.some(e=>e.toLowerCase()===email.toLowerCase())){ svToast('That contact is already listed','error'); return; }
  p.clientContacts.push(email);
  p.clientContact = p.clientContacts[0];
  svSave('projects', 'Contact added');
  openDrilldown(pid);
}
function addTask(pid){ addTaskToPhase(pid); }

/* ---------------- CSV EXPORT (exports the visible, filtered table) ---------------- */
function svExportCsv(module){
  const table = document.querySelector('#content table');
  if(!table){ svToast('Nothing to export on this view','error'); return; }
  const rows = Array.from(table.querySelectorAll('tr')).map(tr=>
    Array.from(tr.querySelectorAll('th,td')).map(cell=>{
      const txt = (cell.innerText||'').replace(/\s+/g,' ').trim();
      return '"' + txt.replace(/"/g,'""') + '"';
    })
  ).filter(cells=>cells.length);
  if(rows.length<2){ svToast('No rows to export','error'); return; }
  // drop trailing action columns that hold only buttons
  const csv = rows.map(r=>r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sv-' + module + '-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 0);
  svToast('CSV exported');
}

/* ---------------- ADMIN: USER MANAGEMENT ---------------- */
async function openUsersManager(){
  const overlay = document.getElementById('form-modal-overlay');
  const modal = document.getElementById('form-modal');
  if(!window.SVApi || window.SVApi.isLocal()){
    svToast('User management needs the remote API — sign in with your API URL.','error');
    return;
  }
  modal.innerHTML = `<h3>Portal Users</h3><div class="sv-form-body">Loading…</div>`;
  overlay.classList.add('active');
  let users = [];
  try{
    const data = await window.SVApi.listUsers();
    users = (data && data.users) || [];
  }catch(e){
    modal.innerHTML = `<h3>Portal Users</h3><div class="sv-form-error">${e && e.message ? e.message : 'Could not load users'}</div>
      <div class="actions"><button class="btn-ghost" onclick="closeFormModal()">Close</button></div>`;
    return;
  }
  modal.innerHTML = `
    <h3>Portal Users</h3>
    <div class="sv-form-body">
      <table style="width:100%;font-size:12px;">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
        <tbody>
          ${users.map(u=>`
            <tr>
              <td>${u.name}</td><td>${u.email}</td><td>${u.role}</td>
              <td style="text-align:right;">
                ${window.SV_USER && Number(window.SV_USER.id)===Number(u.id)
                  ? '<span style="color:var(--text-low);">you</span>'
                  : `<button class="btn-ghost" onclick='openUserEditForm(${JSON.stringify({id:u.id,name:u.name,email:u.email,role:u.role}).replace(/'/g,"&#39;")})' style="font-size:11px;">Edit</button> <button class="btn-ghost" onclick="svDeleteUser(${u.id})" style="font-size:11px;">Delete</button>`}
              </td>
            </tr>`).join('') || `<tr><td colspan="4">No users yet.</td></tr>`}
        </tbody>
      </table>
    </div>
    <div class="actions">
      <button class="btn-ghost" onclick="closeFormModal()">Close</button>
      <button class="btn-ghost" onclick="openActivityLog()">📜 Activity</button>
      <button class="btn-ghost" onclick="svBackupExport()">⬇ Backup</button>
      <button class="btn-ghost" onclick="svBackupImport()">⬆ Restore</button>
      <button class="btn-primary" onclick="openUserForm()">+ Add user</button>
    </div>
  `;
}
function openUserForm(){
  openEntityForm({
    title: 'Add Portal User',
    hint: 'The user signs in with this email and password on the login screen.',
    submitLabel: 'Create user',
    fields: [
      {key:'name', label:'Full name', required:true},
      {key:'email', label:'Email', type:'email', required:true},
      {key:'password', label:'Password', required:true, placeholder:'At least 8 characters'},
      {key:'role', label:'Role', type:'select', options:['member','admin'], value:'member'},
    ],
    validate: (v)=> String(v.password||'').length < 8 ? 'Password must be at least 8 characters.' : null,
    onSubmit: async (v)=>{
      await window.SVApi.createUser(v);
      svToast('User created');
      openUsersManager();
    },
  });
}
async function svDeleteUser(id){
  if(!confirm('Delete this user? They will lose access immediately.')) return;
  try{
    await window.SVApi.deleteUser(id);
    svToast('User deleted');
    openUsersManager();
  }catch(e){
    svToast((e && e.message) || 'Could not delete user', 'error');
  }
}
window.svExportCsv = svExportCsv;
window.openUsersManager = openUsersManager;
window.openUserForm = openUserForm;
window.svDeleteUser = svDeleteUser;

function openUserEditForm(u){
  openEntityForm({
    title: 'Edit Portal User',
    hint: 'Leave the password empty to keep it. Setting a new one signs the user out everywhere.',
    submitLabel: 'Save changes',
    fields: [
      {key:'name', label:'Full name', required:true, value:u.name},
      {key:'email', label:'Email', type:'email', required:true, value:u.email},
      {key:'role', label:'Role', type:'select', options:['member','admin'], value:u.role},
      {key:'password', label:'New password (optional)', placeholder:'At least 8 characters'},
    ],
    validate: (v)=> v.password && String(v.password).length < 8 ? 'Password must be at least 8 characters.' : null,
    onSubmit: async (v)=>{
      const payload = {name:v.name, email:v.email, role:v.role};
      if(v.password) payload.password = v.password;
      await window.SVApi.updateUser(u.id, payload);
      svToast('User updated');
      openUsersManager();
    },
  });
}
function openPasswordForm(){
  openEntityForm({
    title: 'Change Your Password',
    submitLabel: 'Update password',
    fields: [
      {key:'current', label:'Current password', required:true},
      {key:'next', label:'New password', required:true, placeholder:'At least 8 characters'},
      {key:'confirm', label:'Repeat new password', required:true},
    ],
    validate: (v)=> String(v.next).length<8 ? 'New password must be at least 8 characters.' : v.next!==v.confirm ? 'The new passwords do not match.' : null,
    onSubmit: async (v)=>{ await window.SVApi.changePassword(v.current, v.next); svToast('Password updated'); },
  });
}
async function openActivityLog(){
  const modal = document.getElementById('form-modal');
  document.getElementById('form-modal-overlay').classList.add('active');
  modal.innerHTML = `<h3>Activity History</h3><div class="sv-form-body">Loading…</div>`;
  let remoteItems = [];
  let localItems = [];
  try {
    const raw = JSON.parse(localStorage.getItem('sv_activity_log') || '[]');
    localItems = Array.isArray(raw) ? raw : [];
  } catch (e) {
    localItems = [];
  }
  try {
    if (window.SVApi && !window.SVApi.isLocal()) {
      remoteItems = (await window.SVApi.activity(300)).items || [];
    }
  } catch (e) {
    remoteItems = [];
  }
  const merged = [...remoteItems, ...localItems]
    .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
    .slice(0, 300);
  const label = {save:'Saved',create:'Created',update:'Updated',delete:'Deleted',login:'Signed in',login_failed:'Failed sign-in',password_change:'Changed password',user_create:'Added user',user_update:'Edited user',user_delete:'Removed user',backup_export:'Downloaded backup',backup_restore:'Restored backup'};
  modal.innerHTML = `<h3>Activity History</h3>
    <div class="sv-form-body" style="max-height:60vh;overflow:auto;">
      <table style="width:100%;font-size:12px;"><thead><tr><th>When</th><th>User</th><th>Action</th><th>Module</th><th>Description</th></tr></thead><tbody>
      ${merged.map(a=>`<tr><td>${svEscape((a.created_at || a.createdAt || '').slice(0,19).replace('T',' '))}</td><td>${svEscape(a.user_name || '—')}</td><td>${svEscape(label[a.action] || a.action || 'Saved')}</td><td>${svEscape(String(a.target || '').replace('svops:','').replace(/^auth$/, 'Authentication'))}</td><td>${svEscape(a.detail || 'No additional description')}</td></tr>`).join('') || '<tr><td colspan="5">No activity yet.</td></tr>'}
      </tbody></table></div>
    <div class="actions"><button class="btn-ghost" onclick="closeFormModal()">Close</button>${window.SVApi && !window.SVApi.isLocal() ? '<button class="btn-ghost" onclick="openUsersManager()">Back</button>' : ''}</div>`;
}
async function svBackupExport(){
  try{
    const data = await window.SVApi.backupExport();
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sv-portal-backup-' + new Date().toISOString().slice(0,10) + '.json';
    a.click(); URL.revokeObjectURL(a.href);
    svToast('Backup downloaded');
  }catch(e){ svToast(e.message||'Backup failed','error'); }
}
function svBackupImport(){
  const input = document.createElement('input');
  input.type='file'; input.accept='application/json,.json';
  input.onchange = async ()=>{
    const f = input.files && input.files[0]; if(!f) return;
    if(!confirm('Restore this backup? It replaces current data in every module included in the file.')) return;
    try{
      const parsed = JSON.parse(await f.text());
      const res = await window.SVApi.backupImport({data: parsed.data || parsed});
      Object.keys(parsed.data||parsed).forEach(k=>localStorage.removeItem('cache:'+k));
      svToast('Restored ' + res.restored + ' modules — reloading');
      setTimeout(()=>location.reload(), 800);
    }catch(e){ svToast(e.message||'That file is not a valid backup','error'); }
  };
  input.click();
}
window.openUserEditForm = openUserEditForm;
window.openPasswordForm = openPasswordForm;
window.openActivityLog = openActivityLog;
window.svBackupExport = svBackupExport;
window.svBackupImport = svBackupImport;
