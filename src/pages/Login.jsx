import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(username, password);
      if (res.status && res.resources?.data?.token) {
        navigate("/");
      } else {
        setError(res.message || "Invalid login credentials");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#E2E8F0]">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0F172A]">
          Library Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Field */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f86730] focus:border-[#f86730]"
          />

          {/* Password Field with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f86730] focus:border-[#f86730] pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-[#64748B] hover:text-[#0F172A]"
            >
              {showPassword ? (
                <FaEyeSlash className="w-5 h-5" />
              ) : (
                <FaEye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-[#f86730] hover:text-[#e35d1f] underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f86730] text-white py-3 rounded-lg hover:bg-[#e35d1f] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* Error Message */}
          {error && (
            <p className="text-[#EF4444] text-center text-sm mt-2">{error}</p>
          )}
        </form>

        <p className="text-center text-[#64748B] text-sm mt-6">
          © {new Date().getFullYear()} Aaplishala Library
        </p>
      </div>
    </div>
  );
};

export default Login;