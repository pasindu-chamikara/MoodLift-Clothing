import { db } from "@/lib/firebase/config";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

export const dbService = {
  // Generic CRUD operations
  async getDocument(collectionName: string, id: string) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  async getCollection(collectionName: string) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async setDocument(collectionName: string, id: string, data: any) {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
  },

  async updateDocument(collectionName: string, id: string, data: any) {
    await updateDoc(doc(db, collectionName, id), data);
  },

  async deleteDocument(collectionName: string, id: string) {
    await deleteDoc(doc(db, collectionName, id));
  },
  
  async addDocument(collectionName: string, data: any) {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, data);
    return docRef.id;
  }
};

import { Product, Order, StoreSettings } from "@/types";

export const productService = {
  async getProducts(): Promise<Product[]> {
    return (await dbService.getCollection('products')) as Product[];
  },
  async getProduct(id: string): Promise<Product | null> {
    return (await dbService.getDocument('products', id)) as Product | null;
  },
  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const data = { ...product, createdAt: new Date().toISOString() };
    return await dbService.addDocument('products', data);
  },
  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const data = { ...product, updatedAt: new Date().toISOString() };
    await dbService.updateDocument('products', id, data);
  },
  async deleteProduct(id: string): Promise<void> {
    await dbService.deleteDocument('products', id);
  }
};

export const orderService = {
  async getOrders(): Promise<Order[]> {
    return (await dbService.getCollection('orders')) as Order[];
  },
  async getOrder(id: string): Promise<Order | null> {
    return (await dbService.getDocument('orders', id)) as Order | null;
  },
  async addOrder(order: Omit<Order, 'id'>): Promise<string> {
    const data = { ...order, createdAt: new Date().toISOString() };
    return await dbService.addDocument('orders', data);
  },
  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const data = { status, updatedAt: new Date().toISOString() };
    await dbService.updateDocument('orders', id, data);
  },
  async deleteOrder(id: string): Promise<void> {
    await dbService.deleteDocument('orders', id);
  }
};

const SETTINGS_DOC_ID = 'global_settings';

export const settingsService = {
  async getSettings(): Promise<StoreSettings | null> {
    return (await dbService.getDocument('settings', SETTINGS_DOC_ID)) as StoreSettings | null;
  },
  async saveSettings(settings: StoreSettings): Promise<void> {
    await dbService.setDocument('settings', SETTINGS_DOC_ID, settings);
  }
};

export const userService = {
  async getUser(email: string) {
    const users = await dbService.getCollection('users');
    return users.find((u: any) => u.email === email) || null;
  },
  async saveUser(email: string, data: any) {
    // We use email as the document ID for simplicity in this mock
    await dbService.setDocument('users', email, data);
  }
};

export interface Review {
  orderId: string;
  customerEmail: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export const reviewService = {
  async addReview(review: Review) {
    const data = { ...review, createdAt: new Date().toISOString() };
    return await dbService.addDocument('reviews', data);
  },
  async getReviews(): Promise<Review[]> {
    return (await dbService.getCollection('reviews')) as unknown as Review[];
  }
};

export interface ContactMessage {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  status?: 'unread' | 'read' | 'replied';
}

export const messageService = {
  async addMessage(msg: ContactMessage) {
    const data = { ...msg, createdAt: new Date().toISOString(), status: 'unread' };
    return await dbService.addDocument('messages', data);
  },
  async getMessages(): Promise<ContactMessage[]> {
    return (await dbService.getCollection('messages')) as ContactMessage[];
  },
  async updateMessageStatus(id: string, status: ContactMessage['status']) {
    await dbService.updateDocument('messages', id, { status });
  },
  async deleteMessage(id: string) {
    await dbService.deleteDocument('messages', id);
  }
};

export const adminService = {
  async getAdmins() {
    return await dbService.getCollection('admins');
  },
  async verifyAdmin(username: string, password: string): Promise<boolean> {
    try {
      let admins = await this.getAdmins();
      
      // Auto-seed a default admin if the collection is empty for demo purposes
      if (admins.length === 0) {
        await dbService.setDocument('admins', 'default_admin', {
          username: 'admin',
          password: 'admin123'
        });
        admins = await this.getAdmins();
      }

      const admin = admins.find((a: any) => a.username === username && a.password === password);
      return !!admin;
    } catch (error) {
      console.error("Error verifying admin in Firestore", error);
      return false;
    }
  }
};
