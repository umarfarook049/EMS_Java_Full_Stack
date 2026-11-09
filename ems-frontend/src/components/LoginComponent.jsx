import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveSession } from "../services/AuthService";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigator = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Username and password are required");
      return;
    }

    login(username, password)
      .then((res) => {
        const data = res.data;
        saveSession(data);
        navigator(
          data.role === "ADMIN"
            ? "/employees"
            : `/view-employee/${data.employeeId}`,
        );
      })
      .catch((err) => {
        setError(
          err.response?.status === 401
            ? "Invalid username or password"
            : "Unable to reach the server",
        );
      });
  }

  return (
    <div className="container">
      <br />
      <br />
      <br />
      <div className="row">
        <div className="card col-12 col-sm-10 col-md-6 col-lg-4 mx-auto">
          <h2 className="text-center mt-2">Login</h2>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleLogin}>
              <div className="form-group mb-2">
                <label className="form-label">
                  Company Email or Employee Code :{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <label className="form-label">Password : </label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-dark mt-2">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
