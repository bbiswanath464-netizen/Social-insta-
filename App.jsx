import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>SOCIAL INSTA</h1>
      {!isRegistered ? (
        <form onSubmit={(e) => { e.preventDefault(); setIsRegistered(true); }}>
          <input required placeholder="আপনার নাম" style={{display:'block', margin:'10px auto', padding:'10px'}} />
          <HCaptcha sitekey="0ae48e88-4eae-4e30-b682-7c386ed085f4" />
          <button type="submit" style={{display:'block', margin:'20px auto', padding:'10px 20px'}}>রেজিস্ট্রেশন করুন</button>
        </form>
      ) : (
        <h2>স্বাগতম! রেজিস্ট্রেশন সফল হয়েছে।</h2>
      )}
    </div>
  );
}
