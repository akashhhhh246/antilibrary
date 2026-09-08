import { useState, useEffect, useCallback } from 'react';
import type { AbandonedItem, Category } from './types';
import { 
  getStoredItems, 
  saveItems, 
  computeStats, 
  getSoundSetting,
  setSoundSetting
} from './utils/storage';
import { 
  checkBackendHealth, 
  fetchItemsApi, 
  createItemApi,
  updateItemApi, 
  reviveItemApi, 
  declareDeadApi, 
  deleteItemApi,
  deleteAllItemsApi
} from './utils/api';
import { sounds } from './utils/audio';
import { Navbar } from './components/Navbar';
import { ShelfOfLimbo } from './components/ShelfOfLimbo';
import { EulogyRoom } from './components/EulogyRoom';
import { AddItemModal } from './components/AddItemModal';
import { EditItemModal } from './components/EditItemModal';
import { SundayReckoningModal } from './components/SundayReckoningModal';
import { DeclareDeadModal } from './components/DeclareDeadModal';
import { RevivalTimerModal } from './components/RevivalTimerModal';
import { ClearAllModal } from './components/ClearAllModal';
import confetti from 'canvas-confetti';
import { Server, Database } from 'lucide-react';

export function App() {
  const [items, setItems] = useState<AbandonedItem[]>(() => getStoredItems());
  const [currentView, setCurrentView] = useState<'limbo' | 'eulogy' | 'stats'>('limbo');
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  
  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AbandonedItem | null>(null);

  const [isReckoningOpen, setIsReckoningOpen] = useState(false);

  const [isDeclareDeadOpen, setIsDeclareDeadOpen] = useState(false);
  const [declaringDeadItem, setDeclaringDeadItem] = useState<AbandonedItem | null>(null);

  const [isRevivalTimerOpen, setIsRevivalTimerOpen] = useState(false);
  const [activeTimerItem, setActiveTimerItem] = useState<AbandonedItem | null>(null);

  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => getSoundSetting());

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  // Check backend connectivity and sync
  useEffect(() => {
    let mounted = true;
    async function syncBackend() {
      const isLive = await checkBackendHealth();
      if (!mounted) return;
      setIsBackendConnected(isLive);
      if (isLive) {
        try {
          const remoteItems = await fetchItemsApi();
          if (mounted && Array.isArray(remoteItems) && remoteItems.length > 0) {
            setItems(remoteItems);
          }
        } catch {
          // fallback to localStorage
        }
      }
    }
    syncBackend();
    return () => { mounted = false; };
  }, []);

  // Persist items to LocalStorage (and keep offline cache synced)
  useEffect(() => {
    saveItems(items);
  }, [items]);

  // Sync sound settings
  useEffect(() => {
    sounds.setSoundEnabled(soundEnabled);
    setSoundSetting(soundEnabled);
  }, [soundEnabled]);

  // Keyboard shortcut listener (ESC to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddItemOpen(false);
        setEditingItem(null);
        setIsReckoningOpen(false);
        setIsDeclareDeadOpen(false);
        setIsRevivalTimerOpen(false);
        setIsClearAllOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stats = computeStats(items);

  // Handlers for item operations
  const handleAddItem = async (data: {
    title: string;
    category: Category;
    droppedAt: string;
    abandonReason: string;
    daysAgo?: number;
  }) => {
    const lingeringMs = (data.daysAgo || 0) * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const newItem: AbandonedItem = {
      id: `item-${now}-${Math.random().toString(36).slice(2, 7)}`,
      title: data.title,
      category: data.category,
      droppedAt: data.droppedAt,
      abandonReason: data.abandonReason,
      dateAdded: now - lingeringMs,
      lastInteractedAt: now,
      status: 'In Limbo',
      streakOrRevivalCount: 0
    };

    setItems((prev) => [newItem, ...prev]);

    if (isBackendConnected) {
      try {
        const remoteCreated = await createItemApi({
          title: data.title,
          category: data.category,
          droppedAt: data.droppedAt,
          abandonReason: data.abandonReason
        });
        if (remoteCreated && remoteCreated.id) {
          setItems((prev) =>
            prev.map((it) => (it.id === newItem.id ? remoteCreated : it))
          );
        }
      } catch (err) {
        console.warn('Backend sync failed, stored locally:', err);
      }
    }

    showToast(`Added "${data.title}" to Shelf of Limbo`);
  };

  const handleSaveEditedItem = async (updatedItem: AbandonedItem) => {
    setItems((prev) =>
      prev.map((it) => (it.id === updatedItem.id ? updatedItem : it))
    );
    if (isBackendConnected) {
      updateItemApi(updatedItem.id, updatedItem).catch(() => {});
    }
    showToast(`Updated "${updatedItem.title}"`);
    setEditingItem(null);
  };

  const handleStartRevival = (item: AbandonedItem) => {
    setActiveTimerItem(item);
    setIsRevivalTimerOpen(true);
  };

  const handleCompleteRevival = async (item: AbandonedItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'Reviving',
              lastInteractedAt: Date.now(),
              streakOrRevivalCount: it.streakOrRevivalCount + 1
            }
          : it
      )
    );
    if (isBackendConnected) {
      reviveItemApi(item.id).catch(() => {});
    }
    showToast(`🔥 20-min revival logged for "${item.title}"! Status updated to Reviving.`);
  };

  const handleOpenDeclareDead = (item: AbandonedItem) => {
    setDeclaringDeadItem(item);
    setIsDeclareDeadOpen(true);
  };

  const handleConfirmDeclareDead = async (item: AbandonedItem, epitaph: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'Officially Dead',
              deathEpitaph: epitaph,
              lastInteractedAt: Date.now()
            }
          : it
      )
    );
    if (isBackendConnected) {
      declareDeadApi(item.id, epitaph).catch(() => {});
    }
    showToast(`🕊️ Sent "${item.title}" to the Eulogy Room with closure.`);
  };

  const handleResurrect = async (item: AbandonedItem) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'In Limbo',
              lastInteractedAt: Date.now()
            }
          : it
      )
    );
    if (isBackendConnected) {
      updateItemApi(item.id, { status: 'In Limbo' }).catch(() => {});
    }
    showToast(`✨ Resurrected "${item.title}" back to Shelf of Limbo.`);
  };

  const handleCompleteAccidentally = async (item: AbandonedItem) => {
    sounds.playRevivalSuccess();
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'Completed',
              lastInteractedAt: Date.now()
            }
          : it
      )
    );
    if (isBackendConnected) {
      updateItemApi(item.id, { status: 'Completed' }).catch(() => {});
    }
    showToast(`🎉 Marked "${item.title}" as accidentally finished!`);
  };

  const handleDelete = async (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (isBackendConnected) {
      deleteItemApi(id).catch(() => {});
    }
    showToast('Deleted item permanently.');
  };

  const handleEdit = (item: AbandonedItem) => {
    setEditingItem(item);
  };

  const handleClearAll = async () => {
    setItems([]);
    if (isBackendConnected) {
      deleteAllItemsApi().catch(() => {});
    }
    showToast('Wiped the entire library clean.');
  };

  const deadItems = items.filter((i) => i.status === 'Officially Dead');
  const limboItems = items.filter((i) => i.status === 'In Limbo');

  return (
    <div className="min-h-screen bg-[#0e0d0c] text-[#e4ded6] flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-stone-900/95 border border-stone-700 text-stone-200 shadow-2xl text-xs font-medium animate-fadeIn">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onOpenReckoning={() => setIsReckoningOpen(true)}
        onOpenClearAll={() => setIsClearAllOpen(true)}
        limboCount={stats.inLimboCount + stats.revivingCount}
        deadCount={stats.deadCount}
        totalCount={items.length}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabledState}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'limbo' && (
          <ShelfOfLimbo
            items={items}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onRevive={handleStartRevival}
            onDeclareDead={handleOpenDeclareDead}
            onComplete={handleCompleteAccidentally}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenClearAll={() => setIsClearAllOpen(true)}
          />
        )}

        {currentView === 'eulogy' && (
          <EulogyRoom
            deadItems={deadItems}
            totalHoursReclaimed={stats.estimatedHoursReclaimed}
            onResurrect={handleResurrect}
            onDelete={handleDelete}
            onSwitchToLimbo={() => setCurrentView('limbo')}
          />
        )}
      </main>

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAdd={handleAddItem}
      />

      <EditItemModal
        isOpen={editingItem !== null}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEditedItem}
      />

      <SundayReckoningModal
        isOpen={isReckoningOpen}
        limboItems={limboItems}
        onClose={() => setIsReckoningOpen(false)}
        onStartRevival={handleStartRevival}
        onDeclareDead={handleOpenDeclareDead}
      />

      <DeclareDeadModal
        isOpen={isDeclareDeadOpen}
        item={declaringDeadItem}
        onClose={() => {
          setIsDeclareDeadOpen(false);
          setDeclaringDeadItem(null);
        }}
        onConfirm={handleConfirmDeclareDead}
      />

      <RevivalTimerModal
        isOpen={isRevivalTimerOpen}
        item={activeTimerItem}
        onClose={() => {
          setIsRevivalTimerOpen(false);
          setActiveTimerItem(null);
        }}
        onCompleteRevival={handleCompleteRevival}
      />

      {/* Clear All Confirmation Modal */}
      <ClearAllModal
        isOpen={isClearAllOpen}
        totalCount={items.length}
        onClose={() => setIsClearAllOpen(false)}
        onConfirmClear={handleClearAll}
      />



      {/* Footer & Connection Status */}
      <footer className="border-t border-stone-800/60 py-6 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 font-mono max-w-7xl mx-auto w-full gap-3">
        <p>
          Anti-Library • Most apps celebrate what you finish; we celebrate what you guiltlessly let go.
        </p>
        <div className="flex items-center space-x-2">
          {isBackendConnected ? (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
              <Server className="w-3 h-3" />
              <span>Backend Connected (:5000)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] bg-stone-900 text-stone-400 border border-stone-800">
              <Database className="w-3 h-3 text-amber-500/70" />
              <span>Offline Local Storage</span>
            </span>
          )}
        </div>
      </footer>

    </div>
  );
}

export default App;
