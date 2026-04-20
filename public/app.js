/* ============================================================
   RAYLANE EXPRESS — SHARED JAVASCRIPT UTILITIES
   ============================================================ */

'use strict';

/* ── TOAST ── */
function toast(msg, duration = 3500) {
  let el = document.getElementById('rl-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'rl-toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ── MOBILE MENU ── */
function toggleMobMenu() {
  const m = document.getElementById('mob-menu');
  if (!m) return;
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}
document.addEventListener('click', (e) => {
  const m = document.getElementById('mob-menu');
  const h = document.querySelector('.hamburger');
  if (m && h && !m.contains(e.target) && !h.contains(e.target)) {
    m.style.display = 'none';
  }
});

/* ── MODAL ── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* ── TAB SWITCHER ── */
function switchTab(barId, targetId, activeClass = 'active') {
  const bar = document.getElementById(barId);
  if (!bar) return;
  bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove(activeClass));
  const btn = bar.querySelector(`[data-tab="${targetId}"]`);
  if (btn) btn.classList.add(activeClass);
  document.querySelectorAll(`[data-tab-panel]`).forEach(p => {
    p.classList.toggle('hidden', p.dataset.tabPanel !== targetId);
  });
}

/* ── LOCATION DETECT ── */
function detectNearestTerminal(callback) {
  const TERMINALS = [
    { name: 'Kampala Coach Park — Nakivubo',   lat: 0.3136, lon: 32.5811 },
    { name: 'Kampala — Old Taxi Park',          lat: 0.3180, lon: 32.5790 },
    { name: 'Kampala — Kisenyi Bus Terminal',   lat: 0.3100, lon: 32.5740 },
    { name: 'Jinja Bus Park',                    lat: 0.4244, lon: 33.2041 },
    { name: 'Mbale Bus Terminal',                lat: 1.0824, lon: 34.1754 },
    { name: 'Gulu Bus Terminal',                 lat: 2.7748, lon: 32.2990 },
    { name: 'Mbarara Bus Park',                  lat: -0.6072, lon: 30.6545 },
    { name: 'Fort Portal Bus Park',              lat: 0.6710, lon: 30.2756 },
    { name: 'Arua Bus Terminal',                 lat: 3.0207, lon: 30.9110 },
    { name: 'Kabale Bus Park',                   lat: -1.2493, lon: 29.9902 },
  ];
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  if (!navigator.geolocation) { callback(null, 'Location not supported'); return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      let nearest = TERMINALS[0], minDist = Infinity;
      TERMINALS.forEach(t => {
        const d = haversine(lat, lon, t.lat, t.lon);
        if (d < minDist) { minDist = d; nearest = t; }
      });
      callback(nearest, null, Math.round(minDist * 1000));
    },
    err => callback(null, err.message)
  );
}

/* ── SEAT MAP BUILDER ── */
function buildSeatMap(containerId, totalSeats, bookedSeats, onSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  let selected = [];
  const pricePerSeat = 35000;

  // Bus nose
  const nose = document.createElement('div');
  nose.className = 'bus-nose';
  nose.textContent = '🚌 Driver Cabin — Front of Bus';
  container.appendChild(nose);

  const rowsWrap = document.createElement('div');
  rowsWrap.className = 'seat-rows';

  // Front row: driver + 2 seats
  let seatNum = 1;
  const frontRow = document.createElement('div');
  frontRow.className = 'seat-row';
  const drv = document.createElement('button');
  drv.className = 'seat driver'; drv.textContent = 'DRV'; drv.disabled = true;
  frontRow.appendChild(drv);
  const aisleF = document.createElement('div'); aisleF.className = 'aisle-gap';
  frontRow.appendChild(aisleF);
  for (let i = 0; i < 2; i++) {
    const s = mkSeat(seatNum, bookedSeats, selected, onSelect, pricePerSeat);
    frontRow.appendChild(s); seatNum++;
  }
  rowsWrap.appendChild(frontRow);

  // Middle rows (2 + aisle + 3)
  for (let r = 0; r < 12; r++) {
    const row = document.createElement('div');
    row.className = 'seat-row';
    for (let c = 0; c < 5; c++) {
      if (c === 2) { const a = document.createElement('div'); a.className = 'aisle-gap'; row.appendChild(a); continue; }
      row.appendChild(mkSeat(seatNum, bookedSeats, selected, onSelect, pricePerSeat));
      seatNum++;
    }
    rowsWrap.appendChild(row);
  }

  // Back row (5)
  const backRow = document.createElement('div');
  backRow.className = 'seat-row';
  for (let i = 0; i < 5 && seatNum <= totalSeats; i++) {
    backRow.appendChild(mkSeat(seatNum, bookedSeats, selected, onSelect, pricePerSeat));
    seatNum++;
  }
  rowsWrap.appendChild(backRow);
  container.appendChild(rowsWrap);
}

function mkSeat(num, booked, selected, onSelect, price) {
  const s = document.createElement('button');
  s.className = 'seat ' + (booked.includes(num) ? 'booked' : 'available');
  s.textContent = num;
  s.disabled = booked.includes(num);
  if (!booked.includes(num)) {
    s.onclick = () => {
      const idx = selected.indexOf(num);
      if (idx > -1) { selected.splice(idx, 1); s.classList.remove('selected'); s.classList.add('available'); }
      else { selected.push(num); s.classList.remove('available'); s.classList.add('selected'); }
      if (onSelect) onSelect(selected, selected.length * price);
    };
  }
  return s;
}

/* ── FORMAT CURRENCY ── */
function fmtUGX(n) { return 'UGX ' + Number(n).toLocaleString('en-UG'); }

/* ── BOOKING TIMER ── */
function startBookingTimer(seconds, displayId, onExpire) {
  const el = document.getElementById(displayId);
  let remaining = seconds;
  const interval = setInterval(() => {
    remaining--;
    if (el) {
      const m = Math.floor(remaining / 60).toString().padStart(2, '0');
      const s = (remaining % 60).toString().padStart(2, '0');
      el.textContent = `${m}:${s}`;
    }
    if (remaining <= 0) { clearInterval(interval); if (onExpire) onExpire(); }
  }, 1000);
  return interval;
}

/* ── LOGO UPLOAD HANDLER ── */
function handleLogoUpload(inputId, previewId, storeKey) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!input || !preview) return;
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.src = ev.target.result;
      preview.style.display = 'block';
      if (storeKey) localStorage.setItem(storeKey, ev.target.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ── OPERATOR BRANDING ── */
function applyOperatorBranding(primary, accent, dark) {
  document.documentElement.style.setProperty('--op-primary', primary || '#0B3D91');
  document.documentElement.style.setProperty('--op-accent',  accent  || '#FFC72C');
  document.documentElement.style.setProperty('--op-dark',    dark    || '#0A1628');
  document.querySelectorAll('.op-primary-bg').forEach(el => el.style.background = primary);
  document.querySelectorAll('.op-accent-bg').forEach(el => el.style.background = accent);
}

function loadOperatorBranding() {
  try {
    const b = JSON.parse(localStorage.getItem('rl_op_branding') || '{}');
    if (b.primary) applyOperatorBranding(b.primary, b.accent, b.dark);
    const logo = localStorage.getItem('rl_op_logo');
    if (logo) {
      document.querySelectorAll('.op-logo-img').forEach(el => { el.src = logo; el.style.display = 'block'; });
      document.querySelectorAll('.op-logo-hide').forEach(el => el.style.display = 'none');
    }
  } catch(e) {}
}

/* ── LIVE CLOCK ── */
function startLiveClock(id) {
  function tick() {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = new Date().toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick();
  return setInterval(tick, 1000);
}

/* ── GENERATE QR SVG ── */
function generateQR(bookingId) {
  // Simple SVG QR code representation (decorative — real implementation uses qrcode.js)
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="5" width="35" height="35" rx="4" fill="#0B3D91"/>
    <rect x="10" y="10" width="25" height="25" rx="2" fill="#fff"/>
    <rect x="15" y="15" width="15" height="15" fill="#0B3D91"/>
    <rect x="60" y="5" width="35" height="35" rx="4" fill="#0B3D91"/>
    <rect x="65" y="10" width="25" height="25" rx="2" fill="#fff"/>
    <rect x="70" y="15" width="15" height="15" fill="#0B3D91"/>
    <rect x="5" y="60" width="35" height="35" rx="4" fill="#0B3D91"/>
    <rect x="10" y="65" width="25" height="25" rx="2" fill="#fff"/>
    <rect x="15" y="70" width="15" height="15" fill="#0B3D91"/>
    <rect x="55" y="55" width="8" height="8" fill="#0B3D91"/>
    <rect x="68" y="55" width="8" height="8" fill="#0B3D91"/>
    <rect x="81" y="55" width="8" height="8" fill="#0B3D91"/>
    <rect x="55" y="68" width="8" height="8" fill="#0B3D91"/>
    <rect x="81" y="68" width="8" height="8" fill="#0B3D91"/>
    <rect x="55" y="81" width="8" height="8" fill="#0B3D91"/>
    <rect x="68" y="81" width="8" height="8" fill="#0B3D91"/>
    <text x="50" y="49" text-anchor="middle" font-size="6" font-family="monospace" fill="#0B3D91">${bookingId}</text>
  </svg>`;
}

/* ── PARCEL TRACKING STATUS ── */
const PARCEL_STATUSES = ['Picked Up', 'Verified', 'On Board', 'In Transit', 'Delivered'];

/* ── DOM READY ── */
document.addEventListener('DOMContentLoaded', () => {
  loadOperatorBranding();
  // Close mob menu on outside tap
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('mob-menu');
    const ham  = document.querySelector('.hamburger');
    if (menu && ham && !menu.contains(e.target) && !ham.contains(e.target)) {
      menu.style.display = 'none';
    }
  });
});
