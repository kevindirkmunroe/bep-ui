import {useEffect, useState} from "react";
import { useUser } from "../../UserContext";

import PromoteFulfillmentPanel from "../dashboard/events/PromoteFulfillmentPanel";
import {ProgressBar} from "../dashboard/events/platforms/ProgressBar";
import {PlatformList} from "../dashboard/events/platforms/PlatformList";

import "./orderFulfillment.css";
import {ProOrder} from "./AdminPage";
import {api} from "../../utils/api";
import {EventDetail} from "../dashboard/events/eventDetailTypes.interface";
import {Platform, PlatformStatus} from "../dashboard/events/platforms/platformTypes.interface";

interface OrderFulfillmentPanelProps {
    orders: ProOrder[];
}

export default function OrderFulfillmentPanel({   orders,
                                              }: OrderFulfillmentPanelProps) {

    const userCtx = useUser();

    // Work starts with orders...
    const [selectedOrder, setSelectedOrder] =
        useState<ProOrder | null>(orders[0]);

    // Orders point to Events which Admin works on

    // Cache of order -> event
    const orderEventMap = new Map<string, EventDetail>();
    const fetchEvent = async (event_id: string): Promise<EventDetail> => {
        const cachedEvent = orderEventMap.get(event_id);

        if (cachedEvent) {
            return cachedEvent;
        }

        const { data } = await api.get<EventDetail>(
            `/events/${event_id}`
        );

        orderEventMap.set(event_id, data);

        return data;
    };
    const [event, setEvent] = useState<EventDetail | null>(null);

    if(selectedOrder === null){
        return (<h2>No Orders available to Fulfill</h2>)
    }

    const handleLoadEvent = async () : Promise<void> => {
        const res = await api.get(`/events/${selectedOrder.event_id}`);
        setEvent(res.data);
    }

    useEffect(() => {
        if (!selectedOrder) return;

        let cancelled = false;

        fetchEvent(selectedOrder.event_id).then(data => {
            if (!cancelled) setEvent(data);
        });

        return () => {
            cancelled = true;
        };
    }, [selectedOrder?.event_id]);

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

        // update audit log
        try{
            const worker_user_id = userCtx.user?.userId;
            const order_id = selectedOrder.order_id;

            const res = await api.put(`/admin/update-fulfillment-log`,
                {event_id:  selectedOrder.event_id, worker_user_id, order_id});

        }catch(error){
            console.error(error);
        }
    };

    return (
        <div className="order-fulfillment-panel">

            {/* LEFT: Orders */}
            <div className="fulfillment-orders-pane">
                <div>
                    {orders.map(order => (
                        <div role={"button"}
                             key={order.order_id}
                             className={
                                 selectedOrder?.order_id === order.order_id
                                     ? "fulfillment-order selected"
                                     : "fulfillment-order"
                             }
                             onClick={() =>
                                 setSelectedOrder(order)
                             }
                        >
                            <div className="fulfillment-o rder-title" style={{display: 'flex', flexDirection: 'row', fontSize: '16px'}}>
                                <p style={{fontSize: '8px'}}>{order.order_fulfilled_at ? "✅" : "🔴"}</p> &nbsp;{order.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Selected Order */}

            <div className="fulfillment-platforms-pane">
                <div className="promote-panel-title" style={{width: '94%', padding: '8px', borderRadius: "6px"}}>
                    {selectedOrder?.order_fulfilled_at ? "✅" : (!selectedOrder? "🔘️": "🔴")}&nbsp;{event? event.title : <i>Select Event</i>}
                </div>
                { event && !selectedOrder && (
                    <div className="no-order-selected">
                        Select Order
                    </div>
                )}
                {event && selectedOrder && (
                    <>
                    <div className="fulfillment-order-number">
                        Event ID: {selectedOrder.event_id}<br/>
                        Order ID: {selectedOrder.order_id}<br/>
                        Event Date: {event.start_datetime}
                    </div>
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
            </div>
        </div>
    );
}
