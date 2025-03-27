export interface User {
  id: string;
  email: string;
  role: 'faculty' | 'admin';
  institution?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  role: 'faculty' | 'admin';
  institution?: string;
} 