import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import ImageGrid from "./ImageGrid";

export default function LoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [attempts, setAttempts] = useState(0);

    const { setUserId } = useUser();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("/users/login", form);

            setUserId(res.data.userId);
            navigate(`/dashboard/${res.data.userId}`);
        } catch (err) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts >= 2) {
                window.location.href = "https://www.google.com";
            } else {
                alert("Invalid credentials");
            }
        }
    };

    return (

        <div style={{ display: "flex", gap: "24px" }}>
            {/* LEFT: Image grid */}
            <div style={{ flex: 1 }}>
                <ImageGrid />
            </div>

            {/* RIGHT: Login form */}
            <div style={{ width: "350px", marginRight:"24px" }}>
                <div style={{marginTop: "50px", width: "100%", flexDirection: "row", justifyItems: "center"}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <input
                            className="input"
                            placeholder="Username"
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                        <input
                            className="input"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <button className="btn btn-primary" style={{width: "100px", justifyContent: "center"}} onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>

    );
}
