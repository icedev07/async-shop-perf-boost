const statsRouter = require('./stats');
const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const request = require('supertest');

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

const initialData = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
  { id: 2, name: 'Noise Cancelling Headphones', category: 'Electronics', price: 399 },
  { id: 3, name: 'Ultra‑Wide Monitor', category: 'Electronics', price: 999 },
  { id: 4, name: 'Ergonomic Chair', category: 'Furniture', price: 799 },
  { id: 5, name: 'Standing Desk', category: 'Furniture', price: 1199 }
];

describe('stats routes', () => {
  let app;

  beforeEach(async () => {
    // Ensure data directory exists
    const dir = path.dirname(DATA_PATH);
    try { await fs.mkdir(dir, { recursive: true }); } catch (e) {}
    await fs.writeFile(DATA_PATH, JSON.stringify(initialData, null, 2));
    app = express();
    app.use('/api/stats', statsRouter);
    if (statsRouter._resetCache) statsRouter._resetCache();
  });

  test('GET /api/stats returns correct stats', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(initialData.length);
    const avg = initialData.reduce((a, b) => a + b.price, 0) / initialData.length;
    expect(res.body.averagePrice).toBeCloseTo(avg);
  });

  test('GET /api/stats returns error if data file missing', async () => {
    // Remove the data file
    await fs.unlink(DATA_PATH);
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(500);
  });
}); 