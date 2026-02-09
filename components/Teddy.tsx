import React, { useEffect, useState } from 'react';
import { Emotion, TeddyPart } from '../types';

interface TeddyProps {
  emotion: Emotion;
  hasNote?: boolean;
  overlays?: {
    bomb?: boolean;
    slash?: boolean;
    slap?: 'left' | 'right' | null;
    lipstick?: boolean;
    shower?: boolean;
  };
  onInteract: (part: TeddyPart) => void;
  onLongPress: () => void;
}

const Teddy: React.FC<TeddyProps> = ({ emotion, hasNote, overlays, onInteract, onLongPress }) => {
  const [blink, setBlink] = useState(false);
  const isShowering = overlays?.shower;

  // Natural Blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (![Emotion.SLEEP, Emotion.SHOCKED, Emotion.CRY, Emotion.DIZZY, Emotion.HURT].includes(emotion) && !isShowering) {
        setBlink(true);
        setTimeout(() => setBlink(false), 180);
      }
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, [emotion, isShowering]);

  // Handle long press via timer
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

  // --- Animation State Logic ---
  let animClass = 'animate-float'; // Default idle
  if (emotion === Emotion.HUG) animClass = 'scale-110';
  if (emotion === Emotion.GIGGLE) animClass = 'animate-shiver';
  if (emotion === Emotion.DIZZY) animClass = 'animate-wiggle';
  if (emotion === Emotion.KISS) animClass = 'scale-105';
  if (emotion === Emotion.SLEEP) animClass = 'animate-breathe grayscale-[0.2]';
  if (emotion === Emotion.SCARED) animClass = 'animate-tremble';
  if (emotion === Emotion.SHOCKED) animClass = 'scale-95';

  // Happy bounce during shower
  if (isShowering) animClass = 'animate-bounce-soft';

  // Slap takes priority - using the new "snap" animations
  if (overlays?.slap === 'left') animClass = 'animate-slap-left-snap origin-bottom';
  if (overlays?.slap === 'right') animClass = 'animate-slap-right-snap origin-bottom';

  // Body shake after slap (if hurt but not currently slapping)
  if (emotion === Emotion.HURT && !overlays?.slap) animClass = 'animate-impact-shake';

  // Face Filter for "Soot" effect (Disabled if showering)
  const faceFilter = (emotion === Emotion.SHOCKED || (emotion === Emotion.CRY && overlays?.bomb)) && !isShowering ? 'brightness(0.3) sepia(0.6)' : 'none';

  // --- Drawing Logic ---

  // Mouth
  let mouthPath = "M96,108 Q100,112 104,108"; // Tiny cute smile
  let mouthFill = "transparent";

  if (isShowering) {
    mouthPath = "M94,108 Q100,116 106,108"; // Happy smile closed eyes
  } else if (emotion === Emotion.KISS) {
    mouthPath = "M98,106 Q100,108 102,106 Q102,112 98,112 Q96,108 98,106";
    mouthFill = "#D65A5A";
  } else if (emotion === Emotion.EATING || emotion === Emotion.GIGGLE || emotion === Emotion.HAPPY) {
    mouthPath = "M94,108 Q100,120 106,108 Q100,104 94,108"; // D shape open mouth
    mouthFill = "#5D4037";
  } else if (emotion === Emotion.SLEEP) {
    mouthPath = "M98,110 Q100,111 102,110";
  } else if (emotion === Emotion.DIZZY || emotion === Emotion.HURT) {
    mouthPath = "M94,115 Q100,105 106,115"; // Sad Frown
  } else if (emotion === Emotion.CRY) {
    mouthPath = "M92,112 Q100,100 108,112"; // Wailing open
    mouthFill = "#3E2723";
  } else if (emotion === Emotion.SHOCKED) {
    mouthPath = "M97,110 Q100,118 103,110"; // Tiny O
  } else if (emotion === Emotion.SCARED) {
    mouthPath = "M94,112 Q97,108 100,112 Q103,108 106,112"; // Zigzag
  }

  // Eyes
  const renderEyes = () => {
    // Sleeping or Showering (Enjoyment)
    if (emotion === Emotion.SLEEP || isShowering) {
      return (
        <g stroke="#4A3B2C" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M72,85 Q82,92 92,85" /><path d="M108,85 Q118,92 128,85" />
        </g>
      );
    }
    // X Eyes
    if (emotion === Emotion.DIZZY || emotion === Emotion.SHOCKED) {
      return (
        <g stroke={emotion === Emotion.SHOCKED ? "#FFF" : "#4A3B2C"} strokeWidth="4" strokeLinecap="round">
          <path d="M72,78 L90,92" /><path d="M90,78 L72,92" />
          <path d="M110,78 L128,92" /><path d="M128,78 L110,92" />
        </g>
      );
    }
    // Crying / Pain (Squinting hard)
    if (emotion === Emotion.HURT || emotion === Emotion.CRY) {
      return (
        <g stroke="#4A3B2C" strokeWidth="4" strokeLinecap="round" fill="none">
          <path d="M72,85 L80,90 L72,95" /> {/* < shape */}
          <path d="M90,85 L82,90 L90,95" /> {/* > shape */}

          <path d="M110,85 L118,90 L110,95" />
          <path d="M128,85 L120,90 L128,95" />
        </g>
      );
    }
    // Scared (Tiny pupils)
    if (emotion === Emotion.SCARED) {
      return (
        <g>
          <circle cx="81" cy="85" r="10" fill="white" stroke="#3E2723" strokeWidth="1" />
          <circle cx="81" cy="85" r="2" fill="#000" />
          <circle cx="119" cy="85" r="10" fill="white" stroke="#3E2723" strokeWidth="1" />
          <circle cx="119" cy="85" r="2" fill="#000" />
        </g>
      )
    }
    // Happy Arches
    if (emotion === Emotion.GIGGLE || emotion === Emotion.HAPPY || emotion === Emotion.KISS) {
      return (
        <g stroke="#4A3B2C" strokeWidth="4" fill="none" strokeLinecap="round">
          <path d="M72,90 Q81,78 90,90" /><path d="M110,90 Q119,78 128,90" />
        </g>
      );
    }

    // Default: ULTRA CUTE GLOSSY EYES
    return (
      <g>
        {/* Left Eye */}
        <ellipse cx="81" cy="88" rx="11" ry="12" fill="#3E2723" />
        <ellipse cx="81" cy="88" rx="6" ry="7" fill="#000" />
        {/* Shine Highlights */}
        <circle cx="85" cy="84" r="4.5" fill="white" opacity="0.9" />
        <circle cx="78" cy="92" r="2" fill="white" opacity="0.7" />

        {/* Right Eye */}
        <ellipse cx="119" cy="88" rx="11" ry="12" fill="#3E2723" />
        <ellipse cx="119" cy="88" rx="6" ry="7" fill="#000" />
        {/* Shine Highlights */}
        <circle cx="123" cy="84" r="4.5" fill="white" opacity="0.9" />
        <circle cx="116" cy="92" r="2" fill="white" opacity="0.7" />

        {/* Eyelids for blinking */}
        <g className={`${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
          <path d="M70,88 Q81,98 92,88" stroke="#E6B065" strokeWidth="24" fill="none" strokeLinecap="round" />
          <path d="M108,88 Q119,98 130,88" stroke="#E6B065" strokeWidth="24" fill="none" strokeLinecap="round" />
        </g>
      </g>
    );
  };

  return (
    <div className={`relative w-80 h-80 sm:w-96 sm:h-96 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${animClass}`}>
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#F4C886" />
            <stop offset="100%" stopColor="#D49E55" />
          </radialGradient>
          <radialGradient id="snoutGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFBF5" />
            <stop offset="100%" stopColor="#F8E2C2" />
          </radialGradient>
          <radialGradient id="earGrad" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#8D6E63" />
            <stop offset="100%" stopColor="#5D4037" />
          </radialGradient>
          <filter id="blushBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>
        </defs>

        {/* === MAIN TEDDY GROUP === */}
        <g style={{ filter: faceFilter }} className="transition-[filter] duration-500">

          {/* Left Ear (Rounder) */}
          <g className="origin-[50px_60px] animate-ear-wiggle-left hover:scale-105 transition-transform" onClick={() => onInteract('left_ear')}>
            <circle cx="45" cy="60" r="24" fill="url(#bodyGrad)" />
            <circle cx="45" cy="60" r="14" fill="url(#earGrad)" opacity="0.7" />
          </g>

          {/* Right Ear (Rounder) */}
          <g className="origin-[150px_60px] animate-ear-wiggle-right hover:scale-105 transition-transform" onClick={() => onInteract('right_ear')}>
            <circle cx="155" cy="60" r="24" fill="url(#bodyGrad)" />
            <circle cx="155" cy="60" r="14" fill="url(#earGrad)" opacity="0.7" />
          </g>

          {/* Body (Smaller/Stubbier) */}
          <g onClick={() => onInteract('belly')}>
            {/* Main Body */}
            <ellipse cx="100" cy="175" rx="55" ry="48" fill="url(#bodyGrad)" />
            {/* Belly Patch */}
            <ellipse cx="100" cy="180" rx="32" ry="28" fill="url(#snoutGrad)" opacity="0.5" />
          </g>

          {/* Legs (Stubby) */}
          <ellipse cx="65" cy="205" rx="18" ry="14" fill="url(#bodyGrad)" />
          <ellipse cx="135" cy="205" rx="18" ry="14" fill="url(#bodyGrad)" />
          {/* Paws */}
          <circle cx="65" cy="208" r="5" fill="#8D6E63" opacity="0.3" />
          <circle cx="135" cy="208" r="5" fill="#8D6E63" opacity="0.3" />

          {/* Arms (Short & Cute) */}
          <g className={`transition-all duration-500 origin-[55px_155px] animate-hand-wave ${hasNote ? '-rotate-[15deg]' : (emotion === Emotion.HUG ? 'rotate-45' : (isShowering ? '-rotate-12' : 'rotate-0'))}`}>
            <ellipse cx="45" cy="155" rx="16" ry="24" fill="url(#bodyGrad)" />
          </g>
          <g className={`transition-all duration-500 origin-[145px_155px] animate-hand-wave ${hasNote ? 'rotate-[20deg]' : (emotion === Emotion.HUG ? '-rotate-45' : (isShowering ? 'rotate-12' : 'rotate-0'))}`} style={{ animationDelay: '0.5s' }}>
            <ellipse cx="155" cy="155" rx="16" ry="24" fill="url(#bodyGrad)" />
          </g>

          {/* LETTER (In Hand) */}
          {hasNote && (
            <g transform="translate(82, 135) rotate(-5)" onClick={(e) => { e.stopPropagation(); onInteract('note'); }} className="cursor-pointer hover:scale-110 transition-transform origin-center">
              <rect x="0" y="0" width="36" height="26" rx="3" fill="#FFF" stroke="#DDD" strokeWidth="1" filter="drop-shadow(0px 3px 2px rgba(0,0,0,0.1))" />
              <path d="M0,0 L18,14 L36,0" fill="#F8F8F8" stroke="#DDD" strokeWidth="1" />
              <circle cx="18" cy="14" r="4" fill="#FF5252" />
            </g>
          )}

          {/* HEAD (BIG & CUTE) */}
          <g onClick={() => onInteract('head')} className="origin-[100px_100px]">
            {/* Head Shape */}
            <circle cx="100" cy="90" r="62" fill="url(#bodyGrad)" />

            {/* Snout Area (Lower) */}
            <ellipse cx="100" cy="105" rx="24" ry="18" fill="url(#snoutGrad)" />

            {/* Nose (Cute Button) */}
            <g onClick={(e) => { e.stopPropagation(); onInteract('nose'); }}>
              <path d="M94,98 Q100,94 106,98 Q100,108 94,98 Z" fill="#4A3B2C" />
              <circle cx="98" cy="97" r="1.5" fill="white" opacity="0.4" />
            </g>

            {/* Mouth */}
            <path d={mouthPath} fill={mouthFill} strokeWidth="3" strokeLinecap="round" className="stroke-[#4A3B2C] transition-all duration-200" />

            {/* Eyes */}
            {renderEyes()}

            {/* PERMANENT BLUSH (Cute Factor) */}
            <ellipse cx="65" cy="102" rx="14" ry="8" fill="#FFAB91" filter="url(#blushBlur)" opacity="0.4" />
            <ellipse cx="135" cy="102" rx="14" ry="8" fill="#FFAB91" filter="url(#blushBlur)" opacity="0.4" />

            {/* Stronger Blush for emotion */}
            <ellipse cx="65" cy="102" rx="14" ry="8" fill="#FF5252" filter="url(#blushBlur)" className={`transition-opacity duration-500 ${emotion === Emotion.BLUSH || emotion === Emotion.KISS ? 'opacity-60' : 'opacity-0'}`} />
            <ellipse cx="135" cy="102" rx="14" ry="8" fill="#FF5252" filter="url(#blushBlur)" className={`transition-opacity duration-500 ${emotion === Emotion.BLUSH || emotion === Emotion.KISS ? 'opacity-60' : 'opacity-0'}`} />

            {/* Slap Mark - Handprint (Instant appearance) */}
            {emotion === Emotion.HURT && (
              <g opacity="0.6" className="animate-scale-in">
                {overlays?.slap === 'left' && <path d="M55,80 L70,85 L65,110 L50,105 Z" fill="#FF0000" filter="url(#blushBlur)" />}
                {overlays?.slap === 'right' && <path d="M145,80 L130,85 L135,110 L150,105 Z" fill="#FF0000" filter="url(#blushBlur)" />}
              </g>
            )}

            {/* Lipstick Mark */}
            {overlays?.lipstick && (
              <g transform="translate(120, 90) rotate(-15)" className="animate-pop-in">
                <path d="M0,0 Q6,6 12,0 Q18,-6 24,0 Q12,18 0,0" fill="#E91E63" opacity="0.9" />
              </g>
            )}

            {/* Tears */}
            {emotion === Emotion.CRY && (
              <g>
                <path d="M72,95 Q68,110 72,125" stroke="#4FC3F7" strokeWidth="3" fill="none" className="animate-wiggle" />
                <circle cx="72" cy="130" r="4" fill="#4FC3F7" className="animate-bounce-soft" />

                <path d="M128,95 Q132,110 128,125" stroke="#4FC3F7" strokeWidth="3" fill="none" className="animate-wiggle" style={{ animationDelay: '0.1s' }} />
                <circle cx="128" cy="130" r="4" fill="#4FC3F7" className="animate-bounce-soft" style={{ animationDelay: '0.1s' }} />
              </g>
            )}
          </g>

          {/* Sleeping Zzz */}
          {emotion === Emotion.SLEEP && (
            <g className="animate-pulse">
              <text x="150" y="50" fontSize="30" fill="white" style={{ opacity: 0.9, fontFamily: 'Fredoka, sans-serif' }}>z</text>
              <text x="175" y="30" fontSize="20" fill="white" style={{ opacity: 0.7, fontFamily: 'Fredoka, sans-serif' }}>z</text>
            </g>
          )}
        </g>

        {/* === WEATHER / SHOWER EFFECTS === */}
        {isShowering && (
          <g pointerEvents="none">
            {/* Rain */}
            {[...Array(12)].map((_, i) => (
              <line key={`rain-${i}`}
                x1={30 + i * 14 + (i % 2) * 5} y1="-20"
                x2={30 + i * 14 + (i % 2) * 5} y2="5"
                stroke="#4FC3F7" strokeWidth="2" strokeLinecap="round"
                className="animate-rain"
                style={{ animationDelay: `${i * 0.1}s`, opacity: 0.6 }} />
            ))}
            {/* Soap Bubbles */}
            {[...Array(6)].map((_, i) => (
              <circle key={`bub-${i}`}
                cx={40 + i * 25} cy="220"
                r={4 + (i % 3) * 3}
                fill="white" stroke="#E1F5FE" strokeWidth="1"
                className="animate-bubble"
                style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </g>
        )}

        {/* === IMPACT EFFECTS (Overlays) === */}

        {/* Slap Impact Star (Comic Style) */}
        {emotion === Emotion.HURT && overlays?.slap && (
          <g className="animate-flash origin-center impact-star" transform={overlays.slap === 'left' ? "translate(40, 70)" : "translate(130, 70)"}>
            <polygon points="10,0 13,7 20,10 13,13 10,20 7,13 0,10 7,7" fill="#FFF" stroke="#FF5252" strokeWidth="2" transform="scale(3)" />
          </g>
        )}

        {/* Bomb Explosion */}
        {overlays?.bomb && (
          <g className="animate-pop-in origin-center">
            <path d="M100,40 L120,80 L160,70 L130,110 L170,150 L120,140 L100,190 L80,140 L30,150 L70,110 L40,70 L80,80 Z" fill="#FFD54F" stroke="#FF7043" strokeWidth="3" />
          </g>
        )}

        {/* Knife Slash */}
        {overlays?.slash && (
          <g>
            <path d="M40,160 L160,40" stroke="#FFF" strokeWidth="6" strokeLinecap="round" className="animate-fade-out" />
          </g>
        )}

        {/* INTERACTION HITBOXES (Invisible) */}
        {/* Face Hitboxes for Slapping */}
        <rect x="40" y="60" width="60" height="90" fill="transparent" style={{ cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); onInteract('face_left'); }} />
        <rect x="100" y="60" width="60" height="90" fill="transparent" style={{ cursor: 'pointer' }}
          onClick={(e) => { e.stopPropagation(); onInteract('face_right'); }} />

      </svg>
    </div>
  );
};

export default Teddy;