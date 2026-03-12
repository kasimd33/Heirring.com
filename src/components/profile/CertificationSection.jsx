import { useState } from "react";
import { apiFetch } from "../../api/client";
import { Plus, Trash2 } from "lucide-react";

export default function CertificationSection({ profile, onUpdate }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    certificateName: "",
    issuingOrganization: "",
    issueDate: "",
    credentialURL: "",
  });

  const handleAdd = async () => {
    if (!form.certificateName.trim()) return;
    try {
      await apiFetch("/profile/certifications", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          issueDate: form.issueDate || undefined,
        }),
      });
      setForm({ certificateName: "", issuingOrganization: "", issueDate: "", credentialURL: "" });
      setAdding(false);
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this certification?")) return;
    try {
      await apiFetch(`/profile/certifications/${id}`, { method: "DELETE" });
      onUpdate?.();
    } catch (err) {
      alert(err.message);
    }
  };

  const certifications = profile?.certifications || [];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Certifications</h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-input/30 space-y-3">
          <input
            type="text"
            value={form.certificateName}
            onChange={(e) => setForm((f) => ({ ...f, certificateName: e.target.value }))}
            placeholder="Certificate name *"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="text"
            value={form.issuingOrganization}
            onChange={(e) => setForm((f) => ({ ...f, issuingOrganization: e.target.value }))}
            placeholder="Issuing organization"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <input
            type="url"
            value={form.credentialURL}
            onChange={(e) => setForm((f) => ({ ...f, credentialURL: e.target.value }))}
            placeholder="Credential URL"
            className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground"
          />
          <div className="flex gap-2">
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
        </div>
      )}

      <div className="space-y-3">
        {certifications.map((cert) => (
          <div key={cert._id} className="flex items-start justify-between py-3 border-b border-border last:border-0">
            <div>
              <h3 className="font-medium text-foreground">{cert.certificateName}</h3>
              {cert.issuingOrganization && (
                <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
              )}
              {cert.issueDate && (
                <p className="text-xs text-muted-foreground">
                  Issued {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              )}
              {cert.credentialURL && (
                <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                  View credential
                </a>
              )}
            </div>
            <button
              onClick={() => handleDelete(cert._id)}
              className="p-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {certifications.length === 0 && !adding && (
          <p className="text-muted-foreground text-sm italic">No certifications added yet.</p>
        )}
      </div>
    </div>
  );
}
