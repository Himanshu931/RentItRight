import { useState, useRef } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import { Mail, ShieldCheck, LockKeyhole, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = ({ switchMode, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      toast.success("Verification code sent! 📩");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error(error.message === "Failed to fetch" ? "Server is unreachable" : error.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: OTP Handling
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1].focus();
    if (newOtp.every((digit) => digit !== "")) handleVerifyOtp(newOtp);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (!pastedData) return;

    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });
    setOtp(newOtp);

    const nextIndex = digits.length < 6 ? digits.length : 5;
    inputRefs.current[nextIndex].focus();

    if (newOtp.every((d) => d !== "")) {
      handleVerifyOtp(newOtp);
    }
  };

  const handleVerifyOtp = async (providedOtp) => {
    if (loading) return;
    const currentOtp = Array.isArray(providedOtp) ? providedOtp : otp;
    if (currentOtp.includes("")) return;

    setLoading(true);
    try {
      const otpString = currentOtp.join("");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpString }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setResetToken(data.resetToken);
      setStep(3);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      toast.success("Password reset successfully! 🎉");
      switchMode("login");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="p-8 pb-6">
        {(step === 1 || step === 2) && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-text-primary text-2xl font-bold tracking-tight">
                {step === 1 ? "Forgot Password" : "Verify Code"}
              </h1>
              <p className="text-text-secondary/60 text-sm mt-1">
                {step === 1 
                  ? "Enter your email address to receive a reset code." 
                  : <>We've sent a 6-digit code to <span className="text-text-primary font-medium">{email}</span></>
                }
              </p>
            </div>
            
            <div className="space-y-6">
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={step === 2 || loading}
                      className="form-input w-full pl-12 pr-4 py-3 bg-app border border-text-secondary/30 rounded-2xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none transition focus:border-bright disabled:opacity-50"
                    />
                  </div>
                </div>
                {step === 1 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-bright hover:bg-bright/80 text-card font-extrabold py-3.5 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-6"
                  >
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                )}
              </form>

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-2 border-t border-text-secondary/10">
                  <div className="mb-6 mt-4">
                    <label className="block text-sm font-medium text-text-primary mb-3">Verification Code</label>
                    <fieldset className="flex justify-between gap-2 sm:gap-4">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          ref={(el) => (inputRefs.current[index] = el)}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className="w-full aspect-square text-center text-xl font-bold rounded-lg border border-text-secondary/40 bg-transparent text-text-primary focus:border-bright focus:ring-1 focus:ring-bright transition-all duration-200 outline-none"
                        />
                      ))}
                    </fieldset>
                  </div>
                  <button
                    type="button"
                    disabled={loading || otp.includes("")}
                    onClick={() => handleVerifyOtp()}
                    className="w-full h-14 bg-bright hover:bg-bright/90 disabled:opacity-50 text-card font-extrabold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                    {!loading && <ShieldCheck className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-text-primary text-2xl font-bold tracking-tight">New Password</h1>
              <p className="text-text-secondary/60 text-sm mt-1">Enter your new secure password.</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">New Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="form-input w-full pl-12 pr-4 py-3 bg-app border rounded-2xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none transition focus:border-bright border-text-secondary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
                <div className="relative">
                  <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="form-input w-full pl-12 pr-4 py-3 bg-app border rounded-2xl text-text-primary placeholder:text-text-secondary/30 focus:outline-none transition focus:border-bright border-text-secondary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary/30 text-lg"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-bright hover:bg-bright/80 text-card font-extrabold py-3.5 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-6"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="bg-background-dark/60 px-8 py-5 border-t border-divider text-center">
        <button className="text-text-secondary text-sm hover:text-bright transition-colors" onClick={() => switchMode("login")}>
          ← Back to Login
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
