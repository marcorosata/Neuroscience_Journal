import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatAuthors(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`;
}

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'research': return 'bg-berry/10 text-berry';
    case 'review': return 'bg-ladybug/10 text-ladybug';
    case 'methods': return 'bg-maroon/10 text-maroon';
    case 'case-study': return 'bg-poppy/10 text-poppy';
    default: return 'bg-gray-100 text-gray-600';
  }
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'research': return 'Research';
    case 'review': return 'Review';
    case 'methods': return 'Methods';
    case 'case-study': return 'Case Study';
    default: return 'Article';
  }
}
