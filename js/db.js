// ===== Database Layer (Firebase + localStorage fallback) =====

let db = null;
let firebaseReady = false;
let firebaseInitPromise = null;

function isFirebaseEnabled() {
  return typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE === true
    && typeof FIREBASE_CONFIG !== 'undefined'
    && FIREBASE_CONFIG.apiKey
    && FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY';
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

async function initFirebase() {
  if (firebaseInitPromise) return firebaseInitPromise;
  if (!isFirebaseEnabled()) {
    firebaseReady = false;
    return false;
  }

  firebaseInitPromise = (async () => {
    try {
      if (!window.firebase) {
        await Promise.race([
          (async () => {
            await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
            await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js');
          })(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase load timeout')), 4000))
        ]);
      }
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();
      // Don't wait forever for network
      firebaseReady = true;
      console.log('[DB] Firebase initialized');
      return true;
    } catch (err) {
      console.warn('[DB] Firebase init failed, using localStorage only:', err.message || err);
      firebaseReady = false;
      return false;
    }
  })();

  return firebaseInitPromise;
}

function loadDataLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      const settings = { ...defaultData.settings, ...data.settings };
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

function loadData() {
  return loadDataLocal();
}

function saveDataLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('localStorage save failed', e);
  }
}

function saveData(data) {
  saveDataLocal(data);
}

async function loadDataAsync() {
  // Always start with local data so UI is instant
  const local = loadDataLocal();

  try {
    await Promise.race([
      initFirebase(),
      new Promise(r => setTimeout(r, 3000))
    ]);
  } catch (e) {}

  if (firebaseReady && db) {
    try {
      const settingsSnap = await Promise.race([
        db.collection(COLLECTION_SETTINGS).doc(DOC_SETTINGS_ID).get(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
      ]);
      const membersSnap = await Promise.race([
        db.collection(COLLECTION_MEMBERS).get(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
      ]);

      let settings = { ...defaultData.settings };
      if (settingsSnap.exists) {
        settings = { ...settings, ...settingsSnap.data() };
      }

      let members = [];
      membersSnap.forEach(doc => {
        members.push({ id: doc.id, ...doc.data() });
      });

      if (members.length === 0) {
        members = local.members.length ? local.members : defaultData.members;
      }

      // Keep local in sync
      saveDataLocal({ settings, members, activity: local.activity || [] });
      return { settings, members, activity: local.activity || [] };
    } catch (err) {
      console.warn('[DB] Load from Firebase failed, using localStorage', err.message || err);
    }
  }

  return local;
}

async function saveSettingsAsync(settings) {
  // ALWAYS save local first so settings never get lost
  const local = loadDataLocal();
  local.settings = settings;
  saveDataLocal(local);

  // Try Firebase in background with timeout (don't block UI)
  try {
    await Promise.race([
      initFirebase(),
      new Promise(r => setTimeout(r, 2000))
    ]);
    if (firebaseReady && db) {
      await Promise.race([
        db.collection(COLLECTION_SETTINGS).doc(DOC_SETTINGS_ID).set(settings, { merge: true }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('save timeout')), 3000))
      ]);
      console.log('[DB] Settings saved to Firebase');
    }
  } catch (err) {
    console.warn('[DB] Firebase save skipped:', err.message || err);
  }
  return true;
}

async function saveMemberAsync(member) {
  const id = member.id || String(Date.now());
  const payload = {
    name: member.name,
    rank: member.rank,
    avatar: member.avatar || '',
    facebook: member.facebook || '',
    otherLink: member.otherLink || ''
  };

  // Local first
  const local = loadDataLocal();
  const idx = local.members.findIndex(m => m.id === id);
  if (idx >= 0) local.members[idx] = { id, ...payload };
  else local.members.push({ id, ...payload });
  saveDataLocal(local);

  try {
    await Promise.race([
      initFirebase(),
      new Promise(r => setTimeout(r, 2000))
    ]);
    if (firebaseReady && db) {
      await Promise.race([
        db.collection(COLLECTION_MEMBERS).doc(id).set(payload, { merge: true }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
      ]);
    }
  } catch (err) {
    console.warn('[DB] Member save Firebase skipped:', err.message || err);
  }

  return { id, ...payload };
}

async function deleteMemberAsync(id) {
  const local = loadDataLocal();
  local.members = local.members.filter(m => m.id !== id);
  saveDataLocal(local);

  try {
    await Promise.race([
      initFirebase(),
      new Promise(r => setTimeout(r, 2000))
    ]);
    if (firebaseReady && db) {
      await Promise.race([
        db.collection(COLLECTION_MEMBERS).doc(id).delete(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))
      ]);
    }
  } catch (err) {
    console.warn('[DB] Member delete Firebase skipped:', err.message || err);
  }
}

function addActivity(text) {
  const data = loadDataLocal();
  data.activity = data.activity || [];
  data.activity.unshift({ text, time: new Date().toLocaleString('th-TH') });
  if (data.activity.length > 20) data.activity = data.activity.slice(0, 20);
  saveDataLocal(data);
}

function getRankLabel(rank) {
  const map = { founder: 'FOUNDER', leader: 'LEADER', member: 'MEMBER' };
  return map[rank] || 'MEMBER';
}

function getDefaultAvatar(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a25&color=c9a227&size=128&bold=true`;
}

async function updateDbStatusUI() {
  const el = document.getElementById('dbStatus');
  if (!el) return;
  try {
    const ok = await Promise.race([
      initFirebase(),
      new Promise(r => setTimeout(() => r(false), 3000))
    ]);
    if (ok && firebaseReady) {
      el.innerHTML = '<span style="color:#22c55e">● เชื่อม Database แล้ว (Firebase)</span>';
    } else if (isFirebaseEnabled()) {
      el.innerHTML = '<span style="color:#eab308">● ใช้ localStorage (Firebase ยังไม่พร้อม)</span>';
    } else {
      el.innerHTML = '<span style="color:#8b8ba0">● ใช้ localStorage</span>';
    }
  } catch (e) {
    el.innerHTML = '<span style="color:#8b8ba0">● ใช้ localStorage</span>';
  }
}
