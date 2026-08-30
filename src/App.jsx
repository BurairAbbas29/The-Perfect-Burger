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
  },
  {
    id: 'crunch',
    title: 'The Crunch',
    correctIngredient: 'onions-pickles',
    explanation: 'A balanced combination of sharp diced onions and acidic pickles slices through the heavy fat profile of the beef and cheese.',
    options: [
      { id: 'tomato', name: 'Thick Tomatoes', type: 'wrong' },
      { id: 'ketchup', name: 'Ketchup', type: 'wrong' },
      { id: 'onions-pickles', name: 'Onions & Pickles', type: 'correct' },
    ]
  },
  {
    id: 'sauce',
    title: 'The Zest',
    correctIngredient: 'house-sauce',
    explanation: 'A creamy, tangy house sauce provides the necessary moisture and flavor bridge that brings every other element into perfect harmony.',
    options: [
      { id: 'house-sauce', name: 'House Sauce', type: 'correct' },
      { id: 'mustard', name: 'Diet Mustard', type: 'wrong' },
      { id: 'bbq', name: 'Heavy BBQ', type: 'wrong' },
    ]
  },
  {
    id: 'top-bun',
    title: 'The Crown',
    correctIngredient: 'top-bun',
    explanation: 'A soft, toasted crown seals the experience. The perfect vessel to deliver culinary supremacy to your palate.',
    options: [
      { id: 'lettuce-wrap', name: 'Lettuce Wrap', type: 'wrong' },
      { id: 'top-bun', name: 'Sesame Top Bun', type: 'correct' },
      { id: 'toast', name: 'Sourdough Toast', type: 'wrong' },
    ]
  }
];

export default function App() {
  const container = useRef();

  const scrollToStart = () => {
    document.getElementById('stage-0')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-white font-sans overflow-x-hidden" ref={container}>
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="font-heading font-bold text-xl tracking-tighter">PERFECT.BURGER</div>
        <button onClick={scrollToStart} className="pointer-events-auto px-5 py-2.5 bg-white text-black rounded-full font-medium text-sm hover:scale-105 transition-transform duration-300">
          Build Yours
        </button>
      </nav>

      <Hero onBuildClick={scrollToStart} />

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
