const INTENDED_PATH_KEY = 'eugene_intended_path';

/**
 * Store the intended destination path for post-login redirect
 */
export function setIntendedPath(path: string): void {
  try {
    sessionStorage.setItem(INTENDED_PATH_KEY, path);
  } catch (error) {
    console.warn('Failed to store intended path:', error);
  }
}

/**
 * Retrieve the intended destination path
 */
export function getIntendedPath(): string | null {
  try {
    return sessionStorage.getItem(INTENDED_PATH_KEY);
  } catch (error) {
    console.warn('Failed to retrieve intended path:', error);
    return null;
  }
}

/**
 * Clear the stored intended path
 */
export function clearIntendedPath(): void {
  try {
    sessionStorage.removeItem(INTENDED_PATH_KEY);
  } catch (error) {
    console.warn('Failed to clear intended path:', error);
  }
}
