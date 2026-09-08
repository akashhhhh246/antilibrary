import express from 'express';
import cors from 'cors';
import { storage } from './storage.js';
import type { AbandonedItem, Category, AbandonStatus } from './types.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'anti-library-backend', timestamp: Date.now() });
});

// GET /api/items - list items with optional filters
app.get('/api/items', (req, res) => {
  const { category, status, search } = req.query;
  let items = storage.getAll();

  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter((item) => item.category === category);
  }

  if (status && typeof status === 'string') {
    items = items.filter((item) => item.status === status);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.droppedAt.toLowerCase().includes(q) ||
        item.abandonReason.toLowerCase().includes(q) ||
        (item.deathEpitaph && item.deathEpitaph.toLowerCase().includes(q))
    );
  }

  res.json(items);
});

// GET /api/items/:id - get single item
app.get('/api/items/:id', (req, res) => {
  const item = storage.getById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// POST /api/items - create new item
app.post('/api/items', (req, res) => {
  const { title, category, droppedAt, abandonReason } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!droppedAt || typeof droppedAt !== 'string' || !droppedAt.trim()) {
    return res.status(400).json({ error: 'Location dropped is required' });
  }

  const created = storage.create({
    title: title.trim(),
    category: (category as Category) || 'Other',
    droppedAt: droppedAt.trim(),
    abandonReason: (abandonReason && typeof abandonReason === 'string') ? abandonReason.trim() : 'No reason specified'
  });

  res.status(201).json(created);
});

// PUT /api/items/:id - update item
app.put('/api/items/:id', (req, res) => {
  const updated = storage.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(updated);
});

// POST /api/items/:id/revive - log 20-min revival sprint
app.post('/api/items/:id/revive', (req, res) => {
  const existing = storage.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updated = storage.update(req.params.id, {
    status: 'Reviving',
    streakOrRevivalCount: existing.streakOrRevivalCount + 1,
    lastInteractedAt: Date.now()
  });

  res.json(updated);
});

// POST /api/items/:id/declare-dead - send to graveyard with eulogy
app.post('/api/items/:id/declare-dead', (req, res) => {
  const { epitaph } = req.body;
  const existing = storage.getById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updated = storage.update(req.params.id, {
    status: 'Officially Dead',
    deathEpitaph: (epitaph && typeof epitaph === 'string' && epitaph.trim()) ? epitaph.trim() : 'Rest in peace. Let go without guilt.',
    lastInteractedAt: Date.now()
  });

  res.json(updated);
});

// DELETE /api/items - delete all items
app.delete('/api/items', (_req, res) => {
  storage.bulkImport([]);
  res.json({ message: 'All items deleted successfully', count: 0 });
});

// DELETE /api/items/:id - delete item
app.delete('/api/items/:id', (req, res) => {
  const deleted = storage.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json({ message: 'Deleted successfully', id: req.params.id });
});

// GET /api/reckoning/random - draw random stalled item for Sunday Reckoning
app.get('/api/reckoning/random', (_req, res) => {
  const randomItem = storage.getRandomLimboItem();
  res.json({ item: randomItem });
});

// GET /api/stats - get full metrics and guilt reclaimed
app.get('/api/stats', (_req, res) => {
  const stats = storage.computeStats();
  res.json(stats);
});

// POST /api/sample/reset - reset library to sample items
app.post('/api/sample/reset', (_req, res) => {
  const items = storage.resetToSample();
  res.json({ message: 'Reset to sample items successfully', items });
});

// POST /api/backup/import - bulk import
app.post('/api/backup/import', (req, res) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Expected items array in request body' });
  }

  const imported = storage.bulkImport(items);
  res.json({ message: `Successfully imported ${imported.length} items`, count: imported.length });
});

// GET /api/backup/export - export items
app.get('/api/backup/export', (_req, res) => {
  const items = storage.getAll();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=anti_library_export_${new Date().toISOString().slice(0, 10)}.json`);
  res.send(JSON.stringify(items, null, 2));
});

app.listen(PORT, () => {
  console.log(`✨ Anti-Library Backend Server is running on http://localhost:${PORT}`);
});
