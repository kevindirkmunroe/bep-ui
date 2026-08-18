import { Link, useLocation } from "react-router-dom";

export default function ViewToggle() {
    const location = useLocation();

    const isCalendar = location.pathname.endsWith("/calendar");

    const listPath = isCalendar
        ? location.pathname.replace(/\/calendar$/, "")
        : location.pathname;

    const calendarPath = isCalendar
        ? location.pathname
        : `${location.pathname}/calendar`;

    return (
        <div className="view-toggle" style={{display: "flex", justifyContent: "flex-start", marginLeft: "20px"}}>
            {isCalendar ? (
                <Link to={listPath}>List</Link>
            ) : (
                <span>List</span>
            )}

            <span> &nbsp;|&nbsp; </span>

            {isCalendar ? (
                <span>Calendar</span>
            ) : (
                <Link to={calendarPath}>Calendar</Link>
            )}
        </div>
    );
}
