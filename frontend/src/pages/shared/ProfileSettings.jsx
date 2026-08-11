import { useState, useEffect, useRef } from "react";
import {
  Camera, User, MapPin, Phone, Lock, Eye, EyeOff, Check,
  Loader2, Shield, Mail, Star, Package, Heart, LogOut,
  ChevronRight, Calendar, CheckCircle2, Wallet, TrendingUp
} from "lucide-react";
import toast from "react-hot-toast";
import useAuth from "../../hooks/authHook";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const { user, loading: authLoading, reFetch } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarSaving, setAvatarSaving] = useState(false);

  // Edit mode
  const [editMode, setEditMode] = useState(false);

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
  const [showPasswordSection, setShowPasswordSection] = useState(false);
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
      setEditMode(false);
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
      setShowPasswordSection(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Mask email
  const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) return email;
    return `${local[0]}${"•".repeat(Math.min(local.length - 2, 6))}${local[local.length - 1]}@${domain}`;
  };

  // Mask phone
  const maskPhone = (ph) => {
    if (!ph) return "Not added";
    if (ph.length <= 4) return ph;
    return `${"•".repeat(ph.length - 4)} ${ph.slice(-4)}`;
  };

  // Role config
  const roleConfig = {
    renter: { label: "Verified Renter", subtitle: "Renting on Rent It Right", color: "text-bright" },
    owner: { label: "Verified Owner", subtitle: "Item Provider on Rent It Right", color: "text-bright" },
    admin: { label: "Administrator", subtitle: "System Admin", color: "text-purple-400" },
  };

  if (loading || authLoading) {
    return (
      <main className="flex-1 flex items-center justify-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-6 h-6 text-bright animate-spin" />
          <span className="text-text-secondary text-sm">Loading profile...</span>
        </div>
      </main>
    );
  }

  const userRole = user?.role || profile?.roles || "renter";
  const roleInfo = roleConfig[userRole] || roleConfig.renter;

  // Stats based on role
  const stats = userRole === "owner"
    ? [
        {
          label: "Avg. Rating",
          value: profile?.owner?.rating?.average?.toFixed(1) || "0.0",
          icon: <Star className="w-3.5 h-3.5 text-amber-400" />,
          iconColor: "text-amber-400",
        },
        {
          label: "Total Rentals",
          value: profile?.owner?.totalBookings || 0,
          icon: <Package className="w-3.5 h-3.5 text-bright" />,
          iconColor: "text-bright",
        },
        {
          label: "Total Earnings",
          value: `₹${(profile?.owner?.totalEarnings || 0).toLocaleString("en-IN")}`,
          icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
          iconColor: "text-emerald-400",
        },
      ]
    : [
        {
          label: "Avg. Rating",
          value: profile?.renter?.rating?.average?.toFixed(1) || "0.0",
          icon: <Star className="w-3.5 h-3.5 text-amber-400" />,
          iconColor: "text-amber-400",
        },
        {
          label: "Total Bookings",
          value: profile?.renter?.totalBookings || 0,
          icon: <Package className="w-3.5 h-3.5 text-bright" />,
          iconColor: "text-bright",
        },
        {
          label: "Wishlist",
          value: profile?.renter?.wishlist?.length || 0,
          icon: <Heart className="w-3.5 h-3.5 text-rose-400" />,
          iconColor: "text-rose-400",
        },
      ];

  // Password strength
  const getPasswordStrength = () => {
    if (!newPassword) return { width: "0%", color: "", label: "" };
    if (newPassword.length >= 12) return { width: "100%", color: "bg-emerald-400", label: "Strong" };
    if (newPassword.length >= 8) return { width: "66%", color: "bg-amber-400", label: "Medium" };
    if (newPassword.length >= 6) return { width: "33%", color: "bg-red-400", label: "Weak" };
    return { width: "15%", color: "bg-red-500", label: "Too short" };
  };
  const pwStrength = getPasswordStrength();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6 md:py-10">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            Profile Management
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* ── Two-Panel Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ════════════════════════════════
              LEFT SIDEBAR — Profile Card
             ════════════════════════════════ */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-surface border border-divider rounded-2xl overflow-hidden">

              {/* Avatar section */}
              <div className="px-6 pt-7 pb-5 flex flex-col items-center">
                <div className="relative group mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[100px] h-[100px] rounded-full bg-elevated border-2 border-divider overflow-hidden cursor-pointer group-hover:border-bright/40 transition-all duration-300"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-10 h-10 text-text-muted" />
                      </div>
                    )}
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-[2.5px] border-surface" />
                </div>

                <h2 className="text-lg font-bold text-text-primary text-center">
                  {profile?.name || user?.name || "User"}
                </h2>
                <span className={`text-xs font-semibold ${roleInfo.color} uppercase tracking-wider mt-0.5`}>
                  {roleInfo.label}
                </span>
                <p className="text-text-muted text-[11px] mt-0.5 italic">
                  {roleInfo.subtitle}
                </p>

                {/* Edit Profile / Save Avatar */}
                <div className="w-full mt-5 space-y-2">
                  {avatarFile ? (
                    <button
                      onClick={handleAvatarSave}
                      disabled={avatarSaving}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bright text-app text-sm font-semibold hover:bg-bright/90 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {avatarSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                      {avatarSaving ? "Uploading..." : "Save Photo"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bright/10 text-bright text-sm font-semibold hover:bg-bright/20 transition-all cursor-pointer border border-bright/20"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      {editMode ? "Cancel Editing" : "Edit Profile"}
                    </button>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Contact Information */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-4">
                  Contact Information
                </p>

                <div className="space-y-3.5">
                  <ContactRow
                    icon={<Mail className="w-4 h-4" />}
                    value={maskEmail(profile?.email || user?.email)}
                    verified={profile?.isVerified}
                  />
                  <ContactRow
                    icon={<Phone className="w-4 h-4" />}
                    value={maskPhone(profile?.phone || user?.phone)}
                    verified={!!phone}
                  />
                  <ContactRow
                    icon={<MapPin className="w-4 h-4" />}
                    value={
                      district && state
                        ? `${district}, ${state}`
                        : "Not set"
                    }
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Member Since */}
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-1.5">
                  Member Since
                </p>
                <p className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-text-muted" />
                  {formatDate(profile?.createdAt)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Status */}
              <div className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">Status</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">Wallet</span>
                  <span className="text-xs font-semibold text-text-primary">
                    ₹{(user?.walletBalance || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Logout */}
              <div className="px-6 py-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all cursor-pointer border border-red-500/20 hover:border-red-500/40"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Account
                </button>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════
              RIGHT CONTENT — Settings
             ════════════════════════════════ */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-surface border border-divider rounded-2xl px-5 py-4 hover:border-divider transition-all"
                >
                  <p className="text-[10px] font-bold tracking-widest text-text-muted uppercase mb-1.5">
                    {stat.label}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-text-primary">{stat.value}</span>
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Account Security ── */}
            <div className="bg-surface border border-divider rounded-2xl overflow-hidden">
              <div className="px-6 py-5 flex items-center gap-3">
                <Shield className="w-5 h-5 text-bright" />
                <h3 className="text-base font-bold text-text-primary">Account Security</h3>
              </div>
              <div className="h-px bg-divider" />

              {/* Change Password row */}
              <button
                type="button"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-elevated/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-elevated flex items-center justify-center">
                    <Lock className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-text-primary">Change Password</p>
                    <p className="text-[11px] text-text-muted">Update your account password</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-text-muted transition-transform duration-200 ${showPasswordSection ? "rotate-90" : ""}`} />
              </button>

              {/* Password form — expandable */}
              {showPasswordSection && (
                <form onSubmit={handlePasswordChange} className="px-6 pb-5 pt-1">
                  <div className="space-y-3">
                    <PasswordField
                      label="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      show={showCurrentPw}
                      onToggle={() => setShowCurrentPw(!showCurrentPw)}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                    {newPassword && (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 rounded-full bg-divider overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${pwStrength.color}`}
                            style={{ width: pwStrength.width }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-text-muted min-w-[55px] text-right">
                          {pwStrength.label}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={passwordSaving}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-bright text-app text-sm font-semibold hover:bg-bright/90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        {passwordSaving ? "Changing..." : "Update Password"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* ── Personal Information (Edit Mode) ── */}
            {editMode && (
              <form
                onSubmit={handleInfoSave}
                className="bg-surface border border-divider rounded-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]"
              >
                <div className="px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-bright" />
                    <h3 className="text-base font-bold text-text-primary">Personal Information</h3>
                  </div>
                </div>
                <div className="h-px bg-divider" />

                <div className="px-6 py-5 space-y-4">
                  <InputField
                    label="Full Name"
                    icon={<User className="w-4 h-4" />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                  <InputField
                    label="Phone Number"
                    icon={<Phone className="w-4 h-4" />}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    type="tel"
                  />

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={infoSaving}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg bg-bright text-app text-sm font-semibold hover:bg-bright/90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {infoSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {infoSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* ── Location ── */}
            <form
              onSubmit={handleLocationSave}
              className="bg-surface border border-divider rounded-2xl overflow-hidden"
            >
              <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Location</h3>
                    <p className="text-[11px] text-text-muted">District & state auto-resolve from pincode</p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-divider" />

              <div className="px-6 py-5 space-y-4">
                <InputField
                  label="Pincode"
                  icon={<MapPin className="w-4 h-4" />}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />

                <div className="grid grid-cols-2 gap-3">
                  <ReadOnlyField label="District" value={district} />
                  <ReadOnlyField label="State" value={state} />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={locationSaving}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-bright text-app text-sm font-semibold hover:bg-bright/90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {locationSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {locationSaving ? "Resolving..." : "Update Location"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────
   Sub-components
   ───────────────────────────────────────────────────────── */

function ContactRow({ icon, value, verified }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-text-muted shrink-0">{icon}</span>
        <span className="text-sm text-text-secondary truncate">{value}</span>
      </div>
      {verified && (
        <span className="text-[10px] font-bold tracking-wider text-bright uppercase shrink-0">
          Verified
        </span>
      )}
    </div>
  );
}

function InputField({ label, icon, value, onChange, placeholder, maxLength, type = "text" }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-text-muted mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-bright transition-colors duration-200">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full rounded-lg bg-app border border-divider pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-bright/50 transition-all duration-200"
        />
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-text-muted mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="w-full rounded-lg bg-elevated/50 border border-divider/60 px-3.5 py-2.5 text-sm text-text-secondary">
        {value || "—"}
      </div>
    </div>
  );
}

function PasswordField({ label, value, onChange, placeholder, show, onToggle }) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-text-muted mb-1.5 ml-0.5">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-bright transition-colors duration-200">
          <Lock className="w-4 h-4" />
        </div>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg bg-app border border-divider pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-bright/50 transition-all duration-200"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
