import { BrowserRouter, Route, Routes} from "react-router-dom"
import Login from "../pages/Login"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter