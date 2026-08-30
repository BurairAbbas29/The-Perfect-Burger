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
      className={`stack-item-${id} ${styleClass} flex flex-col items-center justify-center relative touch-none select-none cursor-grab active:cursor-grabbing my-[-2px] transition-[filter] duration-300
        ${isDragging ? 'brightness-125 scale-110 drop-shadow-[0_40px_30px_rgba(0,0,0,0.8)] opacity-100' : 'hover:brightness-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]'}
      `}
    >
      <div className="font-heading font-black text-[12px] uppercase tracking-[0.25em] pointer-events-none mix-blend-overlay text-black/50 invisible sm:visible"></div>
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
        { y: -800, scale: 0.8, opacity: 0, rotationX: 45, rotationZ: gsap.utils.random(-15, 15) },
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

  // Clean, flat awwwards style - no more deep clipping or muddy gradients
  const ITEM_STYLES = {
    'toasted-bun': 'bg-amber-600 rounded-b-[40px] rounded-t-lg h-16 w-[256px] shadow-[inset_0_-4px_0_rgba(180,83,9,0.8)]',
    'smashed-patty': 'bg-red-950 rounded-xl h-10 w-[268px] shadow-[inset_0_-4px_0_rgba(0,0,0,0.6)] border border-[#230d06]',
    'american-cheese': 'bg-yellow-400 rounded-md h-5 w-[276px] transform rotate-1 shadow-md',
    'onions-pickles': 'bg-green-600 rounded-sm h-4 w-[240px] border-dashed border-2 border-green-800 shadow-sm',
    'house-sauce': 'bg-orange-500 rounded-full h-6 w-[260px] opacity-95 blur-[0.5px] shadow-sm',
    'top-bun': 'bg-amber-600 rounded-t-[60px] rounded-b-md h-24 w-[256px] shadow-[inset_0_-4px_0_rgba(180,83,9,0.8)]',
  };

  const ITEM_INLINE = {
    'toasted-bun': { zIndex: 10 },
    'smashed-patty': { zIndex: 20 },
    'american-cheese': { zIndex: 30 },
    'onions-pickles': { zIndex: 40 },
    'house-sauce': { zIndex: 50 },
    'top-bun': { zIndex: 60, backgroundImage: 'radial-gradient(#fde68a 2px, transparent 3px)', backgroundSize: '15px 18px' },
  };

  return (
    <div id="capture-burger" className="fixed top-0 right-0 w-full md:w-1/2 h-screen pointer-events-none z-40 flex flex-col justify-end items-center pb-32" style={{ perspective: '1500px' }}>
       
       <div id="burger-3d-wrapper" ref={wrapperRef} className="relative flex flex-col items-center pointer-events-auto transform-gpu transition-transform duration-500 will-change-transform" style={{ transformStyle: 'preserve-3d' }}>
           
           <SortableContext items={stack} strategy={verticalListSortingStrategy}>
              {stack.map((item) => (
                <SortableIngredient key={item} id={item} label={item} styleClass={ITEM_STYLES[item]} inlineStyles={ITEM_INLINE[item]} />
              ))}
           </SortableContext>
           
           {/* Clean, separated plate with no negative margin so the burger sits neatly on top */}
           <div className="w-[380px] h-10 bg-zinc-300 rounded-[100%] shadow-2xl relative border-b-[8px] border-zinc-500 z-0 flex items-center justify-center mt-2">
              <div className="absolute inset-2 bg-zinc-200 rounded-[100%] shadow-inner border border-white/50"></div>
           </div>
       </div>

       {stack.length === 6 && (
         <div data-html2canvas-ignore="true" className="absolute top-1/4 right-8 flex flex-col items-end gap-2 pr-8 animate-in fade-in slide-in-from-right-10 duration-1000 delay-1000 text-orange-400 font-heading font-black tracking-[0.2em] pointer-events-none drop-shadow-xl z-50">
           <div className="animate-pulse">↓ IT'S FULLY INTERACTIVE ↓</div>
           <div className="text-zinc-400 text-sm tracking-wide">Drag layers to re-arrange</div>
         </div>
       )}
    </div>
  );
}
