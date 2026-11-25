// ===== Admin Dashboard =====
document.addEventListener('DOMContentLoaded', () => {
  const data = loadData();
  const members = data.members || [];

  // Sidebar name
  const siteName = data.settings.title || 'GODMYEGXO';
  const el = document.getElementById('sidebarSiteName');
  if (el) el.textContent = siteName;

  // Stats
  document.getElementById('totalMembers').textContent = members.length;
  document.getElementById('totalFounders').textContent = members.filter(m => m.rank === 'founder').length;
  document.getElementById('totalLeaders').textContent = members.filter(m => m.rank === 'leader').length;

  // Activity
  const log = document.getElementById('activityLog');
  if (data.activity && data.activity.length) {
    log.innerHTML = data.activity.slice(0, 8).map(a => `
      <div class="activity-item">
        <div class="activity-icon"><i class="fas fa-info-circle"></i></div>
        <div class="activity-content">
          <strong>${a.text}</strong>
          <small>${a.time}</small>
        </div>
      </div>
    `).join('');
  }
});
