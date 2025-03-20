
import { cn } from '@/lib/utils';

// Staggered animation helpers
export const getStaggeredAnimation = (index: number, baseClass: string) => {
  return cn(baseClass, index > 0 && `animation-delay-${(index % 5) * 200}`);
};

// Entrance animations
export const fadeInUp = (index: number = 0) => {
  return getStaggeredAnimation(index, 'animate-fade-in');
};

export const scaleIn = (index: number = 0) => {
  return getStaggeredAnimation(index, 'animate-scale-in');
};

export const slideUp = (index: number = 0) => {
  return getStaggeredAnimation(index, 'animate-slide-up');
};

export const blurIn = (index: number = 0) => {
  return getStaggeredAnimation(index, 'animate-blur-in');
};

// Page transition animation
export const pageTransition = "transition-opacity duration-300";
