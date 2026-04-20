import {useOutletContext} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {getIsExpired} from "./EventStatus";
import {EventDetail} from "./eventDetailTypes.interface";

export function ExpiredEventsPage() {
    const { events } = useOutletContext<{ events: EventDetail[] }>();

    const expiredEvents = (events || []).filter(e => {
        return getIsExpired(e);
    });

    return (
        <div style={{marginTop: 30}}>
            {expiredEvents.length === 0 && <p>No Expired Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {expiredEvents.map(e => (
                    <EventSummary key={e.event_id} event={e} readOnly showRedo={true} />
                ))}
            </div>
        </div>
    );
}
