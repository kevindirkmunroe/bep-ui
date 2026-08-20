import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import ImageCarousel from "./ImageCarousel";
import {api} from "../utils/api";
import BaseDialog, {DialogState} from "./BaseDialog";

export function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        username: "",
        password: "",
        confirmPassword: "",
        invite_code: ""
    });

    const [error, setError] = useState("");
    const [dialog, setDialog] = useState<DialogState>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async () => {
        setError("");

        // 🔹 Basic frontend validation
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            // 🔹 Step 1: validate
            const validateRes = await api.get("/users/validate", {
                params: form
            });

            if (!validateRes.data.valid) {
                setError(validateRes.data.message);

                if (
                    validateRes.data.reason === "email_exists" ||
                    validateRes.data.reason === "username_exists"
                ) {
                    setTimeout(() => navigate("/login"), 4000);
                }

                return;
            }

            // 🔹 Step 2: create user
            await api.post("/users/register", form);
            setDialog({
                type: "confirm",
                title: "Registration",
                message: "Registration successful. Please login."
            });
            navigate("/login");

        } catch (err) {
            console.error(err);
            setError("Something went wrong: ");
        }
    };

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: Existing content */}
            <div style={{marginTop: "10px", width: "100%", flexDirection: "row", justifyItems: "center"}}>
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
                <div style={{ padding: 40, maxWidth: 400 }}>
                    <h2>Welcome To The Party Pal!</h2>
                    <br/>
                    <input className="input" name="first_name" placeholder="First Name" onChange={handleChange} />
                    <input className="input" name="last_name" placeholder="Last Name" onChange={handleChange} />
                    <input className="input" name="email" placeholder="Email" onChange={handleChange} />
                    <input className="input" name="company" placeholder="Company" onChange={handleChange} />

                    <input className="input" name="username" placeholder="Username" onChange={handleChange} />

                    <input
                        className="input"
                        name="password"
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <input
                        className="input"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                    />
                    <input className="input" name="invite_code" placeholder="Invite code" onChange={handleChange} />

                    {error && <div style={{ color: "red" }}>{error}</div>}

                    <button className="btn btn-primary" style={{marginTop: "8px"}} onClick={handleRegister}>Register</button>
                    <div style={{marginTop: "10px"}}>
                        No Invite Code? &nbsp;&nbsp; <Link to="/invite">Request Invite</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
