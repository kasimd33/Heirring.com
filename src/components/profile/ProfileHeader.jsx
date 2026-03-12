import { useState, useEffect } from "react";
import { MapPin, Mail, Phone, Link2, Linkedin, Github, Briefcase } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { apiFetch, apiUpload } from "../../api/client";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ProfileHeader({ profile, completion, onUpdate }) {
  const { user: authUser } = useAuth();
  const user = profile?.user || authUser;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    professionalHeadline: "",
    location: "",
    phone: "",
    portfolioLink: "",
    linkedinLink: "",
    githubLink: "",
    openToWork: true,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        professionalHeadline: profile.professionalHeadline || "",
        location: profile.location || "",
        phone: profile.phone || "",
        portfolioLink: profile.portfolioLink || "",
        linkedinLink: profile.linkedinLink || "",
        githubLink: profile.githubLink || "",
        openToWork: profile.openToWork ?? true,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      onUpdate?.();
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await apiUpload("/auth/avatar", file, "avatar");
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const photoUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE.replace("/api", "")}${user.avatar.startsWith("/") ? "" : "/"}${user.avatar}`
    : null;

  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative shrink-0">
          <div className="h-28 w-28 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Briefcase className="h-14 w-14 text-primary" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary cursor-pointer hover:bg-primary/90">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <span className="text-primary-foreground text-xs">Edit</span>
          </label>
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={form.professionalHeadline}
                onChange={(e) => setForm((f) => ({ ...f, professionalHeadline: e.target.value }))}
                placeholder="Professional headline (e.g. Senior React Developer)"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
              />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Location"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
              />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="Phone"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
              />
              <input
                type="url"
                value={form.portfolioLink}
                onChange={(e) => setForm((f) => ({ ...f, portfolioLink: e.target.value }))}
                placeholder="Portfolio URL"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
              />
              <input
                type="url"
                value={form.linkedinLink}
                onChange={(e) => setForm((f) => ({ ...f, linkedinLink: e.target.value }))}
                placeholder="LinkedIn URL"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
              />
              <input
                type="url"
                value={form.githubLink}
                onChange={(e) => setForm((f) => ({ ...f, githubLink: e.target.value }))}
                placeholder="GitHub URL"
                className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.openToWork}
                  onChange={(e) => setForm((f) => ({ ...f, openToWork: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-sm text-foreground">Open to work</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                  <p className="text-primary mt-1">{form.professionalHeadline || "Add your headline"}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {form.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {form.location}
                      </span>
                    )}
                    {user?.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </span>
                    )}
                    {form.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {form.phone}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {form.portfolioLink && (
                      <a href={form.portfolioLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Link2 className="h-4 w-4" /> Portfolio
                      </a>
                    )}
                    {form.linkedinLink && (
                      <a href={form.linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </a>
                    )}
                    {form.githubLink && (
                      <a href={form.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                        <Github className="h-4 w-4" /> GitHub
                      </a>
                    )}
                  </div>
                  {form.openToWork && (
                    <span className="inline-block mt-3 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                      Open to work
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-card"
                >
                  Edit
                </button>
              </div>

              {/* Profile completion */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Profile completion</span>
                  <span className="font-medium text-primary">{completion?.percentage ?? 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${completion?.percentage ?? 0}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
