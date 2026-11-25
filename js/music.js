// ===== Background Music Player =====
// รองรับ YouTube + ไฟล์เสียงตรง
// หมายเหตุ: YouTube เล่นได้ดีเมื่อรันผ่าน localhost / โฮสต์จริง (ไม่ใช่ file://)

let ytIframe = null;
let audioEl = null;
let isPlaying = false;
let currentVolume = 50;
let videoId = null;
let hasUnlocked = false;
let mode = null; // 'youtube' | 'audio'

function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const u = url.trim();
    if (u.includes('youtu.be/')) return u.split('youtu.be/')[1].split(/[?&]/)[0];
    if (u.includes('v=')) return u.split('v=')[1].split('&')[0];
    if (u.includes('/embed/')) return u.split('/embed/')[1].split(/[?&]/)[0];
    if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return u;
  } catch (e) {}
  return null;
}

function isFileProtocol() {
  return location.protocol === 'file:';
}

function setTrackName(text) {
  const el = document.getElementById('trackName');
  if (el) el.textContent = text;
}

function updatePlayButton(playing) {
  const btn = document.getElementById('playPauseBtn');
  if (!btn) return;
  btn.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

function showFileProtocolWarning() {
  const mini = document.getElementById('miniPlayer');
  if (!mini) return;
  let tip = document.getElementById('music-tip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'music-tip';
    tip.style.cssText = 'position:fixed;bottom:90px;right:24px;background:#1a1a2e;border:1px solid #c9a227;color:#eee;padding:10px 14px;border-radius:12px;font-size:12px;max-width:280px;z-index:200;line-height:1.4;';
    tip.innerHTML = '⚠️ เปิดแบบไฟล์ตรง YouTube อาจไม่มีเสียง<br>แนะนำ: ใช้ <b>Live Server</b> หรืออัปขึ้นโฮสต์';
    document.body.appendChild(tip);
    setTimeout(() => tip.remove(), 8000);
  }
}

function createYouTubePlayer(id, withSound) {
  if (ytIframe) {
    try { ytIframe.remove(); } catch(e) {}
    ytIframe = null;
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'yt-bg-player';
  iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText = 'position:fixed;width:320px;height:180px;bottom:100px;right:24px;border:0;border-radius:12px;z-index:150;opacity:0.01;pointer-events:none;';
  
  // ใช้ youtube-nocookie บางทีผ่านง่ายกว่า
  const muteParam = withSound ? '0' : '1';
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${muteParam}&loop=1&playlist=${id}&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&rel=0&origin=${encodeURIComponent(location.origin || '')}`;

  document.body.appendChild(iframe);
  ytIframe = iframe;
  isPlaying = true;
  updatePlayButton(true);
}

function unlockYouTube() {
  if (hasUnlocked || !videoId) return;
  hasUnlocked = true;

  if (isFileProtocol()) {
    showFileProtocolWarning();
  }

  // โหลดใหม่แบบมีเสียง
  createYouTubePlayer(videoId, true);
  setTrackName('♪ Ariana Grande - bye [Altare Remix]');
}

function setupMusicPlayer(settings) {
  const miniPlayer = document.getElementById('miniPlayer');
  const playBtn = document.getElementById('playPauseBtn');
  const volumeSlider = document.getElementById('volumeSlider');

  if (!settings || !settings.musicUrl || !String(settings.musicUrl).trim()) {
    if (miniPlayer) miniPlayer.style.display = 'none';
    return;
  }

  // เปิด/ปิดการแสดง Mini Player จาก Admin
  const showPlayer = settings.showPlayer !== false;
  if (miniPlayer) {
    miniPlayer.style.display = showPlayer ? 'flex' : 'none';
  }
  currentVolume = settings.volume || 50;
  if (volumeSlider) volumeSlider.value = currentVolume;

  videoId = extractYouTubeId(settings.musicUrl);

  if (videoId) {
    mode = 'youtube';
    setTrackName('Ariana Grande - bye [Altare Remix]');

    // เริ่มแบบ muted ก่อน (autoplay ผ่าน)
    createYouTubePlayer(videoId, false);

    // ปลดล็อกเสียงเมื่อมี interaction
    const unlock = () => {
      unlockYouTube();
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    if (playBtn) {
      playBtn.onclick = (e) => {
        e.stopPropagation();
        if (!hasUnlocked) {
          unlockYouTube();
          return;
        }
        if (isPlaying) {
          if (ytIframe) ytIframe.remove();
          ytIframe = null;
          isPlaying = false;
          updatePlayButton(false);
        } else {
          createYouTubePlayer(videoId, true);
        }
      };
    }
  } else {
    // ไฟล์เสียงตรง
    mode = 'audio';
    audioEl = document.getElementById('bgMusic');
    if (!audioEl) return;
    audioEl.src = settings.musicUrl;
    audioEl.loop = true;
    audioEl.volume = currentVolume / 100;
    setTrackName('Background Music');

    const tryPlay = () => {
      audioEl.play().then(() => {
        isPlaying = true;
        updatePlayButton(true);
      }).catch(() => {});
    };

    tryPlay();
    document.addEventListener('click', tryPlay, { once: true });

    if (playBtn) {
      playBtn.onclick = () => {
        if (isPlaying) {
          audioEl.pause();
          isPlaying = false;
          updatePlayButton(false);
        } else {
          audioEl.play().then(() => {
            isPlaying = true;
            updatePlayButton(true);
          });
        }
      };
    }
  }

  if (volumeSlider) {
    volumeSlider.oninput = (e) => {
      currentVolume = parseInt(e.target.value, 10);
      if (audioEl) audioEl.volume = currentVolume / 100;
    };
  }
}
