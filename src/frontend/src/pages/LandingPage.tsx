import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Wallet, Shield, AlertTriangle, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION } from '../config/branding';
import { setIntendedPath } from '../utils/postLoginRedirect';
import { validateAuthConfig } from '../utils/authConfig';
import { attemptLogin } from '../utils/loginRecovery';
import { useState } from 'react';

export default function LandingPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleGetStarted = async () => {
    if (isAuthenticated) {
      // Already authenticated, navigate directly
      window.location.hash = '#/trading';
      return;
    }

    // Store intended destination
    setIntendedPath('/trading');

    // Validate configuration before attempting login
    const configValidation = validateAuthConfig();
    if (!configValidation.isValid) {
      setLoginError(configValidation.errorMessage || 'Configuration error');
      return;
    }

    setLoginError(null);
    
    // Attempt login
    const result = await attemptLogin(async () => {
      await login();
    });

    if (!result.success && result.error) {
      setLoginError(result.error);
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'Simulated Trading',
      description: 'Practice forex trading with major currency pairs in a risk-free environment'
    },
    {
      icon: Wallet,
      title: 'Wallet Management',
      description: 'Deposit, withdraw, and manage your trading balance with M-Pesa support'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Built on Internet Computer with Internet Identity authentication'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(var(--primary)/0.15),transparent_50%),radial-gradient(circle_at_70%_60%,oklch(var(--secondary)/0.15),transparent_50%)]" />
        
        <div className="container relative py-24 md:py-36">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium border border-primary/20 shadow-glow-subtle">
                <Sparkles className="h-4 w-4" />
                Simulated Trading Platform
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                Master Forex Trading with{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer glow-text">
                  {APP_NAME}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {APP_DESCRIPTION}. Perfect your strategy without financial risk.
              </p>

              <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 backdrop-blur-sm">
                <AlertTriangle className="h-5 w-5" />
                <AlertDescription className="font-medium text-base">
                  <strong>Risk Disclaimer:</strong> Trading involves risk. This is a simulated platform for educational purposes. 
                  Profits are not guaranteed and past performance does not indicate future results.
                </AlertDescription>
              </Alert>

              {loginError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  disabled={isLoggingIn}
                  className="gap-2 shadow-premium text-base px-8 py-6 rounded-xl"
                >
                  {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Start Trading' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-3xl rounded-full animate-pulse-glow" />
              <div className="relative rounded-2xl overflow-hidden shadow-premium-lg border border-border/50 backdrop-blur-sm animate-float">
                <img
                  src="./assets/generated/hero-illustration.dim_1600x900.png"
                  alt="Trading Dashboard"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 opacity-50">
                <img
                  src="./assets/generated/finance-icons.dim_1024x1024.png"
                  alt="Finance Icons"
                  className="w-full h-full object-contain animate-float"
                  style={{ animationDelay: '1s' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-card/30">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything You Need to Trade
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete simulated trading platform with wallet management, bonuses, and admin controls
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-premium group"
                >
                  <CardContent className="pt-8 pb-6 space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-subtle">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <Card className="relative overflow-hidden border-primary/20 shadow-premium-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(var(--primary)/0.1),transparent_70%)]" />
            <CardContent className="relative py-16 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to Start Trading?</h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join {APP_NAME} today and experience simulated forex trading with a professional platform
              </p>
              {!isAuthenticated && (
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  disabled={isLoggingIn}
                  className="gap-2 shadow-premium text-base px-8 py-6 rounded-xl mt-4"
                >
                  {isLoggingIn ? 'Logging in...' : 'Login to Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
