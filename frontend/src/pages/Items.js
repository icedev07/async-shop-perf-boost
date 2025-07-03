import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import VirtualizedItemList from '../components/VirtualizedItemList';

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
  };

  if (loading && !items.length) {
    return (
      <div className="loading">
        <p>Loading items...</p>
      </div>
    );
  }

  return (
    <div className="items-container">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search items by name or category..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Items List */}
      {items.length === 0 ? (
        <p className="no-items">No items found.</p>
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
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="pagination-button"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
            {' '}({pagination.totalItems} total items)
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      {/* Loading indicator for subsequent requests */}
      {loading && items.length > 0 && (
        <div className="loading-indicator">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

export default Items;