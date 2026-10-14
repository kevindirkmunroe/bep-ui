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
import PlatformClicksChart from "./PlatformClicksChart";
import EventClicksChart from "./EventClicksChart";

export default function HistoryView() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();


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

    if(!userId) return;

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 200px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: History */}
            <div style={{ flex: 1, flexDirection: "column", padding: "1px" }}>
                <div style={{paddingLeft: 10}}>
                    <div style={{width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "2px"}}>
                        <div className="banner-div" style={{
                            width: "100%",
                            height: "80px",
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

                    <Box sx={{ width: '100%', typography: 'body1',
                        display: "flex",
                        flexDirection: "column",
                        height: "600px",
                        minHeight: 0,
                        overflow: "hidden"}}>
                        <div style={{
                            padding: "8px",
                            marginLeft: "10px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                            minHeight: 0,
                            overflow: "hidden"
                        }}>
                            <div style={{backgroundColor: "#fff"}}>
                                <button className="btn btn-secondary" style={{fontSize: "16px"}}
                                        onClick={() => navigate(-1)}>
                                    ← Back
                                </button>
                            </div>
                            <TabContext value={tabValue}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    flex: 1,
                                    minHeight: 0,
                                    overflow: "hidden"
                                }}>
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="lab tabs"
                                        sx={{borderBottom: 1, borderColor: 'divider'}}
                                    >
                                        <Tab label="Submitted / Published Events" value="1"/>
                                        <Tab label="Event Metrics" value="2"/>
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
                                <TabPanel value="2" tabIndex={0}
                                          sx={{
                                              flex: 1,
                                              minHeight: 0,
                                              display: "flex",
                                              flexDirection: "column",
                                              overflow: "auto",
                                              p: 0
                                          }}>

                                        <h2 style={{backgroundColor: "#E5E5E5", alignItems: "left"}}>Event
                                            Performance</h2>
                                        <EventClicksChart user_id={userId}/>
                                        <h2 style={{backgroundColor: "#E5E5E5"}}>Platform Performance</h2>
                                        <PlatformClicksChart title={"Clicks By Platform (Last 30 Days)"} userId={userId}
                                                             window={30}/>
                                        <PlatformClicksChart title={"Clicks By Platform (All Time)"} userId={userId}/>
                                </TabPanel>
                                </Box>
                            </TabContext>
                        </div>
                    </Box>
                    <p/>
                </>
            </div>
        </div>
    )
}
