/**
 * Wraps login attempt with timeout-based recovery and error handling
 */
export async function attemptLogin(
  loginFn: () => Promise<void>,
  timeoutMs: number = 60000
): Promise<{ success: boolean; error?: string }> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Login timeout')), timeoutMs);
    });

    await Promise.race([loginFn(), timeoutPromise]);
    return { success: true };
  } catch (error: any) {
    console.error('Login attempt failed:', error);
    
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.message === 'Login timeout') {
      errorMessage = 'Login timed out. Please try again.';
    } else if (error.message?.includes('User is already authenticated')) {
      errorMessage = 'Already authenticated. Please refresh and try again.';
    } else if (error.message?.includes('User interrupted')) {
      errorMessage = 'Login was cancelled.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return { success: false, error: errorMessage };
  }
}
