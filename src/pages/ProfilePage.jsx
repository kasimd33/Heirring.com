import { useState, useEffect } from "react";
import { apiFetch } from "../api/client";
import ProfileHeader from "../components/profile/ProfileHeader";
import AboutSection from "../components/profile/AboutSection";
import SkillsSection from "../components/profile/SkillsSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import EducationSection from "../components/profile/EducationSection";
import CertificationSection from "../components/profile/CertificationSection";
import ProjectsSection from "../components/profile/ProjectsSection";
import ResumeUpload from "../components/profile/ResumeUpload";
import JobPreferences from "../components/profile/JobPreferences";
import ApplicationActivity from "../components/profile/ApplicationActivity";
import SavedJobs from "../components/profile/SavedJobs";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, completionRes, applicationsRes] = await Promise.all([
        apiFetch("/profile"),
        apiFetch("/profile/completion"),
        apiFetch("/profile/applications"),
      ]);
      setProfile(profileRes.data);
      setCompletion(completionRes.data);
      setApplications(applicationsRes.data || []);
    } catch (err) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Build your professional profile to stand out to recruiters
        </p>
      </div>

      <ProfileHeader profile={profile} completion={completion} onUpdate={loadData} />
      <AboutSection profile={profile} onUpdate={loadData} />
      <SkillsSection profile={profile} onUpdate={loadData} />
      <ExperienceSection profile={profile} onUpdate={loadData} />
      <EducationSection profile={profile} onUpdate={loadData} />
      <CertificationSection profile={profile} onUpdate={loadData} />
      <ProjectsSection profile={profile} onUpdate={loadData} />
      <ResumeUpload profile={profile} onUpdate={loadData} />
      <JobPreferences profile={profile} onUpdate={loadData} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ApplicationActivity applications={applications} />
        <SavedJobs onRefresh={loadData} />
      </div>
    </div>
  );
}
