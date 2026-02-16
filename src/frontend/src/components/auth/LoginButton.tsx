import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, AlertCircle } from 'lucide-react';
import { validateAuthConfig } from '../../utils/authConfig';
import { attemptLogin } from '../../utils/loginRecovery';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginButton() {
  const { login, clear, loginStatus, identity, isLoginError, loginError } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [customLoginError, setCustomLoginError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      setCustomLoginError(null);
    } else {
      // Validate configuration before attempting login
      const configValidation = validateAuthConfig();
      if (!configValidation.isValid) {
        setCustomLoginError(configValidation.errorMessage || 'Configuration error');
        return;
      }

      setCustomLoginError(null);
      
      const result = await attemptLogin(async () => {
        try {
          await login();
        } catch (error: any) {
          if (error.message === 'User is already authenticated') {
            await clear();
            setTimeout(() => login(), 300);
          } else {
            throw error;
          }
        }
      });

      if (!result.success && result.error) {
        setCustomLoginError(result.error);
      }
    }
  };

  const displayError = customLoginError || (isLoginError && loginError?.message);
  const showError = displayError && !isAuthenticated;

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={handleAuth}
        disabled={isLoggingIn}
        variant={isAuthenticated ? 'outline' : 'default'}
        className="gap-2"
      >
        {isLoggingIn ? (
          'Logging in...'
        ) : isAuthenticated ? (
          <>
            <LogOut className="w-4 h-4" />
            Logout
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Login
          </>
        )}
      </Button>
      
      {showError && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {displayError}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
