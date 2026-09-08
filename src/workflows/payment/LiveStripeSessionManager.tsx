import { StripeSessionManager} from "./StripeSessionManager";
import {EventOrder} from "./EventOrder";
import {api} from "../../utils/api";

export class LiveStripeSessionManager implements StripeSessionManager {
    async checkout(
        order: EventOrder
    ): Promise<void> {

        // Real endpoint returns URL to Stripe payment page...
        const { data } = await api.post("/payments/stripe/checkout", order);

        console.log(`[Real Stripe] - fwd to URL=${data.url}`);
        window.location.href = data.url;
    }
}
