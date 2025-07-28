"use client";

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/ui/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { useRouter } from 'next/navigation';

const DonatePage: React.FC = () => {
    const router = useRouter();
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState('');

    const handleHomeClick = () => {
        router.push('/');
    }

    const handleCouponCheck = () => {
        setCouponMessage('NO coupons on your sister name🙃');
        setTimeout(() => {
            setCouponCode('');
        }, 4000);
        setTimeout(() => {
            setCouponMessage('');
        }, 4000);
    }

    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '').toUpperCase();
        if (value.length <= 10) {
            setCouponCode(value);
        }
    }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400&display=swap');
        .font-headline {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-body {
          font-family: 'Inter', sans-serif;
        }
        .coupon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 1rem;
        }
        .coupon-container > div {
            display: flex;
            align-items: center;
            transition: all 0.5s ease-in-out;
        }
        .coupon-input {
            width: 0;
            padding: 0;
            border: 0;
            opacity: 0;
            transition: all 0.5s ease-in-out;
            border-radius: 20px;
        }
        .coupon-input.show {
            width: 16rem;
            padding: 0.5rem;
            border: 1px solid #ccc;
            opacity: 1;
        }
        .check-button {
            opacity: 0;
            transition: all 0.5s ease-in-out;
            border-radius: 20px;
        }
        .check-button.show {
            opacity: 1;
        }
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .fancy-button {
          background: linear-gradient(
            -45deg,
            #00BFFF,#1E90FF,#3A5FCD,#000080,#8A2BE2,#FF1493,#FF4500, #90EE90, #FFFFE0, #ADD8E6, #00FFFF, #40E0D0, #FFB6C1, #722F37
          );
          background-size: 400% 400%;
          animation: gradient-animation 7s ease infinite;
          border-image: linear-gradient(to right, #C21E56, #A629D3) 1;
          border-radius: 99px; /* max curviness */
          padding: 0.75rem 1.5rem;
          color: white;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);

          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease-in-out;
        }

        .fancy-button:hover {
          animation-duration: 3s;
          box-shadow: 
            0 0 40px rgba(194, 30, 86, 0.8), 
            0 0 50px rgba(166, 41, 211, 0.8);
          transform: scale(1.05);
        }

        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <div className="bg-[#F3D5E2] min-h-screen font-body">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-headline font-bold text-[#C21E56] leading-tight">
            You are not paying for software <br /> but the fuel for ideas
          </h1>
          <div className="coupon-container">
            <Button 
              className="text-xl text-white px-8 py-3 transition-all duration-300 fancy-button"
              onClick={() => setShowCoupon(!showCoupon)}
            >
              Got Coupon 🎉
            </Button>
            <div className={`space-x-2 ${showCoupon ? 'ml-4' : ''}`}>
              <Input 
                type="text" 
                placeholder="Hint: type my gf name"
                value={couponCode}
                onChange={handleCouponCodeChange}
                maxLength={10}
                className={`coupon-input ${showCoupon ? 'show' : ''}`}
              />
              <Button onClick={handleCouponCheck} className={`check-button ${showCoupon ? 'show' : ''}`}>Check</Button>
            </div>
          </div>
          {couponMessage && <p className="mt-2 text-red-500">{couponMessage}</p>}
        </div>

        <div className="container mx-auto px-6 pb-16 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 bg-[#FFEBEE] p-8 rounded-3xl border border-black">
            <h2 className="text-3xl font-headline font-bold text-[#C21E56]">Starts at:</h2>
            <ul className="mt-6 space-y-4 text-left text-gray-700">
            <p className="mt-4 text-5xl font-headline font-bold text-[#C21E56]">₹19 only◝(˶ˆᗜˆ˵)◜</p>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>upto 150 chat uploads for free</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>upto 150 Chipku Meter generations for free</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span> upto 150 Ask AI prompt for free</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>2 trials of Correlation feature</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>Personally Chat with me</span>
              </li>
            </ul>
            <Button className="mt-8 bg-[#A629D3] text-white hover:bg-[#C21E56] rounded-full px-8 py-3 transition-all duration-300">
              Start for free
            </Button>
          </div>

          <div className="md:col-span-3 bg-[#FFD1D7] p-8 rounded-3xl border border-black shadow-2xl">
            <h2 className="text-3xl font-headline font-bold text-[#C21E56]">🎀 Unlock Everything 🎀</h2>
            <p className="mt-4 text-5xl font-headline font-bold text-[#C21E56]">₹19 plus (づ๑•ᴗ•๑)づ❤︎</p>
            <ul className="mt-6 space-y-4 text-left text-black-700 text-xl">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span> Ask AI, Chipku Meter, Correlation, Everything Free Forever</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>Get free access to future products before anyone else</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>Get Shoutout for being generous</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-[#A629D3] mr-3" />
                <span>1 to 1 video call, so I could say Thankyou 😊</span>
              </li>
            </ul>
            <Button className="mt-8 bg-[#A629D3] text-white hover:bg-[#C21E56] rounded-full px-8 py-3 transition-all duration-300">
              Download the app
            </Button>
          </div>
          
        </div>

        <div className="container mx-auto px-6 py-16">
          <h2 className="text-4xl font-headline font-bold text-center text-[#C21E56]">What's included?</h2>
          <p className="text-center text-gray-700 mt-4">
            Access the full Critter platform for less than the cost of one service per month.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-12 text-left">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-4xl">🧸</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Scheduling</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Calendar management</span></li>
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Meet and Greets</span></li>
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Service history</span></li>
                <li className="flex.items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Employee management</span></li>
              </ul>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-4xl">💌</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Invoicing</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Flexible invoicing</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>In-app payments</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Stripe integration</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Automation</span></li>
              </ul>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-4xl">☁️</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Client management</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Onboarding workflow</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>In-app communications</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Policy and record management</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Care plan and instructions</span></li>
              </ul>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-4xl">❤️</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Critter Support</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>White glove support</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Phone, email, & video access</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Hands-on training</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Onboarding support</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActionButton onHomeClick={handleHomeClick} />
    </>
  );
};

export default DonatePage;
