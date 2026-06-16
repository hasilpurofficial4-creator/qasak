const API_BASE = '/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

async function request(url: string, options: RequestOptions = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: options.method,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// Items
export const getItems = () => request('/items');
export const addItem = (item: any) => request('/items', { method: 'POST', body: item });
export const updateItem = (item: any) => request('/items', { method: 'PUT', body: item });
export const deleteItem = (id: string) => request(`/items?id=${id}`, { method: 'DELETE' });

// Categories
export const getCategories = () => request('/categories');
export const addCategory = (cat: any) => request('/categories', { method: 'POST', body: cat });
export const updateCategory = (cat: any) => request('/categories', { method: 'PUT', body: cat });
export const deleteCategory = (id: string) => request(`/categories?id=${id}`, { method: 'DELETE' });

// Orders
export const getOrders = () => request('/orders');
export const createOrder = (order: any) => request('/orders', { method: 'POST', body: order });
export const updateOrder = (order: any) => request('/orders', { method: 'PUT', body: order });
export const deleteOrder = (id: string) => request(`/orders?id=${id}`, { method: 'DELETE' });

// Contact
export const getContacts = () => request('/contact');
export const createContact = (msg: any) => request('/contact', { method: 'POST', body: msg });
export const deleteContact = (id: string) => request(`/contact?id=${id}`, { method: 'DELETE' });

// Settings
export const getSettings = () => request('/settings');
export const updateSettings = (settings: any) => request('/settings', { method: 'PUT', body: settings });

// Auth
export const loginAdmin = (username: string, password: string) =>
  request('/auth', { method: 'POST', body: { username, password } });

// ImgBB
export const uploadToImgBB = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.data.url;
};
