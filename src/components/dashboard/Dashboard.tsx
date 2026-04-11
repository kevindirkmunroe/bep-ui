import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserInfo from "../UserInfo";
import EventsList from "./EventsList";
import CreateEventForm from "./CreateEventForm";

export default function Dashboard() {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect( () => {
        loadData().then(() => {
            // NOP to avoid "Promise is ignored" error.
        });
    }, []);

    const loadData = async () => {
        try {
            const userRes = await axios.get(`/users/${userId}`);
            const eventsRes = await axios.get(`/users/${userId}/events`);

            setUser(userRes.data.data);
            setEvents(eventsRes.data.data);
            setShowForm(false);
        } catch (err) {
            console.error(err);
        }
    };

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
                    onSuccess={loadData}
                />
            )}
            <EventsList events={events} />
        </div>
    );
}
