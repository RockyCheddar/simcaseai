import { User } from '@/types/auth';

// Mock user data
const MOCK_USERS = [
  {
    id: '1',
    email: 'faculty@example.com',
    password: 'password123',
    role: 'faculty',
    institution: 'Medical University',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    institution: 'Health Sciences College',
    created_at: new Date().toISOString(),
  },
];

export const AUTH_STORAGE_KEY = 'simcase_auth_user';

/**
 * Mock login function that validates against predefined users
 */
export async function mockLogin(email: string, password: string): Promise<User | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = MOCK_USERS.find(
    u => u.email === email && u.password === password
  );
  
  if (user) {
    // Remove password before storing/returning
    const { password: _, ...userWithoutPassword } = user;
    const authUser = userWithoutPassword as User;
    
    // Store in localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    
    return authUser;
  }
  
  return null;
}

/**
 * Check if user is logged in by looking at localStorage
 */
export function getLoggedInUser(): User | null {
  if (typeof window === 'undefined') {
    return null; // Handle server-side rendering
  }
  
  const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as User;
    } catch (e) {
      console.error('Failed to parse stored user', e);
      return null;
    }
  }
  
  return null;
}

/**
 * Mock logout function
 */
export async function mockLogout(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(): boolean {
  return getLoggedInUser() !== null;
} 