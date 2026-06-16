import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems, addItem, updateItem, deleteItem, getCategories, addCategory, updateCategory, deleteCategory, getOrders, updateOrder, deleteOrder, getContacts, deleteContact, getSettings, updateSettings, uploadToImgBB } from '../api/service';
import toast from 'react-hot-toast';
import type { Product, Category, Order, ContactMessage, Settings } from '../types';
import { BarChart, ShoppingBag, Grid, Package, MessageCircle, Settings as SettingsIcon, Home, LogOut, Bell, Trash, ShoppingCart, Users, Menu, Plus, X } from '../components/Icons';
import './AdminDashboard.css';

/* Image Upload Zone */
function ImageUpload({ label, value, onUpload, uploading, multiple }: { label: string; value: string; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; uploading: boolean; multiple?: boolean }) {
  const images = value ? value.split(',').filter(Boolean) : [];
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className={`image-upload-zone ${images.length > 0 ? 'has-image' : ''}`}>
        {images.length > 0 && !multiple && (
          <div className="image-preview-single">
            <img src={images[0]} alt="Preview" />
          </div>
        )}
        {images.length > 0 && multiple && (
          <div className="image-preview-grid">
            {images.map((url, i) => (
              <div key={i} className="image-preview-thumb"><img src={url} alt={`img-${i}`} /></div>
            ))}
          </div>
        )}
        <label className={`image-drop-label ${images.length > 0 ? 'has-preview' : ''}`}>
          {uploading ? (
            <span className="uploading-spinner">Uploading...</span>
          ) : (
            <>
              <Plus size={24} />
              <span>{images.length > 0 ? 'Change' : 'Select Image'}</span>
            </>
          )}
          <input type="file" accept="image/*" multiple={multiple} onChange={onUpload} hidden disabled={uploading} />
        </label>
      </div>
    </div>
  );
}

type Tab = 'dashboard' | 'products' | 'categories' | 'orders' | 'contacts' | 'settings';

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  // Notification
  const [newOrderCount, setNewOrderCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [itemsRes, catsRes, ordersRes, contactsRes, settingsRes] = await Promise.all([
        getItems().catch(() => []),
        getCategories().catch(() => []),
        getOrders().catch(() => []),
        getContacts().catch(() => []),
        getSettings().catch(() => null)
      ]);
      setProducts(itemsRes);
      setCategories(catsRes);
      setOrders(ordersRes);
      setContacts(contactsRes);
      setSettings(settingsRes);
      setNewOrderCount(ordersRes.filter((o: Order) => o.status === 'New Order').length);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Poll for new orders
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const ordersRes = await getOrders();
        const newCount = ordersRes.filter((o: Order) => o.status === 'New Order').length;
        if (newCount > newOrderCount && newOrderCount > 0) {
          toast.success('New Order Received!', { duration: 5000 });
          const latestOrder = ordersRes.find((o: Order) => o.status === 'New Order');
          if (latestOrder) {
        toast(`Customer: ${latestOrder.customer.name}\nTotal: Rs. ${latestOrder.total}`, { duration: 5000 });
          }
        }
        setOrders(ordersRes);
        setNewOrderCount(newCount);
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, [newOrderCount]);

  const handleLogout = () => {
    localStorage.removeItem('qasak_admin_token');
    onLogout();
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BarChart size={18} /> },
    { key: 'products', label: 'Products', icon: <ShoppingBag size={18} /> },
    { key: 'categories', label: 'Categories', icon: <Grid size={18} /> },
    { key: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { key: 'contacts', label: 'Messages', icon: <MessageCircle size={18} /> },
    { key: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">QASAK</h2>
          <p className="sidebar-sub">Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-link ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
            >
              <span className="sidebar-icon">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.key === 'orders' && newOrderCount > 0 && (
                <span className="sidebar-badge">{newOrderCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={() => navigate('/')}>
            <span className="sidebar-icon"><Home size={18} /></span><span>View Site</span>
          </button>
          <button className="sidebar-link logout" onClick={handleLogout}>
            <span className="sidebar-icon"><LogOut size={18} /></span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={22} /></button>
          <h2 className="admin-page-title">{tabs.find(t => t.key === activeTab)?.label}</h2>
          <div className="topbar-actions">
            <button className="notification-btn" onClick={() => setActiveTab('orders')} aria-label="Notifications">
              <Bell size={20} />
              {newOrderCount > 0 && <span className="notif-badge">{newOrderCount}</span>}
            </button>
          </div>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardTab products={products} orders={orders} contacts={contacts} categories={categories} />}
              {activeTab === 'products' && <ProductsTab products={products} categories={categories} onRefresh={fetchData} />}
              {activeTab === 'categories' && <CategoriesTab categories={categories} onRefresh={fetchData} />}
              {activeTab === 'orders' && <OrdersTab orders={orders} onRefresh={fetchData} />}
              {activeTab === 'contacts' && <ContactsTab contacts={contacts} onRefresh={fetchData} />}
              {activeTab === 'settings' && <SettingsTab settings={settings} onRefresh={fetchData} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============ DASHBOARD TAB ============ */
function DashboardTab({ products, orders, contacts, categories }: { products: Product[]; orders: Order[]; contacts: ContactMessage[]; categories: Category[] }) {
  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + Number(o.total || 0), 0);
  return (
    <div className="dashboard-tab">
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-card-icon"><ShoppingBag size={28} color="var(--neon-purple)" /></div>
          <div className="stat-card-info">
            <span className="stat-card-number">{products.length}</span>
            <span className="stat-card-label">Total Products</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card-icon"><Package size={28} color="var(--neon-blue)" /></div>
          <div className="stat-card-info">
            <span className="stat-card-number">{orders.length}</span>
            <span className="stat-card-label">Total Orders</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card-icon"><Users size={28} color="var(--neon-pink)" /></div>
          <div className="stat-card-info">
            <span className="stat-card-number">{new Set(orders.map(o => o.customer?.email || o.customer?.mobile)).size}</span>
            <span className="stat-card-label">Customers</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-card-icon"><MessageCircle size={28} color="var(--neon-gold)" /></div>
          <div className="stat-card-info">
            <span className="stat-card-number">{contacts.length}</span>
            <span className="stat-card-label">Messages</span>
          </div>
        </div>
      </div>
      <div className="dashboard-grid">
        <div className="glass-card dashboard-section">
          <h3>Recent Orders</h3>
          <div className="recent-list">
            {orders.slice(-5).reverse().map(o => (
              <div key={o.id} className="recent-item">
                <div>
                  <p className="recent-name">{o.customer?.name}</p>
                  <p className="recent-meta">{new Date(o.createdAt).toLocaleDateString()} · Rs. {o.total}</p>
                </div>
                <span className={`status-badge status-${o.status.toLowerCase().replace(/\s/g, '-')}`}>{o.status}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="empty-text">No orders yet</p>}
          </div>
        </div>
        <div className="glass-card dashboard-section">
          <h3>Revenue Summary</h3>
          <div className="revenue-display">
            <span className="revenue-amount">Rs. {totalRevenue.toLocaleString()}</span>
            <span className="revenue-label">Total Revenue (Delivered)</span>
          </div>
          <div className="order-status-breakdown">
            {['New Order', 'Pending', 'Packed', 'Sent', 'Delivered'].map(status => (
              <div key={status} className="breakdown-item">
                <span>{status}</span>
                <span className="breakdown-count">{orders.filter(o => o.status === status).length}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ PRODUCTS TAB ============ */
function ProductsTab({ products, categories, onRefresh }: { products: Product[]; categories: Category[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', mainImage: '', extraImages: '', description: '', price: '', discount: '', category: '', size: '', quantity: '', quantityType: 'piece' });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm({ name: '', mainImage: '', extraImages: '', description: '', price: '', discount: '', category: '', size: '', quantity: '', quantityType: 'piece' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name, mainImage: p.mainImage, extraImages: (p.extraImages || []).join(','),
      description: p.description, price: p.price, discount: p.discount || '',
      category: p.category, size: p.size || '', quantity: p.quantity || '', quantityType: p.quantityType || 'piece'
    });
    setEditing(p);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'mainImage' | 'extraImages') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      if (field === 'mainImage') {
        const url = await uploadToImgBB(files[0]);
        setForm({ ...form, mainImage: url });
      } else {
        const urls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const url = await uploadToImgBB(files[i]);
          urls.push(url);
        }
        setForm({ ...form, extraImages: [...form.extraImages.split(',').filter(Boolean), ...urls].join(',') });
      }
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed. Check IMGBB_API_KEY.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) { toast.error('Name, price, and category are required'); return; }
    const item = {
      ...(editing ? { id: editing.id } : { id: `item-${Date.now()}` }),
      name: form.name,
      mainImage: form.mainImage,
      extraImages: form.extraImages.split(',').filter(Boolean),
      description: form.description,
      price: form.price,
      discount: form.discount,
      category: form.category,
      size: form.size,
      quantity: form.quantity,
      quantityType: form.quantityType
    };
    try {
      if (editing) { await updateItem(item); toast.success('Product updated!'); }
      else { await addItem(item); toast.success('Product added!'); }
      resetForm();
      onRefresh();
    } catch { toast.error('Failed to save product'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try { await deleteItem(id); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="products-tab">
      <div className="tab-header">
        <h3>Product Management</h3>
        <button className="btn-neon" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Product</button>
      </div>

      {showForm && (
        <form className="admin-form glass-card" onSubmit={handleSubmit}>
          <h4>{editing ? 'Edit Product' : 'New Product'}</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Price *</label>
              <input className="input-field" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Discount Price</label>
              <input className="input-field" type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} />
            </div>
          </div>
          <div className="form-grid">
            <ImageUpload label="Main Image *" value={form.mainImage} onUpload={e => handleImageUpload(e, 'mainImage')} uploading={uploading} />
            <ImageUpload label="Extra Images" value={form.extraImages} onUpload={e => handleImageUpload(e, 'extraImages')} uploading={uploading} multiple />
          </div>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Description</label>
              <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Size (comma-separated)</label>
              <input className="input-field" value={form.size} onChange={e => setForm({...form, size: e.target.value})} placeholder="S,M,L,XL" />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input className="input-field" type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Quantity Type</label>
              <select className="input-field" value={form.quantityType} onChange={e => setForm({...form, quantityType: e.target.value})}>
                <option value="piece">Piece</option>
                <option value="pair">Pair</option>
                <option value="meter">Meter</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-neon">{editing ? 'Update' : 'Add'} Product</button>
            <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper glass-card">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Discount</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><img src={p.mainImage} alt={p.name} className="table-img" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'; }} /></td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>Rs. {Number(p.price).toLocaleString()}</td>
                <td>{p.discount ? `Rs. ${Number(p.discount).toLocaleString()}` : '-'}</td>
                <td>
                  <button className="table-btn edit" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="table-btn delete" onClick={() => handleDelete(p.id)}><Trash size={16} color="#ff4444" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="empty-text">No products yet</p>}
      </div>
    </div>
  );
}

/* ============ CATEGORIES TAB ============ */
function CategoriesTab({ categories, onRefresh }: { categories: Category[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', image: '' });
  const [uploading, setUploading] = useState(false);

  const resetForm = () => { setForm({ name: '', image: '' }); setEditing(null); setShowForm(false); };

  const handleEdit = (c: Category) => { setForm({ name: c.name, image: c.image }); setEditing(c); setShowForm(true); };

  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(files[0]);
      setForm({ ...form, image: url });
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    const cat = { ...(editing ? { id: editing.id } : { id: `cat-${Date.now()}` }), ...form };
    try {
      if (editing) { await updateCategory(cat); toast.success('Category updated!'); }
      else { await addCategory(cat); toast.success('Category added!'); }
      resetForm();
      onRefresh();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try { await deleteCategory(id); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="categories-tab">
      <div className="tab-header">
        <h3>Category Management</h3>
        <button className="btn-neon" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Category</button>
      </div>

      {showForm && (
        <form className="admin-form glass-card" onSubmit={handleSubmit}>
          <h4>{editing ? 'Edit Category' : 'New Category'}</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Category Name *</label>
              <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          </div>
          <ImageUpload label="Category Image" value={form.image} onUpload={handleCatImageUpload} uploading={uploading} />
          <div className="form-actions">
            <button type="submit" className="btn-neon">{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="btn-outline" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="categories-list">
        {categories.map(c => (
          <div key={c.id} className="category-admin-card glass-card">
            <img src={c.image} alt={c.name} className="category-admin-img" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'; }} />
            <div className="category-admin-info">
              <h4>{c.name}</h4>
              <p className="category-admin-id">{c.id}</p>
            </div>
            <div className="category-admin-actions">
              <button className="table-btn edit" onClick={() => handleEdit(c)}>Edit</button>
              <button className="table-btn delete" onClick={() => handleDelete(c.id)}><Trash size={16} color="#ff4444" /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="empty-text">No categories yet</p>}
      </div>
    </div>
  );
}

/* ============ ORDERS TAB ============ */
function OrdersTab({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  const [filter, setFilter] = useState('all');

  const statusFlow: Record<string, string> = {
    'New Order': 'Pending',
    'Pending': 'Packed',
    'Packed': 'Sent',
    'Sent': 'Delivered',
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleStatusChange = async (order: Order) => {
    const next = statusFlow[order.status];
    if (!next) return;
    try {
      await updateOrder({ id: order.id, status: next });
      toast.success(`Order marked as ${next}`);
      onRefresh();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    try { await deleteOrder(id); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Delete failed'); }
  };

  const statuses = ['all', 'New Order', 'Pending', 'Packed', 'Sent', 'Delivered'];

  return (
    <div className="orders-tab">
      <div className="tab-header">
        <h3>Order Management</h3>
        <div className="order-filters">
          {statuses.map(s => (
            <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
              {s === 'all' ? 'All' : s}
              {s !== 'all' && <span className="filter-count">({orders.filter(o => o.status === s).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-list">
        {filtered.map(order => (
          <div key={order.id} className="order-card glass-card">
            <div className="order-card-header">
              <div>
                <p className="order-id">{order.id}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`status-badge status-${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span>
            </div>
            <div className="order-card-body">
              <div className="order-customer">
                <p><strong>{order.customer.name}</strong></p>
                <p>{order.customer.mobile}</p>
                {order.customer.email && <p>{order.customer.email}</p>}
                <p className="order-address">{order.customer.address}, {order.customer.city}{order.customer.district ? `, ${order.customer.district}` : ''}</p>
              </div>
              <div className="order-items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src={item.image} alt={item.name} className="order-item-img" />
                    <span>{item.name} × {item.quantity}</span>
                    <span>Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total:</span>
                <span>Rs. {Number(order.total).toLocaleString()}</span>
              </div>
            </div>
            <div className="order-card-actions">
              {statusFlow[order.status] && (
                <button className="btn-neon small" onClick={() => handleStatusChange(order)}>
                  Mark {statusFlow[order.status]}
                </button>
              )}
              <button className="table-btn delete" onClick={() => handleDelete(order.id)}><Trash size={16} color="#ff4444" /></button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty-text">No orders found</p>}
      </div>
    </div>
  );
}

/* ============ CONTACTS TAB ============ */
function ContactsTab({ contacts, onRefresh }: { contacts: ContactMessage[]; onRefresh: () => void }) {
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try { await deleteContact(id); toast.success('Deleted'); onRefresh(); }
    catch { toast.error('Delete failed'); }
  };

  return (
    <div className="contacts-tab">
      <div className="tab-header">
        <h3>Messages ({contacts.length})</h3>
      </div>
      <div className="contacts-list">
        {contacts.map(msg => (
          <div key={msg.id} className="contact-card glass-card">
            <div className="contact-card-header">
              <div>
                <p className="contact-card-name">{msg.name}</p>
                <p className="contact-card-meta">{msg.method} · {msg.contact}</p>
              </div>
              <button className="table-btn delete" onClick={() => handleDelete(msg.id)}><Trash size={16} color="#ff4444" /></button>
            </div>
            <p className="contact-card-subject">{msg.subject}</p>
            <p className="contact-card-message">{msg.message}</p>
            <p className="contact-card-date">{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
        {contacts.length === 0 && <p className="empty-text">No messages yet</p>}
      </div>
    </div>
  );
}

/* ============ SETTINGS TAB ============ */
function SettingsTab({ settings, onRefresh }: { settings: Settings | null; onRefresh: () => void }) {
  const [form, setForm] = useState<Settings>(settings || {
    title: '', siteName: '', logo: '', heroImage: '', headerText: '', footerText: '', mobile: '', email: '', address: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => { if (settings) setForm(settings); }, [settings]);

  const handleSettingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'heroImage') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const url = await uploadToImgBB(files[0]);
      setForm({ ...form, [field]: url });
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(form);
      toast.success('Settings saved!');
      onRefresh();
    } catch { toast.error('Failed to save settings'); }
  };

  return (
    <div className="settings-tab">
      <div className="tab-header"><h3>Website Settings</h3></div>
      <form className="admin-form glass-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Site Title</label>
            <input className="input-field" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Site Name</label>
            <input className="input-field" value={form.siteName} onChange={e => setForm({...form, siteName: e.target.value})} />
          </div>
        </div>
        <div className="form-grid">
          <ImageUpload label="Logo" value={form.logo || ''} onUpload={e => handleSettingImageUpload(e, 'logo')} uploading={uploading} />
          <ImageUpload label="Hero Image" value={form.heroImage || ''} onUpload={e => handleSettingImageUpload(e, 'heroImage')} uploading={uploading} />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Header Text</label>
            <input className="input-field" value={form.headerText} onChange={e => setForm({...form, headerText: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Footer Text</label>
            <input className="input-field" value={form.footerText} onChange={e => setForm({...form, footerText: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Mobile</label>
            <input className="input-field" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-group full-width">
            <label>Address</label>
            <input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-neon">Save Settings</button>
        </div>
      </form>
    </div>
  );
}
