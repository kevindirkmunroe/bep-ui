import { useLocation, useParams } from "react-router-dom";
import EventBreadcrumb from "./EventBreadcrumb";

export function EventPlatforms() {
    const { eventId } = useParams();
    const location = useLocation();

    const eventTitle =
        location.state?.eventTitle ?? "Event";

    return (
        <div>
            <EventBreadcrumb eventTitle={eventTitle} />

            {/* load/display platforms for eventId */}
        </div>
    );
}
