import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchAllUsers() {
  const usersRef = collection(db, "users");
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateUserRole(uid: string, newRole: string) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { role: newRole });
}
