import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  const emojis = '😊💋😂👍😳😠🥳🔥🥺🧡😉🥱🤓😈😍🤪🥰😘👻😏😡💖👀😤😆✨🤭🧐😪';
  const repeatedEmojis = emojis.repeat(5); // Repeat emojis for smooth loop

  return (
    <>
      <footer className="footer">
        <span className="first-line">Made with 💖 for 💖</span>
        <div className="second-line">
          <a
            href="https://github.com/Batman-Hacks-Joker"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <Github width={20} height={20} stroke='black' fill='white'/>
          </a>
          <span style={{ textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: '8px' }} >- by FanatiAK or (github.com/Batman-Hacks-Joker)</span>
        </div>
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

        .first-line {
          font-weight: bold;
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="50%" y="50%" style="dominant-baseline:central; text-anchor:middle; font-size: 30px;">💕</text></svg>') 20 20, auto;
        }

        .second-line {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="50%" y="50%" style="dominant-baseline:central; text-anchor:middle; font-size: 30px;">😎</text></svg>') 20 20, auto;
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
