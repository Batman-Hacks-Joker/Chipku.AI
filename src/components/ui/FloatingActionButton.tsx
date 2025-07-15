import React, { useState } from 'react';

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const emoji = isOpen ? '😱' : (isHovered ? '😯' : '😳');

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end">
      {isOpen && (
        <div
          className="flex flex-col items-end space-y-2 mb-2 transition-all duration-300 ease-in-out transform origin-bottom-right
                     opacity-100 scale-100"
        >
          {/* Placeholder buttons */}
          <button className="p-2 bg-red-500 text-black font-bold rounded-full shadow-lg">
            <span className="text-white font-bold">Home</span>
          </button>
          <button className="p-2 bg-red-500 text-black font-bold rounded-full shadow-lg">
            <span className="text-white font-bold">Signup</span>
          </button>
          <button className="p-2 bg-red-500 text-black font-bold rounded-full shadow-lg">
            <span className="text-white font-bold">Correlation</span>
          </button>
          <button className="p-2 bg-red-500 text-black font-bold rounded-full shadow-lg">
            <span className="text-white font-bold">Dark</span>
          </button>
          <button className="p-2 bg-red-500 text-white font-bold rounded-full shadow-lg">
            <span className="text-white font-bold">Donate</span>
          </button>
        </div>
      )}
      <button
        className="p-2 text-6xl"
        onClick={toggleOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {emoji}
      </button>
    </div>
  );
};

export default FloatingActionButton;