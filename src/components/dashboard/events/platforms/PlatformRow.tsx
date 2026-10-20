import {
    AI_PLATFORMS,
    Platform,
    PLATFORM_ICONS,
    PlatformRowProps,
    PRINTABLE_PLATFORM,
    REQUIRED_AUTH_PLATFORMS
} from "./platformTypes.interface"
import {getPlatformUrl, getPlatformFromUrl} from "./platformUrls";
import {DateFields, EventDetail} from "../eventDetailTypes.interface";
import {api} from "../../../../utils/api";
import React, {useEffect, useState} from "react";
import {
    CitySparkPayload,
    DoTheBayPayload,
    FunCheapPayload,
    IndyBayPayload, PatchPayload,
    SFStationPayload,
    SFWeeklyPayload,
    VisitOaklandPayload
} from "./payloadTypes.interface";
import {PAYLOAD_TRANSFORMATIONS} from "./payloadTransfomations";
import BaseDialog, {DialogState} from "../../../BaseDialog";
import buildTrackingUrl from "../../../../utils/Tracking";

type PlatformPayload =
    | FunCheapPayload
    | DoTheBayPayload
    | VisitOaklandPayload
    | SFStationPayload
    | SFWeeklyPayload
    | CitySparkPayload
    | PatchPayload
    | IndyBayPayload;

function buildDateFields(startDatetime: string) : DateFields {
    const normalized = startDatetime.replace("T", " ").slice(0, 19);
    const [datePart, timePart] = normalized.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hour24, minute] = timePart.split(":");

    const hourNum = Number(hour24);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = String(hourNum % 12 || 12);

    return {
        start_datetime_local: normalized,        // "2026-06-11 21:00:00"
        event_date: datePart,                    // "2026-06-11"
        event_year: year,
        event_month: month,
        event_day: day,
        event_time_24h: `${hour24}:${minute}`,   // "21:00"
        event_hour_12: hour12,                   // "9"
        event_minute: minute,                    // "00"
        event_ampm: ampm                         // "PM"
    };
}

function toLocalDateTimeString(value: string): string {
    // Handles "2026-06-11 21:00:00" or "2026-06-11T21:00:00"
    return value.replace("T", " ").slice(0, 19);
}

async function buildPayload(event: EventDetail, platform: Platform) : Promise<PlatformPayload>  {
    const payloadTransformationFn = PAYLOAD_TRANSFORMATIONS[platform];
    if(!payloadTransformationFn){
        console.log(`[PlatformRow] Error- unsupported platform: ${platform}`);
    }

    return await payloadTransformationFn(event, platform);
}

export function PlatformRow({ event, platformData, updatePlatformStatus, reload, extensionInstalled } : PlatformRowProps) {
    const { platform, status, tracking_code } = platformData;
    const [dialog, setDialog] = useState<DialogState>(null);

    const [autofillClicked, setAutofillClicked] = useState(status != 'not_started');

    useEffect(() => {
        const handler = (event: Event) => {
            const { platformUrl } = (
                event as CustomEvent<{ platformUrl: string }>
            ).detail;


            if(platform === getPlatformFromUrl(platformUrl)){
                handleSubmit().then(v => {
                    console.log(`[PlatformRow]  ${platform} updated by message ${getPlatformFromUrl(platformUrl)}`);
                }).catch(e =>{
                    console.log(`error updating ${platformUrl}: ${e}`);
                });
            }
        };

        window.addEventListener(
            "AIRHORN_PLATFORM_SUBMITTED",
            handler
        );

        return () => {
            console.log("[PlatformRow] useEffect CLEANUP");

            window.removeEventListener(
                "AIRHORN_PLATFORM_SUBMITTED",
                handler
            );
        };
    }, []);

    const handleAutofill = async () => {
        if(AI_PLATFORMS.includes(platform)){
            await handleAIOpen();
        }else{
            await handleOpen();
        }
    }

    const handleAIOpen = async () => {

        console.log(`[PlatformRow] handleAIOpen start`);
        setAutofillClicked(true);

        // 1. OPEN IMMEDIATELY (must be sync)
        const partnerWindow = window.open(
            "",
            "LocalBuzzPromotionWindow",
            "width=1400,height=1000"
        );

        const platformUrl = getPlatformUrl(platform);
        if(partnerWindow){
            partnerWindow.location.href = platformUrl;
        }else{
            setDialog({
                type: "error",
                title: "Open Platform",
                message: `${platformUrl} failed to open. Please try again.`
            });
        }

        // 2. Send message to gather form inputs
        console.log(`[PlatformRow] sending msg AIRHORN_INSPECT_FORM`);
        window.postMessage({
            type: "AIRHORN_INSPECT_FORM",
            platform: "eastbaymagazine"
        }, window.location.origin);

        // 3. Listen for submit
        window.addEventListener('message', (e) => {
            if (e.source !== window || e.data?.source !== 'airhorn.events.ext') return;
            if (e.data.event === 'submitted') console.log('User clicked Submit on', e.data.pageUrl);
            if (e.data.event === 'result')    console.log('Result URL:', e.data.resultUrl);
        });

        updatePlatformStatus(platform, 'in_progress');
        reload();
    };

    const handleOpen = async () => {

        setAutofillClicked(true);

        // 1. OPEN IMMEDIATELY (must be sync)
        const partnerWindow = window.open(
            "",
            "LocalBuzzPromotionWindow",
            "width=1400,height=1000"
        );
        const platformUrl = getPlatformUrl(platform);
        if(partnerWindow){
            partnerWindow.location.href = platformUrl;
        }else{
            setDialog({
                type: "error",
                title: "Open Platform",
                message: `${platformUrl} failed to open. Please try again.`
            });
        }

        // 2. Create payload with platform and region
        let pl = null;
        try {
            pl = await buildPayload(event, platform)
        }catch(err){
            console.log(`[PlatformRow] error creating payload for ${platform}: ${err}`);
        }

        // 3. Update database
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

        // 4. Switch website with tracking URL
        const trackingUrl= buildTrackingUrl(tracking_code);
        event.website = trackingUrl;
        event.description = `${event.description}\n\n${trackingUrl}`;

        // 5. post event for extension
        event.region = pl?.region;
        event.city = pl?.city ?? undefined;
        event.address_fields = pl?.address_fields;
        // Break start time into wall-clock event time.
        const localDT = toLocalDateTimeString(event.start_datetime);
        event.date_fields = buildDateFields(localDT);

        console.log(`[PlatformRow] transform for platform ${platform} payload:\n${JSON.stringify(pl)}`);
        window.postMessage(
            {
                type: `AIRHORN_AUTOFILL_${platform}`,
                platform,
                payload: {
                    ...event,
                }
            },
            "*"
        );

        // Listen:
        window.addEventListener('message', (e) => {
            if (e.source !== window || e.data?.source !== 'airhorn.events.ext') return;
            if (e.data.event === 'submitted') console.log('User clicked Submit on', e.data.pageUrl);
            if (e.data.event === 'result')    console.log('Result URL:', e.data.resultUrl);
        });

        updatePlatformStatus(platform, 'in_progress');
        await reload();
    };

    const handleReopen = async () => {
        // optional: reset status
        updatePlatformStatus(platform, "in_progress");

        // reopen autofill
        await handleAutofill();
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

    const getStatusEmoji = (status: string) => {
        if(status === 'not_started'){
            return("🔴")
        }else if(status === 'in_progress'){
            return("🟠")
        }else{
            return("✅")
        }
    }

    const PRINTABLE_STATUS = {
        "not_started" : "Not Started",
        "in_progress" : "Incomplete",
        "submitted" : "Submitted",
        "published" : "Published",
    }


    return (
        <div style={{
            border: "1px solid #d5d5d5",
            borderRadius: "4px",
            padding: 10,
            marginBottom: 10
        }}>
            <div style={{display: "flex", flexDirection: "row", backgroundColor: status === 'submitted' ? "#f5f5f5" : 'white'}}>
                {dialog && (
                    <BaseDialog
                        type={dialog.type}
                        title={dialog.title}
                        message={dialog.message}
                        confirmLabel={dialog.confirmLabel}
                        onConfirm={dialog.onConfirm}
                        onClose={() => setDialog(null)}
                    />
                )}

                <div className="platform-icon" style={{display: "flex", width: "100px", height: "60px", marginLeft: "10px"}}>
                    <img alt={"platform icon"} style={{transform: "scale(0.85)", filter: "grayscale(100%)", width: "100px", height: "60px"}} src={PLATFORM_ICONS[platform]} />
                </div>
                <div style={{paddingLeft: "54px", paddingRight: "4px", paddingBottom: "10px"}}/>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start"
                }}>
                    <div style={{fontSize: "18px", fontWeight:"bold", justifyContent: "left"}}>
                        {PRINTABLE_PLATFORM[platform]}{REQUIRED_AUTH_PLATFORMS.includes(platform) ? " 🔑": ""}
                    </div>
                    <div style={{fontSize: "14px"}}>
                        {getStatusEmoji(status)}&nbsp;&nbsp;&nbsp;{PRINTABLE_STATUS[status]} &nbsp;
                    </div>
                </div>
                <div style={{marginLeft: "auto"}}>
                    <div style={{padding: "4px"}}/>
                    { AI_PLATFORMS.includes(platform) &&
                        <img alt={"Robot"} src={"/icons8-robot-48.png"} style={{width:"24px", height:"24px"}} />
                    }
                    {status === "not_started" && (
                        <button disabled={!extensionInstalled} className="btn btn-primary" onClick={handleAutofill}>
                            <img alt={"Autofill"} src={"/icons8-form-24.png"} style={{width:"24px", height:"24px"}} />Autofill
                        </button>
                    )}
                    {status === "in_progress" && (
                        <button disabled={!extensionInstalled}
                                title={
                                    extensionInstalled
                                        ? "Open partner website and Autofill event"
                                        : "Install the Airhorn.events Chrome extension to enable Autofill"
                                }
                                className={autofillClicked? "btn btn-secondary" : "btn btn-primary"}
                                onClick={handleAutofill}>

                            <img alt={"Autofill"} src={autofillClicked? "/icons8-form-24-black.png": "/icons8-form-24.png"} style={{width:"24px", height:"24px"}} />Autofill
                        </button>
                    )}
                    {status !== "submitted" && status && (
                        <button disabled={status === 'not_started' || !extensionInstalled}
                                title={extensionInstalled
                                    ? "Mark this event as submitted after completing submission on the partner website"
                                    : "Install the Airhorn.events Chrome extension to enable Mark Submitted"}
                                className="btn btn-primary-greater"
                                onClick={handleSubmit}>
                            <img alt={"Mark Submitted"} src={"/icons8-checklist-48.png"} style={{width:"24px", height:"24px"}} />Mark Submitted
                        </button>
                    )}
                    {status === "submitted" && status && (
                        <button className="btn btn-primary" onClick={handleReopen}>
                            <img alt={"Redo Autofill"} src={"/icons8-redo-48.png"} style={{width:"24px", height:"24px"}} />
                            Redo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
