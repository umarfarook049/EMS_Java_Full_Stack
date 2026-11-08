import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSession, logout } from "../services/AuthService";

const HeaderComponent = () => {
  const navigate = useNavigate();
  useLocation(); // re-renders the header on route change so it reflects login/logout
  const session = getSession();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow">
          <div className="container">
            <a
              className="navbar-brand"
              href="#"
              style={{ fontWeight: "bold", fontSize: "1.5rem" }}
            >
              <i className="fas fa-users" style={{ marginRight: "10px" }}></i>
              Employee Management System
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav align-items-center">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{ marginRight: "20px" }}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{ marginRight: "20px" }}
                  >
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{ marginRight: session ? "20px" : "0" }}
                  >
                    Contact
                  </a>
                </li>
                {session && (
                  <div className="d-flex align-items-center text-white ms-lg-3">
                    <span className="me-3">
                      {session.username} ({session.role})
                    </span>
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default HeaderComponent;
