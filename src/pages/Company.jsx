import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import { Building2, Globe } from "lucide-react";

export default function Company() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    companyDescription: "",
    companyWebsite: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/profile");
      const u = res.data;
      setForm({
        name: u.name || "",
        company: u.company || "",
        companyDescription: u.companyDescription || "",
        companyWebsite: u.companyWebsite || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          companyDescription: form.companyDescription,
          companyWebsite: form.companyWebsite,
        }),
      });
      alert("Company profile updated successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Company Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your company information visible to candidates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Company Name
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              placeholder="TechCorp"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Company Description
            </label>
            <textarea
              value={form.companyDescription}
              onChange={(e) =>
                setForm((f) => ({ ...f, companyDescription: e.target.value }))
              }
              placeholder="Tell candidates about your company..."
              rows={4}
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Company Website
            </label>
            <input
              type="url"
              value={form.companyWebsite}
              onChange={(e) =>
                setForm((f) => ({ ...f, companyWebsite: e.target.value }))
              }
              placeholder="https://www.yourcompany.com"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {form.company && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Preview
          </h2>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{form.company}</h3>
              {form.companyDescription && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {form.companyDescription}
                </p>
              )}
              {form.companyWebsite && (
                <a
                  href={form.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  {form.companyWebsite}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
