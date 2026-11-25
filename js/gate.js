// ===== Gate Page Logic =====
document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataAsync();
  const s = data.settings;

  applyAllSettings(s);

  const socialEl = document.getElementById('socialLinks');
  if (socialEl) {
    socialEl.innerHTML = '';
    if (s.discord) {
      socialEl.innerHTML += `<a href="${s.discord}" target="_blank" title="Discord"><i class="fab fa-discord"></i></a>`;
    }
    if (s.facebook) {
      socialEl.innerHTML += `<a href="${s.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>`;
    }
  }

  const enterBtn = document.getElementById('enterBtn');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      window.location.href = 'members.html';
    });
  }

  setupMusicPlayer(s);
});
