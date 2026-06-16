export interface Product {
  id: string;
  name: string;
  mainImage: string;
  extraImages: string[];
  description: string;
  price: string;
  discount: string;
  category: string;
  size: string;
  quantity: string;
  quantityType: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: string;
  size: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    district: string;
  };
  items: CartItem[];
  total: string;
  status: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  method: string;
  contact: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Settings {
  title: string;
  siteName: string;
  logo: string;
  heroImage: string;
  headerText: string;
  footerText: string;
  mobile: string;
  email: string;
  address: string;
}
