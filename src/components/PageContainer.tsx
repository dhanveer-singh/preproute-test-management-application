import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div
      className={`
        min-w-0
        px-4
        py-5
        sm:px-6
        sm:py-6
        lg:px-7
        lg:py-7
        xl:px-8
        ${className}
      `}
    >
      <div className="mx-auto w-full max-w-[1600px] min-w-0">{children}</div>
    </div>
  );
}

export default PageContainer;
