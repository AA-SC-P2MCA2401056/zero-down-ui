/**
 * API Configuration
 * -----------------
 * Centralized file for managing API endpoints, base URL, headers,
 * and common fetch setup for the Greenhouse Dashboard project.
 */
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:8081";

/* ------------------------------ Helpers ------------------------------ */

// Base headers
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Pull JWT token
const getToken = () => localStorage.getItem("jwt_token");

// Auth headers
const authHeaders = () => ({
  ...DEFAULT_HEADERS,
  Authorization: `Bearer ${getToken()}`,
});

/* ------------------------------ Endpoints ------------------------------ */

const ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  SENSOR_HISTORY: "/api/v1/sensor-readings/history",
  SNAPSHOT: "/api/v1/dashboard/snapshot",
  SENSOR_DASHBOARD_HISTORY: "/api/v1/dashboard/history",

  // Admin
  ADMIN_SENSORS: "/api/admin/sensors",
};

/* ------------------------- Central Request Handler ------------------------- */

const apiRequest = async (method, endpoint, body = null, isPublic = false, params = {}) => {
  try {
    // Build URL with query params
    const url = new URL(API_BASE_URL + endpoint);
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
      method,
      headers: isPublic ? DEFAULT_HEADERS : authHeaders(),
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();
    console.log(data)

    // Handle unauthorized
    if (response.status === 401) return handleUnauthorized();

    // If not OK → throw so error handler can catch it
    if (!response.ok) {
      throw { status: response.status, message: response.statusText };
    }

    // DELETE has no JSON body sometimes
    if (response.status === 204) return null;

    return data;
  } catch (err) {
    handleNetworkError(err, endpoint);
    throw err; // rethrow so UI can catch
  }
};

/* ------------------------------ API Methods ------------------------------ */

const getRequest = (endpoint, params) => apiRequest("GET", endpoint, null, false, params);

const postRequest = (endpoint, body) => apiRequest("POST", endpoint, body);

const putRequest = (endpoint, body) => apiRequest("PUT", endpoint, body);

const deleteRequest = (endpoint, body) => apiRequest("DELETE", endpoint, body);

// Public request → used for login/register
const postPublicRequest = (endpoint, body) => apiRequest("POST", endpoint, body, true);

/* ------------------------------ Error Handling ------------------------------ */

const handleUnauthorized = () => {
  localStorage.removeItem("jwt_token");
  toast.error("Session expired. Please log in again.");
  window.location.href = "/login";
};

const handleNetworkError = (err, endpoint = "") => {
  const msg = err?.message || "";

  // Server not reachable
  if (
    msg.includes("Failed to fetch") ||
    msg.includes("ERR_CONNECTION_REFUSED")
  ) {
    toast.error("Unable to reach server. Check your connection.");
    return;
  }

  const status = err?.status;

  switch (status) {
    case 400:
      toast.error("Invalid request. Please check your input.");
      break;
    case 401:
      toast.error("Unauthorized. Please log in again.");
      break;
    case 403:
      toast.error("Forbidden. You don't have permission.");
      break;
    case 404:
      toast.error(`Endpoint not found: ${endpoint}`);
      break;
    case 405:
      toast.error("Method not allowed.");
      break;
    case 500:
      toast.error("Internal server error.");
      break;
    default:
      toast.error(`Unexpected error: ${status || "Unknown"}`);
  }
};

/* ------------------------------ Export ------------------------------ */

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
