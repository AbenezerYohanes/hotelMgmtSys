const API_BASE = process.env.NEXT_PUBLIC_STAFF_API || 'http://localhost:4001/staff';

let token = null;
const setToken = t => { token = t; };

const headers = (h = {}) => ({ 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...h });

async function parseJsonSafe(res){
  try { return await res.json(); } catch (e) { return null; }
}

const rawPost = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Request failed');
  return json;
};

const get = async (path) => {
  const res = await fetch(`${API_BASE}${path}`, { headers: headers() });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Request failed');
  return json;
};

const put = async (path, body) => {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) });
  const json = await parseJsonSafe(res);
  if (!res.ok) throw new Error((json && (json.error || json.message)) || 'Request failed');
  return json;
};

const Api = { setToken, rawPost, get, put };
export default Api;
