// components/SelectedItemDisplay.tsx
interface SelectedItemDisplayProps {
    selectedItem: { id: string; name: string } | null;
  }
  
  const SelectedItemDisplay: React.FC<SelectedItemDisplayProps> = ({ selectedItem }) => {
    if (!selectedItem) return null;
  
    return (
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">Selected: {selectedItem.name}</p>
      </div>
    );
  };
  
  export default SelectedItemDisplay;
  