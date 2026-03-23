import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search restaurants & bars…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search venues"
        />
      </div>
      <button type="submit" disabled={isLoading || !query.trim()}>
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}
