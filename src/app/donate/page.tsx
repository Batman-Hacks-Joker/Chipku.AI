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

        .cursor-teddy:hover {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🧸</text></svg>") 16 0, auto;
        }
        .cursor-letter:hover {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>💌</text></svg>") 16 0, auto;
        }
        .cursor-cloud:hover {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>☁️</text></svg>") 16 0, auto;
        }
        .cursor-heart:hover {
            cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>❤️</text></svg>") 16 0, auto;
        }
        .blur-text {
            filter: blur(5px);
            transition: filter 0.3s ease-in-out;
        }
        .blur-text:hover {
            filter: blur(0);
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
            <p className="mt-4 text-5xl font-headline font-bold text-[#C21E56] blur-text">₹19 only◝(˶ˆᗜˆ˵)◜</p>
            <ul className="mt-6 space-y-4 text-left text-gray-700">
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
            <p className="mt-4 text-5xl font-headline font-bold text-[#C21E56] blur-text">₹19 plus (づ๑•ᴗ•๑)づ❤︎</p>
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
          <h2 className="text-4xl font-headline font-bold text-center text-[#C21E56]">This money won't make me RICH</h2>
          <p className="text-center text-gray-700 mt-4">
            Assist me pay server bills, so I make this website always running
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-12 text-left">
            <div className="transform hover:scale-105 transition-transform duration-300 cursor-teddy">
              <p className="text-4xl">⍝ʕ´•ᴥ•`ʔ⍝</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Teddy Bear</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>It sits quietly in the corner</span></li>
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Its fur carries old dreams</span></li>
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>A hug brings back warmth</span></li>
                <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Some things never age</span></li>

              </ul>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 cursor-letter">
              <p className="text-4xl">જ⁀➴ ✉︎</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Love Letter</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Folded paper, whispered hearts</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Ink dances with hope</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>It waits, patient and brave</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Will you read it?</span></li>
              </ul>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 cursor-cloud">
              <p className="text-4xl">๋࣭ ⭑☁.๋࣭ ⭑</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">Fluffy Cloud</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>They float without weight</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Thoughts gather like mist</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>A sky full of wonder</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Dreams pass overhead</span></li>
              </ul>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300 cursor-heart">
              <p className="text-4xl">˗ˋˏ ʚ❤︎ɞ ˎˊ˗</p>
              <h3 className="font-headline font-bold text-lg mt-4 text-[#C21E56]">True Love</h3>
              <ul className="mt-4 space-y-2 text-gray-700">
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>It beats without words</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>Louder when you're near</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>No map, just trust</span></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-[#A629D3] mr-2" /><span>This is real</span></li>
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
