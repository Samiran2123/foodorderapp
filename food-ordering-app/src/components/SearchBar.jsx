import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search for pizza, burger, pasta, drinks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <button 
            type="button" 
            onClick={handleClear} 
            style={{ marginRight: '10px', color: 'var(--text-muted)' }}
            aria-label="Clear Search"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
        <button type="submit" className="search-btn" onClick={(e) => e.preventDefault()}>
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
