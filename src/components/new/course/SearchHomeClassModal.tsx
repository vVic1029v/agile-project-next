"use client";

import { useState } from "react";
import { SearchHomeClasses } from "@/lib/actions";
import { HomeClassSearchResult } from "@/lib/database";
import Form from "next/form";
import { useFormStatus } from "react-dom";
import { ModalOverlay } from "@/components/calendar/event-modal/ModalOverlay";

interface SearchModalProps {
  onClose: () => void;
  onSelect: (item: { id: string; name: string }) => void;
}

export default function SearchHomeClassModal({ onClose, onSelect }: SearchModalProps) {
  const [searchResults, setSearchResults] = useState<HomeClassSearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);

  async function handleSearch(query: string) {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const formData = new FormData();
    formData.set("query", query);
    const results = await SearchHomeClasses(formData);
    setSearchResults(results.results);
  }

  return (
    
    <Form action={() => {}}>
        <div className="p-6">
            <h2 className="text-lg font-semibold mb-2">Select an Item</h2>
            <p className="text-sm text-gray-500 mb-4">Search and select an item from the database.</p>

            {/* Search Input */}
            <input
            type="text"
            name="query"
            placeholder="Search..."
            className="w-full p-2 border rounded-md mb-3"
            onChange={(e) => handleSearch(e.target.value)} // 🔥 Live search on input change
            />

            {/* Results */}
            <ul className="max-h-40 overflow-y-auto border rounded-md mt-2 shadow-xl">
                {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                    <li
                        key={item.id}
                        className={`p-2 cursor-pointer ${
                        selectedItem?.id === item.id ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedItem(item)}
                    >
                        {item.name}
                    </li>
                    ))
                ) : (
                    <li className="p-2 text-gray-500">No results found</li>
                )}
            </ul>

            {/* Selected Item Display */}
            {selectedItem && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">Selected: {selectedItem.name}</p>
            </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex justify-end gap-2">
            <button type="button" className="px-3 py-1 text-sm border rounded-md" onClick={onClose}>
                Cancel
            </button>
            <button
                type="button"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50"
                disabled={!selectedItem}
                onClick={() => {
                if (selectedItem) {
                    onSelect(selectedItem);
                    onClose();
                }
                }}
            >
                Select
            </button>
            </div>
        </div>
    </Form>
  );
}
