import React, { useState, useEffect } from 'react';
import { Home, PlaySquare, User, Award, Sun, Moon, LogOut, Trophy } from 'lucide-react';

// অ্যানিমেটেড নাম্বার কম্পোনেন্ট
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(prev => {
        if (prev < value) return Math.min(prev + Math.ceil((value - prev) / 10), value);
        if (prev > value) return Math.max(prev - Math.ceil((prev - value) / 10), value);
        return value;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return <span>{display}</span>;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) ?? true);
  const [activeTab, setActiveTab] = useState('home');
  const [lang, setLang] = useState('en');
  const [isEditing, setIsEditing] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [isRegistered, setIsRegistered] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      name: "", gender: "", bio: "Enjoy life...", views: 1250, diamonds: 6000, isVip: false, level: 1, stars: 0, lastSpinTime: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // অ্যাচিভমেন্ট লজিক
    if (profile.level >= 10 && !achievements.includes('level10')) {
      setAchievements([...achievements, 'level10']);
      alert(lang === 'bn' ? "🎉 লেভেল ১০ অর্জন করেছেন!" : "🎉 You reached Level 10!");
    }
  }, [profile, darkMode]);

  const translations = {
    en: { 
      title: "SOCIAL INSTA", 
      feed: "Feed", 
      game: "Water Sort Game", 
      level: "Level", 
      stars: "Stars", 
      pass: "Pass Level", 
      spin: "Free Spin", 
      profile: "Profile", 
      views: "Profile Views", 
      balance: "Balance", 
      buyVip: "Buy VIP (5000 Diamonds)", 
      logout: "Logout", 
      wait: "Please wait!", 
      save: "Save", 
      edit: "Edit", 
      spinWon: "You won {{diamonds}} diamonds!", 
      achievements: "Achievements" 
    },
    bn: { 
      title: "SOCIAL INSTA", 
      feed: "ফিড", 
      game: "ওয়াটার সর্ট গেম", 
      level: "লেভেল", 
      stars: "স্টার", 
      pass: "লেভেল পাস", 
      spin: "ফ্রি স্পিন", 
      profile: "প্রোফাইল", 
      views: "প্রোফাইল ভিউ", 
      balance: "ব্যালেন্স", 
      buyVip: "ভিআইপি কিনুন (৫০০০ ডায়মন্ড)", 
      logout: "লগআউট", 
      wait: "অপেক্ষা করুন!", 
      save: "সেভ", 
      edit: "এডিট", 
      spinWon: "আপনি জিতেছেন {{diamonds}} ডায়মন্ড!", 
      achievements: "অ্যাচিভমেন্টস" 
    },
    hi: { 
      title: "SOCIAL INSTA", 
      feed: "फ़ीड", 
      game: "वाटर सॉर्ट गेम", 
      level: "स्तर", 
      stars: "सितारे", 
      pass: "स्तर पार", 
      spin: "फ्री स्पिन", 
      profile: "प्रोफ़ाइल", 
      views: "प्रोफ़ाइल व्यू", 
      balance: "बैलेंस", 
      buyVip: "VIP खरीदें (5000 डायमंड)", 
      logout: "लॉग आउट", 
      wait: "कृपया प्रतीक्षा करें!", 
      save: "सहेजें", 
      edit: "संपादित करें", 
      spinWon: "आप {{diamonds}} हीरे जीते हैं!", 
      achievements: "अर्जन" 
    }
  };

  const t = translations[lang] || translations['en'];

  const handleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleSpin = () => {
    const now = Date.now();
    if (now - profile.lastSpinTime < 60000) { alert(t.wait); return; }
    const won = [5, 10, 20, 50, 100][Math.floor(Math.random() * 5)];
    setProfile(p => ({ ...p, diamonds: p.diamonds + won, lastSpinTime: now }));
    alert(t.spinWon.replace("{{diamonds}}", won));
  };

  const passLevel = () => {
    setProfile(p => ({ 
      ...p, 
      diamonds: p.diamonds + (p.isVip ? 100 : 50), 
      level: p.level + 1,
      stars: p.stars + 1 
    }));
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => (
    <div className="pb-24">
      {/* হোম ট্যাব */}
      {activeTab === 'home' && (
        <div className="p-4">
          <h2 className="text-2xl font-black mb-4">{t.feed}</h2>
          <div className="bg-zinc-900 p-4 rounded-3xl h-64 flex items-center justify-center border border-zinc-800">
            <p className="text-gray-400">{lang === 'bn' ? 'শীঘ্রই আসছে...' : 'Coming Soon...'}</p>
          </div>
        </div>
      )}

      {/* গেম ট্যাব */}
      {activeTab === 'game' && (
        <div className="p-6 text-center">
          <h2 className="text-3xl font-black mb-6">{t.game}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <p className="text-gray-400 text-sm">{t.level}</p>
              <p className="text-3xl font-bold text-pink-500"><AnimatedNumber value={profile.level} /></p>
            </div>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <p className="text-gray-400 text-sm">{t.stars}</p>
              <p className="text-3xl font-bold text-yellow-400">⭐ <AnimatedNumber value={profile.stars} /></p>
            </div>
          </div>
          
          <button 
            onClick={passLevel} 
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 px-10 py-4 rounded-2xl font-bold mb-6 hover:opacity-90 transition"
          >
            {t.pass}
          </button>
          
          {profile.level % 5 === 0 && (
            <button 
              onClick={handleSpin} 
              className="w-full bg-yellow-500 text-black px-8 py-3 rounded-2xl font-bold hover:bg-yellow-600 transition"
            >
              🎡 {t.spin}
            </button>
          )}
          
          <div className="mt-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <p className="text-sm text-gray-400">{lang === 'bn' ? 'প্রতি ৫ লেভেলে স্পিন পাবেন' : 'Get free spin every 5 levels'}</p>
          </div>
        </div>
      )}

      {/* প্রোফাইল ট্যাব */}
      {activeTab === 'profile' && (
        <div className="p-6 text-center pb-24">
          {/* প্রোফাইল পিক্চার */}
          <div className={`w-32 h-32 rounded-full mx-auto mb-4 border-4 flex items-center justify-center ${profile.isVip ? 'border-yellow-400 bg-yellow-500/10' : 'border-pink-500 bg-pink-500/10'}`}>
            <User size={60} className={profile.isVip ? 'text-yellow-400' : 'text-pink-500'} />
          </div>
          
          {/* নাম এবং বায়ো এডিটিং */}
          {!isEditing ? (
            <>
              <h1 className="text-3xl font-black">
                {profile.name || 'গেস্ট'} {profile.isVip && <Award className="inline text-yellow-400 ml-2" size={28} />}
              </h1>
              <p className="opacity-70 my-3 text-lg">{profile.bio}</p>
              <button 
                onClick={() => setIsEditing(true)} 
                className="text-pink-500 mt-2 font-bold hover:opacity-80 transition text-lg"
              >
                ✏️ {t.edit}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mb-6">
              <input 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})} 
                className="w-full p-3 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-pink-500"
                placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                maxLength={30}
              />
              <textarea 
                value={profile.bio} 
                onChange={(e) => setProfile({...profile, bio: e.target.value})} 
                className="w-full p-3 rounded-xl bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-pink-500"
                placeholder={lang === 'bn' ? 'আপনার বায়ো' : 'Your Bio'}
                maxLength={100}
                rows={3}
              />
              <button 
                onClick={() => setIsEditing(false)} 
                className="bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition"
              >
                ✓ {t.save}
              </button>
            </div>
          )}
          
          {/* স্ট্যাটস এবং বোনাস */}
          <div className="mt-6 border-t border-zinc-800 pt-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <p className="text-gray-400 text-sm">{t.views}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={profile.views} /></p>
              </div>
              <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <p className="text-gray-400 text-sm">{t.level}</p>
                <p className="text-2xl font-bold text-pink-500"><AnimatedNumber value={profile.level} /></p>
              </div>
            </div>

            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-6">
              <p className="text-gray-400 text-sm mb-1">{t.balance}</p>
              <p className="text-3xl font-bold text-yellow-400">💎 <AnimatedNumber value={profile.diamonds} /></p>
            </div>
            
            {profile.isVip ? (
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500 rounded-2xl p-4 mb-6">
                <p className="text-yellow-400 font-black text-lg">👑 VIP সদস্য</p>
                <p className="text-sm opacity-75 mt-1">{lang === 'bn' ? 'লেভেল পাশে ২x বোনাস পান!' : 'Get 2x bonus on level pass!'}</p>
              </div>
            ) : (
              <button 
                onClick={() => {
                  if (profile.diamonds >= 5000) {
                    setProfile(p => ({ ...p, diamonds: p.diamonds - 5000, isVip: true }));
                    alert(lang === 'bn' ? '🎉 VIP সদস্য হয়েছেন!' : '🎉 You are now VIP!');
                  } else {
                    alert(lang === 'bn' ? '❌ ৫০০০ ডায়মন্ড প্রয়োজন' : '❌ Need 5000 diamonds');
                  }
                }}
                className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-black py-3 rounded-2xl mb-6 hover:opacity-90 transition ${profile.diamonds < 5000 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={profile.diamonds < 5000}
              >
                👑 {t.buyVip}
              </button>
            )}
            
            {/* অ্যাচিভমেন্টস */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">{t.achievements}</p>
              <div className="flex justify-center gap-3">
                {achievements.length > 0 ? (
                  achievements.map(a => (
                    <Trophy 
                      key={a} 
                      className="text-yellow-400 animate-bounce" 
                      size={28}
                      title={lang === 'bn' ? 'লেভেল ১০ অর্জন' : 'Level 10 Achievement'}
                    />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">🔒 {lang === 'bn' ? 'অ্যাচিভমেন্ট আনলক করুন' : 'Unlock Achievements'}</p>
                )}
              </div>
            </div>

            <button 
              onClick={handleLogout} 
              className="w-full text-red-500 flex items-center justify-center gap-2 py-3 hover:bg-red-500/10 rounded-xl transition font-bold text-lg border border-red-500/50"
            >
              <LogOut size={20} /> {t.logout}
            </button>
          </div>
        </div>
      )}

      {/* অ্যাচিভমেন্টস ট্যাব */}
      {activeTab === 'achievements' && (
        <div className="p-6 pb-24">
          <h2 className="text-3xl font-black mb-6">{t.achievements}</h2>
          
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition ${
              achievements.includes('level10') 
                ? 'bg-yellow-500/10 border-yellow-500' 
                : 'bg-zinc-900 border-zinc-800 opacity-50'
            }`}>
              <Trophy 
                className={achievements.includes('level10') ? 'text-yellow-400' : 'text-gray-500'} 
                size={40}
              />
              <div className="text-left flex-1">
                <p className="font-black text-lg">{lang === 'bn' ? 'লেভেল ১০ অর্জন' : 'Level 10 Reached'}</p>
                <p className="text-sm opacity-70">{lang === 'bn' ? 'লেভেল ১০ পৌঁছান' : 'Reach Level 10'}</p>
              </div>
              {achievements.includes('level10') && <p className="text-yellow-400 font-black text-xl">✓</p>}
            </div>
            
            {achievements.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🔒</p>
                <p className="text-gray-500 text-lg">{lang === 'bn' ? 'অ্যাচিভমেন্ট আনলক করুন' : 'Unlock Achievements'}</p>
                <p className="text-gray-600 text-sm mt-2">{lang === 'bn' ? 'গেম খেলে অ্যাচিভমেন্ট পান' : 'Play the game to earn achievements'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'}`}>
      {!isRegistered ? (
        <main className="min-h-screen flex items-center justify-center p-4">
          <form onSubmit={handleRegister} className="w-full max-w-sm p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-zinc-800 shadow-2xl">
            <h2 className="text-center text-4xl font-black mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{t.title}</h2>
            <p className="text-center text-gray-400 mb-6 text-sm">{lang === 'bn' ? 'আপনার যাত্রা শুরু করুন' : 'Start your journey'}</p>
            
            <input 
              required 
              type="text" 
              placeholder={lang === 'bn' ? 'আপনার সম্পূর্ণ নাম' : 'Full Name'} 
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
              className="w-full p-4 mb-4 rounded-2xl bg-zinc-800 border border-zinc-700 outline-none focus:border-pink-500 transition text-white"
            />
            
            <select 
              value={profile.gender || ''}
              onChange={(e) => setProfile({...profile, gender: e.target.value})}
              className="w-full p-4 mb-6 rounded-2xl bg-zinc-800 border border-zinc-700 outline-none focus:border-pink-500 transition text-gray-300"
            >
              <option value="">{lang === 'bn' ? 'নির্বাচন করুন' : 'Select Gender'}</option>
              <option value="male">{lang === 'bn' ? 'পুরুষ' : 'Male'}</option>
              <option value="female">{lang === 'bn' ? 'নারী' : 'Female'}</option>
              <option value="other">{lang === 'bn' ? 'অন্যান্য' : 'Other'}</option>
            </select>
            
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 transition text-lg"
            >
              {lang === 'bn' ? 'শুরু করুন' : 'Get Started'}
            </button>
          </form>
        </main>
      ) : (
        <>
          {/* হেডার */}
          <header className="flex justify-between items-center p-6 border-b border-zinc-800 sticky top-0 bg-zinc-950/95 backdrop-blur z-10">
            <h1 className="text-2xl font-black italic bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{t.title}</h1>
            <div className="flex gap-4 items-center">
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)} 
                className="bg-zinc-800 text-sm border border-zinc-700 rounded-lg px-3 py-2 outline-none focus:border-pink-500 transition text-white"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
                <option value="hi">हिन्दी</option>
              </select>
              <button 
                onClick={handleDarkModeToggle}
                className="p-2 hover:bg-zinc-800 rounded-lg transition"
              >
                {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-400" />}
              </button>
            </div>
          </header>

          {/* কন্টেন্ট */}
          {renderContent()}

          {/* বটম নেভিগেশন */}
          <nav className="fixed bottom-0 w-full bg-zinc-950/95 backdrop-blur p-4 flex justify-around border-t border-zinc-800">
            <button
              onClick={() => setActiveTab('home')}
              className={`p-2 rounded-lg transition ${activeTab === 'home' ? 'text-pink-500 bg-pink-500/10' : 'opacity-50 hover:opacity-100'}`}
            >
              <Home size={24} />
            </button>
            <button
              onClick={() => setActiveTab('game')}
              className={`p-2 rounded-lg transition ${activeTab === 'game' ? 'text-pink-500 bg-pink-500/10' : 'opacity-50 hover:opacity-100'}`}
            >
              <PlaySquare size={24} />
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`p-2 rounded-lg transition ${activeTab === 'achievements' ? 'text-pink-500 bg-pink-500/10' : 'opacity-50 hover:opacity-100'}`}
            >
              <Trophy size={24} />
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`p-2 rounded-lg transition ${activeTab === 'profile' ? 'text-pink-500 bg-pink-500/10' : 'opacity-50 hover:opacity-100'}`}
            >
              <User size={24} />
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
