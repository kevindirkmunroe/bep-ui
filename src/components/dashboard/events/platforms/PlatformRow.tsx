import axios from "axios";
import {PlatformRowProps} from "./platformTypes.interface"
import {getPlatformUrl} from "./platformData";
import {EventDetail} from "../eventDetailTypes.interface";

function buildPayload(event: EventDetail, platform: string) {
    if (platform === "funcheapsf") {
        return {
            title: event.price === "Free"
                ? `Free: ${event.title}`
                : event.title,
            description: event.description,
            date: event.start_datetime,
            location: event.location_name,
            name: event.name,
            organization: event.organization,
            email: event.email,
            phone: event.phone,
            website: event.website,
            address: event.address,
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

export function PlatformRow({ event, platformData, updatePlatformStatus, reload } : PlatformRowProps) {
    const { platform, status, date_published } = platformData;

    const handleOpen = async () => {
        // 1. OPEN IMMEDIATELY (must be sync)
        window.open(getPlatformUrl(platform), "_blank");

        // 2. Update database
        try {
            await axios.patch(
                `/events/${event.event_id}/platforms/${platform}`,
                {
                    external_url: event.website,
                    status: "in_progress",
                    payload: buildPayload(event, platform)
                }
            );
        }catch(err){
            console.log(`[PlatformRow] error updating platform ${platform}: ${err}`);
        }

        // 3. post event for extension
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

        await reload();
    };

    const handleReopen = () => {
        // optional: reset status
        updatePlatformStatus(platform, "in_progress");

        // reopen autofill
        handleOpen();
    };

    const handleSubmit = async () => {
        console.log(`[PlatformRow] updating platform ${platform} to 'submitted'`);
        updatePlatformStatus(platform, 'submitted');

        try{
            await axios.patch(
                `/events/${event.event_id}/platforms/${platform}`,
                { status: "submitted" }
            );
            console.log("[PlatformRow] reload fn:", reload);
            await reload();
        }catch(err){
            // rollback if needed
            updatePlatformStatus(platform, "in_progress");
        }
    };

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);

        return date.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const getStatusEmoji = (status: string) => {
        if(status === 'not_started'){
            return("🔴")
        }else if(status === 'in_progress'){
            return("🟠")
        }else{
            return("✅")
        }
    }

    return (
        <div style={{
            border: "2px solid #D2492C",
            padding: 10,
            marginBottom: 10
        }}>
            <h4>{platform}</h4>
            <p>Status: {status} {getStatusEmoji(status)}</p>

            {date_published && (
                <p>Last Published: {formatDateTime(date_published)}</p>
            )}

            {status === "not_started" && (
                <button className="btn btn-primary" onClick={handleOpen}>
                    Open & Autofill
                </button>
            )}
            {status === "in_progress" && (
                <button className="btn btn-primary" onClick={handleOpen}>
                    Continue Autofill
                </button>
            )}
            {status !== "submitted" && (
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Mark as Submitted
                </button>
            )}
            {status === "submitted" && (
                <div>
                    <button className="btn btn-primary" onClick={handleReopen}>
                        Edit / Resubmit
                    </button>
                </div>
            )}
        </div>
    );
}
