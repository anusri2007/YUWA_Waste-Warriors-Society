function FilterDropdown({
  label,
  value,
  onChange,
  options = [],
  allLabel = "All",
}) {
  return (
    <div className="admin-filter-group">
      {label && <label style={{ fontSize: "12px", color: "#648078", fontWeight: 600 }}>{label}:</label>}
      <select
        className="admin-filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">{allLabel}</option>
        {options.map((opt) => {
          const val = typeof opt === "string" ? opt : opt.value;
          const display = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={val} value={val}>
              {display}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default FilterDropdown;

