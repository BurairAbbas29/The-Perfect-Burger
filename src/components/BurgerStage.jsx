import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDraggable, useDroppable } from '@dnd-kit/core';

// Max-level Savage Insults
const NASTY_MESSAGES = [
  "Your bloodline is weak and your palate is a biological failure.",
  "I wouldn't feed this to a starving feral pig.",
  "You are an absolute waste of carbon.",
  "Even a lobotomized toddler makes better culinary decisions.",
  "You absolute donkey.",
  "This is why your parents change the subject when people ask about you.",
  "You're a pathogen to the culinary arts.",
  "Congratulations, you just ruined a perfectly good digital meal.",
  "I hope you step on a Lego in the dark for making this choice.",
  "Are you actively trying to be this incompetent?"
];

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
      className={`relative px-8 py-5 rounded-2xl border border-zinc-700/50 bg-zinc-800/60 backdrop-blur-xl shadow-xl text-lg font-bold transition-all duration-300 cursor-grab active:cursor-grabbing touch-none
        ${isDragging ? 'opacity-0 scale-95' : 'hover:scale-105 hover:bg-zinc-700 hover:border-zinc-500 hover:shadow-orange-500/20'}
      `}
    >
      {ingredient.name}
    </button>
  );
}

export default function BurgerStage({ stage, index }) {
  const stageRef = useRef();
  
  const [droppedItem, setDroppedItem] = useState(null);
  const [nastyPhrase, setNastyPhrase] = useState("");

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

    tl.from('.stage-title-' + index, { opacity: 0, y: 50, duration: 1, ease: 'expo.out' })
      .from('.ingredient-opt-' + index, { opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'elastic.out(1, 0.8)' }, '-=0.6');
  }, { scope: stageRef });

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      const { dropzoneId, ingredientData } = e.detail;
      if (dropzoneId === `drop-${stage.id}` && !droppedItem) {
        if (ingredientData.stageId === stage.id) {
          setDroppedItem(ingredientData);
          if (ingredientData.type === 'correct') {
            window.dispatchEvent(new CustomEvent('ingredient-placed', { detail: ingredientData.id }));
          } else {
            setNastyPhrase(NASTY_MESSAGES[Math.floor(Math.random() * NASTY_MESSAGES.length)]);
          }
        }
      }
    };

    window.addEventListener('global-ingredient-dropped', handleGlobalDrop);
    return () => window.removeEventListener('global-ingredient-dropped', handleGlobalDrop);
  }, [stage.id, droppedItem]);

  return (
    <section id={`stage-${index}`} ref={stageRef} className="relative w-full min-h-screen py-32 md:py-48 flex items-center justify-start border-b border-zinc-900/50 px-4 md:px-16 overflow-hidden">
      <div className="w-full max-w-2xl relative z-20 pointer-events-auto">
        <div className={`text-orange-500 font-bold tracking-widest text-sm mb-4 opacity-70 stage-title-${index}`}>STAGE 0{index + 1}</div>
        <h2 className={`stage-title-${index} font-heading font-black text-6xl md:text-7xl mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 uppercase leading-none pb-2`}>
          {stage.title}
        </h2>

        {!droppedItem ? (
          <div className={`mt-10 flex flex-wrap gap-4 ingredient-opt-${index}`}>
            {stage.options.map((opt) => (
              <DraggableIngredient key={opt.id} ingredient={opt} />
            ))}
          </div>
        ) : (
          droppedItem.type === 'correct' ? (
            <div className="mt-10 bg-zinc-900/40 border-l-4 border-orange-500 p-8 rounded-2xl backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <h3 className="font-heading font-black text-4xl text-orange-400 mb-4 tracking-tight">Impeccable.</h3>
              <p className="text-zinc-300 text-lg leading-relaxed">{stage.explanation}</p>
              <div className="mt-8 text-sm text-white/40 uppercase tracking-widest font-bold animate-pulse">Scroll down to continue ↓</div>
            </div>
          ) : (
            <div className="mt-10 bg-red-950/30 border-l-4 border-red-600 p-8 rounded-2xl backdrop-blur-xl shadow-2xl flex flex-col items-start gap-4 animate-in fade-in zoom-in-95 duration-500 ease-out">
              <h3 className="font-heading font-black text-4xl md:text-5xl text-red-500 drop-shadow-xl">{nastyPhrase}</h3>
              <p className="text-zinc-300 text-xl leading-relaxed mt-2">
                Who in their right mind puts <strong className="text-red-400 underline decoration-red-500/30">{droppedItem.name}</strong> on a masterpiece?
              </p>
              <button 
                onClick={() => setDroppedItem(null)} 
                className="px-8 py-3 bg-red-600/90 hover:bg-red-500 text-white font-bold rounded-lg mt-6 shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                I repent. Let me try again.
              </button>
            </div>
          )
        )}

        {!droppedItem && (
          <div
            ref={setDroppableRef}
            className={`mt-12 w-full max-w-lg h-48 rounded-3xl flex items-center justify-center transition-all duration-500 border border-white/5
              ${isOver ? 'shadow-[0_0_40px_rgba(249,115,22,0.3)] bg-orange-500/10 scale-[1.02] ring-1 ring-orange-500' : 'bg-gradient-to-b from-zinc-900/60 to-zinc-900/20 backdrop-blur-md shadow-inner'}
            `}
          >
            <div className="absolute inset-0 rounded-3xl bg-[url('data:image/svg+xml,%3Csvg width=\\'20\\' height=\\'20\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Ccircle cx=\\'2\\' cy=\\'2\\' r=\\'1\\' fill=\\'%23ffffff\\' fill-opacity=\\'0.05\\'/%3E%3C/svg%3E')] opacity-50 pointer-events-none"></div>
            <span className={`relative font-heading text-xl font-bold uppercase tracking-[0.2em] pointer-events-none text-center px-4 transition-all duration-300 ${isOver ? 'text-orange-400 scale-110 drop-shadow-md' : 'text-zinc-600'}`}>
              {isOver ? 'Release to place' : 'Drop ingredient here'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
