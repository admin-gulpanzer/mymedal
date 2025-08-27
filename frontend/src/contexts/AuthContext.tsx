import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Use the same API base URL as the apiClient
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mymedal-backend.vercel.app';

interface User {
  id: string;
  email: string;
  displayName: string;
}

interface Race {
  id: number;
  name: string;
  location: string;
  distance: string;
  date: string;
  description?: string;
  race_type?: string;
  medal_image_url?: string;
}

interface Medal {
  id: string;
  race_name: string;
  race_date: string;
  race_distance: string;
  finish_time?: any;
  race_location?: string;
  race_description?: string;
  is_verified?: boolean;
  claimed_at: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  races: Race[];
  medals: Medal[];
  racesLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, displayName: string) => Promise<boolean>;
  signOut: () => void;
  error: string | null;
  refreshMedals: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [races, setRaces] = useState<Race[]>([]);
  const [medals, setMedals] = useState<Medal[]>([]);
  const [racesLoading, setRacesLoading] = useState(false);
  const [racesLoaded, setRacesLoaded] = useState(false);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verify token with backend
          const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Sign in failed');
        return false;
      }
    } catch (error) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, displayName }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('authToken', data.token);
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Sign up failed');
        return false;
      }
    } catch (error) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    setError(null);
    setMedals([]); // Clear medals
    setRaces([]); // Clear races
    setRacesLoaded(false); // Reset races loaded flag
  };

  const refreshMedals = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setMedals([]);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/medals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMedals(data);
      } else {
        console.warn('Failed to fetch medals:', response.status);
        setMedals([]);
      }
    } catch (error) {
      console.error('Error refreshing medals:', error);
      setMedals([]);
    }
  };

  // Load races only after user signs in (races are public data)
  useEffect(() => {
    if (user && !racesLoaded && !racesLoading) {
      const loadRaces = async () => {
        try {
          setRacesLoading(true);
          console.log('Loading races...');
          const response = await fetch(`${API_BASE_URL}/api/races`);
          if (response.ok) {
            const racesData = await response.json();
            console.log('Races loaded:', racesData.length);
            if (racesData.length > 0) {
              setRaces(racesData);
              setRacesLoaded(true);
            } else {
              console.warn('No races found in API response');
              setRaces([]);
              setRacesLoaded(true);
            }
          } else {
            console.warn('Failed to load races:', response.status);
            setRaces([]);
            setRacesLoaded(true);
          }
        } catch (error) {
          console.error('Error loading races:', error);
          setRaces([]);
          setRacesLoaded(true);
        } finally {
          setRacesLoading(false);
        }
      };

      loadRaces();
    }
  }, [user, racesLoaded, racesLoading]);

  // Load medals when user changes
  useEffect(() => {
    if (user) {
      refreshMedals();
    } else {
      setMedals([]);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    races,
    medals,
    racesLoading,
    signIn,
    signUp,
    signOut,
    error,
    refreshMedals,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
