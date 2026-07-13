"use client";

type TransactionsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const buttonBase =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-preset-4-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-grey-900/20";

export function TransactionsPagination({
  page,
  totalPages,
  onPageChange,
}: TransactionsPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4"
      aria-label="Transaction pagination"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`${buttonBase} border border-beige-100 bg-white text-grey-900 hover:bg-beige-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Prev
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {pages.map((pageNumber) => {
          const isActive = pageNumber === page;
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? "page" : undefined}
              className={`${buttonBase} ${
                isActive
                  ? "bg-grey-900 text-white"
                  : "border border-beige-100 bg-white text-grey-900 hover:bg-beige-100"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`${buttonBase} border border-beige-100 bg-white text-grey-900 hover:bg-beige-100 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        Next
      </button>
    </nav>
  );
}
