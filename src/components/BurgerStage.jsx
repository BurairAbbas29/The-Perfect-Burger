import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter } from '@dnd-kit/core';

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
  const [activeId, setActiveId] = useState(null);

  const activeIngredient = activeId ? stage.options.find(opt => opt.id === activeId) : null;

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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveId(null);
    if (over && over.id === `drop-${stage.id}`) {
      if (active.data.current.type === 'correct') {
        setCompleted(true);
        setErrorObj(null);
        window.dispatchEvent(new CustomEvent('ingredient-placed', { detail: stage.id }));
      } else {
        setErrorObj(active.id);
        setTimeout(() => setErrorObj(null), 1000);
      }
    }
  };

  return (
    <section id={`stage-${index}`} ref={stageRef} className="relative w-full min-h-screen py-32 md:py-48 flex items-center justify-start border-b border-zinc-900 border-dashed px-4 md:px-16 overflow-hidden">
      <div className="w-full max-w-2xl relative z-20 pointer-events-auto">
        <h2 className={`stage-title-${index} font-heading font-black text-6xl md:text-7xl mb-4 text-white uppercase leading-none`}>
          {index + 1}. {stage.title}
        </h2>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
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
              <span className="font-heading text-2xl text-zinc-600 font-black uppercase tracking-widest pointer-events-none text-center px-4">
                {isOver ? 'Drop It!' : 'Drag the perfect ingredient here'}
              </span>
            </div>
          )}

          <DragOverlay>
            {activeIngredient ? (
              <div className="relative px-6 py-4 rounded-xl border border-orange-500 bg-zinc-800 backdrop-blur-md shadow-2xl text-lg font-bold ring-4 ring-orange-500 rotate-3 z-[9999] opacity-95 scale-110 pointer-events-none whitespace-nowrap">
                {activeIngredient.name}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  );
}
