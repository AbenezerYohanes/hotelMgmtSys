const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE_URL || 'http://localhost:5000';

function runCurlArgs(args) {
  const proc = spawnSync('curl', args, { encoding: 'utf8' });
  if (proc.error) return { ok: false, status: null, body: proc.error.message };
  const out = proc.stdout || '';
  const parts = out.split('\nHTTP_STATUS:');
  const payload = parts[0].trim();
  const status = parts[1] ? Number(parts[1].trim()) : (proc.status === 0 ? 200 : null);
  let json = null;
  try { json = JSON.parse(payload); } catch (e) { json = payload; }
  return { ok: status && status >= 200 && status < 300, status, body: json };
}

function get(path) { return runCurlArgs(['-sS','-X','GET','-H','Content-Type: application/json','-w','\nHTTP_STATUS:%{http_code}\n', BASE+path]); }
function post(path, data, token) {
  const args = ['-sS','-X','POST','-H','Content-Type: application/json'];
  if (token) args.push('-H', `Authorization: Bearer ${token}`);
  args.push('-d', JSON.stringify(data), '-w', '\nHTTP_STATUS:%{http_code}\n', BASE+path);
  return runCurlArgs(args);
}
function put(path, data, token) {
  const args = ['-sS','-X','PUT','-H','Content-Type: application/json'];
  if (token) args.push('-H', `Authorization: Bearer ${token}`);
  args.push('-d', JSON.stringify(data), '-w', '\nHTTP_STATUS:%{http_code}\n', BASE+path);
  return runCurlArgs(args);
}

async function main() {
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const logDir = path.join(__dirname, '..', 'logs'); if (!fs.existsSync(logDir)) fs.mkdirSync(logDir,{recursive:true});
  const results = { timestamp: new Date().toISOString(), base: BASE, tests: [] };

  // Register user
  const reg = post('/api/auth/register', { email: `smoke+${Date.now()}@example.com`, password: 'password123', first_name: 'Smoke', last_name: 'User' });
  results.tests.push({ name: 'register', result: reg });
  if (!reg.ok) { fs.writeFileSync(path.join(logDir, `smoke-extended-${ts}.json`), JSON.stringify(results,null,2)); console.log('register failed', reg); return; }

  // Login
  const login = post('/api/auth/login', { email: reg.body.data.user.email, password: 'password123' });
  results.tests.push({ name: 'login', result: login });
  if (!login.ok) { fs.writeFileSync(path.join(logDir, `smoke-extended-${ts}.json`), JSON.stringify(results,null,2)); console.log('login failed', login); return; }
  const token = login.body.token;

  // Create guest (as authenticated user)
  const guest = post('/api/guests', { first_name: 'AuthGuest', last_name: 'Smoke', email: `authguest+${Date.now()}@example.com` }, token);
  results.tests.push({ name: 'create_guest_auth', result: guest });
  if (!guest.ok) { fs.writeFileSync(path.join(logDir, `smoke-extended-${ts}.json`), JSON.stringify(results,null,2)); console.log('create guest failed', guest); return; }
  const guestId = guest.body.data.id;

  // Create booking
  // find an available room id
  const rooms = get('/api/rooms');
  results.tests.push({ name: 'rooms_for_booking', result: rooms });
  if (!rooms.ok || !rooms.body || !rooms.body.data || rooms.body.data.length === 0) { fs.writeFileSync(path.join(logDir, `smoke-extended-${ts}.json`), JSON.stringify(results,null,2)); console.log('no rooms', rooms); return; }
  const roomId = rooms.body.data[0].id;

  const checkIn = new Date(Date.now() + 24*3600*1000).toISOString().split('T')[0];
  const checkOut = new Date(Date.now() + 3*24*3600*1000).toISOString().split('T')[0];
  const bookingPayload = { guest_id: guestId, room_id: roomId, check_in_date: checkIn, check_out_date: checkOut, adults: 1, children: 0 };
  const booking = post('/api/bookings', bookingPayload, token);
  results.tests.push({ name: 'create_booking', result: booking });
  if (!booking.ok) { fs.writeFileSync(path.join(logDir, `smoke-extended-${ts}.json`), JSON.stringify(results,null,2)); console.log('create booking failed', booking); return; }
  const bookingId = booking.body.data.booking_id;

  // Update booking (change status to confirmed)
  const update = put(`/api/bookings/${bookingId}`, { status: 'confirmed' }, token);
  results.tests.push({ name: 'update_booking_confirm', result: update });

  fs.writeFileSync(path.join(logDir, `smoke-extended-${ts}.json`), JSON.stringify(results,null,2));
  console.log('Extended smoke tests complete. Log:', path.join(logDir, `smoke-extended-${ts}.json`));
}

main().catch(e=>{ console.error(e); process.exit(1); });
