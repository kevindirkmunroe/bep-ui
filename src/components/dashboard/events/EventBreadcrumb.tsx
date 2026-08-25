import { Link, useLocation, useParams } from "react-router-dom";

interface EventBreadcrumbProps {
    eventTitle?: string;
}
export default function EventBreadcrumb({
                                            eventTitle
                                        }: EventBreadcrumbProps) {
    const { userId, eventId } = useParams();
    const location = useLocation();

    const eventsPath = `/dashboard/${userId}/events`;

    const onEventPage =
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
                marginBottom: "20px"
            }}
        >
            <Link to={eventsPath}>
                <b>Event List</b>
            </Link>

            {eventId && (
                <>
                    <span>&gt;</span>

                    {onEventPage ? (
                        <strong>{truncateString(eventTitle, 24) ?? "Event"}</strong>
                    ) : (
                        <Link to={`${eventsPath}/${eventId}`}>
                            {eventTitle ?? "Event"}
                        </Link>
                    )}
                </>
            )}

            {onLogPage && (
                <>
                    <span>&gt;</span>
                    <strong>Promotion Log</strong>
                </>
            )}
        </div>
    );
}
