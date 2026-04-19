import {useContext, useState} from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
