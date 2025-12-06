import { AlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const [redirectPath, setRedirectPath] = useState("/login");

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    // Simple token presence check (you can extend to decode/validate)
    if (token && token.trim() !== "") {
      setRedirectPath("/");
    } else {
      setRedirectPath("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <AlertTriangle size={60} className="text-amber-600 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to={redirectPath}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        {redirectPath === "/" ? "Go Back Home" : "Go to Login"}
      </Link>
    </div>
  );
};

export default NotFound;
