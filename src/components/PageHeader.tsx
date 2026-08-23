import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
}

function PageHeader({ title, description, breadcrumbs = [], actions }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex min-w-0 items-center gap-1.5 overflow-x-auto whitespace-nowrap"
        >
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div
                key={`${breadcrumb.label}-${index}`}
                className="flex shrink-0 items-center gap-1.5"
              >
                {breadcrumb.path && !isLast ? (
                  <button
                    type="button"
                    onClick={() => navigate(breadcrumb.path!)}
                    className="
                        cursor-pointer
                        text-[12px]
                        font-medium
                        text-[#667085]
                        outline-none
                        transition
                        hover:text-[#315BEF]
                        focus-visible:rounded
                        focus-visible:ring-2
                        focus-visible:ring-[#315BEF]/30
                        sm:text-[13px]
                      "
                  >
                    {breadcrumb.label}
                  </button>
                ) : (
                  <span
                    className={`
                        text-[12px]
                        font-medium
                        sm:text-[13px]
                        ${isLast ? 'text-[#344054]' : 'text-[#667085]'}
                      `}
                  >
                    {breadcrumb.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight size={14} strokeWidth={1.8} className="shrink-0 text-[#98A2B3]" />
                )}
              </div>
            );
          })}
        </nav>
      )}

      {/* =====================================================
          TITLE + ACTIONS
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Title section */}

        <div className="min-w-0">
          <h1
            title={title}
            className="truncate text-[20px] font-semibold leading-7 text-[#344054] sm:text-[22px] sm:leading-8"
          >
            {title}
          </h1>

          {description && (
            <p
              title={description}
              className="mt-1 max-w-[720px] text-[13px] leading-5 text-[#667085] sm:text-[14px]"
            >
              {description}
            </p>
          )}
        </div>

        {/* Actions */}

        {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
