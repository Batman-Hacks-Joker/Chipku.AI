"use client";

import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/ui/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { useDarkModeContext } from '@/context/DarkModeContext';
import { LoadingPage } from '@/components/ui/LoadingPage';

const DonatePage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [showCoupon, setShowCoupon] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [isDarkMode] = useDarkModeContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleCouponCheck = () => {
        setCouponMessage('NO coupons on your sister name🙃');
        setTimeout(() => {
            setCouponCode('');
        }, 4000);
        setTimeout(() => {
            setCouponMessage('');
        }, 4000);
    };

    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '').toUpperCase();
        if (value.length <= 10) {
            setCouponCode(value);
        }
    };

    if (loading) {
        return <LoadingPage title="Money is an evil necessity" />;
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
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-top: 1rem;
                }
                .coupon-content {
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    max-height: 0;
                    transition: max-height 0.5s ease-in-out, margin-top 0.5s ease-in-out;
                    flex-direction: row;
                }
                @media (max-width: 768px) {
                    .coupon-content {
                        flex-direction: column;
                    }
                }
                .coupon-content.show {
                    max-height: 10rem;
                    margin-top: 1rem;
                }
                .coupon-input {
                    width: 16rem;
                    padding: 0.5rem;
                    border: 1px solid #ccc;
                    border-radius: 20px;
                    margin-right: 0.5rem;
                }
                .check-button {
                    border-radius: 20px;
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
                    border-radius: 99px;
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
                .cursor-teddy:hover {
                    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='110' style='fill:black;font-size:60px;'><text y='50%'>🧸</text></svg>") 16 0, auto;
                }
                .cursor-letter:hover {
                    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='110' style='fill:black;font-size:60px;'><text y='50%'>💌</text></svg>") 16 0, auto;
                }
                .cursor-cloud:hover {
                    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' style='fill:black;font-size:75px;'><text y='50%'>☁️</text></svg>") 16 0, auto;
                }
                .cursor-heart:hover {
                    cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' style='fill:black;font-size:60px;'><text y='50%'>❤️</text></svg>") 16 0, auto;
                }
                .blur-text {
                    filter: blur(5px);
                    transition: filter 0.3s ease-in-out;
                }
                .blur-text:hover {
                    filter: blur(0);
                }
            `}</style>

            <div className={`min-h-screen font-body bg-[#F3D5E2] dark:bg-gray-900`}>
                {/* Hero Section */}
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className={`text-5xl font-headline font-bold leading-tight text-[#C21E56] dark:text-pink-500`}>
                        You are not paying for software <br /> but the fuel for ideas
                    </h1>
                    <div className="coupon-container">
                        <Button className="text-xl text-white px-8 py-3 transition-all duration-300 fancy-button" onClick={() => setShowCoupon(!showCoupon)}>
                            Got Coupon 🎉
                        </Button>
                        <div className={`coupon-content ${showCoupon ? 'show' : ''}`}>
                            <Input
                                type="text"
                                placeholder="Hint: type my gf name"
                                value={couponCode}
                                onChange={handleCouponCodeChange}
                                maxLength={10}
                                className={`coupon-input dark:bg-gray-800 dark:text-white`}
                            />
                            <Button onClick={handleCouponCheck} className="check-button">Check</Button>
                        </div>
                    </div>
                    {couponMessage && <p className="mt-2 text-red-500">{couponMessage}</p>}
                </div>

                {/* Offer Cards */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 items-stretch">
                    {/* Free Tier */}
                    <div className={`lg:col-span-2 p-8 rounded-3xl border w-full flex flex-col bg-[#FFEBEE] border-black dark:bg-black dark:border-gray-700`}>
                        <h2 className={`text-3xl font-headline font-bold text-[#C21E56] dark:text-pink-500`}>Starts at:</h2>
                        <p className={`mt-4 text-5xl font-headline font-bold blur-text text-[#C21E56] dark:text-pink-500`}>₹19 only◝(˶ˆᗜˆ˵)◜</p>
                        <ul className={`mt-6 space-y-4 text-left flex-grow text-gray-700 dark:text-gray-300`}>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> upto 150 chat uploads for free</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> upto 150 Chipku Meter generations for free</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> upto 150 Ask AI prompt for free</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> 2 trials of Correlation feature</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> Personally Chat with me</li>
                        </ul>
                        <Button className={`mt-8 text-white rounded-full px-8 py-3 transition-all duration-300 bg-[#A629D3] hover:bg-[#C21E56] dark:bg-pink-500 dark:hover:bg-pink-600`}>Start for free</Button>
                    </div>

                    {/* Premium Tier */}
                    <div className={`lg:col-span-3 p-8 rounded-3xl border shadow-2xl w-full flex flex-col bg-[#FFD1D7] border-black dark:bg-black dark:border-gray-700`}>
                        <h2 className={`text-3xl font-headline font-bold text-[#C21E56] dark:text-pink-500`}>🎀 Unlock Everything 🎀</h2>
                        <p className={`mt-4 text-5xl font-headline font-bold blur-text text-[#C21E56] dark:text-pink-500`}>₹19plus (づ๑•ᴗ•๑)づ❤︎</p>
                        <ul className={`mt-6 space-y-4 text-left text-xl flex-grow text-black-700 dark:text-gray-300`}>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> Ask AI, Chipku Meter, Correlation, Everything Free Forever</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> Get free access to future products before anyone else</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> Get Shoutout for being generous</li>
                            <li className="flex items-center"><Check className={`w-5 h-5 mr-3 text-[#A629D3] dark:text-pink-400`} /> 1 to 1 video call, so I could say Thankyou 😊</li>
                        </ul>
                        <Button className={`mt-8 text-white rounded-full px-8 py-3 transition-all duration-300 bg-[#A629D3] hover:bg-[#C21E56] dark:bg-pink-500 dark:hover:bg-pink-600`}>Download the app</Button>
                    </div>
                </div>

                {/* Emoji Sections */}
                <div className="container mx-auto px-6 py-16">
                    <h2 className={`text-4xl font-headline font-bold text-center text-[#C21E56] dark:text-pink-500`}>This money won't make me RICH</h2>
                    <p className={`text-center mt-4 text-gray-700 dark:text-gray-300`}>Your penny could assist me pay server bills, so I can keep this website always running</p>
                    <div className="grid md:grid-cols-4 gap-8 mt-12 text-left">
                        <div className="transform hover:scale-105 transition-transform duration-300 cursor-teddy">
                            <p className="text-4xl">⍝ʕ´•ᴥ•`ʔ⍝</p>
                            <h3 className={`font-headline font-bold text-lg mt-4 text-[#C21E56] dark:text-pink-400`}>Teddy Bear</h3>
                            <ul className={`mt-4 space-y-2 text-gray-700 dark:text-gray-300`}>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />It sits quietly in the corner</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Its fur carries old dreams</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />A hug brings back warmth</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Some things never age</li>
                            </ul>
                        </div>
                        <div className="transform hover:scale-105 transition-transform duration-300 cursor-letter">
                            <p className="text-4xl">જ⁀➴ ✉︎</p>
                            <h3 className={`font-headline font-bold text-lg mt-4 text-[#C21E56] dark:text-pink-400`}>Love Letter</h3>
                            <ul className={`mt-4 space-y-2 text-gray-700 dark:text-gray-300`}>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Folded paper, whispered hearts</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Ink dances with hope</li>
                                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400" />It waits, patient and brave</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Will you read it?</li>
                            </ul>
                        </div>
                        <div className="transform hover:scale-105 transition-transform duration-300 cursor-cloud">
                            <p className="text-4xl">⋆.ೃ࿔☁️ ܁ ˖*༄</p>
                            <h3 className={`font-headline font-bold text-lg mt-4 text-[#C21E56] dark:text-pink-400`}>Fluffy Cloud</h3>
                            <ul className={`mt-4 space-y-2 text-gray-700 dark:text-gray-300`}>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />They float without weight</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Thoughts gather like mist</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />A sky full of wonder</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Dreams pass overhead</li>
                            </ul>
                        </div>
                        <div className="transform hover:scale-105 transition-transform duration-300 cursor-heart">
                            <p className="text-4xl">˗ˋˏ ʚ❤︎ɞ ˎˊ˗</p>
                            <h3 className={`font-headline font-bold text-lg mt-4 text-[#C21E56] dark:text-pink-400`}>True Love</h3>
                            <ul className={`mt-4 space-y-2 text-gray-700 dark:text-gray-300`}>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />It beats without words</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />Louder when you're near</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />No map, just trust</li>
                                <li className="flex items-center"><Check className={`w-4 h-4 mr-2 text-[#A629D3] dark:text-pink-400`} />This is real</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <FloatingActionButton />
        </>
    );
};

export default DonatePage;
