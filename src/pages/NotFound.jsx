import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/pages/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
        <button onClick={() => navigate("/")}>Go Back Home</button>
        <img
          src="https://via.placeholder.com/300x200?text=Lost"
          alt="Lost Illustration"
        />
      </div>
    </div>
  );
};

export default NotFound;
