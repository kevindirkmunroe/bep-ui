import React, { useMemo, useState } from "react";
import './calendar.css';
import {EventDetail} from "./events/eventDetailTypes.interface";
import {useOutletContext} from "react-router-dom";
import {getEventStatusFromPlatforms} from "./events/EventStatus";
import { useParams } from "react-router-dom";
import {isOlderThanToday} from "../../utils/DateTime";
import {useUser} from "../../UserContext";
import {useNavigate} from "react-router-dom";

interface Event {
    event_id: number;
    title: string;
    start_datetime: string;
    end_datetime?: string;
}

type OutletContext = {
    events: Event[];
    setEditingEvent: React.Dispatch<
        React.SetStateAction<Event | null>
    >;
    setViewingEvent: React.Dispatch<
        React.SetStateAction<Event | null>
    >;
    setShowCreateEventForm: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    setCreateEventDate: React.Dispatch<
        React.SetStateAction<Date | null>
    >;
    reload: () => void;
};

export default function CalendarView() {
    const {
        events,
        setEditingEvent,
        setViewingEvent,
        setCreateEventDate,
        setShowCreateEventForm
    } = useOutletContext<OutletContext>();


    const { state } = useParams<{ state: string }>();
    const navigate = useNavigate();
    const { user } = useUser();

    const handlePromote = (event: EventDetail) => {
        navigate(`/dashboard/${user?.userId}/events/${event.event_id}`);
    };

    const handleViewEventStatus= (event:EventDetail) => {
        navigate(`/dashboard/${user?.userId}/events/${event.event_id}/status`)
    }

    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // filter by event state
    const filterEventsByState = (events: EventDetail[], state: string): EventDetail[] => {

        switch(state){
            case "events":
                return events;
            case "submitted":
                return (events || []).filter(e => {
                    return getEventStatusFromPlatforms(e) === "submitted";
                })
            case "expired":
                return (events || []).filter(e => {
                    return getEventStatusFromPlatforms(e) !== "submitted" && isOlderThanToday(e.start_datetime);
                })
        }

        return [];
    }
    const isPublishedEvent = (e: EventDetail) => getEventStatusFromPlatforms(e) === "submitted"

    const getIsExpired = (event: EventDetail) => {
        if (!event.start_datetime) return false;

        return new Date(event.start_datetime) < new Date();
    };

    const isPartiallyLive = (event: EventDetail) => {
        return event.platforms.filter(p => p.status === "submitted").length > 0;
    }

    const getEventStyle = (event: EventDetail) => {
        if(isPublishedEvent(event)){
            return {background: isOlderThanToday(event.start_datetime) ? "#8F9E8B": 'green', color: 'white'};
        }else{
            if(isOlderThanToday(event.start_datetime) && event.is_locked){
                return {background: '#D19187', color: 'white'}
            }
            if(!event.is_locked){
                return {background: 'white', color: 'black', border: "1px solid black"}
            }
            if(isPartiallyLive(event)){
                if(isOlderThanToday(event.start_datetime)){
                    return {background:'#FFBB69', color: "white"};
                }
                return {background: 'orange', color: 'white'};
            }
            return {background: '#D2492C', color: 'white'}
        }
    }

    const eventsByDay = useMemo(() => {
        const grouped: Record<number, EventDetail[]> = {};

        filterEventsByState(events, state!).forEach(event => {
            const date = new Date(event.start_datetime);

            if (
                date.getFullYear() === year &&
                date.getMonth() === month
            ) {
                const day = date.getDate();

                grouped[day] ??= [];
                grouped[day].push(event);
            }
        });

        return grouped;
    }, [events, year, month]);

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const today = () => {
        setCurrentDate(new Date());
    };

    const viewOrEditEvent = (event) => {
        if ((state === "active" || state === "events") && !event.is_locked) {
            setEditingEvent(event);
        }else{
            setViewingEvent(event);
        }
    };

    const cells = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`blank-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(
            <div
                key={day}
                className={`calendar-day ${state === "events" ? "clickable" : ""}`}
                onClick={() => {
                    if (state !== "active" && state !== "events") return;

                    setEditingEvent(null);
                    setCreateEventDate(new Date(year, month, day));
                    setShowCreateEventForm(true);
                }}
            >
                <div className="calendar-date">
                    {new Date().getDate() === day && currentDate.toLocaleString("default", {
                        month: "long",
                        year: "numeric"
                    }) === new Date().toLocaleString("default", {
                        month: "long",
                        year: "numeric"
                    }) ?
                        <div style={{backgroundColor: "#D2492C", color: "white", fontWeight: "bold", width: "30px", height:"30px", borderRadius:"50%"}}>{day}</div>
                        : day
                    }
                </div>

                {eventsByDay[day]?.sort((a, b) => a.start_datetime.localeCompare(b.start_datetime)).map(event => (
                    <div style={getIsExpired(event) ? {} : {borderRadius: "4px", padding: "2px", marginBottom: "6px", border: "1px solid #333333"}}>
                        <button
                            key={event.event_id}
                            className={"calendar-event"}
                            style={getEventStyle(event)}
                            onClick={(e) => {
                                e.stopPropagation();
                                viewOrEditEvent(event);
                            }}
                        >
                            {event.title}<br/>{new Date(event.start_datetime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit"
                        }).toLowerCase()}
                        </button>
                        <>
                            {!getIsExpired(event) && getEventStatusFromPlatforms(event) !== 'submitted' && (
                                <button
                                    title={event.is_locked? "Promote this Event to all Platforms" : "Start Event Promotion process"}
                                    className={event.is_locked ? "btn btn-secondary-greater" : "btn btn-primary-lesser-alt"}
                                    onClick={() => handlePromote(event)}
                                    style={{fontSize: "12px", marginBottom: "4px"}} >
                                    {event.is_locked ? (
                                        <img src={"/icons8-share-48.png"} style={{
                                            width: "16px",
                                            height: "16px"
                                        }}/>
                                    ) : (
                                        <img src={"/icons8-lightning-64-white.png"} style={{
                                            width: "16px",
                                            height: "16px"
                                        }}/>)
                                    }
                                    <b>{event.is_locked ? `Publish` : `Activate...`}</b>
                                </button>
                            )}

                            {!getIsExpired(event) && getEventStatusFromPlatforms(event) !== 'not_started' && isPartiallyLive(event) && (
                                <button
                                    title={"View Submitted Event"}
                                    className={"btn btn-secondary-greater"}
                                    onClick={() => handleViewEventStatus(event)}
                                    style={{fontSize: "12px", width: "120px", padding: "6px"}} >
                                    <img src={"/noun_ResearchPaper_3678033_@700.png"} style={{
                                        width: "16px",
                                        height: "16px"
                                    }}/>
                                    <b>View Live</b>
                                </button>
                            )}
                        </>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="calendar">
                <div className="calendar-header">
                    <div>
                        <button className="btn btn-secondary" onClick={today}>This Month</button>
                        <button className="btn btn-secondary" onClick={previousMonth}>←</button>
                    </div>

                    <h2>
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h2>

                    <button className="btn btn-secondary" onClick={nextMonth}>→</button>
                </div>

                <div className="calendar-grid calendar-weekdays">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="calendar-grid">
                    {cells}
                </div>
            </div>
        </>
    );
}
