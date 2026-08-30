import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

function DraggableIngredient({ ingredient }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ingredient.id,
    data: ingredient
  });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative px-6 py-4 rounded-xl border border-zinc-700 bg-zinc-800/80 backdrop-blur-md shadow-2xl text-lg font-bold transition-colors cursor-grab active:cursor-grabbing touch-none
        ${isDragging ? 'opacity-0' : 'hover:scale-105 hover:bg-zinc-700'}
      `}
    >
      {ingredient.name}
    </button>
  );
}

export default function BurgerStage({ stage, index }) {
  const stageRef = useRef();
  const [completed, setCompleted] = useState(false);
  const [errorObj, setErrorObj] = useState(null);

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: `drop-${stage.id}`,
  });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stageRef.current,
        start: 'top 60%',
        end: 'bottom center',
        toggleActions: 'play none none reverse',
      }
    });

    tl.from('.stage-title-' + index, { opacity: 0, x: -50, duration: 0.8, ease: 'power3.out' })
      .from('.ingredient-opt-' + index, { opacity: 0, y: 30, stagger: 0.1, duration: 0.5, ease: 'back.out(1.5)' }, '-=0.4');
  }, { scope: stageRef });

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      const { dropzoneId, ingredientData, ingredientId } = e.detail;
      if (dropzoneId === `drop-${stage.id}`) {
        if (ingredientData.stageId === stage.id && ingredientData.type === 'correct') {
          setCompleted(true);
          setErrorObj(null);
          // Pass the unique ingredientID that matches our STYLING mapping
          window.dispatchEvent(new CustomEvent('ingredient-placed', { detail: ingredientData.id }));
        } else {
          setErrorObj(ingredientId);
          setTimeout(() => setErrorObj(null), 1000);
        }
      }
    };

    window.addEventListener('global-ingredient-dropped', handleGlobalDrop);
    return () => window.removeEventListener('global-ingredient-dropped', handleGlobalDrop);
  }, [stage.id]);

  return (
    <section id={`stage-${index}`} ref={stageRef} className="relative w-full min-h-screen py-32 md:py-48 flex items-center justify-start border-b border-zinc-900 border-dashed px-4 md:px-16 overflow-hidden">
      <div className="w-full max-w-2xl relative z-20 pointer-events-auto">
        <h2 className={`stage-title-${index} font-heading font-black text-6xl md:text-7xl mb-4 text-white uppercase leading-none`}>
          {index + 1}. {stage.title}
        </h2>

        {!completed ? (
          <div className={`mt-12 flex flex-wrap gap-4 ingredient-opt-${index}`}>
            {stage.options.map((opt) => (
              <DraggableIngredient key={opt.id} ingredient={opt} />
            ))}
          </div>
        ) : (
          <div className="mt-12 bg-orange-900/10 border border-orange-500/30 p-8 rounded-2xl backdrop-blur-md">
            <h3 className="font-heading font-bold text-3xl text-orange-400 mb-4">Perfect Choice.</h3>
            <p className="text-zinc-300 text-xl leading-relaxed">{stage.explanation}</p>
            <div className="mt-8 text-sm text-zinc-500 uppercase tracking-widest font-bold animate-pulse">Scroll down to continue ↓</div>
          </div>
        )}

        {!completed && (
          <div
            ref={setDroppableRef}
            className={`mt-12 w-full max-w-lg h-48 rounded-3xl border-4 border-dashed flex items-center justify-center transition-all duration-300
              ${isOver ? 'border-orange-500 bg-orange-500/10 scale-105' : 'border-zinc-700 bg-zinc-900/50'}
              ${errorObj ? 'animate-bounce border-red-600 bg-red-900/10' : ''}
            `}
          >
            <span className={`font-heading text-2xl font-black uppercase tracking-widest pointer-events-none text-center px-4 transition-colors ${isOver ? 'text-orange-400' : 'text-zinc-500'}`}>
              {isOver ? 'Drop It!' : 'Drag the perfect ingredient here'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
