import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import type { AbandonedItem, Category } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { sounds } from '../utils/audio';

interface EditItemModalProps {
  isOpen: boolean;
  item: AbandonedItem | null;
  onClose: () => void;
  onSave: (updated: AbandonedItem) => void;
}

const CATEGORIES: Category[] = [
  'Book',
  'Movie/Show',
  'Game',
  'Side Project / Idea',
  'Course / Tutorial',
  'Other'
];

const PRESET_REASONS = [
  'Lost the plot',
  'Life got busy',
  'Too boring / pacing dragged',
  'Too difficult / got stuck',
  'Shiny object syndrome',
  'Existential fatigue',
  'Endless exposition / dialogue',
  'Lost my saved file / branch conflict'
];

const PLACEHOLDER_LOCATIONS: Record<Category, string> = {
  'Book': 'e.g., Page 142, Chapter 6, 40% through',
  'Movie/Show': 'e.g., Season 2 Episode 4, 30 min in',
  'Game': 'e.g., Boss fight #4, 15 hours in, 2nd dungeon',
  'Side Project / Idea': 'e.g., Architecture design, Database schema setup',
  'Course / Tutorial': 'e.g., Module 3, Section 4: Recursion',
  'Other': 'e.g., Step 3, halfway through week 2'
};

export const EditItemModal = ({
  isOpen,
  item,
  onClose,
  onSave
}: EditItemModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Book');
  const [droppedAt, setDroppedAt] = useState('');
  const [abandonReason, setAbandonReason] = useState('');
  const [errors, setErrors] = useState<{ title?: string; droppedAt?: string }>({});

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setCategory(item.category);
      setDroppedAt(item.droppedAt);
      setAbandonReason(item.abandonReason);
    }
    setErrors({});
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; droppedAt?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!droppedAt.trim()) {
      newErrors.droppedAt = 'Location dropped is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    sounds.playClick();
    onSave({
      ...item,
      title: title.trim(),
      category,
      droppedAt: droppedAt.trim(),
      abandonReason: abandonReason.trim() || 'No specific reason given',
      lastInteractedAt: Date.now()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#161514] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100">
                Edit Item
              </h2>
              <p className="text-xs text-stone-400">
                Update details for this stalled item
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    sounds.playClick();
                    setCategory(cat);
                  }}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                    category === cat
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-stone-900/70 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                  }`}
                >
                  <CategoryIcon category={cat} className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Title / Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={`w-full bg-stone-900/90 border ${
                errors.title ? 'border-red-500' : 'border-stone-800 focus:border-amber-500/60'
              } rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          {/* Dropped At */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Where did you stop? <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              required
              value={droppedAt}
              onChange={(e) => {
                setDroppedAt(e.target.value);
                if (errors.droppedAt) setErrors({ ...errors, droppedAt: undefined });
              }}
              placeholder={PLACEHOLDER_LOCATIONS[category]}
              className={`w-full bg-stone-900/90 border ${
                errors.droppedAt ? 'border-red-500' : 'border-stone-800 focus:border-amber-500/60'
              } rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors`}
            />
            {errors.droppedAt && (
              <p className="mt-1 text-xs text-red-400">{errors.droppedAt}</p>
            )}
          </div>

          {/* Why Did You Abandon It? */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Why did you abandon it?
            </label>
            
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {PRESET_REASONS.map((reason) => (
                <button
                  type="button"
                  key={reason}
                  onClick={() => {
                    sounds.playClick();
                    setAbandonReason(reason);
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    abandonReason === reason
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-medium'
                      : 'bg-stone-900/60 text-stone-400 border-stone-800/80 hover:bg-stone-800 hover:text-stone-300'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <textarea
              rows={2}
              value={abandonReason}
              onChange={(e) => setAbandonReason(e.target.value)}
              placeholder="Or type your reason here..."
              className="w-full bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 rounded-xl px-4 py-2 text-sm text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-glow transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
