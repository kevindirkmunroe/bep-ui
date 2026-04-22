import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { EventSummary } from "./EventSummary";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {EventDetail} from "./eventDetailTypes.interface";
import { useUser } from "../../../UserContext";


export default function PromoteDashboard() {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [event, setEvent] = useState<EventDetail | null>(null);

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {
        const res = await axios.get(`/events/${eventId}`);
        console.log("[PromoteDashboard] RELOAD RESPONSE:", res.data);
        setEvent(res.data);
    };

    const updatePlatformStatus = (platform: string, status: string) => {
        setEvent(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                platforms: prev.platforms.map(p =>
                    p.platform === platform
                        ? { ...p, status }
                        : p
                )
            };
        });
    };

    if (!event || !event.platforms) return <div>Loading...</div>;
    const { userId } = useUser();
    console.log(`[PromoteDashboard] userUser()=${userId}`);
    return (
        <div style={{ padding: 40 }}>
            <div style={{marginBottom: 20}}>
                <button className="btn btn-secondary" onClick={() => navigate(`/dashboard/${userId}`)}>
                    &lt; Back To Events
                </button>
            </div>
            <EventSummary event={event} readOnly={true} showRedo={false} showAsHeader={true} />
            <ProgressBar platforms={event.platforms} />
            <PlatformList event={event} reload={loadEvent} updatePlatformStatus={updatePlatformStatus}/>
        </div>
    );
}
