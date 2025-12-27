import { db } from "./firebaseConfig";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    serverTimestamp,
    doc,
    getDoc,
    deleteDoc,
    updateDoc,
    Timestamp
} from "firebase/firestore";

export interface Chat {
    id: string;
    userId: string;
    title: string;
    createdAt: Timestamp;
    pinned?: boolean;
    score?: number; // Total Dukkho Score
}

export interface Message {
    id?: string;
    role: 'user' | 'model';
    text: string;
    createdAt: Timestamp;
}

// Create a new chat session
export const createChat = async (userId: string, title: string = "New Chat") => {
    try {
        const docRef = await addDoc(collection(db, "chats"), {
            userId,
            title,
            pinned: false,
            score: 0, // Initialize score
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
};

// ... existing code ...

export const updateChatScore = async (chatId: string, newScore: number) => {
    try {
        await updateDoc(doc(db, "chats", chatId), {
            score: newScore,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating chat score:", error);
        throw error; // Let frontend handle or ignore
    }
};



// Fetch all chats for a user
export const getUserChats = async (userId: string): Promise<Chat[]> => {
    try {
        const q = query(
            collection(db, "chats"),
            where("userId", "==", userId),
            orderBy("pinned", "desc"), // Pinned first
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Chat));
    } catch (error) {
        console.error("Error fetching chats:", error);
        return [];
    }
};

// Add a message to a specific chat
export const addMessage = async (chatId: string, role: 'user' | 'model', text: string) => {
    try {
        await addDoc(collection(db, "chats", chatId, "messages"), {
            role,
            text,
            createdAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error adding message:", error);
        throw error;
    }
};

// Get messages for a specific chat
export const getChatMessages = async (chatId: string): Promise<Message[]> => {
    try {
        const q = query(
            collection(db, "chats", chatId, "messages"),
            orderBy("createdAt", "asc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Message));
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
};

// New Management Functions

export const deleteChat = async (chatId: string) => {
    try {
        // Note: Subcollections are not automatically deleted in client SDK.
        // For a hobby app, leaving orphaned messages is acceptable, 
        // or we'd need a Cloud Function. We'll just delete the parent doc for listing purposes.

        // Ideally we should delete all messages first, but client-side batching for large chats is complex.
        // We will just delete the chat doc which hides it from the list.
        await deleteDoc(doc(db, "chats", chatId));
        return true;
    } catch (error) {
        console.error("Error deleting chat:", error);
        throw error;
    }
};

export const updateChatTitle = async (chatId: string, newTitle: string) => {
    try {
        await updateDoc(doc(db, "chats", chatId), {
            title: newTitle,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating chat title:", error);
        throw error;
    }
};

export const toggleChatPin = async (chatId: string, currentStatus: boolean) => {
    try {
        await updateDoc(doc(db, "chats", chatId), {
            pinned: !currentStatus,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error toggling pin:", error);
        throw error;
    }
};
