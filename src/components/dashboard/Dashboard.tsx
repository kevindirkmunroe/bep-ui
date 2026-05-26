import { useEffect, useState } from "react";
import {NavLink, Outlet, useParams} from "react-router-dom";
import CreateEventForm from "./CreateEventForm";
import {getEventStatus} from "./events/EventStatus";
import {EventDetail} from "./events/eventDetailTypes.interface";
import Modal from "../Modal";
import ImageCarousel from "../ImageCarousel";
import {api} from "../../utils/api";

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

    // function getPublishedEventCount(){
    //     const submittedEvents = (events || []).filter(e => {
    //         return getEventStatus(e) === "published";
    //     });
    //     return submittedEvents.length;
    // }

    const loadEvents = async () => {
        setShowForm(false);
        try {
            const userRes = await api.get(`/users/${userId}`);
            setUser(userRes.data.data);
        } catch (err: Error | any) {
            alert(`An error occured: ${err}`);
            console.error(err);
        }

        try{
            const eventsRes = await api.get(`/users/${userId}/events`);
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
        if(!user) return;

        loadEvents();
    }, [user]);

    if (!user) return <div style={{marginTop: "50px"}}>Loading...</div>;

    const activeEventCount = getActiveEventCount();
    const submittedEventCount = getSubmittedEventCount();
    // const publishedEventCount = getPublishedEventCount();

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>

            {/* RIGHT: Existing content */}
            <div style={{ flex: 1 }}>
                <div style={{ paddingLeft: 40 }}>
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
                            <button className="btn btn-primary" style={{fontSize: "18px"}} onClick={() => setShowForm(true)}>
                                + Create Event
                            </button>
                            <nav style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "14px" }}>
                                {activeEventCount > 0 ? (
                                    <NavLink
                                        to="events" end
                                        style={({ isActive }) => ({
                                            fontSize: isActive ? "20px" : "15px",
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
                                            fontSize: isActive ? "20px" : "15px",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Submitted({submittedEventCount})
                                    </NavLink>
                                ) : (
                                    <div style={{fontSize: "15px"}}>
                                        Submitted(0)
                                    </div>
                                )}
                                {/* For V1 skip published, user can check their inboxes */}
                                {/*{publishedEventCount > 0 ? (*/}
                                {/*    <NavLink*/}
                                {/*        to={"expired"}*/}
                                {/*        style={({ isActive }) => ({*/}
                                {/*            fontSize: isActive ? "20px" : "15px",*/}
                                {/*            fontWeight: isActive ? "bold" : "normal"*/}
                                {/*        })}>*/}
                                {/*        Published({publishedEventCount})*/}
                                {/*    </NavLink>*/}
                                {/*) : (*/}
                                {/*    <div style={{fontSize: "15px"}}>*/}
                                {/*        Published(0)*/}
                                {/*    </div>*/}
                                {/*)}*/}
                            </nav>

                        </div>
                    </div>
                    {/* ROUTED CONTENT */}
                    <div style={{height: '500px', // Fixed height
                        marginTop: '10px',
                        overflowY: 'auto', // Enable vertical scrolling
                        border: '1px solid #ccc',
                        borderRadius: 2
                        }}>
                        <Outlet context={{ events, setEditingEvent, reload: loadEvents }} />
                    </div>
                </div>

            </div>
        </div>
    );
}
