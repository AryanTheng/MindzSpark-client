import { useState } from "react";

const ShareButton = ({ productName }) => {
  const [open, setOpen] = useState(false);
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Check out this product: ${productName}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 Link copied!");
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Main Share Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Share
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${text}%20${url}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
          >
             WhatsApp
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
          >
             Facebook
          </a>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
          >
             Twitter
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${url}&text=${text}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
          >
             Telegram
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-100 rounded"
          >
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
