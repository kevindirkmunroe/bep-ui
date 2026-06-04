import {PlatformRowProps} from "./platformTypes.interface"
import {getPlatformUrl} from "./platformData";
import {EventDetail} from "../eventDetailTypes.interface";
import {api} from "../../../../utils/api";
import {zipToVisitOaklandDistrict} from "./regionMappings";

async function buildPayload(event: EventDetail, platform: string) {
    let region = "";
    if (platform === "funcheapsf") {
        region = "San Francisco"; // default to SF
        try{
            const res = await api.get(`/mapRegion`,
                {
                    params: {
                        zip: event.zip?.toString(), platform: platform
                    }
                });
            region = res.data.region;
        }catch(err){
            console.log(`Error fetching City: ${err}`);
        }

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
            region: region,
            category: event.category,
        };
    }

    if (platform === "visitoakland") {
        const zip: string = event.zip || '';
        region = zipToVisitOaklandDistrict(event.location_name, zip);
        let city = null;
        try{console.log(`calling mapCity with zip ${event.zip}`);
            const res = await api.get(`/mapCity`,
                {
                    params: {
                        zip: event.zip?.toString(), platform: platform
                    }
                });
            console.log(`MapCity res=${JSON.stringify(res.data)}`);
            city = res.data.city;
        }catch(err){
            console.log(`[PlatformRow] Error fetching City: ${err}`);
        }
        console.log(`[PlatformRow] zip: ${event.zip}, city: ${city}`);
        return {
            name: event.name,
            address: event.address,
            email: event.email,
            title: event.title,
            phone: event.phone,
            price: event.price,
            zip: event.zip,
            organization: event.organization,
            website: event.website,
            description: event.description,
            date: event.start_datetime,
            location_name: event.location_name,
            region: region,
            category: event.category,
            city: city
        };
    }

    if (platform === "sfstation") {
        return {
            title: event.title,
            description: event.description,
            date: event.start_datetime,
            location: event.location_name,
            ticket_link : event.website,
            category: event.category,
        };
    }

    if (platform === "indybay") {
        return {
            name: event.name,
            email: event.email,
            title: event.title,
            phone: event.phone,
            topic: 'Arts + Action',
            event_type: 'other',
            description: event.description,
            date: event.start_datetime,
            location: event.location_name,
            region: region,
        };
    }

    return {};
}

export function PlatformRow({ event, platformData, updatePlatformStatus, reload } : PlatformRowProps) {
    const { platform, status, date_published } = platformData;

    const handleOpen = async () => {
        // 1. OPEN IMMEDIATELY (must be sync)
        if(import.meta.env.VITE_PROMOTE_MODE === 'DEV'){
            console.log(`DEV mode NOT opening URL for platform ${platform}`);
        }else{
            window.open(getPlatformUrl(platform), "_blank");
        }

        // 2. Create payload with platform and region
        let pl = null;
        try {
            pl = await buildPayload(event, platform)
        }catch(err){
            console.log(`[PlatformRow] error creating payload for ${platform}: ${err}`);
        }

        // 2. Update database
        try {
            await api.patch(
                `/events/${event.event_id}/platforms/${platform}`,
                {
                    external_url: event.website,
                    status: "in_progress",
                    payload: pl,
                }
            );
        }catch(err){
            console.log(`[PlatformRow] error updating platform ${platform}: ${err}`);
        }

        // // 3. post event for extension
        event.region = pl?.region;
        event.city = pl?.city;
        console.log(`[PlatformRow] event payload for ${platform}: ${JSON.stringify(pl)}`);

        window.postMessage(
            {
                type: `LOCALBUZZ_AUTOFILL_${platform}`,
                platform,
                payload: {
                    ...event,
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
        updatePlatformStatus(platform, 'submitted');

        try{
            await api.patch(
                `/events/${event.event_id}/platforms/${platform}`,
                { status: "submitted" }
            );
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

    const PrintableStatus = {
        "not_started" : "Submission Not Started",
        "in_progress" : "Submission In Progress",
        "submitted" : "Submission Complete",
        "published" : "Submission Published",
    }

    return (
        <div style={{
            border: "1px solid #d5d5d5",
            borderRadius: "4px",
            padding: 10,
            marginBottom: 10
        }}>
            <div style={{fontSize: "18px", fontWeight:"bold"}}>
                {platform}
            </div>
            <div style={{fontSize: "14px"}}>
                <b>Status:</b> {PrintableStatus[status]} &nbsp;{getStatusEmoji(status)}
            </div>

            {date_published && (
                <div style={{fontSize: "14px"}}>
                    <b>Last Published:</b> {formatDateTime(date_published)}
                </div>
            )}
            <div style={{padding: "8px"}}/>
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
            {status !== "submitted" && status && (
                <button disabled={status === 'not_started'} className="btn btn-primary" onClick={handleSubmit}>
                    Mark as Submitted
                </button>
            )}
            {status === "published" && (
                <div>
                    <button className="btn btn-primary" onClick={handleReopen}>
                        Edit / Resubmit
                    </button>
                </div>
            )}
        </div>
    );
}
