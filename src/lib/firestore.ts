
import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import type { Guest, GuestDocument, ProfileData } from './types';

const GUESTS_COLLECTION = 'guests';
const PROFILE_COLLECTION = 'profile';
const PROFILE_DOC_ID = 'main';

// --- Guest Functions ---

export const getGuests = async (): Promise<Guest[]> => {
  try {
    const guestsCollection = collection(db, GUESTS_COLLECTION);
    const q = query(guestsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() as GuestDocument;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      };
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    throw new Error('Failed to fetch guests');
  }
};

export const getGuestsPaginated = async (
  pageSize: number = 10,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ guests: Guest[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    const guestsCollection = collection(db, GUESTS_COLLECTION);
    let q = query(
      guestsCollection, 
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const guests = snapshot.docs.map(doc => {
      const data = doc.data() as GuestDocument;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      };
    });

    return {
      guests,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error('Error fetching paginated guests:', error);
    throw new Error('Failed to fetch guests');
  }
};

export const getGuestById = async (id: string): Promise<Guest | null> => {
  try {
    const guestDoc = doc(db, GUESTS_COLLECTION, id);
    const docSnap = await getDoc(guestDoc);

    if (docSnap.exists()) {
      const data = docSnap.data() as GuestDocument;
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching guest by ID:', error);
    throw new Error('Failed to fetch guest');
  }
};

export const addGuest = async (guestData: Omit<Guest, 'id'>): Promise<Guest> => {
  try {
    // Validate required fields
    if (!guestData.name || !guestData.email) {
      throw new Error('Name and email are required');
    }

    const guestsCollection = collection(db, GUESTS_COLLECTION);
    const docRef = await addDoc(guestsCollection, {
      ...guestData,
      createdAt: serverTimestamp(),
    });

    // To return the full object with the server-generated timestamp, we need to fetch it.
    const newDoc = await getDoc(docRef);
    const data = newDoc.data() as GuestDocument;
    
    return {
      id: newDoc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    };
  } catch (error) {
    console.error('Error adding guest:', error);
    throw new Error('Failed to add guest');
  }
};

export const updateGuest = async (id: string, updates: Partial<Omit<Guest, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const guestDoc = doc(db, GUESTS_COLLECTION, id);
    await updateDoc(guestDoc, updates);
  } catch (error) {
    console.error('Error updating guest:', error);
    throw new Error('Failed to update guest');
  }
};

export const deleteGuest = async (id: string): Promise<void> => {
  try {
    const guestDoc = doc(db, GUESTS_COLLECTION, id);
    await deleteDoc(guestDoc);
  } catch (error) {
    console.error('Error deleting guest:', error);
    throw new Error('Failed to delete guest');
  }
};

export const getGuestsByEmail = async (email: string): Promise<Guest[]> => {
  try {
    const guestsCollection = collection(db, GUESTS_COLLECTION);
    const q = query(
      guestsCollection, 
      where('email', '==', email),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data() as GuestDocument;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      };
    });
  } catch (error) {
    console.error('Error fetching guests by email:', error);
    throw new Error('Failed to fetch guests by email');
  }
};

// --- Profile Functions ---

const defaultProfileData: ProfileData = {
  name: "Admin",
  aboutMe: "I'm a passionate developer building cool things. Connect with me!",
  networkingStatement: "One of my main goals is to network with other professionals. If you are hiring or know someone who is, please feel free to connect, stay in touch, or download my resume.",
  profilePictureUrl: "https://placehold.co/400x400.png",
  linkedinUrl: "",
  githubUrl: "",
  buyMeACoffeeUrl: "",
  portfolioUrl: "",
  resumeUrl: "/resume.pdf",
  notificationEmail: "admin@example.com"
};

export const getProfileData = async (): Promise<ProfileData> => {
  try {
    const profileDocRef = doc(db, PROFILE_COLLECTION, PROFILE_DOC_ID);
    const docSnap = await getDoc(profileDocRef);

    if (docSnap.exists()) {
      return docSnap.data() as ProfileData;
    } else {
      // If the profile doesn't exist, create it with default data.
      await setDoc(profileDocRef, defaultProfileData);
      return defaultProfileData;
    }
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw new Error('Failed to fetch profile data');
  }
};

export const updateProfileData = async (data: Partial<ProfileData>): Promise<void> => {
  try {
    const profileDoc = doc(db, PROFILE_COLLECTION, PROFILE_DOC_ID);
    await updateDoc(profileDoc, data);
  } catch (error) {
    console.error('Error updating profile data:', error);
    throw new Error('Failed to update profile data');
  }
};

// --- Utility Functions ---

export const getGuestStats = async (): Promise<{
  totalGuests: number;
  guestsByRole: Record<string, number>;
  recentGuests: number;
}> => {
  try {
    const guests = await getGuests();
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const guestsByRole = guests.reduce((acc, guest) => {
      acc[guest.role] = (acc[guest.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentGuests = guests.filter(guest => 
      guest.createdAt > oneWeekAgo
    ).length;

    return {
      totalGuests: guests.length,
      guestsByRole,
      recentGuests
    };
  } catch (error) {
    console.error('Error fetching guest stats:', error);
    throw new Error('Failed to fetch guest statistics');
  }
};
