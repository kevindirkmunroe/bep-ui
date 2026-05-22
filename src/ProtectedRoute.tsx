import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user } = useUser();

    if (!user?.userId) {
        return <Navigate to="/login" />;
    }

    return children;
}
