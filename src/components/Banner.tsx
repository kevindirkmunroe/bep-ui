import {Tooltip} from "react-tooltip";
import axios from "axios";

import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import CalendarDate from "../utils/CalendarDate";
import {useState} from "react";
import CreateEventForm from "./dashboard/CreateEventForm";
import Modal from "./Modal";
import ChangePasswordForm from "./ChangePasswordForm";


export function Banner() {
    const { setUser, user } = useUser();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        await axios.post('/users/logout');
        setUser(null);
        navigate("/");
    };

    const handleChangePassword = async () => {
        setShowForm(true);
    }

    // If user is already logged in, show the dashboard, otherwise back to Welcome page...
    const handleHomeClick = () => {
        if (user) {
            navigate(`/dashboard/${user.userId}/events`);
        } else {
            navigate("/");
        }
    };

    const userInfoStyle = {
        marginLeft: "auto",
        color: "#D2492C",
        fontSize: "16px",
        fontWeight: 500
    };

    console.log(`user: ${JSON.stringify(user)}`);

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
            <Tooltip id="my-tooltip" />
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }} onClick={handleHomeClick}>
                <img
                    src="/localbuzz2.png"
                    alt="Logo"
                    style={{
                        height: "54px",
                        width: "auto",
                        objectFit: "contain"
                    }}
                />
                <strong style={{fontSize: "24px"}}>LocalBuzz</strong>
            </div>
            {user && (
                <div style={{display: "flex", alignItems: "right", marginRight: "50px", marginTop: "16px"}}>
                    <img
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Change Password"
                        onClick={handleChangePassword}
                        style={{width: "22px", height: "22px", verticalAlign: "text-bottom"}} src={"/icons8-user-male-30.png"} alt={'.'}
                    />&nbsp;
                    {user?.firstName && (
                        <div style={userInfoStyle}>
                            {user.firstName}
                            {user.company && ` | ${user.company}`}
                        </div>
                    )}
                    <div style={{marginLeft: '10px'}}>
                        <button className="btn btn-secon dary" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                    <div>
                        <CalendarDate />
                    </div>
                    {showForm && (
                        <div>
                            <Modal onClose={() => setShowForm(false)}>
                                <ChangePasswordForm />
                            </Modal>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
