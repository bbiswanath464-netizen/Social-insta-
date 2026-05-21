import React, { useState, useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { Heart, MessageCircle, Share2, Bookmark, Sun, Moon, Home, User, Lock, Calendar, HelpCircle, Send, Settings } from 'lucide-react';

const APP_LOGO = "https://i.ibb.co/XfXkY0X/1000010844.png";
const HCAPTCHA_SITE_KEY = "0ae48e88-4eae-4e30-b682-7c386ed085f4";

export default function SocialInstaApp() {
  const [darkMode, setDarkMode] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', dob: '', email: '', mobile: '', gender: 'male', profileType: 'public', password: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [hCaptchaToken, setHCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validatePassword = (value) => {
    handleInputChange({ target: { name: 'password', value } });
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()]/.test(value);
    if (value.length < 8 || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setPasswordError('শক্ত পাসওয়ার্ড দিন (A-Z, 0-9, @#$ দিন)');
    } else {
      setPasswordError('');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!hCaptchaToken) {
      alert("দয়া করে ক্যাপচা ভেরিফিকেশন সম্পূর্ণ করুন।");
      return;
    }
    if (passwordError) {
      alert("পাসওয়ার্ডটি সঠিক ফরমেটে দিন।");
      return;
    }
    alert("রেজিস্ট্রেশন সফল হয়েছে!");
    setIsRegistered(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'}`}>
      <header className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
           <img src={APP_LOGO} className="w-8 h-8 rounded-full" alt="L" />
           <h1 className="text-lg font-bold text-pink-500">SOCIAL INSTA</h1>
        </div>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {!isRegistered ? (
        <div className="p-6 max-w-md mx-auto mt-10 bg-zinc-900 rounded-3xl">
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-center text-xl font-bold mb-6">নতুন আইডি তৈরি করুন</h2>
            <input required name="fullName" onChange={handleInputChange} placeholder="পূর্ণ নাম" className="w-full p-3 bg-zinc-800 rounded-xl" />
            <input required type="email" name="email" onChange={handleInputChange} placeholder="Gmail" className="w-full p-3 bg-zinc-800 rounded-xl" />
            <input required type="password" onChange={(e) => validatePassword(e.target.value)} placeholder="Password" className="w-full p-3 bg-zinc-800 rounded-xl" />
            {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
            
            <div className="flex justify-center py-4">
              <HCaptcha sitekey={HCAPTCHA_SITE_KEY} onVerify={(token) => setHCaptchaToken(token)} theme="dark" />
            </div>

            <button type="submit" className="w-full py-4 bg-pink-600 rounded-2xl font-bold">আইডি তৈরি করুন</button>
          </form>
        </div>
      ) : (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold">স্বাগতম, Social Insta-এ!</h2>
        </div>
      )}
    </div>
  );
}
