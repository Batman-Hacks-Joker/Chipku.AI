
"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A8 8 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.816 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const LoginPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F3D5E2] dark:bg-gray-900 p-4 font-body">
            <style jsx>{`
                @keyframes running-border {
                    0% {
                        top: -1.5rem;
                        left: -1.5rem;
                    }
                    25% {
                        top: -1.5rem;
                        left: calc(100% - 1.5rem);
                    }
                    50% {
                        top: calc(100% - 1.5rem);
                        left: calc(100% - 1.5rem);
                    }
                    75% {
                        top: calc(100% - 1.5rem);
                        left: -1.5rem;
                    }
                    100% {
                        top: -1.5rem;
                        left: -1.5rem;
                    }
                }

                .running-emoji {
                    position: absolute;
                    font-size: 2rem;
                    animation: running-border 8s linear infinite;
                }
            `}</style>
            <div className="relative w-full max-w-md">
                <div className="running-emoji">🏃</div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C21E56] to-[#A629D3] rounded-3xl blur opacity-75"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white dark:bg-gray-700 p-3 rounded-xl shadow-md">
                            <ArrowRight className="text-[#C21E56]" size={24} />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-2 font-headline text-gray-800 dark:text-white">Sign in with email</h1>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
                        Make a new doc to bring your words, data, and teams together. For free
                    </p>

                    <form className="space-y-6">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                type="email"
                                placeholder="Email"
                                className="pl-10 w-full bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#A629D3]"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                className="pl-10 pr-10 w-full bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-[#A629D3]"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        
                        <div className="text-right">
                            <a href="#" className="text-sm text-[#A629D3] hover:underline font-medium">
                                Forgot password?
                            </a>
                        </div>

                        <Button className="w-full bg-[#C21E56] hover:bg-opacity-90 text-white font-bold py-3 rounded-xl text-base transition-transform transform hover:scale-105">
                            Get Started
                        </Button>
                    </form>

                    <div className="flex items-center my-8">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">Or sign in with</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <div className="flex justify-center">
                         <Button variant="outline" className="w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-xl py-3 border border-gray-300 dark:border-gray-600">
                             <GoogleIcon className="mr-2" />
                             Sign in with Google
                         </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
