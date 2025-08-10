import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, AddOn, Order, Receipt, OrderItem, Stats } from '@/types/restaurant';

interface RestaurantContextType {
  // Products & Add-ons
  products: Product[];
  addOns: AddOn[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
  addAddOn: (addOn: AddOn) => void;
  removeAddOn: (id: string) => void;
  updateAddOn: (addOn: AddOn) => void;

  // Current Order
  currentOrder: OrderItem[];
  addToOrder: (item: OrderItem) => void;
  updateOrderItem: (index: number, item: OrderItem) => void;
  removeFromOrder: (index: number) => void;
  clearOrder: () => void;
  getOrderTotal: () => number;

  // Orders Management
  orders: Order[];
  placeOrder: (paymentMethod: 'cash' | 'online') => string;
  acceptOrder: (id: string) => void;
  completeOrder: (id: string) => void;

  // Receipts
  receipts: Receipt[];
  generateReceipt: (orderId: string) => Receipt;

  // Stats
  getStats: () => Stats;

  // Hotel Info
  hotelName: string;
  setHotelName: (name: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const defaultProducts: Product[] = [
  { id: '1', name: 'Chicken Biryani', price: 250, category: 'Main Course', description: 'Aromatic basmati rice with tender chicken' },
  { id: '2', name: 'Mutton Curry', price: 300, category: 'Main Course', description: 'Spicy mutton curry with traditional spices' },
  { id: '3', name: 'Vegetable Pulao', price: 180, category: 'Main Course', description: 'Fragrant rice with mixed vegetables' },
  { id: '4', name: 'Dal Tadka', price: 120, category: 'Dal', description: 'Yellow lentils tempered with spices' },
  { id: '5', name: 'Paneer Butter Masala', price: 220, category: 'Vegetarian', description: 'Creamy paneer in rich tomato gravy' },
  { id: '6', name: 'Chicken Tikka', price: 280, category: 'Starter', description: 'Grilled chicken marinated in yogurt and spices' },
];

const defaultAddOns: AddOn[] = [
  { id: '1', name: 'Roti', price: 15 },
  { id: '2', name: 'Naan', price: 25 },
  { id: '3', name: 'Rice', price: 40 },
  { id: '4', name: 'Raita', price: 30 },
  { id: '5', name: 'Pickle', price: 10 },
  { id: '6', name: 'Papad', price: 15 },
];

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [addOns, setAddOns] = useState<AddOn[]>(defaultAddOns);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [hotelName, setHotelName] = useState('Delicious Bites Restaurant');

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const addAddOn = (addOn: AddOn) => {
    setAddOns(prev => [...prev, addOn]);
  };

  const removeAddOn = (id: string) => {
    setAddOns(prev => prev.filter(a => a.id !== id));
  };

  const updateAddOn = (addOn: AddOn) => {
    setAddOns(prev => prev.map(a => a.id === addOn.id ? addOn : a));
  };

  const addToOrder = (item: OrderItem) => {
    setCurrentOrder(prev => [...prev, item]);
  };

  const updateOrderItem = (index: number, item: OrderItem) => {
    setCurrentOrder(prev => prev.map((orderItem, i) => i === index ? item : orderItem));
  };

  const removeFromOrder = (index: number) => {
    setCurrentOrder(prev => prev.filter((_, i) => i !== index));
  };

  const clearOrder = () => {
    setCurrentOrder([]);
  };

  const getOrderTotal = () => {
    return currentOrder.reduce((total, item) => {
      const itemTotal = item.product.price * item.quantity;
      const addOnTotal = item.addOns.reduce((addOnSum, addOnItem) => 
        addOnSum + (addOnItem.addOn.price * addOnItem.quantity), 0);
      return total + itemTotal + addOnTotal;
    }, 0);
  };

  const placeOrder = (paymentMethod: 'cash' | 'online'): string => {
    const orderId = `order_${Date.now()}`;
    const order: Order = {
      id: orderId,
      items: [...currentOrder],
      total: getOrderTotal(),
      status: 'pending',
      paymentMethod,
      timestamp: new Date(),
    };
    
    setOrders(prev => [...prev, order]);
    clearOrder();
    return orderId;
  };

  const acceptOrder = (id: string) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: 'accepted' } : order
    ));
  };

  const completeOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const generateReceipt = (orderId: string): Receipt => {
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    
    const receipt: Receipt = {
      id: `receipt_${Date.now()}`,
      order,
      hotelName,
      generatedAt: new Date(),
    };
    
    setReceipts(prev => [...prev, receipt]);
    return receipt;
  };

  const getStats = (): Stats => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const completedReceipts = receipts.filter(r => r.order.status !== 'pending');

    const dailyEarnings = completedReceipts
      .filter(r => r.generatedAt >= startOfDay)
      .reduce((sum, r) => sum + r.order.total, 0);

    const monthlyEarnings = completedReceipts
      .filter(r => r.generatedAt >= startOfMonth)
      .reduce((sum, r) => sum + r.order.total, 0);

    const yearlyEarnings = completedReceipts
      .filter(r => r.generatedAt >= startOfYear)
      .reduce((sum, r) => sum + r.order.total, 0);

    const totalOrdersToday = receipts.filter(r => r.generatedAt >= startOfDay).length;

    // Calculate top products
    const productSales: { [key: string]: number } = {};
    completedReceipts.forEach(receipt => {
      receipt.order.items.forEach(item => {
        productSales[item.product.id] = (productSales[item.product.id] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([productId, sales]) => ({
        product: products.find(p => p.id === productId)!,
        sales
      }))
      .filter(item => item.product)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Calculate top add-ons
    const addOnSales: { [key: string]: number } = {};
    completedReceipts.forEach(receipt => {
      receipt.order.items.forEach(item => {
        item.addOns.forEach(addOnItem => {
          addOnSales[addOnItem.addOn.id] = (addOnSales[addOnItem.addOn.id] || 0) + addOnItem.quantity;
        });
      });
    });

    const topAddOns = Object.entries(addOnSales)
      .map(([addOnId, sales]) => ({
        addOn: addOns.find(a => a.id === addOnId)!,
        sales
      }))
      .filter(item => item.addOn)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      dailyEarnings,
      monthlyEarnings,
      yearlyEarnings,
      totalOrdersToday,
      topProducts,
      topAddOns,
    };
  };

  const value = {
    products,
    addOns,
    addProduct,
    removeProduct,
    updateProduct,
    addAddOn,
    removeAddOn,
    updateAddOn,
    currentOrder,
    addToOrder,
    updateOrderItem,
    removeFromOrder,
    clearOrder,
    getOrderTotal,
    orders,
    placeOrder,
    acceptOrder,
    completeOrder,
    receipts,
    generateReceipt,
    getStats,
    hotelName,
    setHotelName,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};