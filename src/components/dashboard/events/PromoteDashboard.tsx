import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { EventSummary } from "./EventSummary";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {EventDetail} from "./eventDetailTypes.interface";
import { useUser } from "../../../UserContext";
import {api} from "../../../utils/api";


export default function PromoteDashboard() {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [event, setEvent] = useState<EventDetail | null>(null);

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);
    };

    const [extensionInstalled, setExtensionInstalled] = useState(false);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setExtensionInstalled(false);
        }, 1000);

        const handler = (event: MessageEvent) => {
            if (event.data?.type === "LOCALBUZZ_PONG") {
                clearTimeout(timeout);
                setExtensionInstalled(true);
            }
        };
        window.addEventListener("message", handler);
        window.postMessage(
            {
                type: "LOCALBUZZ_PING"
            },
            "*"
        );
        return () => {
            window.removeEventListener("message", handler);
        };
    }, []);

    const updatePlatformStatus = (platform: string, status: string) => {
        setEvent(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                platforms: prev.platforms.map(p =>
                    p.platform === platform
                        ? { ...p, status }
                        : p
                )
            };
        });
    };

    if (!event || !event.platforms) return <div>Loading...</div>;

    window.postMessage(
        {
            type: "LOCALBUZZ_PING"
        },
        "*"
    );

    const { user } = useUser();
    const extensionUrl = import.meta.env.VITE_CHROME_WEB_STORE_EXTENSION_URL;
    console.log(`extensionUrl=${extensionUrl}`);
    const promoteMode = import.meta.env.VITE_PROMOTE_MODE;
    console.log(`promoteMode=${promoteMode}`);

    return (
        <div style={{ padding: 40}}>
            <div style={{fontSize: "12px", width: "100%", textAlign: "right"}}>
                {extensionInstalled ? "🟢 Extension OK" :
                    <>
                        <div>⚠️ Extension Not Installed</div>
                        <div><a href={extensionUrl} target="_blank">Install Extension</a>&nbsp;then
                            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                                Refresh to Connect Extension
                            </button>
                        </div>
                    </>
                }
            </div>
            <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "20px" }}>
                <div className="banner-div" style={{
                    width:"240px",
                    height: "100px",
                    objectFit: "cover",
                    objectPosition: "top",
                    fontWeight: 800,
                    fontSize: "30px",
                    borderRadius: "4px",
                    font: "bold",
                    color: "white",
                    display: "flex",
                    alignContent: "left",
                    alignItems: "center"
                }}>
                    &nbsp;Promote
                </div>
                <div style={{flex: 2, alignContent: "center", justifyContent: "center"}}>
                    <EventSummary event={event} readOnly={true} showRedo={false} showAsHeader={true} />
                </div>
                <div style={{flex: 1, marginBottom: 20, alignContent: "center", justifyContent: "center"}}>
                    <button className="btn btn-secondary" onClick={() => navigate(`/dashboard/${user?.userId}`)}>
                        Back To Events
                    </button>
                </div>
            </div>
            <ProgressBar platforms={event.platforms} />
            <PlatformList event={event} reload={loadEvent} updatePlatformStatus={updatePlatformStatus}/>
        </div>
    );
}
