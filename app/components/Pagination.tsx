'use client';

import React from 'react';
import { PaginationProps } from '@/types/pagination';

export default function Pagination({
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
}: PaginationProps) {
  
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const baseRange = 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > baseRange + 3) pages.push('...');
      const start = Math.max(2, currentPage - baseRange);
      const end = Math.min(totalPages - 1, currentPage + baseRange);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - (baseRange + 2)) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const firstItemIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItemIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card px-4 py-3 border-t border-card-border select-none text-muted text-sm transition-colors duration-300">
      
      {/* SEÇÃO ESQUERDA: Itens por página e contador descritivo */}
      <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-muted whitespace-nowrap">
            Itens por página:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-background border border-card-border text-foreground rounded-lg px-2 py-1 text-sm font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <span className="text-card-border hidden xs:inline">|</span>

        <p className="text-muted/90">
          Mostrando <span className="font-semibold text-foreground">{firstItemIndex}</span> a{' '}
          <span className="font-semibold text-foreground">{lastItemIndex}</span> de{' '}
          <span className="font-semibold text-foreground">{totalItems}</span> itens
        </p>
      </div>

      {/* SEÇÃO DIREITA: Bloco de navegação numérica e setas */}
      <nav className="flex items-center -space-x-px rounded-md shadow-sm bg-card" aria-label="Paginação">
        
        {/* Botão Voltar */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-lg border border-card-border px-2 py-2 text-muted/70 hover:bg-background transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-card disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Números das Páginas */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="relative inline-flex items-center border border-card-border px-3 py-2 text-muted/60"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(Number(page))}
              className={`relative inline-flex items-center border px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                isCurrent
                  ? 'z-10 bg-primary border-primary text-white font-semibold'
                  : 'border-card-border text-foreground/80 hover:bg-background'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Botão Avançar */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-lg border border-card-border px-2 py-2 text-muted/70 hover:bg-background transition-colors cursor-pointer disabled:opacity-40 disabled:hover:bg-card disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </nav>
    </div>
  );
}