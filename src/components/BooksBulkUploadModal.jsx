import React, { useRef } from "react";
import { 
  FaTimes, 
  FaDownload, 
  FaUpload, 
  FaFileExcel, 
  FaInfoCircle,
  FaSpinner
} from "react-icons/fa";

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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl shadow-black/25 w-full max-w-2xl border border-[#E2E8F0] animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
            <FaFileExcel className="text-[#f86730]" />
            Bulk Upload Books
          </h2>
          <div className="flex items-center gap-2">
            <a
              href={templateUrl}
              download
              className="inline-flex items-center gap-2 bg-[#0F172A] text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-[#1E293B] transition-all duration-150"
            >
              <FaDownload className="text-sm" />
              <span>Template</span>
            </a>
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#0F172A] transition-colors hover:bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center"
              aria-label="Close"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mx-6 mt-4 mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-start gap-2">
            <FaInfoCircle className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-orange-800 mb-1.5">
                Bulk Upload Books Instructions:
              </h3>
              <ul className="list-disc list-inside text-xs text-orange-700 space-y-1">
                <li>Download the template to ensure proper formatting.</li>
                <li>
                  Fill in book information following the template structure
                  (title, author, publisher, year_of_publication, category,
                  isbn_number, description, quantity).
                </li>
                <li>Upload the completed file to add multiple books at once.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`mx-6 border-2 border-dashed rounded-xl py-12 px-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            uploading 
              ? "border-[#94A3B8] bg-[#F8FAFC]" 
              : "border-[#E2E8F0] hover:border-[#f86730]/60 hover:bg-orange-50/30"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
            uploading ? "bg-[#F8FAFC]" : "bg-[#f86730]/10"
          }`}>
            {uploading ? (
              <FaSpinner className="text-2xl text-[#f86730] animate-spin" />
            ) : (
              <FaUpload className="text-2xl text-[#f86730]" />
            )}
          </div>
          <p className="text-sm font-medium text-[#0F172A] mb-1">
            {uploading ? "Uploading..." : "Click to upload a file or drag and drop"}
          </p>
          <p className="text-xs text-[#64748B]">
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
        <div className="px-6 pb-4 pt-2 flex items-center justify-between text-xs">
          <div className="text-[#EF4444] min-h-[1.25rem] font-medium">
            {error && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                {error}
              </span>
            )}
          </div>
          <div className="text-[#64748B] font-medium">
            {uploading ? (
              <span className="flex items-center gap-1.5">
                <FaSpinner className="animate-spin text-[#f86730]" />
                Uploading books...
              </span>
            ) : (
              "Ready to upload"
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BooksBulkUploadModal;