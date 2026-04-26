import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase completely so tests never hit real Firebase
vi.mock('../firebase/config', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid-123',
      email: 'test@quantumshield.com',
      emailVerified: true,
      getIdToken: vi.fn().mockResolvedValue('mock-token-xyz')
    }
  },
  db: {}
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      uid: 'test-uid-123',
      email: 'test@quantumshield.com',
      emailVerified: true
    },
    userRole: 'enterprise',
    loading: false,
    logout: vi.fn()
  }),
  AuthProvider: ({ children }) => <div>{children}</div>
}));
