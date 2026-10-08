import React, {useEffect, useState} from "react";

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import ImageCarousel from "./ImageCarousel";
import {useNavigate, useParams} from "react-router-dom";
import {EventDetail} from "./dashboard/events/eventDetailTypes.interface";
import {EventCompletionLog} from "./dashboard/events/EventCompletionLog";

import "./historyView.css";
import {api} from "../utils/api";
import PlatformClicksChart from "./admin/PlatformClicksChart";

export default function HistoryView() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string | undefined }>();


    const [events, setEvents] = useState<EventDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] =
        useState<EventDetail | null>(null);
    const [ tabValue, setTabValue] = React.useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

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

    useEffect(() => {
        if (!userId) return;
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
                    <button className="btn btn-secondary" style={{fontSize: "16px"}} onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                    <Box sx={{ width: '100%', typography: 'body1'}}>
                        <div style={{padding: "8px",marginLeft: "36px"}}>
                            <TabContext value={tabValue}>
                                <TabList
                                    onChange={handleChange}
                                    aria-label="lab tabs"
                                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                                >
                                    <Tab label="Published" value="1"/>
                                    <Tab label="Metrics" value="2" />
                                </TabList>
                                <TabPanel value="1" tabIndex={0}>
                                    <div className="history-layout">

                                        {/* MASTER */}
                                        <div className="history-event-list">
                                            <div className="history-list-header">
                                                Event History ({events.length})
                                            </div>

                                            <div className="history-event-list-scroll">
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
                                        </div>

                                        {/* DETAIL */}
                                        <div className="history-event-detail">
                                            {selectedEvent && (
                                                <EventCompletionLog event={selectedEvent} handleRefresh={loadEvents}/>
                                            )}
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value="2" tabIndex={0}>
                                    <PlatformClicksChart userId={userId}/>
                                </TabPanel>
                            </TabContext>
                        </div>
                    </Box>

                    <p/>
                </>
            </div>
        </div>
    )
}
