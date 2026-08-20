import { useNavigate } from "react-router-dom";
import React, {CSSProperties, useState} from "react";

import {EventSummaryProps} from "./eventDetailTypes.interface";
import {getEventStatus, getIsExpired} from "./EventStatus";
import {api} from "../../../utils/api";
import {PlatformData} from "./platforms/platformTypes.interface";
import RestoreEventModal from "./RestoreEventModal";
import RecycleEventModal from "./RecycleEventModal";
import {FaCircleExclamation, FaCircleQuestion} from "react-icons/fa6";

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
    width: "95%",
    border: '1px solid #d3d3d3'
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
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showRecycleModal, setShowRecycleModal] = useState(false);
    const [imgSrc, setImgSrc] = useState("/icons8-delete-30.png");
    const getNewestPublishDate = (platforms: PlatformData[]): Date | undefined => {
        const dates = platforms
            .map(p => p.date_published)
            .filter((d): d is string => !!d)
            .map(d => new Date(d));

        if (dates.length === 0) {
            return undefined;
        }

        return new Date(
            Math.max(...dates.map(d => d.getTime()))
        );
    };

    const handlePromote = () => {
        navigate(`/ui/events/${event.event_id}`);
    };

    const handleClone = async () => {
        console.log(`cloning event: ${event.event_id}`);
        await api.post(`/events/${event.event_id}/clone`);
        await reload?.();
    };

    const handleDelete = async () => {
        await api.delete(`/events/${event.event_id}`);
        await reload?.();
    };

    const status = getEventStatus(event);
    const isExpired = getIsExpired(event);
    const canEdit = status === "not_started" || status === "in_progress";

    return (
        <div style={ showAsHeader ? eventHeaderStyle : eventListStyle}>
            <div style={{marginRight: "20px", width: "50%", backgroundColor: status === 'submitted' || isExpired ? "#f5f5f5" : 'white'}}>
                <div style={{fontSize: "16px", fontWeight:"bold"}}>{event.title}</div>
                <div style={{fontSize: "14px"}}>{event.location_name}</div>
                <div><p style={{fontSize: "14px"}}>{new Date(event.start_datetime).toLocaleString()}</p></div>
            </div>
            <div style={{width: "60%", display: "flex", flexGrow: 1, flexDirection: "row", justifyContent: "right"}}>
                {!readOnly && !isExpired && (
                    <button
                        title="Promote Event to all Platforms"
                        className="btn btn-primary-greater" disabled={isExpired} onClick={handlePromote}>
                        <img src={"/icons8-commercial-24.png"} />
                        Promote
                    </button>
                )}
                {canEdit && onEdit && !isExpired &&(
                    <button className="btn btn-secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(event);
                            }}
                    >
                        <img src={"/icons8-edit-64.png"} style={{width:"24px", height:"24px"}} />
                        Edit
                    </button>
                )}
                {!readOnly && !isExpired && (
                    <button
                        title="Make duplicate of this Event"
                        className="btn btn-secondary" onClick={handleClone}>
                    <img src={"/icons8-clone-24.png"} style={{width:"24px", height:"24px"}} />Clone
                </button>
                )}
                {readOnly && showRedo && (
                    <>
                        <p style={{fontSize: "14px", marginTop: "10px", marginRight: "20px"}}>Completed {getNewestPublishDate(event.platforms)?.toLocaleString()}</p>
                        <button className="btn btn-primary" onClick={() => setShowRecycleModal(true)}>
                            <img src={"/icons8-recycle-32.png"} style={{width:"24px", height:"24px"}} />Recycle
                        </button>
                    </>
                )}
                {isExpired && !readOnly && (
                    <>
                        <button className="btn btn-primary" onClick={() => setShowRestoreModal(true)}>
                            <img src={"/icons8-redo-48.png"} style={{width:"24px", height:"24px"}} />Restore
                        </button>
                    </>
                )}
                {!readOnly && (
                    <button className="btn btn-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirm(true);
                            }}
                    >
                        <img src={imgSrc} alt={"delete"}
                             onMouseOver={() => setImgSrc('/icons8-delete-white.png')}
                             onMouseOut={() => setImgSrc('/icons8-delete-30.png')}
                             style={{width:"24px", height:"24px"}} />Delete
                    </button>
                )}
                {showConfirm && (
                    <div style={overlayStyle}>
                        <div style={modalStyle}>
                            <h3><FaCircleExclamation/>&nbsp;&nbsp;Delete Event?</h3>
                            <h4>{event.title}</h4>
                            <>This action cannot be undone.</>

                            <div style={{ display: "flex", alignContent: "center", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
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
                {showRestoreModal && (
                    <RestoreEventModal
                        name={event.title}
                        onCancel={() => setShowRestoreModal(false)}
                        onRestore={async (newDate) => {
                            console.log(`[EventSummary] restore event=${JSON.stringify(event)}`);

                            await api.patch(`/events/${event.event_id}/restore`, {
                                start_date: newDate
                            });

                            setShowRestoreModal(false);
                            await reload?.();
                        }}
                    />
                )}
                {showRecycleModal && (
                    <RecycleEventModal
                        name={event.title}
                        onCancel={() => setShowRecycleModal(false)}
                        onRecycle={async (newDate) => {
                            await api.post(`/events/${event.event_id}/clone`, {
                                start_date: newDate
                            });

                            setShowRecycleModal(false);
                            window.location.reload();
                            await reload?.();
                        }}
                    />
                )}
            </div>
        </div>
    );
}
