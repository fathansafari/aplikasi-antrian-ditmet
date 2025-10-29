// admin.js - (FINAL DENGAN LOGIKA TUNGGU SUARA SELESAI)
let BASE = null;
const API_KEY = 'KIOSK-KEY-8a7f3b2c';
let token = null;
let me = null; // Akan menyimpan { id, username, role, assigned_loket }
let ws = null;

// selectedQueue menyimpan antrian yang dipilih dari tabel (untuk tombol Panggil biasa)
const selectedQueue = { A: null, B: null, C: null };
// lastCalledQueue menyimpan info panggilan TERAKHIR yang AKTIF oleh USER INI
const lastCalledQueue = { A: null, B: null, C: null };

const qs = id => document.getElementById(id);

function showNotif(msg, type = 'info') {
  const el = qs('connection-hint');
  if (el.timerId) clearTimeout(el.timerId);
  el.textContent = msg;
  el.style.opacity = 1;
  el.style.background = type === 'error' ? '#ef4444' : (type === 'success' ? '#16a34a' : '#2563eb');
  el.timerId = setTimeout(() => { if(el) el.style.opacity = 0; el.timerId = null; }, 3000);
}

async function initializeServerConnection() {
  if (BASE) return;
  if (window.electronAPI && typeof window.electronAPI.findServer === 'function') {
    try {
      showNotif('Mencari server...', 'info');
      const info = await window.electronAPI.findServer();
      BASE = `http://${info.ip}:${info.port}`;
      connectWebSocket();
    } catch (e) {
      console.error('Discovery failed:', e);
      showNotif('Server tidak ditemukan, mencoba lagi...', 'error');
      BASE = null;
      setTimeout(initializeServerConnection, 5000);
    }
  } else {
    BASE = `${location.protocol}//${location.hostname}:${location.port || 5000}`;
    connectWebSocket();
  }
}

function connectWebSocket() {
    // Pencegahan Reconnect Ganda: Hanya sambungkan jika ws null atau closed
    if (!BASE || (ws && ws.readyState !== WebSocket.CLOSED)) {
        console.log("Koneksi WS dibatalkan (BASE null atau WS sudah/sedang konek/menyambung). State:", ws?.readyState);
        return;
    }

  console.log(`Mencoba menyambungkan WebSocket ke ${BASE.replace(/^http/, 'ws')}...`);
  try {
    const wsurl = BASE.replace(/^http/, 'ws');
    ws = new WebSocket(wsurl); // Inisialisasi ws

    ws.onopen = () => {
      console.log('WS connected');
      showNotif('✅ Terkoneksi ke server', 'success');
      if (me) { loadAll(); loadRekapData(); if (me.role === 'admin') loadUsers(); }
      // Saat konek, pastikan tombol swap sinkron (misal jika ada panggilan aktif saat koneksi putus)
      updateSwapButtonStates();
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        console.log("WS received:", data);

        if (data.action === 'UPDATE' || data.action === 'UPDATE_USERS') {
          // Terima update dari server (yang dipicu oleh admin LAIN)
          if (me) { loadAll(); loadRekapData(); if (me.role === 'admin') loadUsers(); }
        } else if (data.action === 'PANGGIL_SUARA') {
          const roleMap = { cs: 'A', pendaftaran: 'B', pengambilan: 'C' };
          const userKode = roleMap[me.role];

          // Hanya update display jika kode antrian cocok dengan role user
          if (userKode && data.kode === userKode) {
            qs('currentDisplay').textContent = data.nomor || '-';
            showNotif(`Dipanggil: ${data.nomor} → Loket ${data.loket}`, 'info');
          }

        } else if (data.action === 'RESET') {
          qs('currentDisplay').textContent = '-';
          lastCalledQueue.A = null; lastCalledQueue.B = null; lastCalledQueue.C = null;
          updateSwapButtonStates();
          if (me) { loadAll(); loadRekapData(); }
          showNotif('Semua antrian sudah direset', 'success');
        }
      } catch (e) { console.error('WS msg parse error', e); }
    };

    ws.onclose = (event) => {
      console.log('WS closed. Code:', event.code, 'Reason:', event.reason, 'Was Clean:', event.wasClean);
      const wasWsObject = ws; // Simpan referensi ws lama
      ws = null; // Set ws ke null SEGERA
      if (me && !event.wasClean) {
          showNotif('❌ Koneksi ke server terputus', 'error');
          updateSwapButtonStates(); // Nonaktifkan tombol saat putus
          setTimeout(connectWebSocket, 3000);
      } else if (!me) { // Jika logout
          updateSwapButtonStates();
      } else { // Jika ditutup normal (wasClean=true) tapi user masih login
          // Mungkin perlu reconnect juga jika penutupan bukan karena logout
          setTimeout(connectWebSocket, 3000);
          updateSwapButtonStates(); // Tetap nonaktifkan tombol saat mencoba reconnect
      }
    };

    ws.onerror = (err) => {
      console.error('WS err:', err.message || 'Unknown WebSocket Error');
      // Tidak perlu notif error, onclose akan dipanggil
      // Jika ws masih ada, tutup manual untuk memicu onclose
      if (ws) {
          ws.close();
      }
    };
  } catch (e) {
      console.error('WS connect fail (exception):', e);
      ws = null;
      if(me) setTimeout(connectWebSocket, 5000);
   }
}


async function apiFetch(path, opts = {}) {
  if (!BASE) throw new Error('Server belum siap');
  opts.mode = 'cors';
  opts.headers = opts.headers || {};
  opts.headers['x-api-key'] = API_KEY;
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (opts.body && typeof opts.body === 'object') {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }

  const res = await fetch(BASE + path, opts);

  const contentType = res.headers.get('content-type');
  if (contentType?.includes('spreadsheetml.sheet')) {
     if (!res.ok) throw new Error(`Gagal mengunduh file (HTTP ${res.status})`);
     return res;
  }

  const text = await res.text();
  let data = null;
  try {
      data = text ? JSON.parse(text) : null;
  } catch (e) {
      console.error("Respons server bukan JSON:", text);
      throw new Error(`Server memberikan respons tidak valid (status ${res.status})`);
  }

  if (!res.ok) {
    // Include full response body in the thrown error so callers can inspect server messages
    const errObj = { status: res.status, statusText: res.statusText, body: data };
    console.error('API error response:', errObj);
    throw new Error(JSON.stringify(errObj));
  }
  return data;
}
const apiGet = p => apiFetch(p, { method: 'GET' });
const apiPost = (p, body) => apiFetch(p, { method: 'POST', body });
const apiPut = (p, body) => apiFetch(p, { method: 'PUT', body });
const apiDelete = p => apiFetch(p, { method: 'DELETE' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link[data-target]').forEach(el => { el.addEventListener('click', () => showPage(el.dataset.target)); });
  qs('logoutBtn').addEventListener('click', logout);
  qs('showRegisterLink').addEventListener('click', () => { qs('loginBox').style.display = 'none'; qs('registerBox').style.display = 'block'; });
  qs('showLoginLink').addEventListener('click', () => { qs('registerBox').style.display = 'none'; qs('loginBox').style.display = 'block'; });
  qs('loginBtn').addEventListener('click', tryLogin);
  qs('registerBtn').addEventListener('click', tryRegister);

  ['A', 'B', 'C'].forEach(k => {
      qs(`callBtn${k}`).addEventListener('click', () => onCallButton(k));
      qs(`recallBtn${k}`).addEventListener('click', () => onRecallButton(k));
      qs(`swapBtn${k}`).addEventListener('click', () => onSkipAndCallNext(k));
  });

  qs('resetTotalBtn').addEventListener('click', async () => {
      if (!me || me.role !== 'admin') return alert('Hanya Admin yang bisa melakukan reset.');
      if (!confirm('Apakah Anda yakin ingin menghapus SEMUA data antrian hari ini? Tindakan ini tidak dapat dibatalkan.')) return;
      try { await apiPost('/api/antrian/reset_total'); showNotif('Reset antrian berhasil', 'success'); }
      catch (e) { alert('Reset gagal: ' + e.message); }
  });

  qs('saveUserBtn').addEventListener('click', onSaveUser);
  qs('clearUserFormBtn').addEventListener('click', clearUserForm);

  qs('exportExcelBtn').addEventListener('click', async () => {
    if (!BASE || !token) { showNotif('Anda harus login.', 'error'); return; }
    showNotif('Mengekspor data...', 'info');
    try {
        const response = await apiFetch('/api/rekap/excel');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'rekap-antrian.xlsx';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
            if (filenameMatch?.[1]) filename = filenameMatch[1];
        }
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showNotif('Ekspor Excel berhasil!', 'success');
    } catch (e) {
        console.error('Export Excel Error:', e);
        showNotif(`Gagal ekspor: ${e.message}`, 'error');
    }
  });

  initializeServerConnection();
});


function showPage(id) {
  document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const el = qs(id);
  if (el) el.classList.add('active');
  const navEl = document.querySelector(`.nav-link[data-target="${id}"]`);
  if (navEl) {
    navEl.classList.add('active');
    const spanText = navEl.querySelector('span')?.textContent || navEl.textContent;
    qs('pageTitle').textContent = spanText.trim().replace(/^\(\w\)\s*/, '');
  }
}

function setupUIAccess(role) {
  ['navA', 'navB', 'navC', 'navUsers'].forEach(id => { const el = qs(id); if (el) el.style.display = 'none'; });
  const resetCard = qs('resetTotalBtn').closest('.card');
  if(resetCard) resetCard.style.display = 'none';
  ['navBeranda', 'navRekap'].forEach(id => { const el = qs(id); if (el) el.style.display = 'flex'; });

  if (role === 'admin') {
    ['navA', 'navB', 'navC', 'navUsers'].forEach(id => { qs(id).style.display = 'flex'; });
    if(resetCard) resetCard.style.display = 'flex';
    showPage('pageBeranda');
  } else if (role === 'cs') { qs('navA').style.display = 'flex'; showPage('pageA'); }
  else if (role === 'pendaftaran') { qs('navB').style.display = 'flex'; showPage('pageB'); }
  else if (role === 'pengambilan') { qs('navC').style.display = 'flex'; showPage('pageC'); }
}



async function tryRegister() {
  const username = qs('regUsername').value.trim();
  const password = qs('regPassword').value;
  const role = qs('regRole').value;
  const assigned_loket = qs('regLoket').value.trim();

  if (!username || !password || !role) { qs('registerMsg').textContent = 'Username, Password, dan Role wajib diisi'; return; }
  if (role !== 'admin' && !assigned_loket) { qs('registerMsg').textContent = 'Nomor Loket wajib diisi untuk operator'; return; }

  try {
    const body = { username, password, role };
    if (role !== 'admin') body.assigned_loket = assigned_loket;

    const res = await fetch(`${BASE}/api/register`, { // Gunakan fetch karena belum login
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY }, body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal daftar');
    qs('registerMsg').textContent = 'Pendaftaran berhasil. Silakan login.';
    qs('registerBox').style.display = 'none';
    qs('loginBox').style.display = 'block';
    qs('regUsername').value = ''; qs('regPassword').value = ''; qs('regRole').value = ''; qs('regLoket').value = '';
  } catch (e) {
    qs('registerMsg').textContent = 'Gagal daftar: ' + (e.message || e);
  }
}


async function tryLogin() {
  if (!BASE) { alert('Server belum terdeteksi.'); return; }
  const username = qs('u').value.trim();
  const password = qs('p').value;
  if (!username || !password) { qs('loginMsg').textContent = 'Username & password wajib diisi'; return; }
  qs('loginMsg').textContent = 'Memeriksa...';
  try {
    const res = await apiFetch('/api/login', { method: 'POST', body: { username, password } });
    token = res.token;
    me = res.user;

    qs('authContainer').style.display = 'none';
    qs('panel').style.display = 'block';
    qs('who').textContent = me.username;
    qs('whoRole').textContent = `${me.role}${me.assigned_loket ? ` (Loket ${me.assigned_loket})` : ''}`;
    qs('whoBeranda').textContent = me.username;

    setupUIAccess(me.role);
    lastCalledQueue.A = null; lastCalledQueue.B = null; lastCalledQueue.C = null;
    updateSwapButtonStates();

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        connectWebSocket();
    } else {
        loadAll(); loadRekapData(); if (me.role === 'admin') loadUsers();
    }
    showNotif('Login berhasil', 'success');
  } catch (e) {
    console.error('Login error', e);
    qs('loginMsg').textContent = 'Login gagal: ' + (e.message || e);
    showNotif('Login gagal', 'error');
  }
}

function logout() {
  const wsToClose = ws; // Simpan referensi ws saat ini
  token = null;
  me = null;
  ws = null; // Set ws global ke null SEGERA
  if (wsToClose) { wsToClose.close(1000, "User logged out"); } // Tutup ws lama
  qs('panel').style.display = 'none';
  qs('authContainer').style.display = 'flex';
  qs('u').value = ''; qs('p').value = '';
  showNotif('Anda telah logout', 'info');
  qs('currentDisplay').textContent = '-';
  lastCalledQueue.A = null; lastCalledQueue.B = null; lastCalledQueue.C = null;
  updateSwapButtonStates();
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(n => n.style.display = 'flex');
  qs('resetTotalBtn').closest('.card').style.display = 'flex';
  showPage('pageBeranda');
}

async function loadAll() {
  if (!me) return;
  try {
    const promises = [];
    if (me.role === 'admin' || me.role === 'cs') promises.push(apiGet('/api/antrian?kode=A&status=waiting')); else promises.push(Promise.resolve([]));
    if (me.role === 'admin' || me.role === 'pendaftaran') promises.push(apiGet('/api/antrian?kode=B&status=waiting')); else promises.push(Promise.resolve([]));
    if (me.role === 'admin' || me.role === 'pengambilan') promises.push(apiGet('/api/antrian?kode=C&status=waiting')); else promises.push(Promise.resolve([]));

    const [A, B, C] = await Promise.all(promises);
    renderTable('tableA', A, 'A');
    renderTable('tableB', B, 'B');
    renderTable('tableC', C, 'C');
  } catch (e) { console.error('loadAll error', e); }
}

async function loadRekapData() {
  if (!me) return;
  try {
    let all = await apiGet('/api/antrian');
    if (!Array.isArray(all)) all = [];
    const tbody = qs('tableRekapAll');
    tbody.innerHTML = all.length
      ? all.map(r => `<tr style="${r.status === 'called' ? 'font-weight: bold; background-color: #fef9c3;' : ''}"><td>${r.nomor}</td><td>${r.status}</td><td>${new Date(r.waktu_ambil).toLocaleString('id-ID')}</td><td>${r.waktu_panggil ? new Date(r.waktu_panggil).toLocaleString('id-ID') : '-'}</td></tr>`).join('')
      : `<tr><td colspan="4" style="text-align:center">Tidak ada data rekap</td></tr>`;
  } catch (e) { console.error('loadRekapData error', e); }
}

function renderTable(elid, rows, kode) {
  const tbody = qs(elid);
  tbody.innerHTML = ''; // Kosongkan dulu

  if (!rows || !rows.length) { tbody.innerHTML = `<tr><td colspan="3" style="text-align:center">Tidak ada antrian</td></tr>`; return; }

  rows.forEach(r => {
      const tr = document.createElement('tr');
      tr.dataset.id = r.id; tr.dataset.nomor = r.nomor;
      const waktu = new Date(r.waktu_ambil).toLocaleTimeString('id-ID');
      tr.innerHTML = `<td><strong>${r.nomor}</strong></td><td>${r.status}</td><td>${waktu}</td>`;
      tr.addEventListener('click', () => {
          tbody.querySelectorAll('tr.selected').forEach(x => x.classList.remove('selected'));
          tr.classList.add('selected');
          selectedQueue[kode] = { id: r.id, nomor: r.nomor };
          qs(`selectedQueueNumber${kode}`).textContent = selectedQueue[kode].nomor;
          qs(`callBtn${kode}`).disabled = false;
      });
      tbody.appendChild(tr);
  });
   // Reset state setelah render
   selectedQueue[kode] = null;
   qs(`selectedQueueNumber${kode}`).textContent = 'Tidak ada';
   qs(`callBtn${kode}`).disabled = true;
}


function updateSwapButtonStates() {
    ['A', 'B', 'C'].forEach(k => {
        const swapBtn = qs(`swapBtn${k}`);
        if (swapBtn) {
            // Aktif jika user login, ada panggilan lokal aktif, DAN WS terhubung
            swapBtn.disabled = !(me && lastCalledQueue[k] && ws && ws.readyState === WebSocket.OPEN);
        }
    });
    console.log("Swap button states updated. Current local state:", lastCalledQueue, "WS state:", ws?.readyState);
}

// =================================================================
// === FUNGSI INI TELAH DIPERBAIKI (PERUBAHAN DIMULAI DI SINI) ===
// =================================================================
async function onCallButton(kode) {
  const sel = selectedQueue[kode];
  if (!sel) { alert('Pilih nomor dari tabel dulu.'); return; }
  const roleMap = { cs: 'A', pendaftaran: 'B', pengambilan: 'C' };
  if (me.role !== 'admin' && roleMap[me.role] !== kode) { alert(`Anda hanya bisa memanggil antrian ${kode}.`); return; }

  // 1. Disable tombol panggil & Hapus state lokal lama
  qs(`callBtn${kode}`).disabled = true;
  lastCalledQueue[kode] = null;
  updateSwapButtonStates(); // Nonaktifkan tombol skip lama

  try {
    showNotif(`Memanggil ${sel.nomor}... (Mohon tunggu suara selesai)`, 'info');
    
    // 2. Panggil API dan TUNGGU. 
    // Server akan memutar suara SEBELUM merespons. Ini akan memakan waktu.
    const res = await apiPut(`/api/antrian/${sel.id}/panggil`); 

    // 3. API SUKSES (dan Suara Selesai).
    console.log("Panggilan API selesai, suara seharusnya sudah beres.");

    // 4. Update state panggilan lokal (untuk tombol swap/recall)
    lastCalledQueue[kode] = { id: res.id, nomor: res.nomor, loket: res.loket, kode: kode };
    console.log("Call successful, local lastCalledQueue updated:", lastCalledQueue);

    // 5. Muat ulang KEDUA tabel.
    // loadAll() akan menghapus antrian dari 'Daftar Tunggu'.
    // loadRekapData() akan menambah antrian ke 'Rekap' dengan status 'called'.
    loadAll(); 
    loadRekapData(); 

    // 6. Reset pilihan (meskipun loadAll() mungkin sudah melakukan ini)
    selectedQueue[kode] = null;
    qs(`selectedQueueNumber${kode}`).textContent = 'Tidak ada';
    
    showNotif(`Memanggil ${res.nomor} → Loket ${res.loket} (Selesai)`, 'success');

  } catch (e) {
    alert('Gagal memanggil: ' + (e.message || e));
    lastCalledQueue[kode] = null; // Pastikan state lokal bersih jika gagal
    // Jika gagal, tombol panggil harus di-enable lagi (jika antrian masih ada)
    qs(`callBtn${kode}`).disabled = (selectedQueue[kode] === null); 
    // Muat ulang daftar tunggu jika gagal, untuk jaga-jaga
    loadAll(); 
  } finally {
      updateSwapButtonStates(); // Update tombol skip (akan enable jika sukses)
  }
}
// =================================================================
// === AKHIR DARI PERBAIKAN onCallButton ===
// =================================================================

async function onRecallButton(kode) {
  const last = lastCalledQueue[kode]; // Ambil dari state LOKAL
  if (!last) { alert('Belum ada panggilan terakhir yang aktif untuk diulang.'); return; }
  try {
    showNotif(`Memanggil ulang ${last.nomor}...`, 'info');
    // Panggil ulang tidak perlu menunggu suara, cukup kirim perintah
    await apiPost('/api/antrian/panggil-ulang', last);
    showNotif(`Memanggil ulang ${last.nomor} (Selesai)`, 'success');
  } catch (e) {
    alert('Gagal memanggil ulang: ' + (e.message || e));
  }
}

// =================================================================
// === FUNGSI INI TELAH DIPERBAIKI (PERUBAHAN DIMULAI DI SINI) ===
// =================================================================
async function onSkipAndCallNext(kode) {
  const last = lastCalledQueue[kode]; // Verifikasi state LOKAL
  if (!last) {
      alert('Tidak ada antrian yang sedang aktif dipanggil oleh Anda untuk dilewati.');
      updateSwapButtonStates(); return;
  }
  // 1. Pastikan user memilih antrian berikutnya yang ingin dipanggil
  const nextSel = selectedQueue[kode];
  if (!nextSel) { alert('Pilih nomor berikutnya dari daftar tunggu sebelum melakukan swap.'); updateSwapButtonStates(); return; }

  // 2. Disable tombol (akan diupdate lagi di finally)
  updateSwapButtonStates();

  try {
    showNotif(`Melewati ${last.nomor} & memanggil ${nextSel.nomor}... (Tunggu suara)`, 'info');
  // 3. Validasi cepat di client: pastikan user tidak memilih nomor yang sama dengan yang sedang dipanggil
  if (nextSel.id === last.id) {
    alert('Nomor yang Anda pilih sama dengan nomor yang sedang dipanggil. Pilih nomor lain dari daftar tunggu.');
    updateSwapButtonStates();
    return;
  }

  // 4. Panggil API dan sertakan nextId agar server tahu nomor yang dimaksud
  const payload = { nextId: nextSel.id };
  console.log('DEBUG skip payload ->', payload, 'currentCalled ->', last);
  const res = await apiPost(`/api/antrian/skip-call-next`, payload);
  if (res.usedNextId && res.usedNextId !== payload.nextId) {
    showNotif(`Permintaan swap Anda menggunakan nomor lain (${res.nomor}) karena target berubah.`, 'info');
  }

    // 4. API SUKSES (dan Suara Selesai).
    // Update state LOKAL dengan nomor BARU
    lastCalledQueue[kode] = { id: res.id, nomor: res.nomor, loket: res.loket, kode: kode };
    console.log("Skip successful, local lastCalledQueue updated:", lastCalledQueue);

    // 5. Muat ulang KEDUA tabel.
    loadAll(); 
    loadRekapData(); 

    // 6. Reset pilihan berikutnya
    selectedQueue[kode] = null;
    qs(`selectedQueueNumber${kode}`).textContent = 'Tidak ada';

    showNotif(`Antrian ${last.nomor} dilewati. Memanggil ${res.nomor} (Selesai)`, 'success');

  } catch (e) {
    // Try to parse enriched error thrown by apiFetch
    let userMsg = 'Gagal melewati antrian';
    try {
      const parsed = JSON.parse(e.message);
      console.error('Skip API failed:', parsed);
      if (parsed.body && parsed.body.error) userMsg += ': ' + parsed.body.error;
      else userMsg += `: HTTP ${parsed.status} ${parsed.statusText}`;
    } catch (pe) {
      console.error('Skip failed (non-JSON error):', e);
      userMsg += ': ' + (e.message || e);
    }
    alert(userMsg);
    // Jika gagal, state LOKAL TIDAK berubah, tombol skip tetap aktif
  } finally {
      updateSwapButtonStates(); // Update tombol (akan enable jika sukses)
  }
}
// =================================================================
// === AKHIR DARI PERBAIKAN onSkipAndCallNext ===
// =================================================================

async function loadUsers() {
  if (!me || me.role !== 'admin') return;
  try {
    const users = await apiGet('/api/users');
    const tbody = qs('usersTable');
    tbody.innerHTML = users.length
     ? users.map(u => `<tr><td>${u.username}</td><td>${u.role}</td><td>${u.assigned_loket || '-'}</td><td>${u.role !== 'admin' ? `<button class="btn btn-danger" onclick="deleteUser(${u.id},'${u.username}')"><i class="ph ph-trash-simple"></i> Hapus</button>` : ''}</td></tr>`).join('')
     : `<tr><td colspan="4" style="text-align:center">Tidak ada user</td></tr>`;
  } catch (e) { console.error('loadUsers error', e); showNotif('Gagal memuat user', 'error'); }
}

function clearUserForm() { qs('userUsername').value = ''; qs('userPassword').value = ''; qs('userRole').value = ''; qs('userLoket').value = ''; }

async function onSaveUser() {
  const username = qs('userUsername').value.trim();
  const password = qs('userPassword').value;
  const role = qs('userRole').value;
  const assigned_loket = qs('userLoket').value.trim();

  if (!username || !password || !role) { alert('Username, Password, dan Role wajib diisi.'); return; }
  if (role !== 'admin' && !assigned_loket) { alert('Nomor Loket wajib diisi untuk operator.'); return; }
  if (role !== 'admin' && isNaN(parseInt(assigned_loket))) { alert('Nomor Loket harus berupa angka.'); return; }

  try {
    const body = { username, password, role };
    if (role !== 'admin') body.assigned_loket = assigned_loket;
    await apiPost('/api/users', body);
    showNotif('User berhasil ditambahkan', 'success');
    clearUserForm();
    loadUsers();
  } catch (e) {
    alert('Gagal menyimpan user: ' + (e.message || e));
  }
}

window.deleteUser = async function (id, username) {
  if (me && me.id === id) { alert("Anda tidak dapat menghapus akun Anda sendiri."); return; }
  if (!confirm(`Anda yakin ingin menghapus user "${username}"?`)) return;
  try {
    await apiDelete(`/api/users/${id}`);
    showNotif(`User ${username} berhasil dihapus`, 'success');
    loadUsers();
  } catch (e) {
    alert('Gagal menghapus user: ' + (e.message || e));
  }
}