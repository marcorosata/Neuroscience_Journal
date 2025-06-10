import { ReactNode, forwardRef, useEffect, useState } from 'react';
import { useScrollReveal, useStaggeredReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  as?: keyof JSX.IntrinsicElements;
}

export function ScrollReveal({ 
  children, 
  className, 
  direction = 'up', 
  delay = 0, 
  duration = 600,
  threshold = 0.1,
  triggerOnce = true
}: Omit<ScrollRevealProps, 'as'>) {
  const { elementRef, isVisible } = useScrollReveal({
    threshold,
    delay,
    triggerOnce,
  });

  const getTransformClasses = () => {
    const base = `transition-all ease-out`;
    const durationClass = `duration-${duration}`;
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${base} ${durationClass} opacity-0 translate-y-8 scale-95`;
        case 'down':
          return `${base} ${durationClass} opacity-0 -translate-y-8 scale-95`;
        case 'left':
          return `${base} ${durationClass} opacity-0 translate-x-8 scale-95`;
        case 'right':
          return `${base} ${durationClass} opacity-0 -translate-x-8 scale-95`;
        case 'scale':
          return `${base} ${durationClass} opacity-0 scale-75`;
        case 'rotate':
          return `${base} ${durationClass} opacity-0 rotate-12 scale-90`;
        case 'fade':
        default:
          return `${base} ${durationClass} opacity-0`;
      }
    }
    
    return `${base} ${durationClass} opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0`;
  };

  return (
    <div
      ref={elementRef}
      className={cn(getTransformClasses(), className)}
    >
      {children}
    </div>
  );
}

ScrollReveal.displayName = 'ScrollReveal';

interface StaggeredRevealProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
}

export function StaggeredReveal({
  children,
  className,
  itemClassName,
  staggerDelay = 150,
  direction = 'up',
  duration = 600
}: Omit<StaggeredRevealProps, 'as'>) {
  const { containerRef, visibleItems } = useStaggeredReveal(children.length, {
    staggerDelay,
    threshold: 0.1,
  });

  const getItemTransformClasses = (index: number) => {
    const base = `transition-all ease-out`;
    const durationClass = `duration-${duration}`;
    const isVisible = visibleItems[index];
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${base} ${durationClass} opacity-0 translate-y-8 scale-95`;
        case 'down':
          return `${base} ${durationClass} opacity-0 -translate-y-8 scale-95`;
        case 'left':
          return `${base} ${durationClass} opacity-0 translate-x-8 scale-95`;
        case 'right':
          return `${base} ${durationClass} opacity-0 -translate-x-8 scale-95`;
        case 'scale':
          return `${base} ${durationClass} opacity-0 scale-75`;
        case 'fade':
        default:
          return `${base} ${durationClass} opacity-0`;
      }
    }
    
    return `${base} ${durationClass} opacity-100 translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div ref={containerRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(getItemTransformClasses(index), itemClassName)}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

interface ProgressiveRevealProps {
  children: ReactNode;
  className?: string;
  sections: string[];
  sectionClassName?: string;
}

export function ProgressiveReveal({
  children,
  className,
  sections,
  sectionClassName
}: ProgressiveRevealProps) {
  return (
    <div className={className}>
      {sections.map((section, index) => (
        <ScrollReveal
          key={section}
          delay={index * 200}
          direction="up"
          className={sectionClassName}
          threshold={0.15}
        >
          <div data-section={section}>
            {children}
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function CountUp({ 
  end, 
  duration = 2000, 
  delay = 0, 
  prefix = '', 
  suffix = '',
  className 
}: CountUpProps) {
  const { elementRef, isVisible } = useScrollReveal({
    threshold: 0.5,
    delay,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}