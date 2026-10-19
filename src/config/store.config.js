export const storeConfig = {
  storeName: "Taicon Store",
  logoText: "Taicon",
  domain: "taicon.store",
  contact: {
    email: "salmantariq11786@gmail.com",
    phone: "+92 327 4000155",
    address: "G-3 Ohad Center, G Floor, Opp: State Bank, Near HBL Bank, Mall Road, Lahore"
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    whatsapp: "https://wa.me/923274000155",
  },
  settings: {
    currency: "PKR",
    currencySymbol: "Rs. ",
    shippingThreshold: 5000, // Free shipping over this amount
    flatShippingRate: 250,
    taxRate: 0,
  },
  customCheckoutUrl: "", 
  
  // Free EmailJS credentials for automatic order confirmation emails to customer
  emailConfig: {
    serviceId: "service_taicon",
    templateId: "template_taicon",
    publicKey: "user_taicon_key"
  }
};
