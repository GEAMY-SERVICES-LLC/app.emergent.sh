import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, CircleNotch } from "@phosphor-icons/react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, formData);
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminEmail", response.data.email);
      toast.success("Login successful!");
      navigate("/admin");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.detail || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040810] grid-texture flex items-center justify-center p-6">
      {/* Background glow */}
      <div className="glow-orb glow-orb-cyan w-[400px] h-[400px] top-1/4 left-1/4 fixed opacity-30" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="font-heading text-3xl font-bold text-white tracking-tight">
            GEAMY<span className="text-[#00d4ff]">.</span>
          </a>
          <p className="font-mono text-sm text-gray-500 mt-2">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel p-8" data-testid="admin-login-form">
          <div className="flex items-center gap-3 mb-8">
            <Lock size={24} weight="thin" className="text-[#00d4ff]" />
            <h1 className="font-heading text-xl font-semibold text-white">
              Admin Login
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="admin@geamyservices.com"
                required
                data-testid="admin-login-email"
              />
            </div>

            <div>
              <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="••••••••"
                required
                data-testid="admin-login-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-submit"
            >
              {isLoading ? (
                <>
                  <CircleNotch size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="font-mono text-sm text-gray-500 hover:text-[#00d4ff] transition-colors">
              ← Back to website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
