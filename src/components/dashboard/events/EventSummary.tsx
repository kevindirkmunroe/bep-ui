import axios from "axios";
import { useNavigate } from "react-router-dom";
import {CSSProperties, useState} from "react";

import {EventSummaryProps} from "./eventDetailTypes.interface";
import {getEventStatus, getIsExpired} from "./EventStatus";

const overlayStyle = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
};

const modalStyle = {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    minWidth: "300px"
};

const eventListStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    padding: 5,
    borderRadius: '10px',
    width: "80%",
    border: '2px solid #D2492C'
};

const eventHeaderStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
}

export function EventSummary({ event, readOnly = false, reload, showRedo= false, showAsHeader=false, onEdit }: EventSummaryProps) {
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);

    const handleClick = () => {
        navigate(`/events/${event.event_id}`);
    };

    const handleDelete = async () => {
        await axios.delete(`/events/${event.event_id}`);
        await reload?.();
    };

    const status = getEventStatus(event);
    const isExpired = getIsExpired(event);
    const canEdit = status === "not_started" || status === "in_progress";

    return (
        <div style={ showAsHeader ? eventHeaderStyle : eventListStyle}>
            <div style={{marginRight: "20px", width: "50%"}}>
                <h2>{event.title}</h2>
                <p>{event.location_name}</p>
                <p>{new Date(event.start_datetime).toLocaleString()}</p>
            </div>
            <div style={{width: "60%", display: "flex", flexGrow: 1, flexDirection: "row", justifyContent: "right"}}>
                {!readOnly && (
                    <button className="btn btn-primary" disabled={isExpired} onClick={handleClick}>📢 Promote</button>
                )}
                {canEdit && onEdit &&(
                    <button className="btn btn-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(event);
                            }}
                    >
                        📑 Edit
                    </button>
                )}
                {readOnly && showRedo && !isExpired && (
                    <button className="btn btn-primary" onClick={handleClick}>↪️ Redo Submit</button>
                )}
                {!readOnly && (
                    <button className="btn btn-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                    >
                        🗑️ Delete
                    </button>
                )}
                {showConfirm && (
                    <div style={overlayStyle}>
                        <div style={modalStyle}>
                            <h3>Delete Event?</h3>
                            <p>This action cannot be undone.</p>

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                                    Cancel
                                </button>

                                <button className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
