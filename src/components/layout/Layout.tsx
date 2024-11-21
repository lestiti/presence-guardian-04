import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <Header />
      <main className="pt-20 pb-8 relative">
        <div className="container mx-auto px-4 transition-all duration-300 hover:animate-zoom-hover">
          {children}
        </div>
      </main>
    </div>
  );
};