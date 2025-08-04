"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type User = { 
  email: string; 
  permissions: string[]; 
  displayName?: string;
  photoURL?: string;
};
export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUserProfile: (data: Partial<User>) => void;
};

const usersDb = [
  { 
    email: "admin@vibermm.com", 
    password: "admin", 
    permissions: ["view_dashboard", "edit_assets"],
    displayName: "Admin User",
    photoURL: "https://www.gravatar.com/avatar/64e1b8d34f425d19e1ee2ea7236d3028?d=identicon"
  },
  { 
    email: "tech@vibermm.com", 
    password: "tech", 
    permissions: ["view_dashboard"],
    displayName: "Tech Support",
    photoURL: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=identicon"
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const found = usersDb.find(u => u.email === email && u.password === password);
    if (found) {
      const userData = { 
        email: found.email, 
        permissions: found.permissions,
        displayName: found.displayName,
        photoURL: found.photoURL
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    
    // Force page reload to trigger proper redirection to login page
    window.location.href = "/login";
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUserProfile,
      isAuthenticated: !!user, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
