https://chimerical-choux-063733.netlify.app/
import React, { useState, useRef } from 'react';
// hCaptcha লাইব্রেরি ইম্পোর্ট
import HCaptcha from '@hcaptcha/react-hcaptcha';
// আইকন ইম্পোর্ট
import { Heart, MessageCircle, Share2, Bookmark, Sun, Moon, Home, User, Lock, Calendar, HelpCircle, Send, Settings } from 'lucide-react';

// === লোগো URL ===
const APP_LOGO = "https://i.ibb.co/XfXkY0X/1000010844.png";
// === hCaptcha সাইট কি (PLACEHOLDER) ===
// এখানে আপনার আসল সাইট কি বসান
const HCAPTCHA_SITE_KEY = "0ae48e88-4eae-4e30-b682-7c386ed085f4";


export default function SocialInstaApp() {
  // --- গ্লোবাল স্টেট ---
  const [darkMode, setDarkMode] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');
  const [showHelp, setShowHelp] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');

  // --- সম্পূর্ণ ফর্ম স্টেট ---
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    email: '',
    mobile: '',
    gender: 'male',
    profileType: 'public',
    password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  
  // --- ক্যাপচা স্টেট ---
  const [hCaptchaToken, setHCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  // --- ইনপুট পরিবর্তনের হ্যান্ডলার ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- পাসওয়ার্ড ভ্যালিডেশন ---
  const validatePassword = (value) => {
    handleInputChange({ target: { name: 'password', value } }); // FormData আপডেট
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()]/.test(value);
    if (value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setPasswordError('শক্ত পাসওয়ার্ড দিন (A-Z, 0-9, @#$ দিন)');
    } else {
      setPasswordError('');
    }
  };

  // --- রেজিস্ট্রেশন সাবমিশন ---
  const handleRegister = (e) => {
    e.preventDefault();
    if (!hCaptchaToken) {
      alert("দয়া করে ক্যাপচা ভেরিফিকেশন সম্পূর্ণ করুন।");
      return;
    }
    // পাসওয়ার্ড ভুল থাকলে রেজিস্ট্রেশন হবে না
    if (passwordError) {
      alert("পাসওয়ার্ডটি সঠিক ফরমেটে দিন।");
      return;
    }

    console.log("রেজিস্ট্রেশন ডেটা:", formData);
    console.log("ক্যাপচা টোকেন:", hCaptchaToken);
    
    // ব্যাকএন্ড API-তে ডেটা পাঠানো এখানে হবে
    // আপাতত সাকসেস ধরে নিচ্ছি
    alert("রেজিস্ট্রেশন সফল হয়েছে!");
    setIsRegistered(true);
  };

  // --- হেল্প সাবমিশন ---
  const handleHelpSubmit = (e) => {
    e.preventDefault();
    alert(`ধন্যবাদ! ডেভেলপারের কাছে মেসেজ পাঠানো হয়েছে: \n"${helpMessage}"`);
    setHelpMessage('');
    setShowHelp(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'} transition-colors duration-300`}>
      
      {/* ১. হেডার কম্পোনেন্ট */}
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        setShowHelp={setShowHelp} 
        isRegistered={isRegistered}
      />

      {/* ২. হেল্প ও সাপোর্ট মডাল কম্পোনেন্ট */}
      {showHelp && (
        <HelpSupportModal 
          darkMode={darkMode} 
          setShowHelp={setShowHelp} 
          helpMessage={helpMessage} 
          setHelpMessage={setHelpMessage} 
          handleHelpSubmit={handleHelpSubmit}
        />
      )}

      {/* ৩. মেইন কন্টেন্ট এলাকা (রেজিস্ট্রেশন বনাম ড্যাশবোর্ড) */}
      {!isRegistered ? (
        <div className={`py-12 p-4 flex items-center justify-center`}>
          <div className={`w-full max-w-lg p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-zinc-900' : 'bg-white'}`}>
            <RegistrationForm 
              formData={formData} 
              handleInputChange={handleInputChange}
              passwordError={passwordError}
              validatePassword={validatePassword}
              handleRegister={handleRegister}
              darkMode={darkMode}
              setHCaptchaToken={setHCaptchaToken}
              captchaRef={captchaRef}
            />
          </div>
        </div>
      ) : (
        <DashboardView darkMode={darkMode} setShowHelp={setShowHelp} />
      )}

      {/* ৪. বটম নেভিগেশন (শুধুমাত্র রেজিস্ট্রেশনের পর দৃশ্যমান) */}
      {isRegistered && <BottomNavigation darkMode={darkMode} setShowHelp={setShowHelp} />}
    </div>
  );
}


// ==========================================
//           সাব-কম্পোনেন্টসমূহ
// ==========================================

// --- ১. হেডার কম্পোনেন্ট ---
const Header = ({ darkMode, setDarkMode, setShowHelp, isRegistered }) => (
  <header className={`sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b backdrop-blur-md ${darkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-gray-200'}`}>
    <div className="flex items-center gap-2">
       <img src={APP_LOGO} className="w-8 h-8 rounded-full border border-pink-500" alt="S" />
       <h1 className="text-lg font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent italic">SOCIAL INSTA</h1>
    </div>
    <div className="flex items-center gap-3">
       {isRegistered && (
         <button onClick={() => setShowHelp(true)} className="p-2 hover:bg-zinc-500/20 rounded-full text-blue-400 transition-colors">
           <HelpCircle size={22} />
         </button>
       )}
       <button onClick={() => setDarkMode(!darkMode)} className="p-2 hover:bg-zinc-500/20 rounded-full transition-colors">
         {darkMode ? <Sun size={22} /> : <Moon size={22} />}
       </button>
    </div>
  </header>
);

// --- ২. হেল্প ও সাপোর্ট মডাল কম্পোনেন্ট ---
const HelpSupportModal = ({ darkMode, setShowHelp, helpMessage, setHelpMessage, handleHelpSubmit }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
    <div className={`w-full max-w-sm p-6 rounded-3xl ${darkMode ? 'bg-zinc-900' : 'bg-white text-black'} shadow-2xl`}>
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">হেল্প ও সাপোর্ট</h2>
      <p className="text-xs opacity-60 mb-4">আপনার কী সাহায্য প্রয়োজন? ডেভেলপারের কাছে মেসেজ পাঠান।</p>
      <form onSubmit={handleHelpSubmit}>
        <textarea 
          required
          className={`w-full p-3 rounded-xl border h-32 text-sm transition ${darkMode ? 'bg-zinc-800 border-zinc-700 focus:ring-1 focus:ring-pink-500' : 'bg-gray-100 focus:ring-1 focus:ring-pink-300'}`}
          placeholder="আপনার সমস্যার কথা এখানে লিখুন..."
          value={helpMessage}
          onChange={(e) => setHelpMessage(e.target.value)}
        ></textarea>
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={() => setShowHelp(false)} className="flex-1 py-2 bg-zinc-700 rounded-xl text-sm hover:bg-zinc-600 transition">বাতিল</button>
          <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm flex items-center justify-center gap-2 hover:scale-105 transition">পাঠান <Send size={14}/></button>
        </div>
      </form>
    </div>
  </div>
);

// --- ৩. রেজিস্ট্রেশন ফর্ম কম্পোনেন্ট ---
const RegistrationForm = ({ formData, handleInputChange, passwordError, validatePassword, handleRegister, darkMode, setHCaptchaToken, captchaRef }) => (
  <form onSubmit={handleRegister} className="space-y-4">
    <div className="flex flex-col items-center mb-6">
      <img src={APP_LOGO} alt="Logo" className="w-20 h-20 rounded-full border-4 border-pink-500 mb-2 shadow-lg" />
      <h2 className="text-xl font-bold">নতুন আইডি তৈরি করুন</h2>
    </div>

    {/* নাম ও জন্মতারিখ */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="পূর্ণ নাম" className={`p-3 rounded-xl border transition ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50'}`} />
      <div className="relative">
        <Calendar className="absolute left-3 top-3 opacity-40" size={18} />
        <input required type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={`w-full pl-10 p-3 rounded-xl border transition ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50'}`} />
      </div>
    </div>

    {/* ইমেইল ও মোবাইল */}
    <div className="grid grid-cols-2 gap-4">
      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Gmail" className={`p-3 rounded-xl border transition ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50'}`} />
      <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="Mobile Number" className={`p-3 rounded-xl border transition ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50'}`} />
    </div>

    {/* জেন্ডার ও প্রোফাইল টাইপ */}
    <div className="grid grid-cols-2 gap-4">
      <select name="gender" value={formData.gender} onChange={handleInputChange} className={`p-3 rounded-xl border transition ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50'}`}>
        <option value="male">পুরুষ</option>
        <option value="female">নারী</option>
        <option value="other">অন্যান্য</option>
      </select>
      <select name="profileType" value={formData.profileType} onChange={handleInputChange} className={`p-3 rounded-xl border transition ${darkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50'}`}>
        <option value="public">পাবলিক প্রোফাইল</option>
        <option value="private">প্রাইভেট প্রোফাইল</option>
      </select>
    </div>

    {/* পাসওয়ার্ড */}
    <div className="relative">
      <Lock className="absolute left-3 top-3 opacity-40" size={18} />
      <input 
        required 
        name="password"
        type="password" 
        value={formData.password} 
        onChange={(e) => validatePassword(e.target.value)} 
        placeholder="Strong Password" 
        className={`w-full pl-10 p-3 rounded-xl border transition ${passwordError ? 'border-red-500 ring-1 ring-red-300' : 'border-zinc-700'}`} 
      />
    </div>
    {passwordError && <p className="text-red-400 text-xs px-2 mt-[-5px]">{passwordError}</p>}

    {/* --- hCaptcha উইজেট --- */}
    <div className="flex justify-center mt-6">
      <HCaptcha
        sitekey={HCAPTCHA_SITE_KEY}
        onVerify={(token) => setHCaptchaToken(token)}
        ref={captchaRef}
        theme={darkMode ? 'dark' : 'light'}
      />
    </div>

    {/* সাবমিট বাটন */}
    <button type="submit" className="w-full py-4 mt-6 rounded-2xl font-black text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 active:scale-100 transition-all shadow-lg hover:shadow-pink-500/30">আইডি তৈরি করুন</button>
  </form>
);

// --- ৪. ড্যাশবোর্ড কন্টেন্ট কম্পোনেন্ট (হোম ফিড) ---
const DashboardView = ({ darkMode, setShowHelp }) => (
  <main className="max-w-lg mx-auto p-10 py-16 text-center">
    <img src={APP_LOGO} className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-pink-500 shadow-2xl animate-pulse" alt="Logo" />
    <h2 className="text-xl font-bold">স্বাগতম, Social Insta-এ!</h2>
    <p className="mt-2 opacity-60 text-sm">ডান পাশের ওপরের প্রশ্নবোধক চিহ্নে क्लिक করে বা নেভিগেশন বারের সেটিংসে ক্লিক করে আপনি সরাসরি ডেভেলপারের সাথে যোগাযোগ করতে পারেন।</p>
  </main>
);

// --- ৫. বটম নেভিগেশন কম্পোনেন্ট ---
const BottomNavigation = ({ darkMode, setShowHelp }) => (
  <nav className={`fixed bottom-0 left-0 right-0 border-t py-4 ${darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white'} shadow-lg transition`}>
    <div className="max-w-lg mx-auto flex justify-around">
      <Home size={24} className="text-pink-500 cursor-pointer" />
      <Settings size={24} onClick={() => setShowHelp(true)} className="cursor-pointer opacity-50 hover:opacity-100 hover:text-pink-500 transition-all duration-300" />
      <User size={24} className="opacity-50 cursor-pointer" />
    </div>
  </nav>
);
