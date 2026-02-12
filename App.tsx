import React, { useState, useEffect } from 'react';
import Teddy from './components/Teddy';
import { Emotion, TeddyPart, Costume } from './types';
import { Moon, Sun, Utensils, BedDouble, X, Bomb, ShowerHead, Heart, Sword, Shirt, Sparkles, Music, Snowflake, CloudOff, MicOff, Brush } from 'lucide-react';

const FOOD_ITEMS = ['🍕', '🍦', '🍩', '🍫', '🍪', '🍯', '🍓', '🍔'];

const SWEET_MESSAGE = 
`Ye Prachi,

Maybe this time you'd like this . 
Hasti Raha karo, bohot acchi lagti ho.

I miss those old days👉👈.
Those Conversations, Truth-Dares.
Sab Refresh ho jata kaashhhhh...! 🌟
ajeeb sa lagne lagta h, to fir text karne se rok nhi pata....
aisa lagta h ki tension me naa ho ye ladki..!!


-Teddy 🧸`;

const FOOD_REACTIONS = [
  { text: "Yummy, Prachi! 😋", emotion: Emotion.HAPPY },
  { text: "Thanks Prachi! 💖", emotion: Emotion.GIGGLE },
  { text: "Prachi's the best! 🍯", emotion: Emotion.BLUSH },
  { text: "You're sweet, Prachi! 🥰", emotion: Emotion.HUG },
  { text: "Prachiiiiii! 🤤", emotion: Emotion.HAPPY },
  { text: "Prachi prachii!  🍓", emotion: Emotion.EATING },
];

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Teddy State
  const [emotion, setEmotion] = useState<Emotion>(Emotion.NEUTRAL);
  const [isSleeping, setIsSleeping] = useState(false);
  const [speechText, setSpeechText] = useState<string | null>(null);

  // Costume State
  const [costume, setCostume] = useState<Costume>({ head: 'none', eyes: 'none', neck: 'none' });

  // Features State
  const [isFoodMenuOpen, setIsFoodMenuOpen] = useState(false);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [flyingFood, setFlyingFood] = useState<{ id: number, emoji: string } | null>(null);
  const [isReadingNote, setIsReadingNote] = useState(false);

  // Overlays State for Actions
  const [overlays, setOverlays] = useState<{
    bomb?: boolean;
    slash?: boolean;
    slap?: 'left' | 'right' | null;
    lipstick?: boolean;
    shower?: boolean;
    brush?: boolean;
  }>({});

  // --- Toggle Theme ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // --- Helper: Close all menus ---
  const closeAllMenus = () => {
    setIsFoodMenuOpen(false);
    setIsWardrobeOpen(false);
    setIsActionsOpen(false);
  };

  // --- Actions & Pranks ---

  const triggerBomb = () => {
    if (isSleeping) return;
    closeAllMenus();
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
    closeAllMenus();
    setOverlays(prev => ({ ...prev, slash: true }));
    setEmotion(Emotion.SCARED);
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, slash: false }));
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 1800);
    }, 400);
  };

  const triggerKiss = () => {
    if (isSleeping) return;
    closeAllMenus();
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
    closeAllMenus();
    setOverlays(prev => ({ ...prev, shower: true }));
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, shower: false, bomb: false }));
        setEmotion(Emotion.HAPPY);
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 1500);
    }, 3000);
  };

  const triggerBrush = () => {
    setIsSleeping(false);
    closeAllMenus();
    setOverlays(prev => ({ ...prev, brush: true }));
    setEmotion(Emotion.HAPPY); // Enjoying it
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, brush: false }));
        setEmotion(Emotion.NEUTRAL);
    }, 2500);
  };

  const triggerSneeze = () => {
    setIsSleeping(false);
    closeAllMenus();
    
    // Phase 1: Build up "Ahhh..."
    setEmotion(Emotion.SNEEZE_BUILD);
    setSpeechText("Ah... Ahhh...");

    setTimeout(() => {
       // Phase 2: Release "CHOO!"
       setSpeechText("CHOO! 💨");
       setEmotion(Emotion.SNEEZE);
       
       setTimeout(() => {
          // Phase 3: Recovery/Surprise
          setSpeechText(null);
          setEmotion(Emotion.SHOCKED); // Surprised after sneeze
          setTimeout(() => setEmotion(Emotion.NEUTRAL), 1000);
       }, 500);
    }, 1500);
  };

  const triggerDance = () => {
    setIsSleeping(false);
    closeAllMenus();
    setEmotion(Emotion.DANCE);
    setTimeout(() => {
       setEmotion(Emotion.NEUTRAL);
    }, 4000);
  };

  const triggerCold = () => {
    closeAllMenus();
    setEmotion(Emotion.COLD);
    // Needs to be warmed up or timeout
    setTimeout(() => setEmotion(Emotion.NEUTRAL), 3000);
  };

  const triggerSecret = () => {
    closeAllMenus();
    setEmotion(Emotion.SECRET);
    setTimeout(() => setEmotion(Emotion.NEUTRAL), 2000);
  };

  const triggerYawn = () => {
    closeAllMenus();
    setEmotion(Emotion.SLEEP);
    setTimeout(() => {
      if (!isSleeping) setEmotion(Emotion.NEUTRAL);
    }, 2000);
  };

  const toggleEaster = () => {
     closeAllMenus();
     setCostume(prev => ({
         ...prev,
         head: prev.head === 'bunny' ? 'none' : 'bunny'
     }));
  };

  const handleSlap = (side: 'left' | 'right') => {
    if (isSleeping) return;
    setOverlays(prev => ({ ...prev, slap: side }));
    setEmotion(Emotion.HURT); // Instant hurt reaction
    setTimeout(() => {
        setOverlays(prev => ({ ...prev, slap: null })); // Remove slap overlay
        setTimeout(() => setEmotion(Emotion.CRY), 100); 
        setTimeout(() => setEmotion(Emotion.NEUTRAL), 2000);
    }, 300);
  };

  const handleInteraction = (part: TeddyPart) => {
    // If a menu is open, interacting with teddy closes it
    if (isFoodMenuOpen || isWardrobeOpen || isActionsOpen) {
        closeAllMenus();
        return;
    }

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
    } else if (part === 'head' || part === 'belly' || part === 'left_ear' || part === 'right_ear') {
      setEmotion(Emotion.GIGGLE);
    }

    // Reset after animation
    setTimeout(() => {
        const stickyEmotions = [Emotion.SHOCKED, Emotion.CRY, Emotion.SLEEP, Emotion.EATING, Emotion.COLD, Emotion.DANCE, Emotion.SNEEZE_BUILD, Emotion.SNEEZE];
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
  const toggleFoodMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent immediate close
    if (isSleeping) return;
    setIsFoodMenuOpen(!isFoodMenuOpen);
    setIsWardrobeOpen(false);
    setIsActionsOpen(false);
  };

  const handleFeed = (emoji: string) => {
    setFlyingFood({ id: Date.now(), emoji });
    setEmotion(Emotion.EATING);
    setSpeechText(null);

    setTimeout(() => {
      setFlyingFood(null);
      setIsFoodMenuOpen(false);
      
      const reaction = FOOD_REACTIONS[Math.floor(Math.random() * FOOD_REACTIONS.length)];
      setSpeechText(reaction.text);
      setEmotion(reaction.emotion);

      setTimeout(() => {
        setSpeechText(null);
        setEmotion(Emotion.NEUTRAL);
      }, 2000);

    }, 1000);
  };

  // Wardrobe Logic
  const updateCostume = (type: keyof Costume, value: string) => {
    setCostume(prev => ({ ...prev, [type]: value }));
  };

  const toggleWardrobe = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsWardrobeOpen(!isWardrobeOpen);
      setIsFoodMenuOpen(false);
      setIsActionsOpen(false);
  };

  const toggleActions = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsActionsOpen(!isActionsOpen);
      setIsFoodMenuOpen(false);
      setIsWardrobeOpen(false);
  };

  // Global click handler to close menus
  const handleBackgroundClick = () => {
    if (isFoodMenuOpen || isWardrobeOpen || isActionsOpen) {
        closeAllMenus();
    }
  };

  return (
    <div 
      className={`min-h-screen w-full relative overflow-hidden flex flex-col items-center transition-colors duration-1000 ease-in-out ${isDarkMode ? 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e]' : 'bg-gradient-to-b from-[#ff9a9e] to-[#fad0c4]'}`}
      onClick={handleBackgroundClick}
    >
      
      {/* Header */}
      <div className="w-full max-w-md p-6 flex justify-between items-center z-10">
        <h1 className="text-3xl font-display font-bold text-white drop-shadow-md tracking-wide">
             Prachi's Teddy
        </h1>
        <button onClick={(e) => { e.stopPropagation(); setIsDarkMode(!isDarkMode); }} className="p-3 rounded-full glass-panel text-white hover:bg-white/20 transition active:scale-95">
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
             costume={costume}
             overlays={overlays}
             onInteract={handleInteraction}
             onLongPress={handleLongPress}
           />
        </div>

        {/* Controls - Main Row */}
        <div className="flex flex-col gap-6 items-center relative w-full max-w-sm px-4" onClick={(e) => e.stopPropagation()}>
          
          {/* Quick Actions */}
          <div className="flex gap-4 justify-center w-full flex-wrap">
              <button onClick={triggerSlash} className="p-3 rounded-full bg-red-500 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Scare">
                  <Sword size={20} />
              </button>
              <button onClick={triggerBomb} className="p-3 rounded-full bg-gray-800 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Bomb">
                  <Bomb size={20} />
              </button>
              <button onClick={triggerShower} className="p-3 rounded-full bg-blue-400 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Shower">
                  <ShowerHead size={20} />
              </button>
              <button onClick={triggerKiss} className="p-3 rounded-full bg-pink-500 text-white shadow-xl hover:scale-110 active:scale-90 transition-transform duration-200" title="Kiss">
                  <Heart size={20} fill="currentColor" />
              </button>
          </div>

          {/* Menus Row */}
          <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl backdrop-blur-md">
              <button onClick={toggleFoodMenu} disabled={isSleeping} className={`p-3 rounded-xl hover:bg-white/20 transition ${isFoodMenuOpen ? 'bg-white/30' : ''}`}>
                  <Utensils size={24} className="text-white" />
              </button>
              
              <button onClick={toggleWardrobe} className={`p-3 rounded-xl hover:bg-white/20 transition ${isWardrobeOpen ? 'bg-white/30' : ''}`}>
                  <Shirt size={24} className="text-white" />
              </button>

              <button onClick={toggleActions} className={`p-3 rounded-xl hover:bg-white/20 transition ${isActionsOpen ? 'bg-white/30' : ''}`}>
                  <Sparkles size={24} className="text-white" />
              </button>

              <div className="w-px h-8 bg-white/20 mx-1"></div>

              <button onClick={() => { setIsSleeping(!isSleeping); setEmotion(isSleeping ? Emotion.HAPPY : Emotion.SLEEP); closeAllMenus(); }} className={`p-3 rounded-xl hover:bg-white/20 transition ${isSleeping ? 'bg-indigo-500 text-white' : 'text-white'}`}>
                  <BedDouble size={24} />
              </button>
          </div>

        </div>
        
        {/* Food Menu */}
        <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-28 left-0 right-0 mx-auto w-full max-w-sm px-4 transition-all duration-300 ${isFoodMenuOpen ? 'opacity-100 translate-y-0 z-40' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="glass-panel rounded-2xl p-4 flex gap-3 overflow-x-auto no-scrollbar">
             {FOOD_ITEMS.map((item, index) => (
               <button key={index} onClick={() => handleFeed(item)} className="text-3xl hover:scale-125 transition-transform p-2 bg-white/20 rounded-xl min-w-[50px] min-h-[50px] flex items-center justify-center active:scale-90">
                 {item}
               </button>
             ))}
          </div>
        </div>

        {/* Wardrobe Menu */}
        <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-28 left-0 right-0 mx-auto w-full max-w-sm px-4 transition-all duration-300 ${isWardrobeOpen ? 'opacity-100 translate-y-0 z-40' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
          <div className="glass-panel rounded-2xl p-4 grid gap-4 max-h-[300px] overflow-y-auto no-scrollbar">
             {/* Head */}
             <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-wider opacity-80 pl-1">Headwear</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <button onClick={() => updateCostume('head', 'none')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'none' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>None</button>
                  <button onClick={() => updateCostume('head', 'hat')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'hat' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Hat 🎩</button>
                  <button onClick={() => updateCostume('head', 'cowboy')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'cowboy' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Cowboy 🤠</button>
                  <button onClick={() => updateCostume('head', 'beanie')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'beanie' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Beanie 🧶</button>
                  <button onClick={() => updateCostume('head', 'beret')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'beret' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Beret 🎨</button>
                  <button onClick={() => updateCostume('head', 'bunny')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'bunny' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Bunny 🐰</button>
                  <button onClick={() => updateCostume('head', 'crown')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'crown' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Crown 👑</button>
                  <button onClick={() => updateCostume('head', 'flower')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'flower' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Flower 🌸</button>
                  <button onClick={() => updateCostume('head', 'cap')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'cap' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Cap 🧢</button>
                  <button onClick={() => updateCostume('head', 'viking')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'viking' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Viking ⚔️</button>
                  <button onClick={() => updateCostume('head', 'headphones')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'headphones' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Headphones 🎧</button>
                  <button onClick={() => updateCostume('head', 'party')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.head === 'party' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Party 🥳</button>
                </div>
             </div>
             {/* Eyes */}
             <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-wider opacity-80 pl-1">Eyewear</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <button onClick={() => updateCostume('eyes', 'none')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'none' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>None</button>
                  <button onClick={() => updateCostume('eyes', 'sunglasses')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'sunglasses' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Shades 😎</button>
                  <button onClick={() => updateCostume('eyes', 'aviator')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'aviator' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Aviators 🕶️</button>
                  <button onClick={() => updateCostume('eyes', 'glasses')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'glasses' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Glasses 👓</button>
                  <button onClick={() => updateCostume('eyes', 'monocle')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'monocle' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Monocle 🧐</button>
                  <button onClick={() => updateCostume('eyes', 'star')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'star' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Star ⭐</button>
                  <button onClick={() => updateCostume('eyes', '3d')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === '3d' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>3D 🍿</button>
                  <button onClick={() => updateCostume('eyes', 'patch')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.eyes === 'patch' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Patch 🏴‍☠️</button>
                </div>
             </div>
             {/* Neck */}
             <div className="flex flex-col gap-2">
                <span className="text-white text-xs font-bold uppercase tracking-wider opacity-80 pl-1">Accessories</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                  <button onClick={() => updateCostume('neck', 'none')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'none' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>None</button>
                  <button onClick={() => updateCostume('neck', 'tie')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'tie' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Tie 👔</button>
                  <button onClick={() => updateCostume('neck', 'pearls')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'pearls' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Pearls ⚪</button>
                  <button onClick={() => updateCostume('neck', 'bowtie')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'bowtie' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Bowtie 🎀</button>
                  <button onClick={() => updateCostume('neck', 'scarf')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'scarf' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Scarf 🧣</button>
                  <button onClick={() => updateCostume('neck', 'necklace')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'necklace' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Necklace 📿</button>
                  <button onClick={() => updateCostume('neck', 'chain')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'chain' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Chain 💰</button>
                  <button onClick={() => updateCostume('neck', 'bandana')} className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${costume.neck === 'bandana' ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}`}>Bandana 🤠</button>
                </div>
             </div>
          </div>
        </div>

        {/* More Actions Menu */}
        <div onClick={(e) => e.stopPropagation()} className={`absolute bottom-28 left-0 right-0 mx-auto w-full max-w-sm px-4 transition-all duration-300 ${isActionsOpen ? 'opacity-100 translate-y-0 z-40' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
           <div className="glass-panel rounded-2xl p-4 grid grid-cols-4 gap-3">
               <button onClick={triggerBrush} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <Brush size={24} /> <span className="text-[10px]">Brush</span>
               </button>
               <button onClick={triggerSneeze} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <CloudOff size={24} /> <span className="text-[10px]">Sneeze</span>
               </button>
               <button onClick={triggerDance} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <Music size={24} /> <span className="text-[10px]">Dance</span>
               </button>
               <button onClick={triggerCold} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <Snowflake size={24} /> <span className="text-[10px]">Cold</span>
               </button>
               <button onClick={triggerSecret} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <MicOff size={24} /> <span className="text-[10px]">Secret</span>
               </button>
               <button onClick={triggerYawn} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <span className="text-xl">🥱</span> <span className="text-[10px]">Yawn</span>
               </button>
               <button onClick={toggleEaster} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <span className="text-xl">🐰</span> <span className="text-[10px]">Easter</span>
               </button>
               <button onClick={() => { setIsActionsOpen(false); setEmotion(Emotion.BLUSH); }} className="flex flex-col items-center gap-1 text-white hover:bg-white/20 p-2 rounded-lg">
                  <span className="text-xl">😳</span> <span className="text-[10px]">Blush</span>
               </button>
           </div>
        </div>


        {/* Reading Note Modal */}
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
        {!isFoodMenuOpen && !isWardrobeOpen && !isActionsOpen && !isReadingNote && (
          <div className="mt-8 text-white/80 text-sm font-sans flex flex-col items-center gap-1 animate-pulse">
             <span>👆 Tap the letter in Teddy's hand</span>
             <span>👆 Tap the belley for gudgudi and face to slap</span>
             
          </div>
        )}

      </div>
    </div>
  );
};

export default App;