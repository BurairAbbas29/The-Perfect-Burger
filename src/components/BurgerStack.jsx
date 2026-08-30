import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableIngredient({ id, styleClass, label, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.2, 0, 0, 1)',
    zIndex: isDragging ? 99 : 20 - index,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`stack-item-${id} ${styleClass} flex flex-col items-center justify-center relative touch-none select-none cursor-grab active:cursor-grabbing my-[-8px] transition-[filter,box-shadow] duration-300
        ${isDragging ? 'shadow-2xl grayscale-[0.2] brightness-125 scale-110 drop-shadow-[0_30px_30px_rgba(0,0,0,0.6)] opacity-100' : 'hover:brightness-110 drop-shadow-xl'}
      `}
    >
      <div className={`font-heading font-black text-[11px] uppercase tracking-[0.25em] pointer-events-none drop-shadow-md mix-blend-overlay ${id === 'american-cheese' || id === 'house-sauce' ? 'text-black/60' : 'text-black/40'}`}>
        {label}
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

  // Premium Elastic Drop Physics
  useEffect(() => {
    if (stack.length > 0) {
      const latest = stack[0]; 
      gsap.fromTo(`.stack-item-${latest}`,
        { y: -800, scale: 0.8, opacity: 0, rotationX: 60, rotationZ: gsap.utils.random(-20, 20) },
        { y: 0, scale: 1, opacity: 1, rotationX: 0, rotationZ: 0, duration: 2, ease: 'elastic.out(1, 0.4)' }
      );
    }
    
    // 3D Kickflip Transformation when all 6 ingredients drop!
    if (stack.length === 6) {
      gsap.to(wrapperRef.current, {
        rotateX: 18,
        rotateY: -15,
        scale: 1.15,
        y: -50,
        x: -40,
        duration: 2.5,
        ease: 'expo.out',
        delay: 0.8
      });
    }
  }, [stack.length]);

  const ITEM_STYLES = {
    'toasted-bun': 'bg-gradient-to-b from-amber-500 to-amber-700 rounded-b-[40px] rounded-t-[12px] h-16 w-64 shadow-[inset_0_-8px_12px_rgba(0,0,0,0.3)]',
    'smashed-patty': 'bg-gradient-to-t from-red-950 to-[#4a1c1c] rounded-xl h-10 w-64 shadow-[inset_0_-4px_0_rgba(0,0,0,0.8)]',
    'american-cheese': 'bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md h-5 w-72 transform rotate-1 shadow-[0_4px_15px_rgba(250,204,21,0.4)]',
    'onions-pickles': 'bg-gradient-to-r from-green-600 to-green-800 rounded-sm h-6 w-60 border-dashed border-t-2 border-b-2 border-green-950/50 backdrop-blur-sm',
    'house-sauce': 'bg-gradient-to-r from-orange-400 to-orange-600 rounded-full h-8 w-56 opacity-95 blur-[0.5px]',
    'top-bun': 'bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-[80px] rounded-b-lg h-24 w-64 shadow-[inset_0_12px_15px_rgba(255,255,255,0.3)]',
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
    <div id="capture-burger" className="fixed top-0 right-0 w-full md:w-1/2 h-screen pointer-events-none z-40 flex flex-col justify-end items-center pb-24" style={{ perspective: '1200px' }}>
       
       <div ref={wrapperRef} className="relative flex flex-col items-center pointer-events-auto transform-gpu transition-transform" style={{ transformStyle: 'preserve-3d' }}>
           
           <SortableContext items={stack} strategy={verticalListSortingStrategy}>
              {stack.map((item, index) => (
                <SortableIngredient key={item} id={item} label={ITEM_LABELS[item]} styleClass={ITEM_STYLES[item]} index={index} />
              ))}
           </SortableContext>
           
           {/* Detailed 3D Plate with Glow */}
           <div className="w-[420px] h-12 bg-gradient-to-b from-zinc-200 to-zinc-400 rounded-[100%] shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative border-b-[6px] border-zinc-500 z-0 flex items-center justify-center mt-[-15px] before:content-[''] before:absolute before:-inset-4 before:bg-white/5 before:rounded-full before:blur-xl">
              <div className="absolute w-[80%] h-[70%] bg-gradient-to-br from-zinc-300 to-zinc-200 rounded-[100%] shadow-[inset_0_8px_16px_rgba(0,0,0,0.15)] flex items-center justify-center">
                 <div className="w-[60%] h-[50%] bg-zinc-300/50 rounded-[100%] border border-white/40"></div>
              </div>
           </div>
       </div>

       {stack.length === 6 && (
         <div className="absolute top-1/4 right-8 flex flex-col items-end gap-2 pr-8 animate-in fade-in slide-in-from-right-10 duration-1000 delay-1000 text-orange-400 font-heading font-black tracking-[0.2em] pointer-events-none drop-shadow-xl" data-html2canvas-ignore>
           <div className="animate-pulse">↓ IT'S FULLY INTERACTIVE ↓</div>
           <div className="text-zinc-400 text-sm tracking-wide">Drag layers to re-arrange your masterpiece</div>
         </div>
       )}
    </div>
  );
}
