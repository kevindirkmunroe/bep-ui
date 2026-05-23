import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useUser();
    if (loading) {
        return <div>Loading...</div>;
    }

    console.log(`[ProtectedRoute] user= ${JSON.stringify(user)}`);

    if (!user?.userId) {
        return <Navigate to="/login" />;
    }

    return children;
}
