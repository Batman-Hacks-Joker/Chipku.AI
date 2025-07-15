import React, { useState } from 'react';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const emoji = isOpen ? '😱' : isHovered ? '😯' : '😳';

  const buttons = [
    '🏛️ Home Page',
    '👌🏻 Signup/Login',
    '☠️ Correlation',
    '🌓 Dark Mode',
    '🤑 Donate Me',
  ];

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      <div className="flex flex-col items-end space-y-2 mb-2 origin-bottom-right">
        {buttons.map((label, index) => (
          <button
            key={label}
            className={`p-2 bg-red-500 text-white font-bold rounded-full shadow-lg transform transition-all
              duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
              ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-75'}
              delay-[${index * 100}ms]
            `}
          >
            {label}
          </button>
        ))}
      </div>
      <button
        className="p-2 text-6xl transition-transform transform hover:scale-110"
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