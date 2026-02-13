import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import DashBoard from "./features/DashBoard";
import DashBoardD from "./features/DashBoardD";
import Layout from "./common/Layout/Layout";
import Error from "./common/Error";
import NotFound from "./common/NotFound";
import SensorLog from "./features/SensorLog";
import Login from "./features/Login";
import { ProtectedRoute, PublicRoute } from "./api/RoutsConfig";
import SensorAdmin from "./features/SensorAdmin";
import Events from "./features/Events";
import Alerts from "./features/Alerts";
import AdminSensorAnalytics from "./features/AdminSensorAnalytics";

function App() {
  const router = createBrowserRouter([
    // ✅ Protected routes
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout>
            <DashBoard />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/d",
      element: (
        <ProtectedRoute>
          <Layout>
            <DashBoardD />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/logs",
      element: (
        <ProtectedRoute>
          <Layout>
            <SensorLog />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/admin/sensors",
      element: (
        <ProtectedRoute>
          <Layout>
            <SensorAdmin />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/admin/sensorLog",
      element: (
        <ProtectedRoute>
          <Layout>
            <AdminSensorAnalytics />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/events",
      element: (
        <ProtectedRoute>
          <Layout>
            <Events />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    {
      path: "/alert",
      element: (
        <ProtectedRoute>
          <Layout>
            <Alerts />
          </Layout>
        </ProtectedRoute>
      ),
      errorElement: <Error />,
    },
    // ✅ Public route
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
      errorElement: <Error />,
    },

    // ✅ Other routes
    {
      path: "/error",
      element: <Error />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
