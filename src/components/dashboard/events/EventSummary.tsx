import { useNavigate } from "react-router-dom";
import React, {CSSProperties, useState} from "react";

import {EventSummaryProps} from "./eventDetailTypes.interface";
import {getEventStatus, getIsExpired} from "./EventStatus";
import {api} from "../../../utils/api";
import {PlatformData} from "./platforms/platformTypes.interface";
import RestoreEventModal from "./RestoreEventModal";
import RecycleEventModal from "./RecycleEventModal";
import {FaCircleExclamation, FaCircleQuestion} from "react-icons/fa6";

import './eventSummary.css';
import Modal from "../../Modal";
import CreateEditEventForm from "../CreateEditEventForm";
import ViewEventForm from "../ViewEventForm";

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

export function EventSummary({ event, readOnly = false, reload, showRedo= false, showAsHeader=false, onEdit, onPromote }: EventSummaryProps) {

    const [showConfirm, setShowConfirm] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [showRecycleModal, setShowRecycleModal] = useState(false);
    const [imgSrc, setImgSrc] = useState("/icons8-delete-30.png");
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [showReadOnlyEventModal, setShowReadOnlyEventModal] = useState(false);

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

    function formatEventDate(dateString: string) {
        const date = new Date(dateString);

        const day = date.getDate();

        const suffix =
            day % 10 === 1 && day !== 11 ? "st" :
                day % 10 === 2 && day !== 12 ? "nd" :
                    day % 10 === 3 && day !== 13 ? "rd" :
                        "th";

        const datePart = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        const timePart = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        }).toLowerCase();

        return datePart.replace(
            `${day},`,
            `${day}${suffix} `
        ) + `, ${timePart}`;
    }

    type ImportedFromLinkProps = {
        importedFrom?: string | null;
    };

    function ImportedFromLink({ importedFrom }: ImportedFromLinkProps) {
        if (!importedFrom) return null;

        let iconSrc: string | null = null;
        let label = "Original event";

        if (importedFrom.includes("eventbrite.com")) {
            iconSrc = "/new-eventbrite-icon-orange-PNG-large-size.png";
            label = "View original Eventbrite event";
        } else if (importedFrom.includes("facebook.com")) {
            iconSrc = "/facebook-icon-png-732.png";
            label = "View original Facebook event";
        }

        if (!iconSrc) return null;

        return (
            <a
                href={importedFrom}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={iconSrc}
                    alt={label}
                    className="imported-from-icon"
                    style={{marginTop: "4px", width:"16px", height: "16px", marginRight: "4px"}}
                />
            </a>
        );
    }

    return (
        <div className={showAsHeader ? "event-header-style" : "event-list-style"}>
            <div
                style={{
                    position: "relative",
                    marginRight: "22px",
                    width: "70%",
                    paddingLeft: "36px",
                    boxSizing: "border-box",
                    backgroundColor:
                        status === "submitted" || isExpired
                            ? "#f5f5f5"
                            : "white"
                }}
            >
                <div
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}
                >
                    {event.title}
                    {event.imported_from && (
                        <>&nbsp;<ImportedFromLink importedFrom={event.imported_from}/></>
                    )}
                </div>
                <div style={{fontSize: "16px"}}>
                    {event.location_name}
                </div>

                <p style={{fontSize: "14px"}}>
                    {formatEventDate(
                        new Date(event.start_datetime).toLocaleString()
                    )}
                </p>
                { readOnly && (
                    <div className="view-readonly-icon"
                         onClick={() => setShowReadOnlyEventModal(true)}>
                        <img alt={"Read-only view"}
                            src={"/icons8-view-48.png"} style={{width: "20px", height: "20px"}}
                        />
                    </div>
                )}

                {/* Modal for read-only Event viewing */}
                {showReadOnlyEventModal && (
                    <Modal onClose={() => setShowReadOnlyEventModal(false)}>
                        <ViewEventForm
                            event={event || undefined}
                            onClose={() => {
                                setShowReadOnlyEventModal(false);
                            }}
                        />
                    </Modal>
                )}

            </div>
            <div style={{width: "60%", display: "flex", flexGrow: 1, flexDirection: "row", justifyContent: "right"}}>
                {canEdit && onEdit && !isExpired && (
                    <button className="btn btn-secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(event);
                            }}
                    >
                        <img src={"/icons8-edit-64.png"} style={{width: "24px", height: "24px"}}/>
                        Edit
                    </button>
                )}

                {/* Begin Extras Menu */}
                {!readOnly && !isExpired && (
                    <div className="more-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            style={{height: "42px"}}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMoreActions(prev => !prev);
                            }}
                        >
                            <img
                                src="/icons8-more-50.png"
                                style={{
                                    width: "16px",
                                    height: "16px"
                                }}
                            />
                        </button>

                        {showMoreActions && (
                            <div
                                className="more-actions-menu"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {!readOnly && !isExpired && (
                                    <button
                                        title="Make duplicate of this Event"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowMoreActions(false);
                                            handleClone();
                                        }}
                                    >
                                        <img
                                            src="/icons8-clone-24.png"
                                            style={{
                                                width: "24px",
                                                height: "24px"
                                            }}
                                        />
                                        Clone
                                    </button>
                                )}

                                {!readOnly && (
                                    <button
                                        className="btn btn-danger"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMoreActions(false);
                                            setShowConfirm(true);
                                        }}
                                    >
                                        <img
                                            src={imgSrc}
                                            alt="delete"
                                            onMouseOver={() =>
                                                setImgSrc("/icons8-delete-white.png")
                                            }
                                            onMouseOut={() =>
                                                setImgSrc("/icons8-delete-30.png")
                                            }
                                            style={{
                                                width: "24px",
                                                height: "24px"
                                            }}
                                        />
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {/* End Extras Menu */}

                {!readOnly && !isExpired && (
                    <button
                        title="Promote Event to all Platforms"
                        className="btn btn-primary-greater" disabled={isExpired} onClick={() => onPromote? onPromote(event) : null}
                        style={{marginLeft: "20", fontSize: "16px"}} >
                        <img src={"/icons8-play-50.png"} style={{
                            width: "24px",
                            height: "24px"
                        }}/>
                        <b>Promote</b>
                    </button>
                )}


                {readOnly && showRedo && (
                    <>
                        <p style={{
                            fontSize: "14px",
                            marginTop: "10px",
                            marginRight: "20px"
                        }}>Completed {getNewestPublishDate(event.platforms)?.toLocaleString("en-US",
                            {
                                month: "numeric",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit"
                            }
                        )}</p>
                        <button className="btn btn-primary" onClick={() => setShowRecycleModal(true)}>
                            <img src={"/icons8-recycle-32.png"} style={{width: "24px", height: "24px"}}/>Recycle
                        </button>
                    </>
                )}
                {isExpired && !readOnly && (
                    <>
                        <button className="btn btn-primary" onClick={() => setShowRestoreModal(true)}>
                            <img src={"/icons8-redo-48.png"} style={{width: "24px", height: "24px"}}/>Restore
                        </button>
                        <button className="btn btn-danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowConfirm(true);
                                }}
                        >
                            <img src={imgSrc} alt={"delete"}
                                 onMouseOver={() => setImgSrc('/icons8-delete-white.png')}
                                 onMouseOut={() => setImgSrc('/icons8-delete-30.png')}
                                 style={{width: "24px", height: "24px"}}/>Delete
                        </button>
                    </>
                )}
                {showConfirm && (
                    <div style={overlayStyle}>
                        <div style={modalStyle}>
                            <h3><FaCircleExclamation/>&nbsp;&nbsp;Delete Event?</h3>
                            <h4>{event.title}</h4>
                            <>This action cannot be undone.</>

                            <div style={{
                                display: "flex",
                                alignContent: "center",
                                justifyContent: "center",
                                gap: "10px",
                                marginTop: "10px"
                            }}>
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
