// components/SearchInput.tsx
import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  query: string;
  onChange: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ query, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <FaSearch className="w-4 h-4 text-gray-500" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md mb-3 block w-full ps-10 p-2.5"
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchInput;
