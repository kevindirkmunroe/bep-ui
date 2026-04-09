import {Event} from "./platformTypes.interface";
export function EventSummary( {event} : {event : Event}) {
    return (
        <div style={{ marginBottom: 20 }}>
            <h2>{event.title}</h2>
            <p>{event.location_name}</p>
            <p>{new Date(event.start_datetime).toLocaleString()}</p>
        </div>
    );
}
