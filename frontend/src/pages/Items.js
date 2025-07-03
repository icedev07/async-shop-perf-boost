import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import VirtualizedItemList from '../components/VirtualizedItemList';
import SkeletonLoader from '../components/SkeletonLoader';

function Items() {
  const { items, pagination, loading, fetchItems } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    let active = true;

    // Fetch items with current search and pagination
    fetchItems(active, {
      page: currentPage,
      pageSize,
      search: searchTerm
    });

    return () => {
      active = false;
    };
  }, [fetchItems, currentPage, pageSize, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Show skeleton loader on initial load
  if (loading && !items.length) {
    return (
      <div className="items-container">
        <div className="search-form">
          <input
            type="text"
            placeholder="Search items by name or category..."
            className="search-input"
            disabled
          />
          <button className="search-button" disabled>
            Search
          </button>
        </div>
        <SkeletonLoader count={8} />
      </div>
    );
  }

  return (
    <div className="items-container">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form" role="search">
        <label htmlFor="search-input" className="sr-only">
          Search items
        </label>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search items by name or category..."
          className="search-input"
          aria-describedby="search-help"
        />
        <button type="submit" className="search-button" aria-label="Search items">
          <span className="search-icon">🔍</span>
          Search
        </button>
        <div id="search-help" className="sr-only">
          Press Enter to search or click the Search button
        </div>
      </form>

      {/* Results Summary */}
      {items.length > 0 && (
        <div className="results-summary" role="status" aria-live="polite">
          <span>
            Showing {items.length} item{items.length !== 1 ? 's' : ''}
            {pagination && ` of ${pagination.totalItems} total`}
          </span>
          {searchTerm && (
            <span className="search-term">
              for "{searchTerm}"
            </span>
          )}
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="no-items" role="status">
          <div className="no-items-icon">📦</div>
          <p>No items found.</p>
          {searchTerm && (
            <p className="no-items-suggestion">
              Try adjusting your search terms or browse all items.
            </p>
          )}
        </div>
      ) : (
        <div>
          <div className="performance-info">
            <span>Rendering {items.length} items with virtualization</span>
            {pagination && (
              <span> • Page {pagination.currentPage} of {pagination.totalPages}</span>
            )}
          </div>
          <VirtualizedItemList items={items} height={400} />
        </div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <nav className="pagination" role="navigation" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="pagination-button"
            aria-label={`Go to previous page, page ${currentPage - 1}`}
          >
            ← Previous
          </button>
          
          <div className="pagination-info" aria-current="page">
            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            <span className="pagination-total">({pagination.totalItems} total items)</span>
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="pagination-button"
            aria-label={`Go to next page, page ${currentPage + 1}`}
          >
            Next →
          </button>
        </nav>
      )}

      {/* Loading indicator for subsequent requests */}
      {loading && items.length > 0 && (
        <div className="loading-indicator" role="status" aria-live="polite">
          <div className="loading-spinner"></div>
          <p>Loading more items...</p>
        </div>
      )}
    </div>
  );
}

export default Items;