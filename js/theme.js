// ===== Theme Engine (20+ themes) =====
const THEMES = {
  default:   { bg:'#0a0a0f', card:'#12121a', border:'#1e1e2a', text:'#e8e8f0', muted:'#8b8ba0', accent:'#c9a227', founder:'#c9a227', leader:'#e74c3c', member:'#6b7280' },
  neon:      { bg:'#050d0a', card:'#0a1a14', border:'#0f2a20', text:'#e0fff0', muted:'#6bb89a', accent:'#00ff9d', founder:'#00ff9d', leader:'#00d4ff', member:'#6bb89a' },
  crimson:   { bg:'#0f0508', card:'#1a0a10', border:'#2a1018', text:'#ffe8ec', muted:'#b86b7a', accent:'#e74c3c', founder:'#ff6b6b', leader:'#e74c3c', member:'#b86b7a' },
  aurora:    { bg:'#07070f', card:'#0f0f1c', border:'#1a1a30', text:'#e8e8ff', muted:'#8b8bb8', accent:'#818cf8', founder:'#a78bfa', leader:'#818cf8', member:'#8b8bb8' },
  gold:      { bg:'#0f0c05', card:'#1a150a', border:'#2a2010', text:'#fff8e8', muted:'#b8a06b', accent:'#f0c14b', founder:'#f0c14b', leader:'#c9a227', member:'#b8a06b' },
  ocean:     { bg:'#050a0f', card:'#0a1520', border:'#102030', text:'#e8f4ff', muted:'#6b9ab8', accent:'#0ea5e9', founder:'#38bdf8', leader:'#0ea5e9', member:'#6b9ab8' },
  purple:    { bg:'#0a0612', card:'#140c20', border:'#221533', text:'#f0e8ff', muted:'#9b7ab8', accent:'#a855f7', founder:'#c084fc', leader:'#a855f7', member:'#9b7ab8' },
  rose:      { bg:'#10060c', card:'#1a0c14', border:'#2a1520', text:'#ffe8f0', muted:'#b87a9a', accent:'#f43f5e', founder:'#fb7185', leader:'#f43f5e', member:'#b87a9a' },
  mint:      { bg:'#050f0c', card:'#0a1a14', border:'#102a20', text:'#e8fff4', muted:'#6bb89a', accent:'#2dd4bf', founder:'#5eead4', leader:'#2dd4bf', member:'#6bb89a' },
  sunset:    { bg:'#0f0805', card:'#1a1008', border:'#2a1a10', text:'#fff0e8', muted:'#b8906b', accent:'#f97316', founder:'#fb923c', leader:'#ef4444', member:'#b8906b' },
  ice:       { bg:'#060a10', card:'#0c1420', border:'#142030', text:'#e8f4ff', muted:'#7a9ab8', accent:'#67e8f9', founder:'#a5f3fc', leader:'#22d3ee', member:'#7a9ab8' },
  forest:    { bg:'#060a06', card:'#0c140c', border:'#142014', text:'#e8ffe8', muted:'#7ab87a', accent:'#22c55e', founder:'#4ade80', leader:'#16a34a', member:'#7ab87a' },
  midnight:  { bg:'#04040a', card:'#0a0a14', border:'#12122a', text:'#e0e0f0', muted:'#7070a0', accent:'#6366f1', founder:'#818cf8', leader:'#4f46e5', member:'#7070a0' },
  cherry:    { bg:'#0f0508', card:'#1a0a10', border:'#2a1018', text:'#ffe8ec', muted:'#b86b80', accent:'#ec4899', founder:'#f472b6', leader:'#db2777', member:'#b86b80' },
  amber:     { bg:'#0f0a04', card:'#1a1408', border:'#2a2010', text:'#fff8e8', muted:'#b8a06b', accent:'#f59e0b', founder:'#fbbf24', leader:'#d97706', member:'#b8a06b' },
  slate:     { bg:'#0a0a0c', card:'#141418', border:'#222228', text:'#e8e8ec', muted:'#8888a0', accent:'#94a3b8', founder:'#cbd5e1', leader:'#64748b', member:'#8888a0' },
  cyber:     { bg:'#050510', card:'#0a0a1a', border:'#12122a', text:'#e0f0ff', muted:'#6080b0', accent:'#06b6d4', founder:'#22d3ee', leader:'#8b5cf6', member:'#6080b0' },
  blood:     { bg:'#0c0404', card:'#160808', border:'#241010', text:'#ffe8e8', muted:'#a06060', accent:'#dc2626', founder:'#f87171', leader:'#b91c1c', member:'#a06060' },
  lavender:  { bg:'#0c0812', card:'#16101e', border:'#241830', text:'#f4e8ff', muted:'#a080c0', accent:'#c4b5fd', founder:'#ddd6fe', leader:'#a78bfa', member:'#a080c0' },
  emerald:   { bg:'#040c08', card:'#081410', border:'#102018', text:'#e8fff0', muted:'#60a080', accent:'#10b981', founder:'#34d399', leader:'#059669', member:'#60a080' },
  copper:    { bg:'#0c0804', card:'#161008', border:'#241810', text:'#fff0e0', muted:'#a08060', accent:'#d97706', founder:'#eab308', leader:'#b45309', member:'#a08060' },
  steel:     { bg:'#08090c', card:'#10141a', border:'#1a2028', text:'#e8ecf0', muted:'#8090a0', accent:'#3b82f6', founder:'#60a5fa', leader:'#2563eb', member:'#8090a0' },
  pinkneon:  { bg:'#0c0410', card:'#16081a', border:'#241028', text:'#ffe8ff', muted:'#b070b0', accent:'#e879f9', founder:'#f0abfc', leader:'#d946ef', member:'#b070b0' },
  lime:      { bg:'#080c04', card:'#101808', border:'#182410', text:'#f0ffe8', muted:'#80a060', accent:'#84cc16', founder:'#a3e635', leader:'#65a30d', member:'#80a060' },
  wine:      { bg:'#0c0408', card:'#160810', border:'#241018', text:'#ffe8f0', muted:'#a06070', accent:'#be123c', founder:'#e11d48', leader:'#9f1239', member:'#a06070' }
};

const THEME_LABELS = {
  default:'Default Gold', neon:'Neon Circuit', crimson:'Crimson Night', aurora:'Aurora',
  gold:'Royal Gold', ocean:'Deep Ocean', purple:'Purple Haze', rose:'Rose Bloom',
  mint:'Mint Fresh', sunset:'Sunset Glow', ice:'Ice Crystal', forest:'Forest',
  midnight:'Midnight', cherry:'Cherry', amber:'Amber', slate:'Slate',
  cyber:'Cyber Punk', blood:'Blood Red', lavender:'Lavender', emerald:'Emerald',
  copper:'Copper', steel:'Steel Blue', pinkneon:'Pink Neon', lime:'Lime', wine:'Wine'
};

function applyTheme(themeName, customAccent, customBg, customCard) {
  const theme = THEMES[themeName] || THEMES.default;
  const root = document.documentElement;
  const accent = customAccent || theme.accent;
  const bg = customBg || theme.bg;
  const card = customCard || theme.card;

  root.style.setProperty('--bg', bg);
  root.style.setProperty('--card', card);
  root.style.setProperty('--border', theme.border);
  root.style.setProperty('--text', theme.text);
  root.style.setProperty('--text-muted', theme.muted);
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-glow', accent + '59');
  root.style.setProperty('--founder', theme.founder);
  root.style.setProperty('--leader', theme.leader);
  root.style.setProperty('--member', theme.member);
  document.body.dataset.theme = themeName;
}

function applyAllSettings(s) {
  applyTheme(s.theme || 'default', s.accent, s.customBg, s.customCard);

  const titleEl = document.getElementById('siteTitle');
  const subEl = document.getElementById('siteSubtitle');
  if (titleEl) titleEl.textContent = s.title || 'GODMYEGXO';
  if (subEl) subEl.textContent = s.subtitle || 'EST. 2026';

  const enterBtn = document.getElementById('enterBtn');
  if (enterBtn) {
    const span = enterBtn.querySelector('span') || document.getElementById('enterText');
    if (span) span.textContent = s.enterText || 'ENTER';
  }

  // Overlay opacity
  const opacity = s.overlayOpacity != null ? s.overlayOpacity : 55;
  document.documentElement.style.setProperty('--overlay-opacity', (opacity / 100).toFixed(2));
}
