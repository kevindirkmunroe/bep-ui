import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";

interface EventBreadcrumbProps {
    eventTitle?: string;
    eventCount: number;
    deliveryCount?: number;
}

const BREADCRUMB_MAX_STEP_LENGTH = 38;

export default function EventBreadcrumb({
                                            eventTitle,
                                            eventCount,
                                            deliveryCount,
                                        }: EventBreadcrumbProps) {
    const { userId, eventId } = useParams();
    const location = useLocation();

    const eventsPath = `/dashboard/${userId}/events`;

    const onEventPage =
        location.pathname === `${eventsPath}/${eventId}`;;

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
                marginBottom: "20px"
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
                    <b>All</b>
                    <strong style={{fontSize: "14px"}}>({eventCount})</strong>
                </div>
            </Link>

            {eventId && (
                <>
                <span>&gt;</span>

                {onEventPage ? (
                    <>
                        <strong>{truncateString(eventTitle, BREADCRUMB_MAX_STEP_LENGTH) ?? "Event"}</strong>
                        <span>&gt;</span>
                        <Link to={`${eventsPath}/${eventId}/promoted`}>
                            <b>Delivered</b>
                            <strong style={{fontSize: "14px"}}>({deliveryCount})*</strong>
                        </Link>
                    </>

                ) : (
                    <>
                        <Link to={`${eventsPath}/${eventId}`}>
                            <strong>{truncateString(eventTitle, BREADCRUMB_MAX_STEP_LENGTH) ?? "Event"}</strong>
                        </Link>
                    </>
                )}
                </>
            )}

            {onLogPage && (
                <div style={{display: "flex", flexDirection: "row", fontSize: "18px"}}>
                    <span>&gt;&nbsp;&nbsp;</span>
                    <b>Delivered</b>
                    <strong style={{fontSize: "18px"}}>&nbsp;({deliveryCount || 0})*</strong>
                </div>
            )}
        </div>
    );
}
