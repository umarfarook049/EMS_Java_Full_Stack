import "./App.css";
import EmployeeComponent from "./components/EmployeeComponent";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import ListEmployeeComponent from "./components/ListEmployeeComponent";
import PayslipComponent from "./components/PayslipComponent";
import LoginComponent from "./components/LoginComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="app-shell">
          <HeaderComponent />
          <main className="app-main">
            <Routes>
              <Route path="/login" element={<LoginComponent />} />

              {/* Employee dashboard (own record; the backend enforces "own only") */}
              <Route
                path="/view-employee/:id"
                element={
                  <ProtectedRoute>
                    <EmployeeComponent isView={true} />
                  </ProtectedRoute>
                }
              />

              {/* Admin dashboard and management */}
              <Route
                path="/"
                element={
                  <ProtectedRoute adminOnly>
                    <ListEmployeeComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <ProtectedRoute adminOnly>
                    <ListEmployeeComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-employee"
                element={
                  <ProtectedRoute adminOnly>
                    <EmployeeComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-employee/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <EmployeeComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payslip/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <PayslipComponent />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <FooterComponent />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
