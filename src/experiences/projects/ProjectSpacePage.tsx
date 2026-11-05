import { FindMyTeamModal } from './FindMyTeamModal';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket, Users, Search, Plus, Filter, ArrowRight,
  Sparkles, CheckCircle2, Clock, Code2, Cpu, Globe,
  ShieldCheck, Layers, Briefcase, ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, Avatar, Modal, Input, Textarea } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import {
  getProjects, addProject, applyToProject, getProjectApplications
} from '../../infrastructure/local-storage/data-service';
import { useToastStore } from '../../shared/notifications/toast-store';
import { Project, ProjectOpenPosition } from '../../foundation/types';

const CATEGORIES = [
  'All',
  'IoT & Hardware',
  'AI & Machine Learning',
  'Web & Cloud',
  'Mobile Apps',
  'Cybersecurity',
  'EdTech & SaaS'
];

export function ProjectSpacePage() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'recruiting' | 'active'>('all');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFindTeamOpen, setIsFindTeamOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<Project | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<string>('');

  // Application form state
  const [applyPitch, setApplyPitch] = useState('');
  const [applySkills, setApplySkills] = useState('');

  // Create project form state
  const [newProject, setNewProject] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'IoT & Hardware',
    teamSizeMax: 4,
    estimatedDuration: '8 Weeks',
    requiredSkills: '',
    repoUrl: '',
    positions: [
      { title: 'Frontend Lead', skills: 'React, TypeScript', spots: 1 },
      { title: 'Backend / Systems Engineer', skills: 'Python, FastAPI', spots: 1 },
    ],
  });

  const projects = useMemo(() => {
    return getProjects();
  }, [refreshKey]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      const matchesStatus =
        selectedStatus === 'all' || p.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  const handleOpenApply = (proj: Project, posId?: string) => {
    setSelectedProjectForApply(proj);
    setSelectedPositionId(posId || (proj.openPositions[0]?.id ?? ''));
    setApplyPitch('');
    setApplySkills(user?.skillsOffered?.map(s => s.skillName).join(', ') || 'React, TypeScript');
    setIsApplyOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProjectForApply) return;

    const chosenPos = selectedProjectForApply.openPositions.find(p => p.id === selectedPositionId);
    if (!chosenPos) {
      addToast({ type: 'error', title: 'Please select an open position' });
      return;
    }

    applyToProject({
      projectId: selectedProjectForApply.id,
      projectTitle: selectedProjectForApply.title,
      applicantId: user.id,
      applicantName: user.fullName,
      applicantAvatar: user.avatar,
      applicantDepartment: user.department,
      applicantYear: user.year,
      appliedPositionId: chosenPos.id,
      appliedPositionTitle: chosenPos.title,
      pitch: applyPitch || 'I would love to contribute my complementary technical skills to this campus initiative.',
      relevantSkills: applySkills.split(',').map(s => s.trim()).filter(Boolean),
    });

    addToast({
      type: 'success',
      title: 'Application Sent! 🚀',
      message: `You applied for ${chosenPos.title} on ${selectedProjectForApply.title}.`,
    });

    setIsApplyOpen(false);
    setRefreshKey(k => k + 1);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newProject.title.trim() || !newProject.description.trim()) {
      addToast({ type: 'error', title: 'Please fill in title and description' });
      return;
    }

    const openPositions: ProjectOpenPosition[] = newProject.positions.map((pos, idx) => ({
      id: `pos-${Date.now()}-${idx}`,
      title: pos.title,
      requiredSkills: pos.skills.split(',').map(s => s.trim()).filter(Boolean),
      spots: Number(pos.spots) || 1,
    }));

    addProject({
      title: newProject.title.trim(),
      tagline: newProject.tagline.trim() || newProject.title,
      description: newProject.description.trim(),
      category: newProject.category,
      ownerId: user.id,
      ownerName: user.fullName,
      ownerAvatar: user.avatar,
      ownerDepartment: user.department,
      ownerUniversity: user.university || 'State Technological University',
      status: 'recruiting',
      teamSizeMax: Number(newProject.teamSizeMax) || 4,
      currentMembers: [
        {
          userId: user.id,
          name: user.fullName,
          avatar: user.avatar,
          role: 'Project Creator & Lead',
          skills: user.skillsOffered?.map(s => s.skillName) || ['Architecture'],
        },
      ],
      openPositions,
      requiredSkills: newProject.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      estimatedDuration: newProject.estimatedDuration,
      repoUrl: newProject.repoUrl.trim() || undefined,
      milestones: [
        { id: 'm1', title: 'Architecture & MVP Spec', isCompleted: true },
        { id: 'm2', title: 'Alpha Prototype Development', isCompleted: false },
        { id: 'm3', title: 'Campus Beta Launch', isCompleted: false },
      ],
    });

    addToast({
      type: 'success',
      title: 'Project Space Created! 🎉',
      message: `Your initiative "${newProject.title}" is now recruiting campus peers.`,
    });

    setIsCreateOpen(false);
    setRefreshKey(k => k + 1);
  };

  const addPositionField = () => {
    setNewProject({
      ...newProject,
      positions: [
        ...newProject.positions,
        { title: '', skills: '', spots: 1 },
      ],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-950 text-white p-8 lg:p-10 shadow-xl border border-white/10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold">
            <Rocket className="w-3.5 h-3.5 text-violet-400" />
            <span>ProjectSpace Collaborative Campus Incubator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Find Your Team, Build Real Projects, & Level Up Together.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Turn academic concepts and hackathon ideas into functional software & hardware systems.
            List your project, recruit complementary skill sets, or apply to join an active team.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              className="bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30"
              onClick={() => setIsCreateOpen(true)}
            >
              Launch a Project
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4 text-violet-600" />}
              className="bg-white text-slate-900 hover:bg-slate-50 font-bold shadow-md border border-slate-200"
              onClick={() => setIsFindTeamOpen(true)}
            >
              Find My Team
            </Button>
            <Link to="/exchange">
              <Button
                variant="outline"
                size="md"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
                leftIcon={<Sparkles className="w-4 h-4 text-violet-300" />}
              >
                1-on-1 Skill Exchange
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Grid Effect */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-violet-500/10 to-transparent pointer-events-none" />
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, stack (React, ESP32, Python)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/10 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* ── PROJECTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const spotsLeft = project.openPositions.reduce((acc, p) => acc + p.spots, 0);
          const maxMembers = project.teamSizeMax || project.teamSize || 4;
          const percentFilled = Math.min(100, Math.round((project.currentMembers.length / maxMembers) * 100));

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-violet-300 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                {/* Header Tag & Status */}
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="violet" size="sm" className="font-semibold text-[11px]">
                    {project.category}
                  </Badge>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    project.status === 'recruiting'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status === 'recruiting' ? `Recruiting (${spotsLeft} open)` : 'Active'}
                  </span>
                </div>

                {/* Project Title & Tagline */}
                <div>
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1"
                  >
                    {project.title}
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {project.tagline}
                  </p>
                </div>

                {/* Team Capacity Progress Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="font-medium flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      Team: {project.currentMembers.length} / {project.teamSizeMax} Members
                    </span>
                    <span className="text-violet-600 font-bold">{percentFilled}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Open Positions List */}
                {project.openPositions.length > 0 && (
                  <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-violet-900">
                      Seeking Roles:
                    </p>
                    <div className="space-y-1.5">
                      {project.openPositions.slice(0, 2).map((pos) => (
                        <div key={pos.id} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-800 truncate pr-2">
                            • {pos.title}
                          </span>
                          <span className="text-[10px] font-bold text-violet-700 bg-violet-200/60 px-1.5 py-0.5 rounded">
                            {pos.spots} spot{pos.spots > 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {project.requiredSkills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.requiredSkills.length > 4 && (
                    <span className="text-[11px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md">
                      +{project.requiredSkills.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Owner Info & Action Buttons */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={project.ownerName} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {project.ownerName}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {project.ownerDepartment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="ghost" size="sm" className="text-xs font-semibold">
                      Details
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    className="text-xs font-semibold"
                    onClick={() => handleOpenApply(project)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try tweaking your search keywords or category filters, or be the first to launch an initiative!
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Launch Project
          </Button>
        </div>
      )}

      {/* ── APPLY TO PROJECT MODAL ── */}
      <Modal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        title={selectedProjectForApply ? `Apply to "${selectedProjectForApply.title}"` : 'Apply to Project'}
        size="md"
      >
        {selectedProjectForApply && (
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
                {selectedProjectForApply.openPositions.map(pos => (
                  <option key={pos.id} value={pos.id}>
                    {pos.title} ({pos.spots} spot{pos.spots > 1 ? 's' : ''} left) – Required: {pos.requiredSkills.join(', ')}
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
                Brief Pitch / Why do you want to collaborate?
              </label>
              <textarea
                value={applyPitch}
                onChange={e => setApplyPitch(e.target.value)}
                rows={3}
                placeholder="Share your experience, what you hope to build, and why you're excited about this initiative..."
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
        )}
      </Modal>

      {/* ── CREATE PROJECT MODAL ── */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Launch a Project on ProjectSpace"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              value={newProject.title}
              onChange={e => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="e.g. AgriPulse IoT Sensor Hub"
              required
            />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                value={newProject.category}
                onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Short Tagline"
            value={newProject.tagline}
            onChange={e => setNewProject({ ...newProject, tagline: e.target.value })}
            placeholder="A single sentence explaining what your project does"
          />

          <Textarea
            label="Project Description & Vision"
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
            rows={3}
            placeholder="Explain the problem you are solving, technical architecture, and project goals..."
            required
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Max Team Size</label>
              <input
                type="number"
                min={2}
                max={10}
                value={newProject.teamSizeMax}
                onChange={e => setNewProject({ ...newProject, teamSizeMax: Number(e.target.value) })}
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Est. Duration</label>
              <input
                type="text"
                value={newProject.estimatedDuration}
                onChange={e => setNewProject({ ...newProject, estimatedDuration: e.target.value })}
                placeholder="e.g. 8 Weeks, 1 Semester"
                className="w-full text-sm border border-slate-300 rounded-xl p-2.5 bg-white"
              />
            </div>
            <Input
              label="Repository URL (Optional)"
              value={newProject.repoUrl}
              onChange={e => setNewProject({ ...newProject, repoUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <Input
            label="Tech Stack Required (comma separated)"
            value={newProject.requiredSkills}
            onChange={e => setNewProject({ ...newProject, requiredSkills: e.target.value })}
            placeholder="e.g. React, TypeScript, Python, PyTorch, Docker"
          />

          {/* Open Positions Section */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Open Positions Needed
              </label>
              <button
                type="button"
                onClick={addPositionField}
                className="text-xs text-violet-600 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Role
              </button>
            </div>

            {newProject.positions.map((pos, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 grid sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Role Title (e.g. ML Yield Modeler)"
                    value={pos.title}
                    onChange={e => {
                      const updated = [...newProject.positions];
                      updated[idx].title = e.target.value;
                      setNewProject({ ...newProject, positions: updated });
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                    required
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    placeholder="Skills (e.g. Scikit-learn, Pandas)"
                    value={pos.skills}
                    onChange={e => {
                      const updated = [...newProject.positions];
                      updated[idx].skills = e.target.value;
                      setNewProject({ ...newProject, positions: updated });
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Spots"
                    value={pos.spots}
                    onChange={e => {
                      const updated = [...newProject.positions];
                      updated[idx].spots = Number(e.target.value);
                      setNewProject({ ...newProject, positions: updated });
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Launch Project Space
            </Button>
          </div>
        </form>
      </Modal>
      {/* ── FIND MY TEAM ALGORITHMIC MATCHMAKER MODAL ── */}
      <FindMyTeamModal
        isOpen={isFindTeamOpen}
        onClose={() => setIsFindTeamOpen(false)}
        onApply={(proj, posId) => handleOpenApply(proj, posId)}
      />
    </div>
  );
}
