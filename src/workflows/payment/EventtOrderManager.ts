import { EventOrder, EventOrderPayload } from "./EventOrder";
import {api} from "../../utils/api";
import {ServiceSelectionStatus} from "../../components/dashboard/events/payments/ServiceSelectionPage";

export class EventOrderManager {

    async createEventOrder(po: EventOrderPayload): Promise<EventOrder> {
        const result = await api.post(`/orders/create`, po);
        return result.data;
    }

    async getOrCreateEventOrder(eventId: string): Promise<EventOrder |null>{
        try{
            const result = await api.get(`/orders/${eventId}`);
            if(result.status === 201) {
                return result.data;
            }

        }catch(err){
            console.log(`[EventOrderManager] - create order for eventId ${eventId}`);
            return await this.createEventOrder(
                {promote_selection:ServiceSelectionStatus.NO_SELECTION, event_id: eventId}
            );
        }
        return null;
    }

    getOrderCost(po: EventOrder): number {
        switch (po.promote_selection) {
            case "DIY":
                return 1995;

            case "PRO":
                return 2995;

            default:
                throw new Error(
                    `Invalid promote selection: ${po.promote_selection}`
                );
        }
    }
}
