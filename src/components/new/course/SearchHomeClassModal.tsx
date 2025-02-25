"use client";

import { useState } from "react";
import { SearchHomeClasses } from "@/lib/actions";
import { HomeClassSearchResult } from "@/lib/database/database";
import Form from "next/form";
import SearchInput from "@/components/Common/Form/SearchInput";
import SearchResultList from "@/components/Common/Form/SearchResultsList";
import SelectedItemDisplay from "@/components/Common/Form/SelectedItemDisplay";

interface SearchModalProps {
  onClose: () => void;
  onSelect: (item: { id: string; name: string }) => void;
}

export default function SearchHomeClassModal({ onClose, onSelect }: SearchModalProps) {
  const [searchResults, setSearchResults] = useState<HomeClassSearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);
  const [query, setQuery] = useState<string>("");

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
        {/* <h2 className="text-lg font-semibold mb-2">Select a class</h2> */}
        <p className="text-sm text-gray-500 mb-4">Search and select a class.</p>

        {/* Search Input */}
        <SearchInput query={query} onChange={(value) => { setQuery(value); handleSearch(value); }} />

        {/* Search Results */}
        <SearchResultList
          searchResults={searchResults}
          selectedItemId={selectedItem?.id || null}
          onSelect={(item) => setSelectedItem(item)}
        />

        {/* Selected Item Display */}
        <SelectedItemDisplay selectedItem={selectedItem} />

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
