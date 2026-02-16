import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, Wallet, Shield, AlertTriangle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

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
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/5 to-background">
        <div className="container py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                  Simulated Trading Platform
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Master Forex Trading with{' '}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  ForexPro
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Experience simulated forex trading with real-time market dynamics. Perfect your strategy without financial risk.
              </p>

              <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  <strong>Risk Disclaimer:</strong> Trading involves risk. This is a simulated platform for educational purposes. 
                  Profits are not guaranteed and past performance does not indicate future results.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Button size="lg" onClick={() => navigate({ to: '/trading' })} className="gap-2 shadow-glow-gold">
                    Start Trading
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => navigate({ to: '/trading' })} className="gap-2 shadow-glow-gold">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full" />
              <img
                src="/assets/generated/hero-illustration.dim_1600x900.png"
                alt="Trading Dashboard"
                className="relative rounded-lg shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Trade
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete simulated trading platform with wallet management, bonuses, and admin controls
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-primary/20">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join ForexPro today and experience simulated forex trading with a professional platform
              </p>
              {!isAuthenticated && (
                <Button size="lg" onClick={() => navigate({ to: '/trading' })} className="gap-2">
                  Login to Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
