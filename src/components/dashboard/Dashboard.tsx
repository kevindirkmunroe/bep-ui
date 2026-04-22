import { useEffect, useState } from "react";
import axios from "axios";
import {NavLink, Outlet, useParams} from "react-router-dom";
import UserInfo from "../UserInfo";
import EventsList from "./EventsList";
import CreateEventForm from "./CreateEventForm";
import {getEventStatus, getIsExpired} from "./events/EventStatus";
import {EventDetail} from "./events/eventDetailTypes.interface";
import Modal from "../Modal";

export default function Dashboard() {
    const { userId } = useParams();

    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventDetail | null>(null);

    function getActiveEventCount(){
        const activeEvents = (events || []).filter(e => {
            return getEventStatus(e) !== "submitted" && !getIsExpired(e);
        });
        return activeEvents.length;
    }

    function getExpiredEventCount(){
        const expiredEvents = (events || []).filter(e => {
            return getIsExpired(e);
        });
        return expiredEvents.length;
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
            {(showForm || editingEvent) && userId && (
                <Modal onClose={() => setShowForm(false)}>
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
                </Modal>
            )}
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div style={{font: "bold", height: "50px", marginRight: "50px", fontWeight: 800, fontSize: "60px", color: "black", display: "flex", alignContent: "left"}}>Events</div>
                <div>
                    <nav style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                        <NavLink
                            to="events" end
                            style={({ isActive }) => ({
                                fontSize: isActive ? "24px" : "18px",
                                fontWeight: isActive ? "bold" : "normal"
                            })}>
                            Active({getActiveEventCount()})
                        </NavLink>
                        <NavLink
                            to="submitted"
                            style={({ isActive }) => ({
                                fontSize: isActive ? "24px" : "18px",
                                fontWeight: isActive ? "bold" : "normal"
                            })}>
                            Submitted({getSubmittedEventCount()})
                        </NavLink>
                        {getExpiredEventCount() > 0 && (
                            <NavLink
                                to={"expired"}
                                style={({ isActive }) => ({
                                    fontSize: isActive ? "24px" : "18px",
                                    fontWeight: isActive ? "bold" : "normal"
                                })}>
                                Expired({getExpiredEventCount()})
                            </NavLink>
                        )}
                        {getExpiredEventCount() === 0 && (
                            <div style={{fontSize: "18px"}}>
                                Expired(0)
                            </div>
                        )}
                        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                            + Create Event
                        </button>
                    </nav>

                </div>
            </div>
            {/* ROUTED CONTENT */}
            <Outlet context={{ events, setEditingEvent, reload: loadEvents }} />
        </div>
    );
}
