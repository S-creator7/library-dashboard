import React, { useState } from "react";
import IssuedBooks from "../components/IssuedBooks";
import { useNavigate } from "react-router-dom";
const BooksIssue = () => {
 const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Books</h1>
        <button
          onClick={() => navigate("/issue-Book")}
          className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
        >
          + Issue Book
        </button>
      </div>

     <IssuedBooks/>

    

      
    </div>
  );
};

export default BooksIssue;
