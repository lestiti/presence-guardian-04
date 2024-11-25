import { Header } from "./Header";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/hooks/useTheme";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useKeyboardShortcuts();
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        <Header />
        <main className="relative min-h-screen pt-20 pb-8">
          <div className="container mx-auto px-4">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
        <div className="fixed bottom-4 right-4 animate-pulse-glow rounded-full w-2 h-2 bg-primary" />
      </div>
      <Toaster />
    </div>
  );
};