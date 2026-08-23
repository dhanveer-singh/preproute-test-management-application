import { X } from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@/assets/images/logo.svg';

import { NAVIGATION_ITEMS, type NavigationItem } from '@/constants/navigation';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const navigate = useNavigate();

  const location = useLocation();

  const handleNavigation = (item: NavigationItem) => {
    if (item.disabled || !item.route) {
      return;
    }

    navigate(item.route);

    onClose();
  };

  return (
    <div
      className={`
        fixed
        inset-0
        z-50
        lg:hidden
        ${open ? 'pointer-events-auto' : 'pointer-events-none'}
      `}
      aria-hidden={!open}
    >
      {/* =====================================================
          BACKDROP
      ====================================================== */}

      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={onClose}
        className={`
          absolute
          inset-0
          cursor-default
          bg-[#101828]/40
          transition-opacity
          duration-200

          ${open ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* =====================================================
          DRAWER
      ====================================================== */}

      <aside
        aria-label="Mobile navigation"
        className={`
          absolute
          inset-y-0
          left-0
          flex
          w-[280px]
          max-w-[85vw]
          flex-col
          border-r
          border-[#E4E7EC]
          bg-white
          shadow-[8px_0_24px_rgba(16,24,40,0.12)]
          transition-transform
          duration-200
          ease-out

          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* =================================================
            DRAWER HEADER
        ================================================== */}

        <div
          className="
            flex
            h-[72px]
            shrink-0
            items-center
            justify-between
            border-b
            border-[#F2F4F7]
            px-5
            sm:h-[80px]
          "
        >
          <img
            src={logo}
            alt="Preproute"
            className="
              h-auto
              w-[130px]
              object-contain
            "
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="
              flex
              h-9
              w-9
              cursor-pointer
              items-center
              justify-center
              rounded-lg
              text-[#667085]
              outline-none
              transition
              hover:bg-[#F8F9FC]
              hover:text-[#344054]
              focus-visible:ring-2
              focus-visible:ring-[#315BEF]/30
            "
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav
          aria-label="Mobile main navigation"
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-4
            py-6
          "
        >
          <div className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;

              const active = !item.disabled && item.match?.(location.pathname);

              return (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleNavigation(item)}
                  aria-current={active ? 'page' : undefined}
                  title={item.disabled ? `${item.label} - Coming soon` : item.label}
                  className={`
                      group
                      relative
                      flex
                      h-12
                      w-full
                      items-center
                      gap-3
                      rounded-lg
                      px-4
                      text-left
                      text-[14px]
                      font-medium
                      outline-none
                      transition-colors
                      focus-visible:ring-2
                      focus-visible:ring-[#315BEF]/30

                      ${
                        active
                          ? 'bg-[#F5F8FF] text-[#315BEF]'
                          : item.disabled
                            ? 'cursor-not-allowed text-[#98A2B3]'
                            : 'cursor-pointer text-[#667085] hover:bg-[#F5F8FF] hover:text-[#315BEF]'
                      }
                    `}
                >
                  {/* Active indicator */}

                  {active && (
                    <span
                      aria-hidden="true"
                      className="
                          absolute
                          left-0
                          top-1/2
                          h-7
                          w-[3px]
                          -translate-y-1/2
                          rounded-r-full
                          bg-[#315BEF]
                        "
                    />
                  )}

                  {/* Same Lucide icon as desktop */}

                  <Icon
                    size={20}
                    strokeWidth={active ? 2 : 1.8}
                    className={`
                        shrink-0
                        ${
                          active
                            ? 'text-[#315BEF]'
                            : item.disabled
                              ? 'text-[#98A2B3]'
                              : 'text-[#667085] group-hover:text-[#315BEF]'
                        }
                      `}
                  />

                  <span className="min-w-0 flex-1 truncate">{item.label}</span>

                  {item.disabled && (
                    <span
                      className="
                          shrink-0
                          rounded-full
                          bg-[#F2F4F7]
                          px-2
                          py-0.5
                          text-[9px]
                          font-medium
                          uppercase
                          tracking-wide
                          text-[#98A2B3]
                        "
                    >
                      Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-[#E4E7EC]
            px-4
            py-4
          "
        >
          <p className="px-3 text-[11px] leading-5 text-[#98A2B3]">Preproute Test Management</p>
        </div>
      </aside>
    </div>
  );
}

export default MobileSidebar;
