import React from "react";

interface PaginationProps {
  onChange: (page: number) => void;
  current: number;
  pageSize: number;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({
  onChange,
  current,
  pageSize,
  total,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  const handleClick = (page: number) => {
    if (onChange) {
      onChange(page);
    }
  };

  const isFirstPage = current === 1;
  const isLastPage = current === totalPages;

  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const renderPageNumbers = generatePageNumbers().map((page) => (
    <a
      key={page}
      href="#"
      onClick={() => handleClick(page)}
      className={`mx-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:border-gray-300 dark:bg-gray-700 dark:text-white dark:hover:border-gray-600 ${page === current ? "pointer-events-none bg-black text-white" : ""}`}
      title={`Page ${page}`}
    >
      {page}
    </a>
  ));

  return (
    <div className="container mx-auto px-4">
      <nav
        className="flex flex-row flex-nowrap items-center justify-between md:justify-center"
        aria-label="Pagination"
      >
        {/* Previous Page Button */}
        <a
          href="#"
          onClick={() => handleClick(current - 1)}
          className={`mr-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:border-gray-300 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 ${isFirstPage ? "pointer-events-none" : ""}`}
          title="Previous Page"
        >
          <span className="sr-only">Previous Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="block h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </a>
        {/* Page Numbers */}
        {renderPageNumbers}
        {/* Next Page Button */}
        <a
          href="#"
          onClick={() => handleClick(current + 1)}
          className={`ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black hover:border-gray-300 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 ${isLastPage ? "pointer-events-none" : ""}`}
          title="Next Page"
        >
          <span className="sr-only">Next Page</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="block h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </a>
      </nav>
    </div>
  );
};

export default Pagination;
