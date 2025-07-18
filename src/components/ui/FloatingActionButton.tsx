import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useDarkMode from '@/hooks/use-dark-mode'; // Ensure this hook is stable and SSR-compatible

interface FloatingActionButtonProps {
  onHomeClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onHomeClick }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  // Detect screen size (SSR-safe)
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const emoji = isOpen ? '😱' : isHovered ? '😯' : '😳';

  const buttons = [
    { label: '🏛️', hover: '🏛️ Home Page', route: '/' },
    { label: '✍️', hover: '✍️ Signup/Login', route: '/login' },
    { label: '☠️', hover: '☠️ Correlation', route: '/correlation' },
    { label: '🤑', hover: '🤑 Donate Me', route: '/donate' },
  ];

  const darkModeButton = {
    label: isDarkMode ? '💡' : '🌙',
    hover: isDarkMode ? '💡 Light Mode' : '🌙 Dark Mode',
    onClick: toggleDarkMode,
  };

  const handleButtonClick = (route?: string) => {
    setIsOpen(false);
    if (route === '/' && onHomeClick) onHomeClick();
    if (route) router.push(route);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getHoverHandlers = (hoverText: string, labelText: string) => {
    if (isMobile) return {};
    return {
      onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
        const span = e.currentTarget.querySelector('span');
        if (span) span.textContent = hoverText;
      },
      onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
        const span = e.currentTarget.querySelector('span');
        if (span) span.textContent = labelText;
      },
    };
  };

  return (
    <div ref={wrapperRef} className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      <div className="flex flex-col items-end space-y-2 mb-2 origin-bottom-right">
        {[...buttons, darkModeButton].map((btn, index) => (
          <button
            key={btn.label}
            className={`
              px-4 py-3 text-sm md:text-lg flex items-center space-x-2
              ${btn.label === '☠️' ? 'bg-yellow-500' : 'bg-red-500'}
              text-white font-bold rounded-full shadow-lg transform transition-all
              duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${isOpen ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-90'}
              hover:bg-red-600 dark:hover:bg-red-400
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={() => {
              if (btn.route) {
                handleButtonClick(btn.route);
              } else if (typeof btn.onClick === 'function') {
                btn.onClick();
              }
            }}
            title={'hover' in btn ? btn.hover : ''}
            {...getHoverHandlers('hover' in btn ? btn.hover : '', btn.label)}
          >
            <span>{btn.label}</span>
            {isMobile && isOpen && 'hover' in btn && (
              <span className="ml-2">{btn.hover.replace(/^.*?\s/, '')}</span>
            )}
          </button>
        ))}
      </div>

      <button
        className="p-2 text-6xl transition-transform transform hover:scale-125 dark:text-white text-gray-800"
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Toggle action buttons"
      >
        {emoji}
      </button>
    </div>
  );
};

export default FloatingActionButton;