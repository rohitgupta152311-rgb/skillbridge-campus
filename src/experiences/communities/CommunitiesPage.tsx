import { useState, useEffect } from 'react';
import { Users, MessageSquare, Plus, Check, Search, ArrowRight } from 'lucide-react';
import { Card, Button, Badge, Input, EmptyState } from '../../shared/components';
import { apiClient } from '../../infrastructure/api/api-client';
import { useToastStore } from '../../shared/notifications/toast-store';
import { CommunityItem } from '../../foundation/types';

export function CommunitiesPage() {
  const { addToast } = useToastStore();
  const [communities, setCommunities] = useState<CommunityItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, []);

  async function loadCommunities() {
    setLoading(true);
    const data = await apiClient.getCommunities();
    setCommunities(data);
    setLoading(false);
  }

  const handleToggleJoin = async (communityId: string) => {
    const isMember = await apiClient.toggleCommunity(communityId);
    setCommunities(communities.map(c => 
      c.id === communityId
        ? { ...c, isMember, membersCount: isMember ? c.membersCount + 1 : c.membersCount - 1 }
        : c
    ));
    addToast({
      type: 'success',
      title: isMember ? 'Joined community!' : 'Left community',
    });
  };

  const filtered = communities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-fade-in">
      <div className="bg-gradient-to-r from-navy-900 via-indigo-900 to-violet-900 text-white rounded-2xl p-6 shadow-sm">
        <Badge variant="violet" className="!bg-white/10 !text-violet-200 border border-white/20 mb-3">
          Campus Knowledge Hubs
        </Badge>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Campus Communities & Interest Groups</h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Join faculty-moderated and student-led academic clubs. Share study notes, discover research partners, and organize study sessions.
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search groups by topic or interest..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse h-48" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState title="No communities found" description="Try a different search term or start your own student club." />
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(club => (
            <Card key={club.id} padding="lg" className="border border-slate-200 flex flex-col justify-between hover:border-violet-300 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-100 shadow-xs">
                    {club.avatar ? (
                      <img src={club.avatar} alt={club.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{club.icon || '🌐'}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={club.isMember ? 'outline' : 'primary'}
                    className={`text-xs ${club.isMember ? '!text-emerald-700 !border-emerald-200 !bg-emerald-50' : ''}`}
                    leftIcon={club.isMember ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    onClick={() => handleToggleJoin(club.id)}
                  >
                    {club.isMember ? 'Joined' : 'Join'}
                  </Button>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-1.5">{club.name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
                  {club.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" /> {club.membersCount} members
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {club.postsCount || Math.floor(club.membersCount / 5)} discussions
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
