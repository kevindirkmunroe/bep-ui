import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { EventSummary } from "./EventSummary";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {Event} from "./platforms/platformTypes.interface";

export default function PromoteDashboard() {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {
        const res = await axios.get(`/events/${eventId}`);
        setEvent(res.data);
    };

    if (!event || !event.platforms) return <div>Loading...</div>;

    return (
        <div style={{ padding: 40 }}>
            <div style={{marginBottom: 20}}>
                <button onClick={() => alert('TODO: navigate to /dashboard/${user.user_id}')}>
                    &lt; Back To Events
                </button>
            </div>
            <EventSummary event={event} />
            <ProgressBar platforms={event.platforms} />
            <PlatformList event={event} reload={loadEvent}/>
        </div>
    );
}
