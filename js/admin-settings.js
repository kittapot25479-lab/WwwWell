// ===== Admin Settings =====
document.addEventListener('DOMContentLoaded', async () => {
  updateDbStatusUI();
  const data = loadData();
  const s = data.settings;

  if (document.getElementById('sidebarSiteName')) {
    document.getElementById('sidebarSiteName').textContent = s.title || 'GODMYEGXO';
  }

  // Fill form
  document.getElementById('settingTitle').value = s.title || '';
  document.getElementById('settingSubtitle').value = s.subtitle || '';
  document.getElementById('settingEnterText').value = s.enterText || 'ENTER';
  document.getElementById('settingFavicon').value = s.favicon || '';
  document.getElementById('settingBgGate').value = s.bgGate || '';
  document.getElementById('settingBgMembers').value = s.bgMembers || '';
  document.getElementById('settingLogo').value = s.logo || '';
  document.getElementById('settingDiscord').value = s.discord || '';
  document.getElementById('settingFacebook').value = s.facebook || '';
  document.getElementById('settingMusicUrl').value = s.musicUrl || '';
  document.getElementById('settingVolume').value = s.volume || 50;
  document.getElementById('volumeValue').textContent = (s.volume || 50) + '%';
  document.getElementById('settingAutoPlay').checked = !!s.autoPlay;
  const showPlayerEl = document.getElementById('settingShowPlayer');
  if (showPlayerEl) showPlayerEl.checked = s.showPlayer !== false;
  document.getElementById('settingParticles').value = s.particles || 'none';
  document.getElementById('settingAnimation').value = s.animation || 'fade';
  document.getElementById('settingAccent').value = s.accent || '#c9a227';

  // Theme
  const themeRadio = document.querySelector(`input[name="theme"][value="${s.theme || 'default'}"]`);
  if (themeRadio) themeRadio.checked = true;

  // Gate layout
  const layoutRadio = document.querySelector(`input[name="gateLayout"][value="${s.gateLayout || 'centered'}"]`);
  if (layoutRadio) layoutRadio.checked = true;

  // Player style
  const playerRadio = document.querySelector(`input[name="playerStyle"][value="${s.playerStyle || 'classic'}"]`);
  if (playerRadio) playerRadio.checked = true;

  // Tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  // Volume display
  document.getElementById('settingVolume').addEventListener('input', (e) => {
    document.getElementById('volumeValue').textContent = e.target.value + '%';
  });

  // Save
  document.getElementById('saveSettingsBtn').addEventListener('click', () => saveSettings());

  // Reset
  document.getElementById('resetAllBtn').addEventListener('click', () => {
    if (confirm('แน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      if (confirm('ยืนยันอีกครั้ง: ลบสมาชิกและการตั้งค่าทั้งหมด?')) {
        localStorage.removeItem(STORAGE_KEY);
        addActivity('รีเซ็ตระบบทั้งหมด');
        alert('ลบข้อมูลเรียบร้อยแล้ว กำลังรีเฟรช...');
        location.reload();
      }
    }
  });
});

async function saveSettings() {
  const data = await loadDataAsync();

  data.settings = {
    ...data.settings,
    title: document.getElementById('settingTitle').value.trim() || 'GODMYEGXO',
    subtitle: document.getElementById('settingSubtitle').value.trim() || 'EST. 2026',
    enterText: document.getElementById('settingEnterText').value.trim() || 'ENTER',
    favicon: document.getElementById('settingFavicon').value.trim(),
    bgGate: document.getElementById('settingBgGate').value.trim(),
    bgMembers: document.getElementById('settingBgMembers').value.trim(),
    logo: document.getElementById('settingLogo').value.trim(),
    discord: document.getElementById('settingDiscord').value.trim(),
    facebook: document.getElementById('settingFacebook').value.trim(),
    musicUrl: document.getElementById('settingMusicUrl').value.trim(),
    volume: parseInt(document.getElementById('settingVolume').value) || 50,
    autoPlay: document.getElementById('settingAutoPlay').checked,
    showPlayer: document.getElementById('settingShowPlayer') ? document.getElementById('settingShowPlayer').checked : true,
    particles: document.getElementById('settingParticles').value,
    animation: document.getElementById('settingAnimation').value,
    accent: document.getElementById('settingAccent').value,
    theme: document.querySelector('input[name="theme"]:checked')?.value || 'default',
    gateLayout: document.querySelector('input[name="gateLayout"]:checked')?.value || 'centered',
    playerStyle: document.querySelector('input[name="playerStyle"]:checked')?.value || 'classic'
  };

  await saveSettingsAsync(data.settings);
  addActivity('อัปเดตการตั้งค่าเว็บไซต์');
  alert('บันทึกการตั้งค่าเรียบร้อยแล้ว!');
  
  // Update sidebar name
  const el = document.getElementById('sidebarSiteName');
  if (el) el.textContent = data.settings.title;
}
