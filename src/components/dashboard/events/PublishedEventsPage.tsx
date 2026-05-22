import {useOutletContext} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {getEventStatus} from "./EventStatus";
import {EventDetail} from "./eventDetailTypes.interface";
import {useState} from "react";

export function PublishedEventsPage() {
    const { events } = useOutletContext<{ events: EventDetail[] }>();

    const [reloadKey, setReloadKey] = useState(0);
    // Incrementing the key forces a remount
    const handleReload = () => setReloadKey(prev => prev + 1);

    const publishedEvents = (events || []).filter(e => {
        return getEventStatus(e) === "published";
    });

    return (
        <div style={{marginTop: 30}}>
            {publishedEvents.length === 0 && <p>No Submitted Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {publishedEvents.map(e => (
                    <EventSummary key={reloadKey} event={e} readOnly showRedo={true} reload={handleReload} />
                ))}
            </div>
        </div>
    );
}
