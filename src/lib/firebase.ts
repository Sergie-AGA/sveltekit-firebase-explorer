import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writable } from "svelte/store";

const firebaseConfig = {
  apiKey: "AIzaSyAbACN2O0r5l5wFYN1v-tWjAjXtlhuiCjI",
  authDomain: "fir-explorer-4002d.firebaseapp.com",
  projectId: "fir-explorer-4002d",
  storageBucket: "fir-explorer-4002d.appspot.com",
  messagingSenderId: "639083889594",
  appId: "1:639083889594:web:b3775d15453a53cf9ad383",
  measurementId: "G-WWJ8J70CHP",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

/**
 * @returns a store with the current firebase user
 */
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return {
      subscribe,
    };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
  };
}

export const user = userStore();
