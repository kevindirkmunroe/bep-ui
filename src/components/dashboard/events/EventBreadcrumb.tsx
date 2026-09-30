import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";
import {EventDetail} from "./eventDetailTypes.interface";

interface EventBreadcrumbProps {
    event: EventDetail | null;
    eventCount: number;
    promoteEventCount: number;
}

const BREADCRUMB_MAX_STEP_LENGTH = 34;

export default function EventBreadcrumb({
                                            event,
                                            eventCount,
                                            promoteEventCount,
                                        }: EventBreadcrumbProps) {
    const { userId, eventId } = useParams();
    const location = useLocation();
    const TRUNCATE_LIMIT = 22;

    const eventsPath = `/dashboard/${userId}/events`;

    const onPromotedEventsPage =
        location.pathname === `${eventsPath}/${eventId}`;

    const onLogPage =
        location.pathname === `${eventsPath}/${eventId}/promoted`;

    function truncateString(str: string | undefined, limit: number, ending: string = '...'): string {
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
            <Link to={eventsPath}>
                <div style={{display: "flex", flexDirection: "row"}}>
                <img
                    src="/icons8-home-48.link.png"
                    alt="Home"
                    style={{
                        height: "20px",
                        width: "auto",
                        marginLeft: "10px",
                        marginRight: "4px",
                        objectFit: "contain",
                    }}
                />
                    <b>All Events</b>
                    <strong style={{fontSize: "14px"}}>({eventCount})</strong>
                </div>
            </Link>

            {eventId && (
                <>
                <span><b>&gt;</b></span>

                {onPromotedEventsPage ? (
                    <>
                        <b>Tracked Promoted Events</b>
                        <strong style={{fontSize: "14px"}}>{`(${promoteEventCount})`}</strong>
                        <span><b>&gt;</b></span>
                        <Link to={`${eventsPath}/${event?.event_id}/promoted`}>
                            <b>Results for <i>{truncateString(event?.title, TRUNCATE_LIMIT)}</i></b>
                        </Link>
                    </>

                ) : (
                    <>
                        <Link to={`${eventsPath}/${event?.event_id}`}>
                            <b>Tracked Promoted Events</b>
                            <strong style={{fontSize: "14px"}}>{`(${promoteEventCount})`}</strong>
                        </Link>
                    </>
                )}
                </>
            )}

            {onLogPage && (
                <div style={{display: "flex", flexDirection: "row", fontSize: "18px"}}>
                    <span><b>&gt;</b></span>
                    <b>&nbsp;Results for <i>{truncateString(event?.title, TRUNCATE_LIMIT)}</i></b>
                </div>
            )}
        </div>
    );
}
