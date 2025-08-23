import React from 'react';

interface FooterProps {
  showEmojiCarousel?: boolean;
}

const CatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M73.38,157.85c-11.36,0-20.58-9.22-20.58-20.58v-23.7c0-11.36,9.22-20.58,20.58-20.58h53.24c11.36,0,20.58,9.22,20.58,20.58v23.7c0,11.36-9.22,20.58-20.58,20.58H73.38Z" fill="currentColor" />
        <path d="M79.56,92.51c-6,0-10.86-4.87-10.86-10.87V48.55c0-6,4.87-10.87,10.86-10.87h0c6,0,10.87,4.87,10.87,10.87V81.65c0,6-4.87,10.87-10.87,10.87h0Z" fill="currentColor" />
        <path d="M120.44,92.51c6,0,10.86-4.87,10.86-10.87V48.55c0-6-4.87-10.87-10.86-10.87h0c-6,0-10.87,4.87-10.87,10.87V81.65c0,6,4.87,10.87,10.87,10.87h0Z" fill="currentColor" />
        <path d="M99.9,157.85c-11.36,0-20.58-9.22-20.58-20.58v-23.7c0-11.36,9.22-20.58,20.58-20.58h.2c11.36,0,20.58,9.22,20.58,20.58v23.7c0,11.36-9.22,20.58-20.58,20.58h-.2Z" fill="white" />
        <circle cx="99.5" cy="116.5" r="7.5" fill="black" />
        <circle cx="85.5" cy="132.5" r="5.5" fill="black" />
        <circle cx="113.5" cy="132.5" r="5.5" fill="black" />
        <path d="M147.2,126.71s-2.48,15.65-21.73,15.65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M147.2,148.6s-2.48-15.65-21.73-15.65" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
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
            <CatIcon />
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