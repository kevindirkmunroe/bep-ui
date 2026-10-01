import {PLATFORM_ICONS, PRINTABLE_PLATFORM} from "./platforms/platformTypes.interface";
import {EventDetail} from "./eventDetailTypes.interface";
import "./eventCompletionLog.css";
import React, {useEffect, useState} from "react";
import {encode} from "../../../utils/Tracking";
import {api} from "../../../utils/api";

interface EventCompletionLogProps {
    event: EventDetail;
    handleRefresh: () => Promise<void>;
}

export function EventCompletionLog({ event, handleRefresh }: EventCompletionLogProps) {

    const [submittedEvent, setSubmittedEvent] = useState<EventDetail | null>(null);
    const loadSubmittedEvents = async () => {
        try {
            const { data } = await api.get<EventDetail[]>(
                `/events/${event.event_id}`
            );

            setSubmittedEvent(data);
        }catch(error){
            console.error(`[EventCompletionLog] Error loading event stats: ${error}`);
        }
    };

    const [submittedEvents, setSubmittedEvents] = useState<EventDetail| null>(null)
    useEffect(() => {
        if (!event) return;
        loadSubmittedEvents();
    }, [event]);

    const submittedPlatforms = submittedEvent?.platforms.filter(
        p => p.status === "submitted"
    );

    // const fulfillmentComplete = submittedPlatforms.length === event.platforms.length;

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "—";

        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() - 7);

        return newDate.toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZoneName: "short"
        });
    };

    const AUTO_PUBLISHED_PLATFORMS = ["indybay", "dothebay", "sfstation"];

    return (
        <div className="completion-log">
            <div className="completion-event-info">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <strong style={{fontSize: "15px"}}><b>{event.title}</b></strong>
                        <p style={{fontSize: "14px"}}>{event.event_id}</p>
                    </div>
                    <div style={{marginLeft: "80px"}}/>
                    <div style={{alignContent: "right", justifyContent: "flex-end"}}>
                        <button
                            style={{width: "120px"}}
                            onClick={handleRefresh}
                            className={"btn btn-secondary"}>
                            <img alt="Refresh" src={"/icons8-refresh-30.png"} style={{width: "24px", height: "24px"}}/>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="completion-divider"/>

            <table className="completion-table">
                <thead>
                <tr>
                    <th>Delivery Platform</th>
                    <th>Date Submitted</th>
                    <th>Delivery Status</th>
                    <th>Tracking Code</th>
                    <th>Clicks</th>
                    <th>Event URL ↗</th>
                </tr>
                </thead>

                <tbody>
                {submittedPlatforms?.map(p => (
                    <tr key={p.platform}>
                        <td>
                            <div className="completion-platform">
                                <img
                                    src={PLATFORM_ICONS[p.platform]}
                                    alt=""
                                />
                                {PRINTABLE_PLATFORM[p.platform] ?? p.platform}
                            </div>
                        </td>

                        <td>{formatDate(p.date_published)}</td>
                        <td>{AUTO_PUBLISHED_PLATFORMS.includes(p.platform)? "Published":
                            "Submitted pending Verification"}</td>
                        <td>{encode(p.tracking_code)}</td>
                        <td>{p.click_count}</td>
                        <td><a target="_blank" href={p.published_url}>{p.published_url}</a></td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}
