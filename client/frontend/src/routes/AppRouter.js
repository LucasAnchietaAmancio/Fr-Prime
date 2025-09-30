import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import PrivateRoute from "./PrivateRoute"
import LayoutWithSidebar from "../components/LayoutWithSidebar"
import  SavedLoads from "../pages/SavedLoads"
import Publisher from "../pages/Publisher"
import NotFound from "../pages/NotFound"
import { NotificationProvider } from "../contexts/NotificationContext";

function AppRouter() {
  return (
    <BrowserRouter>
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<LayoutWithSidebar />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/publisher"
            element={
              <PrivateRoute>
                <Publisher />
              </PrivateRoute>
            }
          />
          <Route
          path="/gestao"
          element={
            <PrivateRoute>
              <SavedLoads />
            </PrivateRoute>
          }
        />
        </Route>
        <Route path="*"
        element={<NotFound />} />
      </Routes>
      </NotificationProvider>
    </BrowserRouter>
  )
}

export default AppRouter
