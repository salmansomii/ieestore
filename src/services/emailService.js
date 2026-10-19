import { storeConfig } from '../config/store.config';

/**
 * Sends order confirmation email directly to the customer without requiring any customer signup.
 * Works using standard EmailJS REST API.
 */
export const sendOrderConfirmationEmail = async (order) => {
  const { emailConfig } = storeConfig;

  // Verify that an email was provided
  if (!order.contact?.email || order.contact.email === 'N/A' || !order.contact.email.includes('@')) {
    return { success: false, reason: 'No customer email provided' };
  }

  // If EmailJS credentials are not yet configured in store.config.js
  if (!emailConfig?.serviceId || emailConfig.serviceId.includes('YOUR_')) {
    console.warn('EmailJS credentials not configured yet in store.config.js. Email skipped.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const itemsList = (order.items || [])
    .map((item, idx) => `${idx + 1}. ${item.product?.name || 'Item'} (Qty: ${item.quantity}) - Rs. ${(item.product?.price || 0) * item.quantity}`)
    .join('\n');

  const templateParams = {
    to_email: order.contact.email,
    to_name: order.shipping?.fullName || 'Valued Customer',
    order_id: order.orderNumber,
    order_date: new Date(order.date).toLocaleDateString('en-US', { dateStyle: 'medium' }),
    order_total: `Rs. ${(order.summary?.total || 0).toLocaleString()}`,
    order_items: itemsList,
    customer_phone: order.contact?.phone || 'N/A',
    delivery_address: `${order.shipping?.address || ''}, ${order.shipping?.city || ''}, ${order.shipping?.province || ''}`,
    payment_method: 'Cash on Delivery (COD)',
    store_name: storeConfig.storeName,
    store_phone: storeConfig.contact.phone,
    store_email: storeConfig.contact.email,
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: emailConfig.serviceId,
        template_id: emailConfig.templateId,
        user_id: emailConfig.publicKey,
        template_params: templateParams,
      }),
    });

    if (response.ok) {
      console.log('Order confirmation email sent successfully to:', order.contact.email);
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('EmailJS error:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('Failed to send order email:', error);
    return { success: false, error };
  }
};
