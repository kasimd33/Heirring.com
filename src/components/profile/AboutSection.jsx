import { useState } from "react";
import { apiFetch } from "../../api/client";

export default function AboutSection({ profile, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    aboutText: profile?.aboutText || "",
    careerGoals: profile?.careerGoals || "",
    yearsOfExperience: profile?.yearsOfExperience ?? 0,
  });

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

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">About Me</h2>
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
            <label className="block text-sm text-muted-foreground mb-1">Professional summary</label>
            <textarea
              value={form.aboutText}
              onChange={(e) => setForm((f) => ({ ...f, aboutText: e.target.value }))}
              rows={4}
              placeholder="Write a short professional summary..."
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Career goals</label>
            <textarea
              value={form.careerGoals}
              onChange={(e) => setForm((f) => ({ ...f, careerGoals: e.target.value }))}
              rows={2}
              placeholder="Your career aspirations..."
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Years of experience</label>
            <input
              type="number"
              min={0}
              value={form.yearsOfExperience}
              onChange={(e) => setForm((f) => ({ ...f, yearsOfExperience: parseInt(e.target.value) || 0 }))}
              className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
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
        <div className="text-muted-foreground text-sm space-y-2">
          {profile?.aboutText ? (
            <p className="whitespace-pre-wrap">{profile.aboutText}</p>
          ) : (
            <p className="italic">No summary added yet.</p>
          )}
          {profile?.careerGoals && (
            <p className="mt-2"><span className="text-foreground font-medium">Goals:</span> {profile.careerGoals}</p>
          )}
          {profile?.yearsOfExperience > 0 && (
            <p><span className="text-foreground font-medium">Experience:</span> {profile.yearsOfExperience} years</p>
          )}
        </div>
      )}
    </div>
  );
}
