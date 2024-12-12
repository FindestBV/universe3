import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"


  export const ListPagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onNextPage,
    onPreviousPage,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onNextPage: () => void;
    onPreviousPage: () => void;
  }) => {
    // Dynamically calculate visible page range
    const getVisiblePages = () => {
      const visibleRange = 5; // Number of pages to display at a time
      const pages: number[] = [];
  
      // Always show the first page
      if (currentPage > 3) pages.push(1);
  
      // Calculate range of pages to show around the current page
      const startPage = Math.max(2, currentPage - Math.floor(visibleRange / 2));
      const endPage = Math.min(totalPages - 1, currentPage + Math.floor(visibleRange / 2));
  
      // Add range of visible pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
  
      // Always show the last page
      if (currentPage < totalPages - 2) pages.push(totalPages);
  
      return pages;
    };
  
    const visiblePages = getVisiblePages();
  
    return (
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPreviousPage();
              }}
              // @ts-expect-error ass
              disabled={currentPage === 1}
            />
          </PaginationItem>
  
          {/* Render Page Links */}
          {visiblePages.map((page, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                className={currentPage === page ? 'font-bold text-blue-600' : ''}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
  
          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNextPage();
              }}
              // @ts-expect-error ass
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  