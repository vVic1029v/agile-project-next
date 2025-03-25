// components/SearchResultList.tsx
interface SearchResultListProps {
    searchResults: { id: string; name: string }[];
    selectedItemId: string | null;
    onSelect: (item: { id: string; name: string }) => void;
  }
  
  const SearchResultList: React.FC<SearchResultListProps> = ({
    searchResults,
    selectedItemId,
    onSelect,
  }) => {
    return (
      <ul className="max-h-40 overflow-y-auto border rounded-md mt-2 shadow-xl">
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <li
              key={item.id}
              className={`p-2 cursor-pointer ${
                selectedItemId === item.id ? "bg-neutral-300" : "hover:bg-gray-100"
              }`}
              onClick={() => onSelect(item)}
            >
              {item.name}
            </li>
          ))
        ) : (
          <li className="p-2 text-gray-500">No results found</li>
        )}
      </ul>
    );
  };
  
  export default SearchResultList;
  