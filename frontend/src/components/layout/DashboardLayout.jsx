import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ sidebar, main }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 overflow-hidden font-sans">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden absolute top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800/60 bg-[#09090bd9] px-4 backdrop-blur-md">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 text-xs shadow-sm">
            DM
          </div>
          <span className="tracking-wide">DocuMind AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-40 w-3/4 max-w-[300px] border-r border-zinc-800 bg-[#09090b] shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-end p-2 border-b border-zinc-800/50 h-14">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
                {sidebar}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Fixed) */}
      <aside className="hidden lg:flex flex-col w-[300px] xl:w-[320px] 2xl:w-[350px] border-r border-zinc-800/60 bg-[#09090b] flex-shrink-0 z-10 transition-all duration-300">
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative pt-14 lg:pt-0 bg-[#09090b] lg:bg-zinc-950/50 transition-all duration-300">
        {main}
      </main>
    </div>
  );
}
