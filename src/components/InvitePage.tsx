import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import ImageGrid from "./ImageGrid";

export default function InvitePage() {
    const [form, setForm] = useState({ username: "", inviteCode: "" });
    const [attempts, setAttempts] = useState(0);

    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleInvite = async () => {
        try {
            const res = await axios.get(`/users/invite?username=${form.username}&inviteCode=${form.inviteCode}`);
            console.log(`setting userId: ${res.data.userId}`);
            setUser(res.data.user);
            console.log(`navigating to : /dashboard/${res.data.userId}`);
            navigate(`/dashboard/${res.data.userId}`);
        } catch (err) {
            console.log(`error on invite: ${err}`);
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts === 5) {
                window.location.href = "https://www.google.com";
            } else {
                alert("Invalid Invite Code");
            }
        }
    };

    return (

        <div style={{ display: "flex", gap: "24px" }}>
            {/* LEFT: Image grid */}
            <div style={{ flex: 1 }}>
                <ImageGrid />
            </div>

            {/* RIGHT: Invite form */}
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
                            placeholder="Invite Code"
                            onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
                        />
                        <button className="btn btn-primary" style={{width: "150px", justifyContent: "center", marginTop: "20px"}} onClick={handleInvite}>Use Invite Code</button>
                    </div>
                </div>
            </div>
        </div>

    );
}
