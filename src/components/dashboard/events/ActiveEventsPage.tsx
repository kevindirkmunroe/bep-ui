import { useOutletContext } from "react-router-dom";
import {EventDetail} from "./eventDetailTypes.interface";
import {EventSummary} from "./EventSummary";
import {getEventStatus} from "./EventStatus";
import React from "react";

export function ActiveEventsPage() {
    const { events, reload } = useOutletContext<{
        events: EventDetail[];
        reload: () => Promise<void>;
    }>();
    const { setEditingEvent } = useOutletContext<{ setEditingEvent:  React.Dispatch<React.SetStateAction<EventDetail | null>> }>();

    console.log("EVENTS:", events);

    const activeEvents = (events || []).filter(e => {
        return getEventStatus(e) !== "submitted";
    });


    return (
        <div>
            <h2>Active Events</h2>
            {activeEvents.length === 0 && <p>No Active Events Yet</p>}

            {activeEvents.map(e => (
                <EventSummary key={e.event_id} event={e} reload={reload} onEdit={setEditingEvent}/>
            ))}
        </div>
    );
}
