export function getGuideStatus(key) {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setGuideStatus(key, status) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, status);
  } catch {
    // Storage can be unavailable in private or embedded contexts.
  }
}
