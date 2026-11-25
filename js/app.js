// ===== GODMYEGXO Unified App =====
let allMembers = [];
let currentFilter = 'all';
let currentEditId = null;
let currentView = 'gate';
let snowEnabled = true;
let snowAnimId = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await loadDataAsync();
    allMembers = data.members || [];
    applyAllUI(data.settings);
    setupMusicPlayer(data.settings);
  } catch (err) {
    console.error('Init error:', err);
    allMembers = (typeof defaultData !== 'undefined' ? defaultData.members : []) || [];
    try { applyAllUI(typeof defaultData !== 'undefined' ? defaultData.settings : {}); } catch(e) {}
  }
  setupSnow();
  setupNavigation();
  setupAdmin();
  setupMemberCRUD();
  showView('gate');
  try { updateDbStatusUI(); } catch(e) {}
});

function applyAllUI(s) {
  if (typeof applyAllSettings === 'function') applyAllSettings(s);
  else if (typeof applyTheme === 'function') applyTheme(s.theme || 'default', s.accent);

  const title = s.title || 'GODMYEGXO';
  const sub = s.subtitle || 'EST. 2026';
  document.getElementById('siteTitle').textContent = title;
  document.getElementById('siteSubtitle').textContent = sub;
  document.getElementById('membersTitle').textContent = title;
  document.getElementById('membersSubtitle').textContent = sub;
  document.getElementById('enterText').textContent = s.enterText || 'ENTER';
  document.getElementById('sidebarSiteName').textContent = title;

  // Logo
  const logoArea = document.getElementById('gateLogoArea');
  if (s.logo) {
    logoArea.innerHTML = `<img class="gate-logo-img" src="${s.logo}" alt="logo" onerror="this.outerHTML='<div class=\\'logo-circle\\'><i class=\\'fas fa-crown\\'></i></div>'" />`;
  } else {
    logoArea.innerHTML = `<div class="logo-circle" id="defaultLogo"><i class="fas fa-crown"></i></div>`;
  }

  // Backgrounds
  const op = (s.overlayOpacity != null ? s.overlayOpacity : 55) / 100;
  document.documentElement.style.setProperty('--overlay-opacity', op.toFixed(2));
  const gate = document.getElementById('view-gate');
  if (s.bgGate) {
    gate.style.backgroundImage = `url('${s.bgGate}')`;
    gate.style.backgroundSize = 'cover';
    gate.style.backgroundPosition = 'center';
  } else {
    gate.style.backgroundImage = '';
  }
  const members = document.getElementById('view-members');
  if (s.bgMembers) {
    members.style.backgroundImage = `linear-gradient(rgba(7,7,12,${op}), rgba(7,7,12,${Math.min(op+0.15,0.95)})), url('${s.bgMembers}')`;
    members.style.backgroundSize = 'cover';
    members.style.backgroundPosition = 'center';
    members.style.backgroundAttachment = 'fixed';
  } else {
    members.style.backgroundImage = '';
  }
  // Transparent cards slightly when overlay is low
  if (op < 0.4) {
    document.documentElement.style.setProperty('--card', 'rgba(18,18,26,0.55)');
  }

  // Social
  const social = document.getElementById('socialLinks');
  social.innerHTML = '';
  if (s.discord) social.innerHTML += `<a href="${s.discord}" target="_blank"><i class="fab fa-discord"></i></a>`;
  if (s.facebook) social.innerHTML += `<a href="${s.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>`;

  snowEnabled = s.snow !== 'off';

  // Fill settings form
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('settingTitle', s.title);
  set('settingSubtitle', s.subtitle);
  set('settingEnterText', s.enterText);
  set('settingDiscord', s.discord);
  set('settingFacebook', s.facebook);
  set('settingLogo', s.logo);
  set('settingBgGate', s.bgGate);
  set('settingBgMembers', s.bgMembers);
  set('settingMusicUrl', s.musicUrl);
  set('settingAccent', s.accent || '#c9a227');
  set('settingCustomBg', s.customBg || '#0a0a0f');
  set('settingCustomCard', s.customCard || '#12121a');
  const overlayEl = document.getElementById('settingOverlay');
  if (overlayEl) {
    overlayEl.value = s.overlayOpacity != null ? s.overlayOpacity : 55;
    const ov = document.getElementById('overlayValue');
    if (ov) ov.textContent = (s.overlayOpacity != null ? s.overlayOpacity : 55) + '%';
  }
  const vol = document.getElementById('settingVolume');
  if (vol) { vol.value = s.volume || 50; document.getElementById('volumeValue').textContent = (s.volume || 50) + '%'; }
  const snowSel = document.getElementById('settingSnow');
  if (snowSel) snowSel.value = s.snow === 'off' ? 'off' : 'on';
  const ap = document.getElementById('settingAutoPlay');
  if (ap) ap.checked = s.autoPlay !== false;
  const sp = document.getElementById('settingShowPlayer');
  if (sp) sp.checked = s.showPlayer !== false;
  const themeRadio = document.querySelector(`input[name="theme"][value="${s.theme || 'default'}"]`);
  if (themeRadio) themeRadio.checked = true;
}

function showView(name) {
  currentView = name;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById('view-' + name);
  if (el) el.classList.add('active');

  // Hide admin fab on admin view
  const fab = document.getElementById('adminFab');
  if (fab) fab.style.display = name === 'admin' ? 'none' : 'flex';

  if (name === 'members') {
    renderPublicMembers(allMembers, currentFilter);
  }
  if (name === 'admin') {
    refreshAdminDashboard();
    renderAdminMembersTable();
  }
}

function setupNavigation() {
  document.getElementById('enterBtn').addEventListener('click', () => showView('members'));
  document.getElementById('adminFab').addEventListener('click', () => openAdminLogin());
  document.getElementById('backToSite').addEventListener('click', () => {
    adminUnlocked = false;
    showView('gate');
  });

  // Admin password
  document.getElementById('submitAdminPass').addEventListener('click', tryAdminLogin);
  document.getElementById('cancelAdminPass').addEventListener('click', closeAdminLogin);
  document.getElementById('adminPasswordInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') tryAdminLogin();
  });

  document.querySelectorAll('.nav-item[data-admin]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item[data-admin]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sec = btn.dataset.admin;
      document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
      document.getElementById('admin-' + sec).style.display = 'block';
      const titles = { dashboard: 'ภาพรวม', members: 'จัดการสมาชิก', settings: 'ตั้งค่าเว็บไซต์' };
      document.getElementById('adminPageTitle').textContent = titles[sec] || '';
      if (sec === 'members') renderAdminMembersTable();
    });
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    applyPublicFilter(e.target.value.toLowerCase().trim());
  });
}

function applyPublicFilter(q) {
  let list = allMembers;
  if (currentFilter !== 'all') list = list.filter(m => m.rank === currentFilter);
  if (q) list = list.filter(m => m.name.toLowerCase().includes(q));
  renderPublicMembers(list, currentFilter);
}

window.setRankFilter = function(rank) {
  currentFilter = rank;
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  applyPublicFilter(q);
};

function renderPublicMembers(list, filter) {
  const founders = list.filter(m => m.rank === 'founder');
  const leaders = list.filter(m => m.rank === 'leader');
  const members = list.filter(m => m.rank === 'member');
  const tF = allMembers.filter(m => m.rank === 'founder').length;
  const tL = allMembers.filter(m => m.rank === 'leader').length;
  const tM = allMembers.filter(m => m.rank === 'member').length;

  document.getElementById('rankStats').innerHTML = `
    <div class="rank-badge all ${filter==='all'?'active':''}" onclick="setRankFilter('all')"><i class="fas fa-globe"></i> ทั้งหมด ${allMembers.length}</div>
    <div class="rank-badge founder ${filter==='founder'?'active':''}" onclick="setRankFilter('founder')"><i class="fas fa-crown"></i> FOUNDERS ${tF}</div>
    <div class="rank-badge leader ${filter==='leader'?'active':''}" onclick="setRankFilter('leader')"><i class="fas fa-star"></i> LEADERS ${tL}</div>
    <div class="rank-badge member ${filter==='member'?'active':''}" onclick="setRankFilter('member')"><i class="fas fa-users"></i> MEMBERS ${tM}</div>
  `;

  const show = (sec, grid, arr, countId) => {
    const el = document.getElementById(sec);
    if (filter === 'all' || filter === sec.replace('Section','').replace('founders','founder').replace('leaders','leader').replace('members','member')) {
      // simpler
    }
  };

  const mapSec = { founder: 'founders', leader: 'leaders', member: 'members' };
  ['founder','leader','member'].forEach(r => {
    const sec = document.getElementById(mapSec[r] + 'Section');
    const grid = document.getElementById(mapSec[r] + 'Grid');
    const count = document.getElementById(mapSec[r] + 'Count');
    const arr = r === 'founder' ? founders : r === 'leader' ? leaders : members;
    if (filter === 'all' || filter === r) {
      sec.style.display = 'block';
      count.textContent = `/ ${String(arr.length).padStart(2,'0')}`;
      grid.innerHTML = arr.map(createCard).join('') || '<p class="empty-msg">ยังไม่มีสมาชิก</p>';
    } else {
      sec.style.display = 'none';
    }
  });
}

function createCard(m) {
  const avatar = m.avatar || getDefaultAvatar(m.name);
  const fb = m.facebook ? `<a href="${m.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : '';
  const other = m.otherLink ? `<a href="${m.otherLink}" target="_blank"><i class="fas fa-link"></i></a>` : '';
  return `<div class="member-card">
    <img class="member-avatar" src="${avatar}" alt="" onerror="this.src='${getDefaultAvatar(m.name)}'" />
    <div class="member-info">
      <div class="member-name">${m.name}</div>
      <span class="member-rank-tag ${m.rank}">${getRankLabel(m.rank)}</span>
    </div>
    <div class="member-links">${fb}${other}</div>
  </div>`;
}

function refreshAdminDashboard() {
  document.getElementById('statTotal').textContent = allMembers.length;
  document.getElementById('statFounders').textContent = allMembers.filter(m => m.rank === 'founder').length;
  document.getElementById('statLeaders').textContent = allMembers.filter(m => m.rank === 'leader').length;
  document.getElementById('statMembers').textContent = allMembers.filter(m => m.rank === 'member').length;
}

function renderAdminMembersTable(search = '') {
  let list = allMembers;
  if (search) list = list.filter(m => m.name.toLowerCase().includes(search));
  const tbody = document.getElementById('membersTableBody');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:30px">ยังไม่มีสมาชิก</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(m => {
    const avatar = m.avatar || getDefaultAvatar(m.name);
    return `<tr>
      <td><div class="member-cell"><img src="${avatar}" onerror="this.src='${getDefaultAvatar(m.name)}'" /><div><strong>${m.name}</strong></div></div></td>
      <td><span class="rank-badge ${m.rank}" style="cursor:default">${getRankLabel(m.rank)}</span></td>
      <td><div class="action-btns">
        <button onclick="editMember('${m.id}')"><i class="fas fa-pen"></i></button>
        <button class="delete" onclick="deleteMemberConfirm('${m.id}')"><i class="fas fa-trash"></i></button>
      </div></td>
    </tr>`;
  }).join('');
}

function setupMemberCRUD() {
  document.getElementById('addMemberBtn').addEventListener('click', () => openModal());
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('memberSearch').addEventListener('input', e => {
    renderAdminMembersTable(e.target.value.toLowerCase().trim());
  });
  document.getElementById('memberForm').addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('memberName').value.trim();
    if (!name) return;
    const member = {
      id: currentEditId || String(Date.now()),
      name,
      rank: document.getElementById('memberRank').value,
      avatar: document.getElementById('memberAvatar').value.trim(),
      facebook: document.getElementById('memberFacebook').value.trim(),
      otherLink: document.getElementById('memberOtherLink').value.trim()
    };
    const saved = await saveMemberAsync(member);
    const idx = allMembers.findIndex(m => m.id === saved.id);
    if (idx >= 0) allMembers[idx] = saved;
    else allMembers.push(saved);
    closeModal();
    renderAdminMembersTable();
    refreshAdminDashboard();
    addActivity((currentEditId ? 'แก้ไข' : 'เพิ่ม') + 'สมาชิก: ' + name);
  });
}

function openModal(member = null) {
  currentEditId = member ? member.id : null;
  document.getElementById('modalTitle').textContent = member ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิก';
  document.getElementById('memberId').value = member ? member.id : '';
  document.getElementById('memberName').value = member ? member.name : '';
  document.getElementById('memberRank').value = member ? member.rank : 'member';
  document.getElementById('memberAvatar').value = member ? (member.avatar || '') : '';
  document.getElementById('memberFacebook').value = member ? (member.facebook || '') : '';
  document.getElementById('memberOtherLink').value = member ? (member.otherLink || '') : '';
  document.getElementById('memberModal').classList.add('show');
}
function closeModal() {
  document.getElementById('memberModal').classList.remove('show');
  currentEditId = null;
}
window.editMember = id => {
  const m = allMembers.find(x => x.id === id);
  if (m) openModal(m);
};
window.deleteMemberConfirm = async id => {
  if (!confirm('ลบสมาชิกคนนี้?')) return;
  await deleteMemberAsync(id);
  allMembers = allMembers.filter(m => m.id !== id);
  renderAdminMembersTable();
  refreshAdminDashboard();
};

function setupAdmin() {
  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  document.getElementById('settingVolume').addEventListener('input', e => {
    document.getElementById('volumeValue').textContent = e.target.value + '%';
  });
  const overlaySlider = document.getElementById('settingOverlay');
  if (overlaySlider) {
    overlaySlider.addEventListener('input', e => {
      document.getElementById('overlayValue').textContent = e.target.value + '%';
    });
  }

  document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
    const settings = {
      title: document.getElementById('settingTitle').value.trim() || 'GODMYEGXO',
      subtitle: document.getElementById('settingSubtitle').value.trim() || 'EST. 2026',
      enterText: document.getElementById('settingEnterText').value.trim() || 'ENTER',
      discord: document.getElementById('settingDiscord').value.trim(),
      facebook: document.getElementById('settingFacebook').value.trim(),
      logo: document.getElementById('settingLogo').value.trim(),
      bgGate: document.getElementById('settingBgGate').value.trim(),
      bgMembers: document.getElementById('settingBgMembers').value.trim(),
      accent: document.getElementById('settingAccent').value,
      customBg: document.getElementById('settingCustomBg')?.value || '',
      customCard: document.getElementById('settingCustomCard')?.value || '',
      overlayOpacity: parseInt(document.getElementById('settingOverlay')?.value || '55'),
      theme: document.querySelector('input[name="theme"]:checked')?.value || 'default',
      musicUrl: document.getElementById('settingMusicUrl').value.trim(),
      volume: parseInt(document.getElementById('settingVolume').value) || 50,
      autoPlay: document.getElementById('settingAutoPlay').checked,
      showPlayer: document.getElementById('settingShowPlayer').checked,
      snow: document.getElementById('settingSnow').value
    };
    try {
      await saveSettingsAsync(settings);
      applyAllUI(settings);
      setupMusicPlayer(settings);
      snowEnabled = settings.snow !== 'off';
      if (snowEnabled) startSnow(); else stopSnow();
      alert('บันทึกการตั้งค่าเรียบร้อย!');
      addActivity('อัปเดตการตั้งค่าเว็บไซต์');
    } catch (err) {
      console.error(err);
      // still apply locally even if something fails
      applyAllUI(settings);
      alert('บันทึกในเครื่องแล้ว (บางส่วนอาจยังไม่ซิงค์ Database)');
    }
  });

  document.getElementById('resetAllBtn').addEventListener('click', () => {
    if (confirm('ลบข้อมูลทั้งหมด?') && confirm('ยืนยันอีกครั้ง')) {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  });
}


const ADMIN_PASSWORD = 'devwell';
let adminUnlocked = false;

function openAdminLogin() {
  if (adminUnlocked) {
    showView('admin');
    return;
  }
  document.getElementById('adminPasswordInput').value = '';
  document.getElementById('adminPassError').style.display = 'none';
  document.getElementById('adminPassModal').classList.add('show');
  setTimeout(() => document.getElementById('adminPasswordInput').focus(), 100);
}

function closeAdminLogin() {
  document.getElementById('adminPassModal').classList.remove('show');
}

function tryAdminLogin() {
  const pass = document.getElementById('adminPasswordInput').value;
  if (pass === ADMIN_PASSWORD) {
    adminUnlocked = true;
    closeAdminLogin();
    showView('admin');
  } else {
    document.getElementById('adminPassError').style.display = 'block';
    document.getElementById('adminPasswordInput').value = '';
    document.getElementById('adminPasswordInput').focus();
  }
}

/* ========== SNOW ========== */
function setupSnow() {
  if (snowEnabled) startSnow();
}

function startSnow() {
  stopSnow();
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, flakes = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,
      s: Math.random() * 1.2 + 0.4,
      o: Math.random() * 0.5 + 0.3
    });
  }

  function draw() {
    if (!snowEnabled) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    flakes.forEach(f => {
      ctx.globalAlpha = f.o;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.s;
      f.x += Math.sin(f.y * 0.01) * 0.5;
      if (f.y > h) { f.y = -5; f.x = Math.random() * w; }
    });
    ctx.globalAlpha = 1;
    snowAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function stopSnow() {
  if (snowAnimId) cancelAnimationFrame(snowAnimId);
  snowAnimId = null;
  const canvas = document.getElementById('snow-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
