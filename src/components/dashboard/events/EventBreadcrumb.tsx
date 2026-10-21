import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";
import {EventDetail} from "./eventDetailTypes.interface";

interface EventBreadcrumbProps {
    event: EventDetail | null;
    eventCount: number;  // TODO: rename to activeEventCount
    totalEventCount: number;
    promoteEventCount: number;
}

export default function EventBreadcrumb({
                                            event,
                                            totalEventCount,
                                            eventCount,
                                            promoteEventCount,
                                        }: EventBreadcrumbProps) {
    const { userId, eventId } = useParams();
    const location = useLocation();
    const TRUNCATE_LIMIT = 40;

    const eventsPath = `/dashboard/${userId}/events`;

    const onHomePage =
        location.pathname === eventsPath || location.pathname === `${eventsPath}/calendar`;

    const onPromotedEventsPage =
        location.pathname === `${eventsPath}/${eventId}`;

    const onEventStatusPage =
        location.pathname === `${eventsPath}/${eventId}/status`;

    const onLogPage =
        location.pathname === `${eventsPath}/${eventId}/promoted`;

    function truncateString(str: string | undefined, limit: number = 80, ending: string = '...'): string {
        if(!str){
            return "unknown"
        }

        if (str.length <= limit) {
            return str;
        }
        return str.slice(0, limit - ending.length) + ending;
    }

    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginBottom: "20px",
            }}
        >
            {/* Anchor */}
            <Link to={eventsPath} style={onHomePage ? {color: "#E27C68", fontSize: "20px"} : {}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <img
                        src={onHomePage ? "/icons8-home-48.png" : "/icons8-home-48.link.png"}
                        alt="Home"
                        style={{
                            height: "20px",
                            width: "auto",
                            marginLeft: "10px",
                            marginTop: "3px",
                            marginRight: "4px",
                            objectFit: "contain"
                        }}
                    />
                    <b>All Events</b>
                    <div style={{paddingLeft: "2px", fontSize: "16px"}}>({totalEventCount} | {eventCount} Scheduled)</div>
                </div>
            </Link>

            {eventId && (
                <>
                    <span><b>&gt;</b></span>

                    {onEventStatusPage && (
                        <div style={{
                            color: "#E27C68",
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            fontSize: "20px",
                            display: "flex",
                            flexDirection: "row"
                        }}>
                            <b style={{
                                marginLeft: "3px",
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                color: "#E27C68"
                            }}>&nbsp;"<i>{truncateString(event?.title)}</i>"</b>
                        </div>
                    )}

                    {onPromotedEventsPage ? (
                        <>
                            <div style={{
                                color: "#E27C68",
                                paddingLeft: "5px",
                                paddingRight: "5px",
                                fontSize: "20px",
                                display: "flex",
                                flexDirection: "row"
                            }}>
                                <b>Promoted</b>
                                <div style={{paddingLeft: "2px", fontSize: "16px"}}>{`(${promoteEventCount})`}</div>
                            </div>
                            <span>&gt;</span>
                            <Link to={`${eventsPath}/${event?.event_id}/promoted`}>
                               Published&nbsp;"<i>{truncateString(event?.title, TRUNCATE_LIMIT)}</i>"
                            </Link>
                        </>

                    ) : (
                        <>
                            {!onEventStatusPage && (
                                <Link to={`${eventsPath}/${event?.event_id}`}>
                                <b>Promoted</b>
                                <strong style={{fontSize: "14px"}}>{`(${promoteEventCount})`}</strong>
                                </Link>)}
                        </>
                    )}
                </>
            )}

            {onLogPage && (
                <div style={{display: "flex", flexDirection: "row", fontSize: "20px"}}>
                    <span>&gt;</span>
                    <b style={{marginLeft: "3px", paddingLeft: "5px", paddingRight: "5px", color: "#E27C68"}}>Published&nbsp;"<i>{truncateString(event?.title, TRUNCATE_LIMIT)}</i>"</b>
                </div>
            )}
        </div>
    );
}
