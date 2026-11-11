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

    const chartStyle = {
        marginLeft: "10px",
        marginTop: "7px",
        width: "12px",
        height: "12px",
        color: "gray",
    }

    return (
        <div>
            <div className="view-toggle" style={{fontSize: "14px", display: "flex", justifyContent: "flex-start", marginLeft: "12px"}}>
                {isCalendar ? (
                    <Link to={listPath}>List</Link>
                ) : (
                    <span><b>List</b></span>
                )}

                <span> &nbsp;|&nbsp; </span>

                {isCalendar ? (
                    <span><b>Calendar</b></span>
                ) : (
                    <Link to={calendarPath}>Calendar</Link>
                )}
                <div style={{fontSize: "14px", display: "flex", justifyContent: "flex-start", marginLeft: "4px"}}>
                    <div style={{...chartStyle, border: "1px solid black", backgroundColor: "#F5F5F6"}}></div>&nbsp;New/Inactive
                    <div style={{...chartStyle, backgroundColor: "#D2492C"}}></div>&nbsp;Active
                    <div style={{...chartStyle, backgroundColor: "orange"}}></div>
                    <div style={{...chartStyle, marginLeft: "1px", backgroundColor: "green"}}></div>&nbsp;Live
                </div>
            </div>
        </div>
    );
}
