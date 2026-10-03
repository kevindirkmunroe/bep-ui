import React, {useEffect, useState} from "react";
import { useUser } from "../../../UserContext";

import PromoteFulfillmentPanel from "../../dashboard/events/PromoteFulfillmentPanel";
import {ProgressBar} from "./platforms/ProgressBar";
import {PlatformList} from "./platforms/PlatformList";

import "../../admin/orderFulfillment.css";
import {EventDetail} from "./eventDetailTypes.interface";
import {Platform, PlatformStatus} from "./platforms/platformTypes.interface";
import {api} from "../../../utils/api";
import {Link, useParams} from "react-router-dom";
import {EventOrder} from "../../../workflows/payment/EventOrder";
import {ServiceSelectionStatus} from "./payments/ServiceSelectionPage";
import {isOlderThanToday} from "../../../utils/DateTime";
import {getEventStatusFromPlatforms} from "./EventStatus";

interface PromotedEventsPanelProps {
    setSelectedEvent: (newEvent: EventDetail) => void;
    selectedEvent: EventDetail;
    selectedEventOrder: EventOrder | null;
}

export default function PromotedEventsPanel({
                                                setSelectedEvent,
                                                selectedEvent,
                                                selectedEventOrder,
                                              }: PromotedEventsPanelProps) {

    const userContext = useUser();
    const userId = userContext.user?.userId;

    const [event, setEvent] =
        useState<EventDetail>(selectedEvent);

    const [eventOrder, setEventOrder] =
        useState<EventOrder|null>(selectedEventOrder);

    const [events, setEvents] =
        useState<EventDetail[]>([]);

    const loadEvents = async () => {
        try{
            const eventsRes = await api.get(`/users/${userId}/events`);
            const eventList = eventsRes.data.data;
            const activeEventsWithOrder = (eventList || []).filter((e: EventDetail) => {
                return getEventStatusFromPlatforms(e) !== "submitted" &&
                    !isOlderThanToday(e.start_datetime) &&
                    e.is_locked;
            });
            setEvents(activeEventsWithOrder);

        } catch (err: Error | any) {
            console.error("loadEvents failed", err);
        }
    };

    const loadEventOrder = async (clickedEvent: EventDetail) => {
        try{
            const orderRes = await api.get(`/orders/${clickedEvent.event_id}`);
            setEventOrder(orderRes.data);
        }catch(error){
            console.error(`[PromotedEventsPanel] error loading order for event ${clickedEvent.event_id}: ${error}`);
        }
    }

    const updatePlatformStatus = async (platform: Platform, status: PlatformStatus) => {
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

    useEffect(() => {
        if (!userId) return;
        loadEvents();

    }, [userId]);

    const handleLoadEvent = async () : Promise<void> => {
        const res = await api.get(`/events/${event.event_id}`);
        setEvent(res.data);
    }

    return (
        <div className="order-fulfillment-panel">

            {/* LEFT: Events */}
            <div className="fulfillment-orders-pane">
                <div>
                    {events.map(e => (
                        <div role={"button"}
                             key={e.event_id}
                             className={
                                 event?.event_id === e.event_id
                                     ? "fulfillment-order selected"
                                     : "fulfillment-order"
                             }
                             onClick={() => {
                                 setEvent(e);
                                 setSelectedEvent(e);
                                 loadEventOrder(e);
                                }
                             }
                        >
                            <div className="fulfillment-o rder-title" style={{display: 'flex', flexDirection: 'row', fontSize: '16px'}}>
                                <p style={{fontSize: '8px'}}>⚪️</p> &nbsp;{e?.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Selected Event */}

            <div className="fulfillment-platforms-pane">
                <div className="promote-panel-title" style={{width: '94%', padding: '8px', marginBottom: "8px", marginTop: "15px", borderRadius: "6px"}}>
                    <img src={!event.is_locked ? "/icons8-play-50.png" : "/icons8-megaphone-64.png"} style={{
                        width: "18px",
                        height: "18px"
                    }}/>{!event? "🔘️": ""}&nbsp;{event? event.title : <i>Select Event</i>}
                </div>
                {event && (
                    <>
                        {/* TODO: show in Admin/Debug mode */}
                        {/*<div className="fulfillment-order-number">*/}
                        {/*    Event ID: {event.event_id}<br/>*/}
                        {/*    Order ID: {eventOrder?.order_id}<br/>*/}
                        {/*    Event Date: {event.start_datetime}*/}
                        {/*</div>*/}
                        {/** DIY vs PRO display **/}
                        {eventOrder?.promote_selection === ServiceSelectionStatus.PRO && (
                                <>
                                    <PromoteFulfillmentPanel title={"PRO"}>
                                        <div style={{padding: "16px"}}>
                                            <h2>This Event currently being promoted by&nbsp;
                                                <b>Airhorn.</b><strong style={{color: "#D2492C"}}>events</strong> <b>PRO</b>
                                            </h2>
                                            <br/>
                                            <Link to={`promoted`}>
                                                View Results
                                            </Link>
                                        </div>
                                    </PromoteFulfillmentPanel>
                                </>
                        )}
                        {( eventOrder?.promote_selection === ServiceSelectionStatus.DIY ) && (
                            <>
                                <PromoteFulfillmentPanel title="DIY">
                                    <ProgressBar
                                        platforms={event.platforms}
                                    />

                                    <PlatformList
                                        extensionInstalled={true}
                                        event={event}
                                        reload={handleLoadEvent}
                                        updatePlatformStatus={updatePlatformStatus}
                                    />
                                </PromoteFulfillmentPanel>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
