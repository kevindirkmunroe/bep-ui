import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useUser } from "../UserContext";
import ImageGrid from "./ImageGrid";
import {api} from "../utils/api";
import BaseDialog, {DialogState} from "./BaseDialog";

export default function LoginPage() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [attempts, setAttempts] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [dialog, setDialog] = useState<DialogState>(null);

    const { setUser } = useUser();
    const navigate = useNavigate();

    const passwordInputStyle = {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "12px",
        fontSize: "14px"
    };

    const passwordWrapper = {
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "400px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        backgroundColor: "white",
        overflow: "hidden"
    };

    const toggleButtonStyle = {
        border: "none",
        background: "white",
        color: "#D2492C",
        fontWeight: "bold",
        cursor: "pointer",
        padding: "0 12px",
        whiteSpace: "nowrap" as const
    };

    const handleLogin = async () => {
        try {
            const res = await api.post("/users/login", form);

            setUser({
                userId: res.data.userId,
                username: res.data.username,
                firstName: res.data.firstName,
                company: res.data.company
            });
            // If password is not bcrypt hashed, it is temporary. Redirect user to password reset.
            navigate(`/dashboard/${res.data.userId}`);
        } catch (err: Error | any) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            if (newAttempts === 5) {
                window.location.href = "https://www.google.com";
            } else {
                "Invalid credentials");
                setDialog({
                    type: "error",
                    title: "Login",
                    message: "Invalid credentials"
                });
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
                {dialog && (
                    <BaseDialog
                        type={dialog.type}
                        title={dialog.title}
                        message={dialog.message}
                        confirmLabel={dialog.confirmLabel}
                        onConfirm={dialog.onConfirm}
                        onClose={() => setDialog(null)}
                    />
                )}
                <div style={{marginTop: "50px", width: "100%", flexDirection: "row", justifyItems: "center"}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <input
                            className="input"
                            placeholder="Username"
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                        <div style={passwordWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Password"
                                style={passwordInputStyle}
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={toggleButtonStyle}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <button className="btn btn-primary" style={{width: "100px", justifyContent: "center", marginTop: "20px"}} onClick={handleLogin}>Login</button>
                    </div>
                    <div style={{marginTop: "20px"}}>
                        <Link to="/forgotpassword">Forgot Password?</Link>
                    </div>
                </div>
            </div>
        </div>

    );
}
