import {useOutletContext} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {getEventStatus} from "./EventStatus";
import {EventDetail} from "./eventDetailTypes.interface";

export function SubmittedEventsPage() {
    const { events } = useOutletContext<{ events: EventDetail[] }>();

    const submittedEvents = (events || []).filter(e => {
        return getEventStatus(e) === "submitted";
    });

    return (
        <div>
            <h2>Submitted Events</h2>
            {submittedEvents.length === 0 && <p>No Submitted Events Yet</p>}

            {submittedEvents.map(e => (
                <EventSummary key={e.event_id} event={e} readOnly showRedo={true} />
            ))}
        </div>
    );
}
