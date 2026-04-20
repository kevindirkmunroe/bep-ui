import {useOutletContext} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {getIsExpired} from "./EventStatus";
import {EventDetail} from "./eventDetailTypes.interface";
import React from "react";

export function ExpiredEventsPage() {
    const { events } = useOutletContext<{ events: EventDetail[] }>();
    const { setEditingEvent } = useOutletContext<{ setEditingEvent:  React.Dispatch<React.SetStateAction<EventDetail | null>> }>();

    const expiredEvents = (events || []).filter(e => {
        return getIsExpired(e);
    });


    return (
        <div style={{marginTop: 30}}>
            {expiredEvents.length === 0 && <p>No Expired Events</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {expiredEvents.map(e => (
                    <EventSummary key={e.event_id} event={e} readOnly={false} showRedo={false} onEdit={setEditingEvent} />
                ))}
            </div>
        </div>
    );
}
