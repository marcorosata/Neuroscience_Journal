import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  staggerDelay?: number;
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
    staggerDelay = 0
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return { elementRef, isVisible, hasTriggered };
}

export function useStaggeredReveal(itemCount: number, options: ScrollRevealOptions = {}) {
  const { staggerDelay = 100, ...restOptions } = options;
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false));
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          
          // Stagger the reveal of items
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * staggerDelay + (restOptions.delay || 0));
          }
        }
      },
      {
        threshold: restOptions.threshold || 0.1,
        rootMargin: restOptions.rootMargin || '0px 0px -50px 0px',
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [itemCount, staggerDelay, hasTriggered, restOptions.delay, restOptions.threshold, restOptions.rootMargin]);

  return { containerRef, visibleItems, hasTriggered };
}