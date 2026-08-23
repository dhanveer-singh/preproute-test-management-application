import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-[14px]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            <span
              className={item.active || isLast ? 'font-medium text-[#344054]' : 'text-[#667085]'}
            >
              {item.label}
            </span>

            {!isLast && <ChevronRight size={16} className="text-[#98A2B3]" />}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
