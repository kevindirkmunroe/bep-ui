import { useEffect, useState } from "react";
import axios from "axios";
import {Link, Outlet, useParams} from "react-router-dom";
import UserInfo from "../UserInfo";
import EventsList from "./EventsList";
import CreateEventForm from "./CreateEventForm";

export default function Dashboard() {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const loadEvents = async () => {
        setShowForm(false);
        try {
            console.log("[Dashboard]: loading user...");
            const userRes = await axios.get(`/users/${userId}`);
            console.log("[Dashboard]: user loaded.");
            setUser(userRes.data.data);
        } catch (err) {
            console.error(err);
        }

        try{
            console.log("[Dashboard]: loading events...");
            const eventsRes = await axios.get(`/users/${userId}/events`);
            console.log("[Dashboard]: events loaded.");
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
            {showForm && userId && (
                <CreateEventForm
                    userId={userId}
                    onSuccess={loadEvents}
                    onCancel={() => setShowForm(false)}
                />
            )}
            <nav>
                <Link style={{margin: 5}} to={"events"}>Active</Link>
                <Link style={{margin: 5}} to={"submitted"}>Submitted</Link>
            </nav>
            {/* ROUTED CONTENT */}
            <Outlet context={{ events, reload: loadEvents }} />
        </div>
    );
}
