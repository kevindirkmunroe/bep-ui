import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import CalendarDate from "../utils/CalendarDate";

export function Banner() {
    const { setUserId, userId } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        setUserId(null);
        navigate("/");
    };

    // If user is already logged in, show the dashboard, otherwise back to Welcome page...
    const handleHomeClick = () => {
        if (userId) {
            navigate(`/dashboard/${userId}/events`);
        } else {
            navigate("/");
        }
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }} onClick={handleHomeClick}>
                <img
                    src="/bep-logo-transparent.png"
                    alt="Logo"
                    style={{
                        height: "54px",
                        width: "auto",
                        objectFit: "contain"
                    }}
                />
                <strong>BayArea Event Promoter</strong>
            </div>
            {userId && (
                <div style={{display: "flex", alignItems: "right", marginRight: "50px"}}>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                        <img style={{width: "18px", height: "18px", verticalAlign: "text-bottom"}} src={"/icons8-user-male-30.png"} alt={'.'} />&nbsp;
                        Logout
                    </button>
                    <div style={{marginTop: "6px"}}>
                        <CalendarDate />
                    </div>
                </div>
            )}
        </div>
    );
}
