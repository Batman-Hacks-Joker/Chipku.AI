
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
    <div className="min-h-screen bg-[#F7F9F9] dark:bg-[#0D0D0D] text-[#0D0D0D] dark:text-[#F7F9F9] font-sans">
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        <header className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-5xl font-bold text-[#0A2E29] dark:text-[#E0F2F1]">Hello {user.displayName?.split(' ')[0] || 'Abo'}!</h1>
            <p className="text-4xl text-[#6B8280] dark:text-[#9CBDBA] mt-2">How can I help you today?</p>
          </div>
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-12 h-12 rounded-full" />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <CircleUserRound size={24} className="text-gray-500" />
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-destructive">
              <LogOut size={24} />
            </Button>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Templates */}
            <div className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group",
                "bg-gradient-to-br from-white via-blue-50 to-purple-100 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20",
                "border border-gray-200/50 dark:border-white/10",
                "shadow-lg shadow-gray-200/20 dark:shadow-black/20 text-black dark:text-white"
            )}>
              <div className="flex justify-start">
                  <div className="p-2.5 bg-white/60 dark:bg-black/20 rounded-xl shadow-sm">
                      <TemplatesIcon />
                  </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#0A2E29] dark:text-[#E0F2F1]">Templates</h3>
              </div>
            </div>

            {/* Card 2: Agents */}
            <div className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group",
                "bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-900/20 dark:to-gray-900/20",
                "border border-gray-200/50 dark:border-white/10",
                "shadow-lg shadow-gray-200/20 dark:shadow-black/20 text-black dark:text-white"
            )}>
              <div className="flex justify-start">
                  <div className="p-2.5 bg-white/60 dark:bg-black/20 rounded-xl shadow-sm">
                      <LayoutGrid className="text-[#0D0D0D] dark:text-[#F7F9F9]" />
                  </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#0A2E29] dark:text-[#E0F2F1]">Agents</h3>
              </div>
            </div>

            {/* Card 3: Capabilities */}
            <div className={cn(
                "relative p-6 rounded-3xl flex flex-col justify-between h-56 group",
                "bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-gray-800 dark:via-green-900/20 dark:to-green-900/20",
                "border border-gray-200/50 dark:border-white/10",
                "shadow-lg shadow-gray-200/20 dark:shadow-black/20 text-black dark:text-white"
            )}>
              <div className="flex justify-start">
                  <div className="p-2.5 bg-white/60 dark:bg-black/20 rounded-xl shadow-sm">
                      <BookImage className="text-[#0D0D0D] dark:text-[#F7F9F9]" />
                  </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-[#0A2E29] dark:text-[#E0F2F1]">Capabilities</h3>
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
