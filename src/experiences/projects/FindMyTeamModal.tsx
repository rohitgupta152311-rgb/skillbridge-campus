import React, { useState, useMemo } from 'react';
import {
  Sparkles, Users, Rocket, CheckCircle2, ArrowRight,
  UserCheck, ShieldCheck, Star, Award, Search, Send
} from 'lucide-react';
import { Modal, Button, Badge, Avatar } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { getUsers, getProjects } from '../../infrastructure/local-storage/data-service';
import { Project, User } from '../../foundation/types';
import { useToastStore } from '../../shared/notifications/toast-store';

interface FindMyTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (project: Project, positionId: string) => void;
}

export function FindMyTeamModal({ isOpen, onClose, onApply }: FindMyTeamModalProps) {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'match-me' | 'find-talent'>('match-me');

  const allProjects = useMemo(() => getProjects(), [isOpen]);
  const allUsers = useMemo(() => getUsers(), [isOpen]);

  // Current user's skills
  const myOfferedSkillNames = useMemo(
    () => user?.skillsOffered?.map(s => s.skillName.toLowerCase()) || ['react', 'typescript'],
    [user]
  );
  const myWantedSkillNames = useMemo(
    () => user?.skillsWanted?.map(s => s.skillName.toLowerCase()) || ['python', 'machine learning'],
    [user]
  );

  // 1. Projects matched to the student
  const matchedProjects = useMemo(() => {
    return allProjects
      .filter(p => p.status === 'recruiting' && p.openPositions.length > 0)
      .map(p => {
        // Calculate overlap
        const matchingOffered = p.requiredSkills.filter(s =>
          myOfferedSkillNames.some(os => os.includes(s.toLowerCase()) || s.toLowerCase().includes(os))
        );
        const matchingWanted = p.requiredSkills.filter(s =>
          myWantedSkillNames.some(ws => ws.includes(s.toLowerCase()) || s.toLowerCase().includes(ws))
        );

        // Score formula: (offered match * 60) + (learning opportunity * 30) + base 10
        let score = 50;
        if (matchingOffered.length > 0) score += Math.min(35, matchingOffered.length * 20);
        if (matchingWanted.length > 0) score += Math.min(15, matchingWanted.length * 10);
        score = Math.min(98, score);

        // Find best position
        const bestPosition = p.openPositions[0];

        return {
          project: p,
          score,
          matchingOffered,
          matchingWanted,
          bestPosition,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [allProjects, myOfferedSkillNames, myWantedSkillNames]);

  // 2. Selected project for finding talent
  const [selectedProjectId, setSelectedProjectId] = useState<string>(allProjects[0]?.id || '');
  const targetProject = useMemo(
    () => allProjects.find(p => p.id === selectedProjectId) || allProjects[0],
    [allProjects, selectedProjectId]
  );

  // Top candidate students for target project
  const matchedCandidates = useMemo(() => {
    if (!targetProject) return [];

    return allUsers
      .filter(u => u.id !== user?.id)
      .map(candidate => {
        const candidateOffered = candidate.skillsOffered?.map(s => s.skillName.toLowerCase()) || [];
        const matchingSkills = targetProject.requiredSkills.filter(req =>
          candidateOffered.some(co => co.includes(req.toLowerCase()) || req.toLowerCase().includes(co))
        );

        let score = 55;
        score += Math.min(40, matchingSkills.length * 20);
        if (candidate.isVerified) score += 5;
        score = Math.min(98, score);

        return {
          candidate,
          score,
          matchingSkills,
        };
      })
      .filter(item => item.matchingSkills.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [allUsers, targetProject, user?.id]);

  const handleInviteCandidate = (candidate: User) => {
    addToast({
      type: 'success',
      title: 'Team Invitation Sent! ✉️',
      message: `Invited ${candidate.fullName} to join "${targetProject?.title || 'Project'}".`,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
              <span>CIH-008 Algorithmic Team Matchmaker</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Find My Team &amp; Collaborators
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Matches project technical requirements against campus student skill profiles.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('match-me')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'match-me'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Match Me to Projects
            </button>
            <button
              onClick={() => setActiveTab('find-talent')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'find-talent'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find Talent for Project
            </button>
          </div>
        </div>

        {/* TAB 1: MATCH ME TO PROJECTS */}
        {activeTab === 'match-me' && (
          <div className="space-y-4">
            <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-violet-900">
              <div className="flex items-center gap-2">
                <Avatar name={user?.fullName || 'Alex Chen'} src={user?.avatar} size="sm" />
                <span>
                  Matching based on your offered: <strong>{myOfferedSkillNames.slice(0, 3).join(', ')}</strong> &bull; wants to learn: <strong>{myWantedSkillNames.slice(0, 2).join(', ')}</strong>
                </span>
              </div>
              <Badge variant="violet" size="sm">Top {matchedProjects.length} Matches</Badge>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {matchedProjects.map(({ project, score, matchingOffered, bestPosition }) => (
                <div
                  key={project.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-violet-300 hover:shadow-md transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{project.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {project.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2">
                      {project.tagline || project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-400 font-medium">You contribute:</span>
                      {matchingOffered.length > 0 ? (
                        matchingOffered.map(skill => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-xs"
                          >
                            ✓ {skill}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs">
                          Complementary domain
                        </span>
                      )}

                      {bestPosition && (
                        <span className="text-violet-600 font-semibold ml-2">
                          Role: {bestPosition.title}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-black text-violet-700 tracking-tight">
                        {score}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Compatibility
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-violet-600 hover:bg-violet-700 text-white text-xs"
                      onClick={() => {
                        onClose();
                        onApply(project, bestPosition?.id || '');
                      }}
                    >
                      Instant Apply &rarr;
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FIND TALENT FOR PROJECT */}
        {activeTab === 'find-talent' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                Select Initiative:
              </label>
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="w-full sm:w-auto text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
              >
                {allProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {matchedCandidates.map(({ candidate, score, matchingSkills }) => (
                <div
                  key={candidate.id}
                  className="p-4 rounded-2xl border border-slate-200/90 hover:border-violet-300 hover:shadow-sm transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar name={candidate.fullName} src={candidate.avatar} size="md" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{candidate.fullName}</span>
                        {candidate.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        )}
                        <span className="text-[11px] text-slate-500">
                          {candidate.department} &bull; {candidate.year}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500">{candidate.headline}</p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">Matching skills:</span>
                        {matchingSkills.map(sk => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-semibold"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-600 tracking-tight">
                        {score}%
                      </div>
                      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                        Fit Score
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-violet-700 border-violet-200 hover:bg-violet-50"
                      onClick={() => handleInviteCandidate(candidate)}
                    >
                      Invite to Team
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Matchmaker
          </Button>
        </div>
      </div>
    </Modal>
  );
}
