import { useRef, useState, useEffect } from "react";
import { apiFetch, apiUpload } from "../api/client";
import { Camera, Mail, Building2 } from "lucide-react";

export default function Settings() {
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    company: "",
    avatar: null,
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/profile");
      const u = res.data;
      setProfile({
        name: u.name || "",
        email: u.email || "",
        company: u.company || "",
        avatar: u.avatar || null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file (JPEG, PNG, GIF, WebP)" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be less than 2MB" });
      return;
    }
    setAvatarUploading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiUpload("/auth/avatar", file);
      setProfile((p) => ({ ...p, avatar: res.data.avatar }));
      setMessage({ type: "success", text: "Profile photo updated" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Upload failed" });
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profile.name,
          company: profile.company,
        }),
      });
      setMessage({ type: "success", text: "Profile updated successfully" });
      setEditingProfile(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }
    if (password.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }
    setPasswordSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await apiFetch("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        }),
      });
      setMessage({ type: "success", text: "Password updated successfully" });
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      {message.text && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-primary/20 text-primary"
              : "bg-destructive/20 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Cover / Header area */}
        <div className="h-24 bg-gradient-to-r from-primary/30 to-primary/10" />

        <div className="px-6 pb-6">
          {/* Profile photo and details */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-12">
            {/* Avatar - clickable to upload */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="group relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-card bg-primary/20 text-3xl font-bold text-primary hover:bg-primary/30 transition-colors disabled:opacity-70 cursor-pointer overflow-hidden"
              >
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(profile.name || "U")
                )}
                {avatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-sm">
                    Uploading...
                  </div>
                )}
              </button>
              <div
                className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-primary/90 cursor-pointer hover:bg-primary transition-colors"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change photo"
              >
                <Camera className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>

            {/* Profile info */}
            <div className="flex-1 min-w-0">
              {editingProfile ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Company
                    </label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, company: e.target.value }))
                      }
                      className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {profileSaving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-foreground">
                    {profile.name || "User"}
                  </h2>
                  {profile.company && (
                    <p className="mt-1 text-muted-foreground">{profile.company}</p>
                  )}
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="mt-3 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition-colors"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Detail rows */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-input/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </p>
                <p className="text-foreground truncate">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-input/50 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Company
                </p>
                <p className="text-foreground truncate">
                  {profile.company || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Card */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Change Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword((p) => ({ ...p, currentPassword: e.target.value }))
              }
              required
              placeholder="Enter current password"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              New Password
            </label>
            <input
              type="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword((p) => ({ ...p, newPassword: e.target.value }))
              }
              required
              minLength={6}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              required
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={passwordSaving}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
