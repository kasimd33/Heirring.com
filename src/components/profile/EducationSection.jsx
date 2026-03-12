import { useState } from "react";
import { apiFetch } from "../../api/client";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function EducationSection({ profile, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    grade: "",
  });

  const resetForm = () => {
    setForm({ institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "", grade: "" });
    setAdding(false);
    setEditing(null);
  };

  const handleAdd = async () => {
    try {
      const payload = {
        ...form,
        startYear: form.startYear ? parseInt(form.startYear) : undefined,
        endYear: form.endYear ? parseInt(form.endYear) : undefined,
      };
      await apiFetch("/profile/education", {
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
        startYear: form.startYear ? parseInt(form.startYear) : undefined,
        endYear: form.endYear ? parseInt(form.endYear) : undefined,
      };
      await apiFetch(`/profile/education/${id}`, {
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
    if (!confirm("Delete this education entry?")) return;
    try {
      await apiFetch(`/profile/education/${id}`, { method: "DELETE" });
      onUpdate?.();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const education = profile?.education || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Education</h2>
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
            value={form.institution}
            onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
            placeholder="Institution *"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="text"
            value={form.degree}
            onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))}
            placeholder="Degree"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="text"
            value={form.fieldOfStudy}
            onChange={(e) => setForm((f) => ({ ...f, fieldOfStudy: e.target.value }))}
            placeholder="Field of study"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <div className="flex gap-4">
            <input
              type="number"
              value={form.startYear}
              onChange={(e) => setForm((f) => ({ ...f, startYear: e.target.value }))}
              placeholder="Start year"
              className="flex-1 rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
            <input
              type="number"
              value={form.endYear}
              onChange={(e) => setForm((f) => ({ ...f, endYear: e.target.value }))}
              placeholder="End year"
              className="flex-1 rounded-lg border border-border bg-input px-4 py-2 text-foreground"
            />
          </div>
          <input
            type="text"
            value={form.grade}
            onChange={(e) => setForm((f) => ({ ...f, grade: e.target.value }))}
            placeholder="Grade / GPA"
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

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <div>
              <h3 className="font-semibold text-foreground">{edu.institution}</h3>
              <p className="text-primary text-sm">
                {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
              </p>
              <p className="text-muted-foreground text-sm">
                {edu.startYear && edu.endYear
                  ? `${edu.startYear} – ${edu.endYear}`
                  : edu.startYear || edu.endYear || ""}
                {edu.grade && ` • ${edu.grade}`}
              </p>
            </div>
            {!editing && !adding && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(edu._id);
                    setForm({
                      institution: edu.institution,
                      degree: edu.degree || "",
                      fieldOfStudy: edu.fieldOfStudy || "",
                      startYear: edu.startYear?.toString() || "",
                      endYear: edu.endYear?.toString() || "",
                      grade: edu.grade || "",
                    });
                  }}
                  className="p-2 text-muted-foreground hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu._id)}
                  className="p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}
        {education.length === 0 && !adding && (
          <p className="text-muted-foreground text-sm italic">No education added yet.</p>
        )}
      </div>
    </div>
  );
}
