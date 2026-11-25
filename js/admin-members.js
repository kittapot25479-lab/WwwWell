// ===== Admin Members Management (with DB) =====
let currentEditId = null;
let membersCache = [];

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataAsync();
  membersCache = data.members || [];

  if (document.getElementById('sidebarSiteName')) {
    document.getElementById('sidebarSiteName').textContent = data.settings.title || 'GODMYEGXO';
  }

  updateDbStatusUI();
  renderTable();

  document.getElementById('addMemberBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelBtn').addEventListener('click', closeModal);

  document.getElementById('memberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveMember();
  });

  document.getElementById('memberSearch').addEventListener('input', (e) => {
    renderTable(e.target.value.toLowerCase().trim());
  });
});

function renderTable(search = '') {
  let list = membersCache;
  if (search) {
    list = list.filter(m => m.name.toLowerCase().includes(search));
  }

  document.getElementById('memberTotal').textContent = list.length;
  const tbody = document.getElementById('membersTableBody');

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#8b8ba0;padding:40px">ยังไม่มีสมาชิก</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(m => {
    const avatar = m.avatar || getDefaultAvatar(m.name);
    return `
      <tr>
        <td>
          <div class="member-cell">
            <img src="${avatar}" alt="" onerror="this.src='${getDefaultAvatar(m.name)}'" />
            <div>
              <strong>${m.name}</strong>
              ${m.facebook ? `<br><small style="color:#8b8ba0"><i class="fab fa-facebook"></i> มีลิงก์ FB</small>` : ''}
            </div>
          </div>
        </td>
        <td><span class="rank-badge ${m.rank}">${getRankLabel(m.rank)}</span></td>
        <td>
          <div class="action-btns">
            <button onclick="editMember('${m.id}')" title="แก้ไข"><i class="fas fa-pen"></i></button>
            <button class="delete" onclick="deleteMember('${m.id}')" title="ลบ"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
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

async function saveMember() {
  const name = document.getElementById('memberName').value.trim();
  if (!name) return alert('กรุณาใส่ชื่อสมาชิก');

  const member = {
    id: currentEditId || String(Date.now()),
    name,
    rank: document.getElementById('memberRank').value,
    avatar: document.getElementById('memberAvatar').value.trim(),
    facebook: document.getElementById('memberFacebook').value.trim(),
    otherLink: document.getElementById('memberOtherLink').value.trim()
  };

  const saved = await saveMemberAsync(member);

  // update cache
  const idx = membersCache.findIndex(m => m.id === saved.id);
  if (idx >= 0) membersCache[idx] = saved;
  else membersCache.push(saved);

  addActivity(currentEditId ? `แก้ไขสมาชิก: ${name}` : `เพิ่มสมาชิกใหม่: ${name}`);
  closeModal();
  renderTable();
}

function editMember(id) {
  const member = membersCache.find(m => m.id === id);
  if (member) openModal(member);
}

async function deleteMember(id) {
  if (!confirm('ต้องการลบสมาชิกคนนี้ใช่ไหม?')) return;
  const member = membersCache.find(m => m.id === id);
  await deleteMemberAsync(id);
  membersCache = membersCache.filter(m => m.id !== id);
  if (member) addActivity(`ลบสมาชิก: ${member.name}`);
  renderTable();
}

window.editMember = editMember;
window.deleteMember = deleteMember;
