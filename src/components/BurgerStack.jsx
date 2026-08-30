import React, { useState, useEffect, useRef } from 'react';
import gsap from ' gsap';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableIngredient({ id, styleClass, label, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 99 : 20 - index,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`stack-item-${id} ${styleClass} flex flex-col items-center justify-center relative touch-none select-none cursor-grab active:cursor-grabbing my-[-8px] transition-all
        ${isDragging ? 'shadow-2xl grayscale-[0.2] scale-105 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] opacity-95' : 'hover:brightness-110 drop-shadow-xl'}
      `}
    >
      <div className={`font-heading font-black text-xs uppercase tracking-widest pointer-events-none drop-shadow-md ${id === 'american-cheese' || id === 'house-sauce' ? 'text-black/60' : 'text-black/30'}`}>
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

  // 3D Kickflip Transformation when all 6 ingredients drop!
  useEffect(() => {
    if (stack.length === 6) {
      gsap.to(wrapperRef.current, {
        rotateX: 18,
        rotateY: -12,
        scale: 1.15,
        y: -100,
        x: -40,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5
      });
    }
  }, [stack.length]);

  const ITEM_STYLES = {
    'toasted-bun': 'bg-amber-500 rounded-b-[40px] rounded-t-lg h-16 w-64 shadow-[inset_0_-8px_10px_rgba(0,0,0,0.2)]',
    'smashed-patty': 'bg-red-950 rounded-xl h-10 w-64 shadow-[inset_0_-4px_0_rgba(0,0,0,0.6)]',
    'american-cheese': 'bg-yellow-400 rounded-md h-5 w-72 transform rotate-1 shadow-[0_4px_10px_rgba(250,204,21,0.3)]',
    'onions-pickles': 'bg-green-700 rounded-sm h-5 w-60 border-dashed border-t-2 border-b-2 border-green-900',
    'house-sauce': 'bg-orange-500 rounded-full h-7 w-56 opacity-95 blur-[0.5px]',
    'top-bun': 'bg-amber-500 rounded-t-[70px] rounded-b-md h-24 w-64 shadow-[inset_0_10px_10px_rgba(255,255,255,0.4)]',
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
    <div className="fixed top-0 right-0 w-full md:w-1/2 h-screen pointer-events-none z-40 flex flex-col justify-end items-center pb-24" style={{ perspective: '1000px' }}>
       
       <div ref={wrapperRef} className="relative flex flex-col items-center pointer-events-auto transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
           
           <SortableContext items={stack} strategy={verticalListSortingStrategy}>
              {stack.map((item, index) => (
                <SortableIngredient key={item} id={item} label={ITEM_LABELS[item]} styleClass={ITEM_STYLES[item]} index={index} />
              ))}
           </SortableContext>
           
           {/* Detailed 3D Plate */}
           <div className="w-[380px] h-10 bg-zinc-200 rounded-[100%] shadow-2xl relative border-b-[8px] border-zinc-400 z-0 flex items-center justify-center mt-[-10px]">
              <div className="absolute w-[85%] h-[75%] bg-zinc-300 rounded-[100%] shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)]"></div>
           </div>
       </div>

       {stack.length === 6 && (
         <div className="absolute top-1/4 right-10 flex flex-col items-end gap-2 pr-8 animate-pulse text-orange-400 font-heading font-black tracking-widest pointer-events-none">
           <div>↓ IT'S FULLY INTERACTIVE ↓</div>
           <div className="text-zinc-400 text-sm">Drag layers to re-arrange your stack</div>
         </div>
       )}
    </div>
  );
}
