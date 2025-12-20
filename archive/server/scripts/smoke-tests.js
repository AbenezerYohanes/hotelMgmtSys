const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://localhost:5000';
const tests = [];

function runCurl(path, method = 'GET', data = null) {
  try {
    const args = ['-sS', '-X', method, '-H', 'Content-Type: application/json'];
    if (data) args.push('-d', JSON.stringify(data));
    args.push('-w', '\nHTTP_STATUS:%{http_code}\n', BASE + path);
    const proc = spawnSync('curl', args, { encoding: 'utf8' });
    if (proc.error) return { ok: false, status: null, body: proc.error.message };
    const out = proc.stdout || '';
    const parts = out.split('\nHTTP_STATUS:');
    const payload = parts[0].trim();
    const status = parts[1] ? Number(parts[1].trim()) : (proc.status === 0 ? 200 : null);
    let json = null;
    try { json = JSON.parse(payload); } catch (e) { json = payload; }
    return { ok: status && status >= 200 && status < 300, status, body: json };
  } catch (err) {
    return { ok: false, status: null, body: err.message };
  }
}

async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const results = { timestamp: new Date().toISOString(), base: BASE, tests: [] };

  const endpoints = [
    { name: 'health', path: '/api/health' },
    { name: 'rooms', path: '/api/rooms' },
    { name: 'bookings_list', path: '/api/bookings' },
    { name: 'payments', path: '/api/payments' },
    { name: 'hr_dashboard', path: '/api/hr/dashboard' },
    { name: 'guests_list', path: '/api/guests' }
  ];

  for (const ep of endpoints) {
    const res = runCurl(ep.path, 'GET');
    results.tests.push({ name: ep.name, method: 'GET', path: ep.path, result: res });
    console.log(`${ep.name}: ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
  }

  // Create guest (no auth required)
  const guestPayload = { first_name: 'Smoke', last_name: 'Tester', email: `smoke+${Date.now()}@example.com` };
  const createGuest = runCurl('/api/guests', 'POST', guestPayload);
  results.tests.push({ name: 'create_guest', method: 'POST', path: '/api/guests', payload: guestPayload, result: createGuest });
  console.log(`create_guest: ${createGuest.status} ${createGuest.ok ? 'OK' : 'FAIL'}`);

  let guestId = null;
  if (createGuest.ok && createGuest.body && createGuest.body.data && createGuest.body.data.id) {
    guestId = createGuest.body.data.id;
  } else if (createGuest.ok && createGuest.body && createGuest.body.data && createGuest.body.data.insertId) {
    guestId = createGuest.body.data.insertId;
  } else if (createGuest.ok && createGuest.body && createGuest.body.data && createGuest.body.data.id === undefined && createGuest.body.data) {
    // sometimes API returns full object without id key named id
    guestId = createGuest.body.data.id || createGuest.body.data.ID || null;
  }

  if (guestId) {
    const getGuest = runCurl(`/api/guests/${guestId}`, 'GET');
    results.tests.push({ name: 'get_guest', method: 'GET', path: `/api/guests/${guestId}`, result: getGuest });
    console.log(`get_guest: ${getGuest.status} ${getGuest.ok ? 'OK' : 'FAIL'}`);

    const updatePayload = { phone: '+1555000' };
    const updateGuest = runCurl(`/api/guests/${guestId}`, 'PUT', updatePayload);
    results.tests.push({ name: 'update_guest', method: 'PUT', path: `/api/guests/${guestId}`, payload: updatePayload, result: updateGuest });
    console.log(`update_guest: ${updateGuest.status} ${updateGuest.ok ? 'OK' : 'FAIL'}`);

    const guestBookings = runCurl(`/api/guests/${guestId}/bookings`, 'GET');
    results.tests.push({ name: 'guest_bookings', method: 'GET', path: `/api/guests/${guestId}/bookings`, result: guestBookings });
    console.log(`guest_bookings: ${guestBookings.status} ${guestBookings.ok ? 'OK' : 'FAIL'}`);
  } else {
    console.log('Guest creation did not return an ID; skipping guest-detail tests.');
  }

  const outFile = path.join(logDir, `smoke-tests-${ts}.json`);
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log('\nSmoke tests complete. Log saved to', outFile);
}

main().catch(e => { console.error('Smoke tests failed:', e); process.exit(1); });
