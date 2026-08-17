import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../../assets/Ykno.png";
import { authApi } from "../api";
import { setToken } from "../../../app/lib/api";
import { AuthResponse } from "../../../app/core/types";
import { CONFIG } from "../../../app/core/config";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await authApi.login({
        email,
        password,
      });
      setToken(data.access_token);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex font-['Inter',sans-serif]">
      {/* Brand panel */}
      <div className="hidden lg:flex w-1/2 bg-[#8B7CF6] relative overflow-hidden items-center justify-center p-16">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-white/[0.04] rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 max-w-[400px]">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img src={logo} alt="Messiq" className="w-full h-full object-cover" />
            </div>
            <span className="text-white tracking-tight" style={{ fontSize: "1.25rem", fontWeight: 700 }}>
              Messiq
            </span>
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
            Connect. Automate. Grow.
          </h1>
          <p className="text-white/60" style={{ fontSize: "0.9375rem", lineHeight: 1.7 }}>
            Manage all your social messaging platforms in one powerful dashboard. Streamline your workflow with AI-powered automations.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src={logo} alt="Messiq" className="w-full h-full object-cover" />
            </div>
            <span className="text-gray-900 tracking-tight" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              Messiq
            </span>
          </div>

          <h2 className="text-gray-900 mb-2" style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            Welcome back
          </h2>
          <p className="text-gray-500 mb-8" style={{ fontSize: "0.875rem" }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div
                className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600"
                style={{ fontSize: "0.8125rem" }}
              >
                {error}
              </div>
            )}
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 bg-[#F5F5F8] border border-transparent focus:border-[#8B7CF6] focus:bg-white rounded-xl outline-none transition-all"
                style={{ fontSize: "0.875rem" }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>Password</label>
                <button type="button" className="text-[#8B7CF6] hover:text-[#7C6BEF]" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 px-4 pr-11 bg-[#F5F5F8] border border-transparent focus:border-[#8B7CF6] focus:bg-white rounded-xl outline-none transition-all"
                  style={{ fontSize: "0.875rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <p className="text-gray-500" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
                By signing in, you agree to our{" "}
                <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="text-[#8B7CF6] cursor-pointer hover:underline" style={{ fontWeight: 500 }}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-[#8B7CF6] cursor-pointer hover:underline" style={{ fontWeight: 500 }}>
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#8B7CF6] hover:bg-[#7C6BEF] text-white rounded-xl transition-colors shadow-[0_2px_8px_rgba(139,124,246,0.25)]"
              style={{ fontSize: "0.875rem", fontWeight: 600 }}
            >
              Sign in
            </button>
          </form>

          {/* <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400" style={{ fontSize: "0.75rem" }}>or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 h-11 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-gray-600"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
              GitHub
            </button>
          </div> */}

        </div>
      </div>
    </div>
  );
}