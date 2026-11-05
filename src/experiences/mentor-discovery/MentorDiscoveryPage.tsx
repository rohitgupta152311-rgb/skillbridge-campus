import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, MapPin, Globe, ChevronDown } from 'lucide-react';
import { Card, Avatar, Badge, Button, StarRating, Input, EmptyState } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { computeMatchScores, getAllMentorProfiles } from '../../domain/matching-engine';
import { getMatchScoreLabel, formatTime, getDayName } from '../../foundation/helpers';
import { ALL_TOPICS, LANGUAGES, DAYS_OF_WEEK, DAY_LABELS } from '../../foundation/constants';
import type { FilterOptions, MentorProfile, SessionType, DayOfWeek } from '../../foundation/types';

export function MentorDiscoveryPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: 'match', sortOrder: 'desc' });

  const allProfiles = useMemo(() => getAllMentorProfiles(), []);

  const enrichedProfiles = useMemo(() => {
    const topic = search || filters.subject || '';
    if (topic) {
      const matches = computeMatchScores({ topic, preferredDays: filters.availableDay ? [filters.availableDay] : undefined, preferredLanguage: filters.language, preferredSessionType: filters.sessionType }, user?.id);
      return matches.map(m => {
        const profile = allProfiles.find(p => p.id === m.mentorId);
        return profile ? { ...profile, matchScore: m.matchScore, matchReasons: m.reasons } : null;
      }).filter(Boolean) as (MentorProfile & { matchScore: number; matchReasons: string[] })[];
    }
    return allProfiles.map(p => ({ ...p, matchScore: 0, matchReasons: [] as string[] }));
  }, [search, filters, allProfiles, user]);

  const filtered = useMemo(() => {
    let result = [...enrichedProfiles];
    if (filters.minRating) result = result.filter(m => m.averageRating >= filters.minRating!);
    if (filters.availableDay) result = result.filter(m => m.availability.some(a => a.dayOfWeek === filters.availableDay));
    if (filters.language) result = result.filter(m => m.languages.some(l => l.toLowerCase() === filters.language!.toLowerCase()));

    const { sortBy = 'match', sortOrder = 'desc' } = filters;
    result.sort((a, b) => {
      let diff = 0;
      if (sortBy === 'match') diff = (a.matchScore || 0) - (b.matchScore || 0);
      else if (sortBy === 'rating') diff = a.averageRating - b.averageRating;
      else if (sortBy === 'sessions') diff = a.completedSessions - b.completedSessions;
      else diff = a.fullName.localeCompare(b.fullName);
      return sortOrder === 'desc' ? -diff : diff;
    });
    return result;
  }, [enrichedProfiles, filters]);

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discover Mentors</h1>
        <p className="text-slate-500 mt-1">Find the perfect mentor for your learning goals.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Search by topic, skill, or mentor name..." value={search}
            onChange={e => setSearch(e.target.value)} leftIcon={<Search className="w-4 h-4" />} />
        </div>
        <Button variant={showFilters ? 'primary' : 'outline'} leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setShowFilters(!showFilters)}>Filters</Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={filters.subject || ''} onChange={e => setFilters(f => ({ ...f, subject: e.target.value }))}>
                <option value="">All Subjects</option>
                {ALL_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Min Rating</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={filters.minRating || ''} onChange={e => setFilters(f => ({ ...f, minRating: e.target.value ? Number(e.target.value) : undefined }))}>
                <option value="">Any</option>
                {[4, 3, 2].map(r => <option key={r} value={r}>{r}+ stars</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Available Day</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={filters.availableDay || ''} onChange={e => setFilters(f => ({ ...f, availableDay: e.target.value as DayOfWeek || undefined }))}>
                <option value="">Any Day</option>
                {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Language</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                value={filters.language || ''} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}>
                <option value="">Any</option>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500">Sort by:</span>
            {(['match', 'rating', 'sessions', 'name'] as const).map(s => (
              <button key={s} onClick={() => setFilters(f => ({ ...f, sortBy: s }))}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${filters.sortBy === s ? 'bg-violet-100 text-violet-700' : 'text-slate-500 hover:bg-slate-100'}`}>
                {s === 'match' ? 'Match %' : s === 'rating' ? 'Rating' : s === 'sessions' ? 'Experience' : 'Name'}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState title="No mentors found" description="Try adjusting your search or filters." icon={<Search className="w-8 h-8" />} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(mentor => {
            const scoreInfo = mentor.matchScore > 0 ? getMatchScoreLabel(mentor.matchScore) : null;
            return (
              <Card key={mentor.id} hover onClick={() => navigate(`/discover/${mentor.id}`)}>
                <div className="flex items-start gap-3 mb-3">
                  <Avatar name={mentor.fullName} size="lg" showStatus status={mentor.onlineStatus} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{mentor.fullName}</p>
                    <p className="text-sm text-slate-500">{mentor.department}</p>
                    <p className="text-xs text-violet-600 font-medium">{mentor.year}</p>
                  </div>
                  {scoreInfo && (
                    <div className="text-right">
                      <p className={`text-lg font-bold ${scoreInfo.color}`}>{mentor.matchScore}%</p>
                      <p className="text-[10px] text-slate-400">match</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {mentor.expertise.slice(0, 3).map(e => <Badge key={e.id} variant="violet">{e.topic}</Badge>)}
                  {mentor.expertise.length > 3 && <Badge>+{mentor.expertise.length - 3}</Badge>}
                </div>
                {mentor.matchReasons.length > 0 && (
                  <p className="text-xs text-emerald-600 mb-2">✓ {mentor.matchReasons[0]}</p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <StarRating rating={mentor.averageRating} size="sm" />
                    <span className="text-sm font-medium text-slate-700 ml-1">{mentor.averageRating || 'New'}</span>
                    <span className="text-xs text-slate-400">({mentor.totalReviews})</span>
                  </div>
                  <span className="text-xs text-slate-500">{mentor.completedSessions} sessions</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
