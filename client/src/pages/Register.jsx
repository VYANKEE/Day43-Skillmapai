// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Profile Name
      await updateProfile(user, { displayName: formData.name });

      // 3. Create User Document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
        role: "Student" // Default role
      });

      // 4. Go to Dashboard
      navigate('/dashboard');

    } catch (err) {
      setError(err.message.replace('Firebase:', '').trim());
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
      <div className="bg-brand-gray border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center mb-2 text-white">Create Account</h2>
        <p className="text-gray-400 text-center mb-8">Start building your career roadmap</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="text" placeholder="Full Name" required
              className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-primary focus:outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-primary focus:outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input 
              type="password" placeholder="Password (Min 6 chars)" required
              className="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:border-brand-primary focus:outline-none"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-brand-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-brand-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;