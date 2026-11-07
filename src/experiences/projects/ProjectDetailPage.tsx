import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Rocket, Users, Calendar, Clock, Code,
  ExternalLink, CheckCircle2, Circle, AlertCircle, Plus,
  ShieldCheck, Send, MessageSquare, ThumbsUp
} from 'lucide-react';
import { Card, Button, Badge, Avatar, Modal } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import {
  getProjectById, getProjectApplications, applyToProject, respondToApplication
} from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';
import { Project, ProjectApplication } from '../../foundation/types';

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'roles' | 'milestones' | 'applications'>('overview');

  // Apply modal
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [applyPitch, setApplyPitch] = useState('');
  const [applySkills, setApplySkills] = useState('');

  const project = useMemo(() => {
    if (!id) return undefined;
    return getProjectById(id);
  }, [id, refreshKey]);

  const applications = useMemo(() => {
    if (!id) return [];
    return getProjectApplications(id);
  }, [id, refreshKey]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 animate-fade-in">
        <Rocket className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-sm text-slate-500">The project may have concluded or been removed.</p>
        <Link to="/projects">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to ProjectSpace
          </Button>
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === project.ownerId;
  const myApplication = applications.find(a => a.applicantId === user?.id);

  const handleOpenApply = (posId?: string) => {
    setSelectedPositionId(posId || (project.openPositions[0]?.id ?? ''));
    setApplyPitch('');
    setApplySkills(user?.skillsOffered?.map(s => s.skillName).join(', ') || 'React, TypeScript');
    setIsApplyOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const chosenPos = project.openPositions.find(p => p.id === selectedPositionId);
    if (!chosenPos) {
      addToast({ type: 'error', title: 'Please select an open position' });
      return;
    }

    applyToProject({
      projectId: project.id,
      projectTitle: project.title,
      applicantId: user.id,
      applicantName: user.fullName,
      applicantAvatar: user.avatar,
      applicantDepartment: user.department,
      applicantYear: user.year,
      appliedPositionId: chosenPos.id,
      appliedPositionTitle: chosenPos.title,
      pitch: applyPitch || 'Excited to contribute complementary technical capabilities to this initiative.',
      relevantSkills: (applySkills || '').split(',').map(s => s.trim()).filter(Boolean),
    });

    addToast({
      type: 'success',
      title: 'Application Submitted! 🚀',
      message: `Project owner will review your application for "${chosenPos.title}".`,
    });

    setIsApplyOpen(false);
    setRefreshKey(k => k + 1);
  };

  const handleApprove = (appId: string) => {
    respondToApplication(appId, 'accepted');
    addToast({
      type: 'success',
      title: 'Applicant Accepted! 🎉',
      message: 'New contributor has been added to the project roster.',
    });
    setRefreshKey(k => k + 1);
  };

  const handleDecline = (appId: string) => {
    respondToApplication(appId, 'rejected');
    addToast({
      type: 'info',
      title: 'Application Declined',
      message: 'Applicant has been notified.',
    });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in pb-20">
      {/* ── BACK NAV ── */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all projects
        </Link>

        {isOwner && (
          <span className="text-xs font-bold text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
            You are the Project Lead
          </span>
        )}
      </div>

      {/* ── PROJECT HERO BANNER ── */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="violet" size="sm">{project.category}</Badge>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                project.status === 'recruiting'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {project.status === 'recruiting' ? 'Active & Recruiting' : 'In Progress'}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Est. {project.estimatedDuration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {project.tagline}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                Repository
              </a>
            )}

            {!isOwner && project.status === 'recruiting' && (
              <Button
                variant="primary"
                size="md"
                className="bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/20"
                onClick={() => handleOpenApply()}
              >
                Apply to Collaborate
              </Button>
            )}
          </div>
        </div>

        {/* Existing Application Notice */}
        {myApplication && (
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-violet-900">
                  You applied for "{myApplication.appliedPositionTitle}"
                </p>
                <p className="text-[11px] text-violet-700">
                  Status: <strong className="capitalize">{myApplication.status}</strong> • Pitch: "{myApplication.pitch}"
                </p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              myApplication.status === 'accepted'
                ? 'bg-emerald-100 text-emerald-800'
                : myApplication.status === 'rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {myApplication.status}
            </span>
          </div>
        )}

        {/* Project Meta Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Project Lead</p>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={project.ownerName} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{project.ownerName}</p>
                <p className="text-[10px] text-slate-500 truncate">{project.ownerDepartment}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Team Capacity</p>
            <p className="text-sm font-bold text-slate-800 mt-1">
              {project.currentMembers.length} / {project.teamSizeMax} Members
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Open Positions</p>
            <p className="text-sm font-bold text-violet-700 mt-1">
              {project.openPositions.reduce((acc, p) => acc + p.spots, 0)} available
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Campus Institution</p>
            <p className="text-xs font-semibold text-slate-700 mt-1 truncate">
              {project.ownerUniversity}
            </p>
          </div>
        </div>
      </div>

      {/* ── TABS NAVIGATION ── */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Project Overview' },
          { id: 'roles', label: `Open Positions (${project.openPositions.length})` },
          { id: 'milestones', label: `Roadmap (${project.milestones.length})` },
          ...(isOwner || applications.length > 0 ? [{ id: 'applications', label: `Applications (${applications.length})` }] : []),
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            <Card padding="lg" className="border border-slate-200 space-y-4">
              <h2 className="text-base font-bold text-slate-900">About the Project & Problem Statement</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </Card>

            {/* Current Team Members */}
            <Card padding="lg" className="border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Team Roster</h2>
                <span className="text-xs text-slate-500 font-semibold">
                  {project.currentMembers.length} active contributors
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {project.currentMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center gap-3"
                  >
                    <Avatar name={member.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                      <p className="text-[11px] text-violet-600 font-semibold truncate">{member.role}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.skills.map(s => (
                          <span key={s} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Required Skills & Quick Connect */}
          <div className="lg:col-span-4 space-y-6">
            <Card padding="lg" className="border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-violet-50 text-violet-800 border border-violet-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            <Card padding="lg" className="border border-slate-200 space-y-3 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Rocket className="w-4 h-4 text-violet-400" />
                Want to partner on this?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with {project.ownerName} to discuss technical architecture or collaborate.
              </p>
              <Link to="/messages">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Message Project Lead
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}

      {/* ── OPEN ROLES TAB ── */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.openPositions.map((pos) => (
              <Card key={pos.id} padding="lg" className="border border-slate-200 space-y-4 hover:border-violet-300 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{pos.title}</h3>
                    <p className="text-xs text-violet-600 font-semibold mt-0.5">
                      {pos.spots} open spot{pos.spots > 1 ? 's' : ''} remaining
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs"
                    onClick={() => handleOpenApply(pos.id)}
                  >
                    Apply for Role
                  </Button>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Required Complementary Skills:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {pos.requiredSkills.map(skill => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── MILESTONES ROADMAP TAB ── */}
      {activeTab === 'milestones' && (
        <Card padding="lg" className="border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Project Delivery Milestones</h2>
          <div className="space-y-3">
            {project.milestones.map((milestone, idx) => (
              <div
                key={milestone.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                {milestone.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${
                    milestone.isCompleted ? 'text-slate-800 line-through' : 'text-slate-900'
                  }`}>
                    {milestone.title}
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  milestone.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {milestone.isCompleted ? 'Done' : 'Target'}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── APPLICATIONS TAB ── */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Candidate Applications</h2>
            <span className="text-xs text-slate-500 font-semibold">{applications.length} applications logged</span>
          </div>

          {applications.length === 0 ? (
            <Card padding="lg" className="border border-slate-200 text-center py-12 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No applications received yet</p>
              <p className="text-xs text-slate-500">Students applying to this project will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Card key={app.id} padding="lg" className="border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={app.applicantName} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{app.applicantName}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            app.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Applied for: <strong className="text-violet-700">{app.appliedPositionTitle}</strong> • {app.applicantDepartment} ({app.applicantYear})
                        </p>
                      </div>
                    </div>

                    {isOwner && app.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-rose-600 hover:bg-rose-50"
                          onClick={() => handleDecline(app.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="text-xs bg-emerald-600 hover:bg-emerald-500"
                          onClick={() => handleApprove(app.id)}
                        >
                          Accept to Team
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <span className="font-semibold text-slate-900">Applicant Pitch: </span>
                    "{app.pitch}"
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-400">Offered Skills:</span>
                    {app.relevantSkills.map(skill => (
                      <span key={skill} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── APPLY MODAL ── */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title={`Apply to Join "${project.title}"`}
        size="md"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Open Position:
            </label>
            <select
              value={selectedPositionId}
              onChange={e => setSelectedPositionId(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white focus:border-violet-500 focus:outline-none"
            >
              {project.openPositions.map(pos => (
                <option key={pos.id} value={pos.id}>
                  {pos.title} ({pos.spots} spot{pos.spots > 1 ? 's' : ''} left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Complementary Skills (comma separated):
            </label>
            <input
              type="text"
              value={applySkills}
              onChange={e => setApplySkills(e.target.value)}
              placeholder="e.g. ReactJS, TypeScript, Tailwind CSS"
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:border-violet-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Brief Pitch / Why are you a great match for this role?
            </label>
            <textarea
              value={applyPitch}
              onChange={e => setApplyPitch(e.target.value)}
              rows={3}
              placeholder="Share how your background fits this role and what you want to achieve..."
              className="w-full text-sm border border-slate-300 rounded-xl p-2.5 focus:border-violet-500 focus:outline-none resize-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsApplyOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
