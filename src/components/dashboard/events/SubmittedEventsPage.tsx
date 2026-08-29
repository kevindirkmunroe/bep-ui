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
        <div style={{marginTop: 10}}>
            {submittedEvents.length === 0 && <p>No Submitted Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {submittedEvents.map(e => (
                    <EventSummary key={e.event_id} event={e} readOnly showRedo={true} />
                ))}
            </div>
        </div>
    );
}
