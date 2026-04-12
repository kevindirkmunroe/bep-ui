import axios from "axios";
import {Event, PlatformRowProps} from "./platformTypes.interface"
import {getPlatformUrl} from "./platformData";

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

    if (platform === "visitoakland") {
        return {
            name: event.name,
            email: event.email,
            title: event.title,
            description: event.description,
            date: event.start_datetime,
            location: event.location_name
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

        // 2. post event for extension
        window.postMessage(
            {
                type: "SET_EVENT",
                payload: {
                    ...event,
                    platform
                }
            },
            "*"
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
