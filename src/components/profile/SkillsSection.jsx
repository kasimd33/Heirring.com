import { useState } from "react";
import { apiFetch } from "../../api/client";
import { X } from "lucide-react";

const LEVEL_COLORS = {
  beginner: "bg-amber-500/20 text-amber-400",
  intermediate: "bg-blue-500/20 text-blue-400",
  expert: "bg-green-500/20 text-green-400",
};

export default function SkillsSection({ profile, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: "", level: "intermediate" });

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return;
    try {
      await apiFetch("/profile/skills", {
        method: "POST",
        body: JSON.stringify({ skills: [newSkill] }),
      });
      setNewSkill({ name: "", level: "intermediate" });
      setAdding(false);
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (name) => {
    try {
      await apiFetch(`/profile/skills/${encodeURIComponent(name)}`, { method: "DELETE" });
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const skills = profile?.skills || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Skills</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Add skill
          </button>
        )}
      </div>
      {adding && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSkill.name}
            onChange={(e) => setNewSkill((s) => ({ ...s, name: e.target.value }))}
            placeholder="Skill name"
            className="flex-1 rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <select
            value={newSkill.level}
            onChange={(e) => setNewSkill((s) => ({ ...s, level: e.target.value }))}
            className="rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Add
          </button>
          <button
            onClick={() => setAdding(false)}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s.name}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${LEVEL_COLORS[s.level] || LEVEL_COLORS.intermediate}`}
          >
            {s.name}
            <span className="text-xs opacity-75">({s.level})</span>
            <button
              type="button"
              onClick={() => handleRemove(s.name)}
              className="hover:opacity-80 p-0.5"
              aria-label="Remove"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        {skills.length === 0 && !adding && (
          <p className="text-muted-foreground text-sm italic">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}
