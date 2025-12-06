import { AlertOctagon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Error = () => {
  const [redirectPath, setRedirectPath] = useState("/login");

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    // Optional: you can add a small validation like checking expiry if your token has one
    if (token && token.trim() !== "") {
      setRedirectPath("/"); // go to dashboard
    } else {
      setRedirectPath("/login"); // go to login
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center">
      <AlertOctagon size={60} className="text-red-600 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred. Please try again later.
      </p>

      <Link
        to={redirectPath}
        className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition"
      >
        {redirectPath === "/" ? "Return to Dashboard" : "Go to Login"}
      </Link>
    </div>
  );
};

export default Error;
