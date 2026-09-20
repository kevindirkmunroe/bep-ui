import React, {useEffect, useState} from "react";
import ImageCarousel from "./ImageCarousel";
import {useNavigate, useParams} from "react-router-dom";
import {EventDetail} from "./dashboard/events/eventDetailTypes.interface";
import {EventCompletionLog} from "./dashboard/events/EventCompletionLog";

import "./historyView.css";
import {api} from "../utils/api";

export default function HistoryView() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();


    const [events, setEvents] = useState<EventDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] =
        useState<EventDetail | null>(null);

    useEffect(() => {
        if (!userId) return;

        const loadEvents = async () => {
            try {
                const { data } = await api.get<EventDetail[]>(
                    `/users/${userId}/events`
                );

                setEvents(data.data);
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
    }, [userId]);

    useEffect(() => {
        if (!selectedEvent && events.length > 0) {
            setSelectedEvent(events[0]);
        }
    }, [events, selectedEvent]);

    if (loading) {
        return <div>Loading history...</div>;
    }

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 200px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: History */}
            <div style={{ flex: 1, flexDirection: "column", padding: "1px" }}>
                <div style={{paddingLeft: 40}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "20px"}}>
                        <div className="banner-div" style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            objectPosition: "top",
                            fontWeight: 800,
                            fontSize: "34px",
                            borderRadius: "4px",
                            font: "bold",
                            color: "white",
                            display: "flex",
                            alignContent: "left",
                            alignItems: "center"
                        }}>
                            &nbsp;My History
                        </div>
                    </div>
                </div>
                <>
                    <button className="btn btn-secondary" style={{fontSize: "16px", marginBottom: "12px"}} onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                    <div className="history-layout">

                        {/* MASTER */}
                        <div className="history-event-list">
                            <div className="history-list-header">
                                Event History ({events.length})
                            </div>
                            {events.map(event => (
                                <button
                                    key={event.event_id}
                                    className={
                                        "history-event-row " +
                                        (selectedEvent?.event_id === event.event_id
                                            ? "selected"
                                            : "")
                                    }
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <span className="history-event-title">
                                        {event.title}
                                    </span>
                                    <span className="history-event-date">
                                        {new Date(event.start_datetime).toLocaleDateString()}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* DETAIL */}
                        <div className="history-event-detail">
                            {selectedEvent && (
                                <EventCompletionLog event={selectedEvent} />
                            )}
                        </div>

                    </div>
                    <p/>
                </>
            </div>
        </div>
    )
}
