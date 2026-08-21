import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export interface CartItem {
  id: string; // Combine product id and size, e.g. "prod123-XL"
  productId: string;
  title: string;
  price: number;
  size: string;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const cartItemId = `${newItem.productId}-${newItem.size}`;
          const existingItemIndex = state.items.findIndex(item => item.id === cartItemId);
          const qtyToAdd = newItem.quantity || 1;
          
          if (existingItemIndex >= 0) {
            // Item exists, increment quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += qtyToAdd;
            return { items: updatedItems };
          }
          
          // Item doesn't exist, add it
          const { quantity, ...restOfItem } = newItem;
          return {
            items: [...state.items, { ...restOfItem, id: cartItemId, quantity: qtyToAdd }]
          };
        });
        
        toast.success("Item added to cart successfully!");
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter(item => item.id !== id) };
          }
          
          return {
            items: state.items.map(item => 
              item.id === id ? { ...item, quantity } : item
            )
          };
        });
      },
      
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'moodlift-cart',
    }
  )
);
