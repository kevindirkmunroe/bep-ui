import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            // You can create a /login endpoint later
            const res = await axios.get(`/users?email=${email}`);

            const user = res.data;
            console.log(`LOGIN got user: ${user}`);
            navigate(`/dashboard/${user.user_id}`);
        } catch (err) {
            alert("User not found");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>Login</h2>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
