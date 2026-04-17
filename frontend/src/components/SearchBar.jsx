// components/SearchBar.jsx
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 w-full rounded-lg bg-gray-800 text-white outline-none"
      />
      <button className="bg-red-500 px-4 py-2 rounded-lg">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
