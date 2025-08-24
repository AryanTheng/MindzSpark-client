import { useState } from "react";

const ComboSuggestions = ({ mainProduct, suggestions = [], onContinue }) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Frequently Bought Together</h2>

        {/* Main Product */}
        <div className="flex items-center gap-3 border-b pb-3 mb-3">
          <img src={mainProduct.image[0]} alt={mainProduct.name} className="w-16 h-16 object-contain" />
          <p className="font-medium">{mainProduct.name}</p>
        </div>

        {/* Suggestions */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <label
              key={item._id}
              className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selected.includes(item._id)}
                onChange={() => toggleSelect(item._id)}
              />
              <img src={item.image[0]} alt={item.name} className="w-12 h-12 object-contain" />
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-sm text-green-600">₹{item.price}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => onContinue(selected)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComboSuggestions;
