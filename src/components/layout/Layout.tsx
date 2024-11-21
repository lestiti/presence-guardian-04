import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
    </div>
  );
};