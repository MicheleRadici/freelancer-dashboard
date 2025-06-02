import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const getFreelancerProjects = async (uid: string) => {
  const q = query(collection(db, "projects"), where("freelancerId", "==", uid));
  const querySnapshot = await getDocs(q);

  const projects = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return projects;
};

export const getClientProjects = async (uid: string) => {
  const q = query(collection(db, "projects"), where("clientId", "==", uid));
  const querySnapshot = await getDocs(q);

  const projects = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return projects;
};
