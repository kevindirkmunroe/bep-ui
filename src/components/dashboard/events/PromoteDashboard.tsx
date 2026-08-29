import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";

import {EventSummary} from "./EventSummary";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {EventDetail} from "./eventDetailTypes.interface";
import {useUser} from "../../../UserContext";
import {api} from "../../../utils/api";
import ImageCarousel from "../../ImageCarousel";
import {Platform, PlatformStatus} from "./platforms/platformTypes.interface";
import EventBreadcrumb from "./EventBreadcrumb";
import Modal from "../../Modal";
import ServiceSelectionPage, {ServiceSelectionStatus} from "./ServiceSelectionPage";


export default function PromoteDashboard() {
    const { eventId } = useParams();

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [showServiceSelection, setShowServiceSelection] = useState(true);
    const [promoteSelection, setPromoteSelection] = useState<ServiceSelectionStatus>(ServiceSelectionStatus.NO_SELECTION);

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

    //
    // Actions off of service selection:
    //
    // DIY - show ProgressBar + Platform list, User manually pushes event.
    // PRO - hide ProgressBar + Platform list, show PRO banner + Receipts link.
    // NO_SELECTION - popup ServiceSelectionPage modal, User chooses service.
    //
    const onSelectService = (selection: ServiceSelectionStatus) => {
        switch(selection){
            case ServiceSelectionStatus.DIY: {
                if(event){
                    setPromoteSelection(ServiceSelectionStatus.DIY);
                }
                break;
            }
            case ServiceSelectionStatus.PRO: {
                if(event){
                    setPromoteSelection(ServiceSelectionStatus.PRO);
                }
                break;
            }
            default: {
                if(event){
                    setPromoteSelection(ServiceSelectionStatus.NO_SELECTION);
                }
            }
        }
        setShowServiceSelection(false);
    }

    const updatePlatformStatus = (platform: Platform, status: PlatformStatus) => {
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
                <div style={{paddingLeft: 40}}>

                    <div style={{ width: "100%", display: "flex", flexDirection: "row", gap: "20px", marginBottom: "20px" }}>
                        <div className="banner-div" style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            objectPosition: "top",
                            fontWeight: 800,
                            fontSize: "34px",
                            borderRadius: "4px",
                            font: "bold",
                            color: "white",
                            display: "flex",
                            alignContent: "left",
                            alignItems: "center"
                        }}>
                            &nbsp;My Event &gt; Promote
                        </div>
                    </div>

                    <div style={{display: "flex", flexDirection: "row", alignItems: "right"}}>
                        <div style={{flex: "0 0 80%"}}><EventBreadcrumb eventTitle={event.title}/></div>
                        <div style={{fontSize: "11px", width: "100%", flex: "0 0 20%"}}>
                            {extensionInstalled ? "🟢 Extension OK | " + extensionVersion :
                                <div>
                                    <div>⚠️ Extension Not Installed</div>
                                    <div><a href={extensionUrl} target="_blank">Install Extension</a><br/>
                                        <button className="btn btn-secondary"
                                                onClick={() => window.location.reload()}>
                                            Refresh to Connect Extension
                                        </button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{
                                flex: 2,
                                border: "6px solid #E27C68",
                                borderRadius: "14px",
                                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)",
                                marginTop: "4px",
                                marginRight: "30px",
                                marginBottom: "26px"
                            }}>
                                <EventSummary event={event}
                                              readOnly={true}
                                              showRedo={false}
                                              showAsHeader={true}/>
                            </div>
                        </div>
                    </div>
                    { promoteSelection === ServiceSelectionStatus.PRO ?
                        (<div><h2>PRO MODE!</h2></div>)
                        :
                        (<>
                            <ProgressBar platforms={event.platforms}/>
                            <PlatformList
                                extensionInstalled={extensionInstalled}
                                event={event}
                                reload={loadEvent}
                                updatePlatformStatus={updatePlatformStatus}/>
                         </>)
                    }

                    <Link to={`/dashboard/${user?.userId}/events/${event?.event_id}/promoted`}>Receipts</Link>
                </div>

                {showServiceSelection && (promoteSelection === ServiceSelectionStatus.NO_SELECTION) && (
                    <Modal style={{width: "70%"}} onClose={() => setShowServiceSelection(false)}>
                        <ServiceSelectionPage userId={user?.userId} event={event} onSelectService={onSelectService} />
                    </Modal>
                )}

            </div>
        </div>
    );
}
