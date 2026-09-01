import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {api} from "./utils/api";

export interface UserData {
    userId: string;
    username: string;
    firstName: string;
    company?: string;
    eventCount: number;
}

interface UserContextType {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
export const UserEventCountContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null);
    const [userEventCount, setUserEventCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Restore user on app startup (page refresh)
    useEffect(() => {
        api
            .get("/users/me", { withCredentials: true })
            .then(res => {
                setUser(res.data);
            })
            .catch((err) => {
                if (err.response?.status === 401) {
                    setUser(null);
                    return;
                }
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
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
