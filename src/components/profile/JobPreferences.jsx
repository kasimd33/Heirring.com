import { useState } from "react";
import { apiFetch } from "../../api/client";

export default function JobPreferences({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const prefs = profile?.jobPreferences || {};
  const [form, setForm] = useState({
    preferredJobRole: prefs.preferredJobRole || "",
    preferredLocation: prefs.preferredLocation || "",
    expectedSalary: prefs.expectedSalary || "",
    jobType: prefs.jobType || "",
    workMode: prefs.workMode || "",
  });

  const handleSave = async () => {
    try {
      await apiFetch("/profile", {
        method: "PUT",
        body: JSON.stringify({ jobPreferences: form }),
      });
      onUpdate?.();
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Job Preferences</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-primary hover:underline"
          >
            Edit
          </button>
        )}
      </div>
      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Preferred role</label>
            <input
              type="text"
              value={form.preferredJobRole}
              onChange={(e) => setForm((f) => ({ ...f, preferredJobRole: e.target.value }))}
              placeholder="e.g. Software Engineer"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Preferred location</label>
            <input
              type="text"
              value={form.preferredLocation}
              onChange={(e) => setForm((f) => ({ ...f, preferredLocation: e.target.value }))}
              placeholder="e.g. Bangalore, Remote"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Expected salary</label>
            <input
              type="text"
              value={form.expectedSalary}
              onChange={(e) => setForm((f) => ({ ...f, expectedSalary: e.target.value }))}
              placeholder="e.g. ₹15L - ₹20L"
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Job type</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value }))}
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            >
              <option value="">Any</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Work mode</label>
            <select
              value={form.workMode}
              onChange={(e) => setForm((f) => ({ ...f, workMode: e.target.value }))}
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            >
              <option value="">Any</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
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
        <div className="space-y-2 text-sm">
          {prefs.preferredJobRole && <p><span className="text-muted-foreground">Role:</span> {prefs.preferredJobRole}</p>}
          {prefs.preferredLocation && <p><span className="text-muted-foreground">Location:</span> {prefs.preferredLocation}</p>}
          {prefs.expectedSalary && <p><span className="text-muted-foreground">Salary:</span> {prefs.expectedSalary}</p>}
          {prefs.jobType && <p><span className="text-muted-foreground">Type:</span> {prefs.jobType}</p>}
          {prefs.workMode && <p><span className="text-muted-foreground">Mode:</span> {prefs.workMode}</p>}
          {!prefs.preferredJobRole && !prefs.preferredLocation && !prefs.expectedSalary && (
            <p className="text-muted-foreground italic">No preferences set.</p>
          )}
        </div>
      )}
    </div>
  );
}
