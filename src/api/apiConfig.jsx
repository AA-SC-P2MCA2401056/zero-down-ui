/**
 * API Configuration
 * -----------------
 * Centralized file for managing API endpoints, base URL, headers,
 * and common fetch setup for the Greenhouse Dashboard project.
 */
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:8081";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// 🔐 Helper to get JWT token from localStorage
const getToken = () => localStorage.getItem("jwt_token");

// 🔐 Inject Authorization header dynamically
const authHeaders = () => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${getToken()}`,
});

// 🌿 Define all endpoints here
const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  // Add more as needed
};

// 🔧 GET request
const getRequest = async (endpoint, params = {}) => {
  const url = new URL(API_BASE_URL + endpoint);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const response = await fetch(url, {
    method: "GET",
    headers: authHeaders(),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok)
    throw new Error(`GET ${endpoint} failed: ${response.status}`);
  return response.json();
};

// 🔧 POST request
const postRequest = async (endpoint, body = {}) => {
  try {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });

    if (response.status === 401) handleUnauthorized();
    if (!response.ok)
      handleNetworkError(error, endpoint);
    return response.json();
  } catch (error) {
    handleNetworkError(error, endpoint);
  }
};

// 🔧 PUT request
const putRequest = async (endpoint, body = {}) => {
  const response = await fetch(API_BASE_URL + endpoint, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok)
    throw new Error(`PUT ${endpoint} failed: ${response.status}`);
  return response.json();
};

// 🔧 DELETE request
const deleteRequest = async (endpoint, body = {}) => {
  const response = await fetch(API_BASE_URL + endpoint, {
    method: "DELETE",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (response.status === 401) handleUnauthorized();
  if (!response.ok)
    throw new Error(`DELETE ${endpoint} failed: ${response.status}`);
  return response.json();
};


const postPublicRequest = async (endpoint, body = {}) => {
  try {
    const response = await fetch(API_BASE_URL + endpoint, {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      // Pass the response for login-page to detect invalid creds (401)
      throw response;
    }

    return await response.json();
  } catch (error) {
    handleNetworkError(error, endpoint);
    throw error; // rethrow to allow login page to check status
  }
};


const handleUnauthorized = () => {
  localStorage.removeItem("jwt_token");
  toast.error("Session expired. Please log in again.");
  window.location.href = "/login";
};

const handleNetworkError = (err, endpoint = "") => {
  const message = typeof err?.message === "string" ? err.message : "";
  // Network failure (server unreachable)
  if (
    message.includes("Failed to fetch") ||
    message.includes("ERR_CONNECTION_REFUSED" )||
    message.includes("Failed to execute")
  ) {
    toast.error("Server unreachable. Please check your connection.");
    return;
  }

  debugger;
  // HTTP status-based errors
  const status = err?.status || err?.response?.status;

  if (status === 400) {
    toast.error("Bad request. Please check your input.");
  } else if (status === 401) {
    toast.error("Invalid Credentials!!");
  } else if (status === 403) {
    toast.error("Forbidden. You don’t have permission.");
  } else if (status === 404) {
    toast.error(`Endpoint not found: ${endpoint}`);
  } else if (status === 405) {
    toast.error("Method not allowed.");
  } else if (status === 500) {
    toast.error("Internal server error.");
  } else if (status >= 400 && status < 500) {
    toast.error(`Client error (${status}).`);
  } else if (status >= 500) {
    toast.error(`Server error (${status}).`);
  } else {
    toast.error("Unexpected error occurred.");
  }

  throw err;
};



// 🚀 Export everything
const ApiConfig = {
  API_BASE_URL,
  ENDPOINTS,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
  postPublicRequest,
};

export default ApiConfig;
