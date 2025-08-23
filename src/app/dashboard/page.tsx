
"use client";
import React from 'react';
import { SlidersHorizontal, LayoutGrid, BookImage, CircleUserRound, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '@/components/ui/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingPage } from '@/components/ui/LoadingPage';
import { Button } from '@/components/ui/button';
import { useDarkModeContext } from '@/context/DarkModeContext';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


const TemplatesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 8H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 16H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 5L14.0607 7.06066L16.1213 8.12132L14.0607 9.18198L13 11.2426L11.9393 9.18198L9.87868 8.12132L11.9393 7.06066L13 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 13L16.0607 15.0607L18.1213 16.1213L16.0607 17.182L15 19.2426L13.9393 17.182L11.8787 16.1213L13.9393 15.0607L15 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const DashboardPage: React.FC = () => {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [isDarkMode] = useDarkModeContext();

    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleHomeClick = () => {
        router.push('/');
    };

    if (loading || !user) {
        return <LoadingPage title="Securing the dashboard..." />;
    }

  return (
      <>
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-headline font-bold text-primary">Hello {user.displayName?.split(' ')[0] || 'Abo'}!</h1>
            <p className="text-4xl text-muted-foreground mt-2">How can I help you today?</p>
          </div>
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-12 h-12 rounded-full shadow-xl" />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center shadow-xl">
                <CircleUserRound size={24} className="text-gray-500" />
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={logout} className="text-4xl transition-transform transform hover:scale-110 focus:outline-none" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    ⛔
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Usage */}
            <div className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group overflow-hidden",
                "bg-[#e5e6e4] dark:bg-card text-card-foreground",
                "border border-black/10 dark:border-white/10",
                "shadow-xl shadow-gray-300/40 dark:shadow-black/30"
            )}>
              <div className="flex justify-start">
                  <div className="p-2.5 bg-white/80 dark:bg-black/30 rounded-xl shadow-md">
                      <TemplatesIcon />
                  </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Usage</h3>
              </div>
              <div className="absolute bottom-4 right-4 text-5xl opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-[-360deg] transition-all duration-500 ease-in-out">
                🧐
              </div>
            </div>

            {/* Card 2: Analysis */}
            <div className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group overflow-hidden",
                "bg-[#dbcdf0] dark:bg-card text-card-foreground",
                "border border-black/10 dark:border-white/10",
                "shadow-xl shadow-purple-200/40 dark:shadow-black/30"
            )}>
              <div className="flex justify-start">
                  <div className="p-2.5 bg-white/80 dark:bg-black/30 rounded-xl shadow-md">
                      <LayoutGrid className="text-foreground" />
                  </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground">Analysis</h3>
              </div>
               <div className="absolute bottom-4 right-4 text-5xl opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-[-360deg] transition-all duration-500 ease-in-out">
                😪
              </div>
            </div>

            {/* Card 3: Unlock */}
            <div className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group overflow-hidden",
                "bg-gradient-to-br from-green-400 to-green-600",
                "border border-black/10 dark:border-white/10",
                "shadow-xl shadow-green-400/40 dark:shadow-black/30"
            )}>
               <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/30 to-transparent transform -rotate-45 scale-150 origin-bottom-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"></div>
              <div className="flex justify-start relative z-10">
                  <div className="p-2.5 bg-white/80 dark:bg-black/30 rounded-xl shadow-md">
                      <BookImage className="text-foreground" />
                  </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-semibold text-lg text-white">Unlock</h3>
              </div>
              <div className="absolute bottom-4 right-4 text-5xl opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-[-360deg] transition-all duration-500 ease-in-out z-10">
                😚
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <Footer />
    <FloatingActionButton onHomeClick={handleHomeClick} />
    </>
  );
};

export default DashboardPage;
