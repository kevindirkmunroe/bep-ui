import {StripeCheckoutResult, StripeSessionManager} from "./StripeSessionManager";
import {EventOrder} from "./EventOrder";
import {api} from "../../utils/api";
import {ServiceSelectionStatus} from "../../components/dashboard/events/payments/ServiceSelectionPage";

export class MockStripeSessionManager implements StripeSessionManager {
    async checkout(
        order: EventOrder
    ): Promise<StripeCheckoutResult> {

        // TODO: implement transaction rollback policy across stripe update + event_order update
        const result = await api.post(`/payments/stripe/checkout`, {eventOrder: order});

        // TODO: move EventOrder update to EventOrderManager...
        const orderUpdateBody = {
            promote_selection: order.promote_selection,
            payment_completed_at: new Date(),
            order_fulfilled_at: order.promote_selection === ServiceSelectionStatus.DIY ? new Date() : null
        }
        await api.put(`/orders/${order.order_id}`, orderUpdateBody);
        return result.data;
    }
}
