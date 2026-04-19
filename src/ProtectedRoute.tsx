import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { userId } = useUser();

    if (!userId) {
        return <Navigate to="/login" />;
    }

    return children;
}
