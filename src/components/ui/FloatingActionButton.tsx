import React, { useState, useRef, useEffect } from 'react';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const emoji = isOpen ? '😱' : isHovered ? '😯' : '😳';

  const buttons = [
    { defaultLabel: '🏛️', hoverLabel: '🏛️ Home Page' },
    { defaultLabel: '✍️', hoverLabel: '✍️ Signup/Login' },
    { defaultLabel: '☠️', hoverLabel: '☠️ Correlation' },
    { defaultLabel: '🌓', hoverLabel: '🌓 Dark Mode' },
    { defaultLabel: '🤑', hoverLabel: '🤑 Donate Me' },
  ];

  // 👉 Close menu on outside click
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
        {buttons.map((label, index) => (
          <button
            key={label.defaultLabel}
            className={`
              px-6 py-4 text-lg
              ${label.defaultLabel === '☠️' ? 'bg-yellow-500' : 'bg-red-500'}
              text-white font-bold rounded-full shadow-lg transform transition-all
              duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
              ${isOpen ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-90'}
              hover:bg-red-600
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
            onMouseEnter={(e) => (e.currentTarget.textContent = label.hoverLabel)}
            onMouseLeave={(e) => (e.currentTarget.textContent = label.defaultLabel)}
          >
            {label.defaultLabel}
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
