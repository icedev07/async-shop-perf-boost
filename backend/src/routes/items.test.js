const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const itemsRouter = require('./items');

const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Helper to reset data file before each test
const initialData = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 2499 },
  { id: 2, name: 'Noise Cancelling Headphones', category: 'Electronics', price: 399 },
  { id: 3, name: 'Ultra‑Wide Monitor', category: 'Electronics', price: 999 },
  { id: 4, name: 'Ergonomic Chair', category: 'Furniture', price: 799 },
  { id: 5, name: 'Standing Desk', category: 'Furniture', price: 1199 }
];

describe('items routes', () => {
  let app;

  beforeEach(async () => {
    await fs.writeFile(DATA_PATH, JSON.stringify(initialData, null, 2));
    app = express();
    app.use(express.json());
    app.use('/api/items', itemsRouter);
  });

  test('GET /api/items returns all items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(initialData.length);
    expect(res.body.pagination).toBeDefined();
    expect(res.body.pagination.totalItems).toBe(initialData.length);
  });

  test('GET /api/items?limit=2 returns limited items', async () => {
    const res = await request(app).get('/api/items?limit=2');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
  });

  test('GET /api/items?q=desk returns filtered items', async () => {
    const res = await request(app).get('/api/items?q=desk');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.items[0].name).toMatch(/desk/i);
  });

  test('GET /api/items with pagination returns correct page', async () => {
    const res = await request(app).get('/api/items?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(2);
    expect(res.body.pagination.currentPage).toBe(1);
    expect(res.body.pagination.itemsPerPage).toBe(2);
    expect(res.body.pagination.totalItems).toBe(initialData.length);
    expect(res.body.pagination.hasNextPage).toBe(true);
    expect(res.body.pagination.hasPrevPage).toBe(false);
  });

  test('GET /api/items with search across category', async () => {
    const res = await request(app).get('/api/items?q=electronics');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(3); // 3 electronics items
    expect(res.body.items.every(item => item.category === 'Electronics')).toBe(true);
  });

  test('GET /api/items/:id returns item by id', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Laptop Pro');
  });

  test('GET /api/items/:id returns 404 for missing item', async () => {
    const res = await request(app).get('/api/items/999');
    expect(res.status).toBe(404);
    console.log('404 body:', res.body);
    expect(res.body).toEqual({ message: 'Item not found' });
  });

  test('POST /api/items creates a new item', async () => {
    const newItem = { name: 'Test Item', category: 'Test', price: 123 };
    const res = await request(app).post('/api/items').send(newItem);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Item');
    // Should have an id
    expect(typeof res.body.id).toBe('number');
    // Should be in the data file
    const data = JSON.parse(await fs.readFile(DATA_PATH));
    expect(data.find(i => i.name === 'Test Item')).toBeTruthy();
  });
}); 