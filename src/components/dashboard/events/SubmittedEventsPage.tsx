import {useOutletContext} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {getEventStatus} from "./EventStatus";
import {EventDetail} from "./eventDetailTypes.interface";
import {useState} from "react";

export function SubmittedEventsPage() {
    const { events } = useOutletContext<{ events: EventDetail[] }>();
    const [reloadKey, setReloadKey] = useState(0);
    // Incrementing the key forces a remount
    const handleReload = () => setReloadKey(prev => prev + 1);

    const submittedEvents = (events || []).filter(e => {
        return getEventStatus(e) === "submitted";
    });

    return (
        <div style={{marginTop: 10}}>
            {submittedEvents.length === 0 && <p>No Submitted Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {submittedEvents.map(e => (
                    <EventSummary key={reloadKey} event={e} readOnly showRedo={true} reload={handleReload}/>
                ))}
            </div>
        </div>
    );
}
