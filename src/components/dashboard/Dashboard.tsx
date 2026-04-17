import { useEffect, useState } from "react";
import axios from "axios";
import {Link, Outlet, useParams} from "react-router-dom";
import UserInfo from "../UserInfo";
import EventsList from "./EventsList";
import CreateEventForm from "./CreateEventForm";
import {getEventStatus} from "./events/EventStatus";
import {EventDetail} from "./events/eventDetailTypes.interface";

export default function Dashboard() {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventDetail | null>(null);

    function getActiveEventCount(){
        const activeEvents = (events || []).filter(e => {
            return getEventStatus(e) !== "submitted";
        });
        return activeEvents.length;
    }

    function getSubmittedEventCount(){
        const submittedEvents = (events || []).filter(e => {
            return getEventStatus(e) === "submitted";
        });
        return submittedEvents.length;
    }

    const loadEvents = async () => {
        setShowForm(false);
        try {
            const userRes = await axios.get(`/users/${userId}`);
            setUser(userRes.data.data);
        } catch (err) {
            console.error(err);
        }

        try{
            const eventsRes = await axios.get(`/users/${userId}/events`);
            setEvents(eventsRes.data.data);
        } catch (err: Error | any) {
            if(err.response.status === 404){
                setEvents([]);
            }else{
                throw(err);
            }
        }
    };

    useEffect( () => {
        loadEvents();
    }, [userId]);

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ padding: 40 }}>
            <UserInfo user={user} />
            <button onClick={() => setShowForm(true)}>
                + Create Event
            </button>
            {(showForm || editingEvent) && userId && (
                <CreateEventForm
                    key={editingEvent?.event_id || "new"}   // 👈 Force react to recreate component
                    userId={userId}
                    event={editingEvent || undefined}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingEvent(null);
                        loadEvents();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingEvent(null);
                    }}
                />
            )}
            <nav>
                <Link style={{margin: 5}} to={"events"}>Active({getActiveEventCount()})</Link>
                <Link style={{margin: 5}} to={"submitted"}>Submitted({getSubmittedEventCount()})</Link>
            </nav>
            {/* ROUTED CONTENT */}
            <Outlet context={{ events, setEditingEvent, reload: loadEvents }} />
        </div>
    );
}
