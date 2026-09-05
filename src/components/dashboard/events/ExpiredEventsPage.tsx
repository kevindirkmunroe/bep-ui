import { useOutletContext } from "react-router-dom";
import {EventDetail} from "./eventDetailTypes.interface";
import {EventSummary} from "./EventSummary";
import {getEventStatus, getIsExpired} from "./EventStatus";
import React from "react";
import {isOlderThanToday} from "../../../utils/DateTime";

export function ExpiredEventsPage() {
    const { events, reload } = useOutletContext<{
        events: EventDetail[];
        reload: () => Promise<void>;
    }>();
    const { setEditingEvent } = useOutletContext<{ setEditingEvent:  React.Dispatch<React.SetStateAction<EventDetail | null>> }>();

    const activeEvents = (events || []).filter(e => {
        return getEventStatus(e) !== "submitted" && isOlderThanToday(e.start_datetime);
    });


    return (
        <div style={{marginTop: 10}}>
            {activeEvents.length === 0 && <p>No Active Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {activeEvents.map(e => (
                    <EventSummary key={e.event_id} event={e} reload={reload} onEdit={setEditingEvent}/>
                ))}
            </div>
        </div>
    );
}
