
import { useState, useEffect } from 'react';
import { encryptStorage, decryptStorage } from '@/utils/security';

const ENCRYPTION_KEY = 'meetcheck_secure_key_2024'; // In production, use environment variable

export function useSecureStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      
      const decrypted = decryptStorage(item, ENCRYPTION_KEY);
      return decrypted ? JSON.parse(decrypted) : defaultValue;
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue);
      const encrypted = encryptStorage(JSON.stringify(newValue), ENCRYPTION_KEY);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error writing to secure storage:', error);
    }
  };

  const removeStoredValue = () => {
    try {
      setValue(defaultValue);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  };

  // Clear invalid data on mount
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const decrypted = decryptStorage(item, ENCRYPTION_KEY);
        if (!decrypted) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      localStorage.removeItem(key);
    }
  }, [key]);

  return [value, setStoredValue, removeStoredValue] as const;
}
