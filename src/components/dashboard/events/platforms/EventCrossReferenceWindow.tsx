import EventDetailView, {EventDetailViewProps} from "../../EventDetailView";
import {useParams} from "react-router-dom";
import {api} from "../../../../utils/api";
import {EventDetail} from "../eventDetailTypes.interface";
import {useEffect, useState} from "react";

export function EventCrossReferenceWindow(){
    const { eventId } = useParams();

    const [event, setEvent] = useState<EventDetail| null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) {
            setError("Missing event ID");
            setLoading(false);
            return;
        }

        async function loadEvent() {
            setLoading(true);

            try {

                const { data } = await api.get<EventDetail>(
                    `/events/${eventId}`
                );

                setEvent(data);
                setLoading(false);
                setError(null);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            }
        }

        loadEvent();

    }, [eventId]);


    if (loading) return <div>Loading event...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!event) return <div>Event not found</div>;

    return (<EventDetailView event={event} />)
}

