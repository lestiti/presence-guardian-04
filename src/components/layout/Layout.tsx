import { Header } from "./Header";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "@/hooks/useTheme";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useKeyboardShortcuts();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary relative ${
      theme === 'dark' ? 'dark' : ''
    }`}>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      <Header />
      <main className="pt-20 pb-8 relative">
        <div className="container mx-auto px-4 space-y-6">
          {children}
        </div>
      </main>
      <div className="fixed bottom-4 right-4 animate-pulse-glow rounded-full w-2 h-2 bg-primary" />
    </div>
  );
};