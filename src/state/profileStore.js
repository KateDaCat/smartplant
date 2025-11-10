import { mockUser as MOCK_USER } from '../data/mockPlants';

let currentUser = { ...MOCK_USER };

const listeners = new Set();

export function getProfile() {
  return currentUser;
}

export function updateProfile(updates) {
  currentUser = { ...currentUser, ...updates };
  listeners.forEach(listener => {
    try {
      listener(currentUser);
    } catch (e) {
      console.warn('profileStore listener error', e);
    }
  });
}

export function subscribeProfile(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
