import React, { useMemo, useState } from "react";
import CreateEditEventForm from "./CreateEditEventForm";
import './calendar.css';
import {EventDetail} from "./events/eventDetailTypes.interface";
import {useOutletContext} from "react-router-dom";
import {getEventStatus} from "./events/EventStatus";
import {isOlderThanToday} from "../../utils/Time";
import { useParams } from "react-router-dom";
import RecycleEventModal from "./events/RecycleEventModal";
import RestoreEventModal from "./events/RestoreEventModal";
import {api} from "../../utils/api";

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
        setCreateEventDate,
        setShowCreateEventForm,
        reload
    } = useOutletContext<OutletContext>();


    const { state } = useParams<{ state: string }>();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
    const [restoreEvent, setRestoreEvent] = useState<EventDetail | null>(null);
    const [recycleEvent, setRecycleEvent] = useState<EventDetail | null>(null);
    const [showRecycleModal, setShowRecycleModal] = useState<boolean>(false);
    const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);

    function isOlderThanToday(date: string) {
        return new Date(date) < new Date();
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // filter by event state
    const filterEventsByState = (events: EventDetail[], state: string): EventDetail[] => {

        // TODO refactor into shared function with *EventsPage
        switch(state){
            case "events":
                return (events || []).filter(e => {
                    return getEventStatus(e) !== "submitted" && !isOlderThanToday(e.start_datetime);
                });
            case "submitted":
                return (events || []).filter(e => {
                    return getEventStatus(e) === "submitted";
                })
            case "expired":
                return (events || []).filter(e => {
                    return getEventStatus(e) !== "submitted" && isOlderThanToday(e.start_datetime);
                })
        }

        return [];
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

    const editEvent = (event: EventDetail) => {
        if (state === "active" || state === "events") {
            setEditingEvent(event);
            setSelectedEvent(true);
        }

        if (state === "submitted") {
            setRecycleEvent(event);
            setShowRecycleModal(true);
        }

        if (state === "expired") {
            setRestoreEvent(event);
            setShowRestoreModal(true);
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
                        className="calendar-event"
                        onClick={(e) => {
                            e.stopPropagation();
                            editEvent(event);
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
                    <button onClick={previousMonth}>←</button>

                    <h2>
                        {currentDate.toLocaleString("default", {
                            month: "long",
                            year: "numeric"
                        })}
                    </h2>

                    <button onClick={nextMonth}>→</button>
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

            {showRecycleModal && (
                <RecycleEventModal
                    name={recycleEvent?.title}
                    onCancel={() => {
                        console.log("closing recycle modal");

                        setSelectedEvent(null);
                        setShowRecycleModal(false)
                    }}
                    onRecycle={async (newDate) => {
                        console.log(`[CalendarView] recycle selectedEvent=${JSON.stringify(selectedEvent)}`);
                        await api.post(`/events/${recycleEvent?.event_id}/clone`, {
                            start_date: newDate
                        });

                        setShowRecycleModal(false);
                        window.location.reload();
                        await reload?.();
                    }}
                />
            )}

            {showRestoreModal && (
                <RestoreEventModal
                    name={restoreEvent?.title}
                    onCancel={() => setShowRestoreModal(false)}
                    onRestore={async (newDate) => {
                        console.log(`[CalendarView] restore selectedEvent=${JSON.stringify(selectedEvent)}`);
                        await api.patch(`/events/${restoreEvent?.event_id}/restore`, {
                            start_date: newDate
                        });

                        setShowRestoreModal(false);
                        await reload?.();
                    }}
                />
            )}
        </>
    );
}
