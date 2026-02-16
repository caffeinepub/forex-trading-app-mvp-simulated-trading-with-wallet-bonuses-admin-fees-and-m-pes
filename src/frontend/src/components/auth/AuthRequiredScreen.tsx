import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Home, AlertCircle } from 'lucide-react';
import { validateAuthConfig } from '../../utils/authConfig';
import { attemptLogin } from '../../utils/loginRecovery';

interface AuthRequiredScreenProps {
  title?: string;
  description?: string;
}

export default function AuthRequiredScreen({ 
  title = 'Login Required',
  description = 'You need to log in to access this page.'
}: AuthRequiredScreenProps) {
  const navigate = useNavigate();
  const { login, loginStatus, isLoginError, loginError } = useInternetIdentity();
  const [customLoginError, setCustomLoginError] = useState<string | null>(null);

  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    // Validate configuration before attempting login
    const configValidation = validateAuthConfig();
    if (!configValidation.isValid) {
      setCustomLoginError(configValidation.errorMessage || 'Configuration error');
      return;
    }

    setCustomLoginError(null);
    
    const result = await attemptLogin(async () => {
      await login();
    });

    if (!result.success && result.error) {
      setCustomLoginError(result.error);
    }
  };

  const displayError = customLoginError || (isLoginError && loginError?.message);
  const showError = displayError;

  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {displayError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleLogin} 
              disabled={isLoggingIn}
              className="w-full gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
            </Button>
            
            <Button 
              onClick={() => navigate({ to: '/' })} 
              variant="outline"
              className="w-full gap-2"
            >
              <Home className="w-4 h-4" />
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
