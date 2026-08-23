import { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';

import Header from '@/components/Header';
import MobileSidebar from '@/components/MobileSidebar';
import Sidebar from '@/components/Sidebar';

function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  /* =========================================================
     TOGGLE MOBILE SIDEBAR
  ========================================================= */

  const handleMenuClick = () => {
    setMobileSidebarOpen((previous) => !previous);
  };

  /* =========================================================
     CLOSE MOBILE SIDEBAR
  ========================================================= */

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  /* =========================================================
     CLOSE WITH ESC
  ========================================================= */

  useEffect(() => {
    if (!mobileSidebarOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileSidebarOpen]);

  /* =========================================================
     PREVENT BODY SCROLL WHEN DRAWER IS OPEN
  ========================================================= */

  useEffect(() => {
    if (!mobileSidebarOpen) {
      document.body.style.overflow = '';

      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen min-w-0 bg-[#F8F9FC]">
      {/* =====================================================
          DESKTOP / TABLET SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}

      <MobileSidebar open={mobileSidebarOpen} onClose={closeMobileSidebar} />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          min-h-screen
          min-w-0

          lg:ml-[72px]
          xl:ml-[240px]
        "
      >
        <Header onMenuClick={handleMenuClick} mobileSidebarOpen={mobileSidebarOpen} />

        <main className="min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
