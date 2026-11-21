import { NavLink, useParams } from "react-router-dom";
import "./dashboardTabs.css";
import React from "react";

export default function DashboardTabs() {
    const { userId } = useParams<{ userId: string }>();

    if (!userId) {
        return null;
    }

    return (
        <div className="dashboard-tab-bar">
            <NavLink
                to={`/dashboard/${userId}/events`}
                className="dashboard-tab"
            >
                <img alt={"wtf"} style={{fontSize: "15px", width: "20px", height: "20px"}}
                     src={"/icons8-home-48.png"}/><br/>Home
            </NavLink>

            <NavLink
                to={`/dashboard/${userId}/history`}
                className="dashboard-tab"
            >
                <img alt={"wtf"} style={{fontSize: "15px",width: "20px", height: "20px"}}
                     src={"/icons8-history-48.png"}/><br/>History
            </NavLink>
            <NavLink
                to={`/dashboard/${userId}/favorites`}
                className="dashboard-tab"
            >
                <img alt={"wtf"} style={{fontSize: "15px",width: "24px", height: "24px"}}
                     src={"/icons8-tools-30.png"}/><br/>Settings
            </NavLink>
        </div>
    );
}
