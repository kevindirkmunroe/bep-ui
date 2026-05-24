import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import ImageGrid from "./ImageGrid";

// Tell axios to send cookies for all requests
axios.defaults.withCredentials = true;

export default function ForgotPasswordPage() {
    const [form, setForm] = useState({ userIdentifier: "" });
    const [passwordReset, setPasswordReset] = useState(false);
    const [invalidUser, setInvalidUser] = useState(false);
    const navigate = useNavigate();

    const handleReset = async () => {
        if(!form.userIdentifier){
            alert('Must submit a username or email');
            return;
        }

        try {
            console.log(`userIdentifier ${form.userIdentifier}`);
            await axios.post('/users/forgotpassword', {
                userIdentifier: form.userIdentifier,
            });
            setPasswordReset(true);
        } catch (err: Error | any) {
            if (err.response) {
                // Access the status code directly
                const statusCode = err.response.status;
                console.log(`HTTP Error: ${statusCode}`);
                setInvalidUser(true);
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
                    <div style={{marginBottom:"20px"}}>To reset your password, submit your username or email</div>
                    <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <input
                            className="input"
                            placeholder="User"
                            onChange={(e) => {
                                    setForm({ ...form, userIdentifier: e.target.value });
                                    setInvalidUser(false);
                                }
                            }
                        />
                        <button className="btn btn-primary" style={{width: "180px", marginTop: "20px", justifyContent: "center"}} onClick={handleReset}>Request Password Reset</button>
                    </div>
                </div>
                { passwordReset && (
                    <div>
                        <div style={{marginTop: "16px"}}>Your password was reset. Check your email for a temporary password.</div>
                        <a style={{marginTop: "20px"}} href="/login">Login</a>
                    </div>
                )}
                { invalidUser && (
                <div>
                    <div style={{marginTop: "16px"}}>User {form.userIdentifier} was not found.</div>
                </div>
            )}
            </div>
        </div>
    );
}
