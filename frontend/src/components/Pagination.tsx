'use client';

import { PaginationMeta } from '@/lib/api';

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { page, totalPages, total, hasPrevPage, hasNextPage } = meta;

  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="pagination">
      <span className="pagination-info">
        Показано {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, total)} из {total}
      </span>
      <div className="pagination-controls">
        <button
          className="btn btn-secondary btn-sm"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} className="pagination-dots">...</span>
          ) : (
            <button
              key={p}
              className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          ),
        )}
        <button
          className="btn btn-secondary btn-sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
