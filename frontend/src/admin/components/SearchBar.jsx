function SearchBar({ value, onChange, placeholder = "Search...", onClear }) {
  return (
    <div className="admin-search-box">
      <span>⌕</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && onClear && (
        <button
          type="button"
          className="admin-clear-btn"
          onClick={onClear}
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;

