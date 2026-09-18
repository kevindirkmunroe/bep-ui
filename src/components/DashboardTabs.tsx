import { NavLink, useParams } from "react-router-dom";
import "./DashboardTabs.css";

export default function DashboardTabs() {
    const { userId } = useParams<{ userId: string }>();

    if (!userId) {
        return null;
    }

    return (
        <div className="dashboard-tab-bar">
            <NavLink
                to={`/dashboard/${userId}/events`}
                className="dashboard-tab active"
            >
                Current
            </NavLink>

            <NavLink
                to={`/dashboard/${userId}/history`}
                className="dashboard-tab"
            >
                History
            </NavLink>
        </div>
    );
}
