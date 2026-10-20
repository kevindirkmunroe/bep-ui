import React, { useMemo, useState } from "react";
import './calendar.css';
import {EventDetail} from "./events/eventDetailTypes.interface";
import {useOutletContext} from "react-router-dom";
import {getEventStatusFromPlatforms} from "./events/EventStatus";
import { useParams } from "react-router-dom";
import {isOlderThanToday} from "../../utils/DateTime";

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

    const getEventStyle = (event: EventDetail) => {
        if(isPublishedEvent(event)){
            return {background: isOlderThanToday(event.start_datetime) ? "#8F9E8B": 'green', color: 'white'};
        }else{
            if(isOlderThanToday(event.start_datetime)){
                return {background: '#D19187', color: 'white'}
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
                <div className="calendar-date">{day}</div>

                {eventsByDay[day]?.map(event => (
                    <button
                        key={event.event_id}
                        className={"calendar-event"}
                        style={getEventStyle(event)}
                        onClick={(e) => {
                            e.stopPropagation();
                            viewOrEditEvent(event);
                        }}
                    >
                        {event.title}
                    </button>
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
