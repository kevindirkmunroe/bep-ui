import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        username: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

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
            const validateRes = await axios.get("/users/validate", {
                params: form
            });

            if (!validateRes.data.valid) {
                setError(validateRes.data.message);

                if (
                    validateRes.data.reason === "email_exists" ||
                    validateRes.data.reason === "username_exists"
                ) {
                    setTimeout(() => navigate("/users/login"), 1500);
                }

                return;
            }

            // 🔹 Step 2: create user
            await axios.post("/users", form);

            alert("Registration successful. Please login.");
            navigate("/users/login");

        } catch (err) {
            console.error(err);
            setError("Something went wrong: ");
        }
    };

    return (
        <div style={{ padding: 40, maxWidth: 400 }}>
            <h2>Register</h2>

            <input name="firstName" placeholder="First Name" onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="company" placeholder="Company" onChange={handleChange} />

            <input name="username" placeholder="Username" onChange={handleChange} />

            <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
            />

            <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
            />

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button onClick={handleRegister}>Register</button>
        </div>
    );
}
