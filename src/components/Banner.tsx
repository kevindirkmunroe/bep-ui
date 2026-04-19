import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import CalendarDate from "../utils/CalendarDate";

export function Banner() {
    const { setUserId } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        setUserId(null);
        navigate("/login");
    };

    return (
        <div style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#fff",
            color: "#D2492C",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }} onClick={() => navigate("/")}>
                <img
                    src="/bep-logo-transparent.png"
                    alt="Logo"
                    style={{
                        height: "54px",
                        width: "auto",
                        objectFit: "contain"
                    }}
                />                <strong>BAY Event Promoter</strong>
            </div>
            <div style={{display: "flex", alignItems: "right", marginRight: "50px"}}>
                <button onClick={handleLogout}>Logout</button>
                <CalendarDate />
            </div>
        </div>
    );
}
