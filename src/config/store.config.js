export const storeConfig = {
  storeName: "TrendKids USA",
  logoText: "TrendKids",
  contact: {
    email: "support@trendkidsusa.com",
    phone: "1-800-555-0199",
  },
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
  settings: {
    currency: "USD",
    currencySymbol: "$",
    shippingThreshold: 50.00, // Free shipping over this amount
    flatShippingRate: 5.99,
    taxRate: 0.08, // 8% average sales tax demo
  },
  // If left empty, default checkout is used. If URL provided, it redirects with cart data.
  customCheckoutUrl: "", 
};
