import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

import {EventSummaryProps} from "./eventDetailTypes.interface";

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

export function EventSummary({ event, readOnly = false, reload, showRedo= false }: EventSummaryProps) {
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);

    const handleClick = () => {
        navigate(`/events/${event.event_id}`);
    };

    const handleDelete = async () => {
        await axios.delete(`/events/${event.event_id}`);
        await reload?.();
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <h2>{event.title}</h2>
            <p>{event.location_name}</p>
            <p>{new Date(event.start_datetime).toLocaleString()}</p>
            {!readOnly && (
                <button onClick={handleClick}>📢 Promote</button>
            )}
            {readOnly && showRedo && (
                <button onClick={handleClick}>↪️ Redo Submit</button>
            )}
            {!readOnly && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirm(true);
                    }}
                    style={{ color: "red" }}
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
                            <button onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>

                            <button
                                style={{ color: "white", background: "red" }}
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
