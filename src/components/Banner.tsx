import {Tooltip} from "react-tooltip";

import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";
import CalendarDate from "../utils/CalendarDate";
import React, {useState} from "react";
import Modal from "./Modal";
import ChangePasswordForm from "./ChangePasswordForm";
import {api} from "../utils/api";
import BaseDialog, {DialogState} from "./BaseDialog";

export function Banner() {
    const { setUser, user } = useUser();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [dialog, setDialog] = useState<DialogState>(null);

    const handleLogout = () => {
        setDialog({
            type: "confirm",
            title: "Logout",
            message: "Are you sure you want to logout?",
            confirmLabel: "Logout",
            onConfirm: async () => {
                await api.post('/users/logout');
                setUser(null);
                navigate("/");
            }
        });
    };

    const handleAbout = () => {
        navigate("/about");
    }

    const handleAdmin = () => {
        navigate("/admin");
    }

    const adminList = import.meta.env.VITE_ADMIN_EMAIL_LIST ?
        import.meta.env.VITE_ADMIN_EMAIL_LIST.split(',') : [];

    const handleChangePassword = async () => {
        setShowForm(true);
    }

    const handleLandingClick = () => {
        window.location.href = import.meta.env.VITE_LANDING_PAGE_URL;
    };

    const userInfoStyle = {
        marginLeft: "auto",
        color: "#D2492C",
        fontSize: "16px",
        fontWeight: 500
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
            <Tooltip id="my-tooltip" />
            <div style={{display: "flex", alignItems: "center", gap: "2px", cursor: "pointer"}}
                 onClick={handleLandingClick}>
                <img
                    src="/airhorn.events.png"
                    alt="Logo"
                    style={{
                        height: "40px",
                        width: "auto",
                        objectFit: "contain"
                    }}
                />
                <strong style={{marginLeft: "2px", fontSize: "24px"}}><b
                    style={{color: "black"}}>Airhorn</b>.events</strong>
            </div>

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
            {user && (
                <div style={{display: "flex", alignItems: "right", marginRight: "50px", marginTop: "16px"}}>
                    <img
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Change Password"
                        onClick={handleChangePassword}
                        style={{width: "22px", height: "22px", verticalAlign: "text-bottom", cursor: "pointer"}} src={"/icons8-user-male-30.png"} alt={'.'}
                    />&nbsp;
                    {user?.firstName && (
                        <div style={userInfoStyle}>
                            {user.firstName}
                            {user.company && ` | ${user.company}`}
                        </div>
                    )}
                    <div style={{marginLeft: '28px', marginTop: "1px", fontSize: "14px" , cursor: "pointer"}}>
                        <p onClick={handleAbout}>About</p>
                    </div>
                    <div style={{marginLeft: '16px', marginRight: '32px', marginTop: "1px", fontSize: "14px", cursor: "pointer"}}>
                        <p onClick={handleLogout}>Logout</p>
                    </div>
                    {adminList.includes(user.email) && (
                        <div style={{
                            marginLeft: '4px',
                            marginRight: '34px',
                            marginTop: "1px",
                            fontSize: "14px",
                            cursor: "pointer"
                        }}>
                            <p onClick={handleAdmin}>🔥Admin</p>
                        </div>
                    )}
                    <div>
                        <CalendarDate/>
                    </div>
                    {showForm && (
                        <div>
                            <Modal onClose={() => setShowForm(false)}>
                                <ChangePasswordForm user={user} />
                            </Modal>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
