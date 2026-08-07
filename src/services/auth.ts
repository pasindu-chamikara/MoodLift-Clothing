import { auth } from "@/lib/firebase/config";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";

export const authService = {
  async register(email: string, pass: string) {
    return createUserWithEmailAndPassword(auth, email, pass);
  },
  
  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(auth, email, pass);
  },
  
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  },
  
  async logout() {
    return signOut(auth);
  }
};
