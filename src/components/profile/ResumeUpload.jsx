import { useState } from "react";
import { apiUpload } from "../../api/client";
import { FileText, Upload, Download, ExternalLink } from "lucide-react";

export default function ResumeUpload({ profile, onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      alert('Only PDF and Word documents are allowed');
      return;
    }
    setUploading(true);
    try {
      await apiUpload('/profile/resume', file, 'resume');
      onUpdate?.();
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const resumeURL = profile?.resumeURL;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Resume</h2>
        <label className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90 disabled:opacity-50">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : resumeURL ? "Replace" : "Upload"}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      {resumeURL ? (
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-input/10">
          <FileText className="h-12 w-12 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">Resume uploaded</p>
            <div className="mt-2 flex gap-3">
              <a
                href={resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Preview
              </a>
              <a
                href={resumeURL}
                download
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Download className="h-4 w-4" /> Download
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-sm mb-2">No resume uploaded</p>
          <p className="text-muted-foreground text-xs mb-4">PDF or Word document, max 5MB</p>
          <label className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground cursor-pointer hover:bg-primary/90">
            {uploading ? "Uploading..." : "Upload resume"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
