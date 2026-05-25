import { useState } from "react";
import {UserData} from "../UserContext";
import axios from "axios";

export default function ChangePasswordForm({ user }: { user: UserData }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function validatePassword(pw: string): string | null {
        if (pw.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (!/[A-Z]/.test(pw)) {
            return "Password must contain an uppercase letter.";
        }

        if (!/[a-z]/.test(pw)) {
            return "Password must contain a lowercase letter.";
        }

        if (!/[0-9]/.test(pw)) {
            return "Password must contain a number.";
        }

        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pw)) {
            return "Password must contain a special character.";
        }

        return null;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validatePassword(password);

        if (validationError) {
            setError(validationError);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await axios.post("/users/changepassword", {
                userId: user?.userId, password
            });

            setSuccess("Password updated successfully.");
            setPassword("");
            setConfirmPassword("");
        } catch {
            setError("Unable to update password.");
        }
    }

    const passwordsMatch =
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword;

    const passwordError = password
        ? validatePassword(password)
        : null;

    const canSubmit =
        !passwordError &&
        passwordsMatch;

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2>Change Password</h2>

            <input
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
            />

            <input
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
            />

            {passwordError && (
                <div style={errorStyle}>
                    {passwordError}
                </div>
            )}

            {!passwordError &&
                confirmPassword &&
                !passwordsMatch && (
                    <div style={errorStyle}>
                        Passwords do not match.
                    </div>
                )}

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            {success && (
                <div style={successStyle}>
                    {success}
                </div>
            )}

            <button
                className="btn btn-primary"
                type="submit"
                disabled={!canSubmit}
                style={buttonStyle}
            >
                Update Password
            </button>
        </form>
    );
}

const formStyle = {
    maxWidth: "400px",
    margin: "40px auto",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px"
};

const inputStyle = {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

const buttonStyle = {
    padding: "12px",
    backgroundColor: "#D2492C",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
};

const errorStyle = {
    color: "crimson",
    fontSize: "14px"
};

const successStyle = {
    color: "green",
    fontSize: "14px"
};
