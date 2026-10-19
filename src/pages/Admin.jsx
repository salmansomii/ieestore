import React, { useState, useEffect } from 'react';
import { storeConfig } from '../config/store.config';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  Package, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle, 
  Trash2, 
  LogOut, 
  Lock, 
  Search, 
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Login states for /order
  const [loginEmail, setLoginEmail] = useState('salmantariq11786@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const { currencySymbol } = storeConfig.settings;
  const { currentUser, isAdmin } = useAuth();

  // Fetch orders from Firestore
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const fbOrders = [];
      querySnapshot.forEach((d) => {
        fbOrders.push({ id: d.id, ...d.data() });
      });
      setOrders(fbOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin || currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAdmin, currentUser]);

  // Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      // Auth state change will update currentUser and trigger fetchOrders
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError('Invalid email or password. Please verify your credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOrders([]);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Update order status in Firestore
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete an order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      setUpdatingId(orderId);
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Failed to delete order.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders by search and status
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || (order.status || 'pending').toLowerCase() === statusFilter.toLowerCase();
    const query = searchTerm.toLowerCase();
    const customerName = (order.shipping?.fullName || `${order.shipping?.firstName || ''} ${order.shipping?.lastName || ''}`).toLowerCase();
    const phone = (order.contact?.phone || '').toLowerCase();
    const orderNo = (order.orderNumber || order.id || '').toLowerCase();
    const city = (order.shipping?.city || '').toLowerCase();

    const matchesSearch = !searchTerm || 
      customerName.includes(query) || 
      phone.includes(query) || 
      orderNo.includes(query) ||
      city.includes(query);

    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.summary?.total || 0), 0);
  const pendingCount = orders.filter(o => !o.status || o.status.toLowerCase() === 'pending').length;
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  // If not logged in as Admin, show clean Login Form
  if (!currentUser) {
    return (
      <div className="container py-xxl" style={{ maxWidth: '480px', margin: '2rem auto' }}>
        <Helmet>
          <title>Admin Login | Taicon Store</title>
        </Helmet>
        
        <div className="bg-secondary p-xl" style={{ borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(234, 88, 12, 0.1)', color: '#ea580c', marginBottom: '1rem' }}>
              <Lock size={36} />
            </div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted text-sm mt-xs">Log in to manage Taicon Cash on Delivery orders</p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-md">
              <label className="text-sm font-semibold mb-xs block">Admin Email</label>
              <input 
                type="email" 
                required 
                className="input" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="salmantariq11786@gmail.com"
              />
            </div>

            <div className="mb-lg">
              <label className="text-sm font-semibold mb-xs block">Password</label>
              <input 
                type="password" 
                required 
                className="input" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter admin password"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full font-bold text-base py-md"
              disabled={loginLoading}
              style={{ backgroundColor: '#ea580c', borderColor: '#ea580c' }}
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Orders'}
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-lg">
            Authorized administrator access only. All actions are logged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-xl">
      <Helmet>
        <title>Orders Management | Taicon Admin</title>
      </Helmet>

      {/* Top Header */}
      <div className="flex justify-between items-center mb-xl flex-wrap gap-md pb-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-sm">
            <Package size={28} style={{ color: '#ea580c' }} /> Taicon Orders Management
          </h1>
          <p className="text-sm text-muted mt-xs">
            Admin: <strong>{currentUser.email}</strong> • Real-time Cash on Delivery orders
          </p>
        </div>

        <div className="flex items-center gap-sm">
          <button 
            onClick={fetchOrders} 
            className="btn btn-outline text-sm"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Orders'}
          </button>
          <button 
            onClick={handleLogout} 
            className="btn btn-outline text-sm flex items-center gap-xs"
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
        <div className="bg-secondary p-md" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span className="text-xs text-muted font-bold block" style={{ textTransform: 'uppercase' }}>Total Orders</span>
          <span className="text-2xl font-black">{orders.length}</span>
        </div>

        <div className="bg-secondary p-md" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span className="text-xs text-muted font-bold block" style={{ textTransform: 'uppercase' }}>Pending (COD)</span>
          <span className="text-2xl font-black" style={{ color: '#ea580c' }}>{pendingCount}</span>
        </div>

        <div className="bg-secondary p-md" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span className="text-xs text-muted font-bold block" style={{ textTransform: 'uppercase' }}>Confirmed</span>
          <span className="text-2xl font-black" style={{ color: '#2563eb' }}>{confirmedCount}</span>
        </div>

        <div className="bg-secondary p-md" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span className="text-xs text-muted font-bold block" style={{ textTransform: 'uppercase' }}>Total Revenue</span>
          <span className="text-2xl font-black" style={{ color: '#16a34a' }}>{currencySymbol}{totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex justify-between items-center mb-lg flex-wrap gap-md bg-secondary p-md" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <input 
            type="text" 
            placeholder="Search by customer name, phone, city, or order #..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input text-sm"
            style={{ paddingLeft: '2.5rem' }}
          />
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        </div>

        <div className="flex items-center gap-xs flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="text-xs font-bold"
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                backgroundColor: statusFilter === status ? '#ea580c' : 'var(--bg-primary)',
                color: statusFilter === status ? 'white' : 'var(--text-primary)',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-xxl bg-secondary" style={{ borderRadius: '12px' }}>
          <p className="text-muted">Loading orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-secondary p-xxl text-center" style={{ borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Package size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem auto' }} />
          <h3 className="text-xl font-bold mb-xs">No Orders Found</h3>
          <p className="text-muted text-sm">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search query or status filter.' : 'When customers place Cash on Delivery orders, they will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          {filteredOrders.map(order => {
            const customerName = order.shipping?.fullName || `${order.shipping?.firstName || ''} ${order.shipping?.lastName || ''}`.trim() || 'Valued Customer';
            const phone = order.contact?.phone || order.shipping?.phone || 'N/A';
            const orderStatus = (order.status || 'pending').toLowerCase();
            const cleanPhone = phone.replace(/[^0-9]/g, '');

            return (
              <div 
                key={order.id} 
                className="bg-secondary p-lg" 
                style={{ 
                  borderRadius: '14px', 
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Order Top Bar */}
                <div className="flex justify-between items-center mb-md pb-md flex-wrap gap-sm" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <span className="font-mono font-bold text-lg" style={{ color: '#ea580c' }}>
                      {order.orderNumber ? `#${order.orderNumber}` : `#${order.id.slice(-8).toUpperCase()}`}
                    </span>
                    <span className="text-xs text-muted block mt-xs flex items-center gap-xs">
                      <Clock size={14} /> {order.date ? new Date(order.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                    </span>
                  </div>

                  <div className="flex items-center gap-sm flex-wrap">
                    {/* Status Select */}
                    <div className="flex items-center gap-xs">
                      <span className="text-xs font-semibold text-muted">Status:</span>
                      <select 
                        value={orderStatus} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="input text-xs font-bold"
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: 
                            orderStatus === 'delivered' ? 'rgba(34, 197, 94, 0.15)' :
                            orderStatus === 'confirmed' ? 'rgba(37, 99, 235, 0.15)' :
                            orderStatus === 'shipped' ? 'rgba(168, 85, 247, 0.15)' :
                            orderStatus === 'cancelled' ? 'rgba(239, 68, 68, 0.15)' :
                            'rgba(234, 88, 12, 0.15)',
                          color: 
                            orderStatus === 'delivered' ? '#16a34a' :
                            orderStatus === 'confirmed' ? '#2563eb' :
                            orderStatus === 'shipped' ? '#a855f7' :
                            orderStatus === 'cancelled' ? '#ef4444' :
                            '#ea580c',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="pending">⏳ Pending (COD)</option>
                        <option value="confirmed">✓ Confirmed</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">🎉 Delivered</option>
                        <option value="cancelled">✕ Cancelled</option>
                      </select>
                    </div>

                    {/* Delete Order Button */}
                    <button 
                      onClick={() => handleDeleteOrder(order.id)} 
                      disabled={updatingId === order.id}
                      className="btn btn-outline"
                      title="Delete Order"
                      style={{ padding: '6px 8px', color: '#ef4444', borderColor: 'transparent' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-md">
                  {/* Customer Contact */}
                  <div>
                    <h3 className="font-bold text-sm mb-xs text-muted" style={{ textTransform: 'uppercase' }}>Customer</h3>
                    <p className="font-bold text-base mb-xs">{customerName}</p>
                    <p className="text-sm flex items-center gap-xs mb-xs">
                      <Phone size={14} style={{ color: '#ea580c' }} /> 
                      <strong>{phone}</strong>
                    </p>
                    {order.contact?.email && order.contact?.email !== 'N/A' && (
                      <p className="text-xs text-muted mb-sm">{order.contact?.email}</p>
                    )}
                    
                    {/* Quick Call & WhatsApp Action Buttons */}
                    <div className="flex gap-xs mt-sm">
                      <a 
                        href={`tel:${phone}`}
                        className="btn btn-outline text-xs"
                        style={{ padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Phone size={12} /> Call
                      </a>
                      <a 
                        href={`https://wa.me/${cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn text-xs"
                        style={{ padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#25D366', color: 'white', textDecoration: 'none' }}
                      >
                        <MessageSquare size={12} /> WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-bold text-sm mb-xs text-muted" style={{ textTransform: 'uppercase' }}>Delivery Address</h3>
                    <p className="text-sm mb-xs flex items-start gap-xs">
                      <MapPin size={16} style={{ color: '#ea580c', flexShrink: 0, marginTop: '2px' }} />
                      <span>{order.shipping?.address || 'Address not provided'}</span>
                    </p>
                    <p className="text-sm font-semibold ml-lg">
                      {order.shipping?.city || 'City N/A'}, {order.shipping?.province || ''}
                    </p>
                    {order.shipping?.notes && (
                      <p className="text-xs text-muted mt-xs ml-lg italic">
                        Note: "{order.shipping?.notes}"
                      </p>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h3 className="font-bold text-sm mb-xs text-muted" style={{ textTransform: 'uppercase' }}>Payment Mode</h3>
                    <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                      <p className="font-bold text-sm" style={{ color: '#16a34a', margin: 0 }}>
                        ✓ Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-muted mt-xs" style={{ margin: '4px 0 0 0' }}>
                        Collect cash upon delivery
                      </p>
                    </div>

                    <div className="mt-sm">
                      <span className="text-xs text-muted block">Total Collectable:</span>
                      <span className="font-black text-xl" style={{ color: '#ea580c' }}>
                        {currencySymbol}{(order.summary?.total || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ordered Items */}
                <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <h4 className="font-bold text-xs text-muted mb-sm" style={{ textTransform: 'uppercase' }}>
                    Items Ordered ({order.items?.length || 0})
                  </h4>
                  <div className="flex flex-col gap-xs">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm py-xs" style={{ borderBottom: idx !== order.items.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <div className="flex items-center gap-sm">
                          {item.product?.image && (
                            <img 
                              src={item.product.image} 
                              alt="" 
                              style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} 
                            />
                          )}
                          <span className="font-medium">
                            <strong style={{ color: '#ea580c' }}>{item.quantity}x</strong> {item.product?.name || 'Product'}
                          </span>
                        </div>
                        <span className="font-semibold">
                          {currencySymbol}{((item.product?.price || 0) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
      `}} />
    </div>
  );
};

export default Admin;
