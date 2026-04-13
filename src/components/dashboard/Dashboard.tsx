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
        } catch (err) {
            if(err.response.status === 404){
                setEvents([]);
            }else{
                throw(err);
            }
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
                    onCancel={() => setShowForm(false)}
                />
            )}
            <EventsList events={events} />
        </div>
    );
}
