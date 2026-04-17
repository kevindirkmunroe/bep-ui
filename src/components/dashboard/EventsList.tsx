import { useNavigate } from "react-router-dom";
import {EventProps} from "./eventTypes.interface";

interface EventsListProps {
    events: EventProps[];
}

export default function EventsList({ events}  : EventsListProps) {
    const navigate = useNavigate();

    return (
        <div>
            <h3>Your Events</h3>

            {events.length === 0 && <p>No events yet</p>}

            {events.map((event) => (
                <div
                    key={event.event_id}
                    style={{
                        border: "1px solid #ccc",
                        padding: 10,
                        marginBottom: 10,
                        cursor: "pointer",
                    }}
                    onClick={() => navigate(`/events/${event.event_id}`)} // future
                >
                    <h4>{event.title}</h4>
                    <p>{event.location_name}</p>
                    <p>{new Date(event.start_datetime).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}
