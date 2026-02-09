import React, { useState, useEffect } from 'react';
import Teddy from './components/Teddy';
import { Emotion, TeddyPart } from './types';
import { Moon, Sun, Utensils, BedDouble, X, Bomb, ShowerHead, Heart, Sword } from 'lucide-react';

const FOOD_ITEMS = ['🍕', '🍦', '🍩', '🍫', '🍪', '🍯', '🍓', '🍔'];

const SWEET_MESSAGE = 
`Dearest Prachi,
I hope it does not feel cringe🦥😂.
You are an innocent bacchiii, take care of yourself. 
Acche se padhai likhai karo, accha accha khao piyo.
Der tak soooooo or masti karo, mast raho.
Khush Raho. Stress me acchi nhi lagti.
Fir kisi acche occasion pe milte hai, bahut saari baaten karenge.
Acche se Padhna..!!
And yes, if you don't feel comfortable thenn no need to reply. Just give a good reaction.
Teddy 🧸`;

const FOOD_REACTIONS = [
  { text: "Yummy, Prachi! 😋", emotion: Emotion.HAPPY },
  { text: "Thanks Prachi! 💖", emotion: Emotion.GIGGLE },
  { text: "Prachi's the best! 🍯", emotion: Emotion.BLUSH },
  { text: "You're sweet, Prachi! 🥰", emotion: Emotion.HUG },
  { text: "So good Prachi! 🤤", emotion: Emotion.HAPPY },
  { text: "Feed me more Prachi! 🍓", emotion: Emotion.EATING },
];

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Teddy State
  const [emotion, setEmotion] = useState<Emotion>(Emotion.NEUTRAL);
  const [isSleeping, setIsSleeping] = useState(false);
  const [speechText, setSpeechText] = useState<string | null>(null);

  // Features State
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [flyingFood, setFlyingFood] = useState<{ id: number, emoji: string } | null>(null);
  const [isReadingNote, setIsReadingNote] = useState(false);

  // Overlays State for Actions
  const [overlays, setOverlays] = useState<{
    bomb?: boolean;
    slash?: boolean;
    slap?: 'left' | 'right' | null;
    lipstick?: boolean;
    shower?: boolean;
  }>({});

  // --- Toggle Theme ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Actions & Pranks ---

  const triggerBomb = () => {
    if (isSleeping) return;
    setOverlays(prev => ({ ...prev, bomb: true }));
    setTimeout(() => {
        setEmotion(Emotion.SHOCKED);
        setOverlays(prev => ({ ...prev, bomb: false }));
        // Remain sooty for a while
        setTimeout(() => setEmotion(Emotion.CRY), 2000); 
    }, 400);
  };

  const triggerSlash = () => {
    if (isSleeping) return;
    setOverlays(prev => ({ ...prev, slash: true }));
    setEmotion(Emotion.SCARED);
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, slash: false }));
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 1800);
    }, 400);
  };

  const triggerKiss = () => {
    if (isSleeping) return;
    setEmotion(Emotion.KISS);
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, lipstick: true }));
        setEmotion(Emotion.BLUSH);
        setTimeout(() => {
            setOverlays(prev => ({ ...prev, lipstick: false }));
            setEmotion(Emotion.NEUTRAL);
        }, 2000);
    }, 500);
  };

  const triggerShower = () => {
    setIsSleeping(false);
    setOverlays(prev => ({ ...prev, shower: true }));
    // Emotion doesn't need to change immediately as Teddy component handles the smile override
    
    setTimeout(() => {
        // Clean up everything
        setOverlays(prev => ({ ...prev, shower: false, bomb: false }));
        setEmotion(Emotion.HAPPY);
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 1500);
    }, 3000);
  };

  const handleSlap = (side: 'left' | 'right') => {
    if (isSleeping) return;
    setOverlays(prev => ({ ...prev, slap: side }));
    setEmotion(Emotion.HURT); // Instant hurt reaction
    
    // Impact happens immediately (0ms). 
    // Animation lasts ~400ms.
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, slap: null })); // Remove slap overlay (motion)
        // Keep emotion as HURT/CRY for a bit
        setTimeout(() => setEmotion(Emotion.CRY), 100); 
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 2000);
    }, 300); // Shorter duration for impact overlay
  };

  const handleInteraction = (part: TeddyPart) => {
    // Slap Logic
    if (part === 'face_left') return handleSlap('left');
    if (part === 'face_right') return handleSlap('right');

    if (isSleeping && part !== 'note') {
        setIsSleeping(false); // Wake up
        setEmotion(Emotion.HAPPY);
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 1000);
        return;
    }
    if (emotion === Emotion.EATING) return;

    if (part === 'note') {
      setIsReadingNote(true);
      setEmotion(Emotion.HAPPY);
      return;
    }

    if (part === 'nose') {
      triggerKiss(); 
    } else if (part === 'head') {
      setEmotion(Emotion.GIGGLE);
    } else if (part === 'belly') {
      setEmotion(Emotion.GIGGLE);
    } else if (part === 'left_ear' || part === 'right_ear') {
        setEmotion(Emotion.GIGGLE); 
    }

    // Reset after animation (if not handled by specific trigger)
    setTimeout(() => {
        const stickyEmotions = [Emotion.SHOCKED, Emotion.CRY, Emotion.SLEEP, Emotion.EATING];
        if (!stickyEmotions.includes(emotion) && !isReadingNote && !speechText) {
            setEmotion(Emotion.NEUTRAL);
        }
    }, 1500);
  };

  const handleLongPress = () => {
    if (isSleeping) return;
    setEmotion(Emotion.BLUSH);
    setTimeout(() => {
        if (!isSleeping) setEmotion(Emotion.NEUTRAL);
    }, 2000);
  };

  // Feeding Logic
  const toggleFoodMenu = () => {
    if (isSleeping) return;
    setIsFoodMenuOpen(!isFoodMenuOpen);
  };

  const handleFeed = (emoji: string) => {
    setFlyingFood({ id: Date.now(), emoji });
    setEmotion(Emotion.EATING);
    setSpeechText(null); // Hide any existing speech immediately

    setTimeout(() => {
      setFlyingFood(null);
      setIsFoodMenuOpen(false);
      
      // Trigger Random Reaction
      const reaction = FOOD_REACTIONS[Math.floor(Math.random() * FOOD_REACTIONS.length)];
      setSpeechText(reaction.text);
      setEmotion(reaction.emotion);

      // Hide speech and reset after delay
      setTimeout(() => {
        setSpeechText(null);
        setEmotion(Emotion.NEUTRAL);
      }, 2000);

    }, 1000); // Wait for eating animation to finish
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center transition-colors duration-1000 ease-in-out ${isDarkMode ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-b from-[#ff9a9e] to-[#fad0c4]'}`}>
      
      {/* Header */}
      <div className="w-full max-w-md p-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-display font-bold text-white drop-shadow-md tracking-wide">
             Prachi's Teddy
        </h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 rounded-full glass-panel text-white hover:bg-white/20 transition active:scale-95">
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center w-full z-10 pb-20 relative">
        
        {/* Flying Food */}
        {flyingFood && (
          <div className="absolute z-50 animate-feed text-6xl pointer-events-none drop-shadow-lg" style={{ top: '60%' }}>{flyingFood.emoji}</div>
        )}

        {/* Teddy */}
        <div className="mb-12 relative transform transition-all duration-500 scale-105">
           {/* Speech Bubble */}
           {speechText && (
             <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-100 text-gray-800 px-5 py-3 rounded-2xl shadow-xl border-2 border-white animate-pop-in z-50 whitespace-nowrap after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-t-white dark:after:border-t-gray-100">
               <p className="font-display font-bold text-lg">{speechText}</p>
             </div>
           )}

           {/* Explosion Flash Overlay */}
           {overlays.bomb && <div className="absolute inset-[-150px] bg-white explosion-flash rounded-full z-50 pointer-events-none mix-blend-hard-light" />}

           <Teddy 
             emotion={emotion} 
             hasNote={true} // Always holds note
             overlays={overlays}
             onInteract={handleInteraction}
             onLongPress={handleLongPress}
           />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-6 items-center relative w-full max-w-sm px-4">
          
          {/* Action Row (Prank/Love) */}
          <div className="flex gap-5 justify-center w-full">
              <button onClick={triggerSlash} className="p-4 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Scare">
                  <Sword size={24} />
              </button>
              <button onClick={triggerBomb} className="p-4 rounded-full bg-gray-800 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Bomb">
                  <Bomb size={24} />
              </button>
              <button onClick={triggerShower} className="p-4 rounded-full bg-blue-400 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Shower/Clean">
                  <ShowerHead size={24} />
              </button>
              <button onClick={triggerKiss} className="p-4 rounded-full bg-pink-500 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Kiss">
                  <Heart size={24} fill="currentColor" />
              </button>
          </div>

          {/* Utility Row */}
          <div className="flex items-center gap-5">
              <button onClick={toggleFoodMenu} disabled={isSleeping} className={`p-4 rounded-full glass-panel text-white hover:bg-white/30 transition active:scale-95 shadow-lg ${isSleeping ? 'opacity-50' : ''}`}>
                  <Utensils size={24} />
              </button>

              <button onClick={() => { setIsSleeping(!isSleeping); setEmotion(isSleeping ? Emotion.HAPPY : Emotion.SLEEP); }} className={`p-4 rounded-full glass-panel text-white hover:bg-white/30 transition active:scale-95 shadow-lg ${isSleeping ? 'bg-indigo-500 ring-2 ring-indigo-300' : ''}`}>
                  <BedDouble size={24} />
              </button>
          </div>

        </div>
        
        {/* Food Menu */}
        <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 glass-panel rounded-2xl p-4 flex gap-3 transition-all duration-500 origin-bottom shadow-2xl z-40 ${isFoodMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-10 pointer-events-none'}`}>
          <div className="flex gap-2 overflow-x-auto max-w-[80vw] no-scrollbar pb-1">
             {FOOD_ITEMS.map((item, index) => (
               <button key={index} onClick={() => handleFeed(item)} className="text-3xl hover:scale-125 transition-transform p-2 bg-white/20 rounded-full min-w-[50px] min-h-[50px] flex items-center justify-center active:scale-90">
                 {item}
               </button>
             ))}
          </div>
        </div>

        {/* Reading Note Modal - Centered and Beautiful */}
        {isReadingNote && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setIsReadingNote(false)}>
             <div onClick={(e) => e.stopPropagation()} className="bg-[#fff0f5] dark:bg-gray-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center relative border-4 border-pink-200 animate-pop-in transform transition-all">
                <button onClick={() => setIsReadingNote(false)} className="absolute top-3 right-3 p-2 bg-white/50 rounded-full hover:bg-white/80 transition"><X size={20} className="text-gray-500" /></button>
                <div className="text-5xl mb-6">💌</div>
                <p className="font-handwriting text-lg text-gray-800 dark:text-gray-100 leading-relaxed font-display whitespace-pre-wrap">
                  {SWEET_MESSAGE}
                </p>
                <div className="mt-8 text-pink-400 text-sm font-semibold tracking-wider uppercase">Tap anywhere to close</div>
             </div>
          </div>
        )}

        {/* Instructions Hint */}
        {!isFoodMenuOpen && !isReadingNote && (
          <div className="mt-8 text-white/80 text-sm font-sans flex flex-col items-center gap-1 animate-pulse">
             <span>👆 Tap the letter in Teddy's hand</span>
             <span>👋 Tap face to slap</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;