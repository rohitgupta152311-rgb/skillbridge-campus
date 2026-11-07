import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Search, ArrowRight, Sparkles, Target } from 'lucide-react';
import { Card, Badge, Button, Input, Avatar, StarRating, EmptyState } from '../../shared/components';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { computeMatchScores, getAllMentorProfiles } from '../../domain/matching-engine';
import { ALL_TOPICS, DAYS_OF_WEEK, LANGUAGES } from '../../foundation/constants';
import { getMatchScoreLabel, getDayName } from '../../foundation/helpers';
import type { DayOfWeek, LearningPreference, MentorProfile, MatchingCriteria } from '../../foundation/types';

export function SmartMatchingPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [language, setLanguage] = useState('');
  const [preferences, setPreferences] = useState<LearningPreference[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<(MentorProfile & { matchScore: number; matchReasons: string[]; topicRelevance: number; availabilityScore: number; ratingScore: number })[]>([]);

  const allProfiles = useMemo(() => getAllMentorProfiles(), []);

  const handleSearch = () => {
    if (!topic.trim()) return;
    const criteria: MatchingCriteria = {
      topic: topic.trim(),
      preferredDays: selectedDays.length > 0 ? selectedDays : undefined,
      preferredLanguage: language || undefined,
      learningPreferences: preferences.length > 0 ? preferences : undefined,
      minimumRating: minRating || undefined,
    };
    const matches = computeMatchScores(criteria, user?.id);
    const enriched = matches.map(m => {
      const profile = allProfiles.find(p => p.id === m.mentorId);
      return profile ? { ...profile, matchScore: m.matchScore, matchReasons: m.reasons, topicRelevance: m.topicRelevance, availabilityScore: m.availabilityScore, ratingScore: m.ratingScore } : null;
    }).filter(Boolean) as typeof results;
    setResults(enriched);
    setHasSearched(true);
  };

  const toggleDay = (d: DayOfWeek) => setSelectedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const togglePref = (p: LearningPreference) => setPreferences(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  return (
    <div className="space-y-6 pb-20 lg:pb-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-6 h-6 text-violet-600" /> Smart Matching</h1>
        <p className="text-slate-500 mt-1">Tell us what you need, and our algorithm will find the best mentors for you.</p>
      </div>

      {/* Search Form */}
      <Card padding="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">What do you want to learn?</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input placeholder="e.g., ReactJS, Machine Learning, Data Structures..." value={topic} onChange={e => setTopic(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />} />
              </div>
              <Button onClick={handleSearch} leftIcon={<Brain className="w-4 h-4" />}>Find Matches</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {['ReactJS', 'Python', 'Machine Learning', 'Data Structures', 'Web Development', 'Digital Electronics'].map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${topic === t ? 'bg-violet-50 border-violet-300 text-violet-700' : 'border-slate-200 text-slate-500 hover:border-violet-200'}`}>{t}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Days</label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map(d => (
                  <button key={d} onClick={() => toggleDay(d)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedDays.includes(d) ? 'bg-violet-50 border-violet-300 text-violet-700' : 'border-slate-200 text-slate-500 hover:border-violet-200'}`}>{getDayName(d)}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Learning Preference</label>
              <div className="flex flex-wrap gap-2">
                {(['visual', 'auditory', 'reading', 'kinesthetic'] as LearningPreference[]).map(p => (
                  <button key={p} onClick={() => togglePref(p)}
                    className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${preferences.includes(p) ? 'bg-violet-50 border-violet-300 text-violet-700' : 'border-slate-200 text-slate-500 hover:border-violet-200'}`}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="">Any</option>
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Rating</label>
              <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={minRating} onChange={e => setMinRating(Number(e.target.value))}>
                <option value={0}>Any</option>
                {[4, 3, 2].map(r => <option key={r} value={r}>{r}+ stars</option>)}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Algorithm explanation */}
      <Card>
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-600">
            <strong className="text-slate-900">How matching works:</strong> We score mentors using a weighted algorithm — Topic Relevance (35%), Schedule Compatibility (25%), Mentor Rating (20%), Skill Proficiency (10%), and Learning Preferences (10%). Mentors with zero topic relevance are excluded.
          </div>
        </div>
      </Card>

      {/* Results */}
      {hasSearched && (
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">{results.length} Match{results.length !== 1 ? 'es' : ''} Found</h2>
          {results.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No exact peer matches found for "{topic}"</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Try broadening your search criteria or explore trending engineering topics offered by campus peers.
                </p>
              </div>

              {/* Suggestions */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Try Searching These Active Topics
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {['ReactJS', 'Python', 'Machine Learning', 'Power Electronics', 'Data Structures', 'Circuit Analysis', 'VLSI'].map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setTopic(t);
                        setMinRating(0);
                        setLanguage('');
                        setSelectedDays([]);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-slate-100 hover:bg-violet-50 hover:text-violet-700 text-slate-700 font-medium transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMinRating(0);
                    setLanguage('');
                    setSelectedDays([]);
                    setPreferences([]);
                    handleSearch();
                  }}
                  className="text-xs font-semibold"
                >
                  Reset All Filters
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/exchange')}
                  className="bg-slate-900 text-white text-xs font-semibold"
                >
                  Post to Skill Exchange Hub &rarr;
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/explore')}
                  className="text-xs font-semibold text-slate-700"
                >
                  Browse Full Campus Directory
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((mentor, idx) => {
                const scoreInfo = getMatchScoreLabel(mentor.matchScore);
                return (
                  <Card key={mentor.id} hover onClick={() => navigate(`/discover/${mentor.id}`)}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <Avatar name={mentor.fullName} size="lg" showStatus status={mentor.onlineStatus} />
                          {idx < 3 && (
                            <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 text-[10px] font-bold text-white flex items-center justify-center">#{idx + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{mentor.fullName}</p>
                          <p className="text-sm text-slate-500">{mentor.department} · {mentor.year}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {mentor.expertise.slice(0, 3).map(e => <Badge key={e.id} variant="violet">{e.topic}</Badge>)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {/* Score breakdown */}
                        <div className="hidden md:grid grid-cols-3 gap-3 text-center">
                          <div><p className="text-xs text-slate-400">Topic</p><p className="text-sm font-bold text-slate-700">{mentor.topicRelevance}%</p></div>
                          <div><p className="text-xs text-slate-400">Avail</p><p className="text-sm font-bold text-slate-700">{mentor.availabilityScore}%</p></div>
                          <div><p className="text-xs text-slate-400">Rating</p><p className="text-sm font-bold text-slate-700">{mentor.ratingScore}%</p></div>
                        </div>

                        <div className="text-center min-w-[70px]">
                          <div className="relative w-14 h-14 mx-auto">
                            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#7c3aed" strokeWidth="3"
                                strokeDasharray={`${mentor.matchScore}, 100`} strokeLinecap="round" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-900">{mentor.matchScore}%</span>
                          </div>
                          <p className={`text-xs font-medium mt-1 ${scoreInfo.color}`}>{scoreInfo.label}</p>
                        </div>

                        <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/discover/${mentor.id}`); }} rightIcon={<ArrowRight className="w-4 h-4" />}>
                          View
                        </Button>
                      </div>
                    </div>
                    {mentor.matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                        {mentor.matchReasons.map((r, i) => <span key={i} className="text-xs text-emerald-600">✓ {r}</span>)}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
