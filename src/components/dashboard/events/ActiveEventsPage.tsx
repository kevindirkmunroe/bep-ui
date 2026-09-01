import {useNavigate, useOutletContext} from "react-router-dom";
import {EventDetail} from "./eventDetailTypes.interface";
import {EventSummary} from "./EventSummary";
import {getEventStatus} from "./EventStatus";
import {isOlderThanToday} from "../../../utils/Time";
import {useUser} from "../../../UserContext";


export function ActiveEventsPage() {
    const { events, reload } = useOutletContext<{
        events: EventDetail[];
        reload: () => Promise<void>;
    }>();
    const { setEditingEvent } = useOutletContext<{ setEditingEvent:  React.Dispatch<React.SetStateAction<EventDetail | null>> }>();

    const activeEvents = (events || []).filter(e => {
        return getEventStatus(e) !== "submitted" && !isOlderThanToday(e.start_datetime);
    });

    const navigate = useNavigate();
    const {user} = useUser();
    if(user){
        user.eventCount = activeEvents.length;
    }

    const handlePromote = (event: EventDetail) => {
        navigate(`/dashboard/${user?.userId}/events/${event.event_id}`);
    };

    return (
        <div style={{marginTop: 10}}>
            {activeEvents.length === 0 && <p>No Active Events Yet</p>}
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                {activeEvents.map(e => (
                    <EventSummary key={e.event_id} event={e} reload={reload} onEdit={setEditingEvent} onPromote={handlePromote}/>
                ))}
            </div>
        </div>
    );
}
