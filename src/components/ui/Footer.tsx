import React from 'react';

interface FooterProps {
  showEmojiCarousel?: boolean;
}

const BunnyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#4A4A4A"/>
      <rect x="8" y="11" width="8" height="2" fill="white" rx="1"/>
    </svg>
);


const Footer: React.FC<FooterProps> = ({ showEmojiCarousel = true }) => {
  const emojis = '😊🥴💋🤤😂👍😳😠🥳🔥🥺🧡😉🥱🤓😈😍🤪🥰😘😎👻😏😡💖👀😤😆✨🤭🧐😪';
  const repeatedEmojis = emojis.repeat(5); // Repeat emojis for smooth loop

  return (
    <>
      <footer className="footer">
        <div className="first-line">Made with 💖 for 💖</div>
        <div className="second-line">
          <a
            href="https://github.com/Batman-Hacks-Joker"
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <BunnyIcon />
          </a>
          <span className="developer-credit">- by <a href="https://github.com/Batman-Hacks-Joker" target="_blank" rel="noopener noreferrer">FanatiAK</a> or (<a href="https://github.com/Batman-Hacks-Joker" target="_blank" rel="noopener noreferrer">github.com/Batman-Hacks-Joker</a>)</span>
        </div>
      </footer>

      {/* Emoji Carousel */}
      {showEmojiCarousel && (
        <div className="emoji-carousel" aria-hidden="true">
          <div className="emoji-track">
            {[...repeatedEmojis].map((emoji, index) => (
              <span className="emoji" key={index}>
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

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
        }

        .developer-credit {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="50%" y="50%" style="dominant-baseline:central; text-anchor:middle; font-size: 30px;">😎</text></svg>') 20 20, auto;
        }
        
        .developer-credit a {
          text-decoration: underline;
          color: inherit;
          transition: color 0.3s;
        }
        
        .developer-credit a:hover {
           color: #3b82f6; /* primary color */
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
