import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FloatingActionButtonProps {
  onHomeClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onHomeClick }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const emoji = isOpen ? '😱' : isHovered ? '😯' : '😳';

  const buttons = [
    { label: '🏛️', hover: '🏛️ Home Page', route: '/' },
    { label: '✍️', hover: '✍️ Signup/Login', route: '/login' },
    { label: '☠️', hover: '☠️ Correlation', route: '/correlation' },
    { label: '🌓', hover: '🌓 Dark Mode', route: '/dark' },
    { label: '🤑', hover: '🤑 Donate Me', route: '/donate' },
  ];

  const handleButtonClick = (route?: string) => {
    if (route === '/' && onHomeClick) {
      onHomeClick();
    }
    setIsOpen(false);
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

  return (
    <div ref={wrapperRef} className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      <div className="flex flex-col items-end space-y-2 mb-2 origin-bottom-right">
        {buttons.map((btn, index) => (
          <button
            key={btn.label}
            className={`
              px-4 py-3 text-sm md:text-lg flex items-center space-x-2
              ${btn.label === '☠️' ? 'bg-yellow-500' : 'bg-red-500'}
              text-white font-bold rounded-full shadow-lg transform transition-all
              duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${isOpen ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-90'}
              hover:bg-red-600
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={() => handleButtonClick(btn.route)}
            {...(!isMobile && {
              onMouseEnter: (e) => (e.currentTarget.textContent = btn.hover),
              onMouseLeave: (e) => (e.currentTarget.textContent = btn.label),
            })}
            title={btn.hover} // Always show title
          >
            {btn.label}
            {isMobile && isOpen && <span className="ml-2">{btn.hover.replace(/^.*?\s/, '')}</span>}
          </button>
        ))}
      </div>

      <button
        className="p-2 text-6xl transition-transform transform hover:scale-125"
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