import {PLATFORM_ICONS, PRINTABLE_PLATFORM} from "./platforms/platformTypes.interface";
import {EventDetail} from "./eventDetailTypes.interface";
import "./eventCompletionLog.css";
import React, {useEffect, useState} from "react";
import {encode} from "../../../utils/Tracking";
import {api} from "../../../utils/api";
import Modal from "../../Modal";
import EventDetailView from "../EventDetailView";

interface EventCompletionLogProps {
    event: EventDetail;
    handleRefresh: () => Promise<void>;
}

export function EventCompletionLog({ event, handleRefresh }: EventCompletionLogProps) {

    const [showEventDetailForm, setShowEventDetailForm] = useState(false);
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

    function truncateString(str: string | undefined, limit: number, ending: string = '...'): string {
        if(!str){
            return "unknown"
        }

        if (str.length <= limit) {
            return str;
        }
        return str.slice(0, limit - ending.length) + ending;
    }

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

    const AUTO_PUBLISHED_PLATFORMS = ["indybay", "dothebay", "sfstation", "patch"];

    return (
        <div className="completion-log">
            { showEventDetailForm && (
                <Modal onClose={() => setShowEventDetailForm(false)}>
                    <EventDetailView
                        event={event}
                        onClose={() => {
                            setShowEventDetailForm(false);
                        }
                        }/>
                </Modal>
            )}
            <div className="completion-event-info">
                <div style={{display: "flex", flexDirection: "row"}}>
                    <img src={"/noun_ResearchPaper_3678033_@700.png"} style={{
                        width: "28px",
                        height: "28px"
                    }}/>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <strong style={{fontSize: "18px", fontWeight: "600"}}><b>{event.title}</b></strong>
                        <p style={{fontSize: "14px"}}>{event.event_id}</p>
                    </div>
                    <div style={{marginLeft: "80px"}}/>
                    <div style={{alignContent: "right", justifyContent: "flex-end", display: "flex", flexDirection: "row"}}>
                        <button className="btn btn-secondary"
                                style={{margin: "8px"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEventDetailForm(true);
                                }}
                        >
                            <img src={"/icons8-preview-48-coral.png"} style={{width: "24px", height: "24px"}}/>
                            View
                        </button>
                        <button
                            style={{margin: "8px"}}
                            onClick={handleRefresh}
                            className={"btn btn-secondary"}>
                            <img alt="Refresh" src={"/icons8-refresh-30.png"} style={{width: "24px", height: "24px"}}/>
                            Refresh Publish Status
                        </button>
                    </div>
                </div>
            </div>

            <div className="completion-divider"/>

            <div className="table-container">
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
                    {submittedPlatforms?.length === 0 && (<tr><td style={{textAlign: "center"}} colSpan={6}>No Data</td></tr>)}
                    {submittedPlatforms?.map(p => (
                        <tr key={p.platform}>
                            <td style={{minWidth: "200px"}}>
                                <div className="completion-platform">
                                    <img
                                        src={PLATFORM_ICONS[p.platform]}
                                        alt=""
                                    />
                                    {PRINTABLE_PLATFORM[p.platform] ?? p.platform}
                                </div>
                            </td>

                            <td style={{minWidth: "180px"}}>{formatDate(p.date_published)}</td>
                            <td>{AUTO_PUBLISHED_PLATFORMS.includes(p.platform)? "Published":
                                "Submitted pending Verification"}</td>
                            <td>{encode(p.tracking_code)}</td>
                            <td>{p.click_count}</td>
                            <td style={{maxWidth: "240px"}}><a target="_blank" href={p.published_url}>{p.published_url}</a></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
