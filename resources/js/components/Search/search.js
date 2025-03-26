import React from 'react';
import { IconSearch, IconX } from '@tabler/icons-react';
import "./../../../sass/components/search.scss";

function Search({ isOpen, onClose }) {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.elements.search.value;
    if (query) {
      console.log('Search query:', query);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-wrapper">
            <IconSearch size={20} className="search-input-icon" />
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              className="search-input"
              autoFocus
            />
          </div>
          <button type="submit" className="search-submit-button">
            Search
          </button>
          <button type="button" className="search-close-button" onClick={onClose}>
            <IconX size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Search;