import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Search, Calendar, MessageSquare, Star, Users, BookOpen, Code,
  Cpu, BarChart3, Globe, Zap, ArrowRight, CheckCircle, ChevronRight, Wifi,
  Brain, Calculator, Network,
} from 'lucide-react';
import { Avatar, StarRating, Card, Badge, Button } from '../../shared/components';
import { mockUsers, mockExpertise, mockReviews } from '../../infrastructure/mock-database/seed-data';

const mentorUsers = mockUsers.filter(u => u.role === 'mentor').slice(0, 4);

const steps = [
  { icon: Users, title: 'Create Your Profile', desc: 'Sign up and tell us about your academic goals, subjects, and learning preferences.' },
  { icon: Brain, title: 'Get Smart Matches', desc: 'Our algorithm finds mentors who match your needs based on expertise, schedule, and ratings.' },
  { icon: Zap, title: 'Start Learning', desc: 'Book sessions, chat with mentors, and accelerate your academic journey.' },
];

const categories = [
  { icon: Code, title: 'Web Development', count: 4 },
  { icon: Brain, title: 'Machine Learning', count: 2 },
  { icon: BarChart3, title: 'Data Structures', count: 3 },
  { icon: Cpu, title: 'Digital Electronics', count: 2 },
  { icon: Calculator, title: 'Mathematics', count: 3 },
  { icon: Network, title: 'Computer Networks', count: 2 },
  { icon: Globe, title: 'Python', count: 3 },
  { icon: Wifi, title: 'IoT & Embedded', count: 2 },
];

const stats = [
  { value: '12+', label: 'Active Mentors' },
  { value: '500+', label: 'Sessions Completed' },
  { value: '4.8', label: 'Average Rating' },
  { value: '200+', label: 'Students Helped' },
];

const testimonials = [
  { name: 'Alex Turner', dept: 'Computer Science, 2nd Year', quote: 'SkillBridge helped me find the perfect React mentor. Sarah explained hooks so clearly that I built my first app in a week!' },
  { name: 'Mia Anderson', dept: 'Computer Science, 2nd Year', quote: 'The smart matching algorithm connected me with Rajesh for ML. His industry experience made all the difference in understanding concepts.' },
  { name: 'Omar Hassan', dept: 'Electronics, 2nd Year', quote: 'Finally understood sequential circuits thanks to my mentor Emily. The scheduling system made it easy to book lab sessions.' },
];

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SkillBridge</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#mentors" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Mentors</a>
            <a href="#categories" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Categories</a>
            <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log In</Button>
            <Button size="sm" onClick={() => navigate('/register')}>Sign Up</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-violet-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-violet-200 text-sm mb-6">
              <Zap className="w-4 h-4" /> Smart Peer-to-Peer Tutoring Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Learn Together.<br />Grow Together.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with experienced student mentors who understand your academic journey. Get personalized tutoring, master new skills, and achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" onClick={() => navigate('/register')} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Find a Mentor
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/register')}
                className="!border-white/30 !text-white hover:!bg-white/10">
                Become a Mentor
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { icon: Users, label: '500+ Active Mentors' },
                { icon: Star, label: '4.8★ Average Rating' },
                { icon: BookOpen, label: '1000+ Sessions' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur border border-white/10">
                  <s.icon className="w-4 h-4 text-violet-300" />
                  <span className="text-sm font-medium text-white">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="violet" size="md">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">Get started in 3 simple steps</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Our smart platform makes finding the right mentor effortless.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-xs font-bold text-white flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mentors */}
      <section id="mentors" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="violet" size="md">Featured Mentors</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">Learn from the best on campus</h2>
            <p className="text-slate-500 text-lg">Top-rated mentors ready to help you succeed.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorUsers.map(mentor => {
              const expertise = mockExpertise.filter(e => e.mentorId === mentor.id).slice(0, 3);
              const reviews = mockReviews.filter(r => r.mentorId === mentor.id);
              const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.overallRating, 0) / reviews.length : 0;
              return (
                <Card key={mentor.id} hover className="text-center">
                  <Avatar name={mentor.fullName} size="xl" className="mx-auto mb-3" />
                  <h3 className="font-semibold text-slate-900">{mentor.fullName}</h3>
                  <p className="text-sm text-slate-500 mb-1">{mentor.department}</p>
                  <p className="text-xs text-violet-600 font-medium mb-3">{mentor.year}</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                    {expertise.map(e => <Badge key={e.id} variant="info">{e.topic}</Badge>)}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <StarRating rating={avgRating} size="sm" />
                    <span className="text-sm font-medium text-slate-700">{avgRating.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-slate-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Button variant="outline" onClick={() => navigate('/register')} rightIcon={<ChevronRight className="w-4 h-4" />}>
              View All Mentors
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="violet" size="md">Popular Categories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">Explore learning categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="group p-5 rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                  <cat.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="font-medium text-slate-900 text-sm mb-1">{cat.title}</h3>
                <p className="text-xs text-slate-400">{cat.count} mentors</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-violet-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="violet" size="md">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-4">What students say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Card key={i} padding="lg">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar name={t.name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.dept}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[#1e1b4b] to-[#4c1d95]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to accelerate your learning?</h2>
          <p className="text-lg text-slate-300 mb-8">Join hundreds of students already learning smarter with SkillBridge.</p>
          <Button size="lg" onClick={() => navigate('/register')} className="!bg-white !text-violet-700 hover:!bg-slate-100"
            rightIcon={<ArrowRight className="w-5 h-5" />}>
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">SkillBridge</span>
              </div>
              <p className="text-sm leading-relaxed">Smart peer-to-peer tutoring platform connecting students with the right mentors for academic success.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#mentors" className="hover:text-white transition-colors">Find Mentors</a></li>
                <li><a href="#categories" className="hover:text-white transition-colors">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Community Guidelines</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Safety Tips</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@skillbridge.campus</li>
                <li>Student Center, Room 105</li>
                <li>Mon–Fri, 9 AM – 5 PM</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2026 SkillBridge. Built for CIH-008 Hackathon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
