import { BookOpen, Film, Gamepad2, Lightbulb, GraduationCap, Compass } from 'lucide-react';
import type { Category } from '../types';

interface CategoryIconProps {
  category: Category;
  className?: string;
}

export const getCategoryColor = (category: Category): { bg: string; text: string; border: string; glow: string } => {
  switch (category) {
    case 'Book':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-800/40',
        glow: 'rgba(245, 158, 11, 0.2)'
      };
    case 'Movie/Show':
      return {
        bg: 'bg-indigo-950/40',
        text: 'text-indigo-400',
        border: 'border-indigo-800/40',
        glow: 'rgba(99, 102, 241, 0.2)'
      };
    case 'Game':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-800/40',
        glow: 'rgba(16, 185, 129, 0.2)'
      };
    case 'Side Project / Idea':
      return {
        bg: 'bg-orange-950/40',
        text: 'text-orange-400',
        border: 'border-orange-800/40',
        glow: 'rgba(249, 115, 22, 0.2)'
      };
    case 'Course / Tutorial':
      return {
        bg: 'bg-cyan-950/40',
        text: 'text-cyan-400',
        border: 'border-cyan-800/40',
        glow: 'rgba(6, 182, 212, 0.2)'
      };
    case 'Other':
    default:
      return {
        bg: 'bg-stone-900',
        text: 'text-stone-400',
        border: 'border-stone-800',
        glow: 'rgba(168, 162, 158, 0.2)'
      };
  }
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-4 h-4' }) => {
  switch (category) {
    case 'Book':
      return <BookOpen className={className} />;
    case 'Movie/Show':
      return <Film className={className} />;
    case 'Game':
      return <Gamepad2 className={className} />;
    case 'Side Project / Idea':
      return <Lightbulb className={className} />;
    case 'Course / Tutorial':
      return <GraduationCap className={className} />;
    case 'Other':
    default:
      return <Compass className={className} />;
  }
};
