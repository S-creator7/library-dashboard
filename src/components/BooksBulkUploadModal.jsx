import React, { useRef } from "react";

const BooksBulkUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  uploading,
  error,
  templateUrl,
}) => {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onUpload(file);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    onUpload(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-transparent backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Books</h2>
          <div className="flex items-center gap-2">
            <a
              href={templateUrl}
              download
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-semibold">⇩</span>
              <span>Download Template</span>
            </a>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors text-3xl leading-none flex items-center justify-center"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Bulk Upload Books Instructions:
          </h3>
          <ul className="list-disc list-inside text-xs text-blue-900 space-y-1">
            <li>Download the template to ensure proper formatting.</li>
            <li>
              Fill in book information following the template structure
              (title, author, publisher, year_of_publication, category,
              isbn_number, description, quantity).
            </li>
            <li>Upload the completed file to add multiple books at once.</li>
          </ul>
        </div>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg py-10 px-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-2 text-gray-400">↑</div>
          <p className="text-sm text-gray-700 mb-1">
            Click to upload a file or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            Supported formats: .xlsx, .xls, .csv
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>

        {/* Error / Status */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="text-red-600 min-h-[1.25rem]">
            {error && <span>{error}</span>}
          </div>
          <div className="text-gray-600">
            {uploading ? "Uploading books..." : "Ready to upload"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksBulkUploadModal;
