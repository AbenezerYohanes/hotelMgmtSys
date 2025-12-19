export function parseToken(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload;
  } catch (e) {
    return null;
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const t = localStorage.getItem('token');
  return parseToken(t);
}

export function hasRole(role) {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === role || (Array.isArray(role) && role.includes(user.role));
}
