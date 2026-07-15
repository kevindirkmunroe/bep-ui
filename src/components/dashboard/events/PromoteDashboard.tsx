import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { EventSummary } from "./EventSummary";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {EventDetail} from "./eventDetailTypes.interface";
import { useUser } from "../../../UserContext";
import {api} from "../../../utils/api";
import ImageCarousel from "../../ImageCarousel";


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
    const [extensionVersion, setExtensionVersion] = useState("Unknown");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setExtensionInstalled(false);
        }, 1000);

        const handler = (event: MessageEvent) => {
            if (event.data?.type === "LOCALBUZZ_PONG") {
                clearTimeout(timeout);
                setExtensionInstalled(true);
                setExtensionVersion(event.data.version);
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

    return (
        <div style={{ display: "flex", gap: "2px" }}>
            {/* LEFT: Carousel */}
            <div style={{ flex: "0 0 300px" }}>
                <ImageCarousel />
            </div>
            {/* RIGHT: Existing content */}
            <div style={{ flex: 1 }}>
                <div style={{ paddingLeft: 40}}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "20px" }}>
                        <div className="banner-div" style={{
                            width:"100%",
                            height: "100px",
                            objectFit: "cover",
                            objectPosition: "top",
                            fontWeight: 800,
                            fontSize: "40px",
                            borderRadius: "4px",
                            font: "bold",
                            color: "white",
                            display: "flex",
                            alignContent: "left",
                            alignItems: "center"
                        }}>
                            &nbsp;Promote Event
                        </div>
                    </div>
                    <div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{flex: 2, border: "2px solid #ccc", borderRadius: "14px", boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)", marginRight:"30px", marginBottom: "26px" }}>
                                <EventSummary event={event} readOnly={true} showRedo={false} showAsHeader={true} />
                            </div>
                            <div style={{marginTop: "6px", marginRight: "5px"}}>
                                <button className="btn btn-secondary" onClick={() => navigate(`/dashboard/${user?.userId}`)}>
                                    Back To Events
                                </button>
                                <div style={{fontSize: "11px", width: "100%", textAlign: "right", marginTop: "32px"}}>
                                    {extensionInstalled ? "🟢 Extension OK | " + extensionVersion  :
                                        <div>
                                            <div>⚠️ Extension Not Installed</div>
                                            <div><a href={extensionUrl} target="_blank">Install Extension</a><br/>
                                                <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                                                    Refresh to Connect Extension
                                                </button>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProgressBar platforms={event.platforms}/>
                    <PlatformList
                        extensionInstalled={extensionInstalled}
                        event={event}
                        reload={loadEvent}
                        updatePlatformStatus={updatePlatformStatus}/>
                </div>
            </div>
        </div>
    );
}
