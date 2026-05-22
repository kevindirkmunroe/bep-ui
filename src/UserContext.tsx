import {createContext, ReactNode, useContext, useState} from "react";

export interface UserData {
    userId: string;
    username: string;
    firstName: string;
    company?: string;
}

interface UserContextType {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }

    return context;
}
