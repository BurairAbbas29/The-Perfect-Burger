import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Hero() {
  const heroRef = useRef();

  useGSAP(() => {
    gsap.from('.hero-word', {
      y: 120,
      opacity: 0,
      rotationX: -45,
      transformOrigin: "0% 50% -50",
      duration: 1.6,
      stagger: 0.08,
      ease: 'expo.out',
      delay: 0.2
    });
    
    gsap.to('.hero-bg', {
      scale: 1.1,
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-32 md:py-48 px-4">
      <div className="hero-bg absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-zinc-950 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/90 z-0"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        <h1 className="font-heading font-black text-[clamp(3rem,9vw,8rem)] leading-[0.85] uppercase tracking-tighter drop-shadow-2xl" style={{ perspective: '1000px' }}>
          <span className="block overflow-hidden pb-4"><span className="hero-word block text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-400">Culinary Science,</span></span>
          <span className="block overflow-hidden pb-4"><span className="hero-word block text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-orange-600">Digitally Engineered.</span></span>
        </h1>
        <p className="mt-10 max-w-lg text-zinc-400 text-lg md:text-xl font-medium hero-word tracking-wide">
          Scroll down. Drag the right ingredients. Trust the physics. Build the flawless stack.
        </p>
      </div>
    </section>
  );
}
