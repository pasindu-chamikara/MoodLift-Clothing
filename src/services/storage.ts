import { storage } from "@/lib/firebase/config";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export const storageService = {
  async uploadFile(path: string, file: File) {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  },

  async deleteFile(path: string) {
    const storageRef = ref(storage, path);
    return deleteObject(storageRef);
  }
};
