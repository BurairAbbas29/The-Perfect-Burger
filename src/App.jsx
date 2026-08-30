import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Hero from './components/Hero';
import BurgerStage from './components/BurgerStage';
import BurgerStack from './components/BurgerStack';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STAGES = [
  {
    id: 'bottom-bun',
    title: 'The Foundation',
    correctIngredient: 'toasted-bun',
    explanation: 'A toasted bottom bun creates a structural barrier against meat juices, preventing the dreaded soggy burger.',
    options: [
      { id: 'lettuce-leaf', name: 'Lettuce Leaf', type: 'wrong' },
      { id: 'toasted-bun', name: 'Toasted Bun', type: 'correct' },
      { id: 'raw-bun', name: 'Raw Bun', type: 'wrong' },
    ]
  },
  {
    id: 'patty',
    title: 'The Core',
    correctIngredient: 'smashed-patty',
    explanation: 'The Maillard reaction from a smashed patty delivers a deeply savory crust that thick patties simply cannot match.',
    options: [
      { id: 'grilled-chicken', name: 'Grilled Chicken', type: 'wrong' },
      { id: 'boiled-beef', name: 'Boiled Beef', type: 'wrong' },
      { id: 'smashed-patty', name: 'Smashed Patty', type: 'correct' },
    ]
  },
  {
    id: 'cheese',
    title: 'The Blanket',
    correctIngredient: 'american-cheese',
    explanation: 'American cheese is unmatched in its melting properties, acting as an emulsion that binds the stack together.',
    options: [
      { id: 'blue-cheese', name: 'Blue Cheese', type: 'wrong' },
      { id: 'american-cheese', name: 'American Cheese', type: 'correct' },
      { id: 'swiss-cheese', name: 'Swiss Cheese', type: 'wrong' },
    ]
  }
];

export default function App() {
  const container = useRef();

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden" ref={container}>
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
        <div className="font-heading font-bold text-xl tracking-tighter">PERFECT.BURGER</div>
        <button className="px-5 py-2.5 bg-white text-black rounded-full font-medium text-sm hover:scale-105 transition-transform duration-300">
          Build Yours
        </button>
      </nav>

      <Hero />

      <div className="relative z-10 w-full">
        {STAGES.map((stage, index) => (
          <BurgerStage key={stage.id} stage={stage} index={index} />
        ))}
      </div>

      <BurgerStack stages={STAGES} />

      <footer className="w-full py-48 bg-zinc-900 flex flex-col items-center justify-center text-center px-4 z-20 relative border-t border-zinc-800">
        <h2 className="font-heading font-black text-6xl md:text-8xl mb-8 uppercase">Bon Appétit</h2>
        <p className="text-zinc-400 max-w-lg mb-12 text-xl leading-relaxed">You have constructed the perfect burger based on culinary science and ruthless engineering.</p>
        <button className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full text-xl transition-all hover:scale-105">
          Share Your Masterpiece
        </button>
      </footer>
    </main>
  );
}