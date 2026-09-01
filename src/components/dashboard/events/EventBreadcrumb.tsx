import { Link, useLocation, useParams } from "react-router-dom";
import React from "react";
import {useUser} from "../../../UserContext";

interface EventBreadcrumbProps {
    eventTitle?: string;
}
export default function EventBreadcrumb({
                                            eventTitle
                                        }: EventBreadcrumbProps) {
    const { userId, eventId } = useParams();
    const location = useLocation();
    const {user} = useUser();


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
                    <strong style={{fontSize: "14px"}}>({user?.eventCount || 0})</strong>
                </div>
            </Link>

            {eventId && (
                <>
                <span>&gt;</span>

                {onEventPage ? (
                    <>
                        <strong>{truncateString(eventTitle, 38) ?? "Event"}</strong>
                        <span>&gt;</span>
                        <Link to={`${eventsPath}/${eventId}/promoted`}>
                            <strong>Promotion Results</strong>
                        </Link>
                    </>

                ) : (
                    <>
                        <Link to={`${eventsPath}/${eventId}`}>
                            {eventTitle ?? "Event"}
                        </Link>
                    </>
                )}
                </>
            )}

            {onLogPage && (
                <>
                    <span>&gt;</span>
                    <strong>Promotion Results</strong>
                </>
            )}
        </div>
    );
}
