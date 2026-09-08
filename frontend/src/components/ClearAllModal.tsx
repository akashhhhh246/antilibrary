import { AlertTriangle, Trash2, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ClearAllModalProps {
  isOpen: boolean;
  totalCount: number;
  onClose: () => void;
  onConfirmClear: () => void;
}

export const ClearAllModal = ({
  isOpen,
  totalCount,
  onClose,
  onConfirmClear,
}: ClearAllModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#161514] border border-red-900/40 rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
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

        {/* Content */}
        <h2 className="font-serif text-xl font-bold text-stone-100 mb-2">
          Delete Entire Library?
        </h2>
        <p className="text-sm text-stone-400 mb-6 leading-relaxed">
          This will permanently delete all <span className="font-mono text-stone-200 font-semibold">{totalCount} items</span> from both the <strong className="text-stone-300">Shelf of Limbo</strong> and <strong className="text-stone-300">The Eulogy Room</strong>.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onConfirmClear();
              onClose();
            }}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white shadow-lg transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Everything</span>
          </button>
        </div>
      </div>
    </div>
  );
};
