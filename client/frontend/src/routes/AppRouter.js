import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import PrivateRoute from "./PrivateRoute"
import LayoutWithSidebar from "../components/LayoutWithSidebar"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<LayoutWithSidebar />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
