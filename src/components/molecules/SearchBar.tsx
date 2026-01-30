// src/components/molecules/SearchBar.tsx

import { SearchIcon } from "../atoms/icons/SearchIcon";


export const SearchBar = () => (
  <div className="flex-1 max-w-xl relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2">
      <SearchIcon />
    </div>
    <input
      type="text"
      placeholder="Search for jobs, companies, or skills"
      className="w-full bg-accent/50 border-none pl-12 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
    />
  </div>
);
