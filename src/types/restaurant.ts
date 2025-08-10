export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  addOns: { addOn: AddOn; quantity: number }[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'completed';
  paymentMethod?: 'cash' | 'online';
  timestamp: Date;
}

export interface Receipt {
  id: string;
  order: Order;
  hotelName: string;
  generatedAt: Date;
}

export interface Stats {
  dailyEarnings: number;
  monthlyEarnings: number;
  yearlyEarnings: number;
  totalOrdersToday: number;
  topProducts: { product: Product; sales: number }[];
  topAddOns: { addOn: AddOn; sales: number }[];
}