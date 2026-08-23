import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
  getTitle?: (row: T) => string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  emptyMessage?: string;
  showSerialNumber?: boolean;
  startIndex?: number;
}

function Table<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'No data found',
  showSerialNumber = false,
  startIndex = 0,
}: TableProps<T>) {
  const totalColumns = columns.length + (showSerialNumber ? 1 : 0);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[1100px] border-collapse">
        <thead>
          <tr className="border-b border-[#E4E7EC] bg-[#F8FAFC]">
            {showSerialNumber && (
              <th className="w-[70px] whitespace-nowrap px-4 py-3 text-center text-[13px] font-semibold uppercase tracking-[0.01em] text-[#344054]">
                S.No.
              </th>
            )}

            {columns.map((column) => (
              <th
                key={column.key}
                className={`whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold uppercase tracking-[0.01em] text-[#344054] ${
                  column.className ?? ''
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-[#E4E7EC] last:border-b-0 hover:bg-[#FAFBFF]"
              >
                {showSerialNumber && (
                  <td className="px-4 py-4 text-center text-[14px] text-[#475467]">
                    {startIndex + index + 1}
                  </td>
                )}

                {columns.map((column) => {
                  const value = row[column.key as keyof T];

                  const title = column.getTitle
                    ? column.getTitle(row)
                    : typeof value === 'string' || typeof value === 'number'
                      ? String(value)
                      : undefined;

                  return (
                    <td
                      key={column.key}
                      title={title}
                      className={`px-4 py-4 text-[14px] text-[#475467] ${column.className ?? ''}`}
                    >
                      {column.render ? column.render(row) : String(value ?? '')}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={totalColumns} className="px-4 py-10 text-center text-sm text-[#667085]">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
