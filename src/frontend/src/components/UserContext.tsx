import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  username: string;
  setUsername: (username: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsernameState] = useState<string>(() => {
    return localStorage.getItem("username") || "";
  });

  const setUsername = (username: string) => {
    setUsernameState(username);
    localStorage.setItem("username", username); // Store the username in localStorage
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};