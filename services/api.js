// Centralised API helpers for the SmartPlant mobile/admin clients.

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  process.env.REACT_NATIVE_API_URL ||
  'http://localhost:3001';

function buildUrl(path) {
  const trimmedBase = API_BASE_URL.replace(/\/$/, '');
  const trimmedPath = path.startsWith('/') ? path : `/${path}`;
  return `${trimmedBase}${trimmedPath}`;
}

async function request(path, options = {}) {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

// Authentication (still mock – replace when auth API is ready)
const MOCK_ACCOUNTS = {
  'admin@smartplant.dev': {password: 'admin123', role: 'admin'},
  'ranger@smartplant.dev': {password: 'user1234', role: 'user'},
};

export async function loginUser(email, password) {
  const key = email.trim().toLowerCase();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const account = MOCK_ACCOUNTS[key];
      if (account && account.password === password) {
        resolve({success: true, role: account.role, email: key});
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 700);
  });
}

export async function registerUser(userData) {
  console.warn('registerUser is still mocked. Replace when auth API is ready.');
  return new Promise(resolve => {
    setTimeout(() => resolve({success: true}), 600);
  });
}

export async function forgotPassword(email) {
  return request('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({email}),
  });
}

// --- Admin data helpers ----
export const fetchDashboardStats = () => request('/dashboard/stats');
export const fetchUsers = () => request('/users');
export const fetchUser = id => request(`/users/${id}`);
export const updateUser = (id, payload) =>
  request(`/users/${id}`, {method: 'PUT', body: JSON.stringify(payload)});

export const fetchSpecies = () => request('/species');
export const createSpecies = payload =>
  request('/species', {method: 'POST', body: JSON.stringify(payload)});
export const updateSpecies = (id, payload) =>
  request(`/species/${id}`, {method: 'PUT', body: JSON.stringify(payload)});
export const deleteSpecies = id =>
  request(`/species/${id}`, {method: 'DELETE'});

export const fetchObservations = () => request('/plant-observations');
export const updateObservation = (id, payload) =>
  request(`/plant-observations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
export const deleteObservation = id =>
  request(`/plant-observations/${id}`, {method: 'DELETE'});

export const fetchSensorDevices = () => request('/sensor-devices');
export const fetchSensorReadings = () => request('/sensor-readings');
export const fetchAlerts = () => request('/alerts');
