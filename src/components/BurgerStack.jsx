import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function BurgerStack({ stages }) {
  const [stack, setStack] = useState([]);

  useEffect(() => {
    const handleAdd = (e) => {
      const ingredientId = e.detail;
      setStack(prev => {
        if (!prev.includes(ingredientId)) return [...prev, ingredientId];
        return prev;
      });
    };

    window.addEventListener('ingredient-placed', handleAdd);
    return () => window.removeEventListener('ingredient-placed', handleAdd);
  }, []);

  // Animate newly added item
  useEffect(() => {
    if (stack.length > 0) {
      const latest = stack[stack.length - 1];
      gsap.fromTo(`.stack-item-${latest}`,
        { y: -600, scale: 1.2, opacity: 0, rotation: gsap.utils.random(-25, 25) },
        { y: 0, scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: 'bounce.out' }
      );
    }
  }, [stack]);

  const ITEM_STYLES = {
    'bottom-bun': 'bg-amber-600 rounded-b-[40px] rounded-t-lg h-16 w-64 shadow-xl',
    'smashed-patty': 'bg-red-950 rounded-xl h-10 w-64 shadow-[inset_0_-4px_0_rgba(0,0,0,0.6)] my-[-4px]',
    'american-cheese': 'bg-yellow-400 rounded h-4 w-72 transform rotate-2 my-[-8px] shadow-lg',
  };

  const ITEM_LABELS = {
    'bottom-bun': 'Toasted Bottom Bun',
    'smashed-patty': 'Smashed Beef Patty',
    'american-cheese': 'American Cheese',
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/2 h-screen pointer-events-none z-40 flex flex-col justify-end items-center pb-32">
       {/* Plate */}
       <div className="w-[400px] h-6 bg-zinc-800 rounded-full mb-2 shadow-2xl relative border-b-4 border-zinc-950">
          <div className="absolute inset-0 bg-white/5 rounded-full shadow-[inset_0_4px_10px_rgba(255,255,255,0.1)]"></div>
       </div>

       {/* Stacked Ingredients */}
       <div className="flex flex-col-reverse items-center justify-start absolute bottom-[140px]">
          {stack.map((item, i) => (
            <div
              key={item}
              className={`stack-item-${item} ${ITEM_STYLES[item]} flex flex-col items-center justify-center border border-black/20 relative backdrop-blur-sm`}
              style={{ zIndex: i }}
            >
              <div className="font-heading font-black text-black/40 text-sm uppercase tracking-widest">{ITEM_LABELS[item]}</div>
            </div>
          ))}
       </div>
    </div>
  );
}