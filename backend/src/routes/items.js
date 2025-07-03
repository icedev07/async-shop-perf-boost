const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (now async)
async function readData() {
  const raw = await fs.readFile(DATA_PATH);
  return JSON.parse(raw);
}

// Utility to write data (async)
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, page, pageSize } = req.query;
    let results = data;

    // Search across name and category
    if (q) {
      const searchTerm = q.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Handle pagination vs legacy limit parameter
    if (page || pageSize) {
      // Use pagination
      const currentPage = parseInt(page) || 1;
      const itemsPerPage = parseInt(pageSize) || 10;
      const totalItems = results.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      
      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      results = results.slice(startIndex, endIndex);

      // Return with metadata
      res.json({
        items: results,
        pagination: {
          currentPage,
          itemsPerPage,
          totalItems,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1
        }
      });
    } else {
      // Use legacy limit parameter
      if (limit) {
        results = results.slice(0, parseInt(limit));
      }

      // Return simple array for backward compatibility
      res.json({
        items: results,
        pagination: {
          currentPage: 1,
          itemsPerPage: results.length,
          totalItems: results.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      // Consistent error response for tests
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;