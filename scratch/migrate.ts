import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBp0Dpzis1yXPZUVOaPVG7T0fSBTxSjWP8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "moodlift-clothing.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "moodlift-clothing",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "moodlift-clothing.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "406767402974",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:406767402974:web:8e905ee2a9c5dd3b73274f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Starting SKU migration...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(`Found ${products.length} products in DB`);
  
  let updatedCount = 0;
  
  for (const product of products) {
    console.log(`Product: ${product.title}, SKU: "${product.sku}"`);
    if (!product.sku || (typeof product.sku === 'string' && product.sku.trim() === '')) {
      const title = product.title || "";
      const words = title.trim().split(/\s+/);
      let prefix = "";
      if (words.length >= 2) {
        prefix = `${words[0].substring(0, 3).toUpperCase()}-${words[1].substring(0, 3).toUpperCase()}`;
      } else if (words.length === 1 && words[0].length > 0) {
        prefix = words[0].substring(0, 3).toUpperCase();
      } else {
        prefix = "PRD";
      }
      const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
      const newSku = `${prefix}-${randomNum}`;
      
      console.log(`Updating product ${product.id} ("${product.title}") with SKU: ${newSku}`);
      
      await updateDoc(doc(db, 'products', product.id), { sku: newSku });
      updatedCount++;
    }
  }
  
  console.log(`Migration complete. Updated ${updatedCount} products.`);
  process.exit(0);
}

run();
