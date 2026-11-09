import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/AuthService";

const HeaderComponent = () => {
  const navigate = useNavigate();
  useLocation(); // re-render on route change so login/logout state stays fresh
  const session = getSession();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/login");
  }

  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark px-3">
        <span className="navbar-brand mb-0 h1">Employee Management System</span>

        {session && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen(!open)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
              <div className="ms-auto d-flex flex-column flex-md-row align-items-md-center gap-2 mt-2 mt-md-0 text-white">
                <span className="text-break">
                  {session.username} ({session.role})
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
};

export default HeaderComponent;
