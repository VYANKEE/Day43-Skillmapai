import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Code2, Database, Shield, Layout, ChevronRight, 
  CheckCircle2, Circle, BookOpen, PlayCircle, LogOut, UserCircle, 
  Sparkles, Zap, Globe, Layers, ArrowRight
} from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { generateRoadmap } from './aiLogic';

// Import Pages (Ensure these exist as per previous steps)
import Login from './pages/Login';
import Register from './pages/Register';

// --- CAREER DATA ---
const CAREER_PATHS = [
  { id: 'mern', title: 'MERN Stack Developer', icon: <Layout className="w-8 h-8"/>, desc: 'Master MongoDB, Express, React, Node', color: 'from-blue-500 to-cyan-400' },
  { id: 'python-fs', title: 'Python Full Stack', icon: <Code2 className="w-8 h-8"/>, desc: 'Django, FastAPI, React, PostgreSQL', color: 'from-yellow-400 to-orange-500' },
  { id: 'datascience', title: 'Data Scientist', icon: <Database className="w-8 h-8"/>, desc: 'AI, ML, Pandas, Deep Learning', color: 'from-green-400 to-emerald-600' },
  { id: 'cyber', title: 'Cyber Security', icon: <Shield className="w-8 h-8"/>, desc: 'Ethical Hacking, Network Defense', color: 'from-red-500 to-pink-500' },
  { id: 'ai-eng', title: 'AI Engineer', icon: <Cpu className="w-8 h-8"/>, desc: 'LLMs, RAG, NVIDIA NIM, PyTorch', color: 'from-purple-500 to-indigo-500' },
];

// --- COMPONENTS ---

// 1. Futuristic Navbar
const Navbar = ({ user }) => {
  const navigate = useNavigate();
  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-[#030014]/50 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">
            SkillMap<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-purple-500/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                  {user.displayName ? user.displayName[0] : 'U'}
                </div>
                <span className="text-sm font-medium text-gray-200">{user.displayName || 'User'}</span>
              </div>
              <button 
                onClick={() => { signOut(auth); navigate('/'); }}
                className="p-3 hover:bg-red-500/10 hover:text-red-400 rounded-full transition-all border border-transparent hover:border-red-500/30"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white font-medium transition">Login</button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

// 2. Dashboard View
const Dashboard = ({ user }) => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('loading'); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmap = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().roadmap) {
        setRoadmap(docSnap.data().roadmap);
        setView('roadmap');
      } else {
        setView('selection');
      }
    };
    fetchRoadmap();
  }, [user]);

  const handleSelectRole = async (roleTitle) => {
    setLoading(true);
    const aiData = await generateRoadmap(roleTitle);
    if (aiData) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: roleTitle,
        roadmap: aiData,
        createdAt: new Date()
      }, { merge: true });
      setRoadmap(aiData);
      setView('roadmap');
    }
    setLoading(false);
  };

  const toggleTopic = async (phaseIndex, topicIndex) => {
    const newRoadmap = { ...roadmap };
    const currentStatus = newRoadmap.phases[phaseIndex].topics[topicIndex].status;
    newRoadmap.phases[phaseIndex].topics[topicIndex].status = 
      currentStatus === 'completed' ? 'pending' : 'completed';
    setRoadmap(newRoadmap);
    await updateDoc(doc(db, "users", user.uid), { roadmap: newRoadmap });
  };

  return (
    <div className="min-h-screen bg-[#030014] pt-24 pb-12 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Loading State */}
        {loading && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="flex flex-col items-center justify-center mt-32 h-[50vh]"
           >
             <div className="relative">
               <div className="w-24 h-24 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
               <div className="absolute inset-0 w-24 h-24 border-r-4 border-l-4 border-purple-500 rounded-full animate-spin-reverse opacity-50"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                 <Cpu className="text-white w-8 h-8 animate-pulse" />
               </div>
             </div>
             <h2 className="text-3xl font-bold mt-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
               Constructing Neural Path...
             </h2>
             <p className="text-gray-400 mt-4 text-lg">Curating high-frequency resources for {user.displayName}</p>
           </motion.div>
        )}

        {/* Role Selection State */}
        {view === 'selection' && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Choose Your Destiny
            </h1>
            <p className="text-xl text-gray-400 mb-12">Select a domain to generate a production-grade roadmap.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {CAREER_PATHS.map((path, index) => (
                <motion.div 
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectRole(path.title)}
                  className="glass-card group p-8 rounded-3xl cursor-pointer hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className="relative z-10">
                    <div className={`mb-6 p-4 w-fit rounded-2xl bg-gradient-to-br ${path.color} shadow-lg`}>
                      <div className="text-white">{path.icon}</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{path.desc}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                    <ArrowRight className="text-white w-6 h-6" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Roadmap View */}
        {view === 'roadmap' && roadmap && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-white/10">
              <div>
                <motion.div 
                  initial={{ width: 0 }} animate={{ width: "100px" }} 
                  className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-6"
                />
                <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white glow-text">{roadmap.role}</h1>
                <p className="text-xl text-gray-400 max-w-2xl">{roadmap.description}</p>
              </div>
              <button 
                onClick={() => setView('selection')} 
                className="mt-6 md:mt-0 text-red-400 hover:text-red-300 border border-red-500/20 px-6 py-2 rounded-lg hover:bg-red-500/10 transition flex items-center gap-2"
              >
                <Layers className="w-4 h-4"/> Switch Career
              </button>
            </div>

            {/* Timeline Phases */}
            <div className="space-y-16">
              {roadmap.phases.map((phase, pIndex) => (
                <motion.div 
                  key={pIndex}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: pIndex * 0.2 }}
                  className="relative pl-8 md:pl-0"
                >
                  {/* Phase Title */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="hidden md:flex h-12 w-12 rounded-xl bg-blue-500/20 border border-blue-500/50 items-center justify-center text-blue-400 font-bold text-xl">
                      {pIndex + 1}
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      {phase.phaseName}
                    </h3>
                  </div>

                  {/* Topics Grid */}
                  <div className="grid gap-6">
                    {phase.topics.map((topic, tIndex) => (
                      <motion.div 
                        key={tIndex}
                        whileHover={{ scale: 1.01 }}
                        className={`glass-card p-6 rounded-2xl border transition-all duration-300 group ${
                          topic.status === 'completed' 
                            ? 'bg-green-500/5 border-green-500/30' 
                            : 'border-white/5 hover:border-purple-500/30'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-6">
                          <div className="flex-1">
                            <h4 className={`text-xl font-semibold mb-2 ${
                              topic.status === 'completed' ? 'text-green-400 line-through' : 'text-white group-hover:text-blue-300'
                            }`}>
                              {topic.topic}
                            </h4>
                            
                            {topic.microConcepts && (
                              <p className="text-gray-400 text-sm mb-4 leading-relaxed border-l-2 border-white/10 pl-3">
                                {topic.microConcepts}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-3">
                              {topic.resources?.map((res, i) => (
                                <a 
                                  key={i} href={res.url} target="_blank" rel="noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-xs text-gray-300 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                >
                                  {res.title.toLowerCase().includes('youtube') ? <PlayCircle size={14} className="text-red-500"/> : <BookOpen size={14} className="text-blue-400"/>}
                                  {res.title}
                                </a>
                              ))}
                            </div>
                          </div>

                          <button 
                            onClick={() => toggleTopic(pIndex, tIndex)}
                            className="mt-1 transform hover:scale-110 transition-transform"
                          >
                            {topic.status === 'completed' 
                              ? <CheckCircle2 className="w-8 h-8 text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> 
                              : <Circle className="w-8 h-8 text-gray-600 group-hover:text-purple-500" />
                            }
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// 3. Ultra-Modern Landing Page
const Landing = () => (
  <div className="min-h-screen bg-[#030014] relative overflow-hidden">
    <Navbar user={null} />
    
    {/* Dynamic Backgrounds */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="absolute inset-0 bg-grid-white opacity-20"></div>

    <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10 text-center">
      
      {/* Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition cursor-default"
      >
        <Sparkles className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-gray-300">Powered by NVIDIA AI + Llama 3</span>
      </motion.div>

      {/* Hero Headline */}
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
      >
        <span className="block text-white drop-shadow-2xl">Don't Just Learn.</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 glow-text">
          Master Your Craft.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
      >
        Stop guessing. Our AI Architect builds a <span className="text-white font-semibold">production-grade roadmap</span> tailored to the modern tech stack. From "Hello World" to "System Design".
      </motion.p>

      {/* CTA Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row items-center justify-center gap-6"
      >
        <button onClick={() => window.location.href='/register'} className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
          <div className="absolute inset-0 bg-white blur-md opacity-50 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <span className="relative flex items-center gap-2">Start Journey <ArrowRight className="w-5 h-5"/></span>
        </button>
        <button className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition backdrop-blur-md flex items-center gap-2">
          <PlayCircle className="w-5 h-5"/> Watch Demo
        </button>
      </motion.div>

      {/* Floating Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 text-left">
        {[
          { icon: <Zap className="text-yellow-400"/>, title: "Instant Roadmaps", desc: "No generic advice. Get exact search queries and deep-dive topics." },
          { icon: <Globe className="text-blue-400"/>, title: "Industry Standard", desc: "Curriculum designed based on FAANG & High-Frequency Trading firm expectations." },
          { icon: <Layers className="text-purple-400"/>, title: "Track Progress", desc: "Save your journey to the cloud and tick off concepts as you master them." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + (i * 0.1) }}
            className="glass-card p-8 rounded-2xl hover:bg-white/5 transition-colors"
          >
            <div className="mb-4 p-3 bg-white/5 w-fit rounded-xl border border-white/10">{feat.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
            <p className="text-gray-400">{feat.desc}</p>
          </motion.div>
        ))}
      </div>

    </div>
  </div>
);

// --- MAIN ROUTER ---
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Router>
      <div className="bg-[#030014] min-h-screen text-white font-sans selection:bg-purple-500/30 selection:text-white">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={user ? <div><Navbar user={user}/><Dashboard user={user} /></div> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;