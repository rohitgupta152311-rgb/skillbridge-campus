import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, Image, Code, Award, HelpCircle, Briefcase, ThumbsUp,
  MessageSquare, Share2, Bookmark, Send, Users, TrendingUp,
  Calendar, ExternalLink, Filter, MoreHorizontal, ArrowLeftRight,
  Rocket, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../../identity/authentication/auth-store';
import { Avatar, Badge, Button, Card, StarRating } from '../../shared/components';
import { apiClient } from '../../infrastructure/api/api-client';
import { getAllMentorProfiles } from '../../domain/matching-engine';
import {
  calculateSkillExchangeMatches, getProjects
} from '../../infrastructure/local-storage/data-service';
import { formatRelativeTime } from '../../foundation/helpers';
import { useToastStore } from '../../shared/notifications/toast-store';
import { Post, PostType } from '../../foundation/types';

export function ActivityFeedPage() {
  const { user } = useAuthStore();
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Rohit';
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<PostType>('STANDARD');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'projects' | 'milestones' | 'questions'>('all');

  // Skill exchange matches for right sidebar
  const exchangeMatches = useMemo(() => {
    if (!user) return { mutualMatches: [] };
    return calculateSkillExchangeMatches(user.id);
  }, [user]);

  const topMutualMatch = exchangeMatches.mutualMatches[0];

  // Active projects for right sidebar
  const activeProjects = useMemo(() => {
    return getProjects().slice(0, 2);
  }, []);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    setLoading(true);
    const feed = await apiClient.getPosts();
    setPosts(feed);
    setLoading(false);
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() || !user) return;
    setIsSubmitting(true);

    try {
      const newPost = await apiClient.createPost({
        content: postContent,
        postType,
        tags: tags.length > 0 ? tags : ['CampusUpdate'],
      });

      setPosts([newPost, ...posts]);
      setPostContent('');
      setTags([]);
      addToast({ type: 'success', title: 'Post published to campus feed!' });
    } catch {
      addToast({ type: 'error', title: 'Could not create post' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    const updated = await apiClient.toggleLikePost(postId);
    if (updated) {
      setPosts(posts.map(p => p.id === postId ? updated : p));
    }
  };

  const handleSave = async (postId: string) => {
    const isSaved = await apiClient.toggleSave(postId);
    setPosts(posts.map(p => p.id === postId ? { ...p, isSaved } : p));
    addToast({
      type: 'info',
      title: isSaved ? 'Post saved to bookmarks' : 'Post removed from bookmarks',
    });
  };

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim() || !user) return;

    await apiClient.addComment(postId, commentText);
    setCommentText('');
    loadFeed();
    addToast({ type: 'success', title: 'Comment added' });
  };

  const handleShare = (postId: string) => {
    navigator.clipboard?.writeText(`${window.location.origin}/feed#${postId}`);
    addToast({ type: 'info', title: 'Post link copied to clipboard!' });
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'projects') return posts.filter(p => p.postType === 'PROJECT_SHOWCASE');
    if (activeFilter === 'milestones') return posts.filter(p => p.postType === 'ACHIEVEMENT');
    if (activeFilter === 'questions') return posts.filter(p => p.postType === 'ACADEMIC_QUESTION');
    return posts;
  }, [posts, activeFilter]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── LEFT COLUMN (Personal Identity & Skills Matrix) ── */}
        <div className="lg:col-span-3 space-y-4">
          <Card padding="none" className="overflow-hidden border border-slate-200">
            {/* Cover Banner */}
            <div className="h-20 bg-gradient-to-r from-navy-900 via-indigo-900 to-violet-900 relative">
              <div className="absolute inset-0 bg-white/5 opacity-50" />
            </div>

            {/* Avatar & Header */}
            <div className="p-4 text-center relative -mt-10">
              <Avatar
                name={user.fullName}
                size="lg"
                showStatus
                status={user.onlineStatus}
                className="mx-auto ring-4 ring-white shadow-sm"
              />
              <Link to="/profile" className="block font-bold text-slate-900 mt-2 hover:text-violet-600 transition-colors">
                {user.fullName}
              </Link>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {user.headline || `${user.year} • ${user.department}`}
              </p>
              <p className="text-xs text-violet-600 font-medium mt-1">
                {user.university || 'Campus University'}
              </p>

              {/* Profile Completion Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-left">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 font-medium">Profile Strength</span>
                  <span className="text-violet-700 font-bold">85%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Connections Stat */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500">Campus Peers</span>
                <Link to="/network" className="font-bold text-violet-600 hover:underline">
                  128 peers
                </Link>
              </div>
            </div>
          </Card>

          {/* ── SKILLS MATRIX CARD ── */}
          <Card padding="md" className="border border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Skills You Teach
                </span>
                <Link to="/profile" className="text-[11px] text-violet-600 hover:underline font-medium">
                  Edit
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(user.skillsOffered && user.skillsOffered.length > 0) ? (
                  user.skillsOffered.map(s => (
                    <span
                      key={s.skillName}
                      className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {s.skillName}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">ReactJS, TypeScript</span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Skills You Want
                </span>
                <Link to="/profile" className="text-[11px] text-violet-600 hover:underline font-medium">
                  Add
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(user.skillsWanted && user.skillsWanted.length > 0) ? (
                  user.skillsWanted.map(s => (
                    <span
                      key={s.skillName}
                      className="text-xs font-semibold px-2 py-0.5 rounded-md bg-violet-50 text-violet-800 border border-violet-100"
                    >
                      {s.skillName}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">Python, Machine Learning</span>
                )}
              </div>
            </div>

            {/* Quick Navigation Action Cards */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/exchange"
                className="flex items-center justify-between p-2.5 rounded-xl bg-violet-50/80 hover:bg-violet-100 text-violet-900 border border-violet-200/70 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-violet-600" />
                  <span className="text-xs font-bold">Skill Exchange</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  96% Match
                </span>
              </Link>

              <Link
                to="/projects"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-violet-600" />
                  <span className="text-xs font-bold">ProjectSpace</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </Card>

          {/* Communities & Shortcuts */}
          <Card padding="md" className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Communities</h4>
            <div className="space-y-2">
              <Link to="/communities" className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-violet-600 font-medium transition-colors">
                <span className="text-sm">🇮🇳</span> Indian Student Developers
              </Link>
              <Link to="/communities" className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-violet-600 font-medium transition-colors">
                <span className="text-sm">🤖</span> AI Builders India
              </Link>
              <Link to="/communities" className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-violet-600 font-medium transition-colors">
                <span className="text-sm">⚡</span> IoT & Embedded Systems India
              </Link>
              <Link to="/communities" className="flex items-center gap-2.5 text-xs text-slate-700 hover:text-violet-600 font-medium transition-colors">
                <span className="text-sm">👩‍💻</span> Women in Technology
              </Link>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <Link to="/communities" className="text-xs text-violet-600 hover:underline font-medium block">
                Discover all communities →
              </Link>
            </div>
          </Card>
        </div>

        {/* ── CENTER COLUMN (Rich Activity Feed) ── */}
        <div className="lg:col-span-6 space-y-5">
          {/* Executive Welcome Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1 max-w-xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {timeGreeting}, {firstName}.
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                What are you learning or building today? Connect with peers across campus, collaborate on real-world projects, and exchange skills.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Link to="/exchange">
                <Button size="sm" className="bg-[#151e4e] hover:bg-[#0f1638] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs">
                  Skill Exchange
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 py-2 rounded-xl">
                  Projects
                </Button>
              </Link>
            </div>
          </div>

          {/* Post Creation Box */}
          <Card padding="md" className="border border-slate-200 shadow-xs">
            <div className="flex gap-3 items-start mb-3">
              <Avatar name={user.fullName} size="md" />
              <div className="flex-1">
                <textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share a project breakthrough, offer a skill, or ask an academic question..."
                  className="w-full text-sm text-slate-800 placeholder:text-slate-400 bg-slate-50 hover:bg-white focus:bg-white rounded-xl p-3 border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition-all resize-none min-h-[85px]"
                />
              </div>
            </div>

            {/* Post Type Selector Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3 pt-2 border-t border-slate-100">
              {[
                { type: 'STANDARD', label: 'Update', icon: Sparkles },
                { type: 'PROJECT_SHOWCASE', label: 'Project', icon: Code },
                { type: 'ACHIEVEMENT', label: 'Milestone', icon: Award },
                { type: 'ACADEMIC_QUESTION', label: 'Question', icon: HelpCircle },
                { type: 'OPPORTUNITY', label: 'Collaboration', icon: Briefcase },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setPostType(item.type as PostType)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    postType === item.type
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Tag Inputs */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-xs font-medium">
                    #{t}
                    <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tag (e.g. React)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500 w-36"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="text-xs text-violet-600 font-medium hover:underline"
                >
                  + Add
                </button>
              </div>

              <Button
                size="sm"
                onClick={handleCreatePost}
                disabled={!postContent.trim() || isSubmitting}
                rightIcon={<Send className="w-3.5 h-3.5" />}
              >
                Publish
              </Button>
            </div>
          </Card>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'projects', label: 'Project Showcases' },
              { id: 'milestones', label: 'Learning Milestones' },
              { id: 'questions', label: 'Academic Help' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Posts Stream */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-48" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} padding="none" className="border border-slate-200/90 shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5">
                    {/* Post Author Info */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={post.authorName} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{post.authorName}</span>
                            {post.authorRole === 'mentor' && (
                              <Badge variant="violet" size="sm">Mentor</Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">{post.authorHeadline}</p>
                          <span className="text-[10px] text-slate-400">{formatRelativeTime(post.createdAt)}</span>
                        </div>
                      </div>
                      <Badge variant={
                        post.postType === 'ACHIEVEMENT' ? 'success' :
                        post.postType === 'PROJECT_SHOWCASE' ? 'info' :
                        post.postType === 'OPPORTUNITY' ? 'warning' : 'default'
                      } size="sm">
                        {post.postType.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line mb-3">
                      {post.content}
                    </p>

                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {post.tags.map((t) => (
                          <span key={t} className="text-xs font-medium text-violet-600 hover:underline cursor-pointer">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Counters */}
                    <div className="flex items-center justify-between py-2 border-t border-b border-slate-100 text-xs text-slate-500">
                      <span>{post.reactionsCount || 0} reactions</span>
                      <div className="flex gap-3">
                        <span>{post.commentsCount || 0} comments</span>
                        <span>{post.sharesCount || 0} shares</span>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors ${
                          post.hasLiked ? 'text-violet-600 bg-violet-50' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-violet-600 text-violet-600' : ''}`} />
                        {post.hasLiked ? 'Liked' : 'Like'}
                      </button>

                      <button
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Comment
                      </button>

                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>

                      <button
                        onClick={() => handleSave(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors ${
                          post.isSaved ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                        {post.isSaved ? 'Saved' : 'Save'}
                      </button>
                    </div>

                    {/* Inline Comment Thread */}
                    {activeCommentPostId === post.id && (
                      <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={user.fullName} size="sm" />
                          <input
                            type="text"
                            placeholder="Add a constructive thought or comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(post.id); }}
                            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-violet-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleCommentSubmit(post.id)}
                            className="p-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Existing Comments */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="space-y-2.5 pt-2">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2.5 items-start bg-slate-50 p-2.5 rounded-xl">
                                <Avatar name={comment.authorName} size="sm" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-slate-900">{comment.authorName}</span>
                                    <span className="text-[10px] text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
                                  </div>
                                  <p className="text-xs text-slate-700 mt-0.5">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN (Smart Discovery & Exchange Hub) ── */}
        <div className="lg:col-span-3 space-y-5">
          {/* Top Skill Exchange Match Card */}
          {topMutualMatch && (
            <Card padding="md" className="border border-violet-200 bg-gradient-to-br from-white to-violet-50/50 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 flex items-center gap-1">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-violet-600" />
                  Top Skill Exchange
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {topMutualMatch.matchScore}% Match
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Avatar name={topMutualMatch.partnerName} size="md" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {topMutualMatch.partnerName}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {topMutualMatch.partnerHeadline}
                  </p>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-violet-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">They Teach:</span>
                  <span className="font-bold text-violet-700">{topMutualMatch.theyCanTeachMe.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">You Teach:</span>
                  <span className="font-bold text-emerald-700">{topMutualMatch.iCanTeachThem.join(', ')}</span>
                </div>
                <div className="pt-1 border-t border-slate-100 text-[10px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Overlap: {topMutualMatch.sharedDays.join(' & ')}
                </div>
              </div>

              <Link to="/exchange" className="block">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full text-xs bg-violet-600 hover:bg-violet-500 font-semibold"
                  leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
                >
                  Start Skill Exchange
                </Button>
              </Link>
            </Card>
          )}

          {/* Active ProjectSpace Initiatives */}
          <Card padding="md" className="border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-violet-600" />
                Active Projects
              </h3>
              <Link to="/projects" className="text-xs text-violet-600 font-medium hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {activeProjects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/projects/${proj.id}`}
                      className="text-xs font-bold text-slate-900 hover:text-violet-600 truncate block max-w-[170px]"
                    >
                      {proj.title}
                    </Link>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Recruiting
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {proj.tagline}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                    <span>{proj.currentMembers.length}/{proj.teamSizeMax} Members</span>
                    <Link to={`/projects/${proj.id}`} className="font-semibold text-violet-600 hover:underline">
                      Apply →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Trending Campus Skills */}
          <Card padding="md" className="border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              Trending Skills
            </h3>
            <div className="space-y-2">
              {[
                { name: 'ReactJS & TypeScript', exchanges: '48 active exchanges' },
                { name: 'Python & PyTorch', exchanges: '42 active exchanges' },
                { name: 'ESP32 & Embedded C', exchanges: '29 active exchanges' },
                { name: 'FastAPI & Postgres', exchanges: '24 active exchanges' },
                { name: 'Docker & Kubernetes', exchanges: '19 active exchanges' },
              ].map((skill) => (
                <div key={skill.name} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800 hover:text-violet-600 cursor-pointer">
                    {skill.name}
                  </span>
                  <span className="text-slate-400 text-[10px]">{skill.exchanges}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
