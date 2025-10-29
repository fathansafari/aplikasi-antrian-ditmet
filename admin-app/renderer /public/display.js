// display.js - Realtime display via WebSocket (no polling)
// Assumes display HTML is served from same server (so BASE derived from location)

const BASE = `${location.protocol}//${location.hostname}:${location.port || 5000}`;
let historyCalled = []; // latest first, objects {id, nomor, waktu_panggil}
const slotsContainer = document.getElementById('slots');

function updateClock(){
  const c = document.getElementById('clock');
  if (c) c.textContent = new Date().toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function renderSlots(){
  if (!slotsContainer) return;
  if (!historyCalled.length) {
    slotsContainer.innerHTML = `<div class="slot"><span>Belum ada panggilan</span></div>
      <div class="slot"><span>Belum ada panggilan</span></div>
      <div class="slot"><span>Belum ada panggilan</span></div>
      <div class="slot"><span>Belum ada panggilan</span></div>`;
    return;
  }
  const items = historyCalled.slice(0,4);
  slotsContainer.innerHTML = items.map(it=>{
    const waktu = it.waktu_panggil ? new Date(it.waktu_panggil).toLocaleTimeString() : '';
    return `<div class="slot"><span>Dipanggil</span><h1>${it.nomor}</h1><span>${waktu}</span></div>`;
  }).join('');
}

// initial load of recent called (so display shows current state on start)
async function fetchInitialCalled(){
  try {
    const res = await fetch(`${BASE}/public/antrian?status=called&limit=20`, { mode:'cors' });
    if (!res.ok) throw new Error('HTTP '+res.status);
    const rows = await res.json();
    // sort by waktu_panggil desc
    rows.sort((a,b)=> (b.waktu_panggil? new Date(b.waktu_panggil).getTime():0) - (a.waktu_panggil? new Date(a.waktu_panggil).getTime():0));
    historyCalled = rows.slice(0,50);
    renderSlots();
  } catch(e) {
    console.error('Initial fetch failed', e);
  }
}

function connectWS(){
  try {
    const wsUrl = BASE.replace(/^http/, 'ws');
    const ws = new WebSocket(wsUrl);
    ws.onopen = ()=> console.log('DISPLAY WS connected');
    ws.onmessage = (ev)=>{
      try {
        const data = JSON.parse(ev.data);
        if (data.action === 'PANGGIL_SUARA') {
          // add into history (most recent first)
          const item = { id: data.id || Date.now(), nomor: data.nomor, waktu_panggil: new Date().toISOString() };
          historyCalled = [item, ...historyCalled].filter((v,i,self)=> i === self.findIndex(x=>x.nomor===v.nomor && x.waktu_panggil===v.waktu_panggil)).slice(0,50);
          renderSlots();
        } else if (data.action === 'UPDATE') {
          // optional: sync with server snapshot - but to keep simple, fetch called snapshot
          fetchInitialCalled();
        } else if (data.action === 'RESET' || data.action === 'RESET_QUEUE') {
          historyCalled = [];
          renderSlots();
        }
      } catch(e) { console.error('WS parse', e); }
    };
    ws.onclose = ()=> { console.log('DISPLAY WS closed - reconnecting in 2s'); setTimeout(connectWS,2000); };
    ws.onerror = (e)=> { console.error('DISPLAY WS error', e); ws.close(); };
  } catch(e) { console.error('WS connect error', e); }
}

// start
fetchInitialCalled();
connectWS();
