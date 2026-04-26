import { useEffect, useState } from "react";
import axios from "axios";
import {NavLink, Outlet, useParams} from "react-router-dom";
import UserInfo from "../UserInfo";
import CreateEventForm from "./CreateEventForm";
import {getEventStatus, getIsExpired} from "./events/EventStatus";
import {EventDetail} from "./events/eventDetailTypes.interface";
import Modal from "../Modal";
import ImageCarousel from "../ImageCarousel";

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

    const activeEventCount = getActiveEventCount();
    const submittedEventCount = getSubmittedEventCount();
    const expiredEventCount = getExpiredEventCount();

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>

            {/* RIGHT: Existing content */}
            <div style={{ flex: 1 }}>
                <div style={{ paddingLeft: 40 }}>
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
                    <div className="banner-div" style={
                        {
                            font: "bold",
                            height: "100px",
                            marginRight: "50px",
                            marginBottom: "20px",
                            fontWeight: 800,
                            fontSize: "40px",
                            borderRadius: "4px",
                            color: "white",
                            display: "flex",
                            alignContent: "left",
                            alignItems: "center"
                        }
                    }>&nbsp;My Events
                    </div>
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <div>
                            <nav style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                                {activeEventCount > 0 ? (
                                    <NavLink
                                        to="events" end
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "24px" : "18px",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Active({activeEventCount})
                                    </NavLink>
                                ) : (
                                    <div style={{fontSize: "18px"}}>
                                        Active(0)
                                    </div>
                                )}
                                {submittedEventCount > 0 ? (
                                    <NavLink
                                        to="submitted"
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "24px" : "18px",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Submitted({submittedEventCount})
                                    </NavLink>
                                ) : (
                                    <div style={{fontSize: "18px"}}>
                                        Submitted(0)
                                    </div>
                                )}
                                {expiredEventCount > 0 ? (
                                    <NavLink
                                        to={"expired"}
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "24px" : "18px",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Expired({expiredEventCount})
                                    </NavLink>
                                ) : (
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

            </div>
        </div>
    );
}
