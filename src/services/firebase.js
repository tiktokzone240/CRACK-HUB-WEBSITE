import { initializeApp, getApps as getFirebaseApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  inMemoryPersistence
} from 'firebase/auth';
import { INITIAL_APPS } from '../data/apps';

// Admin UID specified for access control
export const ADMIN_UID = 'ZHu3iExg0vewZgqFlUVQsHINyCy2';

// Read config from Vite environment variables with fallback to firebase-applet-config.json
let configFromJson = {};
try {
  const firebaseConfigModule = import.meta.glob('/firebase-applet-config.json', { eager: true });
  if (firebaseConfigModule['/firebase-applet-config.json']) {
    configFromJson = firebaseConfigModule['/firebase-applet-config.json'].default || firebaseConfigModule['/firebase-applet-config.json'];
  }
} catch {
  // Ignore fallback loading errors
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || configFromJson.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || configFromJson.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || configFromJson.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || configFromJson.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || configFromJson.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || configFromJson.appId || ''
};

// Firestore database ID - force default database connection
const envDbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID;
const configDbId = configFromJson.firestoreDatabaseId;
const rawDatabaseId = envDbId || configDbId;
const databaseId = (!rawDatabaseId || rawDatabaseId === '(default)' || rawDatabaseId.includes('ai-studio-')) ? '(default)' : rawDatabaseId;

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  app = getFirebaseApps().length === 0 ? initializeApp(firebaseConfig) : getFirebaseApps()[0];
  db = (databaseId && databaseId !== '(default)') ? getFirestore(app, databaseId) : getFirestore(app);
  auth = getAuth(app);
  // Ensure in-memory persistence and clear session on initialization/refresh
  setPersistence(auth, inMemoryPersistence).catch((e) => {
    console.warn('Failed to set inMemoryPersistence:', e);
  });
  signOut(auth).catch(() => {});
}

export { db, auth };

const APPS_COLLECTION = 'Apps';

/**
 * Admin Authentication Service Functions
 */

/**
 * Login admin user with Email and Password
 * @param {string} email
 * @param {string} password
 */
export async function loginAdmin(email, password) {
  if (!auth) {
    throw new Error('Firebase Auth is not configured.');
  }
  // Enforce inMemoryPersistence before sign-in so session is never saved across reloads
  await setPersistence(auth, inMemoryPersistence);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  if (user.uid !== ADMIN_UID) {
    await signOut(auth);
    throw new Error('Unauthorized: Admin access only. Your UID does not match admin privileges.');
  }
  
  return user;
}

/**
 * Logout current admin user
 */
export async function logoutAdmin() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Subscribe to Firebase Auth state changes
 * @param {Function} callback
 */
export function subscribeToAuthState(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Firestore Database Service Functions (Collection: Apps)
 */

/**
 * Get all apps from Firestore 'Apps' collection
 * Seeds INITIAL_APPS if the collection is empty
 */
export async function getApps() {
  if (!db) return INITIAL_APPS;
  try {
    const appsRef = collection(db, APPS_COLLECTION);
    const snapshot = await getDocs(appsRef);
    
    if (snapshot.empty) {
      const hasSeeded = localStorage.getItem('badhon_hub_seeded') === 'true';
      if (hasSeeded) {
        return [];
      }

      // Auto-seed INITIAL_APPS into Firestore 'Apps' collection on first initialization
      const seededList = [];
      for (const item of INITIAL_APPS) {
        try {
          const docRef = doc(db, APPS_COLLECTION, item.id);
          await setDoc(docRef, {
            title: item.title || '',
            appName: item.title || '',
            version: item.version || '',
            size: item.size || '',
            downloads: item.downloads || 0,
            description: item.description || '',
            icon: item.icon || '',
            banner: item.banner || '',
            downloadUrl: item.downloadUrl || '',
            screenshots: item.screenshots || [],
            createdAt: serverTimestamp()
          });
          seededList.push({
            ...item,
            id: item.id
          });
        } catch (e) {
          console.warn('Seeding single item error:', e);
        }
      }
      localStorage.setItem('badhon_hub_seeded', 'true');
      return seededList.length > 0 ? seededList : INITIAL_APPS;
    }

    localStorage.setItem('badhon_hub_seeded', 'true');
    const appsList = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const appName = data.appName || data.title || '';
      appsList.push({
        ...data,
        id: docSnap.id,
        title: appName,
        appName: appName
      });
    });
    return appsList;
  } catch (error) {
    console.error('Error fetching apps from Firestore:', error);
    return INITIAL_APPS;
  }
}

/**
 * Get a single app by ID from Firestore 'Apps' collection
 * @param {string} id
 */
export async function getAppById(id) {
  if (!db || !id) {
    return INITIAL_APPS.find((item) => item.id === id) || INITIAL_APPS[0];
  }
  try {
    const docRef = doc(db, APPS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const appName = data.appName || data.title || '';
      return {
        ...data,
        id: docSnap.id,
        title: appName,
        appName: appName
      };
    }
    // Fallback search in initial data
    return INITIAL_APPS.find((item) => item.id === id) || null;
  } catch (error) {
    console.error('Error getting app by ID from Firestore:', error);
    return INITIAL_APPS.find((item) => item.id === id) || null;
  }
}

/**
 * Helper to generate document ID slug from app name
 * Example: "Subway Surfers" => "subway-surfers"
 * @param {string} appName
 */
export function slugifyAppName(appName) {
  if (!appName) return `app-${Date.now()}`;
  const slug = appName
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || `app-${Date.now()}`;
}

/**
 * Add a new app document to Firestore 'Apps' collection using slugified app ID
 * @param {Object} appData
 */
export async function addApp(appData) {
  if (!db) throw new Error('Firestore is not configured.');
  const { id: _, ...dataToSave } = appData;
  const nameToUse = dataToSave.appName || dataToSave.title || '';
  const customId = slugifyAppName(nameToUse);

  const docRef = doc(db, APPS_COLLECTION, customId);
  await setDoc(docRef, {
    ...dataToSave,
    createdAt: serverTimestamp()
  });

  return {
    ...dataToSave,
    id: customId
  };
}

/**
 * Update an existing app document in Firestore 'Apps' collection
 * @param {string} id
 * @param {Object} appData
 */
export async function updateApp(id, appData) {
  if (!db || !id) throw new Error('Firestore is not configured or missing ID.');
  const { id: _, ...dataToSave } = appData;
  const docRef = doc(db, APPS_COLLECTION, id);
  await updateDoc(docRef, {
    ...dataToSave,
    updatedAt: serverTimestamp()
  });
  return { ...dataToSave, id };
}

/**
 * Delete an app document from Firestore 'Apps' collection
 * @param {string} id
 */
export async function deleteApp(id) {
  if (!db || !id) throw new Error('Firestore is not configured or missing ID.');

  console.log('[Firestore] Selected app id:', id);
  const firestorePath = `${APPS_COLLECTION}/${id}`;
  console.log('[Firestore] Firestore delete path:', firestorePath);

  try {
    await deleteDoc(doc(db, APPS_COLLECTION, id));
    console.log("DELETE SUCCESS", id);

    // Also attempt cleanup on lowercase 'apps' collection if present
    try {
      await deleteDoc(doc(db, 'apps', id));
    } catch (_) {}

    return id;
  } catch (error) {
    console.error("DELETE FAILED", error.code || error.name);
    console.error("DELETE MESSAGE", error.message);
    throw error;
  }
}

/**
 * Increment download count for an app document in Firestore
 * @param {string} id
 */
export async function incrementDownloadCount(id) {
  if (!db || !id) return;
  try {
    const docRef = doc(db, APPS_COLLECTION, id);
    await updateDoc(docRef, {
      downloads: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing download count in Firestore:', error);
  }
}

export default {
  db,
  auth,
  ADMIN_UID,
  isFirebaseConfigured,
  loginAdmin,
  logoutAdmin,
  subscribeToAuthState,
  getApps,
  getAppById,
  addApp,
  updateApp,
  deleteApp,
  incrementDownloadCount
};

