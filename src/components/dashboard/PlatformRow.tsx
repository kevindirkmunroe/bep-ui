import axios from "axios";
import {Event, PlatformRowProps, Platform} from "./platformTypes.interface"
function getPlatformUrl(platform: Platform){
    const urls: Record<Platform, string> = {
        funcheapsf: "https://sf.funcheap.com/submit-event/",
        dothebay: "https://dothebay.com/submit_event"
    };

    return urls[platform];
}

function buildPayload(event: Event, platform: string) {
    if (platform === "funcheapsf") {
        return {
            title: event.price === "Free"
                ? `Free: ${event.title}`
                : event.title,
            description: event.description,
            date: event.start_datetime,
            location: event.location_name
        };
    }

    if (platform === "dothebay") {
        return {
            title: event.title,
            description: event.description,
            date: event.start_datetime
        };
    }

    return {};
}

export function PlatformRow({ event, platformData, reload } : PlatformRowProps) {
    const { platform, status } = platformData;

    const handleOpen = async () => {
        // 1. mark as in_progress
        await axios.patch(
            `/events/${event.event_id}/platforms/${platform}`,
            {
                status: "in_progress",
                payload: buildPayload(event, platform)
            }
        );

        // 2. store event for extension
        localStorage.setItem(
            "event_data",
            JSON.stringify({
                ...event,
                platform
            })
        );

        // 3. open submission page
        window.open(getPlatformUrl(platform), "_blank");

        reload();
    };

    const handleSubmit = async () => {
        await axios.patch(
            `/events/${event.event_id}/platforms/${platform}`,
            { status: "submitted" }
        );

        reload();
    };

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10
        }}>
            <h4>{platform}</h4>
            <p>Status: {status}</p>

            <button onClick={handleOpen}>
                Open & Autofill
            </button>

            {status !== "submitted" && (
                <button onClick={handleSubmit}>
                    Mark as Submitted
                </button>
            )}
        </div>
    );
}
