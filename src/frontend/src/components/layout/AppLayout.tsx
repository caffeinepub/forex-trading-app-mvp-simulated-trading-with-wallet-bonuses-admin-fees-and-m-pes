import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useCurrentUser';
import LoginButton from '../auth/LoginButton';
import { TrendingUp, Wallet, Shield, Menu, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { APP_NAME } from '../../config/branding';
import { getShareableLink } from '../../utils/shareableLink';
import { toast } from 'sonner';

export default function AppLayout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const navItems = [
    { path: '/trading', label: 'Trading', icon: TrendingUp, requiresAuth: true },
    { path: '/wallet', label: 'Wallet', icon: Wallet, requiresAuth: true },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: Shield, requiresAuth: true }] : [])
  ];

  const handleCopyLink = async () => {
    try {
      const shareableUrl = getShareableLink();
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Link copied to clipboard!', {
        description: 'You can now share this link with others.'
      });
    } catch (error) {
      toast.error('Failed to copy link', {
        description: 'Please try again or copy the URL manually from your browser.'
      });
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        if (item.requiresAuth && !isAuthenticated) return null;
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        
        return (
          <Button
            key={item.path}
            variant={isActive ? 'default' : 'ghost'}
            onClick={() => {
              navigate({ to: item.path });
              if (mobile) setMobileMenuOpen(false);
            }}
            className={mobile ? 'w-full justify-start' : ''}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-3 hover:opacity-80 transition-all group"
            >
              <div className="relative">
                <img 
                  src="./assets/generated/app-logo.dim_512x512.png" 
                  alt={APP_NAME} 
                  className="h-9 w-9 transition-transform group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                {APP_NAME}
              </span>
            </button>
            
            <nav className="hidden md:flex items-center gap-2">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              title="Copy app link"
              className="hidden sm:inline-flex"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <LoginButton />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-border/40">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks mobile />
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleCopyLink();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy app link
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-xl">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Built with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive animate-pulse" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
