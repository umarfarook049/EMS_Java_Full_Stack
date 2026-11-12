import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveSession } from "../services/AuthService";

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigator = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Company email or employee code and password are required");
      return;
    }

    setError("");
    setLoading(true);
    login(username.trim(), password)
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
            ? "Invalid credentials"
            : "Unable to reach the server. If it was idle, wait a minute and try again.",
        );
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="login-page">
      <div className="card login-card done">
        <div className="card-body">
          <h2 className="text-center mb-4">Login</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">
                Company Email or Employee Code
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="our" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
