'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

// Assuming UserProfile is defined somewhere, e.g., in your backend.json interfaces
type UserProfile = {
  id: string;
  email: string;
  userType: 'Individual' | 'Business' | 'Admin';
  subscriptionTier: 'Free' | 'Basic' | 'Premium' | 'Enterprise';
  createdAt: string;
  name?: string;
  settings?: {
    currency: string;
    language: string;
  };
};

export function useUserProfile() {
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, `users/${authUser.uid}`);
  }, [firestore, authUser]);

  const { data: userProfile, isLoading: isProfileLoading, error } = useDoc<UserProfile>(userProfileRef);

  const isLoading = isAuthLoading || isProfileLoading;
  
  // You can decide how to merge or present the data.
  // Here, we're returning the Firestore profile and the original auth user separately.
  return { 
    authUser, 
    userProfile, 
    isLoading, 
    error 
  };
}
