import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { EventSummary } from "./EventSummary";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {Event} from "./platforms/platformTypes.interface";
import { useUser } from "../../../UserContext";


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


    const { userId } = useUser();
    return (
        <div style={{ padding: 40 }}>
            <div style={{marginBottom: 20}}>
                <button onClick={() => navigate(`/dashboard/${userId}`)}>
                    &lt; Back To Events
                </button>
            </div>
            <EventSummary event={event} />
            <ProgressBar platforms={event.platforms} />
            <PlatformList event={event} reload={loadEvent}/>
        </div>
    );
}
