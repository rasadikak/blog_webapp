import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5017/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, passwordHash: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid username or password");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="login-container">
      <h1>Quiet Corners</h1>
      <p className="login-subtitle">Sign in to manage the blog.</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <div>Username</div>
          <input
            type="text"
            value={username}
            required
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <div>Password</div>
          <input
            type="password"
            value={password}
            required
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Log in</button>
        </div>
      </form>
      {error && <p className="login-error">{error}</p>}
    </div>
  );
}

export default Login;