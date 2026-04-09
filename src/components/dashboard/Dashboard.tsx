import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserInfo from "../UserInfo";
import EventsList from "../EventsList";

export default function Dashboard() {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);

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
        } catch (err) {
            console.error(err);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ padding: 40 }}>
            <UserInfo user={user} />
            <EventsList events={events} />
        </div>
    );
}
