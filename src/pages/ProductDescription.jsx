import { useState } from "react";

const ProductDescription = ({ description, highlights = [], specifications = {} }) => {
  const [showFull, setShowFull] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);

  return (
    <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
      {/* Highlights Section */}
      {highlights.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Highlights</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {highlights.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Description Section */}
      {description && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            {showFull ? description : description.slice(0, 300)} 
            {description.length > 300 && (
              <button
                className="ml-2 text-blue-600 font-medium"
                onClick={() => setShowFull(!showFull)}
              >
                {showFull ? "Read Less" : "Read More"}
              </button>
            )}
          </p>
        </div>
      )}

      {/* Specifications Section */}
      {Object.keys(specifications).length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setSpecOpen(!specOpen)}
            className="w-full flex justify-between items-center bg-gray-100 p-3 rounded-lg font-semibold"
          >
            Specifications
            <span>{specOpen ? "▲" : "▼"}</span>
          </button>

          {specOpen && (
            <div className="mt-2 border rounded-lg divide-y">
              {Object.entries(specifications).map(([key, value], idx) => (
                <div key={idx} className="flex justify-between p-2 text-sm">
                  <span className="font-medium text-gray-600">{key}</span>
                  <span className="text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDescription;
