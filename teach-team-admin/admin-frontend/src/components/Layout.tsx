import Navbar from "./Navbar";

// This component provides a layout for admin pages.
// It can be used to add shared UI elements or structure around page content.


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  // Rendering the children passed to this layout
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
} 