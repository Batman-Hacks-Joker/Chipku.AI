import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  const emojis = '😊💋😂👍😳😠🥳🔥🥺🧡😉🤓😈😍🤪🥰😘👻😏😡💖👀😤😆✨🤭🧐😪';
  const repeatedEmojis = emojis.repeat(5); // Repeat emojis for smooth loop

  return (
    <>
      <footer className="footer">
        <span>Made with 💖 for 💖 - by FanatiAK (Batman-Hacks-Joker)</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <Github width={24} height={24} />
        </a>
      </footer>

      {/* Emoji Carousel */}
      <div className="emoji-carousel" aria-hidden="true">
        <div className="emoji-track">
          {[...repeatedEmojis].map((emoji, index) => (
            <span className="emoji" key={index}>
              {emoji}
            </span>
          ))}
        </div>
      </div>

      {/* CSS Styling */}
      <style>{`
        .footer {
          width: 100%;
          text-align: center;
          padding: 16px;
          color: #6b7280; /* muted-foreground */
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .github-link {
          transition: color 0.3s;
          color: inherit;
        }

        .github-link:hover {
          color: #3b82f6; /* primary color */
        }

        .emoji-carousel {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }

        .emoji-track {
          display: inline-block;
          font-size: 6vw;
          animation: scroll 30s linear infinite;
        }

        .emoji {
          display: inline-block;
          transition: transform 0.3s ease-in-out;
        }

        .emoji-carousel:hover .emoji-track {
          animation-play-state: paused;
        }

        .emoji-carousel:hover .emoji {
          transform: rotate(-45deg);
        }

        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

export default Footer;
