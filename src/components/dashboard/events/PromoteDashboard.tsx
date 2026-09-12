import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";
import {EventDetail} from "./eventDetailTypes.interface";
import {useUser} from "../../../UserContext";
import {api} from "../../../utils/api";
import ImageCarousel from "../../ImageCarousel";
import {Platform, PlatformStatus} from "./platforms/platformTypes.interface";
import EventBreadcrumb from "./EventBreadcrumb";
import Modal from "../../Modal";
import ServiceSelectionPage, {ServiceSelectionStatus} from "./payments/ServiceSelectionPage";
import EventOrderPage from "./payments/EventOrderPage";
import {EventOrderManager} from "../../../workflows/payment/EventOrderManager";
import {EventOrder} from "../../../workflows/payment/EventOrder";
import PromoteFulfillmentPanel from "./PromoteFulfillmentPanel";
import {LiveStripeSessionManager} from "../../../workflows/payment/LiveStripeSessionManager";


export default function PromoteDashboard() {
    const { userId, eventId } = useParams();
    if (!eventId) {
        throw new Error("eventId is required");
    }

    const navigate = useNavigate();

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [eventOrder, setEventOrder] = useState<EventOrder | null>(null);

    const [showEventOrderModal, setShowEventOrderModal] = useState(false);
    const [showEventOrderSelectionModal, setShowEventOrderSelectionModal] = useState(false);

    const eventOrderManager = new EventOrderManager();

    useEffect(() => {
        loadEvent();
    }, [eventId]);

    const loadEvent = async () => {
        // get event...
        const res = await api.get(`/events/${eventId}`);
        setEvent(res.data);

        // get event order...
        const order = await eventOrderManager.getOrCreateEventOrder(eventId);
        setEventOrder(order);
        if(!order){
            return;
        }
        if(order.promote_selection === ServiceSelectionStatus.NO_SELECTION){
            setShowEventOrderSelectionModal(true);
        }else{
            setShowEventOrderModal(true);
        }
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

    const onCreateUpdateOrder = async (selection: ServiceSelectionStatus) => {
        if(!eventOrder){
            const newOrder = {
                promote_selection: selection,
                event_id: eventId,
                retry_count: 0
            }
            const result = await api.post(`/orders/create`, newOrder);
            setEventOrder(result.data as EventOrder);
        }else{
            // update order selection
            eventOrder.promote_selection = selection;
            await api.put(`/orders/${eventOrder.order_id}`, eventOrder);
        }

        setShowEventOrderSelectionModal(false);
        setShowEventOrderModal(true);
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

    const submittedPlatforms = event.platforms.filter(
        p => p.status === "submitted"
    );

    window.postMessage(
        {
            type: "LOCALBUZZ_PING"
        },
        "*"
    );

    const { user } = useUser();
    console.log(`[PromoteDashboard] user = ${JSON.stringify(user)}`);
    if(!user) return <div>Error retrieving User, please Login again.</div>

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
                            &nbsp;My Event / Promote
                        </div>
                    </div>

                    <div style={{display: "flex", flexDirection: "row", alignItems: "right"}}>
                        <div style={{flex: "0 0 80%"}}>
                            <EventBreadcrumb eventTitle={event.title}
                                             deliveryCount={submittedPlatforms.length}
                                             eventCount={user?.eventCount || 0}/>
                        </div>
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

                    {
                        user.isAdmin && (
                            <>
                                <div className="promote-panel-title">
                                    <img src={"/icons8-robot-48.png"} style={{ width: "18px", height: "18px"}}/>
                                    &nbsp;PRO&nbsp;
                                    <img src={"/icons8-worker-48.png"} style={{marginTop: "2px", width: "18px", height: "18px"}}/>
                                    &nbsp;Worker
                                </div>
                                <ProgressBar platforms={event.platforms}/>
                                <PlatformList
                                    extensionInstalled={extensionInstalled}
                                    event={event}
                                    reload={loadEvent}
                                    updatePlatformStatus={updatePlatformStatus}/>
                            </>
                        )
                    }
                    {
                        eventOrder?.promote_selection === ServiceSelectionStatus.PRO && !user.isAdmin &&
                        (
                            <>
                                <PromoteFulfillmentPanel title={"PRO"}>
                                    <div style={{padding: "16px"}}>
                                        <h2>This Event currently being promoted by&nbsp;
                                            <b>Airhorn.</b><strong style={{color: "#D2492C"}}>events</strong> <b>PRO</b>
                                        </h2>
                                        <br/>
                                        <Link to={`promoted`}>
                                            Check Progress
                                        </Link>
                                    </div>
                                </PromoteFulfillmentPanel>
                            </>
                        )
                    }
                    {( eventOrder?.promote_selection === ServiceSelectionStatus.DIY )&& (
                        <>
                            <PromoteFulfillmentPanel title={"DIY"}>
                                <ProgressBar platforms={event.platforms}/>
                                <PlatformList
                                    extensionInstalled={extensionInstalled}
                                    event={event}
                                    reload={loadEvent}
                                    updatePlatformStatus={updatePlatformStatus}/>
                            </PromoteFulfillmentPanel>
                        </>
                    )}

                    {showEventOrderSelectionModal && (
                        <Modal style={{width: "70%"}} onClose={() => setShowEventOrderSelectionModal(false)}>
                            <ServiceSelectionPage userId={user?.userId} event={event} onSelectService={onCreateUpdateOrder} />
                        </Modal>
                    )}
                    {showEventOrderModal && eventOrder && !eventOrder.payment_completed_at && (
                        <Modal style={{width: "70%"}} onClose={() => setShowEventOrderModal(false)}>
                            <EventOrderPage     eventOrder={eventOrder}
                                                eventOrderManager={eventOrderManager}
                                                stripeSessionManager={new LiveStripeSessionManager()}
                                                onPaymentComplete={() => {
                                                    setShowEventOrderModal(false);
                                                    setShowEventOrderSelectionModal(false);
                                                    }
                                                }
                                                onPaymentIncomplete={() =>  {
                                                        setShowEventOrderModal(false);
                                                        navigate(`/dashboard/${userId}/events`);
                                                    }
                                                }
                                                />
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
}
