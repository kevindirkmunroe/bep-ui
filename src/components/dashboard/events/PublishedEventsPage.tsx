import {useOutletContext} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {getEventStatus} from "./EventStatus";
import {EventDetail} from "./eventDetailTypes.interface";

export function PublishedEventsPage() {
    const { events } = useOutletContext<{ events: EventDetail[] }>();

    const publishedEvents = (events || []).filter(e => {
        return getEventStatus(e) === "published";
    });

    return (
        <div style={{marginTop: 30}}>
            {publishedEvents.length === 0 && <p>No Submitted Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {publishedEvents.map(e => (
                    <EventSummary key={e.event_id} event={e} readOnly showRedo={true} />
                ))}
            </div>
        </div>
    );
}
