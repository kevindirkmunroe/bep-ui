import { useNavigate, useParams } from "react-router-dom";
import {EventDetail} from "./eventDetailTypes.interface";
import {useEffect, useState} from "react";
import {api} from "../../../utils/api";

export function EventList() {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [events, setEvents] = useState<EventDetail[]>([]);

    useEffect(() => {
        async function loadEvents() {
            try {
                const res = await api.get(`/users/${userId}/events`);
                setEvents(res.data);
            } catch (err) {
                console.error("Error loading events:", err);
            }
        }

        loadEvents();
    }, [userId]);

    const handleEventClick = (event: EventDetail) => {
        navigate(
            `/dashboard/${userId}/events/${event.event_id}`,
            {
                state: {
                    eventTitle: event.title
                }
            }
        );
    };

    return (
        <div>
            {events.map(event => (
                <div
                    key={event.event_id}
                    onClick={() => handleEventClick(event)}
                    style={{ cursor: "pointer" }}
                >
                    {event.title}
                </div>
            ))}
        </div>
    );
}
