// ===== Shared Config & Storage =====
const STORAGE_KEY = 'godmyegxo_data';

const defaultData = {
  settings: {
    title: 'GODMYEGXO',
    subtitle: 'EST. 2026',
    enterText: 'ENTER',
    favicon: '',
    logo: '',
    bgGate: '',
    bgMembers: '',
    discord: '',
    facebook: '',
    theme: 'default',
    gateLayout: 'centered',
    particles: 'none',
    animation: 'fade',
    accent: '#c9a227',
    musicUrl: 'https://www.youtube.com/watch?v=agneRtEe-t8',
    volume: 50,
    playerStyle: 'classic',
    autoPlay: true,
    showPlayer: true,
    snow: 'on'
  },
  members: [
    {
      id: '1',
      name: 'Wall Winterfall Godmyhxnd',
      rank: 'founder',
      avatar: '',
      facebook: '',
      otherLink: ''
    },
    {
      id: '2',
      name: 'Z9 Godyouknow',
      rank: 'leader',
      avatar: '',
      facebook: '',
      otherLink: ''
    },
    {
      id: '3',
      name: 'Pap babygodago',
      rank: 'member',
      avatar: '',
      facebook: '',
      otherLink: ''
    }
  ],
  activity: []
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const settings = { ...defaultData.settings, ...data.settings };
      // ถ้ายังไม่มีเพลง ให้ใส่เพลงเริ่มต้น
      if (!settings.musicUrl) {
        settings.musicUrl = defaultData.settings.musicUrl;
        settings.autoPlay = true;
      }
      return {
        settings,
        members: data.members || defaultData.members,
        activity: data.activity || []
      };
    }
  } catch (e) {}
  return JSON.parse(JSON.stringify(defaultData));
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addActivity(text) {
  const data = loadData();
  data.activity.unshift({
    text,
    time: new Date().toLocaleString('th-TH')
  });
  if (data.activity.length > 20) data.activity = data.activity.slice(0, 20);
  saveData(data);
}

function getRankLabel(rank) {
  const map = { founder: 'FOUNDER', leader: 'LEADER', member: 'MEMBER' };
  return map[rank] || 'MEMBER';
}

function getDefaultAvatar(name) {
  // simple placeholder using ui-avatars
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a25&color=c9a227&size=128&bold=true`;
}
