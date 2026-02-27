import AuthLayout from "../../components/auth/AuthLayout";
import { LockKeyhole } from "lucide-react";
import { Mail, Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

const Login = ({ switchMode, onClose }) => {
  const navigate = useNavigate();
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();

    setError({ email: "", password: "" });
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      })
      const data = await res.json();
      if (!data.success) {
        setError({
          email: data.message.toLowerCase().includes("not found") || data.message.toLowerCase().includes("email") ? data.message : "",
          password: data.message.toLowerCase().includes("password") ? data.message : ""
        });
        console.log(data.message)
        throw new Error(data.message);
      }

      navigate("/role-redirect");
      onClose()

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>

      {/* Header */}
      <div className="p-8 pb-6 text-center">

        <h1 className="text-text-primary text-2xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-text-secondary/50 text-sm mt-1">
          Login to continue renting or listing items
        </p>
      </div>

      {/* Form */}
      <div className="px-8 pb-8">
        <form className="space-y-5" onSubmit={handleLogin}>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email address
            </label>
            <div className="relative">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg" />
              <input
                type="email"
                placeholder="name@example.com"
                value={user.email}
                onChange={(e) => {
                  setUser({ ...user, email: e.target.value });
                  setError((prev) => ({ ...prev, email: "" }));
                }}
                className="form-input w-full pl-12 pr-4 py-3 bg-app border border-text-secondary/30 rounded-2xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none transition
              focus:border-bright"
                required
              />
            </div>
            {error.email && (
              <p className="text-white font-bold text-sm mt-2 bg-error/15 p-2 rounded-lg text-center border border-error/80">{error.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-text-primary">
                Password
              </label>
              <button
                type="button"
                className="text-bright text-xs font-semibold hover:underline"
              >
                Forgot?
              </button>
            </div>


            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={user.password}
                onChange={(e) => {
                  setUser({ ...user, password: e.target.value });
                  setError((prev) => ({ ...prev, password: "" }));
                }}
                className="form-input w-full pl-12 pr-4 py-3 bg-app border rounded-2xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none transition focus:border-bright border-text-secondary/30"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {error.password && (
              <p className="text-white font-bold text-sm mt-2 bg-error/15 p-2 rounded-lg text-center border border-error/80">{error.password}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-bright hover:bg-bright/80 text-card font-extrabold py-3.5 rounded-2xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Logging in...</span>
              </div>
            ) : (
              <>
                Login
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </>
            )}
          </button>

        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-color" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-4 text-text-secondary/50 tracking-widest">
              or continue with
            </span>
          </div>
        </div>

        {/* Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 border border-text-secondary/40 rounded-2xl hover:bg-background-dark transition text-text-primary text-sm font-medium"
        >
          <FaGoogle />
          Continue with Google
        </button>
      </div>

      {/* Footer */}
      <div className="bg-background-dark/60 px-8 py-5 border-t border-divider text-center">
        <p className="text-text-secondary text-sm">
          Don’t have an account?
          <button className="text-bright font-semibold hover:underline ml-1" onClick={() => switchMode("register")}>
            Register
          </button>
        </p>
      </div>

    </AuthLayout>
  );
};

export default Login;
