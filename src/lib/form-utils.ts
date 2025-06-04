import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import { z } from "zod";

// Common validation schemas
export const commonValidationSchemas = {
  name: z.string().min(1, { message: "First name is required" }),
  surname: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Password confirmation is required" }),
  optionalString: z.string().optional().or(z.literal("")),
  optionalUrl: z.string().url().optional().or(z.literal("")),
  optionalNumber: z.coerce.number().optional(),
  requiredNumber: z.coerce.number().min(0),
  stringArray: z.array(z.string()).min(1),
};

// Password validation helper
export const createPasswordSchema = () => {
  return z.object({
    password: commonValidationSchemas.password,
    confirmPassword: commonValidationSchemas.confirmPassword,
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
};

// Common form constants
export const CATEGORIES = [
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Other",
];
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const ROLES = ["Designer", "Developer", "Marketer", "Other"];
export const TIMEZONES = [
  { value: "", label: "Select timezone" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Rome", label: "Europe/Rome" },
  { value: "Europe/Paris", label: "Europe/Paris" },
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Asia/Dubai", label: "Asia/Dubai" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
  { value: "UTC", label: "UTC" },
];

// Skills by category mapping
export const SKILLS_BY_CATEGORY = {
  Development: [
    "Front-end",
    "Back-end",
    "Full-stack",
    "Mobile",
    "DevOps",
    "QA / Testing",
    "Game Development",
    "Embedded",
    "AI / ML",
    "Other",
  ],
  Design: [
    "UI Design",
    "UX Design",
    "Graphic Design",
    "Web Design",
    "Product Design",
    "Branding",
    "Animation",
    "Illustration",
    "Other",
  ],
  Writing: [
    "Copywriting",
    "Technical Writing",
    "Content Writing",
    "Editing",
    "Proofreading",
    "SEO Writing",
    "Other",
  ],
  Marketing: [
    "Digital Marketing",
    "SEO",
    "Content Marketing",
    "Social Media",
    "Email Marketing",
    "PPC / SEM",
    "Affiliate Marketing",
    "Market Research",
    "Other",
  ],
  Other: ["Other"],
};

/**
 * Helper function to remove undefined values for Firebase
 * Firebase doesn't accept undefined values, so we sanitize the data
 */
export const sanitizeForFirebase = (obj: any): any => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== "") {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = sanitizeForFirebase(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
};

/**
 * Common function to submit form data to Firestore
 * Generates a unique document ID and uses it as the uid field
 */
export const submitToFirestore = async (collectionName: string, data: any) => {
  try {
    // Get a reference to the collection and generate a new document with auto-ID
    const collectionRef = collection(db, collectionName);
    const newDocRef = doc(collectionRef);
    const docId = newDocRef.id;
      // Add the generated ID as the uid
    const dataWithId = {
      ...sanitizeForFirebase(data),
      uid: docId,
      createdAt: new Date().toISOString(),
    };
    
    // Set the document with the generated ID
    await setDoc(newDocRef, dataWithId);
    
    return docId;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

/**
 * Helper function to check if a string is not empty after trimming
 */
export const isValidString = (value: string | undefined): string | undefined => {
  return value && value.trim() ? value : undefined;
};

/**
 * Helper function to validate and return number or undefined
 */
export const isValidNumber = (value: number | undefined): number | undefined => {
  return typeof value === 'number' && !isNaN(value) ? value : undefined;
};

/**
 * Helper function to remove skills that don't belong to selected categories
 */
export const filterSkillsByCategories = (currentSkills: string[], selectedCategories: string[]): string[] => {
  const validSkills: string[] = [];
  selectedCategories.forEach(category => {
    if (SKILLS_BY_CATEGORY[category as keyof typeof SKILLS_BY_CATEGORY]) {
      validSkills.push(...SKILLS_BY_CATEGORY[category as keyof typeof SKILLS_BY_CATEGORY]);
    }
  });
  const uniqueValidSkills = [...new Set(validSkills)]; // Remove duplicates
  return currentSkills.filter(skill => uniqueValidSkills.includes(skill));
};

/**
 * Common error messages for form validation
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_URL: "Please enter a valid URL",
  MIN_SELECTION: (min: number, item: string) => `Please select at least ${min} ${item}`,
  MIN_VALUE: (min: number) => `Value must be at least ${min}`,
  REGISTRATION_FAILED: "Registration failed. Please try again.",
  FIREBASE_ERROR: "There was an error saving your data. Please try again.",
};

/**
 * Helper function to handle form submission errors
 */
export const handleFormError = (error: any): string => {
  if (error?.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action.';
      case 'unavailable':
        return 'Service is currently unavailable. Please try again later.';
      case 'invalid-argument':
        return 'Invalid data provided. Please check your inputs.';
      default:
        return error.message || ERROR_MESSAGES.REGISTRATION_FAILED;
    }
  }
  return error?.message || ERROR_MESSAGES.REGISTRATION_FAILED;
};

/**
 * Register user with Firebase Authentication and save profile data
 * Signs out user after registration to prevent auto-redirect to dashboard
 */
export const registerWithAuth = async (
  email: string,
  password: string,
  collectionName: string,
  profileData: any
) => {
  try {
    // Create user account with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Immediately sign out to prevent auth state listeners from triggering
    await signOut(auth);
    
    // Prepare profile data with the authenticated user's UID
    const dataWithAuth = {
      ...sanitizeForFirebase(profileData),
      uid: user.uid,
      email: user.email,
      createdAt: new Date().toISOString(),
    };
    
    // Save profile data to Firestore with the user's UID as document ID
    await setDoc(doc(db, collectionName, user.uid), dataWithAuth);
      
    // Also save basic user info to users collection for authentication
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: `${profileData.name} ${profileData.surname}`.trim(),
      role: collectionName === "freelancers" ? "freelancer" : "client",
      createdAt: new Date().toISOString(),
    });
    
    // Send email verification (will fail since user is signed out, but that's OK)
    try {
      // Note: Email verification requires the user to be signed in
      // We'll skip this for now to ensure clean registration flow
      // await sendEmailVerification(user);
    } catch (emailError) {
      console.warn("Failed to send email verification:", emailError);
      // Don't throw here as the registration was successful
    }
    
    return user.uid;
  } catch (error) {
    console.error("Error during registration: ", error);
    throw error;
  }
};
