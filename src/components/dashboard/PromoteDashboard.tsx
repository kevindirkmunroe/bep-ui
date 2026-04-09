import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import { EventSummary } from "./EventSummary";
import {ProgressBar} from "./ProgressBar";
import {PlatformList} from "./PlatformList";
import {Event} from "./platformTypes.interface";

export default function PromoteDashboard() {
    const { eventId } = useParams();

    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {
        const res = await axios.get(`/events/${eventId}`);
        setEvent(res.data);
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div style={{ padding: 40 }}>
            <EventSummary event={event} />
            <ProgressBar platforms={event.platforms} />
            <PlatformList event={event} reload={loadEvent}/>
        </div>
    );
}
