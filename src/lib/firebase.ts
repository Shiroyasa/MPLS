/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ActivityPhoto, Announcement, Agent, Quest } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and Export Firestore with Database ID (as CRITICAL constraint)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize and Export Auth
export const auth = getAuth();

// --- Firestore Error Handling conforming to standard specification ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Connection test validator (CRITICAL CONSTRAINT) ---
async function testConnection() {
  try {
    // Testing read on a dummy connection document
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Client is offline.");
    }
  }
}
testConnection();

// --- Firestore Database operations with Real-time synchronization support ---

/**
 * Sync Activities (Gallery Photos) in real-time
 */
export function subscribeActivities(
  onUpdate: (activities: ActivityPhoto[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, 'activities');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ActivityPhoto[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as ActivityPhoto);
      });
      onUpdate(list);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, 'activities');
      }
    }
  );
}

/**
 * Add / Update Activity
 */
export async function saveActivityToFirestore(activity: ActivityPhoto) {
  const path = `activities/${activity.id}`;
  try {
    await setDoc(doc(db, 'activities', activity.id), activity);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete Activity
 */
export async function deleteActivityFromFirestore(id: string) {
  const path = `activities/${id}`;
  try {
    await deleteDoc(doc(db, 'activities', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Sync Announcements in real-time
 */
export function subscribeAnnouncements(
  onUpdate: (announcements: Announcement[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, 'announcements');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Announcement[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Announcement);
      });
      // Sort in-memory if needed or order in query
      onUpdate(list);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, 'announcements');
      }
    }
  );
}

/**
 * Add / Update Announcement
 */
export async function saveAnnouncementToFirestore(announcement: Announcement) {
  const path = `announcements/${announcement.id}`;
  try {
    await setDoc(doc(db, 'announcements', announcement.id), announcement);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete Announcement
 */
export async function deleteAnnouncementFromFirestore(id: string) {
  const path = `announcements/${id}`;
  try {
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Sync Agents in real-time
 */
export function subscribeAgents(
  onUpdate: (agents: Agent[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, 'agents');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Agent[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Agent);
      });
      onUpdate(list);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, 'agents');
      }
    }
  );
}

/**
 * Add / Update Agent Profile
 */
export async function saveAgentToFirestore(agent: Agent) {
  // Use lowercased name as id to prevent duplicates across devices
  const id = agent.name.toLowerCase().replace(/\s+/g, '_');
  const path = `agents/${id}`;
  try {
    await setDoc(doc(db, 'agents', id), agent);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Sync Quests in real-time
 */
export function subscribeQuests(
  onUpdate: (quests: Quest[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, 'quests');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: Quest[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Quest);
      });
      onUpdate(list);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, 'quests');
      }
    }
  );
}

/**
 * Add / Update Quest
 */
export async function saveQuestToFirestore(quest: Quest) {
  const path = `quests/${quest.id}`;
  try {
    await setDoc(doc(db, 'quests', quest.id), quest);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete Quest
 */
export async function deleteQuestFromFirestore(id: string) {
  const path = `quests/${id}`;
  try {
    await deleteDoc(doc(db, 'quests', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Google Auth Uplink helper methods ---

export async function googleSignIn() {
  const provider = new GoogleAuthProvider();
  // Request full scope access for Google Drive and Google Sheets APIs
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.addScope('https://www.googleapis.com/auth/spreadsheets');
  
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken || null;
  if (accessToken) {
    localStorage.setItem('google_access_token', accessToken);
  }
  return {
    user: result.user,
    accessToken
  };
}

export function getAccessToken(): string | null {
  return localStorage.getItem('google_access_token');
}

export async function logout() {
  localStorage.removeItem('google_access_token');
  await signOut(auth);
}

export function initAuth(
  onSuccess: (user: any, token: string) => void,
  onFailure: () => void
) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const token = localStorage.getItem('google_access_token') || '';
      onSuccess(user, token);
    } else {
      onFailure();
    }
  });
}

