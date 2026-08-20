import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import {api} from "../utils/api";
import BaseDialog, {DialogState} from "./BaseDialog";

export default function ResetPasswordPage() {
    const [form, setForm] = useState({ password: "", passwordRepeat:"" });
    const [passwordReset, setPasswordReset] = useState(false);
    const [dialog, setDialog] = useState<DialogState>(null);
    const navigate = useNavigate();

    const handleReset = async () => {
        if(!form.password || !form.passwordRepeat){
            setDialog({
                type: "confirm",
                title: "Reset Password",
                message: "Must submit a new password."
            });
            return;
        }

        if(form.password !== form.passwordRepeat){
            setDialog({
                type: "error",
                title: "Reset Password",
                message: "Passwords must match,"
            });
            return;
        }

        try {
            console.log(`pwd1 ${form.password} pwd2 ${form.password}`);
            await api.post('/users/resetpassword', {
                userIdentifier: form.password,
            });
            setPasswordReset(true);
        } catch (err: Error | any) {
            if (err.response) {
                // Access the status code directly
                const statusCode = err.response.status;
                console.log(`HTTP Error: ${statusCode}`);
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
                    <div style={{marginBottom:"20px"}}>To reset your password, submit your username or email</div>
                    <div style={{width: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <input
                            className="input"
                            type="password"
                            placeholder="password"
                            onChange={(e) => {
                                    setForm({ ...form, password: e.target.value });
                                }
                            }
                        />
                        <p>Repeat password:</p>
                        <input
                            className="input"
                            type="password"
                            placeholder="repeat password"
                            onChange={(e) => {
                                    setForm({ ...form, passwordRepeat: e.target.value });
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
            </div>
        </div>
    );
}
