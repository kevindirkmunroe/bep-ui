import { Link } from "react-router-dom";

export function WelcomePage() {
    return (
        <div>
            <h1>Welcome to BEP</h1>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>
    );
}
