/**
 * Validates Internet Identity provider configuration
 * Returns validation result with user-friendly error message
 */
export interface AuthConfigValidation {
  isValid: boolean;
  errorMessage?: string;
}

export function validateAuthConfig(): AuthConfigValidation {
  const providerUrl = process.env.II_URL;
  
  if (!providerUrl || providerUrl.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Internet Identity provider is not configured. Please contact support.'
    };
  }

  // Basic URL validation
  try {
    new URL(providerUrl);
  } catch {
    return {
      isValid: false,
      errorMessage: 'Internet Identity provider URL is invalid. Please contact support.'
    };
  }

  return { isValid: true };
}
