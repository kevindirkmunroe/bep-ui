import { createContext, useContext } from "react";

interface UserContextType {
    userId: string | null;
    setUserId: (id: string | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }

    return context;
}
