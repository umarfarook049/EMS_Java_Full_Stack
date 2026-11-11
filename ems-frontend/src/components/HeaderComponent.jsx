import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSession, isAdmin, logout } from "../services/AuthService";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation(); // also re-renders on route change
  const session = getSession();
  const admin = isAdmin();
  const [open, setOpen] = useState(false);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const title = !session
    ? "Employee Management System"
    : admin
      ? "Admin Dashboard"
      : "Employee Dashboard";

  const dashboardActive = pathname === "/" || pathname.startsWith("/employees");
  const addActive = pathname.startsWith("/add-employee");
  const profileActive = pathname.startsWith("/view-employee");

  return (
    <header className="app-header">
      <span className="app-brand">{title}</span>

      {session && (
        <>
          <button
            className="app-toggler"
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
          >
            &#9776;
          </button>
          <nav className={`app-nav ${open ? "open" : ""}`}>
            {admin ? (
              <>
                <button
                  className={dashboardActive ? "active" : ""}
                  onClick={() => go("/employees")}
                >
                  Dashboard
                </button>
                <button
                  className={addActive ? "active" : ""}
                  onClick={() => go("/add-employee")}
                >
                  Add Employee
                </button>
              </>
            ) : (
              <button
                className={profileActive ? "active" : ""}
                onClick={() => go(`/view-employee/${session.employeeId}`)}
              >
                Profile
              </button>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              Log Out
            </button>
          </nav>
        </>
      )}
    </header>
  );
};

export default HeaderComponent;
