import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@/assets/images/logo.svg';

import { NAVIGATION_ITEMS, type NavigationItem } from '@/constants/navigation';
import FRONTEND_ROUTES from '@/constants/frontendRoutes';

function Sidebar() {
  const navigate = useNavigate();

  const location = useLocation();

  const handleNavigation = (item: NavigationItem) => {
    if (item.disabled || !item.route) {
      return;
    }

    navigate(item.route);
  };

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-40
        hidden
        border-r
        border-[#E4E7EC]
        bg-white
        lg:flex
        lg:w-[72px]
        xl:w-[240px]
      "
    >
      <div className="flex min-h-0 w-full flex-col">
        {/* =====================================================
            LOGO
        ====================================================== */}

        <div
          className="
            flex
            h-[92px]
            shrink-0
            items-center
            justify-center
            border-b
            border-[#F2F4F7]
            px-3
            xl:justify-start
            xl:px-6
          "
        >
          <button
            type="button"
            onClick={() => navigate(FRONTEND_ROUTES.DASHBOARD)}
            aria-label="Go to dashboard"
            className="
              cursor-pointer
              rounded-md
              outline-none
              focus-visible:ring-2
              focus-visible:ring-[#315BEF]/30
            "
          >
            <img
              src={logo}
              alt="Preproute"
              className="
                hidden
                h-auto
                w-[140px]
                object-contain
                xl:block
              "
            />

            {/* Tablet logo */}

            <img
              src={logo}
              alt=""
              aria-hidden="true"
              className="
                block
                h-auto
                w-[38px]
                object-contain
                xl:hidden
              "
            />
          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav
          aria-label="Main navigation"
          className="
            min-h-0
            flex-1
            overflow-y-auto
            px-2
            py-6
            xl:px-4
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
                      px-3
                      text-left
                      text-[14px]
                      font-medium
                      outline-none
                      transition-colors
                      focus-visible:ring-2
                      focus-visible:ring-[#315BEF]/30
                      xl:px-4

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

                  {/* Icon */}

                  <Icon
                    size={20}
                    strokeWidth={active ? 2 : 1.8}
                    className={`
                        shrink-0
                        transition-colors

                        ${
                          active
                            ? 'text-[#315BEF]'
                            : item.disabled
                              ? 'text-[#98A2B3]'
                              : 'text-[#667085] group-hover:text-[#315BEF]'
                        }
                      `}
                  />

                  {/* Label */}

                  <span
                    className="
                        hidden
                        min-w-0
                        flex-1
                        truncate
                        xl:block
                      "
                  >
                    {item.label}
                  </span>

                  {/* Coming Soon */}

                  {item.disabled && (
                    <span
                      className="
                          hidden
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
                          xl:block
                        "
                    >
                      Soon
                    </span>
                  )}

                  {/* Tablet tooltip */}

                  <span
                    className="
                        pointer-events-none
                        absolute
                        left-[calc(100%+10px)]
                        top-1/2
                        z-50
                        hidden
                        -translate-y-1/2
                        whitespace-nowrap
                        rounded-md
                        bg-[#101828]
                        px-2.5
                        py-1.5
                        text-[11px]
                        font-medium
                        text-white
                        opacity-0
                        shadow-lg
                        transition-opacity
                        group-hover:opacity-100
                        lg:block
                        xl:hidden
                      "
                  >
                    {item.disabled ? `${item.label} - Soon` : item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-[#E4E7EC]
            px-2
            py-4
            xl:px-4
          "
        >
          <p
            className="
              hidden
              px-3
              text-[11px]
              leading-5
              text-[#98A2B3]
              xl:block
            "
          >
            Preproute Test Management
          </p>

          <div
            className="
              flex
              justify-center
              xl:hidden
            "
          >
            <span
              title="Preproute"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-[#F5F8FF]
                text-[11px]
                font-semibold
                text-[#315BEF]
              "
            >
              P
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
