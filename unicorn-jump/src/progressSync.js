const PROFILE_STORAGE_KEY = 'sapphireWorldProfileId';
const DEVICE_STORAGE_KEY = 'sapphireWorldDeviceId';

const getProgressApiBase = () =>
  (process.env.REACT_APP_SAPPHIRE_PROGRESS_API || '').replace(/\/+$/, '');

export const isProgressSyncEnabled = () => Boolean(getProgressApiBase());

export const getProgressProfileId = () => {
  try {
    const url = new URL(window.location.href);
    const profileFromUrl = url.searchParams.get('profile');
    if (profileFromUrl) {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, profileFromUrl);
      return profileFromUrl;
    }

    return window.localStorage.getItem(PROFILE_STORAGE_KEY) || 'sapphire';
  } catch (error) {
    return 'sapphire';
  }
};

export const getProgressDeviceId = () => {
  try {
    const storedDeviceId = window.localStorage.getItem(DEVICE_STORAGE_KEY);
    if (storedDeviceId) {
      return storedDeviceId;
    }

    const nextDeviceId =
      typeof window.crypto?.randomUUID === 'function'
        ? window.crypto.randomUUID()
        : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    window.localStorage.setItem(DEVICE_STORAGE_KEY, nextDeviceId);
    return nextDeviceId;
  } catch (error) {
    return 'unknown-device';
  }
};

const getProfileProgressUrl = (profileId) =>
  `${getProgressApiBase()}/profiles/${encodeURIComponent(profileId)}/progress`;

export const loadRemoteProgress = async (profileId) => {
  if (!isProgressSyncEnabled()) {
    return null;
  }

  const response = await fetch(getProfileProgressUrl(profileId), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Progress sync load failed: ${response.status}`);
  }

  return response.json();
};

export const saveRemoteProgress = async (profileId, progress) => {
  if (!isProgressSyncEnabled()) {
    return null;
  }

  const response = await fetch(getProfileProgressUrl(profileId), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(progress),
  });

  if (!response.ok) {
    throw new Error(`Progress sync save failed: ${response.status}`);
  }

  return response.json();
};
