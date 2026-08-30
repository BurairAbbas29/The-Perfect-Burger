import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const heroRef = useRef();

  useGSAP(() => {
    gsap.from('.hero-word', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out',
      delay: 0.2
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-32 md:py-48 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-60"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 className="font-heading font-black text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] uppercase tracking-tighter text-white drop-shadow-2xl">
          <span className="block overflow-hidden pb-2"><span className="hero-word block">Culinary Science,</span></span>
          <span className="block overflow-hidden"><span className="hero-word block text-orange-500">Digitally Engineered.</span></span>
        </h1>
        <p className="mt-12 max-w-lg text-zinc-400 text-lg md:text-2xl font-medium hero-word">
          Scroll down. Drag the right ingredients. Trust the physics. Build the flawless stack.
        </p>
      </div>
    </section>
  );
}