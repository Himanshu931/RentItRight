import { useState, useEffect, useRef } from "react";
import { Camera, User, MapPin, Phone, Lock, Eye, EyeOff, Check, Loader2, Shield } from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/authHook";

export default function ProfileSettings() {
  const { user, loading: authLoading, reFetch } = useAuth();
  const fileInputRef = useRef(null);

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  // Personal info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);

  // Location
  const [pincode, setPincode] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [locationSaving, setLocationSaving] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Fetch CSRF token helper
  const getCsrf = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/csrf-token`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    return data.csrfToken;
  };

  // Fetch full profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const csrf = await getCsrf();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/profile`, {
          method: "GET",
          headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.user);
          setName(data.user.name || "");
          setPhone(data.user.phone || "");
          setPincode(data.user.address?.pincode || "");
          setDistrict(data.user.address?.district || "");
          setState(data.user.address?.state || "");
          setAvatarPreview(data.user.profileImage || null);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const url = import.meta.env.VITE_CLOUDINARY_URL;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save avatar
  const handleAvatarSave = async () => {
    if (!avatarFile) return;
    setAvatarSaving(true);
    try {
      const imageUrl = await uploadToCloudinary(avatarFile);
      const csrf = await getCsrf();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/avatar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        credentials: "include",
        body: JSON.stringify({ profileImage: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update avatar");
      toast.success("Profile picture updated!");
      setAvatarFile(null);
      setAvatarPreview(imageUrl);
      reFetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAvatarSaving(false);
    }
  };

  // Save personal info
  const handleInfoSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name is required");
    if (phone && !/^\d{10}$/.test(phone)) return toast.error("Enter a valid 10-digit mobile number");
    setInfoSaving(true);
    try {
      const csrf = await getCsrf();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        credentials: "include",
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      toast.success("Profile updated!");
      reFetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setInfoSaving(false);
    }
  };

  // Save location
  const handleLocationSave = async (e) => {
    e.preventDefault();
    if (!pincode.trim() || pincode.length < 6) return toast.error("Enter a valid 6-digit pincode");
    setLocationSaving(true);
    try {
      // Auto-resolve district & state from pincode
      const pinRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const pinData = await pinRes.json();
      if (!pinData || pinData[0].Status !== "Success") {
        throw new Error("Invalid pincode or service unavailable");
      }
      const resolvedDistrict = pinData[0].PostOffice[0].District;
      const resolvedState = pinData[0].PostOffice[0].State;

      const csrf = await getCsrf();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/address`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        credentials: "include",
        body: JSON.stringify({ pincode, district: resolvedDistrict, state: resolvedState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update address");
      setDistrict(resolvedDistrict);
      setState(resolvedState);
      toast.success("Location updated!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLocationSaving(false);
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return toast.error("All password fields are required");
    if (newPassword.length < 6) return toast.error("New password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setPasswordSaving(true);
    try {
      const csrf = await getCsrf();
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/me/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to change password");
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  // Role badge config
  const roleBadge = {
    renter: { label: "Renter", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    owner: { label: "Owner", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    admin: { label: "Admin", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  };

  if (loading || authLoading) {
    return (
      <main className="flex-1 flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-bright animate-spin" />
          <span className="text-text-secondary text-sm font-medium">Loading profile...</span>
        </div>
      </main>
    );
  }

  const userRole = user?.role || "renter";
  const badge = roleBadge[userRole] || roleBadge.renter;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-text-primary">Profile Settings</h1>
            <p className="text-text-secondary text-sm mt-1">Manage your account details and security preferences.</p>
          </div>
          <button
            type="submit"
            form="personal-info-form"
            disabled={infoSaving}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-bright text-app font-bold text-sm hover:bg-bright/90 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {infoSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{infoSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        {/* Avatar + Info Header Card */}
        <div className="bg-surface border border-divider rounded-2xl p-5 md:p-6 mb-6 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-bright/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {avatarFile && (
            <div className="absolute top-5 right-5 z-10">
              <button
                onClick={handleAvatarSave}
                disabled={avatarSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bright text-app text-sm font-bold hover:bg-bright/90 transition-all cursor-pointer disabled:opacity-50"
              >
                {avatarSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span className="hidden sm:inline">{avatarSaving ? "Uploading..." : "Save Photo"}</span>
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6 relative">
            {/* Avatar */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-elevated border-2 border-divider overflow-hidden cursor-pointer group-hover:border-bright/50 transition-all duration-300 relative"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-10 h-10 text-text-muted" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-bright flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              >
                <Camera className="w-4 h-4 text-app" />
              </button>
            </div>

            {/* User info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-text-primary">{profile?.name || user?.name || "User"}</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.color} w-fit`}>
                  <Shield className="w-3 h-3" />
                  {badge.label}
                </span>
              </div>
              <p className="text-text-secondary text-sm">{profile?.email || user?.email}</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <form id="personal-info-form" onSubmit={handleInfoSave} className="bg-surface border border-divider rounded-2xl p-5 hover:border-bright/20 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bright/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-bright" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">Personal Information</h3>
                  <p className="text-text-muted text-xs">Update your name and contact</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <InputField
                label="Full Name"
                icon={<User className="w-4 h-4" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
              <InputField
                label="Mobile Number"
                icon={<Phone className="w-4 h-4" />}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                type="tel"
              />
            </div>
          </form>

          {/* Location */}
          <form onSubmit={handleLocationSave} className="bg-surface border border-divider rounded-2xl p-5 hover:border-bright/20 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">Location</h3>
                  <p className="text-text-muted text-xs">Auto-resolved from your pincode</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={locationSaving}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-bright text-app font-bold text-xs hover:bg-bright/90 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {locationSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span className="hidden sm:inline">{locationSaving ? "Resolving..." : "Update Location"}</span>
              </button>
            </div>

            <div className="space-y-4">
              <InputField
                label="Pincode"
                icon={<MapPin className="w-4 h-4" />}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit pincode"
                maxLength={6}
              />

              {/* Read-only resolved fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-text-muted uppercase ml-1">District</label>
                  <div className="w-full rounded-xl bg-app/50 border border-divider px-4 py-3 text-sm text-text-secondary">
                    {district || "—"}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-wider text-text-muted uppercase ml-1">State</label>
                  <div className="w-full rounded-xl bg-app/50 border border-divider px-4 py-3 text-sm text-text-secondary">
                    {state || "—"}
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Change Password — full width */}
          <form onSubmit={handlePasswordChange} className="lg:col-span-2 bg-surface border border-divider rounded-2xl p-5 hover:border-bright/20 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">Change Password</h3>
                  <p className="text-text-muted text-xs">Keep your account secure</p>
                </div>
              </div>
              <button
                type="submit"
                disabled={passwordSaving}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-bright text-app font-bold text-xs hover:bg-bright/90 transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span className="hidden sm:inline">{passwordSaving ? "Changing..." : "Change Password"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PasswordField
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                show={showCurrentPw}
                onToggle={() => setShowCurrentPw(!showCurrentPw)}
              />
              <PasswordField
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                show={showNewPw}
                onToggle={() => setShowNewPw(!showNewPw)}
              />
              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                show={showConfirmPw}
                onToggle={() => setShowConfirmPw(!showConfirmPw)}
              />
            </div>

            {/* Password strength hint */}
            {newPassword && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full bg-divider overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      newPassword.length >= 12 ? "w-full bg-success" :
                      newPassword.length >= 8 ? "w-2/3 bg-warning" :
                      newPassword.length >= 6 ? "w-1/3 bg-error" : "w-0"
                    }`}
                  />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  newPassword.length >= 12 ? "text-success" :
                  newPassword.length >= 8 ? "text-warning" :
                  newPassword.length >= 6 ? "text-error" : "text-text-muted"
                }`}>
                  {newPassword.length >= 12 ? "Strong" : newPassword.length >= 8 ? "Medium" : newPassword.length >= 6 ? "Weak" : "Too short"}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

/* ─── Sub-components ─── */

function InputField({ label, icon, value, onChange, placeholder, maxLength, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold tracking-wider text-text-muted uppercase ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-bright transition-colors">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full rounded-xl bg-app border border-divider px-11 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bright/50 focus:ring-1 focus:ring-bright/20 transition-all"
        />
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, show, onToggle }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold tracking-wider text-text-muted uppercase ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-bright transition-colors">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl bg-app border border-divider pl-11 pr-11 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bright/50 focus:ring-1 focus:ring-bright/20 transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
