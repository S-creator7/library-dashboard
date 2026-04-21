import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email) return;
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.status) {
        setMessage(res.message || "Password reset link sent to your email");
      } else {
        setError(res.message || "Unable to process password reset");
      }
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>

          {message && (
            <p className="text-green-600 text-center text-sm mt-2">{message}</p>
          )}

          {error && (
            <p className="text-red-500 text-center text-sm mt-2">{error}</p>
          )}
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full text-blue-700 hover:text-blue-900 underline mt-4"
        >
         &larr; Back to Login
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; {new Date().getFullYear()} Aaplishala Library
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
