import { useState } from "react";
import {api} from "../utils/api";

export default function RequestInvitePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [useCase, setUseCase] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        setMessage("");

        if (!name || !email || !useCase) {
            setMessage(
                "Please complete all required fields."
            );
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/users/invite",
                {
                    name,
                    email,
                    company,
                    use_case: useCase
                }
            );

            setMessage(
                "Thanks! We'll review your request and email you an invite code."
            );

            setName("");
            setEmail("");
            setCompany("");
            setUseCase("");
        } catch(err: Error | any) {
            if(err.response && err.response.status === 400){
                setMessage(
                    "User has already submitted a request."
                );
            }else{
                setMessage(
                    "Unable to submit request. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={pageStyle}>
            <form
                onSubmit={handleSubmit}
                style={cardStyle}
            >
                <h3 style={titleStyle}>
                    Request an Invite Code
                </h3>

                <p style={subtitleStyle}>
                    LocalBuzz is currently invite-only.
                    Tell us a little about yourself.
                </p>

                <input
                    type="text"
                    placeholder="Name *"
                    value={name}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                    style={inputStyle}
                />

                <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    style={inputStyle}
                />

                <input
                    type="text"
                    placeholder="Company (optional)"
                    value={company}
                    onChange={(e) =>
                        setCompany(e.target.value)
                    }
                    style={inputStyle}
                />

                <textarea
                    placeholder="How do you plan to use LocalBuzz? *"
                    value={useCase}
                    onChange={(e) =>
                        setUseCase(e.target.value)
                    }
                    style={textareaStyle}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...buttonStyle,
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading
                        ? "Submitting..."
                        : "Request Invite"}
                </button>

                {message && (
                    <div style={messageStyle}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}

const pageStyle = {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "32px",
    backgroundColor: "#f8f8f8"
};

const cardStyle = {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow:
        "0 4px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px"
};

const titleStyle = {
    margin: 0,
    textAlign: "center" as const,
    color: "#D2492C"
};

const subtitleStyle = {
    marginTop: 0,
    marginBottom: "8px",
    textAlign: "center" as const,
    color: "#555",
    fontSize: "14px"
};

const inputStyle = {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    outline: "none"
};

const textareaStyle = {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minHeight: "120px",
    resize: "vertical" as const,
    outline: "none"
};

const buttonStyle = {
    padding: "12px",
    backgroundColor: "#D2492C",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer"
};

const messageStyle = {
    textAlign: "center" as const,
    fontSize: "14px",
    color: "#333"
};
