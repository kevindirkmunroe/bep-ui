import React, { useEffect, useState } from "react";
import {NavLink, Outlet, useParams} from "react-router-dom";
import CreateEditEventForm from "./CreateEditEventForm";
import {getEventStatus} from "./events/EventStatus";
import {EventbriteEventDetail, EventDetail, FacebookEventDetail} from "./events/eventDetailTypes.interface";
import Modal from "../Modal";
import ImageCarousel from "../ImageCarousel";
import {api} from "../../utils/api";
import FacebookURLInputForm from "./FacebookURLInputForm";
import ImportFacebookEventForm from "./ImportFacebookEventForm";
import ImportEventbriteEventForm from "./ImportEventbriteEventForm";
import {FacebookEventRaw, FacebookEventResponseType} from "./ImportFacebookEventResponseType";
import ViewToggle from "./events/ViewToggle";
import EventbriteURLInputForm from "./EventbriteURLInputForm";
import {MOCK_FACEBOOK} from "./MOCK_IMPORT_DATA";
import {eventbriteJsonLdToEventDetail, getEventbriteJsonLd} from "./EventbriteIngestor";
import './dashboard.css';

export default function Dashboard() {
    const { userId } = useParams();
    const [events, setEvents] = useState<EventDetail[] | null>([]);
    const [showImportFacebookURLForm, setShowImportFacebookURLForm] = useState(false);
    const [showImportEventbriteURLForm, setShowImportEventbriteURLForm] = useState(false);
    const [showImportFacebookEventForm, setShowImportFacebookEventForm] = useState(false);
    const [showImportEventbriteEventForm, setShowImportEventbriteEventForm] = useState(false);
    const [showCreateEventForm, setShowCreateEventForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState<EventDetail | null>(null);
    const [facebookImportEvent, setFacebookImportEvent] = useState<FacebookEventDetail | null>(null);
    const [eventbriteImportEvent, setEventbriteImportEvent] = useState<EventbriteEventDetail | null>(null);
    const [createEventDate, setCreateEventDate] = useState<Date | null>(null);
    function isOlderThanToday(date: string) {
        return new Date(date) < new Date();
    }

    async function handleImportEventbriteEvent(eventbriteEventUrl: string) {
        if (!eventbriteEventUrl || !eventbriteEventUrl.startsWith('https://www.eventbrite.com/e/')) {
            alert(`Incorrect Eventbrite URL format: ${eventbriteEventUrl}`);
        }else{
            // get raw data using JSON-LD
            const raw = await getEventbriteJsonLd(eventbriteEventUrl);
            const eventbriteImportEvent = eventbriteJsonLdToEventDetail(raw);

            setEventbriteImportEvent(eventbriteImportEvent);
            setShowImportEventbriteEventForm(true);
        }
    }

    async function handleImportFacebookEvent(facebookEventUrl: string) {
        if (!facebookEventUrl || !facebookEventUrl.startsWith('https://www.facebook.com/events')) {
            alert(`Incorrect Facebook url format: ${facebookEventUrl}`);
        }else{
            //
            // TODO: since Apify and Render costs per call, develop this input feature with a static event.
            //  Put Facebook import behind flag VITE_MOCK_FACEBOOK_IMPORT.
            //

            let raw: FacebookEventRaw | undefined;
            if(import.meta.env.VITE_MOCK_FACEBOOK_IMPORT) {
                raw = MOCK_FACEBOOK;
            }else{
                let result = null;
                try{
                    result = await api.post<FacebookEventResponseType>("/events/import/facebook", {
                        facebookEventUrl
                    });
                    // alert(`Imported Facebook event: ${JSON.stringify(result.data)}`);
                }catch(err: Error | any){
                    if(err.status === 404){
                        alert(`Facebook event not found: ${facebookEventUrl}. The event may be private, restricted, or unsupported.`);
                    }else{
                        alert(`Error importing Facebook event: ${err.message}`);
                    }
                }

                raw = result?.data.raw;
                if(!raw){
                    alert(`Facebook import ${facebookEventUrl} failed.`);
                    return;
                }
            }

            // raw data includes \n \t, replace them
            const cleanDescription = raw.description?.replace(/\\n/g, "\n")
                .replace(/\\t/g, "\t");

            interface Host  {
                name: string;
                url: string;
                type: string;
            }

            const fbImportEvent: FacebookEventDetail = {
                facebookEventURL: facebookEventUrl,
                name: raw.name,
                email: 'bayareaeventpromoter@gmail.com',
                title: raw.name,
                description: cleanDescription,
                location_name: raw.location_name,
                start_datetime: raw.start_date,
                address: raw.location_address,
                website: raw.input_url,
                organization: raw.hosts.map((item: Host) => item.name).join(", "),
                region: raw.location_city,
                category: raw.categories[0],
                city: raw.location_city,
            }
            setFacebookImportEvent(fbImportEvent);
            setShowImportFacebookEventForm(true);
        }
    }


    function getActiveEventCount(){
        const activeEvents = (events || []).filter(e => {
            return getEventStatus(e) !== "submitted" && !isOlderThanToday(e.start_datetime);;
        });
        return activeEvents.length;
    }

    function getSubmittedEventCount(){
        const submittedEvents = (events || []).filter(e => {
            return getEventStatus(e) === "submitted";
        });
        return submittedEvents.length;
    }

    function getExpiredEventCount(){
        const submittedEvents = (events || []).filter(e => {
            return getEventStatus(e) !== "submitted" && isOlderThanToday(e.start_datetime);;
        });
        return submittedEvents.length;
    }

    const loadEvents = async () => {
        setShowCreateEventForm(false);
        try{
            const eventsRes = await api.get(`/users/${userId}/events`);
            setEvents(eventsRes.data.data);
        } catch (err: Error | any) {
            const status = err.response?.status;

            if (status === 404) {
                setEvents([]);
                return;
            }

            if (status === 401) {
                console.log("Auth not ready yet, retrying...");
                return;
            }

            console.error("loadEvents failed", err);
        }
    };

    useEffect(() => {
        if (!userId) return;

        loadEvents();
    }, [userId]);

    if (!userId) return <div style={{marginTop: "50px"}}>Loading...</div>;

    const activeEventCount = getActiveEventCount();
    const submittedEventCount = getSubmittedEventCount();
    const expiredEventCount = getExpiredEventCount();
    // const publishedEventCount = getPublishedEventCount();


    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>

            {/* RIGHT: Existing content */}
            <div style={{ flex: 1 }}>
                <div style={{paddingLeft: 40}}>
                    {(showCreateEventForm || editingEvent) && userId && (
                        <Modal onClose={() => setShowCreateEventForm(false)}>
                            <CreateEditEventForm
                                key={editingEvent?.event_id || "new"}   // 👈 Force react to recreate component
                                userId={userId}
                                event={editingEvent || undefined}
                                initialDate={createEventDate}
                                onSuccess={() => {
                                    setShowCreateEventForm(false);
                                    setEditingEvent(null);
                                    loadEvents();
                                }}
                                onCancel={() => {
                                    setShowCreateEventForm(false);
                                    setEditingEvent(null);
                                }}
                            />
                        </Modal>
                    )}

                    {showImportEventbriteURLForm && userId && (
                        <Modal onClose={() => setShowImportEventbriteURLForm(false)}>
                            <EventbriteURLInputForm onImport={handleImportEventbriteEvent}
                                                  open={true}
                                                  onClose={() => setShowImportEventbriteURLForm(false)}
                            />
                        </Modal>
                    )}

                    {showImportFacebookURLForm && userId && (
                        <Modal onClose={() => setShowImportFacebookURLForm(false)}>
                            <FacebookURLInputForm onImport={handleImportFacebookEvent}
                                                  open={true}
                                                  onClose={() => setShowImportFacebookURLForm(false)}
                            />
                        </Modal>
                    )}
                    {showImportFacebookEventForm && userId && (
                        <Modal onClose={() => setShowImportFacebookEventForm(false)}>
                            <ImportFacebookEventForm
                                userId={userId}
                                event={facebookImportEvent || undefined}
                                onSuccess={() => {
                                    setShowCreateEventForm(false);
                                    setFacebookImportEvent(null);
                                    loadEvents();
                                }}
                                onCancel={() => {
                                    setShowImportFacebookEventForm(false);
                                    setFacebookImportEvent(null);
                                }}
                            />
                        </Modal>
                    )}
                    {showImportEventbriteEventForm && userId && (
                        <Modal onClose={() => setShowImportEventbriteEventForm(false)}>
                            <ImportEventbriteEventForm
                                userId={userId}
                                event={eventbriteImportEvent || undefined}
                                onSuccess={() => {
                                    setShowCreateEventForm(false);
                                    setShowImportEventbriteEventForm(false);
                                    setEventbriteImportEvent(null);
                                    loadEvents();
                                }}
                                onCancel={() => {
                                    setShowImportEventbriteEventForm(false);
                                    setEventbriteImportEvent(null);
                                }}
                            />
                        </Modal>
                    )}

                    <div className="banner-div" style={
                        {
                            font: "bold",
                            height: "100px",
                            marginBottom: "6px",
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
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{
                            display: "flex",
                            width: "100%",
                            flexDirection: "row",
                            marginBottom: "2px",
                            justifyContent: "space-between"
                        }}>
                            <nav style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                                marginTop: "14px",
                                marginLeft: "12px"
                            }}>
                                {activeEventCount > 0 ? (
                                    <NavLink
                                        to="events"
                                        style={({isActive}) => ({
                                            fontSize: isActive ? "18px" : "15px",
                                            textDecoration: isActive ? "underline" : "none",
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
                                        style={({isActive}) => ({
                                            fontSize: isActive ? "18px" : "15px",
                                            textDecoration: isActive ? "underline" : "none",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Submitted({submittedEventCount})
                                    </NavLink>
                                ) : (
                                    <div style={{fontSize: "15px"}}>
                                        Submitted(0)
                                    </div>
                                )}
                                {expiredEventCount > 0 && (
                                    <NavLink
                                        to="expired"
                                        style={({isActive}) => ({
                                            fontSize: isActive ? "18px" : "15px",
                                            textDecoration: isActive ? "underline" : "none",
                                            fontWeight: isActive ? "bold" : "normal"
                                        })}>
                                        Expired({expiredEventCount})
                                    </NavLink>
                                )}
                            </nav>
                            <div>
                                <button className="btn btn-primary"
                                        title="Create New Event"
                                        style={{marginTop: '10px', marginLeft: "4px", fontSize: "14px"}}
                                        onClick={() => setShowCreateEventForm(true)}>
                                    + Create
                                </button>
                                &nbsp;|&nbsp;&nbsp;
                                <span style={{fontSize: '15px'}}>Import</span>&nbsp;
                                <button className="btn btn-primary eventbrite-button"
                                        title="Import Eventbrite Event"
                                        style={{
                                            marginTop: '10px',
                                            marginLeft: "4px",
                                            fontSize: "14px",
                                        }}
                                        onClick={() => setShowImportEventbriteURLForm(true)}>
                                    &nbsp;
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M12 3v12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M7 10l5 5 5-5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5 20h14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>

                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 999.9999389648438 1213.9000244140625" height="14">
                                        <g>
                                            <path
                                                d="M917 814.9L515.3 501.7c-6.7-5.1.2-15.4 7.5-11.3l156.9 87.9c71.1 39.9 161 16.8 204.1-52.4 45.4-73 21.4-169.1-53.2-212.2L600.4 180.6c-7.3-4.3-1.9-15.3 6-12.2l105.8 42.3c.2.1 2.7 1 3.7 1.3 11.2 3.9 23.3 6.1 35.9 6.1 57.4 0 104.5-45.4 108.6-99.4C865.5 48.9 812 0 748.2 0h-489c-62.8 0-115.5 51.3-114.7 113.9.4 33.3 15.3 63 38.7 83.4 17.6 15.3 76.9 62.8 105.1 85.3 5 4 2.2 12.1-4.3 12.1h-97.9C83.2 295.3 0 378.9 0 482c0 52.1 21.3 99.2 55.6 133.1l566.6 538.5c40.1 37.4 93.9 60.3 153.1 60.3 124.1 0 224.7-100.6 224.7-224.7 0-70.3-32.4-133.1-83-174.3z"
                                                fill="#fff"></path>
                                        </g>
                                    </svg>
                                </button>
                                <button className="btn btn-primary facebook-button"
                                        title="Import Facebook Event"
                                        style={{
                                            marginTop: '10px',
                                            marginLeft: "4px",
                                            fontSize: "14px",
                                        }}
                                        onClick={() => setShowImportFacebookURLForm(true)}>
                                    &nbsp;
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M12 3v12"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                        <path
                                            d="M7 10l5 5 5-5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5 20h14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <svg xmlns="http://w3.org" viewBox="0 0 320 512" width="14" height="14"
                                         style={{color: "white"}}>
                                        <path fill="currentColor"
                                              d="M80 299.3V256H12V171.3H80V114.4C80 47.3 120.7 10 181 10c28.8 0 53.6 2.1 60.8 3v70.5h-41.7c-32.6 0-38.9 15.5-38.9 38.2V171.2h78.2L229.3 256H161.2V512H80V299.3z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* ROUTED CONTENT */}
                    <ViewToggle/>

                    <Outlet
                        context={{
                            events,
                            setEditingEvent,
                            setCreateEventDate,
                            setShowCreateEventForm,
                            reload: loadEvents
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
