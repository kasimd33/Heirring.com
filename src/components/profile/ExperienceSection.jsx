import { useState } from "react";
import { apiFetch } from "../../api/client";
import { MapPin, Calendar, Plus, Pencil, Trash2 } from "lucide-react";

export default function ExperienceSection({ profile, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    achievements: "",
  });

  const resetForm = () => {
    setForm({
      companyName: "",
      jobTitle: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: "",
    });
    setAdding(false);
    setEditing(null);
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.current ? undefined : form.endDate || undefined,
        achievements: form.achievements ? form.achievements.split("\n").filter(Boolean) : [],
      };
      await apiFetch("/profile/experience", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      resetForm();
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const payload = {
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.current ? undefined : form.endDate || undefined,
        achievements: form.achievements ? form.achievements.split("\n").filter(Boolean) : [],
      };
      await apiFetch(`/profile/experience/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      resetForm();
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await apiFetch(`/profile/experience/${id}`, { method: "DELETE" });
      onUpdate?.();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const experiences = profile?.experience || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Work Experience</h2>
        {!adding && !editing && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        )}
      </div>

      {(adding || editing) && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-input/30 space-y-3">
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
            placeholder="Company name *"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
            placeholder="Job title *"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            placeholder="Location"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <div className="flex gap-4">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              placeholder="Start date"
              className="flex-1 rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              disabled={form.current}
              className="flex-1 rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm((f) => ({ ...f, current: e.target.checked }))}
              className="rounded border-border"
            />
            <span className="text-sm">Current role</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <textarea
            value={form.achievements}
            onChange={(e) => setForm((f) => ({ ...f, achievements: e.target.value }))}
            placeholder="Achievements (one per line)"
            rows={2}
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <div className="flex gap-2">
            <button
              onClick={() => editing ? handleUpdate(editing) : handleAdd()}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              {editing ? "Update" : "Add"}
            </button>
            <button onClick={resetForm} className="rounded-lg border border-border px-4 py-2 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp._id} className="relative pl-6 border-l-2 border-primary/30">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">{exp.jobTitle}</h3>
                <p className="text-primary">{exp.companyName}</p>
                <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {exp.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                    {" – "}
                    {exp.current ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                    {exp.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
              {!editing && !adding && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditing(exp._id);
                      setForm({
                        companyName: exp.companyName,
                        jobTitle: exp.jobTitle,
                        location: exp.location || "",
                        startDate: exp.startDate ? exp.startDate.slice(0, 10) : "",
                        endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
                        current: exp.current || false,
                        description: exp.description || "",
                        achievements: exp.achievements?.join("\n") || "",
                      });
                    }}
                    className="p-2 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {experiences.length === 0 && !adding && (
          <p className="text-muted-foreground text-sm italic">No experience added yet.</p>
        )}
      </div>
    </div>
  );
}
