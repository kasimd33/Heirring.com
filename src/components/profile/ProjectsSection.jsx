import { useState } from "react";
import { apiFetch } from "../../api/client";
import { Plus, Pencil, Trash2, Github, ExternalLink } from "lucide-react";

export default function ProjectsSection({ profile, onUpdate }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    projectTitle: "",
    description: "",
    techStack: "",
    githubRepo: "",
    liveDemo: "",
  });

  const resetForm = () => {
    setForm({ projectTitle: "", description: "", techStack: "", githubRepo: "", liveDemo: "" });
    setAdding(false);
    setEditing(null);
  };

  const handleAdd = async () => {
    if (!form.projectTitle.trim()) return;
    try {
      await apiFetch("/profile/projects", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
        }),
      });
      resetForm();
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await apiFetch(`/profile/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          techStack: form.techStack ? form.techStack.split(",").map((s) => s.trim()).filter(Boolean) : [],
        }),
      });
      resetForm();
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await apiFetch(`/profile/projects/${id}`, { method: "DELETE" });
      onUpdate?.();
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const projects = profile?.projects || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Projects / Portfolio</h2>
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
            value={form.projectTitle}
            onChange={(e) => setForm((f) => ({ ...f, projectTitle: e.target.value }))}
            placeholder="Project title *"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description"
            rows={3}
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="text"
            value={form.techStack}
            onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
            placeholder="Tech stack (comma-separated)"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="url"
            value={form.githubRepo}
            onChange={(e) => setForm((f) => ({ ...f, githubRepo: e.target.value }))}
            placeholder="GitHub repo URL"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="url"
            value={form.liveDemo}
            onChange={(e) => setForm((f) => ({ ...f, liveDemo: e.target.value }))}
            placeholder="Live demo URL"
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
        {projects.map((proj) => (
          <div key={proj._id} className="p-4 rounded-lg border border-border bg-input/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">{proj.projectTitle}</h3>
                {proj.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{proj.description}</p>
                )}
                {proj.techStack?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.techStack.map((t) => (
                      <span key={t} className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex gap-3">
                  {proj.githubRepo && (
                    <a href={proj.githubRepo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Github className="h-4 w-4" /> Code
                    </a>
                  )}
                  {proj.liveDemo && (
                    <a href={proj.liveDemo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <ExternalLink className="h-4 w-4" /> Live
                    </a>
                  )}
                </div>
              </div>
              {!editing && !adding && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditing(proj._id);
                      setForm({
                        projectTitle: proj.projectTitle,
                        description: proj.description || "",
                        techStack: proj.techStack?.join(", ") || "",
                        githubRepo: proj.githubRepo || "",
                        liveDemo: proj.liveDemo || "",
                      });
                    }}
                    className="p-2 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && !adding && (
          <p className="text-muted-foreground text-sm italic">No projects added yet.</p>
        )}
      </div>
    </div>
  );
}
