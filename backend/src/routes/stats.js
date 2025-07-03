const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;
let lastCacheTime = 0;

// Watch for changes to items.json and invalidate cache (only if file exists)
try {
  if (fs.existsSync(DATA_PATH)) {
    fs.watch(DATA_PATH, () => {
      cachedStats = null;
    });
  }
} catch (e) {
  // Ignore watch errors (e.g., file doesn't exist in test env)
}

// Helper to calculate stats
function calculateStats(items) {
  return {
    total: items.length,
    averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
  };
}

// GET /api/stats
router.get('/', (req, res, next) => {
  if (cachedStats) {
    return res.json(cachedStats);
  }
  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);
    const items = JSON.parse(raw);
    cachedStats = calculateStats(items);
    lastCacheTime = Date.now();
    res.json(cachedStats);
  });
});

// Export for testability
module.exports = router;
module.exports._resetCache = () => { cachedStats = null; };