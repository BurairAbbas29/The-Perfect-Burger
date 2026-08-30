import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableIngredient({ id, styleClass, label, inlineStyles }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    ...inlineStyles,
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    ...(isDragging ? { zIndex: 999 } : {})
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`stack-item-${id} ${styleClass} flex flex-col items-center justify-center relative touch-none select-none cursor-grab active:cursor-grabbing my-[-10px] sm:my-[-14px] transition-[filter] duration-300
        ${isDragging ? 'brightness-125 scale-110 drop-shadow-[0_40px_30px_rgba(0,0,0,0.8)] opacity-100' : 'hover:brightness-110 drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]'}
      `}
    >
      <div className="font-heading font-black text-[12px] uppercase tracking-[0.25em] pointer-events-none mix-blend-overlay text-black/50 invisible sm:visible">
        {/* Hover labels inside layer removed to maximize hyper-realism on visuals, leaving it clean */}
      </div>
    </div>
  );
}

export default function BurgerStack() {
  const [stack, setStack] = useState([]);
  const wrapperRef = useRef();

  useEffect(() => {
    const handleAdd = (e) => {
      const ingredientId = e.detail;
      setStack(prev => {
        if (!prev.includes(ingredientId)) return [ingredientId, ...prev]; // Drop on top
        return prev;
      });
    };
    window.addEventListener('ingredient-placed', handleAdd);
    return () => window.removeEventListener('ingredient-placed', handleAdd);
  }, []);

  useEffect(() => {
    const handleSort = (e) => {
      const { active, over } = e.detail;
      if (over) {
        setStack((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    };
    window.addEventListener('stack-sorted', handleSort);
    return () => window.removeEventListener('stack-sorted', handleSort);
  }, []);

  useEffect(() => {
    if (stack.length > 0) {
      const latest = stack[0]; 
      gsap.fromTo(`.stack-item-${latest}`,
        { y: -800, scale: 0.8, opacity: 0, rotationX: 60, rotationZ: gsap.utils.random(-15, 15) },
        { y: 0, scale: 1, opacity: 1, rotationX: 0, rotationZ: 0, duration: 1.8, ease: 'elastic.out(1, 0.5)' }
      );
    }
    
    if (stack.length === 6) {
      gsap.to(wrapperRef.current, {
        rotateX: 12,
        rotateY: -10,
        scale: 1.1,
        y: -30,
        x: -20,
        duration: 2.5,
        ease: 'expo.out',
        delay: 0.6
      });
    }
  }, [stack.length]);

  // FIXED DIMENSIONS: Converted all % widths to absolute px to prevent complete structural collapse
  const ITEM_STYLES = {
    'toasted-bun': 'bg-gradient-to-b from-[#df933b] to-[#a35e16] rounded-b-[70px] rounded-t-[10px] h-20 w-[256px] shadow-[inset_0_-20px_20px_rgba(100,40,0,0.9),inset_0_10px_10px_rgba(255,255,255,0.2)]',
    'smashed-patty': 'bg-[#3b170c] rounded-2xl h-14 w-[268px] shadow-[inset_0_10px_15px_rgba(0,0,0,0.8),inset_0_-5px_5px_rgba(255,255,255,0.05),0_10px_10px_rgba(0,0,0,0.6)] border border-[#230d06]',
    'american-cheese': 'bg-gradient-to-br from-[#ffe100] to-[#e69b00] rounded-md h-6 w-[276px] transform rotate-2 shadow-[0_5px_15px_rgba(245,158,11,0.6),inset_0_-2px_10px_rgba(210,120,0,0.6)]',
    'onions-pickles': 'bg-gradient-to-r from-green-500 to-green-700 rounded-lg h-5 w-[240px] border-t border-green-400 shadow-[inset_0_4px_8px_rgba(0,0,0,0.3),0_5px_10px_rgba(0,0,0,0.5)]',
    'house-sauce': 'bg-[#f06424] rounded-[50%] h-8 w-[260px] opacity-90 blur-[1px] shadow-[0_10px_20px_rgba(220,60,10,0.7),inset_0_5px_10px_rgba(255,200,100,0.4)]',
    'top-bun': 'bg-gradient-to-b from-[#dba357] to-[#ba6813] rounded-t-[100px] rounded-b-[15px] h-32 w-[256px] shadow-[inset_0_20px_30px_rgba(255,255,255,0.3),inset_0_-15px_25px_rgba(110,45,0,0.7)]',
  };

  const ITEM_INLINE = {
    'toasted-bun': { zIndex: 10 },
    'smashed-patty': { zIndex: 20 },
    'american-cheese': { zIndex: 30 },
    'onions-pickles': { zIndex: 40 },
    'house-sauce': { zIndex: 50 },
    'top-bun': { zIndex: 60, backgroundImage: 'radial-gradient(#ffe0b2 2px, transparent 3px)', backgroundSize: '15px 18px' },
  };

  const ITEM_LABELS = {
    'toasted-bun': 'Toasted Bottom Bun',
    'smashed-patty': 'Smashed Beef Patty',
    'american-cheese': 'American Cheese',
    'onions-pickles': 'Onions & Pickles',
    'house-sauce': 'House Sauce',
    'top-bun': 'Sesame Top Bun',
  };

  return (
    <div id="capture-burger" className="fixed top-0 right-0 w-full md:w-1/2 h-screen pointer-events-none z-40 flex flex-col justify-end items-center pb-24" style={{ perspective: '1500px' }}>
       
       <div id="burger-3d-wrapper" ref={wrapperRef} className="relative flex flex-col items-center pointer-events-auto transform-gpu transition-transform duration-500 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
           
           <SortableContext items={stack} strategy={verticalListSortingStrategy}>
              {stack.map((item) => (
                <SortableIngredient key={item} id={item} label={ITEM_LABELS[item]} styleClass={ITEM_STYLES[item]} inlineStyles={ITEM_INLINE[item]} />
              ))}
           </SortableContext>
           
           <div className="w-[450px] h-14 bg-gradient-to-b from-zinc-200 to-zinc-400 rounded-[100%] shadow-[0_45px_70px_rgba(0,0,0,0.7)] relative border-b-[8px] border-zinc-500 z-0 flex items-center justify-center mt-[-15px]">
              <div className="absolute w-[80%] h-[75%] bg-gradient-to-br from-zinc-300 to-zinc-100 rounded-[100%] shadow-[inset_0_12px_20px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white/50">
                 <div className="w-[70%] h-[60%] bg-zinc-300/40 rounded-[100%] shadow-[inset_0_5px_15px_rgba(0,0,0,0.1)] border border-black/5"></div>
              </div>
           </div>
       </div>

       {stack.length === 6 && (
         <div data-html2canvas-ignore="true" className="absolute top-1/4 right-8 flex flex-col items-end gap-2 pr-8 animate-in fade-in slide-in-from-right-10 duration-1000 delay-1000 text-orange-400 font-heading font-black tracking-[0.2em] pointer-events-none drop-shadow-xl z-50">
           <div className="animate-pulse">↓ IT'S FULLY INTERACTIVE ↓</div>
           <div className="text-zinc-400 text-sm tracking-wide">Drag layers to re-arrange your masterpiece</div>
         </div>
       )}
    </div>
  );
}
