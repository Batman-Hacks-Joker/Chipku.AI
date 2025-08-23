
"use client";
import React from 'react';
import { SlidersHorizontal, LayoutGrid, Star, CircleUserRound, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '@/components/ui/Footer';
import FloatingActionButton from '@/components/ui/FloatingActionButton';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingPage } from '@/components/ui/LoadingPage';
import { Button } from '@/components/ui/button';
import { useDarkModeContext } from '@/context/DarkModeContext';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useUsage } from '@/context/UsageContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';


const TemplatesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 8H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 16H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15 16H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 5L14.0607 7.06066L16.1213 8.12132L14.0607 9.18198L13 11.2426L11.9393 9.18198L9.87868 8.12132L11.9393 7.06066L13 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M15 13L16.0607 15.0607L18.1213 16.1213L16.0607 17.182L15 19.2426L13.9393 17.182L11.8787 16.1213L13.9393 15.0607L15 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const DashboardPage: React.FC = () => {
    const router = useRouter();
    const { user, loading, logout } = useAuth();
    const [isDarkMode] = useDarkModeContext();
    const [showAnalysisButtons, setShowAnalysisButtons] = React.useState(false);
    const [showUsageDetails, setShowUsageDetails] = React.useState(false);
    const analysisCardRef = React.useRef<HTMLDivElement>(null);
    const usageCardRef = React.useRef<HTMLDivElement>(null);


    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleHomeClick = () => {
        router.push('/');
    };
    
    const handleAnalysisCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowUsageDetails(false);
        setShowAnalysisButtons(true);
    };

    const handleUsageCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowAnalysisButtons(false);
        setShowUsageDetails(prev => !prev);
    }

    const handleNavigation = (path: string) => {
        router.push(path);
        setShowAnalysisButtons(false);
    }
    
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (analysisCardRef.current && !analysisCardRef.current.contains(event.target as Node)) {
                setShowAnalysisButtons(false);
            }
             if (usageCardRef.current && !usageCardRef.current.contains(event.target as Node)) {
                // Don't hide usage details on outside click, only by toggle
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading || !user) {
        return <LoadingPage title="Securing the dashboard..." />;
    }

  return (
      <>
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <div className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-headline font-bold text-primary">Namaste🙏 {user.displayName?.split(' ')[0] || 'Abo'}!</h1>
            <p className="text-4xl text-muted-foreground mt-2"></p>
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
             <div
                ref={usageCardRef}
                onClick={handleUsageCardClick}
                className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl",
                "bg-[#4ea5ff] dark:bg-card text-card-foreground",
                "border border-black/10 dark:border-white/10",
                "shadow-xl shadow-gray-300/40 dark:shadow-black/30"
            )}>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/80 to-transparent transform -rotate-45 scale-150 origin-bottom-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out dark:from-white/30"></div>
              <div className="flex justify-between items-start relative z-10">
                  <div className="p-2.5 bg-white/80 dark:bg-black/30 rounded-xl shadow-md">
                      <SlidersHorizontal className="text-foreground" />
                  </div>
                  <div className="text-right font-headline font-bold text-2xl text-foreground">
                      <p>just upload</p>
                      <p>&</p>
                      <p>don't count</p>
                  </div>
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="font-headline font-semibold text-lg text-foreground">Usage</h3>
              </div>
              <div className="absolute bottom-4 right-4 text-5xl opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-[-360deg] transition-all duration-500 ease-in-out z-10">
                🤨
              </div>
            </div>

            {/* Card 2: Analysis */}
            <div 
              ref={analysisCardRef}
              onClick={handleAnalysisCardClick}
              className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl",
                "bg-[#ff6978] dark:bg-card text-card-foreground",
                "border border-black/10 dark:border-white/10",
                "shadow-xl shadow-purple-200/40 dark:shadow-black/30"
            )}>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/80 to-transparent transform -rotate-45 scale-150 origin-bottom-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out dark:from-white/30"></div>
                <div className="flex justify-between items-start relative z-10">
                    <div className="p-2.5 bg-white/80 dark:bg-black/30 rounded-xl shadow-md">
                        <LayoutGrid className="text-foreground" />
                    </div>
                    <div className="text-right font-headline font-bold text-2xl text-foreground">
                        <p>it takes ✌️</p>
                        <p>for</p>
                        <p>wholesome experience</p>
                    </div>
                </div>
              <div className="relative z-10 mt-auto">
                <h3 className="font-headline font-semibold text-lg text-foreground">Analysis</h3>
              </div>
               <div className="absolute bottom-4 right-4 text-5xl opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-[-360deg] transition-all duration-500 ease-in-out z-10">
                🧐
              </div>
               {showAnalysisButtons && (
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 bg-black/10 backdrop-blur-sm rounded-3xl z-20">
                    <Button onClick={() => handleNavigation('/')} className="bg-[#ef8b9c] hover:bg-[#d43d56]/90 text-black">Analysis</Button>
                    <Button onClick={() => handleNavigation('/correlation')} className="bg-[#f08ff0] hover:bg-[#d647d6]/90 text-black">Correlation</Button>
                </div>
              )}
            </div>

            {/* Card 3: Unlock */}
            <Dialog>
              <DialogTrigger asChild>
                <div className={cn(
                    "relative p-6 rounded-3xl flex flex-col justify-between h-56 group overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl",
                    "bg-[#ffd166] dark:bg-card text-card-foreground",
                    "border border-black/10 dark:border-white/10",
                    "shadow-xl shadow-orange-200/40 dark:shadow-black/30"
                )}>
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/80 to-transparent transform -rotate-45 scale-150 origin-bottom-left opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out dark:from-white/30"></div>
                    <div className="flex justify-between items-start relative z-10">
                        <div className="p-2.5 bg-white/80 dark:bg-black/30 rounded-xl shadow-md">
                            <Star className="text-foreground" />
                        </div>
                        <div className="text-right font-headline font-bold text-2xl text-foreground">
                            <p>sooo much,</p>
                            <p>for</p>
                            <p>soooooo less!!!</p>
                        </div>
                    </div>
                  <div className="relative z-10 mt-auto">
                    <h3 className="font-headline font-semibold text-lg text-foreground">Unlock</h3>
                  </div>
                  <div className="absolute bottom-4 right-4 text-5xl opacity-0 translate-x-12 group-hover:opacity-100 group-hover:translate-x-0 group-hover:rotate-[-360deg] transition-all duration-500 ease-in-out z-10">
                    🤑
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl text-primary">Unlock Everything</DialogTitle>
                  <DialogDescription>
                    Get lifetime access to all current and future features.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-primary flex-shrink-0" /> Ask AI, Chipku Meter, Correlation, Everything Free Forever</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-primary flex-shrink-0" /> Get free access to future products before anyone else</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-primary flex-shrink-0" /> Get Shoutout for being generous</li>
                        <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-primary flex-shrink-0" /> 1 to 1 video call, so I could say Thankyou 😊</li>
                    </ul>
                </div>
                <DialogFooter>
                  <Button onClick={() => router.push('/donate')} className="w-full bg-primary hover:bg-primary/90">Unlock</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
          {showUsageDetails && <UsageDetails />}
        </main>
      </div>
    </div>
    <Footer />
    <FloatingActionButton onHomeClick={handleHomeClick} />
    </>
  );
};


const UsageDetails = () => {
    const { user } = useAuth();
    const { counts, isLoading } = useUsage();

    if (isLoading) {
        return (
            <div className="mt-8 flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <h2 className="text-2xl font-headline font-bold">Usage Details</h2>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold">User Info</h3>
                        <p><strong>Username:</strong> {user?.displayName || 'N/A'}</p>
                        <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Status</h3>
                        <p><strong>Premium User:</strong> Not Yet</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Feature Usage</h3>
                        <p><strong>Uploads:</strong> {counts.uploads}</p>
                        <p><strong>Correlations:</strong> {counts.correlations}</p>
                        <p><strong>Chipku Meter:</strong> {counts.chipkuMeter}</p>
                        <p><strong>Ask AI:</strong> {counts.askAI}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default DashboardPage;
{/**hi */}