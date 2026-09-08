import React, { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase/firebase';
import {
  Utensils,
  Bot,
  Wallet,
  User,
  Home,
  Bell,
  Search,
  Plus,
  Flame,
  Droplet,
  IndianRupee,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Filter,
  ArrowUpRight,
  Shield,
  Apple,
  Zap,
  Clock,
  Heart,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Lock,
  HelpCircle,
  LogOut,
  Sliders,
  Calendar as CalendarIcon,
  Award,
  ShoppingCart,
  Send,
  Sparkle,
  ThumbsUp,
  AlertCircle,
  X,
  Smartphone,
  Check,
  Brain,
  ChevronDown,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// --- TYPES & DATA ---
type Screen =
  | 'landing'
  | 'auth'
  | 'dashboard'
  | 'menu'
  | 'ai-coach'
  | 'nutrition'
  | 'budget'
  | 'water'
  | 'grocery'
  | 'profile'
  | 'notifications'
  | 'settings';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'water' | 'meal' | 'streak' | 'exam' | 'budget';
  read: boolean;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [devicePreview, setDevicePreview] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [waterAmount, setWaterAmount] = useState(1750); // ml
  const waterGoal = 3000;
  const [budgetLeft, setBudgetLeft] = useState(1850);
  const totalBudget = 3000;

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthChecked(true);

      if (user && (currentScreen === 'landing' || currentScreen === 'auth')) {
        setCurrentScreen('dashboard');
      }
    });

    return () => unsubscribe();
  }, [currentScreen]);

  const handleGoogleLogin = async () => {
    try {
      setAuthLoading(true);
      setAuthError('');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('Signed in with Google!');
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setAuthError(error?.message || 'Google sign-in failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter your email and password.');
      return;
    }

    try {
      setAuthLoading(true);
      setAuthError('');

      if (authMode === 'signup') {
        await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        showToast('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
        showToast('Logged in successfully!');
      }
    } catch (error: any) {
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/weak-password': 'Password must contain at least 6 characters.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.'
      };
      setAuthError(messages[error?.code] || error?.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentScreen('landing');
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
  };

  // Sample Chat Messages for AI Coach
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: "Hello {firebaseUser?.displayName?.split(' ')[0] || 'Student'}! 👋 I'm your HostelNutri AI Coach. I noticed today's mess lunch has lower protein than your gym target. How can I help you eat better today?",
      time: '09:30 AM'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: query, time: 'Just now' }];
    setChatMessages(newMsgs);
    if (!textToSend) setChatInput('');

    setTimeout(() => {
      let aiReply = "That's a great question! For a balanced hostel diet, try pairing your mess meal with 2 boiled eggs or a bowl of roasted chana ($15/pack).";
      if (query.includes('gym')) {
        aiReply = "Gym day fuel! 🏋️‍♂️ Add 200g curd or sattu drink post-mess lunch. It gives an instant 12g protein boost for under ₹20!";
      } else if (query.includes('exam')) {
        aiReply = "Exam mode activated! 🧠 Avoid heavy carb-rich mess rice before studying. Opt for light rotis, almonds, and stay hydrated with coconut water or electrolyte drink.";
      } else if (query.includes('lose weight')) {
        aiReply = "For weight loss on mess food: double your dal portion, skip fried snacks, and replace evening samosas with an apple or roasted makhana.";
      }
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply, time: 'Just now' }]);
    }, 800);
  };

  // Grocery Cart List
  const [groceryItems, setGroceryItems] = useState([
    { id: '1', name: 'Bananas (6 pcs)', category: 'Fruits', price: 35, cal: '530 kcal', tag: 'High Potassium', inCart: false, img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&h=200&fit=crop&auto=format' },
    { id: '2', name: 'Roasted Chana (200g)', category: 'Healthy Snacks', price: 40, cal: '360 kcal', tag: '18g Protein', inCart: true, img: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=200&h=200&fit=crop&auto=format' },
    { id: '3', name: 'Peanuts (250g)', category: 'Healthy Snacks', price: 45, cal: '1400 kcal', tag: 'Budget Protein', inCart: false, img: 'https://images.unsplash.com/photo-1567892560267-0848db99d35f?w=200&h=200&fit=crop&auto=format' },
    { id: '4', name: 'Soy Chunks (200g)', category: 'Protein', price: 30, cal: '690 kcal', tag: '52g Protein/100g', inCart: false, img: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=200&h=200&fit=crop&auto=format' },
    { id: '5', name: 'Fresh Curd (400g)', category: 'Breakfast', price: 35, cal: '240 kcal', tag: 'Gut Health', inCart: true, img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&h=200&fit=crop&auto=format' },
    { id: '6', name: 'Oats Pack (500g)', category: 'Breakfast', price: 90, cal: '1900 kcal', tag: 'Complex Carbs', inCart: false, img: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&h=200&fit=crop&auto=format' },
  ]);

  const toggleCart = (id: string) => {
    setGroceryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, inCart: !item.inCart } : item))
    );
    showToast('Grocery item list updated!');
  };

  // Mock Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: '💧 Drink Water Reminder', desc: "You are 1,250ml away from today's target. Drink a glass now!", time: '10 mins ago', type: 'water', read: false },
    { id: '2', title: '🍲 High Protein Mess Alert', desc: 'Tonight\'s dinner includes Paneer Butter Masala & Rajma!', time: '1 hour ago', type: 'meal', read: false },
    { id: '3', title: '🔥 5-Day Healthy Eating Streak!', desc: 'You logged all 4 mess meals for 5 consecutive days. Keep it up!', time: 'Yesterday', type: 'streak', read: true },
    { id: '4', title: '🧠 Exam Mode Nutrition Boost', desc: 'Exams in 3 days? AI Coach added anti-fatigue snack recommendations.', time: '2 days ago', type: 'exam', read: true },
  ]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200`}>
      {/* Top Preview Controls Bar (Responsive Device Switcher + Screen Navigator) */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2 font-bold tracking-tight text-emerald-400">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center font-extrabold text-base">
            🌱
          </div>
          <span className="hidden sm:inline text-base font-extrabold text-white">HostelNutri<span className="text-emerald-400">AI</span></span>
        </div>

        {/* Screen Selector Dropdown for Easy Review of all 12 Screens */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden lg:inline font-medium">View Screen:</span>
          <select
            value={currentScreen}
            onChange={(e) => {
              const next = e.target.value as Screen;
              if (!firebaseUser && next !== 'landing' && next !== 'auth') {
                setCurrentScreen('auth');
                return;
              }
              setCurrentScreen(next);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="landing">1. Landing Page</option>
            <option value="auth">2. Login / Signup</option>
            <option value="dashboard">3. Student Dashboard</option>
            <option value="menu">4. Today's Hostel Menu</option>
            <option value="ai-coach">5. AI Coach Chat</option>
            <option value="nutrition">6. Nutrition Dashboard</option>
            <option value="budget">7. Budget Tracker</option>
            <option value="water">8. Water Tracker</option>
            <option value="grocery">9. Grocery AI List</option>
            <option value="profile">10. Student Profile & BMI</option>
            <option value="notifications">11. Notifications</option>
            <option value="settings">12. App Settings</option>
          </select>
        </div>

        {/* Device Canvas Frame Toggle & Theme Toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`px-2 py-1 rounded text-xs font-medium transition ${devicePreview === 'mobile' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Mobile Viewport"
            >
              📱 Mobile
            </button>
            <button
              onClick={() => setDevicePreview('tablet')}
              className={`px-2 py-1 rounded text-xs font-medium transition ${devicePreview === 'tablet' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Tablet Viewport"
            >
              Tablet
            </button>
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`px-2 py-1 rounded text-xs font-medium transition ${devicePreview === 'desktop' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Full Responsive"
            >
              💻 Desktop
            </button>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-300 transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* Main Container Containerizing Device Frame */}
      <div className={`mx-auto transition-all duration-300 ${
        devicePreview === 'mobile'
          ? 'max-w-[420px] my-4 rounded-[38px] border-[8px] border-slate-800 shadow-2xl overflow-hidden min-h-[840px] bg-white dark:bg-slate-900'
          : devicePreview === 'tablet'
          ? 'max-w-[768px] my-6 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden min-h-[900px] bg-white dark:bg-slate-900'
          : 'w-full max-w-7xl px-4 py-6'
      }`}>

        {/* Global Toast Banner */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SCREEN 1: LANDING PAGE */}
        {currentScreen === 'landing' && (
          <div className="space-y-12 pb-16">
            {/* Landing Header */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 font-black text-xl text-emerald-600 dark:text-emerald-400">
                🌱 HostelNutri<span className="text-slate-800 dark:text-white">AI</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600"
                >
                  Log In
                </button>
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 dark:shadow-none transition"
                >
                  Get Started
                </button>
              </div>
            </nav>

            {/* Hero Section */}
            <section className="px-6 text-center space-y-6 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-3.5 h-3.5" /> AI Health Companion for Mess & PG Life
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Eat Smarter. <br />
                Live Healthier. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500">
                  Thrive in Hostel Life.
                </span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
                Your AI-powered hostel health companion that helps you eat better, save money, and stay healthy even with mess food!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentScreen('auth')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-bold hover:bg-slate-200 transition"
                >
                  Explore Mess Features
                </button>
              </div>

              {/* Hero Illustration Graphic */}
              <div className="relative mt-8 rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-900 p-6 border border-emerald-100 dark:border-slate-800 shadow-inner max-w-lg mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=350&fit=crop&auto=format"
                  alt="Healthy Student Meal Tray with AI Assistant"
                  className="rounded-2xl shadow-lg w-full object-cover h-48 sm:h-60"
                />
                <div className="absolute top-10 left-10 glass-panel p-3 rounded-2xl shadow-xl flex items-center gap-3 text-left">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    🤖
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">AI Nutrition Fix</p>
                    <p className="text-[11px] text-slate-600">+12g protein added to lunch</p>
                  </div>
                </div>
                <div className="absolute bottom-10 right-10 glass-panel p-3 rounded-2xl shadow-xl text-left">
                  <p className="text-xs font-black text-amber-600 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5" /> Budget Friendly
                  </p>
                  <p className="text-[11px] text-slate-600">Saved ₹450 this week</p>
                </div>
              </div>
            </section>

            {/* Target Audience Badges */}
            <section className="px-6 py-4 bg-slate-100/60 dark:bg-slate-800/40 rounded-2xl mx-6">
              <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Tailored Specifically For
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Hostel Students', 'PG Residents', 'College Students', 'Gym Beginners', 'Budget-Conscious'].map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    🎓 {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="px-6 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">How HostelNutriAI Works</h2>
                <p className="text-xs text-slate-500 mt-1">3 simple steps to transform mess food health</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { step: '01', title: 'Check Today Mess Menu', desc: 'View breakfast, lunch, and dinner macros automatically evaluated for your health goal.' },
                  { step: '02', title: 'Get AI Recommendations', desc: 'Our smart AI suggests simple ₹10-₹20 add-ons like curd or roasted chana to fix nutrient gaps.' },
                  { step: '03', title: 'Track Water & Budget', desc: 'Stay hydrated with smart reminders and manage monthly food allowances stress-free.' }
                ].map((item) => (
                  <div key={item.step} className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs relative">
                    <span className="text-3xl font-black text-emerald-500/20 absolute top-4 right-4">{item.step}</span>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            <section className="px-6 space-y-4">
              <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white">Loved by 12,000+ Students</h2>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
                <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                  "Hostel mess food used to ruin my protein targets for gym. HostelNutriAI tells me exactly what cheap grocery items to add daily without blowing my pocket allowance!"
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs">
                    RK
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Rahul K.</p>
                    <p className="text-[10px] text-slate-500">3rd Year B.Tech, IIT Hostel 4</p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="px-6 space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
              {[
                { q: 'Can I use this with any college mess menu?', a: 'Yes! You can select standard mess menus or upload your own hostel daily schedule.' },
                { q: 'Is it free for students?', a: 'HostelNutriAI is 100% free with core AI meal recommendations and budget tracking.' }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{faq.q}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">{faq.a}</p>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* SCREEN 2: LOGIN / SIGNUP */}
        {currentScreen === 'auth' && (
          <div className="px-6 py-10 max-w-sm mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl mx-auto shadow-lg shadow-emerald-200 dark:shadow-none">
                🌱
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{authMode === 'login' ? 'Welcome Back!' : 'Create Your Account'}</h2>
              <p className="text-xs text-slate-500">Sign in to sync your mess menu & fitness targets</p>
            </div>

            {/* Minimal Illustration */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800/40 text-center">
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                🥗 "Health is wealth, especially in hostel life."
              </p>
            </div>

            <div className="space-y-3">
              <button
onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:bg-slate-50 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-50 dark:bg-slate-900 px-2 text-slate-400">Or Email</span></div>
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => {
                    setAuthEmail(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="student@college.edu"
                  autoComplete="email"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => {
                    setAuthPassword(e.target.value);
                    setAuthError('');
                  }}
                  placeholder="Password"
                  autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={handleEmailAuth}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition"
              >
                Log In to Account
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: DASHBOARD */}
        {currentScreen === 'dashboard' && (
          <div className="space-y-5 pb-20">
            {/* Top Greeting Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Tuesday, Oct 14</p>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Good Morning, {firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'Student'} 👋
                </h1>
              </div>
              <button
                onClick={() => setCurrentScreen('notifications')}
                className="relative p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs"
              >
                <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
            </div>

            {/* Health Score Circular Banner */}
            <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-20px] w-36 h-36 rounded-full bg-white/10 blur-xl"></div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-white/20 text-white rounded-full text-[10px] font-bold uppercase tracking-wide">
                    Today's Health Score
                  </span>
                  <h2 className="text-2xl font-black">Great Shape!</h2>
                  <p className="text-xs text-emerald-100 max-w-[180px]">
                    Your mess lunch fulfilled 75% of your protein goal today.
                  </p>
                </div>

                {/* Circular Progress 82/100 */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-emerald-800/40"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-300"
                      strokeDasharray="82, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black leading-none">82</span>
                    <span className="text-[9px] text-emerald-200 font-bold">/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setCurrentScreen('menu')}
                className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Calories</span>
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">1,640 <span className="text-xs text-slate-400 font-normal">/ 2,100 kcal</span></p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div
                onClick={() => setCurrentScreen('nutrition')}
                className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Protein</span>
                  <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">58g <span className="text-xs text-slate-400 font-normal">/ 75g</span></p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '77%' }}></div>
                </div>
              </div>

              <div
                onClick={() => setCurrentScreen('water')}
                className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Water Intake</span>
                  <Droplet className="w-4 h-4 text-sky-500" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">{waterAmount} <span className="text-xs text-slate-400 font-normal">/ {waterGoal}ml</span></p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${(waterAmount / waterGoal) * 100}%` }}></div>
                </div>
              </div>

              <div
                onClick={() => setCurrentScreen('budget')}
                className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs cursor-pointer hover:border-emerald-300 transition"
              >
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Budget Left</span>
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-lg font-black text-slate-900 dark:text-white">₹{budgetLeft} <span className="text-xs text-slate-400 font-normal">/ ₹{totalBudget}</span></p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(budgetLeft / totalBudget) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Quick AI Suggestion */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl text-xs font-bold mt-0.5">
                💡
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Quick AI Suggestion</p>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  "Today's mess lunch is low in protein. Consider adding roasted chana or 1 packet of curd (₹15) to hit your gym targets."
                </p>
                <button
                  onClick={() => setCurrentScreen('ai-coach')}
                  className="mt-2 text-xs font-bold text-amber-900 dark:text-amber-300 underline underline-offset-2 flex items-center gap-1"
                >
                  Ask AI Coach <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Today's Mess Menu Overview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Today's Mess Menu</h3>
                <button
                  onClick={() => setCurrentScreen('menu')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Full Menu →
                </button>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">🍚 Lunch (Serves at 12:30 PM)</span>
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full font-bold text-[10px]">
                    Healthy Choice
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Rajma Masala, Steamed Jeera Rice, Chapati, Boondi Raita & Cucumber Salad.
                </p>
              </div>
            </div>

            {/* Upcoming Reminder Banner */}
            <div className="p-3.5 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-100 dark:border-sky-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500 text-white rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Hydration Reminder</p>
                  <p className="text-[11px] text-slate-500">Drink 250ml water before study session</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setWaterAmount(prev => Math.min(waterGoal, prev + 250));
                  showToast('Added 250ml water!');
                }}
                className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                + Log
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: TODAY'S HOSTEL MENU */}
        {currentScreen === 'menu' && (
          <div className="space-y-5 pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Today's Hostel Menu</h1>
                <p className="text-xs text-slate-400">Hostel 4 Mess • Oct 14 Schedule</p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                Live Menu
              </span>
            </div>

            {/* Meal Time Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['Breakfast', 'Lunch', 'Snacks', 'Dinner'].map((meal, idx) => (
                <button
                  key={meal}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    idx === 1
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {meal}
                </button>
              ))}
            </div>

            {/* Meal Cards */}
            <div className="space-y-4">
              {[
                {
                  meal: 'Breakfast (07:30 - 09:30 AM)',
                  title: 'Aloo Paratha & Mint Chutney + Tea',
                  cal: 420,
                  protein: 10,
                  carbs: 65,
                  fat: 14,
                  rating: '7.8/10',
                  img: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&h=200&fit=crop&auto=format',
                  aiSuggestion: "High carbs! Drink 1 glass milk or carry 2 boiled eggs to mess for better protein balance."
                },
                {
                  meal: 'Lunch (12:30 - 02:30 PM)',
                  title: 'Rajma Masala, Rice, Chapati & Boondi Raita',
                  cal: 680,
                  protein: 24,
                  carbs: 98,
                  fat: 18,
                  rating: '8.9/10',
                  img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=200&fit=crop&auto=format',
                  aiSuggestion: "Today's lunch is well balanced. Consider adding roasted chana for an extra 8g protein boost."
                },
                {
                  meal: 'Evening Snacks (05:00 - 06:00 PM)',
                  title: 'Vegetable Samosa & Masala Chai',
                  cal: 310,
                  protein: 5,
                  carbs: 42,
                  fat: 15,
                  rating: '6.2/10',
                  img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=200&fit=crop&auto=format',
                  aiSuggestion: "High deep-fry fat. Swap second samosa with fresh fruit from grocery store."
                },
                {
                  meal: 'Dinner (07:30 - 09:30 PM)',
                  title: 'Paneer Butter Masala, Mixed Dal & Roti',
                  cal: 590,
                  protein: 22,
                  carbs: 60,
                  fat: 20,
                  rating: '9.1/10',
                  img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=200&fit=crop&auto=format',
                  aiSuggestion: "Great dinner option! Skip extra butter on roti to maintain calorie deficit."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-xs">
                  <div className="relative h-36">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                      {item.meal}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                      ★ Healthy {item.rating}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{item.title}</h3>

                    {/* Macronutrients Grid */}
                    <div className="grid grid-cols-4 gap-2 text-center p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Calories</p>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">{item.cal} <span className="text-[9px]">kcal</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Protein</p>
                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">{item.protein}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Carbs</p>
                        <p className="text-xs font-black text-amber-600">{item.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">Fat</p>
                        <p className="text-xs font-black text-rose-500">{item.fat}g</p>
                      </div>
                    </div>

                    {/* AI Coach Suggestion Box */}
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed">
                        <span className="font-bold">AI Tip:</span> {item.aiSuggestion}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 5: AI COACH CHAT */}
        {currentScreen === 'ai-coach' && (
          <div className="flex flex-col h-[700px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
            {/* AI Header */}
            <div className="p-4 bg-emerald-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-emerald-600 font-black flex items-center justify-center text-xl shadow-md">
                  🤖
                </div>
                <div>
                  <h2 className="font-extrabold text-sm leading-none">NutriBot AI Coach</h2>
                  <p className="text-[11px] text-emerald-100 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-amber-300 rounded-full animate-ping"></span> Active & Tailored to Mess Food
                  </p>
                </div>
              </div>
              <button
                onClick={() => setChatMessages([])}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg text-emerald-100"
              >
                Clear
              </button>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto scrollbar-none">
              {[
                "What should I eat today?",
                "I have gym today.",
                "I have exams tomorrow.",
                "I'm trying to lose weight."
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0 transition"
                >
                  ⚡ {chip}
                </button>
              ))}
            </div>

            {/* Chat Bubble Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-white font-medium rounded-br-xs shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/50 dark:border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI Coach about mess food, supplements, budget..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSendMessage()}
                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 6: NUTRITION DASHBOARD */}
        {currentScreen === 'nutrition' && (
          <div className="space-y-6 pb-20">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Nutrition Dashboard</h1>
              <p className="text-xs text-slate-400">Weekly intake analytics & health history</p>
            </div>

            {/* Weekly Calories Chart */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Weekly Calorie Consumption (kcal)</h3>
                <span className="text-xs text-emerald-600 font-bold">Avg 1,920 kcal</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { day: 'Mon', cal: 1850 },
                    { day: 'Tue', cal: 2100 },
                    { day: 'Wed', cal: 1780 },
                    { day: 'Thu', cal: 1950 },
                    { day: 'Fri', cal: 2200 },
                    { day: 'Sat', cal: 1690 },
                    { day: 'Sun', cal: 1920 },
                  ]}>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="cal" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protein Intake Trend Chart */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">Protein Intake Target Progress (g)</h3>
                <span className="text-xs text-emerald-600 font-bold">Goal: 75g/day</span>
              </div>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { day: 'Mon', protein: 55 },
                    { day: 'Tue', protein: 72 },
                    { day: 'Wed', protein: 68 },
                    { day: 'Thu', protein: 78 },
                    { day: 'Fri', protein: 62 },
                    { day: 'Sat', protein: 80 },
                    { day: 'Sun', protein: 75 },
                  ]}>
                    <defs>
                      <linearGradient id="proteinGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                    <Area type="monotone" dataKey="protein" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#proteinGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Macro Breakdown Pie */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
              <div className="w-28 h-28 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Carbs', value: 55, color: '#F59E0B' },
                        { name: 'Protein', value: 25, color: '#22C55E' },
                        { name: 'Fat', value: 20, color: '#F43F5E' },
                      ]}
                      innerRadius={22}
                      outerRadius={40}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      <Cell fill="#F59E0B" />
                      <Cell fill="#22C55E" />
                      <Cell fill="#F43F5E" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex-1 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white">Macros Split</h4>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Carbs</span>
                  <span className="font-bold">55%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Protein</span>
                  <span className="font-bold">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Healthy Fat</span>
                  <span className="font-bold">20%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 7: BUDGET TRACKER */}
        {currentScreen === 'budget' && (
          <div className="space-y-5 pb-20">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Budget Tracker</h1>
              <p className="text-xs text-slate-400">Manage monthly food & grocery expenses</p>
            </div>

            {/* Monthly Budget Card */}
            <div className="p-5 bg-slate-900 text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Monthly Food Allowance</p>
                  <h2 className="text-3xl font-black mt-1">₹{budgetLeft} <span className="text-xs font-normal text-slate-400">left of ₹{totalBudget}</span></h2>
                </div>
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Spent: ₹1,150 (38%)</span>
                  <span>Days Left: 16</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
              </div>
            </div>

            {/* Healthy Cheap Alternatives Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Healthy Cheap Alternatives (Under ₹50)</h3>
                <span className="text-xs text-emerald-600 font-bold">Hostel Friendly</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: 'Banana (1 Dozen)', price: '₹50', cal: '105 kcal/pc', protein: '1.3g' },
                  { name: 'Roasted Chana (200g)', price: '₹40', cal: '360 kcal', protein: '18g' },
                  { name: 'Peanuts (250g)', price: '₹45', cal: '1400 kcal', protein: '65g' },
                  { name: 'Soy Chunks (200g)', price: '₹30', cal: '690 kcal', protein: '104g' },
                  { name: 'Packaged Curd (400g)', price: '₹35', cal: '240 kcal', protein: '12g' },
                  { name: 'Boiled Eggs (4 pcs)', price: '₹28', cal: '310 kcal', protein: '24g' }
                ].map((item) => (
                  <div key={item.name} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{item.price}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{item.cal} • <span className="font-bold text-emerald-500">{item.protein} Protein</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense History List */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Recent Expenses</h3>
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
                {[
                  { name: 'College Canteen Coffee & Egg Roll', date: 'Today, 04:15 PM', amount: '- ₹85', cat: 'Canteen' },
                  { name: 'Grocery Store (Oats & Fruit)', date: 'Yesterday, 06:30 PM', amount: '- ₹220', cat: 'Grocery' },
                  { name: 'Mess Extra Coupon (Paneer)', date: 'Oct 12, 01:10 PM', amount: '- ₹60', cat: 'Mess Extra' }
                ].map((exp, i) => (
                  <div key={i} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{exp.name}</p>
                      <p className="text-[10px] text-slate-400">{exp.date}</p>
                    </div>
                    <span className="font-black text-rose-500">{exp.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 8: WATER TRACKER */}
        {currentScreen === 'water' && (
          <div className="space-y-6 pb-20 text-center">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Water Tracker</h1>
              <p className="text-xs text-slate-400">Stay focused & hydrated during hostel study hours</p>
            </div>

            {/* Large Circular Tracker */}
            <div className="p-8 bg-gradient-to-b from-sky-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-3xl border border-sky-100 dark:border-slate-700 shadow-xs relative">
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-sky-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-sky-500"
                    strokeDasharray={`${(waterAmount / waterGoal) * 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <Droplet className="w-8 h-8 text-sky-500 mb-1 animate-bounce" />
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{waterAmount}</span>
                  <span className="text-xs text-slate-400 font-medium">/ {waterGoal} ml Goal</span>
                </div>
              </div>

              {/* Quick Drink Buttons */}
              <div className="flex justify-center gap-3 mt-6">
                {[150, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setWaterAmount(prev => Math.min(waterGoal, prev + amount));
                      showToast(`Added +${amount}ml water!`);
                    }}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-extrabold shadow-md shadow-sky-200 dark:shadow-none transition"
                  >
                    +{amount} ml
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Hydration Statistics */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Today's Progress</p>
                <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                  {Math.round((waterAmount / waterGoal) * 100)}% Completed
                </p>
                <p className="text-[11px] text-sky-600 dark:text-sky-400 mt-1">Remaining: {waterGoal - waterAmount} ml</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Streak</p>
                <p className="text-lg font-black text-amber-500 mt-0.5">🔥 6 Days</p>
                <p className="text-[11px] text-slate-500 mt-1">Consistent hydration</p>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 9: GROCERY SUGGESTIONS */}
        {currentScreen === 'grocery' && (
          <div className="space-y-5 pb-20">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">AI Grocery Suggestions</h1>
              <p className="text-xs text-slate-400">Budget smart additions for hostel room stash</p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {['All Items', 'Fruits', 'Protein', 'Healthy Snacks', 'Breakfast'].map((cat, i) => (
                <button
                  key={cat}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                    i === 0 ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Item Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groceryItems.map((item) => (
                <div key={item.id} className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs flex gap-3">
                  <img src={item.img} alt={item.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md">
                        {item.tag}
                      </span>
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-1">{item.name}</h3>
                      <p className="text-[10px] text-slate-400">{item.cal}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white">₹{item.price}</span>
                      <button
                        onClick={() => toggleCart(item.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          item.inCart
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600'
                        }`}
                      >
                        {item.inCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {item.inCart ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 10: STUDENT PROFILE & BMI */}
        {currentScreen === 'profile' && (
          <div className="space-y-5 pb-20">
            {/* Header Profile Card */}
            <div className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xs text-center space-y-3">
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format"
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-emerald-500 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">
                  ✓
                </span>
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
  {firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'Student'}
</h2>
                <p className="text-xs text-slate-400">Hostel 4 • Computer Science, 2nd Year</p>
              </div>

              <div className="flex justify-center gap-2 pt-1">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-full">
                  🎯 Muscle Gain & Gym
                </span>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full">
                  🥦 Eggetarian
                </span>
              </div>
            </div>

            {/* BMI Card */}
            <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-100 font-bold uppercase">Body Mass Index (BMI)</p>
                <h3 className="text-2xl font-black mt-0.5">21.4 <span className="text-xs font-semibold">Normal / Healthy</span></h3>
                <p className="text-[11px] text-emerald-100 mt-1">Height: 168 cm | Weight: 60.5 kg</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">
                👍
              </div>
            </div>

            {/* Achievements Section */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Badges & Achievements</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-2xl">🔥</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Hydration Master</p>
                  <p className="text-[9px] text-slate-400">7-Day Streak</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-2xl">💪</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Protein Champ</p>
                  <p className="text-[9px] text-slate-400">75g Hit 5x</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="text-2xl">💰</span>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Budget Saver</p>
                  <p className="text-[9px] text-slate-400">Saved ₹500</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 11: NOTIFICATIONS */}
        {currentScreen === 'notifications' && (
          <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Notifications</h1>
                <p className="text-xs text-slate-400">Mess updates, water logs & exam reminders</p>
              </div>
              <button
                onClick={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                  showToast('All marked as read!');
                }}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400"
              >
                Mark all read
              </button>
            </div>

            <div className="space-y-2.5">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition flex items-start gap-3 ${
                    item.read
                      ? 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                      : 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  <div className="p-2 bg-emerald-500 text-white rounded-xl text-xs font-bold mt-0.5">
                    {item.type === 'water' && '💧'}
                    {item.type === 'meal' && '🍲'}
                    {item.type === 'streak' && '🔥'}
                    {item.type === 'exam' && '🧠'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h3>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCREEN 12: APP SETTINGS */}
        {currentScreen === 'settings' && (
          <div className="space-y-5 pb-20">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
              <p className="text-xs text-slate-400">App preferences & security options</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Dark Mode</p>
                    <p className="text-[10px] text-slate-400">Save screen battery at night</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                  className="w-4 h-4 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Push Notifications</p>
                    <p className="text-[10px] text-slate-400">Mess menu alerts & water prompts</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 cursor-pointer" />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Privacy & Data</p>
                    <p className="text-[10px] text-slate-400">Control profile visibility</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Support & FAQ</p>
                    <p className="text-[10px] text-slate-400">Contact hostel developer team</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        )}

        {/* Global Bottom Navigation (Visible on Application Views) */}
        {currentScreen !== 'landing' && currentScreen !== 'auth' && (
          <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-4 py-2 flex items-center justify-between z-40 shadow-lg">
            {[
              { id: 'dashboard', label: 'Home', icon: Home },
              { id: 'menu', label: 'Meals', icon: Utensils },
              { id: 'ai-coach', label: 'AI Coach', icon: Bot },
              { id: 'budget', label: 'Budget', icon: Wallet },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentScreen(item.id as Screen)}
                  className={`flex flex-col items-center gap-1 transition ${
                    isActive ? 'text-emerald-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                  <span className="text-[10px]">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}
