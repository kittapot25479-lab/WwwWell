// ===== Members Page Logic =====
let allMembers = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataAsync();
  const s = data.settings;
  allMembers = data.members || [];

  applyAllSettings(s);
  renderMembers(allMembers, 'all');

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      applyFilters(e.target.value.toLowerCase().trim());
    });
  }

  setupMusicPlayer(s);
});

function applyFilters(searchQuery = '') {
  let list = allMembers;
  if (currentFilter !== 'all') {
    list = list.filter(m => m.rank === currentFilter);
  }
  if (searchQuery) {
    list = list.filter(m => m.name.toLowerCase().includes(searchQuery));
  }
  renderMembers(list, currentFilter);
}

function setRankFilter(rank) {
  currentFilter = rank;
  const searchInput = document.getElementById('searchInput');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';
  applyFilters(searchVal);
}

function renderMembers(list, filter) {
  const founders = list.filter(m => m.rank === 'founder');
  const leaders = list.filter(m => m.rank === 'leader');
  const members = list.filter(m => m.rank === 'member');

  const totalFounders = allMembers.filter(m => m.rank === 'founder').length;
  const totalLeaders = allMembers.filter(m => m.rank === 'leader').length;
  const totalMembers = allMembers.filter(m => m.rank === 'member').length;

  const rankStats = document.getElementById('rankStats');
  if (rankStats) {
    rankStats.innerHTML = `
      <div class="rank-badge all ${filter === 'all' ? 'active' : ''}" data-rank="all" onclick="setRankFilter('all')">
        <i class="fas fa-globe"></i> ทั้งหมด ${allMembers.length}
      </div>
      <div class="rank-badge founder ${filter === 'founder' ? 'active' : ''}" data-rank="founder" onclick="setRankFilter('founder')">
        <i class="fas fa-crown"></i> FOUNDERS ${totalFounders}
      </div>
      <div class="rank-badge leader ${filter === 'leader' ? 'active' : ''}" data-rank="leader" onclick="setRankFilter('leader')">
        <i class="fas fa-star"></i> LEADERS ${totalLeaders}
      </div>
      <div class="rank-badge member ${filter === 'member' ? 'active' : ''}" data-rank="member" onclick="setRankFilter('member')">
        <i class="fas fa-users"></i> MEMBERS ${totalMembers}
      </div>
    `;
  }

  const foundersSec = document.getElementById('foundersSection');
  const leadersSec = document.getElementById('leadersSection');
  const membersSec = document.getElementById('membersSection');

  if (foundersSec) {
    if (filter === 'all' || filter === 'founder') {
      foundersSec.style.display = 'block';
      const countEl = document.getElementById('foundersCount');
      if (countEl) countEl.textContent = `/ ${String(founders.length).padStart(2, '0')}`;
      const grid = document.getElementById('foundersGrid');
      if (grid) grid.innerHTML = founders.map(createCard).join('') || '<p class="empty-msg">ยังไม่มีสมาชิก</p>';
    } else {
      foundersSec.style.display = 'none';
    }
  }

  if (leadersSec) {
    if (filter === 'all' || filter === 'leader') {
      leadersSec.style.display = 'block';
      const countEl = document.getElementById('leadersCount');
      if (countEl) countEl.textContent = `/ ${String(leaders.length).padStart(2, '0')}`;
      const grid = document.getElementById('leadersGrid');
      if (grid) grid.innerHTML = leaders.map(createCard).join('') || '<p class="empty-msg">ยังไม่มีสมาชิก</p>';
    } else {
      leadersSec.style.display = 'none';
    }
  }

  if (membersSec) {
    if (filter === 'all' || filter === 'member') {
      membersSec.style.display = 'block';
      const countEl = document.getElementById('membersCount');
      if (countEl) countEl.textContent = `/ ${String(members.length).padStart(2, '0')}`;
      const grid = document.getElementById('membersGrid');
      if (grid) grid.innerHTML = members.map(createCard).join('') || '<p class="empty-msg">ยังไม่มีสมาชิก</p>';
    } else {
      membersSec.style.display = 'none';
    }
  }
}

function createCard(m) {
  const avatar = m.avatar || getDefaultAvatar(m.name);
  const fb = m.facebook ? `<a href="${m.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook"></i></a>` : '';
  const other = m.otherLink ? `<a href="${m.otherLink}" target="_blank" title="Link"><i class="fas fa-link"></i></a>` : '';

  return `
    <div class="member-card">
      <img class="member-avatar" src="${avatar}" alt="${m.name}" onerror="this.src='${getDefaultAvatar(m.name)}'" />
      <div class="member-info">
        <div class="member-name">${m.name}</div>
        <span class="member-rank-tag ${m.rank}">${getRankLabel(m.rank)}</span>
      </div>
      <div class="member-links">${fb}${other}</div>
    </div>
  `;
}

window.setRankFilter = setRankFilter;
