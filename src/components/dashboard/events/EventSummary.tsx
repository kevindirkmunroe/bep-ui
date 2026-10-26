import React, {useRef, useState} from "react";

import {EventDetail, EventSummaryProps} from "./eventDetailTypes.interface";
import {getEventStatusFromPlatforms, getIsExpired} from "./EventStatus";
import {api} from "../../../utils/api";
import {FaCircleExclamation} from "react-icons/fa6";
import { createPortal } from "react-dom";


import './eventSummary.css';
import {formatDateLocal, formatDateTimeLocal} from "../../../utils/DateTime";

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

const ensureDollar = (str: string) => str.startsWith('\$') ? str : `$${str}`;

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

export function EventSummary({ event, reload, showRedo= false, showAsHeader=false, onEdit, onView, onPromote, onViewEventStatus }: EventSummaryProps) {

    const [showConfirm, setShowConfirm] = useState(false);
    const [imgSrc, setImgSrc] = useState("/icons8-delete-30.png");
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleClone = async () => {
        await api.post(`/events/${event.event_id}/clone`);
        await reload?.();
    };

    const handleDelete = async () => {
        await api.delete(`/events/${event.event_id}`);
        await reload?.();
    };

    const status = getEventStatusFromPlatforms(event);
    const isExpired = getIsExpired(event);
    const canEdit = status === "not_started" || status === "in_progress";

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

    const handleListedEventClicked = () => {
        if(canEdit && onEdit && !isExpired && !event.is_locked){
            onEdit(event);
        }else if(onView){
            onView(event);
        }
    }

    const getEventColor = (event: EventDetail, status: string, isExpired: boolean) => {
        if(status === "submitted"){
            if(isExpired){
                return '#8F9E8B';
            }
            return 'green';
        }else{
            if(!event.is_locked){
                return '#A9A9A9';
            }else{
                if(isExpired){
                    return '#D19187';
                }
                return '#D2492C';
            }
        }
    }


    const [showExpandedMenu, setShowExpandedMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        left: 0
    });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const toggleExpandedMenu = () => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();

        setMenuPosition({
            top: rect.bottom + 6,
            left: rect.right - 130
        });

        setShowExpandedMenu(!showExpandedMenu);
    };

    return (
        <div className={showAsHeader ? "event-header-style" : "event-list-style"}>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    paddingLeft: "8px",
                    boxSizing: "border-box",
                    backgroundColor: getEventColor(event, status, isExpired),
                    color: "white",
                    borderRadius: "8px"
            }}
            >
                {/* Event Title */}
                <div
                    className="event-summary-header"
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}>
                    {/* Column 1: image */}
                    <div onClick={() => handleListedEventClicked()} className="event-summary-imported">
                        { event.image ? (
                            <img src={event.image} alt="Image" style={{
                                width: "60px",
                                height: "40px",
                                padding: "8px",
                                marginLeft: "20px",
                                marginRight: "4px",
                                borderRadius: "6px",
                                objectFit: "cover" }} />
                        ) : (
                            <img src={"/icons8-image-64.png"} alt="No Image" style={{
                                width: "32px",
                                height: "28px",
                                marginLeft: "8px",
                                borderRadius: "6px",
                                objectFit: "contain" }} />
                        )
                        }
                    </div>

                    {/* Column 2: date */}
                    <div onClick={() => handleListedEventClicked()} style={{fontSize: "16px", fontFamily: "Arial, sans-serif", alignItems: "flex-start"}}>
                        {formatDateLocal(event.start_datetime)}
                    </div>

                    {/* Column 3: title */}
                    <div onClick={() => handleListedEventClicked()} style={{fontSize: "16px", fontFamily: "Arial, sans-serif"}} className="event-summary-title">
                        {event.title}
                    </div>

                    {/* Column 4: toggle */}
                    <button
                        style={{marginLeft: "8px", paddingRight: "16px"}}
                        type="button"
                        onClick={() => setExpanded(prev => !prev)}
                        className="event-summary-toggle"
                        aria-expanded={expanded}>
                        {expanded ? "▼" : "▲"}
                    </button>

                </div>

                {/* Toggleable Event details */}
                {expanded && (
                    <div className="event-summary-details">
                        <div style={{fontSize: "16px"}}>
                            {event.location_name}
                        </div>
                        <p style={{fontSize: "14px"}}>
                            {formatEventDate(
                                new Date(event.start_datetime).toLocaleString()
                            )}
                        </p>
                        <p style={{fontSize: "14px"}}>
                            {event.price ? `${ensureDollar(event.price)}` : 'Free/Unspecified'}
                        </p>
                        <div>
                            {event.imported_from && (
                                <ImportedFromLink importedFrom={event.imported_from}/>
                            )}
                        </div>
                    </div>
                )}

            </div>
            <div style={{width: "32%", display: "flex", marginLeft: "4px", flexGrow: 1, flexDirection: "row", justifyContent: "right"}}>

                {/* New or Active + In Progress */}
                {!isExpired && status !== 'submitted' && (
                    <button
                        title={event.is_locked? "Promote this Event to all Platforms" : "Start Event Promotion process"}
                        className={event.is_locked ? "btn btn-secondary-greater" : "btn btn-primary-greater"}
                        onClick={() => onPromote? onPromote(event) : null}
                        style={{marginLeft: "20", fontSize: "16px"}} >
                        <img src={event.is_locked ? "/icons8-megaphone-64.png" : "/icons8-lightning-64-white.png"} style={{
                                width: "24px",
                                height: "24px"
                            }}/>
                        <b>{event.is_locked ? `Promote...` : `Activate...`}</b>
                    </button>
                )}

                {/* Active + Published */}
                {!isExpired && status === 'submitted' && (
                    <button
                        title={"View Submitted Event"}
                        className={"btn btn-secondary-greater"}
                        onClick={() => onViewEventStatus? onViewEventStatus(event) : null}
                        style={{marginLeft: "20", fontSize: "16px"}} >
                        {event.is_locked && (
                            <img src={"/icons8-newspaper-48.png"} style={{
                                width: "24px",
                                height: "24px"
                            }}/>
                        )}
                        <b>View Live</b>
                    </button>
                )}

                {/* Expired */}
                {isExpired && (
                    <button
                        title={"View Expired Event"}
                        className={"btn btn-secondary"}
                        onClick={() => onViewEventStatus? onViewEventStatus(event) : null}
                        style={{marginLeft: "20", fontSize: "16px"}} >
                        <img src={"/icons8-history-48.png"} style={{
                            width: "24px",
                            height: "24px"
                        }}/>
                        <b>View</b>
                    </button>
                )}


                {/* Begin Extras Menu */}
                <div className="more-actions">
                    <>
                        <button
                            ref={buttonRef}
                            onClick={toggleExpandedMenu}
                            className="btn btn-secondary"
                            style={{height: "42px"}}
                        >
                            <img
                                src="/icons8-hamburger-menu-64.png"
                                style={{
                                    width: "16px",
                                    height: "16px"
                                }}
                            />
                        </button>

                        {showExpandedMenu &&
                            createPortal(
                                <div
                                    className="more-actions-menu"
                                    style={{
                                        top: menuPosition.top,
                                        left: menuPosition.left,
                                        width: '130px'
                                    }}
                                    onMouseLeave={toggleExpandedMenu}
                                >
                                    {canEdit && onEdit && !isExpired && !event.is_locked && (
                                        <button className="btn btn-secondary"
                                                disabled={event.is_locked}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEdit(event);
                                                }}
                                        >
                                            <img src={"/icons8-edit-64.png"} style={{width: "24px", height: "24px"}}/>
                                            Edit
                                        </button>
                                    )}
                                    {onView && (
                                        <button className="btn btn-secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onView(event);
                                                }}
                                        >
                                            <img src={"/icons8-preview-48-coral.png"} style={{width: "24px", height: "24px"}}/>
                                            View
                                        </button>
                                    )}
                                    {
                                        <button
                                            title="Make duplicate of this Event"
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setShowExpandedMenu(false);
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
                                    }
                                    {
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
                                    }
                                </div>,
                                document.body
                            )
                        }
                    </>
                </div>
                {/* End Extras Menu */}

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
            </div>
        </div>
    );
}
