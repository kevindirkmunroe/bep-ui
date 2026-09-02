import {StripeCheckoutResult, StripeSessionManager} from "./StripeSessionManager";
import {EventOrder} from "./EventOrder";
import {api} from "../../utils/api";
import {ServiceSelectionStatus} from "../../components/dashboard/events/payments/ServiceSelectionPage";

export class RealStripeSessionManager implements StripeSessionManager {
    async checkout(
        order: EventOrder
    ): Promise<StripeCheckoutResult> {

        // Real endpoint returns URL to Stripe payment page...
        const { data } = await api.post("/payments/stripe/checkout", order);

        console.log(`[Real Stripe] - fwd to URL=${data.url}`);
        window.location.href = data.url;

        // TODO: move EventOrder update to EventOrderManager...
        const orderUpdateBody = {
            promote_selection: order.promote_selection,
            payment_completed_at: new Date(),
            order_fulfilled_at: order.promote_selection === ServiceSelectionStatus.DIY ? new Date() : null
        }
        const result = await api.put(`/orders/${order.order_id}`, orderUpdateBody);
        return result.data;
    }
}
