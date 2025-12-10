import AxiosMockAdapter from 'axios-mock-adapter';
import { apiClient } from './axios.js';

// Initialize Mock Adapter
const mock = new AxiosMockAdapter(apiClient, { delayResponse: 600 });

// --- Initial Data ---
let mockProducts = Array.from({ length: 50 }).map((_, i) => ({
  id: `PROD-${1000 + i}`,
  sku: `SKU-${1000 + i}`,
  name: `Industrial Component ${String.fromCharCode(65 + (i % 26))}-${i}`,
  description: `High-grade industrial component suitable for heavy machinery sector ${i}. Includes standard warranty.`,
  category: ['Electronics', 'Office', 'Industrial', 'Furniture'][i % 4],
  stock: Math.floor(Math.random() * 1000),
  price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
  location: `WH-${Math.floor(i / 10) + 1}-R${i % 10}`,
  status: Math.random() > 0.2 ? 'Active' : 'Discontinued',
  isFragile: Math.random() > 0.8,
  lastUpdated: new Date().toISOString(),
}));

// --- Dashboard Data ---
const salesTrendData = [
  { month: 'Jan', revenue: 4000, orders: 240 },
  { month: 'Feb', revenue: 3000, orders: 198 },
  { month: 'Mar', revenue: 2000, orders: 120 },
  { month: 'Apr', revenue: 2780, orders: 190 },
  { month: 'May', revenue: 1890, orders: 110 },
  { month: 'Jun', revenue: 2390, orders: 160 },
  { month: 'Jul', revenue: 3490, orders: 210 },
];

const categoryData = [
  { name: 'Electronics', value: 400 },
  { name: 'Office', value: 300 },
  { name: 'Industrial', value: 300 },
  { name: 'Furniture', value: 200 },
];

// --- Route Handlers ---

// Dashboard
mock.onGet('/dashboard/stats').reply(() => {
  const totalValue = mockProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const lowStock = mockProducts.filter(p => p.stock < 50).length;
  const activeItems = mockProducts.filter(p => p.status === 'Active').length;
  
  return [200, {
    totalInventoryValue: totalValue,
    lowStockCount: lowStock,
    activeItemCount: activeItems,
    pendingOrders: 14
  }];
});

mock.onGet('/dashboard/sales-trend').reply(200, salesTrendData);
mock.onGet('/dashboard/category-dist').reply(200, categoryData);

// Products
mock.onGet('/products').reply(() => [200, mockProducts]);

mock.onPost('/products').reply((config) => {
  const data = JSON.parse(config.data);
  const newProduct = {
    ...data,
    id: `PROD-${Math.floor(Math.random() * 10000)}`,
    lastUpdated: new Date().toISOString(),
  };
  mockProducts = [newProduct, ...mockProducts];
  return [201, newProduct];
});

mock.onPut(new RegExp('/products/*')).reply((config) => {
  const urlParts = config.url?.split('/');
  const id = urlParts ? urlParts[urlParts.length - 1] : '';
  const data = JSON.parse(config.data);

  const index = mockProducts.findIndex(p => p.id === id);
  if (index > -1) {
    mockProducts[index] = { ...mockProducts[index], ...data, lastUpdated: new Date().toISOString() };
    return [200, mockProducts[index]];
  }
  return [404, { message: 'Product not found' }];
});

mock.onDelete(new RegExp('/products/*')).reply((config) => {
  const urlParts = config.url?.split('/');
  const id = urlParts ? urlParts[urlParts.length - 1] : '';
  mockProducts = mockProducts.filter(p => p.id !== id);
  return [200, { success: true }];
});

export default mock;